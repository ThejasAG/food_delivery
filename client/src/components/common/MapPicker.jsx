import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Loader2 } from 'lucide-react';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapPicker = ({ 
  initialPosition = [12.9716, 77.5946], // Default to Bangalore
  onLocationSelect,
  placeholder = "Search for a location..."
}) => {
  // Use Bangalore as fallback if initialPosition is not valid
  const defaultPos = [12.9716, 77.5946];
  const [position, setPosition] = useState(initialPosition || defaultPos);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // Sync with initialPosition if it changes from parent
  useEffect(() => {
    if (initialPosition && initialPosition[0] && initialPosition[1]) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const reverseGeocode = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      const addr = {
        address_line: data.display_name,
        city: data.address.city || data.address.town || data.address.village || '',
        pincode: data.address.postcode || '',
        landmark: data.address.suburb || data.address.neighbourhood || '',
        latitude: lat,
        longitude: lng
      };
      
      onLocationSelect(addr);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude];
        setPosition(newPos);
        reverseGeocode(latitude, longitude);
        setLocating(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setLocating(false);
      }
    );
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, map.getZoom());
      }
    }, [center, map]);
    return null;
  };

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
      {(loading || locating) && (
        <div style={{ 
          position: 'absolute', zIndex: 1000, background: 'rgba(255,255,255,0.7)', 
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'
        }}>
          <Loader2 className="animate-spin" size={30} color="var(--primary)" />
          <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>
            {locating ? 'Searching GPS...' : 'Fetching Address...'}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGetCurrentLocation}
        style={{
          position: 'absolute', top: '10px', right: '100px', zIndex: 1000,
          background: 'white', border: 'none', padding: '10px', borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '13px'
        }}
      >
        <Crosshair size={16} color="var(--primary)" /> My Location
      </button>

      <MapContainer 
        center={position || defaultPos} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={position} />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapPicker;

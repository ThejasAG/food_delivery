import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  initialPosition = [51.505, -0.09], 
  onLocationSelect,
  placeholder = "Search for a location..."
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

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
      
      setAddress(addr);
      onLocationSelect(addr);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });

    return position === null ? null : (
      <Marker position={position} />
    );
  };

  const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {loading && (
        <div style={{ 
          position: 'absolute', zIndex: 1000, background: 'rgba(255,255,255,0.7)', 
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          Searching location...
        </div>
      )}
      <MapContainer 
        center={position} 
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

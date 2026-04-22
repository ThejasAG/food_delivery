import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Settings, MapPin, Clock, Navigation, Loader2, Save, CheckCircle2, AlertCircle, Home } from 'lucide-react';
import MapPicker from '../../components/common/MapPicker';

const AdminSettingsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [settings, setSettings] = useState({
    address_line: '',
    landmark: '',
    city: '',
    pincode: '',
    latitude: '',
    longitude: '',
    delivery_cutoff: '22:00',
    dine_in_takeaway_cutoff: '23:00',
    max_delivery_distance: 1.0
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants/');
      setRestaurants(response.data);
      if (response.data.length > 0) {
        setSelectedId(response.data[0].id);
        loadSettings(response.data[0]);
      }
    } catch (err) {
      setError('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = (res) => {
    setSettings({
      address_line: res.address_line || '',
      landmark: res.landmark || '',
      city: res.city || '',
      pincode: res.pincode || '',
      latitude: res.latitude || '',
      longitude: res.longitude || '',
      delivery_cutoff: res.delivery_cutoff || '22:00',
      dine_in_takeaway_cutoff: res.dine_in_takeaway_cutoff || '23:00',
      max_delivery_distance: res.max_delivery_distance || 1.0
    });
  };

  useEffect(() => {
    const res = restaurants.find(r => r.id === parseInt(selectedId));
    if (res) loadSettings(res);
  }, [selectedId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/admin/settings/${selectedId}`, settings);
      setSuccess('Settings updated successfully!');
      // Update local state
      setRestaurants(restaurants.map(r => r.id === parseInt(selectedId) ? { ...r, ...settings } : r));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Settings size={32} color="var(--primary)" /> Store Management Settings
        </h1>

        <div className="card" style={{ padding: '40px' }}>
          {error && (
            <div style={{ padding: '12px', background: '#FFEBEE', color: '#B71C1C', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {success && (
            <div style={{ padding: '12px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} /> {success}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Select Restaurant</label>
              <select 
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '30px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              <div>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                  <Home size={18} /> Restaurant Address
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <MapPicker 
                    initialPosition={settings.latitude ? [settings.latitude, settings.longitude] : undefined}
                    onLocationSelect={(loc) => setSettings({ ...settings, ...loc })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Address Line</label>
                    <input 
                      type="text"
                      value={settings.address_line} 
                      onChange={(e) => setSettings({ ...settings, address_line: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Landmark</label>
                    <input 
                      type="text"
                      value={settings.landmark} 
                      onChange={(e) => setSettings({ ...settings, landmark: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>City</label>
                    <input 
                      type="text"
                      value={settings.city} 
                      onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Pincode</label>
                    <input 
                      type="text"
                      value={settings.pincode} 
                      onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                  <Clock size={18} /> Cutoff Timings
                </h3>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Delivery Cutoff (24h)</label>
                  <input 
                    type="text" placeholder="HH:MM"
                    value={settings.delivery_cutoff} 
                    onChange={(e) => setSettings({ ...settings, delivery_cutoff: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Takeaway Cutoff (24h)</label>
                  <input 
                    type="text" placeholder="HH:MM"
                    value={settings.dine_in_takeaway_cutoff} 
                    onChange={(e) => setSettings({ ...settings, dine_in_takeaway_cutoff: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                <Navigation size={18} /> Service Radius
              </h3>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Max Delivery Distance (km)</label>
              <input 
                type="number" step="0.1"
                value={settings.max_delivery_distance} 
                onChange={(e) => setSettings({ ...settings, max_delivery_distance: parseFloat(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
            </div>

            <button disabled={saving} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Plus, Trash2, Pencil, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    image: '',
    description: '',
    rating: 4.5
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants/');
      setRestaurants(response.data);
    } catch (err) {
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingRestaurantId) {
        await api.put(`/admin/restaurants/${editingRestaurantId}`, formData);
        setSuccess('Restaurant updated successfully!');
      } else {
        await api.post('/admin/restaurants', formData);
        setSuccess('Restaurant added successfully!');
      }

      setFormData({
        name: '',
        cuisine: '',
        image: '',
        description: '',
        rating: 4.5
      });
      setEditingRestaurantId(null);
      fetchRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || (editingRestaurantId ? 'Failed to update restaurant' : 'Failed to add restaurant'));
    } finally {
      setBtnLoading(false);
    }
  };

  const handleStartEdit = (restaurant) => {
    setError('');
    setSuccess('');
    setEditingRestaurantId(restaurant.id);
    setFormData({
      name: restaurant.name || '',
      cuisine: restaurant.cuisine || '',
      image: restaurant.image || '',
      description: restaurant.description || '',
      rating: restaurant.rating ?? 4.5
    });
  };

  const handleCancelEdit = () => {
    setEditingRestaurantId(null);
    setFormData({
      name: '',
      cuisine: '',
      image: '',
      description: '',
      rating: 4.5
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant and all its menu items?')) return;

    setBtnLoading(true);
    setError('');
    try {
      await api.delete(`/admin/restaurants/${id}`);
      setSuccess('Restaurant deleted successfully!');
      fetchRestaurants();
    } catch (err) {
      setError('Failed to delete restaurant');
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '50px', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

        {/* Form Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: 1 }}>
          <div className="card" style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus /> {editingRestaurantId ? 'Edit Restaurant' : 'Add New Restaurant'}
            </h2>

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

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Restaurant Name</label>
                <input
                  type="text" required placeholder="e.g. Italian Bistro"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Cuisine</label>
                <input
                  type="text" required placeholder="e.g. Italian, Thai, Burgers"
                  value={formData.cuisine} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Image URL</label>
                <input
                  type="text" placeholder="https://..."
                  value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Description</label>
                <textarea
                  rows="3" placeholder="Tell us about the restaurant..."
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                ></textarea>
              </div>

              <button disabled={btnLoading} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                {btnLoading ? <Loader2 className="animate-spin" size={18} /> : (editingRestaurantId ? 'Update Restaurant' : 'Save Restaurant')}
              </button>

              {editingRestaurantId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{ width: '100%', marginTop: '10px', background: '#F0F2F5', color: '#1F2937', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel Editing
                </button>
              )}
            </form>
          </div>
        </motion.div>

        {/* List Section */}
        <div style={{ flex: 1.5 }}>
          <h2 style={{ marginBottom: '25px' }}>Current Restaurants ({restaurants.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {restaurants.map((res) => (
              <div key={res.id} className="card" style={{ padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={res.image || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ marginBottom: '2px' }}>{res.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{res.cuisine}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleStartEdit(res)} style={{ background: '#F0F2F5', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(res.id)} style={{ background: '#FFE5E5', color: '#D32F2F', border: 'none', padding: '8px', borderRadius: '6px' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ManageRestaurants;

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
  Pizza,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const ManageMenus = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [items, setItems] = useState([]); // This would ideally be for a selected restaurant
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    restaurant_id: '',
    name: '',
    price: '',
    description: '',
    category: 'Main Course',
    image: '',
    is_available: true,
    quantity_available: 10
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (formData.restaurant_id) {
      fetchMenuItems(formData.restaurant_id);
    } else {
      setItems([]);
    }
  }, [formData.restaurant_id]);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants/');
      setRestaurants(response.data);
    } catch (err) {
      setError('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (restaurantId) => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}`);
      setItems(response.data.menu);
    } catch (err) {
      setError('Failed to fetch menu items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/admin/menu', formData);
      setSuccess('Menu item added successfully!');
      setFormData({
        ...formData,
        name: '',
        price: '',
        description: '',
        image: '',
        is_available: true,
        quantity_available: 10
      });
      fetchMenuItems(formData.restaurant_id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add menu item');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    setBtnLoading(true);
    try {
      await api.delete(`/admin/menu/${itemId}`);
      setSuccess('Menu item deleted!');
      fetchMenuItems(formData.restaurant_id);
    } catch (err) {
      setError('Failed to delete item');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleUpdateItem = async (item, updates) => {
    try {
      await api.put(`/admin/menu/${item.id}`, updates);
      fetchMenuItems(formData.restaurant_id);
    } catch (err) {
      setError('Failed to update item');
    }
  };

  if (loading) return <div className="container" style={{ padding: '50px', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>

        {/* Add Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="card" style={{ padding: '40px' }}>
            <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.5rem' }}>
              <Pizza color="var(--primary)" /> Add Menu Item
            </h1>

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
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Select Restaurant</label>
                <select
                  required
                  value={formData.restaurant_id}
                  onChange={(e) => setFormData({ ...formData, restaurant_id: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                >
                  <option value="">-- Choose a Restaurant --</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Dish Name</label>
                  <input
                    type="text" required placeholder="e.g. Pepperoni Pizza"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Price ($)</label>
                  <input
                    type="number" step="0.01" required placeholder="0.00"
                    value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                >
                  <option value="Starters">Starters</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Description</label>
                <textarea
                  rows="3" required placeholder="Describe the ingredients..."
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                ></textarea>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Image URL</label>
                <input
                  type="text" placeholder="https://..."
                  value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Initial Stock</label>
                  <input
                    type="number"
                    value={formData.quantity_available} onChange={(e) => setFormData({ ...formData, quantity_available: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '30px' }}>
                  <input
                    type="checkbox" id="is_available"
                    checked={formData.is_available} onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  />
                  <label htmlFor="is_available" style={{ fontSize: '14px', fontWeight: 600 }}>Available for Order</label>
                </div>
              </div>

              <button disabled={btnLoading} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                {btnLoading ? <Loader2 className="animate-spin" size={20} /> : 'Add to Menu'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* List Section */}
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: '25px' }}>
            {formData.restaurant_id
              ? `Current Menu (${items.length})`
              : 'Select a restaurant to see menu'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {items.map((item) => (
              <div key={item.id} className="card" style={{ padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={item.image || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ marginBottom: '2px' }}>{item.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 600 }}>${parseFloat(item.price).toFixed(2)}</p>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
                      <input 
                        type="number" 
                        value={item.quantity_available} 
                        onChange={(e) => handleUpdateItem(item, { quantity_available: parseInt(e.target.value) })}
                        style={{ width: '50px', padding: '2px 5px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
                      />
                      <span style={{ fontSize: '12px' }}>in stock</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleUpdateItem(item, { is_available: !item.is_available })}
                    style={{ 
                      background: item.is_available ? '#E8F5E9' : '#FFF3E0', 
                      color: item.is_available ? '#2E7D32' : '#E65100', 
                      border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' 
                    }}
                  >
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: '#FFE5E5', color: '#D32F2F', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
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

export default ManageMenus;


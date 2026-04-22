import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { Star, Clock, Plus, Check } from 'lucide-react';

const RestaurantPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState({}); // To show checkmark animation
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item.id);
      setAddedItems(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [item.id]: false }));
      }, 2000);
    } catch (error) {
      alert('Must be logged in to add items to cart!');
    }
  };

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading menu...</div>;
  if (!data) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Restaurant not found</div>;

  const { restaurant, menu } = data;

  return (
    <div className="restaurant-page">
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{restaurant.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontWeight: 600 }}>
                <Star size={18} fill="currentColor" />
                <span>{restaurant.rating} (500+ ratings)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={18} />
                <span>25-30 min</span>
              </div>
              <span>•</span>
              <span>{restaurant.cuisine}</span>
            </div>
            <p style={{ marginTop: '15px', maxWidth: '600px' }}>{restaurant.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="container" style={{ padding: '60px 0' }}>
        <h2 style={{ marginBottom: '40px' }}>Full Menu</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '800px' }}>
          {menu.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card" 
              style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '5px' }}>{item.name}</h3>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '10px' }}>
                  ${parseFloat(item.price).toFixed(2)}
                </span>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '100%' }}>
                  {item.description}
                </p>
              </div>

              <div style={{ width: '120px', height: '120px', position: 'relative', marginLeft: '20px' }}>
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=120'} 
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                />
                <button 
                  disabled={!item.is_available || item.quantity_available <= 0}
                  onClick={() => handleAddToCart(item)}
                  style={{ 
                    position: 'absolute', 
                    bottom: '-10px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    backgroundColor: (!item.is_available || item.quantity_available <= 0) 
                                      ? '#eee' 
                                      : (addedItems[item.id] ? '#4CAF50' : 'white'),
                    color: (!item.is_available || item.quantity_available <= 0) 
                            ? '#888' 
                            : (addedItems[item.id] ? 'white' : 'var(--primary)'),
                    border: addedItems[item.id] ? 'none' : '1px solid var(--border)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    cursor: (!item.is_available || item.quantity_available <= 0) ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {(!item.is_available || item.quantity_available <= 0) ? (
                    'Out of Stock'
                  ) : (
                    <>
                      {addedItems[item.id] ? <Check size={16} /> : <Plus size={16} />}
                      {addedItems[item.id] ? 'Added' : 'Add'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;

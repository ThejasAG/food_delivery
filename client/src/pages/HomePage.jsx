import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FoodCard from '../components/common/FoodCard';
import { Search, SlidersHorizontal, Utensils, ShoppingBag, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { orderType, setOrderType } = useOrder();
  const { clearCart, cartItems } = useCart();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleOrderTypeChange = (type) => {
    if (type === orderType) return;
    setOrderType(type);
  };

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants/');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = (restaurants || []).filter(r =>
    (r.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.cuisine?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3.5rem', marginBottom: '20px' }}
        >
          Hungry? We’ve got you.
        </motion.h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
          Order from the best restaurants near you.
        </p>

        {/* Order Type Selection */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          {[
            { id: 'Takeaway', icon: ShoppingBag, label: 'Takeaway' },
            { id: 'Delivery', icon: Truck, label: 'Delivery' }
          ].map((type) => {
            const Icon = type.icon;
            const active = orderType === type.id;
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOrderTypeChange(type.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '15px 25px',
                  background: active ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '15px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '120px'
                }}
              >
                <Icon size={24} style={{ marginBottom: '8px' }} />
                <span style={{ fontWeight: 600 }}>{type.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '18px 20px 18px 55px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '16px',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      </section>

      {/* Restaurant List Section */}
      <section className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem' }}>Popular Restaurants</h2>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            fontWeight: 500
          }}>
            <SlidersHorizontal size={18} />
            Filter
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading best flavors for you...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {filteredRestaurants.map((res, index) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <FoodCard restaurant={res} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredRestaurants.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
            No restaurants found matching "{searchTerm}"
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

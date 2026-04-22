import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Package, ChevronRight, CheckCircle, Truck, Clock, Utensils } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/history');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={18} color="#FFA500" />;
      case 'Preparing': return <Utensils size={18} color="#2196F3" />;
      case 'Out for Delivery': return <Truck size={18} color="#9C27B0" />;
      case 'Delivered': return <CheckCircle size={18} color="#4CAF50" />;
      default: return <Package size={18} />;
    }
  };

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading your history...</div>;

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>My Orders</h1>
        <p style={{ color: 'var(--text-muted)' }}>{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Package size={64} style={{ color: 'var(--border)', marginBottom: '20px' }} />
          <h3>No orders yet</h3>
          <p style={{ marginTop: '10px' }}>Your delicious journey starts here!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order, index) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
              style={{ padding: '25px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Order #{order.id}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  backgroundColor: '#F0F2F5', 
                  padding: '6px 15px', 
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-main)' }}>{item.quantity}x Dish Item</span> {/* Ideally we'd join item name here */}
                    <span style={{ fontWeight: 500 }}>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                
                <div style={{ borderTop: '1px dashed var(--border)', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Total Paid</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${order.total_price.toFixed(2)}</span>
                </div>
              </div>

              <button style={{ 
                marginTop: '20px', 
                background: 'none', 
                color: 'var(--primary)', 
                fontSize: '14px', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                Help & Support <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

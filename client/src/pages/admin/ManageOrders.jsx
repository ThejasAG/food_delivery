import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  RefreshCcw,
  ChevronDown,
  CheckCircle2,
  Clock,
  Truck,
  Utensils,
  AlertCircle,
  Loader2
} from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // Track which order is updating
  const [success, setSuccess] = useState('');
  const [prepTimes, setPrepTimes] = useState({}); // Local state for input fields

  const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load global orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError('');
    setSuccess('');
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      // Update local state to reflect change immediately
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      setError('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrepTimeUpdate = async (orderId) => {
    const minutes = prepTimes[orderId];
    if (!minutes) return;

    setUpdatingId(orderId);
    setError('');
    try {
      await api.put(`/admin/orders/${orderId}/prep-time`, { prep_minutes: minutes });
      setSuccess('Preparation time updated!');
      fetchOrders(); 
    } catch (err) {
      setError('Failed to update preparation time');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={16} color="#FFA500" />;
      case 'Preparing': return <Utensils size={16} color="#2196F3" />;
      case 'Out for Delivery': return <Truck size={16} color="#9C27B0" />;
      case 'Delivered': return <CheckCircle2 size={16} color="#4CAF50" />;
      default: return <ClipboardList size={16} />;
    }
  };

  if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>Global Order Desk</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all incoming and active orders</p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer' }}>
          <RefreshCcw size={18} /> Refresh
        </button>
      </div>

      {success && (
        <div style={{ padding: '15px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {success}
        </div>
      )}

      {error && (
        <div style={{ padding: '15px', background: '#FFEBEE', color: '#B71C1C', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8F9FA', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '20px' }}>Order ID</th>
              <th style={{ padding: '20px' }}>Date</th>
              <th style={{ padding: '20px' }}>Total Amount</th>
              <th style={{ padding: '20px' }}>Type</th>
              <th style={{ padding: '20px' }}>Current Status</th>
              <th style={{ padding: '20px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '20px', fontWeight: 600 }}>#{order.id}</td>
                <td style={{ padding: '20px', color: 'var(--text-muted)' }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '20px', fontWeight: 600 }}>₹{parseFloat(order.total_price).toFixed(2)}</td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    background: order.order_type === 'Delivery' ? '#E3F2FD' : order.order_type === 'Takeaway' ? '#F3E5F5' : '#F5F5F5',
                    color: order.order_type === 'Delivery' ? '#1976D2' : order.order_type === 'Takeaway' ? '#7B1FA2' : '#757575'
                  }}>
                    {order.order_type || 'Unknown'}
                  </span>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ position: 'relative' }}>
                    {updatingId === order.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <Loader2 className="animate-spin" size={16} /> Updating...
                      </div>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          background: 'white',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                    
                    {order.order_type === 'Takeaway' && (
                      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                        <input 
                          type="number"
                          placeholder="Min"
                          value={prepTimes[order.id] || ''}
                          onChange={(e) => setPrepTimes({ ...prepTimes, [order.id]: e.target.value })}
                          style={{ width: '50px', padding: '5px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px' }}
                        />
                        <button 
                          onClick={() => handlePrepTimeUpdate(order.id)}
                          disabled={updatingId === order.id}
                          style={{ padding: '5px 10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Set Prep
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders found in the system.
          </div>
        )}
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ManageOrders;

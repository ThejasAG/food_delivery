import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, CheckCircle2, MapPin, Plus } from 'lucide-react';
import MapPicker from '../components/common/MapPicker';

const CartPage = () => {
  const { cartItems, totalAmount, removeFromCart, clearCart } = useCart();
  const { orderType, selectedAddress, setSelectedAddress } = useOrder();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line: '',
    landmark: '',
    city: '',
    pincode: '',
    latitude: null,
    longitude: null
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (orderType === 'Delivery') {
      fetchAddresses();
    }
  }, [orderType]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/address/');
      setAddresses(response.data);
      if (response.data.length > 0 && !selectedAddress) {
        setSelectedAddress(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.latitude || !newAddress.longitude) {
      alert("Please select a location on the map first!");
      return;
    }
    try {
      const response = await api.post('/address/', newAddress);
      setAddresses([...addresses, response.data.address]);
      setSelectedAddress(response.data.address);
      setNewAddress({
        address_line: '',
        landmark: '',
        city: '',
        pincode: '',
        latitude: null,
        longitude: null
      });
      setShowAddressForm(false);
    } catch (error) {
      alert('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const restaurantId = cartItems[0]?.item_details?.restaurant_id;
      const orderData = {
        restaurant_id: restaurantId,
        order_type: orderType,
        address_id: orderType === 'Delivery' ? selectedAddress?.id : null,
        items: cartItems.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity
        }))
      };

      await api.post('/orders/place', orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      const message = error?.response?.data?.message || 'Failed to place order. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle2 size={80} color="#4CAF50" style={{ marginBottom: '20px' }} />
          <h1 style={{ marginBottom: '10px' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Your delicious food is being prepared.</p>
          <button className="btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <ShoppingBag size={64} style={{ color: 'var(--border)', marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '10px' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <h1 style={{ marginBottom: '40px', fontSize: '2.5rem' }}>My Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
        {/* Items List */}
        <div>
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="card"
                style={{ display: 'flex', alignItems: 'center', padding: '20px', marginBottom: '20px' }}
              >
                <img
                  src={item.item_details.image || 'https://via.placeholder.com/80'}
                  alt={item.item_details.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                />
                <div style={{ flex: 1, marginLeft: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{item.item_details.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Quantity: {item.quantity}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 600, marginBottom: '10px' }}>
                    ${(parseFloat(item.item_details.price) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.item_id)}
                    style={{ background: 'none', color: '#FF4D4D', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary & Address */}
        <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
          {orderType === 'Delivery' && (
            <div className="card" style={{ padding: '25px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="var(--primary)" /> Delivery Address
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {addresses.map(addr => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: selectedAddress?.id === addr.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      background: selectedAddress?.id === addr.id ? 'rgba(var(--primary-rgb), 0.05)' : 'white'
                    }}
                  >
                    {addr.address_line}
                  </div>
                ))}
                
                {showAddressForm ? (
                  <form onSubmit={handleAddAddress} style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <MapPicker 
                        onLocationSelect={(loc) => setNewAddress({ ...newAddress, ...loc })}
                      />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Address Line</label>
                        <input 
                          type="text" required placeholder="e.g. 123 Street Name"
                          value={newAddress.address_line}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Landmark</label>
                        <input 
                          type="text" placeholder="Optional"
                          value={newAddress.landmark}
                          onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>City</label>
                        <input 
                          type="text" required placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--text-muted)' }}>Pincode</label>
                        <input 
                          type="text" required placeholder="Pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn-primary" style={{ padding: '8px 15px', fontSize: '14px' }}>Save Address</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} style={{ background: 'none', border: 'none', color: '#666' }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px dashed var(--border)', 
                      padding: '10px', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '5px' 
                    }}
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="card" style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Order Summary</h2>
            <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
              Order Type: {orderType}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Delivery Fee</span>
              <span>{orderType === 'Delivery' ? '$2.50' : '$0.00'}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', margin: '20px 0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>
                ${(totalAmount + (orderType === 'Delivery' ? 2.50 : 0)).toFixed(2)}
              </span>
            </div>

            <button
              disabled={loading}
              onClick={handlePlaceOrder}
              className="btn-primary"
              style={{ width: '100%', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading ? 'Processing...' : (
                <>
                  Place Order <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

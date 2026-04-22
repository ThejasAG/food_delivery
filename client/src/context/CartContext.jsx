import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setTotalAmount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart/');
      setCartItems(response.data.items);
      setTotalAmount(response.data.total_price);
      
      const count = response.data.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    try {
      await api.post('/cart/add', { item_id: itemId, quantity });
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCartItems([]);
      setCartCount(0);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      cartItems, 
      totalAmount, 
      addToCart, 
      removeFromCart, 
      clearCart,
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

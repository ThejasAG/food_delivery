import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderType, setOrderType] = useState(() => {
    return localStorage.getItem('orderType') || 'Delivery';
  });
  
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = localStorage.getItem('selectedAddress');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('orderType', orderType);
  }, [orderType]);

  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    } else {
      localStorage.removeItem('selectedAddress');
    }
  }, [selectedAddress]);

  const changeOrderType = (type) => {
    if (type !== orderType) {
      setOrderType(type);
      // Reset address if not delivery
      if (type !== 'Delivery') {
        setSelectedAddress(null);
      }
      return true; // Indicates type changed
    }
    return false;
  };

  return (
    <OrderContext.Provider value={{ 
      orderType, 
      setOrderType: changeOrderType, 
      selectedAddress, 
      setSelectedAddress 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);

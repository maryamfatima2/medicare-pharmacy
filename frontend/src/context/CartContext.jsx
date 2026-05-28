import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import API from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('cartItems');
    return localData ? JSON.parse(localData) : [];
  });

  // Load cart from DB on login
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const { data } = await API.get('/cart');
          if (data.items && data.items.length > 0) {
            const formattedItems = data.items.map(item => ({
              ...item.medicine,
              quantity: item.quantity
            }));
            setCartItems(formattedItems);
          }
        } catch (error) {
          console.error('Error fetching cart', error);
        }
      }
    };
    fetchCart();
  }, [user]);

  // Sync cart to DB and LocalStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    const syncWithDB = async () => {
      if (user) {
        try {
          await API.post('/cart', {
            items: cartItems.map(item => ({
              medicine: item._id,
              quantity: item.quantity
            }))
          });
        } catch (error) {
          console.error('Error syncing cart', error);
        }
      }
    };

    const timeoutId = setTimeout(syncWithDB, 1000); // Debounce sync
    return () => clearTimeout(timeoutId);
  }, [cartItems, user]);

  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...existItem, quantity: existItem.quantity + qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: qty }]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  const updateQuantity = (id, qty) => {
    setCartItems(
      cartItems.map((x) => (x._id === id ? { ...x, quantity: Number(qty) } : x))
    );
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      try {
        await API.delete('/cart');
      } catch (error) {
        console.error('Error clearing cart', error);
      }
    }
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemsCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

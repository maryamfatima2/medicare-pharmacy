import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/auth/profile');
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist', error);
    }
  };

  const toggleWishlist = async (medicineId) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }

    try {
      const { data } = await API.put(`/auth/wishlist/${medicineId}`);
      setWishlist(data);
      const isAdded = data.some(item => (typeof item === 'string' ? item === medicineId : item._id === medicineId));
      toast.success(isAdded ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (error) {
      toast.error('Wishlist action failed');
    }
  };

  const isInWishlist = (medicineId) => {
    return wishlist.some(item => (typeof item === 'string' ? item === medicineId : item._id === medicineId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

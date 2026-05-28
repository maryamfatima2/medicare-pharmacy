import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearAuth = useCallback(() => {
    setUser(null);
    localStorage.removeItem('userInfo');
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        setLoading(false);
        return;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(userInfo);
      } catch (error) {
        localStorage.removeItem('userInfo');
        setLoading(false);
        return;
      }

      if (!parsedUser?.token) {
        clearAuth();
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get('/auth/profile');
        setUser({ ...data, token: parsedUser.token });
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();

    const handleLogoutEvent = () => {
      clearAuth();
      navigate('/login', { replace: true });
    };

    const handleStorageEvent = (event) => {
      if (event.key === 'userInfo' && !event.newValue) {
        clearAuth();
      }
    };

    window.addEventListener('userLogout', handleLogoutEvent);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('userLogout', handleLogoutEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [clearAuth, navigate]);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      const persistedUser = { ...data };
      setUser(persistedUser);
      localStorage.setItem('userInfo', JSON.stringify(persistedUser));
      toast.success('Login Successful!');
      if (persistedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

      return persistedUser;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password, phone });
      const persistedUser = { ...data };
      setUser(persistedUser);
      localStorage.setItem('userInfo', JSON.stringify(persistedUser));
      toast.success('Registration Successful!');
      navigate('/', { replace: true });
      return persistedUser;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = useCallback(() => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  }, [clearAuth, navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

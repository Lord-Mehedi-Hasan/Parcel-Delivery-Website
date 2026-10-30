import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fastparcel_token') || null);
  const [loading, setLoading] = useState(true);

  // Load current user profile if token exists
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('fastparcel_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Session expired or invalid:', err.message);
          localStorage.removeItem('fastparcel_token');
          localStorage.removeItem('fastparcel_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('fastparcel_token', token);
        localStorage.setItem('fastparcel_user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        return { success: true, user };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('fastparcel_token', token);
        localStorage.setItem('fastparcel_user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        return { success: true, user };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const quickLogin = async (role) => {
    let email = 'customer@gmail.com';
    let password = 'customer123';

    if (role === 'admin') {
      email = 'admin@fastparcel.com';
      password = 'admin123';
    } else if (role === 'driver') {
      email = 'driver1@fastparcel.com';
      password = 'driver123';
    }

    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('fastparcel_token');
    localStorage.removeItem('fastparcel_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fastparcel_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        quickLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

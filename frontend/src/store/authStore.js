import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Set up default axios authorization header if token exists in localStorage
const initialToken = localStorage.getItem('token');
if (initialToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export const useAuthStore = create((set) => ({
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      set({
        user: userData,
        token: access_token,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Login failed. Incorrect email or password.';
      set({ error: errMsg, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    set({ loading: true });
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      set({
        user: response.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // Token is invalid/expired
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

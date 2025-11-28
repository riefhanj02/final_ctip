// Admin API Service
import axios from 'axios';
import { config } from '../config/config';
import { getAccessToken } from './authService';

const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all plant sightings (admin view)
export const getAllSightings = async () => {
  try {
    // Adjust endpoint based on your API structure
    const response = await api.get('/plants/all');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching sightings:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch sightings',
    };
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await api.get('/admin/stats/users');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch user statistics',
    };
  }
};

// Get plant statistics
export const getPlantStats = async () => {
  try {
    const response = await api.get('/admin/stats/plants');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching plant stats:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch plant statistics',
    };
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch users',
    };
  }
};

// Delete a plant sighting
export const deleteSighting = async (sightingId) => {
  try {
    const response = await api.delete(`/plants/${sightingId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting sighting:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to delete sighting',
    };
  }
};

export default api;


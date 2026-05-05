import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// We will set the authorization header dynamically from our components
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // With Clerk, redirects are handled by their components
    }
    return Promise.reject(error);
  }
);

export default api;

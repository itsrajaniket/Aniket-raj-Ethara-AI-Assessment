import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// We will set this from the layout once
let isInterceptorSet = false;

export const injectTokenFetcher = (fetcher: () => Promise<string | null>) => {
  if (isInterceptorSet) return;
  
  api.interceptors.request.use(async (config) => {
    const token = await fetcher();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  isInterceptorSet = true;
};

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Session expired or invalid');
    }
    return Promise.reject(error);
  }
);

export default api;

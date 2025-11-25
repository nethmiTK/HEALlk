// Backend configuration with fallback handling
const API_BASE_URL = 'http://localhost:5000/api';

// Check if backend is available
const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${API_BASE_URL}/products`, { 
      method: 'GET',
      signal: controller.signal
    });
    return response.status !== 0;
  } catch {
    return false;
  }
};

export { API_BASE_URL, checkBackendHealth };

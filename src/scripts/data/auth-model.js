import { ENDPOINTS } from './api';
import { ACCESS_TOKEN_KEY } from '../config';

/**
 * Utility: Handle API response
 */
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server');
  }
  return data;
}

/**
 * Register a new user
 */
export async function registerUser(name, email, password) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  return await handleResponse(response);
}

/**
 * Login user and store access token
 */
export async function loginUser(email, password) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  const token = data?.loginResult?.token;
  if (!token) {
    throw new Error('Token tidak ditemukan dalam respons login');
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  return data;
}

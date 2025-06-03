import { VAPID_PUBLIC_KEY } from '../config';
import { ENDPOINTS } from './api';
import Swal from 'sweetalert2';

/**
 * Utility: Convert base64 string to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Utility: Encode subscription key
 */
function encodeKey(key) {
  return btoa(String.fromCharCode(...new Uint8Array(key)));
}

/**
 * Utility: Fetch wrapper with authorization
 */
async function fetchWithAuth(url, method, token, body) {
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  return response;
}

/**
 * Subscribe user to push notifications
 */
export async function subscribeToNotifications(token) {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: encodeKey(subscription.getKey('p256dh')),
        auth: encodeKey(subscription.getKey('auth')),
      },
    };

    await fetchWithAuth(ENDPOINTS.SUBSCRIBE, 'POST', token, payload);

    Swal.fire('Berhasil!', 'Notifikasi berhasil diaktifkan.', 'success');
  } catch (error) {
    Swal.fire('Gagal!', `Terjadi kesalahan: ${error.message}`, 'error');
  }
}

/**
 * Unsubscribe user from push notifications
 */
export async function unsubscribeFromNotifications(token) {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      Swal.fire('Info', 'Kamu belum berlangganan notifikasi.', 'info');
      return;
    }

    const endpoint = subscription.endpoint;

    const isUnsubscribed = await subscription.unsubscribe();
    if (!isUnsubscribed) {
      throw new Error('Gagal unsubscribe dari service worker.');
    }

    await fetchWithAuth(ENDPOINTS.SUBSCRIBE, 'DELETE', token, { endpoint });

    Swal.fire('Berhasil!', 'Notifikasi berhasil dimatikan.', 'success');
  } catch (error) {
    Swal.fire('Gagal!', `Terjadi kesalahan: ${error.message}`, 'error');
  }
}

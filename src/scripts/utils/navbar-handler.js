import Swal from 'sweetalert2';
import { subscribeToNotifications, unsubscribeFromNotifications } from '../data/subs-model';

export default async function updateNavbar() {
  const navList = document.getElementById('nav-list');
  const token = localStorage.getItem('authToken');

  navList.innerHTML = '';

  let isSubscribed = false;

  if (token) {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    isSubscribed = !!existingSubscription;

    navList.innerHTML = `
      <li><a href="#/" class=""><i class="fas fa-home"></i> Home</a></li>
      <li><a href="#/favorite"><i class="fas fa-star"></i> Favorite Story</a></li>
      <li>
        <button id="add-story-button" class="add-story-btn">
          <i class="fas fa-plus"></i> Add Story
        </button>
      </li>
      <li>
        <button id="subscribe-button" class="subscribe-btn">
          <i class="fas ${isSubscribed ? 'fa-bell-slash' : 'fa-bell'}"></i>
          ${isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      </li>
      <li>
        <button id="logout-button" class="logout-btn">
          <i class="fas fa-right-from-bracket"></i> Logout
        </button>
      </li>
    `;
  } else {
    navList.innerHTML = `
      <li><a href="#/login" class=""><i class="fas fa-sign-in-alt"></i> Login</a></li>
      <li><a href="#/register" class=""><i class="fas fa-user-plus"></i> Register</a></li>
    `;
  }

  const logoutBtn = document.getElementById('logout-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Swal.fire({
        title: 'Yakin ingin logout?',
        text: 'Kamu akan keluar dari sesi saat ini.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya, logout',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('authToken');
          window.location.hash = '/login';
          updateNavbar();
          Swal.fire('Berhasil Logout', 'Kamu telah keluar.', 'success');
        }
      });
    });
  }

  const addStoryBtn = document.getElementById('add-story-button');
  if (addStoryBtn) {
    addStoryBtn.addEventListener('click', () => {
      window.location.hash = '/new';
    });
  }

  const subscribeBtn = document.getElementById('subscribe-button');
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', async () => {
      const originalContent = subscribeBtn.innerHTML;
      subscribeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;
      subscribeBtn.disabled = true;

      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
          await unsubscribeFromNotifications(token);
        } else {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await subscribeToNotifications(token);
          } else {
            Swal.fire('Izin Ditolak', 'Kamu perlu memberikan izin notifikasi.', 'info');
          }
        }

        await updateNavbar();
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
        subscribeBtn.innerHTML = originalContent;
        subscribeBtn.disabled = false;
      }
    });
  }

  highlightActiveMenu();
}

function highlightActiveMenu() {
  const currentPath = window.location.hash || '#/';
  const navLinks = document.querySelectorAll('#nav-list a');

  navLinks.forEach((link) => {
    link.classList.remove('active-nav-link');
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active-nav-link');
    }
  });
}

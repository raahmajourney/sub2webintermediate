// CSS imports
import '../styles/styles.css';
import '../styles/home.css';
import '../styles/detail.css';
import '../styles/add-story.css';
import '../styles/404.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import App from './pages/app';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const mainContent = document.querySelector('#main-content'); 
  const skipLink = document.querySelector('.skip-link'); 

  if (mainContent && skipLink) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      skipLink.blur(); 

      mainContent.focus(); 
      mainContent.scrollIntoView();
    });
  }

  await app.renderPage();
  await registerServiceWorker();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

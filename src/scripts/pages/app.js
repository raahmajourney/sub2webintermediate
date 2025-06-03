import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { isAuthenticated, protectedRoutes } from '../utils/auth';
import updateNavbar from '../utils/navbar-handler';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();

    if (protectedRoutes.includes(url) && !isAuthenticated()) {
      window.location.hash = '/login';
      return;
    }

    const page = routes[url] || routes['*'];

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
        updateNavbar();
      });
    } else {
      await this.#content.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 600,
        easing: 'ease-in-out',
        fill: 'forwards',
      }).finished;

      this.#content.innerHTML = await page.render();
      await page.afterRender();

      await this.#content.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 600,
        easing: 'ease-in-out',
        fill: 'forwards',
      }).finished;

      updateNavbar();
    }
  }
}

export default App;

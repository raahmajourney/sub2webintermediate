import FavoritePresenter from './favorite-presenter';
import Lottie from 'lottie-web';

class FavoriteView {
  async render() {
    return `
      <div class="jumbotron">
        <h1>Daftar Favorit</h1>
        <div style="max-width: 300px; margin: auto;">
          <div id="lottieFavorite" style="width:100%; height: 300px; border: none; overflow: hidden;"></div>
        </div>
        <p>Cerita-cerita yang kamu sukai akan tampil di sini!</p>
      </div>

      <div id="favoriteList" class="container">
        <p>Memuat daftar favorite...</p>
      </div>
    `;
  }

  async afterRender() {
    await FavoritePresenter.showFavorites();
    this.loadLottieAnimation();
  }

  loadLottieAnimation() {
    const lottieFavoriteElement = document.getElementById('lottieFavorite');
    if (lottieFavoriteElement) {
      fetch('json/star.json')
        .then((response) => response.json())
        .then((jsonData) => {
          Lottie.loadAnimation({
            container: lottieFavoriteElement,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: jsonData,
          });
        })
        .catch((error) => {
          console.error('Gagal memuat animasi Lottie:', error);
        });
    }
  }
}

export default FavoriteView;

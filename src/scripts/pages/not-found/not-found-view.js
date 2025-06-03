import Lottie from 'lottie-web';

class NotFoundView {
  async render() {
    return `
      <div class="container-404" style="text-align: center; padding: 20px;">
        <div id="lottieNotFound" style="max-width: 500px; margin: auto; height: 400px;"></div>
        <p>Sorry, the page you're looking for doesn't exist.</p>
      </div>
    `;
  }

  async afterRender() {
    this.loadLottieAnimation();
  }

  loadLottieAnimation() {
    const lottieNotFoundElement = document.getElementById('lottieNotFound');
    if (lottieNotFoundElement) {
      fetch('json/404.json')
        .then((response) => response.json())
        .then((jsonData) => {
          Lottie.loadAnimation({
            container: lottieNotFoundElement,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: jsonData,
          });
        })
        .catch((error) => {
          console.error('Gagal memuat animasi Lottie 404:', error);
        });
    }
  }
}

export default NotFoundView;

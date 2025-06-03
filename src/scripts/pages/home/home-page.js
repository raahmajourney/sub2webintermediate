import Lottie from 'lottie-web';
import HomePresenter from './home-presenter';

export default class HomePage {
  async render() {
    return `
      <div class="jumbotron">
        <h1>Welcome to Story App</h1>
        <div style="max-width: 300px; margin: auto;">
          <div id="lottieAnimation" style="width:100%; height: 300px; border: none; overflow: hidden;"></div>
        </div>
        <p>Temukan cerita menarik dari pengguna lain!</p>
      </div>

      <div class="container">
        <div id="storyList">
          <div class="home-spinner"></div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('authToken');
    const storyListElement = document.getElementById('storyList');

    if (!token) {
      storyListElement.innerHTML = '<p>Token tidak ditemukan. Silakan login.</p>';
      return;
    }

    // 🔹 Tampilkan story
    const storyResult = await HomePresenter.getStories(token);
    if (storyResult.status === 'error') {
      storyListElement.innerHTML = `<p>Error: ${storyResult.message}</p>`;
    } else if (storyResult.stories.length === 0) {
      storyListElement.innerHTML = '<p>Tidak ada story yang ditemukan.</p>';
    } else {
      this.renderStories(storyResult.stories);
    }

    // 🔹 Tampilkan animasi Lottie
    const lottieResult = await HomePresenter.getLottieAnimation();
    if (lottieResult.status === 'success') {
      this.renderLottie(lottieResult.animationData);
    } else {
      console.error('Lottie error:', lottieResult.message);
    }
  }

  renderLottie(animationData) {
    const container = document.getElementById('lottieAnimation');
    if (container) {
      Lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
      });
    }
  }

  renderStories(stories) {
    const storyListElement = document.getElementById('storyList');
    storyListElement.innerHTML = `
      <div class="story-grid">
        ${stories
          .map((story) => `
            <div class="story-card">
              <img src="${story.photoUrl}" alt="${story.name}" />
              <div class="story-content">
                <h3>${story.name}</h3>
                <p class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
                <div class="story-description-container">
                  <p class="story-description">${story.description}</p>
                </div>
                <button class="detail-button" data-story-id="${story.id}">
                  <i class="fas fa-info-circle"></i> Detail
                </button>
              </div>
            </div>
          `)
          .join('')}
      </div>
    `;

    this.setupListeners();
  }

  setupListeners() {
    document.querySelectorAll('.detail-button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-story-id');
        window.location.href = `#/stories/${id}`;
      });
    });

    document.querySelectorAll('.story-description-container').forEach((container) => {
      const desc = container.querySelector('.story-description');
      if (desc.scrollHeight > desc.clientHeight) {
        container.classList.add('has-overflow');
      }

      if (!desc.textContent.endsWith(' ')) {
        desc.textContent += ' ';
      }
    });
  }
}

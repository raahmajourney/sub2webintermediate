import FavoriteDB from "../../data/favorite-db";

const FavoritePresenter = {
  async showFavorites() {
    const favoriteListElement = document.getElementById('favoriteList');

    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      const stories = await FavoriteDB.getAllStories();

      if (!stories || stories.length === 0) {
        favoriteListElement.innerHTML = '<p>Belum ada story yang disimpan.</p>';
        return;
      }

      favoriteListElement.innerHTML = `
        <div class="story-grid">
          ${stories
            .map(
              (story) => `
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
            `,
            )
            .join('')}
        </div>
      `;

      const descriptionContainers = document.querySelectorAll('.story-description-container');
      descriptionContainers.forEach((container) => {
        const description = container.querySelector('.story-description');

        if (description.scrollHeight > description.clientHeight) {
          container.classList.add('has-overflow');
        }

        if (description.textContent.length > 0) {
          const lastChar = description.textContent[description.textContent.length - 1];
          if (lastChar !== ' ') {
            description.textContent += ' ';
          }
        }
      });

      const detailButtons = document.querySelectorAll('.detail-button');
      detailButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          const storyId = e.currentTarget.getAttribute('data-story-id');
          window.location.href = `#/stories/${storyId}`;
        });
      });
    } catch (error) {
      favoriteListElement.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  },
};

export default FavoritePresenter;

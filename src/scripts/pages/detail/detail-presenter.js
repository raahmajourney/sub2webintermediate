import { getDetailStory } from '../../data/story-model';
import FavoriteDB from '../../data/favorite-db';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DetailPresenter = {
  async showDetail(id, token) {
    const container = document.getElementById('storyDetail');
    if (!container) return;

    try {
      const { error, message, story } = await getDetailStory(id, token);
      if (error || !story) {
        container.innerHTML = this._renderError(message);
        return;
      }

      const createdDate = this._formatDate(story.createdAt);
      const isFavorite = await FavoriteDB.getStory(story.id);

      container.innerHTML = this._renderDetailHTML(story, createdDate, isFavorite);

      this._setupFavoriteToggle(story, isFavorite);
      if (story.lat && story.lon) {
        setTimeout(() => this._initMap(story.lat, story.lon, story.name), 100);
      }

    } catch (err) {
      container.innerHTML = this._renderError(err.message);
    }
  },

  _renderError(msg) {
    return `
      <div class="error-container">
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <p>Error saat memuat detail: ${msg}</p>
        </div>
      </div>
    `;
  },

  _formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  _renderDetailHTML(story, createdDate, isFavorite) {
    return `
      <div class="story-detail-card">
        <div class="story-image-container">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
          <button id="favoriteToggleBtn" class="favorite-toggle-button">
            <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
          </button>
        </div>

        <div class="story-detail-info">
          <h2 class="story-title">${story.name}</h2>

          <div class="story-description">
            <p>${story.description}</p>
          </div>

          <div class="story-metadata">
            <div class="metadata-item">
              <i class="far fa-calendar-alt"></i>
              <span>${createdDate}</span>
            </div>

            ${story.user?.name ? `
              <div class="metadata-item">
                <i class="far fa-user"></i>
                <span>Oleh: ${story.user.name}</span>
              </div>
            ` : ''}
          </div>

          ${story.lat && story.lon ? this._renderLocationSection(story) : ''}
        </div>
      </div>
    `;
  },

  _renderLocationSection(story) {
    return `
      <div class="location-section">
        <h3>Lokasi</h3>
        <div class="location-coords">
          <div class="coord-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Latitude: ${story.lat}</span>
          </div>
          <div class="coord-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Longitude: ${story.lon}</span>
          </div>
        </div>
        <div id="map" class="location-map"></div>
      </div>
    `;
  },

  _setupFavoriteToggle(story, isFavorite) {
    const button = document.getElementById('favoriteToggleBtn');
    if (!button) return;

    button.addEventListener('click', async () => {
      const currentlyFavorite = await FavoriteDB.getStory(story.id);

      if (currentlyFavorite) {
        await FavoriteDB.deleteStory(story.id);
      } else {
        await FavoriteDB.addStory(story);
      }

      const icon = button.querySelector('i');
      icon.className = currentlyFavorite ? 'far fa-star' : 'fas fa-star';
    });
  },

  _initMap(lat, lon, title) {
    const map = L.map('map').setView([lat, lon], 13);

    const tileLayers = {
      OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
      Terrain: L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Terrain',
      }),
      Satellite: L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Satellite',
      }),
    };

    tileLayers.OpenStreetMap.addTo(map);
    L.control.layers(tileLayers).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map);
    if (title) marker.bindPopup(`<b>${title}</b>`).openPopup();

    setTimeout(() => map.invalidateSize(), 100);
  },
};

export default DetailPresenter;

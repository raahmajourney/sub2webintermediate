import { getDetailStory } from '../../data/story-model';
import FavoriteDB from '../../data/favorite-db';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DetailPresenter = {
  async showDetail(id, token) {
    const detailContainer = document.getElementById('storyDetail');
    let map = null;

    try {
      const { error, message, story } = await getDetailStory(id, token);

      if (error || !story) {
        detailContainer.innerHTML = `
          <div class="error-container">
            <div class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              <p>Error saat memuat detail: ${message}</p>
            </div>
          </div>
        `;
        return;
      }

      const createdDate = new Date(story.createdAt).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const isFavorite = await FavoriteDB.getStory(story.id);

      detailContainer.innerHTML = `
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
              
              ${
                story.user?.name
                  ? `
                <div class="metadata-item">
                  <i class="far fa-user"></i>
                  <span>Oleh: ${story.user.name}</span>
                </div>
              `
                  : ''
              }
            </div>

            ${
              story.lat && story.lon
                ? `
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
            `
                : ''
            }
          </div>
        </div>
      `;

      const favoriteToggleBtn = document.getElementById('favoriteToggleBtn');
      favoriteToggleBtn.addEventListener('click', async () => {
        const currentFavorite = await FavoriteDB.getStory(story.id);

        if (currentFavorite) {
          await FavoriteDB.deleteStory(story.id);
        } else {
          await FavoriteDB.addStory(story);
        }

        const icon = favoriteToggleBtn.querySelector('i');
        icon.className = currentFavorite ? 'far fa-star' : 'fas fa-star';
      });

      if (story.lat && story.lon) {
        setTimeout(() => {
          this._initMap(story.lat, story.lon, story.name);
        }, 100);
      }
    } catch (error) {
      detailContainer.innerHTML = `
        <div class="error-container">
          <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error saat memuat detail: ${error.message}</p>
          </div>
        </div>
      `;
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  },

  _initMap(lat, lon, title) {
    const map = L.map('map').setView([lat, lon], 13);

    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    });

    const satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Satellite',
    });

    const terrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Terrain',
    });

    const baseMaps = {
      OpenStreetMap: openStreetMap,
      Terrain: terrain,
      Satellite: satellite,
    };

    openStreetMap.addTo(map);

    L.control.layers(baseMaps).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map);
    if (title) {
      marker.bindPopup(`<b>${title}</b>`).openPopup();
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return map;
  },
};

export default DetailPresenter;

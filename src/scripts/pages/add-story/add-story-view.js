import { AddStoryPresenter } from './add-story-presenter';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { addStoryComponents } from './add-story-components';

export default class AddStoryView {
  async render() {
    return addStoryComponents;
  }

  async afterRender() {
    // Elements
    const $ = (id) => document.getElementById(id);
    const descriptionInput = $('description');
    const photoInput = $('photo');
    const photoPreview = $('photoPreview');
    const removePhotoBtn = $('removePhotoBtn');
    const submitButton = $('submitButton');
    const messageElement = $('message');
    const submitSpinner = $('submitSpinner');
    const buttonText = submitButton.querySelector('.button-text');
    const selectedLocationElement = $('selectedLocation');
    const clearLocationBtn = $('clearLocationBtn');
    const cameraInterface = $('cameraInterface');
    const cameraFeed = $('cameraFeed');
    const captureBtn = $('captureBtn');
    const openCameraBtn = $('openCameraBtn');
    const closeCameraBtn = $('closeCameraBtn');

    let capturedPhoto = null;
    let stream = null;
    let marker = null;

    const presenter = new AddStoryPresenter({
      showSuccess: (msg) => {
        hideSpinner();
        showMessage(msg, 'green');
        resetForm();
        setTimeout(() => (window.location.hash = '/'), 1500);
      },
      showError: (msg) => {
        hideSpinner();
        showMessage(msg, 'red');
      },
      updateValidation: updateFieldValidation,
      updateButtonState: (isEnabled) => {
        submitButton.disabled = !isEnabled;
      },
      updateLocationDisplay: (lat, lon) => {
        selectedLocationElement.textContent = lat && lon
          ? `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`
          : 'No location selected';
      },
    });

    function showMessage(msg, color) {
      messageElement.textContent = msg;
      messageElement.style.color = color;
    }

    function resetForm() {
      descriptionInput.value = '';
      photoInput.value = '';
      photoPreview.style.display = 'none';
      removePhotoBtn.style.display = 'none';
      capturedPhoto = null;
      presenter.clearLocation();
    }

    function showSpinner() {
      submitSpinner.style.display = 'inline-block';
      buttonText.style.display = 'none';
      submitButton.disabled = true;
    }

    function hideSpinner() {
      submitSpinner.style.display = 'none';
      buttonText.style.display = 'inline-block';
    }

    function updateFieldValidation(field, isValid, message) {
      const validationEl = $(`${field}Validation`);
      if (validationEl) {
        validationEl.textContent = message;
        validationEl.style.color = isValid ? 'green' : 'red';
        if (field !== 'photo') {
          const inputEl = $(field);
          inputEl.classList.toggle('invalid', !isValid);
          inputEl.classList.toggle('valid', isValid);
        }
      }
    }

    function showPhotoPreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
        photoPreview.style.display = 'block';
        removePhotoBtn.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }

    function isMobile() {
      return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    async function openCamera() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!devices.some((d) => d.kind === 'videoinput')) {
          presenter.showError('No camera device found.');
          return;
        }

        const constraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            ...(isMobile() && { facingMode: 'environment' }),
          },
        };

        stream = await navigator.mediaDevices.getUserMedia({ ...constraints, audio: false });
        cameraFeed.srcObject = stream;
        cameraInterface.style.display = 'block';
      } catch (err) {
        handleCameraError(err);
      }
    }

    function closeCamera() {
      stream?.getTracks().forEach((t) => t.stop());
      stream = null;
      cameraInterface.style.display = 'none';
    }

    function handleCameraError(error) {
      console.error('Camera error:', error);
      const errorMap = {
        NotAllowedError: 'Camera access was denied. Please enable permissions.',
        NotFoundError: 'No camera device found.',
        NotReadableError: 'Camera is in use by another app.',
        OverconstrainedError: 'Camera constraints not satisfied.',
      };
      presenter.showError(errorMap[error.name] || 'Camera access failed.');
    }

    function capturePhoto() {
      const canvas = document.createElement('canvas');
      canvas.width = cameraFeed.videoWidth;
      canvas.height = cameraFeed.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraFeed, 0, 0);

      canvas.toBlob((blob) => {
        capturedPhoto = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        showPhotoPreview(capturedPhoto);
        presenter.validatePhoto(capturedPhoto);
        closeCamera();
      }, 'image/jpeg', 0.9);
    }

    function setupMap() {
      const map = L.map('map').setView([0, 0], 2);
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

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => map.setView([coords.latitude, coords.longitude], 13),
          (err) => console.warn('Geolocation error:', err)
        );
      }

      map.on('click', ({ latlng }) => {
        if (marker) map.removeLayer(marker);
        marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
        presenter.updateLocation(latlng.lat, latlng.lng);
      });

      clearLocationBtn.addEventListener('click', () => {
        if (marker) {
          map.removeLayer(marker);
          marker = null;
        }
        presenter.clearLocation();
      });
    }

    function bindEvents() {
      openCameraBtn.addEventListener('click', openCamera);
      closeCameraBtn.addEventListener('click', closeCamera);
      captureBtn.addEventListener('click', capturePhoto);

      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          capturedPhoto = null;
          showPhotoPreview(file);
          presenter.validatePhoto(file);
        }
      });

      removePhotoBtn.addEventListener('click', () => {
        photoPreview.style.display = 'none';
        removePhotoBtn.style.display = 'none';
        photoInput.value = '';
        capturedPhoto = null;
        presenter.validatePhoto(null);
      });

      descriptionInput.addEventListener('input', () => {
        presenter.validateDescription(descriptionInput.value);
      });

      submitButton.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
        const photo = capturedPhoto || photoInput.files[0];
        showSpinner();
        presenter.onSubmitClicked(description, photo);
      });
    }

    setupMap();
    bindEvents();

    // Clean up camera on leave
    return () => stream?.getTracks().forEach((track) => track.stop());
  }
}

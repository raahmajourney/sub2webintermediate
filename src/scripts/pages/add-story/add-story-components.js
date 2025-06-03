export const addStoryComponents = `
  <section class="container add-story-container">
    <h1>Add New Story</h1>

    <div class="form-group">
      <label for="description">Story Description</label>
      <textarea id="description" class="form-input-desc" placeholder="Write your story..."></textarea>
      <small class="validation-message" id="descriptionValidation"></small>
    </div>

    <div class="form-group">
      <label>Photo</label>
      <div class="photo-input-controls">
        <div class="input-buttons">
          <button type="button" id="openCameraBtn" class="btn btn-secondary">
            <i class="fas fa-camera"></i> Take Photo
          </button>
          <label for="photo" class="btn btn-secondary">
            <i class="fas fa-image"></i> Browse Gallery
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            class="form-input file-input"
            style="display: none;"
          />
        </div>
        <small class="validation-message" id="photoValidation"></small>
      </div>

      <!-- Camera capture UI -->
      <div id="cameraInterface" class="camera-interface" style="display: none;">
        <video id="cameraFeed" autoplay playsinline></video>
        <div class="camera-controls">
          <button id="captureBtn" class="btn btn-primary">
            <i class="fas fa-circle"></i> Capture
          </button>
          <button id="closeCameraBtn" class="btn btn-secondary">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>

      <div class="photo-preview-container">
        <img id="photoPreview" class="photo-preview" style="display: none;" />
        <button id="removePhotoBtn" class="btn btn-danger remove-photo" style="display: none;">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Location (Optional)</label>
      <div id="map" style="height: 300px; width: 100%; margin-bottom: 10px;"></div>
      <div class="location-controls">
        <div class="coordinates">
          <span id="selectedLocation">No location selected</span>
        </div>
        <button type="button" id="clearLocationBtn" class="btn btn-secondary">
          Clear Location
        </button>
      </div>
    </div>

    <p id="message" class="message"></p>

    <button id="submitButton" class="btn" disabled>
      <span class="button-text">Post Story</span>
      <div class="spinner" id="submitSpinner"></div>
    </button>
  </section>
`;

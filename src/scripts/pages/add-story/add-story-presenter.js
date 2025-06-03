import { addStory } from '../../data/story-model';

export class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.validations = {
      description: false,
      photo: false,
    };
    this.locationSelected = false;
    this.coordinates = {
      lat: null,
      lon: null,
    };
  }

  validateDescription(description) {
    const isValid = description.trim().length > 0;
    this.validations.description = isValid;
    this.view.updateValidation(
      'description',
      isValid,
      isValid ? 'Description provided' : 'Description is required',
    );
    this.updateButtonState();
  }

  validatePhoto(photo) {
    if (!photo) {
      this.validations.photo = false;
      this.view.updateValidation('photo', false, 'Photo is required');
      this.updateButtonState();
      return;
    }

    const fileSize = photo.size / 1024 / 1024;
    const isValidSize = fileSize <= 1;
    const isValidType = photo.type.startsWith('image/');
    const isValid = isValidSize && isValidType;

    this.validations.photo = isValid;

    let message = 'Valid photo';
    if (!isValidType) {
      message = 'Please select a valid image file';
    } else if (!isValidSize) {
      message = 'Photo size should not exceed 1MB';
    }

    this.view.updateValidation('photo', isValid, message);
    this.updateButtonState();
  }

  updateLocation(lat, lon) {
    this.coordinates = { lat, lon };
    this.locationSelected = true;
    this.view.updateLocationDisplay(lat, lon);
  }

  clearLocation() {
    this.coordinates = { lat: null, lon: null };
    this.locationSelected = false;
    this.view.updateLocationDisplay(null, null);
  }

  updateButtonState() {
    const isFormValid = Object.values(this.validations).every((valid) => valid);
    this.view.updateButtonState(isFormValid);
  }

  async onSubmitClicked(description, photo) {
    try {
      this.validateDescription(description);
      this.validatePhoto(photo);

      if (!Object.values(this.validations).every((valid) => valid)) {
        this.view.showError('Please fix all validation errors');
        return;
      }

      const storyData = {
        description,
        photo,
        lat: this.coordinates.lat,
        lon: this.coordinates.lon,
      };

      await addStory(storyData);
      this.view.showSuccess('Story added successfully!');
    } catch (error) {
      this.view.showError(error.message || 'Failed to add story');
    }
  }
}

import { registerUser } from '../../../data/auth-model';

export class RegisterPresenter {
  constructor(view) {
    this.view = view;
    this.validations = {
      name: false,
      email: false,
      password: false,
    };
  }

  validateName(name) {
    const isValid = name.length >= 3;
    this.validations.name = isValid;
    this.view.updateValidation(
      'name',
      isValid,
      isValid ? 'Valid name' : 'Name must be at least 3 characters',
    );
    this.updateButtonState();
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    this.validations.email = isValid;
    this.view.updateValidation(
      'email',
      isValid,
      isValid ? 'Valid email' : 'Please enter a valid email address',
    );
    this.updateButtonState();
  }

  validatePassword(password) {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    const isValid = hasMinLength && hasNumber && hasLetter;
    this.validations.password = isValid;

    let message = '';
    if (!hasMinLength) message = 'Password must be at least 8 characters';
    else if (!hasNumber) message = 'Password must contain at least one number';
    else if (!hasLetter) message = 'Password must contain at least one letter';
    else message = 'Valid password';

    this.view.updateValidation('password', isValid, message);
    this.updateButtonState();
  }

  updateButtonState() {
    const isFormValid = Object.values(this.validations).every((valid) => valid);
    this.view.updateButtonState(isFormValid);
  }

  async onRegisterClicked(name, email, password) {
    try {
      this.validateName(name);
      this.validateEmail(email);
      this.validatePassword(password);

      if (!Object.values(this.validations).every((valid) => valid)) {
        this.view.showError('Please fix all validation errors');
        return;
      }

      await registerUser(name, email, password);
      this.view.showSuccess('Register successful!');
    } catch (error) {
      this.view.showError(error.message || 'Register failed');
    }
  }
}

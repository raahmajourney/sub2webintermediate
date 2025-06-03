import { loginUser } from '../../../data/auth-model';

export class LoginPresenter {
  constructor(view) {
    this.view = view;
    this.validations = {
      email: false,
      password: false,
    };
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    this.validations.email = isValid;
    this.view.updateValidation(
      'email',
      isValid,
      isValid ? 'Valid email format' : 'Please enter a valid email address',
    );
    this.updateButtonState();
  }

  validatePassword(password) {
    const isValid = password.length > 0;
    this.validations.password = isValid;
    this.view.updateValidation(
      'password',
      isValid,
      isValid ? 'Password entered' : 'Password is required',
    );
    this.updateButtonState();
  }

  updateButtonState() {
    const isFormValid = Object.values(this.validations).every((valid) => valid);
    this.view.updateButtonState(isFormValid);
  }

  async onLoginClicked(email, password) {
    try {
      this.validateEmail(email);
      this.validatePassword(password);

      if (!Object.values(this.validations).every((valid) => valid)) {
        this.view.showError('Please fix all validation errors');
        return;
      }

      await loginUser(email, password);
      this.view.showSuccess('Login successful!');
    } catch (error) {
      this.view.showError(error.message || 'Login failed');
    }
  }
}

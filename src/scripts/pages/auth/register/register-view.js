import { RegisterPresenter } from './register-presenter';
import '../../../../styles/auth.css';

export default class RegisterView {
  async render() {
    return `
      <section class="container">
        <h1>Register</h1>
        <div class="form-group">
          <input id="name" type="text" placeholder="Name" class="form-input" />
          <small class="validation-message" id="nameValidation"></small>
        </div>
        <div class="form-group">
          <input id="email" type="email" placeholder="Email" class="form-input" />
          <small class="validation-message" id="emailValidation"></small>
        </div>
        <div class="form-group">
          <input
            id="password"
            type="password"
            placeholder="Password"
            class="form-input"
          />
          <small class="validation-message" id="passwordValidation"></small>
        </div>
        <p id="message"></p>
        <button id="registerButton" class="btn" disabled>
          <span class="button-text">Register</span>
          <div class="spinner" id="registerSpinner"></div>
        </button>
        <div class="auth-link">
          <p>Already have an account? <a href="#/login">Login here</a></p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageElement = document.getElementById('message');
    const registerButton = document.getElementById('registerButton');
    const registerSpinner = document.getElementById('registerSpinner');
    const buttonText = registerButton.querySelector('.button-text');

    const showSpinner = () => {
      registerSpinner.style.display = 'inline-block';
      buttonText.style.display = 'none';
      registerButton.disabled = true;
    };

    const hideSpinner = () => {
      registerSpinner.style.display = 'none';
      buttonText.style.display = 'inline-block';
      registerButton.disabled = false;
    };

    const presenter = new RegisterPresenter({
      showError: (msg) => {
        hideSpinner();
        messageElement.style.color = 'red';
        messageElement.textContent = msg;
      },
      showSuccess: (msg) => {
        hideSpinner();
        messageElement.style.color = 'green';
        messageElement.textContent = msg;

        setTimeout(() => {
          window.location.hash = '/login';
        }, 1000);
      },
      updateValidation: (field, isValid, message) => {
        const validationElement = document.getElementById(`${field}Validation`);
        if (validationElement) {
          validationElement.textContent = message;
          validationElement.style.color = isValid ? 'green' : 'red';

          const input = document.getElementById(field);
          if (input) {
            input.classList.toggle('invalid', !isValid);
            input.classList.toggle('valid', isValid);
          }
        }
      },
      updateButtonState: (isEnabled) => {
        registerButton.disabled = !isEnabled;
      },
    });

    nameInput.addEventListener('input', () => {
      presenter.validateName(nameInput.value.trim());
    });

    emailInput.addEventListener('input', () => {
      presenter.validateEmail(emailInput.value.trim());
    });

    passwordInput.addEventListener('input', () => {
      presenter.validatePassword(passwordInput.value.trim());
    });

    registerButton.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      showSpinner();
      presenter.onRegisterClicked(name, email, password);
    });
  }
}

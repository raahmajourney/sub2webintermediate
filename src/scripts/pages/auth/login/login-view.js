import { LoginPresenter } from './login-presenter';
import '../../../../styles/auth.css';

export default class LoginView {
  async render() {
    return `
    <section class="container">
      <h1>Login</h1>
    
      <div class="form-group">
        <input id="email" type="email" placeholder="Email" class="form-input" />
        <small class="validation-message" id="emailValidation"></small>
      </div>
    
      <div class="form-group">
        <input id="password" type="password" placeholder="Password" class="form-input" />
        <small class="validation-message" id="passwordValidation"></small>
      </div>
      <p id="message"></p>
      <button id="loginButton" class="btn" disabled>
        <span class="button-text">Login</span>
        <div class="spinner" id="loginSpinner"></div>
      </button>
      <div class="auth-link">
        <p>Don't have an account? <a href="#/register">Register here</a></p>
      </div>
    </section>
    `;
  }

  async afterRender() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const messageElement = document.getElementById('message');
    const loginSpinner = document.getElementById('loginSpinner');
    const buttonText = loginButton.querySelector('.button-text');

    const showSpinner = () => {
      loginSpinner.style.display = 'inline-block';
      buttonText.style.display = 'none';
      loginButton.disabled = true;
    };

    const hideSpinner = () => {
      loginSpinner.style.display = 'none';
      buttonText.style.display = 'inline-block';
      loginButton.disabled = false;
    };

    const presenter = new LoginPresenter({
      showSuccess: (msg) => {
        hideSpinner();
        messageElement.style.color = 'green';
        messageElement.textContent = msg;

        setTimeout(() => {
          window.location.hash = '/';
        }, 0);
      },
      showError: (msg) => {
        hideSpinner();
        messageElement.style.color = 'red';
        messageElement.textContent = msg;
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
        loginButton.disabled = !isEnabled;
      },
    });

    emailInput.addEventListener('input', () => {
      presenter.validateEmail(emailInput.value.trim());
    });

    passwordInput.addEventListener('input', () => {
      presenter.validatePassword(passwordInput.value.trim());
    });

    loginButton.addEventListener('click', () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      showSpinner();
      presenter.onLoginClicked(email, password);
    });
  }
}

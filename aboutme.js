/**
 * @fileoverview About Me page logic for profile fetching and JWT display.
 */

const logoutBtn = document.getElementById('logout-btn');
const refreshBtn = document.getElementById('refresh-domains-btn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('jwt');
    window.open('index.html', '_self');
  });
}

if (refreshBtn) {
  refreshBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fetchProfile();
  });
}

/**
 * Sets up the event listener for the copy to clipboard button.
 */
function setupCopyButton() {
  const copyBtn = document.getElementById('copy-jwt-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt && navigator.clipboard) {
        const originalText = copyBtn.textContent;
        navigator.clipboard.writeText(jwt).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }).catch((err) => {
          console.error('Failed to copy JWT: ', err);
        });
      }
    });
  }
}

/**
 * Fetches the user profile from the API and displays it.
 * @return {Promise<void>}
 */
async function fetchProfile() {
  const jwt = localStorage.getItem('jwt');
  const errorEl = document.getElementById('profile-error');

  if (!jwt) {
    window.open('index.html', '_self');
    return;
  }

  displayJWT(jwt);

  try {
    const response = await fetch('http://localhost:3000/profile', {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (response.ok) {
      const profile = await response.json();
      document.getElementById('profile-id').textContent = profile.id;
      document.getElementById('profile-username').textContent = profile.username;
      document.getElementById('profile-email').textContent = profile.email;
    } else {
      if (errorEl) {
        errorEl.textContent = `Error: Failed to fetch profile (Status: ${response.status})`;
        errorEl.classList.remove('d-none');
      }
    }
  } catch (error) {
    if (errorEl) {
      errorEl.textContent = 'Error: Connection failed. Please try again later.';
      errorEl.classList.remove('d-none');
    }
  }
}

/**
 * Displays the JWT string in the dedicated UI element.
 * @param {string} jwt The JSON Web Token to display.
 */
function displayJWT(jwt) {
  const jwtDisplay = document.getElementById('jwt-display');
  if (jwtDisplay) {
    jwtDisplay.textContent = jwt;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProfile();
  setupCopyButton();
});

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('jwt');
        window.open("index.html", "_self");
    });
}

async function fetchProfile() {
    const jwt = localStorage.getItem('jwt');
    const errorEl = document.getElementById('profile-error');
    
    if (!jwt) {
        if (errorEl) {
            errorEl.textContent = 'Error: No authentication token found. Please login.';
            errorEl.classList.remove('d-none');
        }
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/profile', {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
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

document.addEventListener('DOMContentLoaded', fetchProfile);

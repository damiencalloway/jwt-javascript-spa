// accounts.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Authentication & Configuration ---
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    window.open('index.html', '_self');
    return;
  }

  const DOMAINS_API_URL = 'http://localhost:3000/domains';
  /**
   * Generates authorization headers for API requests.
   * @return {{'Content-Type': string, Authorization: string}}
   */
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwt}`,
  });

  // --- State ---
  let currentDomainId = null;

  // --- DOM Elements ---
  const domainSelect = document.getElementById('domain-select');
  const accountsContainer = document.getElementById('accounts-container');
  const accountsTableBody = document.getElementById('accounts-table-body');
  const accountFormContainer = document.getElementById('account-form-container');
  const accountForm = document.getElementById('account-creation-form');
  const accountIdInput = document.getElementById('account-id');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const formTitle = document.getElementById('form-title');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // --- Functions ---

  /**
   * Fetches and populates the domain selection dropdown.
   * @return {Promise<void>}
   */
  const fetchDomains = async () => {
    try {
      const response = await fetch(DOMAINS_API_URL, {headers: getAuthHeaders()});

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch domains.');

      const domains = await response.json();

      // Clear existing options except the first one
      while (domainSelect.options.length > 1) {
        domainSelect.remove(1);
      }

      domains.forEach((domain) => {
        const option = document.createElement('option');
        option.value = domain.id;
        option.textContent = `${domain.domain}.${domain.tld}`;
        domainSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * Fetches accounts for the selected domain.
   * @return {Promise<void>}
   */
  const fetchAccounts = async () => {
    if (!currentDomainId) {
      accountsContainer.style.display = 'none';
      accountFormContainer.style.display = 'none';
      return;
    }

    try {
      const response = await fetch(
          `${DOMAINS_API_URL}/${currentDomainId}/accounts`,
          {headers: getAuthHeaders()},
      );

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch accounts.');

      const accounts = await response.json();
      renderAccounts(accounts);
      accountFormContainer.style.display = 'block';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * Renders the accounts table with provided data.
   * @param {Array<Object>} accounts List of account objects.
   */
  const renderAccounts = (accounts) => {
    accountsTableBody.innerHTML = '';
    accounts.forEach((account) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${account.id}</td>
                <td>${account.username}</td>
                <td>${account.email}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${account.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${account.id}">Delete</button>
                </td>
            `;
      accountsTableBody.appendChild(row);
    });
    accountsContainer.style.display = 'block';
  };

  /**
   * Resets the account form to its initial state.
   */
  const resetForm = () => {
    formTitle.textContent = 'Add Account';
    accountForm.reset();
    accountIdInput.value = '';
    cancelEditBtn.style.display = 'none';

    // Show password fields if they were hidden during edit
    const passwordFields = document.querySelectorAll('.password-field');
    passwordFields.forEach((field) => {
      field.style.display = 'block';
      field.querySelector('input').required = true;
    });
  };

  /**
   * Logs out the user by clearing the JWT and redirecting.
   */
  const logout = () => {
    localStorage.removeItem('jwt');
    window.open('index.html', '_self');
  };

  // --- Event Listeners ---

  // Handle domain selection change
  domainSelect.addEventListener('change', (e) => {
    currentDomainId = e.target.value;
    resetForm();
    fetchAccounts();
  });

  // Handle account form submission
  accountForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = accountIdInput.value;
    const isUpdating = !!id;

    // Password matching validation
    if (!isUpdating) {
      if (passwordInput.value !== confirmPasswordInput.value) {
        alert('Passwords do not match.');
        return;
      }
    }

    const accountData = {
      account: {
        username: usernameInput.value,
        email: emailInput.value,
      },
    };

    if (!isUpdating) {
      accountData.account.password = passwordInput.value;
    }

    const url = isUpdating ?
        `${DOMAINS_API_URL}/${currentDomainId}/accounts/${id}` :
        `${DOMAINS_API_URL}/${currentDomainId}/accounts`;

    const method = isUpdating ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save account.');
      }

      resetForm();
      fetchAccounts();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  });

  // Handle clicks on Edit and Delete buttons
  accountsTableBody.addEventListener('click', async (e) => {
    const target = e.target;
    const id = target.dataset.id;

    // Edit button clicked
    if (target.classList.contains('edit-btn')) {
      try {
        const response = await fetch(
            `${DOMAINS_API_URL}/${currentDomainId}/accounts/${id}`,
            {headers: getAuthHeaders()},
        );
        if (!response.ok) throw new Error('Could not fetch account data.');

        const account = await response.json();

        formTitle.textContent = 'Edit Account';
        accountIdInput.value = account.id;
        usernameInput.value = account.username;
        emailInput.value = account.email;

        // Hide password fields during edit
        const passwordFields = document.querySelectorAll('.password-field');
        passwordFields.forEach((field) => {
          field.style.display = 'none';
          field.querySelector('input').required = false;
        });

        cancelEditBtn.style.display = 'inline-block';
        window.scrollTo(0, 0);
      } catch (error) {
        alert(error.message);
      }
    }

    // Delete button clicked
    if (target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this account?')) {
        try {
          const response = await fetch(
              `${DOMAINS_API_URL}/${currentDomainId}/accounts/${id}`,
              {
                method: 'DELETE',
                headers: getAuthHeaders(),
              },
          );

          if (!response.ok) throw new Error('Failed to delete account.');
          fetchAccounts();
        } catch (error) {
          console.error('Error:', error);
          alert(error.message);
        }
      }
    }
  });

  // Handle cancel button click
  cancelEditBtn.addEventListener('click', resetForm);

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // --- Initial Load ---
  fetchDomains();
});

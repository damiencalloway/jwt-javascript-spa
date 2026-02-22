// accounts.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication & Configuration ---
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        window.open('index.html', '_self');
        return;
    }

    const DOMAINS_API_URL = 'http://localhost:3000/domains';
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
    });

    // --- State ---
    let currentDomainId = null;

    // --- DOM Elements ---
    const domainSelect = document.getElementById('domain-select');
    const accountsContainer = document.getElementById('accounts-container');
    const accountsTableBody = document.getElementById('accounts-table-body');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Functions ---

    // Fetch and populate domains dropdown
    const fetchDomains = async () => {
        try {
            const response = await fetch(DOMAINS_API_URL, { headers: getAuthHeaders() });

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

            domains.forEach(domain => {
                const option = document.createElement('option');
                option.value = domain.id;
                option.textContent = `${domain.domain}.${domain.tld}`;
                domainSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Fetch accounts for the selected domain
    const fetchAccounts = async () => {
        if (!currentDomainId) {
            accountsContainer.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`${DOMAINS_API_URL}/${currentDomainId}/accounts`, { 
                headers: getAuthHeaders() 
            });

            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch accounts.');

            const accounts = await response.json();
            renderAccounts(accounts);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Render accounts table
    const renderAccounts = (accounts) => {
        accountsTableBody.innerHTML = '';
        accounts.forEach(account => {
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

    // --- Event Listeners ---

    // Handle domain selection change
    domainSelect.addEventListener('change', (e) => {
        currentDomainId = e.target.value;
        fetchAccounts();
    });

    // Handle logout
    const logout = () => {
        localStorage.removeItem('jwt');
        window.open('index.html', '_self');
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // --- Initial Load ---
    fetchDomains();
});

// domains.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication & Configuration ---
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        window.location.href = 'index.html';
        return;
    }

    const API_URL = 'http://localhost:3000/domains'; // Using relative URL since it's on the same server
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
    });

    // --- DOM Elements ---
    const domainsTableBody = document.getElementById('domains-table-body');
    const domainForm = document.getElementById('domain-form');
    const formTitle = document.getElementById('form-title');
    const domainIdInput = document.getElementById('domain-id');
    const domainInput = document.getElementById('domain');
    const tldInput = document.getElementById('tld');
    const cancelBtn = document.getElementById('cancel-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const refreshDomainsBtn = document.getElementById('refresh-domains-btn');

    // --- Functions ---

    // Fetch and display all domains
    const fetchDomains = async () => {
        try {
            const response = await fetch(API_URL, { headers: getAuthHeaders() });

            if (response.status === 401 || response.status === 403) {
                logout(); // Token is invalid or expired
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch domains.');

            const domains = await response.json();
            domainsTableBody.innerHTML = ''; // Clear existing rows
            domains.forEach(domain => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${domain.id}</td>
                    <td><strong>${domain.domain}.${domain.tld}</strong></td>
                    <td>${domain.domain}</td>
                    <td>.${domain.tld}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${domain.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${domain.id}">Delete</button>
                    </td>
                `;
                domainsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    // Reset form to its initial "Add" state
    const resetForm = () => {
        formTitle.textContent = 'Add Domain';
        domainForm.reset();
        domainIdInput.value = '';
        cancelBtn.style.display = 'none';
    };

    // --- Event Listeners ---

    // Handle form submission for Create and Update
    domainForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = domainIdInput.value;
        const domainData = {
            domain: domainInput.value.trim(),
            tld: tldInput.value.trim()
        };

        const isUpdating = !!id;
        const url = isUpdating ? `${API_URL}/${id}` : API_URL;
        const method = isUpdating ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(domainData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save domain.');
            }

            resetForm();
            fetchDomains(); // Refresh the table
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });

    // Handle clicks on Edit and Delete buttons
    domainsTableBody.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        // Edit button clicked
        if (target.classList.contains('edit-btn')) {
            // Fetch the specific domain to ensure data is fresh
            try {
                const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
                if (!res.ok) throw new Error('Could not fetch domain data.');
                const domain = await res.json();

                formTitle.textContent = 'Edit Domain';
                domainIdInput.value = domain.id;
                domainInput.value = domain.domain;
                tldInput.value = domain.tld;
                cancelBtn.style.display = 'inline-block';
                window.scrollTo(0, 0);
            } catch (error) {
                alert(error.message);
            }
        }

        // Delete button clicked
        if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this domain?')) {
                try {
                    const response = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE',
                        headers: getAuthHeaders()
                    });

                    if (!response.ok) throw new Error('Failed to delete domain.');
                    fetchDomains(); // Refresh the table
                } catch (error) {
                    console.error('Error:', error);
                    alert(error.message);
                }
            }
        }
    });

    // Handle cancel button click
    cancelBtn.addEventListener('click', resetForm);

    // Handle logout
    const logout = () => {
        localStorage.removeItem('jwt');
        window.location.href = 'index.html';
    };

    logoutBtn.addEventListener('click', logout);

    refreshDomainsBtn.addEventListener('click', fetchDomains);

    // --- Initial Load ---
    fetchDomains();
});
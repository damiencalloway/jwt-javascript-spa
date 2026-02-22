const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, 'accounts.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, 'accounts.js'), 'utf8');

describe('accounts.js', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    jest.resetModules();
    
    // Setup initial JWT
    localStorage.setItem('jwt', 'valid-token');

    // Mock fetch
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
        })
    );
  });

  test('Domain selection dropdown exists', () => {
    const dropdown = document.getElementById('domain-select');
    expect(dropdown).not.toBeNull();
  });

  test('Populates domain dropdown with data from API', async () => {
    const mockDomains = [
      { id: 1, domain: 'example', tld: 'com' },
      { id: 2, domain: 'test', tld: 'org' }
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDomains),
      })
    );

    // Execute script
    eval(script);
    
    // Trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Wait for async fetch to complete and DOM to update
    await new Promise(resolve => setTimeout(resolve, 0));

    const dropdown = document.getElementById('domain-select');
    expect(dropdown.options.length).toBe(3); // 1 default + 2 from mock
    expect(dropdown.options[1].text).toBe('example.com');
    expect(dropdown.options[2].text).toBe('test.org');
  });

  test('Changing domain selection triggers account fetching', async () => {
    const mockDomains = [
      { id: 1, domain: 'example', tld: 'com' }
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDomains),
      })
    );

    // Execute script
    eval(script);
    
    // Trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Wait for initial domain fetch
    await new Promise(resolve => setTimeout(resolve, 0));

    const dropdown = document.getElementById('domain-select');
    
    // Mock fetch for accounts
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    // Change selection
    dropdown.value = '1';
    dropdown.dispatchEvent(new Event('change'));

    // Wait for async fetchAccounts
    await new Promise(resolve => setTimeout(resolve, 0));

    // Verify fetch was called with the correct nested URL
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/domains/1/accounts'),
      expect.any(Object)
    );
  });

  test('Renders accounts table when domain is selected', async () => {
    const mockDomains = [{ id: 1, domain: 'example', tld: 'com' }];
    const mockAccounts = [
      { id: 10, username: 'user1', email: 'user1@example.com' },
      { id: 11, username: 'user2', email: 'user2@example.com' }
    ];

    // Reset fetch for this test
    global.fetch = jest.fn()
      .mockImplementation((url) => {
        if (url.endsWith('/domains')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockDomains),
          });
        }
        if (url.includes('/accounts')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockAccounts),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

    // Execute script
    eval(script);
    
    // Trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Wait for initial domain fetch
    await new Promise(resolve => setTimeout(resolve, 0));

    const dropdown = document.getElementById('domain-select');
    dropdown.value = '1';
    dropdown.dispatchEvent(new Event('change'));

    // Wait for fetchAccounts and rendering
    await new Promise(resolve => setTimeout(resolve, 0));

    const tableBody = document.getElementById('accounts-table-body');
    expect(tableBody).not.toBeNull();
    expect(tableBody.children.length).toBe(2);
    expect(tableBody.children[0].innerHTML).toContain('user1');
    expect(tableBody.children[0].innerHTML).toContain('user1@example.com');
  });

  test('Account creation form elements exist', () => {
    // Execute script
    eval(script);
    
    // Trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    expect(document.getElementById('username')).not.toBeNull();
    expect(document.getElementById('email')).not.toBeNull();
    expect(document.getElementById('password')).not.toBeNull();
    expect(document.getElementById('confirm-password')).not.toBeNull();
    expect(document.getElementById('save-account-btn')).not.toBeNull();
  });

  test('Shows error if passwords do not match on creation', async () => {
    window.alert = jest.fn();
    
    // Execute script
    eval(script);
    
    // Trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Mock domain selection
    const dropdown = document.getElementById('domain-select');
    dropdown.value = '1';
    dropdown.dispatchEvent(new Event('change'));

    document.getElementById('username').value = 'testuser';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('password').value = 'password123';
    document.getElementById('confirm-password').value = 'password456';

    const form = document.getElementById('account-creation-form');
    form.dispatchEvent(new Event('submit'));

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match.');
    expect(global.fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/accounts'),
        expect.objectContaining({ method: 'POST' })
    );
  });

  test('Successful account creation refreshes the list', async () => {
    const mockDomains = [{ id: 1, domain: 'example', tld: 'com' }];
    
    global.fetch = jest.fn()
      .mockImplementation((url, options) => {
        if (url.endsWith('/domains')) {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(mockDomains) });
        }
        if (url.includes('/accounts') && options?.method === 'POST') {
          return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ id: 12, username: 'newuser' }) });
        }
        if (url.includes('/accounts') && (!options?.method || options.method === 'GET')) {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

    // Execute script
    eval(script);
    
    // Trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 0));

    const dropdown = document.getElementById('domain-select');
    dropdown.value = '1';
    dropdown.dispatchEvent(new Event('change'));

    document.getElementById('username').value = 'newuser';
    document.getElementById('email').value = 'new@example.com';
    document.getElementById('password').value = 'secret';
    document.getElementById('confirm-password').value = 'secret';

    // Clear mock calls to only count what happens after submit
    global.fetch.mockClear();

    const form = document.getElementById('account-creation-form');
    form.dispatchEvent(new Event('submit'));

    await new Promise(resolve => setTimeout(resolve, 0));

    // Verify POST was called
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/domains/1/accounts'),
      expect.objectContaining({ method: 'POST' })
    );

    // Verify list was refreshed (fetch called again for GET)
    const getAccountCalls = global.fetch.mock.calls.filter(call => 
        call[0].includes('/accounts') && (!call[1]?.method || call[1].method === 'GET')
    );
    expect(getAccountCalls.length).toBeGreaterThanOrEqual(1);
  });
});

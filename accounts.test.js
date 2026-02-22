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
});

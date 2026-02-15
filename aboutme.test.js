const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, 'aboutme.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, 'aboutme.js'), 'utf8');

describe('aboutme.js', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    jest.resetModules();
  });

  test('Clicking Logout button clears JWT and redirects to index.html', () => {
    // Setup
    localStorage.setItem('jwt', 'fake-token');
    
    // Execute script
    eval(script);

    // Find the button
    const logoutBtn = document.getElementById('logout-btn');
    
    // Dispatch click event
    logoutBtn.click();

    // Assertions
    expect(localStorage.getItem('jwt')).toBeNull();
    expect(window.open).toHaveBeenCalledWith('index.html', '_self');
  });

  test('Required profile display elements exist in the DOM', () => {
    expect(document.getElementById('profile-id')).not.toBeNull();
    expect(document.getElementById('profile-username')).not.toBeNull();
    expect(document.getElementById('profile-email')).not.toBeNull();
    expect(document.getElementById('profile-error')).not.toBeNull();
  });

  test('Fetches profile data and updates DOM on success', async () => {
    // Setup
    const mockProfile = {
      id: 123,
      username: 'testuser',
      email: 'test@example.com'
    };
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      })
    );

    localStorage.setItem('jwt', 'valid-token');

    // Execute script
    eval(script);
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    // Assertions
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/profile', expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': 'Bearer valid-token'
      })
    }));

    expect(document.getElementById('profile-id').textContent).toBe('123');
    expect(document.getElementById('profile-username').textContent).toBe('testuser');
    expect(document.getElementById('profile-email').textContent).toBe('test@example.com');
  });

  test('Displays error message on fetch failure', async () => {
    // Setup
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401
      })
    );

    localStorage.setItem('jwt', 'invalid-token');

    // Execute script
    eval(script);
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    // Assertions
    const errorEl = document.getElementById('profile-error');
    expect(errorEl.classList.contains('d-none')).toBe(false);
    expect(errorEl.textContent).toContain('Error');
  });

  test('Redirects to index.html if JWT is missing', () => {
    // Setup
    localStorage.removeItem('jwt');

    // Execute script
    eval(script);
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Assertions
    expect(window.open).toHaveBeenCalledWith('index.html', '_self');
  });

  test('Refresh button triggers fetchProfile', async () => {
    // Setup
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, username: 'u', email: 'e' }),
      })
    );
    localStorage.setItem('jwt', 'valid-token');

    // Execute script
    eval(script);
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Reset fetch mock to track calls from button click
    global.fetch.mockClear();

    // Find and click refresh button
    const refreshBtn = document.getElementById('refresh-domains-btn');
    refreshBtn.click();

    // Assertions
    expect(global.fetch).toHaveBeenCalled();
  });
});

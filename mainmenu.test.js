const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, 'mainmenu.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, 'mainmenu.js'), 'utf8');

describe('mainmenu.js', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    jest.resetModules();
    // We need to re-execute the script for each test
    // Since we can't easily require a non-module file, we'll eval it
    // But first we need to make sure the elements exist (which they do from innerHTML)
  });

  test('Logout clears JWT and redirects to index.html', () => {
    // Setup
    localStorage.setItem('jwt', 'fake-token');
    
    // Execute script
    eval(script);

    // Find the form
    const logoutForm = document.getElementById('logout-form');
    
    // Create and dispatch submit event
    const event = new Event('submit');
    logoutForm.dispatchEvent(event);

    // Assertions
    expect(localStorage.getItem('jwt')).toBeNull();
    expect(window.open).toHaveBeenCalledWith('index.html', '_self');
  });
});

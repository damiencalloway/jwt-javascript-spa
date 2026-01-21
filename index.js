// JavaScript Document
const loginForm = document.getElementById('login');
const message = document.getElementById('message');

const signupForm = document.getElementById('signup');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = ''; // Clear previous messages

  const username = loginForm.username.value;
  const password = loginForm.password.value;

  try {
    const res = await fetch('http://localhost:3000/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'An error occurred.');
    }

    // On success, you'd typically save the token and redirect
    // For this example, we'll just display a success message
    console.log('Received token:', data.token);
    message.style.color = 'green';
    message.textContent = 'Login successful! Token is in the console.';
    
  } catch (error) {
    message.style.color = 'red';
    message.textContent = error.message;
  }
});

signupForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	window.open("signup.html","_self");
})

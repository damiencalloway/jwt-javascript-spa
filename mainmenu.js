// JavaScript Document

const usersForm = document.getElementById('users');
const aboutmeForm = document.getElementById('aboutme');
const domainsForm = document.getElementById('domains');
const logoutForm = document.getElementById('logout');

usersForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	window.open("users.html","_self");
});

aboutmeForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	window.open("aboutme.html","_self");
});

domainsForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	window.open("domains.html","_self");
});

logoutForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	window.open("logout.html","_self");
});

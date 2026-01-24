// JavaScript Document

const accountsForm = document.getElementById('accounts-form');
const aboutmeForm = document.getElementById('aboutme-form');
const domainsForm = document.getElementById('domains-form');
const logoutForm = document.getElementById('logout-form');

accountsForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	window.open("accounts.html","_self");
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

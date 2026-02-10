# JWT JavaScript SPA

## Project Overview

This project is a client-side web application designed to demonstrate JSON Web Token (JWT) authentication and session management. It is built using **Vanilla JavaScript**, **HTML5**, and **CSS3**, with **Bootstrap 5** (via CDN) used for styling in some components.

The application serves as a frontend interface that communicates with a backend API (expected to be running locally on port 3000) to handle user authentication, registration, and resource management (Accounts, Domains, etc.).

## Tech Stack

*   **Frontend:** HTML5, CSS, JavaScript (ES6+)
*   **Styling:** Custom CSS & Bootstrap 5 (CDN)
*   **Authentication:** JWT (JSON Web Tokens) stored in `localStorage`
*   **API Interaction:** Native `fetch` API

## Key Components

### Entry Points
*   **`index.html` / `index.js`**: The landing page containing the Login form. It handles user authentication requests to `POST /authenticate` and stores the received JWT in the browser's `localStorage`.
*   **`signup.html` / `signup.js`**: The user registration page.

### Application Logic
*   **`mainmenu.html` / `mainmenu.js`**: The central navigation hub accessible after a successful login.
*   **`accounts.html` / `accounts.js`**: Interface for viewing and managing user accounts.
*   **`domains.html` / `domains.js`**: Interface for domain management.
*   **`aboutme.html`**: A simple profile or information page.

## Setup and Running

### Prerequisites
1.  **Backend API**: This frontend requires a backend server running on `http://localhost:3000` to handle API requests (specifically `/authenticate`). Ensure the backend project is running before interacting with this application.

### Running the Frontend
Since this project consists of static files, it does not require a complex build process. However, for `fetch` requests and routing to work correctly (avoiding CORS issues with `file://` protocol), it is recommended to serve the files using a local development server.

**Using Python:**
```bash
python3 -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server . -p 8000
```

Once serving, navigate to `http://localhost:8000` in your web browser.

## Development Conventions

*   **Navigation**: The application currently uses `window.open(url, "_self")` for navigation between views, effectively treating it as a Multi-Page Application (MPA) linked together, rather than a single-page app (SPA) with client-side routing.
*   **State Management**: Authentication state (JWT) is managed via `localStorage`.
*   **Styling**: CSS files are separate for each HTML page (e.g., `index.css`, `signup.css`).

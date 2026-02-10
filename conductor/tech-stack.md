# Tech Stack

## Frontend
- **Vanilla JavaScript (ES6+):** Core application logic and DOM manipulation using modern JavaScript standards without heavy external frameworks.
- **HTML5:** Semantic and structured markup for all application views.
- **CSS3:** Custom styles defined in page-specific files (e.g., `index.css`, `signup.css`) for layout and branding.

## UI & Styling
- **Bootstrap 5 (via CDN):** Leveraged for its responsive grid system, pre-styled components (buttons, forms, alerts), and utility classes to ensure a professional and consistent UI.

## Architecture & Patterns
- **Multi-Page Application (MPA):** The application is structured as a collection of discrete HTML pages linked via native browser navigation (`window.open` / `<a>` tags).
- **Client-Side State:** Authentication tokens (JWT) are persisted in `localStorage` to maintain session state across page reloads and navigation.

## Integration
- **REST API Communication:** Native browser `fetch` API is used for all network requests to the backend.
- **Authentication:** Standard JWT (JSON Web Token) authentication flow.

## Development Environment
- **Backend Dependency:** Requires a REST API (typically running locally on port 3000) for authentication and data management.
- **Local Serving:** Static files should be served via a local web server (e.g., Python's `http.server` or Node's `http-server`) to handle `fetch` requests and relative paths correctly.
- **Testing Framework:** Jest with `jsdom` environment used for TDD and unit testing of DOM-dependent logic.

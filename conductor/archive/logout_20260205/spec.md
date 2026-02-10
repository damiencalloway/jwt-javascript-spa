# Specification: Secure Logout Functionality

## Overview
Implement a robust logout mechanism that ensures user sessions are properly terminated on the client side. This includes clearing authentication tokens and redirecting users to the entry point of the application.

## User Stories
- **As a user,** I want to be able to log out of the application so that my session is terminated and my account remains secure.
- **As a developer,** I want to ensure that all local authentication state is purged upon logout to prevent unauthorized access.

## Functional Requirements
1.  **Logout Trigger:** Provide a clear "Logout" action (button or link) accessible from the `mainmenu.html` and other authenticated views (`accounts.html`, `domains.html`, `aboutme.html`).
2.  **State Cleanup:** Upon logout, the `jwt` item must be removed from `localStorage`.
3.  **Redirection:** After state cleanup, the user must be redirected to `index.html`.
4.  **Session Invalidation (Client-side):** Ensure that navigating back to authenticated pages after logout does not allow access (optional, but recommended for future tracks).

## Non-Functional Requirements
- **Immediate Feedback:** The logout process should be instantaneous from the user's perspective.
- **Consistency:** The logout action should be located in a consistent place across all authenticated views (e.g., top-right navigation).

## Technical Implementation
- **Target Files:**
    - `mainmenu.html` / `mainmenu.js`
    - `accounts.html` / `accounts.js`
    - `domains.html` / `domains.js`
    - `aboutme.html` (if applicable)
- **Logic:**
    ```javascript
    localStorage.removeItem('jwt');
    window.open("index.html", "_self");
    ```

## Acceptance Criteria
- [ ] Clicking "Logout" removes the `jwt` key from `localStorage`.
- [ ] Clicking "Logout" redirects the user to `index.html`.
- [ ] The logout button is visible and functional on all main navigation pages.

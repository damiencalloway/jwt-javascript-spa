# Specification: JWT Profile Display Enhancement

## Overview
This track aims to enhance the existing "About Me" (profile) page by adding a dedicated section to display the user's current JSON Web Token (JWT). This provides transparency and a tool for developers to inspect their active session token.

## Functional Requirements
- **Display Current Profile:** Maintain the existing functionality of fetching and displaying the user's ID, Username, and Email from the `http://localhost:3000/profile` endpoint.
- **JWT Display Card:**
    - Read the JWT string from `localStorage`.
    - Create a new Bootstrap card positioned below the "Profile Information" card.
    - Display the raw JWT string within this card.
- **Copy to Clipboard:**
    - Add a "Copy" button to the JWT card.
    - Clicking the button should copy the full JWT string to the user's clipboard.
    - Provide a brief visual confirmation (e.g., button text change to "Copied!") when the action succeeds.

## Non-Functional Requirements
- **Visual Consistency:** Use Bootstrap 5 classes and components to ensure the new card matches the existing UI style.
- **Responsive Layout:** Ensure the JWT string wraps correctly (using CSS `word-break: break-all` or similar) to prevent horizontal scrolling on small screens.
- **Data Integrity:** The application must continue to securely store the JWT in `localStorage` and not expose it to any external services.

## Acceptance Criteria
- [ ] The "About Me" page correctly displays the user's ID, Username, and Email.
- [ ] A second card titled "Your Authentication Token (JWT)" appears below the profile info.
- [ ] The full, raw JWT from `localStorage` is visible inside the new card.
- [ ] The JWT text is styled using code-appropriate formatting (monospace font).
- [ ] Clicking the "Copy" button successfully copies the token to the clipboard.
- [ ] The layout remains stable and readable on both desktop and mobile views.

## Out of Scope
- Implementation of a JWT decoder (e.g., parsing the header/payload) in the UI.
- Modifying the backend `/profile` endpoint.
- Changes to the Login or Signup flows.

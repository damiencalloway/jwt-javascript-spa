# Specification: Implement About Me from profile API

## Overview
Retrieve and display user profile information from the backend `/profile` endpoint on the "About Me" page. This feature provides users with a clear view of their own account details.

## User Stories
- **As a logged-in user,** I want to view my profile information so that I can verify my account details.
- **As a developer,** I want to ensure that profile data is retrieved securely using the JWT stored in `localStorage`.

## Functional Requirements
1.  **Data Retrieval:** On page load of `aboutme.html`, the application must make an authenticated GET request to the `/profile` endpoint.
2.  **Authentication:** The request must include the `Authorization: Bearer <jwt>` header.
3.  **Data Display:** Upon successful retrieval, the following fields must be displayed in the `aboutme.html` view:
    -   User ID (`id`)
    -   Username (`username`)
    -   Email Address (`email`)
4.  **Error Handling:**
    -   If the API returns an error (e.g., 401 Unauthorized), a user-friendly error message must be displayed within the profile section.
    -   If the network request fails, a generic connection error message should be shown.

## Non-Functional Requirements
- **Security:** Ensure the JWT is correctly sent and handled.
- **Performance:** Profile data should be loaded efficiently upon navigating to the page.

## Technical Implementation
- **Target Files:** `aboutme.html`, `aboutme.js`
- **Endpoint:** `GET http://localhost:3000/profile`
- **API Response Format (Expected):**
    ```json
    {
      "id": 1,
      "username": "jdoe",
      "email": "jdoe@example.com"
    }
    ```

## Acceptance Criteria
- [ ] Navigating to `aboutme.html` triggers a profile data fetch.
- [ ] User ID, Username, and Email are correctly rendered on the page.
- [ ] API errors result in a displayed error message rather than a broken UI.

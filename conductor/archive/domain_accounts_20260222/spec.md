# Specification: Domain Accounts CRUD

## Overview
Implement a full CRUD (Create, Read, Update, Delete) interface for managing Accounts associated with Domains. This feature will be hosted on the `accounts.html` page. Users will select a target Domain from a Bootstrap dropdown to manage its corresponding user accounts.

## Functional Requirements
- **Account Data Model:**
    - `id`: Unique identifier (managed by backend).
    - `domain_id`: Reference to the selected Domain.
    - `username`: String, required.
    - `email`: String, required, format validation.
    - `password`: String, required for creation.
- **Domain Selection:**
    - The `accounts.html` page will feature a Bootstrap dropdown populated with the list of available Domains.
    - Selecting a Domain will trigger the loading of Accounts associated with that Domain.
- **CRUD Operations:**
    - **Read:** Display a table of accounts for the selected domain.
    - **Create:** Form to add a new account to the selected domain. Includes `username`, `email`, `password`, and `confirm_password` fields.
    - **Update:** Edit existing account details (`username`, `email`).
    - **Delete:** Remove an account after user confirmation.
- **API Integration:**
    - Fetch Domains: GET `/domains`
    - Use the nested RESTful pattern for Accounts:
        - GET `/domains/:domain_id/accounts` (List)
        - POST `/domains/:domain_id/accounts` (Create)
        - GET `/domains/:domain_id/accounts/:id` (Detail)
        - PUT `/domains/:domain_id/accounts/:id` (Update)
        - DELETE `/domains/:domain_id/accounts/:id` (Delete)
- **UI/UX:**
    - Use Bootstrap 5 for consistent styling.
    - Password and Confirm Password fields must match during creation.
    - Silent updates: The account list should refresh automatically upon successful operations without intrusive alerts.

## Non-Functional Requirements
- **Security:** Ensure JWT is sent with all requests.
- **Validation:** Frontend validation for required fields and email format.
- **Testing:** Comprehensive unit tests for account management logic using Jest and JSDom.

## Acceptance Criteria
- [ ] Users can select a Domain from a dropdown on the Accounts page.
- [ ] Selecting a Domain correctly loads and displays its accounts.
- [ ] All CRUD operations for Accounts work against the specified nested API endpoints.
- [ ] Account list updates correctly after Create/Update/Delete operations.
- [ ] Password confirmation logic prevents creation if passwords do not match.
- [ ] UI remains consistent with the rest of the application.

## Out of Scope
- Mass import/export of accounts.
- Password complexity policy enforcement.
- Account activity logs.

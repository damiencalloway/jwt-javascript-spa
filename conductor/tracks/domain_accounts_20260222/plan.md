# Implementation Plan: Domain Accounts CRUD

## Phase 1: Foundation and Domain Selection
- [x] Task: Create initial test file `accounts.test.js` with basic setup and mocks. ff54e0d
- [ ] Task: Implement Domain fetch logic and populate the Bootstrap dropdown in `accounts.js`.
- [ ] Task: Implement Domain selection change handler to store the current `domain_id`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation and Domain Selection' (Protocol in workflow.md)

## Phase 2: Account Listing (Read)
- [ ] Task: Write tests for fetching and rendering accounts for a selected domain.
- [ ] Task: Implement `fetchAccounts` function and render the accounts table in `accounts.js`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Account Listing (Read)' (Protocol in workflow.md)

## Phase 3: Account Creation (Create)
- [ ] Task: Write tests for the account creation form, including password confirmation validation.
- [ ] Task: Implement the account creation form and POST logic in `accounts.js`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Account Creation (Create)' (Protocol in workflow.md)

## Phase 4: Account Update (Update)
- [ ] Task: Write tests for editing an existing account.
- [ ] Task: Implement the edit mode and PUT logic in `accounts.js`.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Account Update (Update)' (Protocol in workflow.md)

## Phase 5: Account Deletion (Delete)
- [ ] Task: Write tests for account deletion with confirmation.
- [ ] Task: Implement the DELETE logic and UI interaction in `accounts.js`.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Account Deletion (Delete)' (Protocol in workflow.md)

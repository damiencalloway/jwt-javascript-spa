# Implementation Plan: Domain Accounts CRUD

## Phase 1: Foundation and Domain Selection [checkpoint: 7508cfe]
- [x] Task: Create initial test file `accounts.test.js` with basic setup and mocks. ff54e0d
- [x] Task: Implement Domain fetch logic and populate the Bootstrap dropdown in `accounts.js`. b800764
- [x] Task: Implement Domain selection change handler to store the current `domain_id`. 741a216
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation and Domain Selection' (Protocol in workflow.md) 7508cfe

## Phase 2: Account Listing (Read) [checkpoint: 35c05fd]
- [x] Task: Write tests for fetching and rendering accounts for a selected domain. 2778ee1
- [x] Task: Implement `fetchAccounts` function and render the accounts table in `accounts.js`. 0a724c7
- [x] Task: Conductor - User Manual Verification 'Phase 2: Account Listing (Read)' (Protocol in workflow.md) 35c05fd

## Phase 3: Account Creation (Create) [checkpoint: b0bbf57]
- [x] Task: Write tests for the account creation form, including password confirmation validation. ffd5179
- [x] Task: Implement the account creation form and POST logic in `accounts.js`. acff92a
- [x] Task: Conductor - User Manual Verification 'Phase 3: Account Creation (Create)' (Protocol in workflow.md) b0bbf57

## Phase 4: Account Update (Update) [checkpoint: 65e80e1]
- [x] Task: Write tests for editing an existing account. 47b356e
- [x] Task: Implement the edit mode and PUT logic in `accounts.js`. e276c10
- [x] Task: Conductor - User Manual Verification 'Phase 4: Account Update (Update)' (Protocol in workflow.md) 65e80e1

## Phase 5: Account Deletion (Delete) [checkpoint: 8a0a54c]
- [x] Task: Write tests for account deletion with confirmation. 272cfda
- [x] Task: Implement the DELETE logic and UI interaction in `accounts.js`. 4d279b4
- [x] Task: Conductor - User Manual Verification 'Phase 5: Account Deletion (Delete)' (Protocol in workflow.md) 8a0a54c

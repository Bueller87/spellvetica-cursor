# Project Spec: Spelling Test App MVP

## 1. Product Summary
This project is a web-based spelling test application intended primarily for use on a Windows 11 SE laptop. A parent or teacher sets up the test, and then a single child takes the spelling test one word at a time.

The MVP should provide a strong foundation for future features while staying simple enough to build quickly. The app should allow an adult to import a spelling list from a TXT file, save word lists locally, administer a spelling test one word at a time, provide pronunciation audio, collect typed answers, and show a final results screen with score, all answers, and missed words.

The MVP should not require any backend server, cloud account, or hosted database. All saved data should be stored locally in the browser.

Product Name: Spellvetica

## 2. Primary Users

### Primary user
- A single child taking a spelling test

### Secondary user
- A parent or teacher who prepares and starts the test

### User characteristics
- Child UI should target an elementary-age reading level
- Child-facing screens should be simple and focused
- Setup/admin controls should be separated from the child’s main test-taking experience

### Usage environment
- Main target device is a Windows 11 SE laptop
- The app should work well in a home or school setting
- The interface should work well with keyboard input

## 3. MVP Goals
The MVP must support the following:
1. Import a spelling list from a TXT file
2. Save word lists locally
3. Administer a spelling test one word at a time
4. Let the child type an answer for each word
5. Provide pronunciation audio for each word
6. Allow skipping words
7. Allow returning to previous words
8. Show a final results screen with total score, all answers, and missed words
9. Save full test history locally

### MVP emphasis
- Strong foundation for future features
- Simple child experience
- Local-first browser storage
- No backend complexity

## 4. Non-Goals
The MVP must not include:
- User accounts or login
- Cloud sync
- Multi-student profiles
- Speech recognition
- Fancy animations or elaborate themes
- Any backend, server, or hosted database
- Online multiplayer or real-time shared use

Teacher dashboard/reporting features are out of scope for MVP unless explicitly added later.

## 5. Core User Flows

### Flow 1: Import and create a test
1. The adult opens the app
2. The adult chooses to create a new spelling test
3. The adult imports a TXT file containing spelling words
4. The app parses the file into a word list
5. The app saves the word list locally
6. The adult reviews the imported list and starts the test

### Flow 2: Take the spelling test
1. The child starts the test
2. The app presents one word at a time
3. The app provides pronunciation audio for the current word
4. The child types the spelling into a text input
5. After submission, the app immediately advances to the next word
6. The child can move back to previous words
7. The child can skip a word
8. Skipped words remain in position and are shown as unanswered
9. The app continues until the test is complete

### Flow 3: Finish and view results
1. When the test is complete, the app shows a results screen
2. The results screen includes:
   - overall score
   - each spelling word
   - the child’s submitted answer for each word
   - which words were incorrect
3. The completed test is saved in local test history

## 6. Functional Requirements

### 6.1 Importing word lists
- Support TXT import only
- TXT file format is one spelling word per line
- Ignore blank lines
- Preserve duplicate words
- Maximum 50 words per imported list

### 6.2 Test behavior
- Present one word at a time
- Provide pronunciation audio
- Allow typed answers
- Save progress after each answer
- Allow back navigation to previous words
- Allow skipping words
- Keep skipped words in their original position and mark them unanswered
- Show visible progress such as “Word 4 of 12”
- Do not reveal correctness until the end

### 6.3 Sentence support
- Structure the code so sentence support can be added later
- For MVP, if sentence generation is not available, show no sentence rather than blocking the test

### 6.4 Scoring
- Trim leading/trailing spaces before grading
- Require exact capitalization match
- Require exact punctuation match
- Score answers strictly after trimming outside whitespace

### 6.5 Results
- Show total score
- Show all correct words
- Show submitted answers
- Show missed words

### 6.6 History
- Save full test history locally
- Each history entry must include:
  - date
  - score
  - missed words

### 6.7 Recovery
- Restore an in-progress test if the browser tab/app closes and is reopened

## 7. UX / UI Requirements
- Child-facing screen should be very minimal
- Prioritize one clear main input and large buttons
- Avoid clutter and unnecessary controls
- Keep admin/setup controls separate from the test-taking UI
- Show progress during the test
- Do not show correctness during the test
- Optimize for keyboard-friendly use on Windows 11 SE laptop

## 8. PWA / Offline Requirements
- Offline support is not required for MVP
- Installability as a PWA is not required for MVP
- The code should still be structured so PWA support can be added later if desired

## 9. Technical Constraints
- Preferred stack: React + TypeScript
- This preference can be changed if there is a strong reason to simplify
- No backend
- No hosted database
- Store all persistent data locally in browser storage
- Preferred storage for MVP: localStorage
- Keep architecture simple and easy to extend later

## 10. Data Model

### WordList
- id
- name
- words[]
- createdAt

### TestSession
- id
- wordListId
- currentIndex
- answers[]
- skippedWordIndexes[]
- startedAt
- updatedAt

### TestHistoryEntry
- id
- wordListId
- date
- score
- missedWords[]

## 11. Acceptance Criteria
The MVP is complete when:
1. TXT import works with one word per line
2. Blank lines are ignored
3. Duplicate words are preserved
4. Lists up to 50 words work reliably
5. A child can complete a spelling test one word at a time
6. Pronunciation audio works
7. Typed answer entry works
8. Progress is saved after each answer
9. Skipping works
10. Returning to previous words works
11. Progress indicator is visible
12. Correctness is hidden until the end
13. Trimming of accidental outside spaces works
14. Capitalization and punctuation are graded strictly
15. Results screen shows score, all answers, and missed words
16. Test history is saved locally
17. In-progress tests can be restored
18. The app works reliably for one child on one device
19. Basic tests are included
20. The codebase is clear enough to extend later
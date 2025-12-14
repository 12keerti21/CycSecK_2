# Performance Review Web Application

## Project Overview
A minimal full-stack web application for managing employee performance reviews. Admins can add employees, create reviews, and assign reviewers. Employees can view assigned reviews and submit feedback. The app is intentionally simple, focusing on clarity and reasoning under limited requirements.

## Tech Stack & Reasoning
- **Backend:** Node.js with Express (simple, fast, and widely used for REST APIs)
- **Frontend:** React (without JSX, loaded via CDN for zero build tools)
- **Styling:** Plain CSS (no frameworks for simplicity)
- **Data Storage:** In-memory arrays (no database for minimalism)
- **Communication:** REST APIs (clear separation of concerns)

## API List
- `GET /api/employees` — List all employees
- `POST /api/employees` — Add a new employee
- `GET /api/reviews` — List all reviews
- `POST /api/reviews` — Create a new review
- `POST /api/reviews/:id/assign` — Assign reviewers to a review
- `POST /api/reviews/:id/feedback` — Submit feedback for a review

## Assumptions Made
- No authentication: Employees are selected from a dropdown for demo purposes.
- No database: All data is lost on server restart; this is intentional for simplicity.
- No JSX: To avoid build tools and keep the frontend setup minimal.
- No UI frameworks: Only plain HTML and CSS for clarity.

## Steps to Run Locally

### Backend
1. Open a terminal in `backend/`.
2. Run `npm install`.
3. Start the server: `npm start` (runs on http://localhost:4000)

### Frontend
1. Open a terminal in `frontend/`.
2. Run `npm install` (for the static server dependency).
3. Start the frontend: `npm start` (serves on http://localhost:3000 or another port)
4. Open the frontend in your browser and use the app.

## What Could Be Improved
- Add authentication and user roles
- Use a real database for persistence
- Add input validation and error handling in the UI
- Improve UI/UX and accessibility
- Add review deadlines and notifications
- Use JSX and a build tool for better developer experience

## Design Decisions
- **No authentication:** To keep the demo simple and focused on core logic. User selection is mocked via dropdowns.
- **No database:** In-memory storage is fast to implement and sufficient for a demo. Persistence is not required.
- **No JSX:** Avoids the need for Babel or build steps, making the frontend runnable as static files.

---

**Simplicity, clarity, and intentional design were prioritized over completeness or polish.**

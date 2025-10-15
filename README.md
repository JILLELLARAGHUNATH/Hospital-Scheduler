Hospital Appointment Scheduler 📅
This project implements the frontend scheduling interface as required by the PearlThoughts Frontend Developer Challenge.

🎯 Challenge Goal
To build a robust and performant interface for viewing doctor appointments, demonstrating mastery of modern frontend architecture, state management, and calendar rendering.

⚙️ Technical Stack
Framework: Next.js 14

Language: TypeScript

Styling: Tailwind CSS

Logic/State: React Hooks (Headless Component Pattern)

Date Utilities: date-fns

✨ Key Features Implemented
Clean Architecture: Clear separation between Service Layer (data access) and Headless Hooks (business logic).

Role-Based Filtering: Dropdown selection to filter schedules by Doctor.

Day View Calendar: Stable rendering of appointments aligned by time slots (8:00 AM – 6:00 PM).

Week View Calendar: Fully functional 7-day grid displaying appointments across the full date range.

Visual Design: Color-coding for appointment types (Checkup, Consultation, Procedure, Follow-up).

🚀 Getting Started
Follow these steps to run the application locally:

Clone the Repository: (Or navigate to the working directory).

Install Dependencies:

Bash

npm install
Run Development Server:

Bash

npm run dev
View App: Open your browser and navigate to http://localhost:3000/schedule.
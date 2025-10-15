Frontend Challenge Submission
Candidate Name: Raghunath Jillella
Date: October 15, 2025
Time Spent: ~4 hours (Plus additional time for technical debugging)

✅ Completed Core Requirements
All primary challenge requirements have been successfully implemented:

Feature	Status
Day View calendar (Time slots, alignment)	[X]
Week View calendar (7-day grid, filtering)	[X]
Doctor selector dropdown (Role-based filtering)	[X]
Service layer implementation (Architecture)	[X]
Custom hooks (Headless pattern)	[X]

Export to Sheets
🏗️ Architecture Decisions
1. Separation of Concerns (Headless Pattern)
I designed the application with a clean three-layer architecture:

Service Layer (appointmentService.ts): Implemented as a singleton class to abstract direct access to the mock data. This makes the application easily scalable for integration with a real API endpoint.

Headless Hook (useAppointments.ts): This hook contains all business logic (filtering by doctor, date range calculations, loading state management). This keeps the logic isolated, testable, and reusable.

Presentational Components (DayView.tsx, WeekView.tsx): These components receive fully processed data from the hook via props and are only responsible for rendering the UI.

2. Component Structure
The views are composed as follows:

ScheduleView (State management, uses hook)
├── DoctorSelector (Filters by doctor)
├── DayView (Time slot matching logic)
└── WeekView (7-Day Table Grid)
🎨 UI/UX Trade-offs
Calendar Rendering Strategy
Week View: Implemented using a standard HTML table structure, which inherently provides the robust, correctly aligned grid required for the 7-day view. This successfully demonstrates complex filtering across date ranges.

Day View: Implemented using a stable Flexbox structure with fixed row heights (h-12 / 48px). This prioritized functional time-slot alignment over complex absolute positioning to ensure stability under the time constraint.

Overlapping Appointments (Trade-off)
Due to the strict time budget, I made a trade-off regarding the visual rendering of simultaneous appointments. The current implementation correctly displays overlapping appointments within their starting time slot but renders them full-width (stacked visually) rather than side-by-side with dynamic widths.

Future Improvement: The immediate next step would be to implement collision detection logic to render these appointments side-by-side, which requires more time.

📚 Tools & Code Quality
Language: Strict TypeScript usage throughout the project.

AI Tools: Used ChatGPT for generating architectural boilerplate, suggesting utility function approaches, and debugging complex runtime import errors. All AI-generated code was reviewed, understood, and customized to fit the defined architecture.
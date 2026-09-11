# FitTrack Simple

You are a senior full-stack developer.

Build a modern, minimal, and production-ready web application called "FitTrack Pro" — a fitness tracking platform.

IMPORTANT CONSTRAINTS:

- Keep the app minimal, clean, and usable (do NOT overcomplicate with too many features)

- Focus on excellent UI/UX, responsiveness, and real-world usability

- Code should be modular, readable, and scalable

- Provide complete working code (frontend + backend + database schema)

--------------------------------------------------

🧠 PROJECT OVERVIEW:

FitTrack Pro is a simple fitness tracking web app where users can:

- Log daily workouts

- Track calories burned

- View simple progress stats

--------------------------------------------------

⚙️ TECH STACK:

Frontend:

- React (with Vite)

- Tailwind CSS (for modern UI)

- Responsive design (mobile-first)

- Use clean component structure

Backend:

- Java (Spring Boot)

- REST API architecture

- Proper layered structure (Controller, Service, Repository)

Database:

- MySQL (preferred for structured fitness logs)

- Use JPA/Hibernate

--------------------------------------------------

🎯 CORE FEATURES (KEEP IT MINIMAL BUT COMPLETE):

1. Authentication (basic)

   - User signup/login (JWT optional, can be simple session-based)

2. Dashboard

   - Show today's summary:

     - Total calories burned

     - Number of workouts

   - Clean card-based UI

3. Workout Logging

   - Add workout:

     - Exercise name

     - Duration (minutes)

     - Calories burned

     - Date

   - View workout history (list view)

4. Progress Tracking

   - Simple chart (weekly calories or workouts)

   - Use a lightweight chart library (like Recharts)

--------------------------------------------------

🎨 UI/UX REQUIREMENTS:

- Modern SaaS-style design

- Minimal color palette (dark + accent color OR light + subtle gradients)

- Smooth hover effects and transitions

- Clean typography

- Proper spacing and alignment

- Fully responsive (mobile + tablet + desktop)

Pages:

- Landing Page (simple + attractive)

- Login / Signup

- Dashboard

- Workout Log Page

--------------------------------------------------

🧱 BACKEND REQUIREMENTS:

- REST APIs:

  - POST /auth/register

  - POST /auth/login

  - GET /workouts

  - POST /workouts

  - DELETE /workouts/{id}

- Entity:

  Workout:

    - id

    - userId

    - name

    - duration

    - calories

    - date

- Use DTOs where needed

- Proper error handling

--------------------------------------------------

🗄️ DATABASE SCHEMA:

Provide SQL schema for:

- users table

- workouts table

--------------------------------------------------

📁 OUTPUT FORMAT:

1. Full frontend code (React + Tailwind)

2. Full backend code (Spring Boot)

3. Database schema (MySQL)

4. Folder structure

5. Setup instructions (step-by-step)

--------------------------------------------------

✨ BONUS (if possible but keep minimal):

- Simple chart visualization

- Basic validation

--------------------------------------------------

⚠️ IMPORTANT:

- Do NOT over-engineer

- Avoid unnecessary features like social sharing, AI recommendations, etc.

- Focus on clean execution of core features

--------------------------------------------------

Now generate the complete project.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://track-sync-fit.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aed85ba0-7be4-4b86-b31e-0009a71002e3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

# IT_Path 🎓💼
> **Academic & Career Management Operating System for IT Undergraduates**  
> *Built for the journey from university to industry.*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](#)

---

## 📌 Executive Summary

**IT_Path** is a specialized dual-portal platform engineered for Information Technology undergraduates. Most students struggle with the disconnect between university course requirements and industry hiring expectations. IT_Path resolves this by operating not as a generic task manager, but as an integrated **University + Career Operating System** that helps students balance academic excellence with competitive software engineering readiness.

---

## 🌟 Key Architecture: The Dual-Portal Experience

Upon login, students are greeted with a personalized decision interface:

```
                  ┌─────────────────────────────────────────┐
                  │   "Where do you want to continue today?"│
                  └────────────────────┬────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│       🎓 Academic Portal             │  │        💼 Industry Portal            │
│  • Semester Cards & Ongoing Modules  │  │  • Vertical Career Roadmap (5 Stages)│
│  • CAs, Assignments, Vivas & Exams   │  │  • Industry Production Projects      │
│  • Dynamic GPA & Results Calculator  │  │  • Professional Portfolio Checklist │
│  • Academic Certificates Archive     │  │  • Interview Preparation Tracker     │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## 🚀 Core Features

### 1. 🏠 Home Dashboard
* **Dynamic Student Greeting**: Displays student name, degree, academic year, university, and target career goal derived from the authenticated profile.
* **Today's Balance**: High-priority view showing the 3 nearest academic deadlines (CAs, presentations, exams) alongside 3 active career targets (roadmap milestones, project updates, interview prep).
* **Weekly Workload Ratio**: Horizontal distribution tracking committed academic study hours against career development and flexible buffer hours, with live status indicators (`Balanced` vs. `Heavy Academic Week`).

### 2. 🎓 Academic Hub
* **Semester Summary Cards**: Overview of completed and current semesters with credit tracking, GPA milestones, and academic standing (*Dean’s List*, *First Class*).
* **Expandable Module Details**: Track continuous assessments (CA), lab practicals, oral viva defenses, assignments, and final exams with native due-date pickers, score entries, and completion toggles.
* **GPA & Results Calculator**: Allows manual grade entry based on university grading criteria, dynamically computing Semester GPA and Total Credits with cumulative history.
* **Academic Records Archive**: Digital repository for archiving academic certificates, hackathon honors, workshop participation, club memberships, and research papers.

### 3. 💼 Industry Development Hub
* **Vertical Career Roadmap**: 5-stage progressive learning framework (`FOUNDATION` ➔ `CORE` ➔ `DEVELOPMENT` ➔ `PROJECTS` ➔ `PROFESSIONAL`) with interactive status toggling (`Completed`, `In Progress`, `Pending`).
* **Production Projects Tracker**: Showcase technical projects with role descriptions, tech stack tags, verified GitHub repository links, and live deployment URLs.
* **Portfolio Health Checklist**: Recruiter readiness verification monitoring GitHub presence, LinkedIn optimization, portfolio deployments, and resume freshness.
* **Interview Readiness**: Systematic readiness tracker covering Technical Language Internals, DSA Practice, Behavioral (STAR method), and System Design mock sessions.

### 4. ⚖ Balance & Insights
* **Equilibrium Analysis**: Macro comparison across Academic Progress (%), Industry Progress (%), and Portfolio Strength (%).
* **⚡ Smart Priority Engine**: Dynamically computed recommendations derived from upcoming calendar deadlines and inactive roadmap skills (e.g. *“Database CA due tomorrow. Prioritize Academic.”*).
* **Recent Activity Split**: Parallel feed separating recent university updates from industry development milestones.

### 5. 📅 Personal Academic Calendar & Notifications
* **Interactive 2026 Assessment Calendar**: Month-view scheduling with color-coded categories:
  * 🔴 **Assessment (CA)**
  * 🛑 **Final Exam**
  * 🟡 **Presentation**
  * 🟣 **Oral Viva Defense**
  * 🟢 **Practical Lab**
* **Automated Email Reminders**: Scheduled deadline alerts 24 hours prior to exams/assessments, plus a personalized **Sunday Evening Weekly Balance Digest**.

### 6. 👤 Tabbed Profile & Settings
* Tabbed profile editing for **Personal**, **Academic**, **Career Goal**, **Skills Map**, **Study Planning**, and **Professional Links**, with live synchronization to MongoDB.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Built on component-driven architecture with Hooks and Context API |
| **Language** | **TypeScript** | Strict type safety, `verbatimModuleSyntax`, and interface schemas |
| **Tooling & Bundler** | **Vite 8** | Instant Hot Module Replacement (HMR) and optimized build bundles |
| **Animations & Motion** | **Motion (Framer Motion)** | Fluid transitions, micro-interactions, and carousel components |
| **Styling** | **Vanilla CSS Design System** | Custom CSS tokens (`#424B54`, `#B38D97`, `#D5ACA9`, `#EBCFB2`, `#C5BAAF`) |
| **Backend Runtime** | **Node.js (v20+)** | Server-side JavaScript runtime |
| **Backend Framework** | **Express.js 5** | RESTful routing, custom middleware, and role access guards |
| **Database & ODM** | **MongoDB Atlas & Mongoose** | Cloud NoSQL database with strict schema validation |
| **Session & Auth** | **express-session & connect-mongo** | Secure HTTP-only cookies with persistent server-side MongoDB storage |
| **Password Security** | **bcryptjs** | Salted cryptographic password hashing |
| **Stateless Auth** | **jsonwebtoken (JWT)** | Prepared token generation and verification middleware |

---

## 📁 Repository Structure

```
IT_Path/
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & express-session configuration
│   │   ├── controllers/     # Authentication & profile management handlers
│   │   ├── middleware/      # Session auth & role-based access control
│   │   ├── models/          # Mongoose schema definitions (User, Academic, Links)
│   │   ├── routes/          # RESTful API endpoints (/api/auth)
│   │   └── server.js        # Server bootstrap & Express application entry point
│   ├── package.json
│   └── .env                 # Environment configuration (MongoDB URI, Port, Secret)
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Reusable UI primitives (Button, Logo, SectionHeading)
│   │   │   ├── dashboard/   # DualPortalBanner, AcademicPortal, IndustryPortal, Calendar, etc.
│   │   │   ├── landing/     # Hero, HowItWorks, CareerPaths, Features sections
│   │   │   └── layout/      # Navbar, Footer
│   │   ├── context/         # Centralized AuthContext and user state
│   │   ├── pages/           # LandingPage, LoginPage, RegisterPage, DashboardPage, AdminDashboard
│   │   ├── routes/          # ProtectedRoute, AdminRoute, and AppRoutes
│   │   ├── services/        # Frontend API client (authService)
│   │   └── styles/          # Global tokens, typography, and theme CSS
│   ├── package.json
│   ├── tsconfig.app.json    # Strict TypeScript compiler options
│   └── vite.config.ts       # Vite configuration
│
└── README.md                # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v9.x` or higher
* **MongoDB**: A free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/)

---

### 1. Backend Installation & Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `Backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/itpath?retryWrites=true&w=majority
   SESSION_SECRET=your_secure_session_secret_key
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm start
   # or for development mode:
   npm run dev
   ```
   *The backend API will run on `http://localhost:5000`.*

---

### 2. Frontend Installation & Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend client will run on `http://localhost:5173`.*

---

## 🔒 Security & Best Practices

* **Zero Plain-Text Credentials**: Passwords are encrypted with `bcryptjs` using a salt work factor of 10.
* **Session Cookie Hardening**: Sessions use `httpOnly: true`, `sameSite: 'lax'`, and session expiry timeouts stored securely in MongoDB via `connect-mongo`.
* **Role-Based Guards**: Protected routes (`/dashboard`, `/academic`, `/industry`) ensure only authenticated students have access, while separating administrative privileges (`/admin-dashboard`).
* **Environment Isolation**: Database strings, session secrets, and client origins are strictly encapsulated in `.env`.

---

## 📄 License

This project is licensed under the **ISC License**.


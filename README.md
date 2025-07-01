# 🚀 Web Application Project - D1 Evaluation

A modern, full-stack web application built with Next.js, Auth.js, and Shadcn, meticulously crafted to meet the D1 30% evaluation parameters.

![Status](https://img.shields.io/badge/Status-Planning-blue)
![Version](https://img.shields.io/badge/Version-0.1.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)

> This document outlines the phased development plan for a project featuring a complete user authentication system, role-based access control, session management, and full CRUD operations for both admin and non-admin users.

---

## ✨ Core Features & Requirements

This project is designed to fulfill the following key requirements as per the evaluation criteria:

- [cite_start]**Multi-Page Architecture**: The application will have at least three web pages, including a Home page, Login page, Registration page, and a Dashboard page[cite: 5, 6, 7, 8, 9]. [cite_start]Navigation between these pages will be URL-based[cite: 10].
- [cite_start]**Complete Authentication System**: A full login/registration system will be implemented[cite: 11]. [cite_start]This includes dedicated web pages for the login and registration forms[cite: 12, 13].
- [cite_start]**Robust Validation**: User data for both login and registration will be validated on the client-side and server-side[cite: 14, 15].
- [cite_start]**Secure Email Verification**: New users will have their email verified by sending a token to their email address[cite: 16]. [cite_start]This token will only be valid for one day[cite: 17].
- [cite_start]**Session Management**: The dashboard page will only be accessible if a user is successfully logged in or registered[cite: 23]. [cite_start]Any attempt to access the dashboard directly will redirect the user to the login page[cite: 24].
- [cite_start]**User Roles & Role-Based Dashboards**: There will be at least two types of users: `Admin` and `Non-Admin`[cite: 25, 26, 27]. [cite_start]Each user type will have a corresponding dashboard view[cite: 28, 29, 30].
- [cite_start]**CRUD Operations**: Each user can perform create, read, update, and delete operations via their dashboard page[cite: 31].
- [cite_start]**Profile Management**: Users can upload a profile photo during registration, which will be displayed on their dashboard profile[cite: 21, 22]. [cite_start]Non-admins can view their complete profile [cite: 41][cite_start], edit their data [cite: 36][cite_start], and change their profile photo[cite: 37].
- **Secure Password Reset**: Non-admin users can change their password securely. [cite_start]A request will trigger an email with a secret token (valid for one day) to reset the password[cite: 38, 39, 40].
- [cite_start]**Admin Privileges**: An Admin can see a table of all registered users on their dashboard [cite: 33] [cite_start]and can delete any registered user[cite: 34].

## 🛠️ Tech Stack & Tools

A curated selection of modern technologies to build a robust and beautiful application.

| Category            | Technology                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Framework**       | ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)                  |
| **Styling**         | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)  |
| **UI Components**   | ![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-latest-black?style=for-the-badge)                       |
| **Animation**       | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-f200b2?style=for-the-badge&logo=framer)  |
| **Authentication**  | ![Auth.js](https://img.shields.io/badge/Auth.js-v5-blue?style=for-the-badge&logo=auth.js)                   |
| **Database**        | ![MongoDB](https://img.shields.io/badge/MongoDB-latest-47A248?style=for-the-badge&logo=mongodb) w/ Mongoose |
| **Email Service**   | ![Resend](https://img.shields.io/badge/Resend-latest-ea4335?style=for-the-badge)                            |
| **Email Templates** | ![React Email](https://img.shields.io/badge/React_Email-latest-1a1a1a?style=for-the-badge&logo=react)       |
| **Language**        | ![TypeScript](https://img.shields.io/badge/TypeScript-latest-3178C6?style=for-the-badge&logo=typescript)    |

### 🎨 Color Palette: "Northern Lights"

We will strictly adhere to the `Northern Lights` theme installed via `tweakcn.com`.

---

## 🗺️ Development Roadmap

The project is broken down into distinct phases. We will tackle them one by one, updating the status as we proceed.

| Phase | Title                                  | Status           |
| :---: | -------------------------------------- | ---------------- |
|   0   | Project Initialization                 | ✅ `Completed`   |
|   1   | Foundation, Theming & Animation Setup  | 🟡 `In Progress` |
|   2   | Database & Auth.js Integration         | ⚪ `Not Started` |
|   3   | Core User Authentication Flow          | ⚪ `Not Started` |
|   4   | Email & Verification System            | ⚪ `Not Started` |
|   5   | Session Management & Protected Routes  | ⚪ `Not Started` |
|   6   | User Roles & Differentiated Dashboards | ⚪ `Not Started` |
|   7   | CRUD: Non-Admin User                   | ⚪ `Not Started` |
|   8   | CRUD: Admin User                       | ⚪ `Not Started` |

---

### **Phase 0: Project Initialization** `[Status: ✅ Completed]`

- [x] Initialized Next.js 14 project with TypeScript, Tailwind CSS, and App Router.
- [x] Integrated `shadcn/ui` and set the base color to Neutral.
- [x] Added all `shadcn/ui` components to the project.
- [x] Installed `framer-motion` for animations.
- [x] Applied the "Northern Lights" theme from `tweakcn.com`.

### **Phase 1: Foundation, Theming & Animation Setup** `[Status: 🟡 In Progress]`

> **Goal**: Set up the core visual and structural elements of the app. This ensures a consistent design and user experience from the start.

**Objectives:**

- [ ] **Install All Dependencies**: Ensure all remaining libraries for authentication, database, and email are installed.
- [ ] **Setup Theme Provider**: Create a theme provider for light/dark mode toggling.
- [ ] **Create Theme Toggle Component**: Build a UI switch to change themes.
- [ ] **Global Animation Wrapper**: Create a reusable component for page transitions using `framer-motion`.
- [ ] **Setup `react-email`**: Initialize the `react-email` development environment.

**Action Plan:**

1.  **Install Dependencies**:
    ```bash
    npm install next-auth @auth/mongoose-adapter mongoose bcrypt
    npm install resend react-email @react-email/components -E
    npm install -D @types/bcrypt
    ```
2.  Create `components/ThemeProvider.tsx` to handle theme logic.
3.  Add the `ThemeProvider` to the root layout (`src/app/layout.tsx`).
4.  Create `components/ThemeToggle.tsx` using a `shadcn/ui` Switch or Button.
5.  Add the `ThemeToggle` to a shared header or layout component.
6.  Set up the `react-email` package by following its official documentation (e.g., creating an `emails` directory).

### **Phase 2: Database & Auth.js Integration** `[Status: ⚪ Not Started]`

> **Goal**: Configure the backend foundation. We'll connect to our database and set up the main authentication handler.

**Objectives:**

- [ ] **Setup MongoDB Connection**: Create a library function to connect to your MongoDB instance.
- [ ] [cite_start]**Define Mongoose Schemas**: Define the `User` schema to be compatible with `Auth.js` and include the `userType` field[cite: 25].
- [ ] **Configure Auth.js**: Create the `[...nextauth]` route handler with the `CredentialsProvider` and the Mongoose adapter.

### **Phase 3: Core User Authentication Flow** `[Status: ⚪ Not Started]`

> **Goal**: Build the user-facing pages for signing up and logging in.

**Objectives:**

- [ ] [cite_start]**Build Registration Page**: Create the UI and form for user registration, including a file input for the profile photo[cite: 13, 21].
- [ ] [cite_start]**Build Login Page**: Create the UI and form for user login[cite: 12].
- [ ] [cite_start]**Implement Client-Side Validation**: Use `zod` and `react-hook-form` for instant feedback on both forms[cite: 14].
- [ ] [cite_start]**Implement Server-Side Registration Logic**: Create the API endpoint to handle user creation, password hashing, and saving the user to the database[cite: 15, 18].

### **Phase 4: Email & Verification System** `[Status: ⚪ Not Started]`

> **Goal**: Implement the crucial email verification step to ensure users are genuine.

**Objectives:**

- [ ] **Design Email Templates**: Use `react-email` to create templates for verification and password resets.
- [ ] **Integrate Resend**: Configure Resend to send emails.
- [ ] [cite_start]**Implement Email Verification Flow**: On registration, generate and send a unique token that is only valid for one day[cite: 16, 17]. Create an API endpoint to verify the token and activate the user's account.

### **Phase 5: Session Management & Protected Routes** `[Status: ⚪ Not Started]`

> **Goal**: Secure the application by managing user sessions and protecting content.

**Objectives:**

- [ ] [cite_start]**Implement Session Logic**: Ensure Auth.js creates a session on successful login, leading to a success message or navigation[cite: 19].
- [ ] [cite_start]**Protect the Dashboard**: Use Auth.js middleware to protect the `/dashboard` route[cite: 23].
- [ ] [cite_start]**Implement Redirect Logic**: Ensure unauthenticated users trying to access `/dashboard` are redirected to `/login`[cite: 24].

### **Phase 6: User Roles & Differentiated Dashboards** `[Status: ⚪ Not Started]`

> **Goal**: Create different experiences for `Admin` and `Non-Admin` users.

**Objectives:**

- [ ] [cite_start]**Add `userType` to Auth.js Session**: Use callbacks to include the user's role in the session token[cite: 25].
- [ ] [cite_start]**Create a Basic Home Page**: A landing page for all users[cite: 6].
- [ ] [cite_start]**Build Conditional Dashboard**: The main `/dashboard` page will render different components based on the user's role, creating two dashboard types[cite: 28].
- [ ] [cite_start]**Develop Admin & Non-Admin Dashboard UIs**: Create the initial layouts for both views[cite: 29, 30].

### **Phase 7: CRUD: Non-Admin User** `[Status: ⚪ Not Started]`

> **Goal**: Empower users to manage their own data.

**Objectives:**

- [ ] [cite_start]**View Profile**: Display all of the logged-in user's data on their dashboard, including their profile photo[cite: 22, 41].
- [ ] [cite_start]**Edit Profile**: Create a form allowing users to update their information saved in the database[cite: 36].
- [ ] [cite_start]**Change Profile Photo**: Implement the functionality for a user to change their profile photo[cite: 37].
- [ ] [cite_start]**Secure Password Reset**: Implement the "forgot password" flow that sends a secure, one-day valid token via email to reset the password[cite: 38, 39, 40].

### **Phase 8: CRUD: Admin User** `[Status: ⚪ Not Started]`

> **Goal**: Provide administrators with the tools to manage the user base.

**Objectives:**

- [ ] [cite_start]**View All Users**: Fetch and display all registered users in a `shadcn/ui` table on the admin dashboard[cite: 33].
- [ ] [cite_start]**Delete User**: Add functionality for the admin to delete any registered user from the table[cite: 34].

## 🚀 How to Run This Project

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root and add the necessary variables (e.g., `MONGODB_URI`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`, `NEXTAUTH_URL`).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

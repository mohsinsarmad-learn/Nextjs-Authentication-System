# 🚀 Web Application Project - D1 Evaluation

A modern, full-stack web application built with Next.js, Auth.js, and Shadcn, designed to meet all specified evaluation parameters. This project features a complete authentication system, role-based dashboards, and full CRUD capabilities.

![Status](https://img.shields.io/badge/Status-Planning-blue)
![Version](https://img.shields.io/badge/Version-0.1.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)

> **Project Goal**: To develop a secure, feature-rich web application with distinct functionalities for `Admin` and `Non-Admin` users, including token-based email verification, session management, and profile customization.

---

## ✨ Core Features

- **Multi-Page Architecture**: The project will include several key pages: Home, Login, Registration, and a user Dashboard.
- **Complete Authentication System**: A full login/registration flow with both client-side and server-side validation.
- **Secure Email & Password Flows**: Token-based email verification (valid for one day) for new users and a secure password reset mechanism using a similar token system.
- **Session Management**: A protected dashboard route that redirects unauthenticated users to the login page.
- **Dual User Roles**: Two distinct user types: `Admin` and `Non-Admin`.
- **Role-Based Dashboards**: Separate, customized dashboard views and functionalities for each user type.
- **Profile Management**: Users can upload and display a profile photo and edit their personal information.
- **CRUD Operations**: Admins can view and delete users, while non-admins can update their own profiles.

## 🛠️ Tech Stack & Tools

A curated selection of modern technologies to build a robust and beautiful application.

| Category            | Technology                                                                                                 |
| :------------------ | :--------------------------------------------------------------------------------------------------------- |
| **Framework**       | ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)                 |
| **Styling**         | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css) |
| **UI Components**   | ![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-latest-black?style=for-the-badge)                      |
| **Animation**       | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-f200b2?style=for-the-badge&logo=framer) |
| **Authentication**  | ![Auth.js](https://img.shields.io/badge/Auth.js-v5-blue?style=for-the-badge)                               |
| **Database ORM**    | ![Mongoose](https://img.shields.io/badge/Mongoose-latest-880000?style=for-the-badge)                       |
| **Email Service**   | ![Resend](https://img.shields.io/badge/Resend-latest-ea4335?style=for-the-badge)                           |
| **Email Templates** | ![React Email](https://img.shields.io/badge/React_Email-latest-1a1a1a?style=for-the-badge&logo=react)      |
| **Image Hosting**   | ![ImageKit](https://img.shields.io/badge/ImageKit-latest-ff9933?style=for-the-badge&logo=imagekit)         |
| **Language**        | ![TypeScript](https://img.shields.io/badge/TypeScript-latest-3178C6?style=for-the-badge&logo=typescript)   |

### 🎨 Color Palette: "Northern Lights"

We will strictly adhere to the `Northern Lights` theme installed via `tweakcn.com`.

---

## 🗺️ Development Roadmap

This project is broken down into distinct phases. We will follow this plan step-by-step.

| Phase | Title                                 | Status           |
| :---: | :------------------------------------ | :--------------- |
|   0   | Project Initialization                | ✅ `Completed`   |
|   1   | Foundation, Theming & Animation       | ✅ `Completed`   |
|   2   | Database & Auth.js Integration        | ✅ `Completed`   |
|   3   | Core Authentication UI & Logic        | ✅ `Completed`   |
|   4   | Email Verification System             | ✅ `Completed`   |
|   5   | Session Management & Protected Routes | ✅ `Completed`   |
|   6   | Role-Based Dashboards                 | ✅ `Completed`   |
|   7   | CRUD Operations: Non-Admin            | 🟡 `In progress` |
|   8   | CRUD Operations: Admin                | ⚪ `Not Started` |

---

### **Phase 0: Project Initialization** `[Status: ✅ Completed]`

- [x] Initialized Next.js 14 project with TypeScript, Tailwind CSS, and App Router.
- [x] Integrated `shadcn/ui` with the Neutral base color.
- [x] Added all `shadcn/ui` components to the project.
- [x] Installed `framer-motion` for animations.
- [x] Applied the "Northern Lights" theme using `tweakcn.com`.

### **Phase 1: Foundation, Theming & Animation** `[Status: ✅ Completed]`

> **Goal**: Set up the core visual and structural elements for a consistent and polished user experience.

**Objectives:**

- [x] **Install All Dependencies**: Ensure all required libraries are installed.
- [x] **Setup Theme Provider**: Create a `ThemeProvider` for light/dark mode toggling.
- [x] **Create Theme Toggle Component**: Build a UI switch to change themes and place it in the main layout.
- [x] **Global Animation Wrapper**: Create a reusable component for page transitions using `framer-motion`.
- [x] **Setup `react-email`**: Initialize the `react-email` development environment to start building email templates.

**Action Plan:**

1.  **Install Dependencies**:
    ```bash
    npm install next-auth @auth/mongoose-adapter mongoose bcrypt imagekit
    npm install resend react-email @react-email/components -E
    npm install -D @types/bcrypt
    ```

### **Phase 2: Database & Auth.js Integration** `[Status: ✅ Completed]`

> **Goal**: Configure the backend foundation by connecting the database and setting up the main authentication handler.

**Objectives:**

- [x] **Setup MongoDB Connection**: Create a singleton connection function in the `lib` directory.
- [x] **Define Mongoose Schema**: Create the `User` schema including fields for `name`, `email`, `password`, `image` (for profile photo URL), and `userType` (`Admin`/`Non-Admin`).
- [x] **Configure Auth.js**: Create the `app/api/auth/[...nextauth]/route.ts` handler.
- [x] **Add Auth Providers**: Configure the `CredentialsProvider` for email/password login.
- [x] **Integrate Mongoose Adapter**: Intentionally skipped. A manual database logic implementation within the `authorize` functions was chosen to support the custom dual-model authentication structure.

### **Phase 3: Core Authentication UI & Logic** `[Status: ✅ Completed]`

> **Goal**: Build the user-facing pages and API endpoints for registration and login.

**Objectives:**

- [x] **Build Registration Pages**: Created the UI and forms for both User and Admin registration.
- [x] **Build Login Pages**: Created the UI and forms for both User and Admin login.
- [x] **Implement Client-Side Validation**: Used `zod` and `react-hook-form` for instant feedback on all forms.
- [x] **Implement Server-Side Registration Logic**: Created API endpoints to handle user and admin creation, password hashing, and database storage.

### **Phase 4: Email Verification System** `[Status: ✅ Completed]`

> **Goal**: Implement the token-based email verification flow to ensure user authenticity.

**Objectives:**

- [x] **Design Verification Email**: Use `react-email` to create a professional email template for verification.
- [x] **Generate Verification Token**: Upon registration, generate a unique, secure token with a one-day expiry and save it to the database.
- [x] **Integrate Resend**: Configure a function to send the verification email using Resend.
- [x] **Create Verification API**: Build an endpoint that accepts the token, validates it, and updates the user's `emailVerified` status in the database.
- [x] **Block Login for Unverified Users**: Update the `CredentialsProvider` logic to prevent login if a user's email is not verified.

### **Phase 5: Session Management & Protected Routes** `[Status: ✅ Completed]`

> **Goal**: Secure the application by managing user sessions and protecting sensitive content.

**Objectives:**

- [x] **Configure Auth.js Callbacks**: Use the `jwt` and `session` callbacks to add custom data like `userType` and `id` to the session object.
- [x] **Implement Middleware**: Create `middleware.ts` to protect the `/dashboard` route.
- [x] **Test Redirect Logic**: Verify that any attempt to access `/dashboard` without a valid session redirects the user to the `/login` page.

### **Phase 6: Role-Based Dashboards** `[Status: ✅ Completed]`

> **Goal**: Create different dashboard experiences for `Admin` and `Non-Admin` users.

**Objectives:**

- [ ] **Create a Basic Home Page**: Build the main landing page at the root URL.
- [ ] **Build Conditional Dashboard**: The main `/dashboard/page.tsx` will fetch the user session and act as a router.
- [ ] **Render Dashboards Conditionally**: Based on `session.user.userType`, render either the `<AdminDashboard />` or `<NonAdminDashboard />` component.
- [ ] **Develop Initial Dashboard Layouts**: Create the basic UI structure for both dashboard variants.

### **Phase 7: CRUD Operations: Non-Admin** `[Status: 🟡 In Progress]`

> **Goal**: Empower users to view and manage their own profile and security settings.

**Objectives:**

- [ ] **View Profile**: On the Non-Admin dashboard, display all of the logged-in user's data, including their profile photo from ImageKit.
- [ ] **Edit Profile**: Implement a form (e.g., in a `Dialog` or `Sheet`) that allows users to update their name and other details.
- [ ] **Change Profile Photo**: Implement the functionality for a user to upload and change their profile photo **using ImageKit**.
- [ ] **Secure Password Reset**: Build the "forgot/change password" flow that sends a secure, one-day valid token via email to authorize a password change.

### **Phase 8: CRUD Operations: Admin** `[Status: ⚪ Not Started]`

> **Goal**: Provide administrators with the necessary tools to manage the application's user base.

**Objectives:**

- [ ] **View All Users API**: Create an API endpoint that securely fetches all registered users from the database.
- [ ] **Display Users in Table**: On the Admin dashboard, use the `shadcn/ui` `Table` component to display all users.
- [ ] **Implement User Deletion**: Add functionality (e.g., a button on each row) for the admin to delete any registered user. The action should trigger a `DELETE` request to a secure API endpoint.

---

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
    Create a `.env.local` file in the root and add the necessary keys:

    ```env
    # Auth.js
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="YOUR_SUPER_SECRET_KEY_HERE"

    # MongoDB
    MONGODB_URI="your_mongodb_connection_string"

    # Resend
    RESEND_API_KEY="your_resend_api_key"
    EMAIL_FROM="onboarding@resend.dev"

    # ImageKit
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
    IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
    IMAGEKIT_URL_ENDPOINT="your_imagekit_url_endpoint"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

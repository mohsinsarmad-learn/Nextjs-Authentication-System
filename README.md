# 🚀 Web Application Project - D1 Evaluation

A modern, full-stack web application built with Next.js, Auth.js, and Shadcn. [cite\_start]This project is meticulously planned to meet all D1 30% evaluation parameters[cite: 1].

> [cite\_start]This project is a comprehensive user management system featuring a complete authentication flow, role-based access, session management, and full CRUD operations for different user types[cite: 26, 27, 31]. Development will proceed phase-by-phase according to this plan.

## ✨ Core Features & Requirements

This project is engineered to fulfill the following key requirements as per the evaluation criteria:

- [cite\_start]**Multi-Page Architecture**: The application will have at least three primary pages: a Home page [cite: 6][cite\_start], Login page [cite: 7][cite\_start], Registration page [cite: 8][cite\_start], and a Dashboard page[cite: 9]. [cite\_start]URL-based navigation will be implemented between them[cite: 10].
- [cite\_start]**Complete Authentication System**: A full login/registration system [cite: 11] [cite\_start]with dedicated web pages for the login [cite: 12] [cite\_start]and registration forms[cite: 13].
- [cite\_start]**Robust Validation**: User data will be validated on both the client-side and server-side for login and registration[cite: 14, 15].
- [cite\_start]**Secure Email Verification**: User emails will be verified by sending a token[cite: 16]. [cite\_start]This token will be valid for only one day[cite: 17].
- [cite\_start]**Session Management**: The Dashboard page will only be accessible to successfully logged-in or registered users[cite: 23]. [cite\_start]Any attempt to access it directly will redirect to the login page[cite: 24].
- [cite\_start]**Role-Based Access Control**: There will be at least two types of users: `Admin` [cite: 26] [cite\_start]and `Non-Admin`[cite: 27]. [cite\_start]This will dictate access to two different types of dashboards[cite: 28].
- **CRUD Operations**:
  - [cite\_start]**Admin**: Can view all registered users in a table [cite: 33] [cite\_start]and delete any registered user[cite: 34].
  - [cite\_start]**Non-Admin**: Can view their complete profile [cite: 41][cite\_start], edit their data [cite: 36][cite\_start], change their profile photo [cite: 37][cite\_start], and securely change their password via a one-day valid email token[cite: 38, 39, 40].
- [cite\_start]**Profile Management**: Users can upload a profile photo during registration [cite: 21][cite\_start], which will be displayed on their dashboard[cite: 22].

## 🛠️ Tech Stack & Tools

A curated selection of modern technologies to build a robust and beautiful application.

| Category            | Technology      |
| ------------------- | --------------- |
| **Framework**       | w/Nextjs        |
| **Styling**         | w/Tailwindcss   |
| **UI Components**   | w/Shadcn        |
| **Animation**       | w/Framer motion |
| **Authentication**  | w/Auth.js       |
| **Database**        | w/ Mongoose     |
| **Email Service**   | w/Resend        |
| **Email Templates** | w/React-Email   |
| **Language**        | w/TypeScript    |

---

## 🗺️ Development Roadmap

The project is broken down into distinct phases. We will tackle them sequentially.

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

> Setting up the core visual and structural elements for a consistent and modern user experience.

- [ ] **Install All Dependencies**: Ensure `next-auth`, `mongoose`, `bcrypt`, `resend`, and `react-email` are installed.
- [ ] **Setup Theme Provider**: Create and implement a theme provider for light/dark mode toggling.
- [ ] **Global Animation Wrapper**: Create a reusable component for page transitions using `framer-motion`.
- [ ] **Initialize `react-email`**: Set up the development environment for creating email templates.

### **Phase 2: Database & Auth.js Integration** `[Status: ⚪ Not Started]`

> Configuring the backend foundation, connecting to the database, and setting up the main authentication handler.

- [ ] **Setup MongoDB Connection**: Create a library function to handle the MongoDB connection.
- [cite_start][ ] **Define User Schema**: Define the Mongoose `User` schema, including fields for user types (`Admin`/`Non-Admin`)[cite: 25, 26, 27].
- [ ] **Configure Auth.js**: Create the `[...nextauth]` route handler with providers and the Mongoose adapter.

### **Phase 3: Core User Authentication Flow** `[Status: ⚪ Not Started]`

> Building the user-facing pages and backend logic for signing up and logging in.

- [cite_start][ ] **Build Registration Page**: Create the UI with a registration form [cite: 8, 13] [cite\_start]and an input for profile photo upload[cite: 21].
- [cite_start][ ] **Build Login Page**: Create the UI with a login form[cite: 7, 12].
- [cite_start][ ] **Implement Form Validation**: Use `zod` and `react-hook-form` for client-side validation [cite: 14] [cite\_start]and create robust server-side validation checks [cite: 15] for both forms.
- [cite_start][ ] **Implement Registration API**: Create the API endpoint to handle user creation, password hashing, and saving user data into the database[cite: 18].

### **Phase 4: Email & Verification System** `[Status: ⚪ Not Started]`

> Implementing the crucial email verification step to ensure users are genuine.

- [ ] **Design Email Template**: Use `react-email` to create a template for email verification.
- [ ] **Implement Verification Flow**:
  - [cite\_start]On registration, generate a unique token and send a verification email[cite: 16].
  - [cite\_start]The token must be configured to be valid for only one day[cite: 17].
  - Create an API endpoint to verify the token from the email link and activate the user's account.

### **Phase 5: Session Management & Protected Routes** `[Status: ⚪ Not Started]`

> Securing the application by managing user sessions and protecting content.

- [cite_start][ ] **Implement Session Logic**: Ensure Auth.js correctly creates a session and navigates to a new page upon successful login[cite: 19].
- [cite_start][ ] **Protect Dashboard Route**: Use Auth.js middleware to ensure the dashboard is only opened if a user is successfully logged-in[cite: 23].
- [cite_start][ ] **Implement Redirect Logic**: The middleware must redirect any unauthenticated user from `/dashboard` to the login page[cite: 24].

### **Phase 6: User Roles & Differentiated Dashboards** `[Status: ⚪ Not Started]`

> Creating different experiences for `Admin` and `Non-Admin` users.

- [cite_start][ ] **Create Home Page**: Build the main landing page[cite: 6].
- [cite_start][ ] **Add `userType` to Session**: Use Auth.js callbacks to include the user's role in the session token[cite: 25].
- [cite_start][ ] **Build Conditional Dashboard**: The `/dashboard` page [cite: 9] [cite\_start]will render different components based on the user's role, effectively creating two dashboard types[cite: 28].

### **Phase 7: CRUD: Non-Admin User** `[Status: ⚪ Not Started]`

> Empowering non-admin users to manage their own data.

- [cite_start][ ] **View Complete Profile**: Display all of the logged-in user's data on their dashboard [cite: 41][cite\_start], including their profile photo[cite: 22].
- [cite_start][ ] **Edit Profile**: Create a form allowing users to update their data saved in the database[cite: 36].
- [cite_start][ ] **Change Profile Photo**: Implement the functionality for a user to change their profile photo[cite: 37].
- [cite_start][ ] **Secure Password Change**: Implement the "forgot/change password" flow where an email with a secret token (valid for one day) is sent to reset the password securely[cite: 38, 39, 40].

### **Phase 8: CRUD: Admin User** `[Status: ⚪ Not Started]`

> Providing administrators with the tools to manage the user base.

- [cite_start][ ] **View All Users**: On the admin dashboard, fetch and display all registered users in a table[cite: 33].
- [cite_start][ ] **Delete User**: Add functionality for the admin to delete any registered user from the dashboard[cite: 34].

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

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

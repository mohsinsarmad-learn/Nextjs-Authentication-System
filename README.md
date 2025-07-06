# 🚀 Web Application Project (Completed)

A modern, full-stack web application built with Next.js, Auth.js, and Shadcn UI. This project is feature-complete, featuring a robust dual-role authentication system, advanced profile management, and comprehensive admin controls.

![Status](https://img.shields.io/badge/Status-Completed-brightgreen)(.)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)(https://edu2skill.online)

> This application provides a complete blueprint for a secure, feature-rich platform with distinct functionalities and permissions for both standard Users and privileged Admins.

---

## ✨ Core Features

- **Multi-Page Architecture**: Includes Home, context-aware Login/Registration pages, a multi-view Dashboard, and dedicated pages for account recovery and bulk editing.
- **Dual-Role Authentication**: Secure, separate registration and login flows for `User` and `Admin` roles.
- **Advanced Profile Management**: Users and admins can manage their profiles, including:
  - Editing text-based information (name, contact).
  - A Google-style profile picture manager with drag-and-drop, zoom, pan, and rotate functionality.
  - The ability to remove a profile picture or generate a unique, colorful avatar.
- **Robust Admin Dashboard**: A central hub for admins to:
  - View and search all registered users in a real-time table.
  - Perform bulk actions, including bulk deletion and bulk editing of user details.
  - Edit individual user details, including their password, from a secure dialog.
- **Secure Account Recovery**: Token-based "Forgot Password" and password reset flows for both user and admin accounts.
- **Token-Based Verification**: New accounts receive a professionally designed verification email with a one-time link and a scannable QR code to activate their account. The system can also resend the verification email upon a failed login attempt.
- **Modern & Responsive UI**:
  - A polished user interface built with Shadcn UI and animated with Framer Motion.
  - A sticky, "glassmorphism" header that is context-aware, showing different navigation options based on authentication status and the current page.
  - A fully responsive design with a slide-out sheet menu for mobile navigation.

## 🛠️ Tech Stack & Tools

A curated selection of modern technologies used to build this application.

| Category            | Technology                                                                                                                                               |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**       | [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)                                        |
| **Styling**         | [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)                   |
| **UI Components**   | [![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-latest-black?style=for-the-badge)](https://ui.shadcn.com/)                                          |
| **Animation**       | [![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-f200b2?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)             |
| **Authentication**  | [![Auth.js](https://img.shields.io/badge/Auth.js-v5-blue?style=for-the-badge)](https://authjs.dev/)                                                      |
| **Database ORM**    | [![Mongoose](https://img.shields.io/badge/Mongoose-latest-880000?style=for-the-badge)](https://mongoosejs.com/)                                          |
| **Email Service**   | [![Resend](https://img.shields.io/badge/Resend-latest-ea4335?style=for-the-badge)](https://resend.com/)                                                  |
| **Email Templates** | [![React Email](https://img.shields.io/badge/React_Email-latest-1a1a1a?style=for-the-badge&logo=react)](https://react.email/)                            |
| **Image Hosting**   | [![ImageKit](https://img.shields.io/badge/ImageKit-latest-ff9933?style=for-the-badge&logo=imagekit)](https://imagekit.io/)                               |
| **Image Cropping**  | [![React Easy Crop](https://img.shields.io/badge/React_Easy_Crop-latest-blueviolet?style=for-the-badge)](https://github.com/ricardo-ch/react-easy-crop)  |
| **Avatars**         | [![Boring Avatars](https://img.shields.io/badge/Boring_Avatars-latest-important?style=for-the-badge)](https://github.com/boringdesigners/boring-avatars) |
| **Validation**      | [![Zod](https://img.shields.io/badge/Zod-latest-3E6F9B?style=for-the-badge)](https://zod.dev/)                                                           |
| **Language**        | [![TypeScript](https://img.shields.io/badge/TypeScript-latest-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)              |

---

## 📂 Final Project Structure

The project is organized with a clear separation of concerns, making it highly maintainable and scalable.

```
src/
├── app/
│   ├── api/                  # All backend API routes
│   │   ├── auth/             # Handles login, reset-password, etc.
│   │   ├── profile/          # Handles self-profile updates
│   │   └── users/            # Handles admin CRUD operations on users
│   ├── dashboard/
│   │   └── bulk-edit/        # The dedicated page for bulk editing
│   ├── (login, register, etc.)
│   └── ...
├── components/
│   ├── dashboards/           # Admin and User dashboard components
│   ├── ui/                   # Shadcn UI components
│   └── ... (many reusable dialogs, forms, and navigation components)
├── emails/
│   └── ...                   # All React Email templates
├── lib/                      # Shared library functions
│   ├── dbConnect.ts
│   ├── imageUtils.ts
│   └── imagekit.ts
├── models/                   # Mongoose database models
│   ├── Admin.ts
│   └── User.ts
├── schemas/                  # All Zod validation schemas
│   ├── backend/
│   └── frontend/
└── types/                    # Shared TypeScript type definitions
    └── index.ts
```

---

## 🚀 How to Run This Project

1.  **Clone the repository:**

    ```bash
    git clone <https://github.com/mohsinsarmad-learn/Nextjs-Authentication-System.git>
    cd <Nextjs-Authentication-System>
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

    # Next.js App URL
    NEXT_PUBLIC_APP_URL="http://localhost:3000"

    # MongoDB
    MONGODB_URI="your_mongodb_connection_string"

    # Resend (Email Service)
    RESEND_API_KEY="your_resend_api_key"
    EMAIL_FROM="onboarding@resend.dev"
    IT_ADMIN_EMAIL="your_it_department_email@example.com"

    # ImageKit (Image Hosting)
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
    IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
    IMAGEKIT_URL_ENDPOINT="your_imagekit_url_endpoint"
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment of Project

[Nextjs-Authentication-System](https://edu2skill.online)

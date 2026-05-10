# ProfessorCourses Project Architecture Graph

This document serves as a high-level reference graph node for the **ProfessorCourses** project structure, generated for future context.

## 📁 Project Root (`/Users/user/Desktop/ProfessorCourses`)

- `docker-compose.yml`: Multi-container orchestration (MongoDB, Redis, Backend, Frontend).
- `README_LOCAL_DOCKER.md`: Docker setup instructions.
- `.gitignore`: Ignored files and folders.

---

## ⚙️ Backend (`/backend`)
Node.js/Express server built with TypeScript, connected to MongoDB and Redis.

### Core Entry Points
- `server.ts`: Application entry point, connects to DB, sets up Cloudinary, and starts the server on port 8000.
- `app.ts`: Express application setup, configuring CORS, routes, cookies, and error handling.
- `package.json`: Backend dependencies and scripts.

### 🗂 Architecture (MVC + Services)

#### 1. Controllers (`/backend/controllers`)
Handles HTTP requests, extracts parameters, invokes services, and sends responses.
- `user.controller.ts`: Authentication, profile management, role updates.
- `course.controller.ts`: Course creation, editing, uploading, getting video URLs.
- `order.controller.ts`: Order creation and management.
- `notification.controller.ts`: Push notifications management.
- `analytics.controller.ts`: Generates analytics data for admin dashboard.
- `layout.controller.ts`: UI layout customization (Hero, Categories, FAQ).

#### 2. Models (`/backend/models`)
Mongoose schemas and interfaces for MongoDB.
- `user.model.ts`: User schema, password hashing, JWT generation methods.
- `course.model.ts`: Course, CourseData, Reviews, Comments schema.
- `order.model.ts`: Order data schema.
- `notification.model.ts`: Notifications schema.
- `layout.model.ts`: UI Layout components schema.

#### 3. Routes (`/backend/routes`)
Maps endpoints to controller functions, applies middleware.
- `user.routes.ts`: Auth, user profiles, admin user management.
- `course.route.ts`: Course access, adding reviews, Q&A.
- `order.route.ts`: Creating and viewing orders.
- `notification.route.ts`: Getting and updating notifications.
- `analytics.route.ts`: Fetching analytics for admin dashboard.
- `layout.route.ts`: Managing UI layout elements.

#### 4. Middleware (`/backend/middleware`)
- `auth.ts`: `isAuthenticated` (JWT validation & Redis session check), `authorizeRoles`.
- `error.ts` & `catchAsyncErrors.ts`: Error trapping and standardized error responses.

#### 5. Services (`/backend/services`)
Reusable business logic and database queries.
- `user.services.ts`, `course.services.ts`, `order.services.ts`

#### 6. Utilities (`/backend/utils`)
- `db.ts`: MongoDB connection handler.
- `redis.ts` & `redis-mock.ts`: Redis connection handler with a fallback mock setup.
- `jwt.ts`: Token generation, options, and attaching cookies.
- `sendMail.ts`: Nodemailer utility to send emails.
- `analytics.generator.ts`: Utility to aggregate last 12-month metrics.
- `ErroHandler.ts`: Custom Error class.

#### 7. Mails (`/backend/mails`)
EJS email templates (`activation-mail.ejs`, `order-confirmation.ejs`, `question-reply.ejs`).

---

## 🎨 Frontend (`/frontend`)
Next.js 15 application utilizing App Router (`/app`), React 19, Redux Toolkit, and Tailwind CSS.

### Core Configuration
- `package.json`: Frontend dependencies (Next.js, Redux, Tailwind, Framer Motion, MUI).
- `tailwind.config.ts`: Tailwind configuration.
- `next.config.ts`: Next.js configuration.

### 🌐 App Router (`/frontend/app`)
- `layout.tsx`: Root layout, configures fonts, Redux `Providers`, `SessionProvider`, `ThemeProvider`.
- `page.tsx`: Landing page containing Hero section.
- `provider.tsx`: Redux and NextAuth initialization wrapper.

### 🧩 Components (`/frontend/app/components`)
- **Admin/**: Admin dashboard widgets, sidebars, and management views.
  - `Analytics/`: Course, User, Order analytics graphs.
  - `Course/`: Admin tools to create and edit courses.
  - `Customization/`: Tools to edit Hero, Categories, FAQ.
  - `Users/`, `Order/`: List and manage users and orders.
- **Teacher/**: Teacher-specific dashboard and tools.
  - `Course/`: Specialized course creation and tracking for teachers.
- **Auth/**: `Login.tsx`, `SignUp.tsx`, `Verification.tsx`.
- **Course/**: Public/User components (`CourseContent.tsx`, `CourseDetails.tsx`).
- **Profile/**: User profile management (`SideBarProfile.tsx`, `ChangePassword.tsx`, `MyCourses.tsx`).
- **Route/**: Homepage and generic route components (`Hero.tsx`).

### 📦 State Management (`/frontend/redux`)
- `store.ts`: Redux store configuration combining multiple slices.
- `features/api/apiSlice.ts`: Base RTK Query API slice for remote data fetching.
- `features/courses/coursesApi.ts`: Specific RTK Query endpoints for courses.
- `features/auth/authSlice.ts`: Local state management for authentication.

---

## 🔗 Key Interactions

1. **Authentication Flow**:
   - Frontend `Auth/Login.tsx` calls backend `/api/v1/login`.
   - Backend `user.controller.ts` authenticates, `jwt.ts` generates Access & Refresh tokens.
   - Tokens are attached as HTTP-only cookies and Session is stored in Redis.
   - Frontend `apiSlice.ts` uses cookies automatically for subsequent protected requests.
2. **Course Delivery Flow**:
   - Users view courses on Frontend.
   - Purchased course accesses `/api/v1/get-course-content/:id`.
   - Backend retrieves data from MongoDB, authenticates via Redis session.
3. **Admin/Teacher Dashboard**:
   - Frontend components use RTK Query to access `/api/v1/...-analytics` and management endpoints.
   - Backend `analytics.generator.ts` processes raw data into monthly aggregates.

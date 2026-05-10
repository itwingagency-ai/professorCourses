# PROJECT_CONTEXT.md — LMS (professorCourses)
> **Complete AI context map. Read this INSTEAD of scanning the repo.**
> Last updated: 2026-05-10

---

## 1. Stack

| Layer | Tech | Version |
|---|---|---|
| Backend | Node.js + Express + TypeScript | Express 4.21, TS 5.6 |
| Database | MongoDB (Mongoose 8.7) + Redis (ioredis 5.4) | Mongo 7, Redis 7 |
| Frontend | Next.js 14 (App Router) + TypeScript | Next 15.0.1 |
| State | Redux Toolkit 2.3 + RTK Query | |
| Auth | JWT (access 5m + refresh 3d via httpOnly cookies) | jsonwebtoken 9 |
| Media | VdoCipher (video), Cloudinary (images) | |
| Email | Nodemailer + EJS templates | |
| Payments | Stripe (currently mock keys in dev) | stripe 22.1 |
| Infra | Docker Compose (frontend:3000, backend:8000, mongo:27017, redis:6379) | |
| Fonts | Poppins, Josefin Sans, Inter, Outfit (Google Fonts) | |
| UI Libs | MUI 6.1, react-icons, framer-motion, react-pro-sidebar, recharts | |
| CSS | Tailwind CSS 3.4 | |

---

## 2. Repo Structure (Complete File Tree)

```
docker-ready-project/
├── docker-compose.yml          # 4 services: mongo, redis, backend, frontend
├── PROJECT_CONTEXT.md          # THIS FILE
├── project.md / report.md      # Project documentation
├── .gitignore
│
├── backend/
│   ├── app.ts                  # Express app: CORS, body-parser, cookie-parser, route mounting, error middleware
│   ├── server.ts               # Cloudinary config, DNS override (8.8.8.8), app.listen, connectDB()
│   ├── package.json            # "dev": ts-node-dev, "seed": ts-node scripts/seed.ts
│   ├── tsconfig.json
│   ├── Dockerfile              # Backend container
│   ├── .env                    # Local dev env vars
│   ├── .env.docker             # Docker env vars
│   ├── .env.local.example      # Template
│   │
│   ├── controllers/
│   │   ├── user.controller.ts      # 500 lines: register, activate, login, logout, updateAccessToken, getUserInfo, socialAuth, updateUserInfo, updatePassword, updateProfilePicture, getAllUsers, updateUserRole, deleteUser
│   │   ├── course.controller.ts    # 763 lines: uploadCourse, editCourse, getSingleCourse, getAllCourse, getCourseByUser, addQuestion, addAnswer, addReview, addReplyToReview, getAdminAllCourses, deleteCourse, generateVideoUrl
│   │   ├── order.controller.ts     # 239 lines: createOrder, getAllOrders, sendStripePublishableKey, newPayment
│   │   ├── notification.controller.ts  # getNotifications, updateNotification
│   │   ├── analytics.controller.ts     # getUserAnalytics, getCourseAnalytics, getOrderAnalytics
│   │   └── layout.controller.ts        # createLayout, editLayout, getLayout
│   │
│   ├── models/
│   │   ├── user.model.ts           # IUser: name, email, password, avatar, role("admin"|"student"|"teacher"|"user"), isverified, courses. Methods: comparePassword, SignAccessToken, SignRefreshToken. Pre-save bcrypt hash. Includes isStudentRole helper.
│   │   ├── course.model.ts         # ICourse: name, description, category, price, estimatedPrice, thumbnail, tags, level, demoUrl, benefits[], prerequisites[], reviews[IReview], courseData[ICourseData{title,description,videoUrl,videoSection,videoLength,videoPlayer,links[],suggestion,questions[IComment]}], ratings, purchased. Timestamps.
│   │   ├── order.model.ts          # IOrder: courseId, userId, payment_info. Timestamps.
│   │   ├── notification.model.ts   # INotification: title, message, status("unread"|"read"). Timestamps.
│   │   └── layout.model.ts         # Layout: type("Banner"|"FAQ"|"Categories"), banner{image,title,subTitle}, faq[], categories[].
│   │
│   ├── middleware/
│   │   ├── auth.ts                 # isAuthenticated (JWT verify from cookie → redis lookup → req.user), authorizeRoles(...roles) normalises "user"->"student", authorizeStudent() helper
│   │   ├── catchAsyncErrors.ts     # CatchAsyncError wrapper
│   │   └── error.ts               # ErrorMiddleware (global error handler)
│   │
│   ├── services/
│   │   ├── user.services.ts        # getUserById (from redis), getAllUsersService, updateUserRoleService
│   │   ├── course.services.ts      # createCourse (CourseModel.create), getAllCoursesService
│   │   └── order.services.ts       # newOrder, getAllOrdersService
│   │
│   ├── utils/
│   │   ├── jwt.ts                  # sendToken(user, statusCode, res): signs access+refresh tokens, sets httpOnly cookies, stores session in redis (7d TTL). accessTokenOptions/refreshTokenOptions exported.
│   │   ├── redis.ts                # Creates ioredis client with fallback to in-memory RedisMock via Proxy pattern. retryStrategy: null (no retries), connectTimeout: 5s, lazyConnect.
│   │   ├── db.ts                   # connectDB(): tries DB_URL, falls back to MongoMemoryServer in dev if DNS/connection fails. Retries every 5s on failure.
│   │   ├── sendMail.ts             # Nodemailer + EJS template renderer
│   │   ├── ErroHandler.ts          # class ErrorHandler extends Error { statusCode }
│   │   ├── analytics.generator.ts  # Monthly aggregation helper for dashboard charts
│   │   ├── redis-mock.ts           # Standalone RedisMock class
│   │   └── mockData.ts             # Mock data utilities
│   │
│   ├── routes/
│   │   ├── user.routes.ts          # All user endpoints (see API table below)
│   │   ├── course.route.ts         # All course endpoints
│   │   ├── order.route.ts          # Order + Stripe payment endpoints
│   │   ├── notification.route.ts   # Admin notification endpoints
│   │   ├── analytics.route.ts      # Admin analytics endpoints
│   │   └── layout.route.ts         # Layout CRUD endpoints
│   │
│   ├── scripts/
│   │   └── seed.ts                 # Seeds 3 users (admin/teacher/student) + 8 courses with reviews, questions, and courseData. Run: npm run seed
│   │
│   └── mails/
│       ├── activation-mail.ejs     # OTP activation email template
│       ├── order-confirmation.ejs  # Order receipt email template
│       └── question-reply.ejs      # Q&A reply notification email
│
└── frontend/
    ├── package.json                # Next.js 15, React 19 RC, RTK, MUI, Stripe, framer-motion
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── Dockerfile
    ├── .env / .env.docker / .env.local
    │
    ├── app/
    │   ├── layout.tsx              # Root layout: "use client", Providers > SessionProvider > ThemeProvider > children + Footer + Toaster. Loads Poppins/Josefin/Inter/Outfit fonts.
    │   ├── provider.tsx            # Redux Provider + AuthInitializer (auto-loads user via useLoadUserQuery, shows Loader until authChecked)
    │   ├── page.tsx                # Home page (16KB): Hero section, course listing, reviews, FAQ
    │   ├── globals.css             # Tailwind + custom styles
    │   ├── not-found.tsx           # Custom 404 page
    │   │
    │   ├── course/[id]/page.tsx    # Course detail page (23KB, 613 lines): shows course info pre-purchase, handles enrollment for free courses via createOrder, redirects to course-access if already purchased. Uses handleMainAction() flow.
    │   ├── course-access/[id]/     # Post-enrollment course player page
    │   ├── courses/page.tsx        # Course listing/browse page
    │   ├── my-courses/             # User's enrolled courses
    │   ├── profile/                # User profile page
    │   ├── about/ faq/ policy/     # Static pages
    │   ├── teacher/                # Teacher dashboard (page.tsx + create-course/)
    │   │
    │   ├── admin/                  # Admin dashboard
    │   │   ├── page.tsx            # Admin home
    │   │   ├── courses/            # Manage courses
    │   │   ├── create-course/      # Create new course
    │   │   ├── edit-course/        # Edit existing course
    │   │   ├── users/              # User management
    │   │   ├── team/               # Team management
    │   │   ├── invoices/           # Order invoices
    │   │   ├── hero/               # Edit hero banner
    │   │   ├── faq/                # Edit FAQ
    │   │   ├── categories/         # Edit categories
    │   │   ├── courses-analytics/  # Course analytics charts
    │   │   ├── users-analytics/    # User analytics charts
    │   │   └── orders-analytics/   # Order analytics charts
    │   │
    │   ├── hooks/
    │   │   ├── adminProtected.tsx       # Redirects non-admin users
    │   │   ├── teacherProtected.tsx     # Redirects non-teacher users
    │   │   ├── useprotected.tsx         # Protected() - redirects unauthenticated users
    │   │   └── userAuth.tsx             # useSelector hook for auth state
    │   │
    │   ├── utils/
    │   │   ├── CoursePlayer.tsx     # VdoCipher player: fetches OTP via POST /getVdoCipherOpt with axios
    │   │   ├── CustomModal.tsx     # Reusable MUI modal wrapper
    │   │   ├── Heading.tsx         # <head> title/description/keywords setter
    │   │   ├── NavItems.tsx        # Navigation link definitions (Home, Courses, About, Policy, FAQ)
    │   │   ├── Ratings.tsx         # Star rating display (BsStarFill/BsStarHalf/BsStar)
    │   │   ├── ThemeSwitcher.tsx   # Dark/light mode toggle
    │   │   └── theme-provider.tsx  # next-themes ThemeProvider wrapper
    │   │
    │   ├── components/
    │   │   ├── Header.tsx          # Main nav header (10KB): mobile menu, auth modals (Login/SignUp/Verification), uses next-auth/react for social login
    │   │   ├── Footer.tsx          # Site footer (5KB)
    │   │   ├── Auth/
    │   │   │   ├── Login.tsx       # Login form (Formik + Yup validation, social auth buttons)
    │   │   │   ├── SignUp.tsx      # Registration form
    │   │   │   └── Verification.tsx # OTP input with framer-motion animation
    │   │   ├── Course/
    │   │   │   ├── CheckOutForm.tsx     # Stripe checkout form
    │   │   │   ├── CourseReview.tsx     # Course review display + submit form
    │   │   │   └── LessonQuestions.tsx  # Q&A section within lessons
    │   │   ├── Profile/
    │   │   │   ├── Profile.tsx         # Profile page container
    │   │   │   ├── ProfileInfo.tsx     # Profile info editor
    │   │   │   ├── SideBarProfile.tsx  # Profile sidebar navigation
    │   │   │   ├── ChangePassword.tsx  # Password change form
    │   │   │   └── MyCourses.tsx       # User's purchased courses grid
    │   │   ├── Admin/
    │   │   │   ├── DashboardHeader.tsx     # Admin header with notifications
    │   │   │   ├── DashboardHero.tsx       # Admin dashboard hero section
    │   │   │   ├── sidebar/AdminSideBar.tsx # Admin navigation sidebar (MUI icons)
    │   │   │   ├── Course/
    │   │   │   │   ├── AllCourses.tsx      # Course list table (MUI DataGrid)
    │   │   │   │   ├── CreateCourse.tsx    # Multi-step course creation wizard
    │   │   │   │   ├── EditCourse.tsx      # Course editor (loads existing data)
    │   │   │   │   ├── CourseInformation.tsx # Step 1: basic info form
    │   │   │   │   ├── CourseData.tsx      # Step 2: video sections/content
    │   │   │   │   ├── CourseContent.tsx   # Step 3: full content editor (24KB)
    │   │   │   │   ├── CoursePreview.tsx   # Step 4: preview before publish
    │   │   │   │   └── CourseOptions.tsx   # Step indicator/navigation
    │   │   │   ├── Customization/
    │   │   │   │   ├── EditHero.tsx        # Banner image/text editor
    │   │   │   │   ├── EditFaq.tsx         # FAQ editor
    │   │   │   │   └── EditCategories.tsx  # Categories editor
    │   │   │   ├── Users/ Analytics/ Order/ Widgets/ # Admin sub-sections
    │   │   ├── Teacher/
    │   │   │   ├── TeacherDashboardHeader.tsx
    │   │   │   ├── TeacherDashboardHero.tsx
    │   │   │   ├── sidebar/TeacherSideBar.tsx
    │   │   │   └── Course/ (TeacherCourseContent, TeacherCourseData, etc.)
    │   │   ├── Route/Hero.tsx      # Home page hero section
    │   │   └── Loader/             # Loading spinner component
    │
    ├── redux/
    │   ├── store.ts                # configureStore: apiSlice.reducer + authSlice. Exports RootState, AppDispatch.
    │   └── features/
    │       ├── api/apiSlice.ts         # RTK Query base: baseUrl from API_BASE_URL, credentials:"include", tagTypes: [User, Courses, Course]. Endpoints: refreshToken (GET /refresh), loadUser (GET /me → dispatches UserLoggedIn/UserLoggedOut).
    │       ├── auth/
    │       │   ├── authSlice.ts        # State: {token, user, authChecked}. Actions: UserRegistration, UserLoggedIn, UserLoggedOut, AuthChecked.
    │       │   └── authApi.ts          # register→POST /registration, activation→POST /activate-user, login→POST /login (invalidates User), socialAuth→POST /social-auth, logOut→GET /logout (resets API state).
    │       ├── user/userApi.ts         # updateProfile→PUT /update-user-info, updateAvatar→PUT /update-user-avatar, updatePassword→PUT /update-user-password, getAllUsers→GET /get-users, deleteUser→DELETE /delete-user/:id
    │       ├── courses/coursesApi.ts   # createCourse, getAllCourses, getSingleCourse, getCourseContent, deleteCourse, getAdminAllCourses, editCourse, addQuestion, addReview. Tag-based cache invalidation.
    │       ├── orders/ordersApi.ts     # createOrder→POST /create-order (invalidates User+Courses+Course), createPaymentIntent→POST /payment, getAllOrders→GET /get-orders
    │       ├── analytics/analytics.ts  # getCoursesAnalytics, getOrdersAnalytics, getUsersAnalytics
    │       └── layout/layoutApi.ts     # getHeroData→GET /get-layout/:type, editLayout→PUT /edit-layout
    │
    ├── lib/
    │   ├── apiConfig.ts            # API_BASE_URL (from NEXT_PUBLIC_SERVER_API), SOCKET_SERVER_URI, normalizeApiUrl()
    │   └── normalizers.ts          # normalizeCoursesResponse, normalizeSingleCourseResponse, normalizeCourseContentResponse — handles multiple API response shapes
    │
    └── pages/
        └── api/auth/[...nextauth].ts  # NextAuth config (Google + GitHub providers)
```

---

## 3. Backend API — Base: `/api/v1`

### Auth / User (`user.routes.ts`)
| Method | Endpoint | Middleware | Handler |
|--------|----------|------------|---------|
| POST | `/registration` | none | `registrationUser` — creates activation JWT with 4-digit OTP, currently BYPASSES email (logs to console) |
| POST | `/activate-user` | none | `activateUser` — verifies OTP, creates user in DB |
| POST | `/login` | none | `loginUser` — validates credentials, calls `sendToken()` |
| GET | `/logout` | updateAccessToken, isAuthenticated | `logoutUser` — clears cookies + redis session |
| GET | `/refresh` | updateAccessToken | inline handler — returns access_token from cookie |
| GET | `/me` | updateAccessToken, isAuthenticated | `getUserInfo` — gets user from redis via `getUserById()` |
| POST | `/social-auth` | none | `socialAuth` — find-or-create user, calls `sendToken()` |
| PUT | `/update-user-info` | updateAccessToken, isAuthenticated | `updateUserInfo` — updates name only (email update commented out) |
| PUT | `/update-user-password` | updateAccessToken, isAuthenticated | `updatePassword` |
| PUT | `/update-user-avatar` | updateAccessToken, isAuthenticated | `updateProfilePicture` — Cloudinary upload |
| GET | `/get-users` | updateAccessToken, isAuthenticated, admin | `getAllUsers` |
| PUT | `/update-user` | updateAccessToken, isAuthenticated, admin | `updateUserRole` |
| DELETE | `/delete-user-request/:id` | updateAccessToken, isAuthenticated, admin | `deleteUser` |

### Course (`course.route.ts`)
| Method | Endpoint | Middleware | Handler |
|--------|----------|------------|---------|
| POST | `/create-course` | updateAccessToken, isAuthenticated, admin | `uploadCourse` — Cloudinary or placeholder thumbnail |
| PUT | `/edit-course/:id` | updateAccessToken, isAuthenticated, admin | `editCourse` — handles thumbnail as object/string/URL |
| GET | `/get-course/:id` | none | `getSingleCourse` — redis-cached, excludes videoUrl/questions/links |
| GET | `/get-courses` | none | `getAllCourse` — redis-cached ("allCourses" key, 7d TTL) |
| GET | `/get-course-content/:id` | updateAccessToken, isAuthenticated | `getCourseByUser` — enrollment check via `userHasCourseAccess()` |
| PUT | `/add-question` | updateAccessToken, isAuthenticated | `addQuestion` — enrollment check, creates Notification |
| PUT | `/add-answer` | updateAccessToken, isAuthenticated | `addAnswer` — sends email if answerer ≠ questioner |
| PUT | `/add-review/:id` | updateAccessToken, isAuthenticated | `addReview` — enrollment check, recalculates avg rating |
| PUT | `/add-reply` | updateAccessToken, isAuthenticated, admin | `addReplyToReview` |
| GET | `/get-admin-courses` | updateAccessToken, isAuthenticated, admin | `getAdminAllCourses` |
| POST | `/getVdoCipherOpt` | none | `generateVideoUrl` — proxies to VdoCipher API |
| DELETE | `/delete-course/:id` | updateAccessToken, isAuthenticated, admin | `deleteCourse` — invalidates + rebuilds redis cache |

### Order (`order.route.ts`)
| Method | Endpoint | Middleware | Handler |
|--------|----------|------------|---------|
| POST | `/create-order` | updateAccessToken, isAuthenticated | `createOrder` — validates Stripe payment (if `payment_info.id`), checks duplicate purchase, adds course to user.courses[], increments course.purchased, creates Order + Notification, sends email |
| GET | `/get-orders` | updateAccessToken, isAuthenticated, admin | `getAllOrders` |
| GET | `/payment/stripepublishablekey` | none | `sendStripePublishableKey` |
| POST | `/payment` | isAuthenticated | `newPayment` — creates Stripe PaymentIntent |

### Other Routes
- **Notifications**: GET `/get-all-notifications` (admin), PUT `/update-notification/:id` (admin)
- **Analytics**: GET `/get-users-analytics`, `/get-courses-analytics`, `/get-orders-analytics` (all admin)
- **Layout**: POST `/create-layout` (admin), PUT `/edit-layout` (admin), GET `/get-layout/:type` (public)

---

## 4. Key Patterns & Conventions

### Authentication Flow
1. `POST /registration` → 4-digit OTP created, JWT signed with ACTIVATION_SECRET (5m expiry). **Email currently bypassed** — OTP logged to console + returned in response.
2. `POST /activate-user` → verifies OTP JWT, creates user in MongoDB
3. `POST /login` → `sendToken()` signs access (5m) + refresh (3d) tokens, sets httpOnly cookies, stores user JSON in Redis (7d TTL)
4. **Every protected route** chains: `updateAccessToken` → `isAuthenticated` → handler
5. `updateAccessToken` reads refresh_token cookie → verifies → issues new access+refresh → stores in Redis
6. `isAuthenticated` reads access_token cookie → verifies → loads user from Redis → sets `req.user`
7. `authorizeRoles("admin")` checks `req.user.role`

### Redis Caching Strategy
- **User sessions**: key = `user._id`, value = JSON user object, TTL = 7 days
- **All courses**: key = `"allCourses"`, value = JSON array (excludes videoUrl/questions/links), TTL = 7 days
- **Single course**: key = `courseId`, value = JSON course object, TTL = 7 days
- Cache invalidated on: create/edit/delete course → deletes "allCourses" → rebuilds immediately
- **Fallback**: `RedisMock` in-memory class via Proxy pattern when Redis unavailable

### Database Fallback
- Primary: `DB_URL` from `.env` (Atlas or local MongoDB)
- Fallback 1: If `DB_URL` is empty/"memory" → starts `MongoMemoryServer`
- Fallback 2: If Atlas connection fails (ENOTFOUND/ETIMEOUT) in dev → falls back to `MongoMemoryServer`
- Retries every 5s on connection failure

### Course Purchase Flow (Frontend → Backend)
1. User browses `/get-courses` (public, redis-cached)
2. Views detail on `/course/[id]` page → calls `getSingleCourse`
3. **Free course**: `handleMainAction()` in `page.tsx` calls `createOrder` with `payment_info: {type:"local-mock"}`
4. **Paid course**: Shows Stripe CheckOutForm → creates PaymentIntent → `createOrder` with Stripe payment_info
5. Backend `createOrder`: validates payment, checks duplicates, creates Order doc, pushes `{courseId, name, thumbnail, purchasedAt}` to `user.courses[]`, increments `course.purchased`, updates Redis user session
6. Frontend dispatches `UserLoggedIn` with refreshed user data to update Redux state
7. User accesses content via `/course-access/[id]` → calls `getCourseByUser` (enrollment verified via `userHasCourseAccess()`)

### Frontend State Management
- **Store**: 2 reducers: `apiSlice.reducer` (RTK Query cache) + `authSlice` (token, user, authChecked)
- **Auth init**: `provider.tsx` → `AuthInitializer` calls `useLoadUserQuery` on mount → dispatches `UserLoggedIn` or `UserLoggedOut` → sets `authChecked: true`
- **Tag-based cache invalidation**: `User`, `Courses`, `Course` tags used across all API slices
- `createOrder` invalidates ALL tags (`User + Courses + Course`) to refresh everything after purchase

### Error Handling
- Backend: `CatchAsyncError` wrapper → `ErrorHandler(message, statusCode)` → `ErrorMiddleware`
- Frontend: `react-hot-toast` for user notifications, console.log for development debugging

---

## 5. Environment Variables

### Backend `.env`
```
PORT=8000
ORIGIN=http://localhost:3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/lms
REDIS_URL=redis://localhost:6379
ACCESS_TOKEN=<jwt-secret>
REFRESH_TOKEN=<jwt-secret>
ACTIVATION_SECRET=<secret>
CLOUD_NAME / CLOUD_API_KEY / CLOUD_SECRET_KEY  (Cloudinary)
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD  (Gmail)
VDOCIPHER_API_SECRET
STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY  (mock in dev)
```

### Frontend `.env`
```
NEXT_PUBLIC_SERVER_API=http://localhost:8000/api/v1/
NEXT_PUBLIC_SOCKET_SERVER_URI=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
SECRET=the3S
```

---

## 6. Seed Data (npm run seed)
- **3 Users**: admin@example.com (admin), teacher@example.com (user), student@example.com (user). Password: `password123`
- **8 Courses**: Web Dev, Python DS, UI/UX, Flutter, DevOps, AI (FREE, price=0), Cybersecurity, AWS. Each has 2-4 courseData items with YouTube demo URLs, reviews, and questions.

---

## 7. Docker Compose Services
```yaml
mongo:     mongo:7, port 27017, volume lms_mongo_data
redis:     redis:7-alpine, port 6379
backend:   ./backend/Dockerfile, port 8000, env: .env.docker, depends: mongo+redis
frontend:  ./frontend/Dockerfile, port 3000, env: .env.docker, depends: backend
```
Network: `lms_network` (bridge). Start: `docker compose up --build`

---

## 8. Known Dev Workarounds & Gotchas
1. **Email bypass**: Registration email is commented out in `user.controller.ts`. OTP is logged to console and returned in the API response for local testing.
2. **Stripe mock**: `STRIPE_SECRET_KEY=sk_test_mock` — Stripe calls will fail. Free courses use `payment_info: {type:"local-mock"}` to bypass.
3. **DNS override**: `server.ts` sets `dns.setServers(['8.8.8.8', '8.8.4.4'])` to work around local DNS issues with Atlas.
4. **Redis fallback**: If Redis is unreachable, the app silently switches to in-memory `RedisMock`. Sessions are lost on restart.
5. **MongoMemoryServer**: Used as fallback when Atlas/local MongoDB is unreachable. Data is ephemeral.
6. **Cloudinary fallback**: If Cloudinary env vars are missing, thumbnail uploads use a placeholder URL.
7. **`userHasCourseAccess()`**: Utility in `course.controller.ts` and `order.controller.ts` handles multiple ID formats (string, object with courseId, nested _id). Duplicated across files.
8. **`normalizers.ts`**: Frontend handles inconsistent API response shapes (data.course vs data.courses vs data.data.course).
9. **`isverified` vs `isVerified`**: Model field is `isverified` (lowercase v) but seed data uses `isVerified`. Mongoose ignores the mismatch silently.

---
*Auto-indexed by Graphify. Do not remove this file.*

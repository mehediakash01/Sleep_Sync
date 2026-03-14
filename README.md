# 🌙 SleepSync

**SleepSync** is an AI-powered sleep tracking and coaching web application. It helps users log their nightly sleep sessions, visualise trends, maintain streaks, receive personalised AI-generated tips, and stay on top of their rest with smart notifications — all in one place.

---

## ✨ Features

### 🛏️ Sleep Tracking
- Log every sleep session with date, bed time, wake-up time, sleep quality (1–5), and mood
- Record before-bed factors: caffeine, alcohol, workout, heavy meal, late screen time, stressful day
- Add optional freeform notes per session
- 4-step guided wizard form so users are never lost

### 📊 Dashboard & Analytics
- **Overview** — quick stats, recent log table, sleep quality chart, sleep trend chart, and today's AI sleep tip
- **Sleep History** — full paginated table of all past sessions with colour-coded quality badges
- **Sleep Insights** — trend charts and mood analysis powered by Recharts
- **Sleep Streaks** — current streak, longest streak, heatmap calendar, and milestone badges

### 🤖 AI Sleep Coach
- Real-time chat interface powered by **Google Gemini AI**
- Persistent conversation history stored in `localStorage`
- Suggested starter prompts for new users
- Personalised AI tips generated from recent sleep data (`/api/aiTips`)

### 🔥 Streaks System
- Tracks consecutive nights of logged sleep
- Milestone badges (3, 7, 14, 21, 30, 60 nights)
- Public marketing page explaining the streak mechanic
- Dashboard streak page with full heatmap calendar

### 🔔 Notification System
- In-app notification bell with unread badge count
- Four notification types: `SLEEP_LOGGED`, `STREAK`, `POOR_SLEEP`, `BEDTIME_REMINDER`
- Per-user notification settings: email on/off, bedtime reminder, poor sleep alerts, streak alerts
- Email delivery via **Nodemailer + Gmail SMTP**
- Bedtime reminder check endpoint (`/api/notifications/bedtime-check`)

### 📝 Blog & Community
- Static blog articles with slug-based routing
- Comments section (create / read) per article
- Like / unlike per article
- Suggested related posts sidebar

### 🔐 Authentication
- Email + password registration with bcrypt hashing
- NextAuth v4 JWT sessions
- Protected routes via `getServerSession` / middleware redirect

---

## 🗂️ Project Structure

```
sleep-sync/
 app/
    page.tsx                   # Public landing page
    layout.tsx                 # Root layout (Navbar, Footer, Toaster)
    about/                     # About page
    AiCoach/                   # AI chat interface
    blogs/                     # Blog listing + individual post
    Streak/                    # Public streak marketing page
    login/ & register/         # Auth pages
    notification/              # Notification centre
    dashboard/
       page.tsx               # Dashboard overview
       sleepTracking/         # 4-step sleep log wizard
       sleepHistory/          # Full session history table
       sleepInsights/         # Charts & analytics
       sleepImprove/          # AI tips section
       streak/                # Streak dashboard page
    api/
        auth/[...nextauth]/    # NextAuth handler
        register/              # User registration
        sleep/                 # Create sleep log
        sleepLogs/             # Fetch user sleep logs
        streak/                # Streak data
        aiChat/                # Gemini chat endpoint
        aiTips/                # AI tip generation
        comments/              # Blog comments
        likes/                 # Blog likes
        notifications/         # CRUD + read-all + bedtime-check
        notification-settings/ # Per-user notification preferences
 Components/
    Banner.tsx
    Features.tsx
    AiSleepCoach.tsx
    Streaks.tsx
    Testimonials.tsx
    SleepStats.tsx             # Animated count-up stats section
    HowItWorks.tsx             # 4-step explainer section
    FAQ.tsx                    # Accordion FAQ section
    CallToAction.tsx
    NotificationBell.tsx
    BedtimeReminderCheck.tsx
    Navbar.tsx / DashNavbar.tsx / Sidebar.tsx
    ...more
 prisma/
    schema.prisma              # Data models
    migrations/                # Migration history
 lib/
    gemini.ts                  # Google Gemini client
    email.ts                   # Nodemailer helpers
    notifications.ts           # Notification creation helpers
 data/
    blog.ts                    # Static blog content
 Action/
     AskAiBtn.tsx
     SleepTrackBtn.tsx
     LoggedOutBtn.tsx
```

---

## 🗄️ Database Schema

Six Prisma models backed by **MySQL**:

| Model | Key Fields |
|---|---|
| `User` | id, name, email, password, createdAt |
| `SleepLog` | userId, dateOfSession, timeInBed, wakeUpTime, sleepQuality, mood, duration, factors… |
| `Comment` | blogId, userId, user, message |
| `Like` | blogId, userId (unique pair) |
| `Notification` | userId, type, title, message, isRead |
| `NotificationSetting` | userId, emailEnabled, bedtimeReminder, bedtimeHour/Minute, poorSleepAlert, streakAlert |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Animations | Framer Motion 12 |
| Database | MySQL + Prisma 6 |
| Auth | NextAuth v4 (JWT) |
| AI | Google Gemini (`@google/genai`) |
| Charts | Recharts |
| Forms | React Hook Form |
| Email | Nodemailer + Gmail SMTP |
| Icons | Lucide React + React Icons |
| HTTP client | Axios |
| Toasts | React Hot Toast |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sleep-sync.git
cd sleep-sync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/sleep_sync"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Cloudflare Browser Rendering Crawl API
CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"

# Crawl endpoint access control
# Comma-separated admin emails allowed to call /api/crawl-knowledge and /api/crawl-status/[jobId]
CRAWL_ADMIN_EMAILS="admin@example.com,owner@example.com"
# Optional cron secret header for server-to-server jobs (send as x-cron-secret)
CRAWL_CRON_SECRET="your-random-cron-secret"

# Nodemailer (Gmail SMTP)
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-gmail-app-password"
```

> **Gmail App Password**: Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords) and generate a password for "Mail". Use that 16-character code instead of your real Gmail password.

### 4. Set up the database

```bash
# Run all migrations
npx prisma migrate deploy

# Generate the Prisma client
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔑 Key API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/sleep` | Create a sleep log |
| GET | `/api/sleepLogs?email=` | Fetch all logs for a user |
| GET | `/api/streak?email=` | Get current & longest streak data |
| POST | `/api/aiChat` | Send a message to Gemini AI |
| POST | `/api/aiTips` | Generate a personalised sleep tip |
| POST | `/api/crawl-knowledge` | Start Cloudflare crawl job and return `jobId` |
| GET | `/api/crawl-status/[jobId]` | Get crawl status/results (`wait=true` to poll, `store=true` to persist into DB) |
| GET / POST | `/api/comments?blogId=` | Get or post blog comments |
| POST / DELETE | `/api/likes` | Like or unlike a blog post |
| GET / POST | `/api/notifications` | Fetch or create notifications |
| PATCH | `/api/notifications/read-all` | Mark all notifications as read |
| POST | `/api/notifications/bedtime-check` | Trigger bedtime reminder check |
| GET / PUT | `/api/notification-settings` | Get or update notification settings |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary colour | `#89CFF0` (baby blue) |
| Secondary colour | `#B19CD9` (soft lavender) |
| Gradient | `bg-gradient-to-r from-primary to-secondary` |
| Card radius | `rounded-3xl` / `rounded-2xl` |
| Container | `max-w-7xl w-11/12 mx-auto` |
| Animation ease | `easeOut` / `easeInOut`, duration `0.6s` |
| Viewport trigger | `whileInView`, `once: false`, `amount: 0.3` |

---

## 🚀 Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

1. Push your repository to GitHub
2. Import the project on [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from your `.env` file in the Vercel dashboard
4. Click **Deploy**

> Make sure your MySQL database is publicly accessible. Recommended managed providers: **PlanetScale**, **Railway**, **Aiven**, or **TiDB Cloud**.

---

## 📄 License

This project is for personal / educational use. Feel free to fork and build on top of it.
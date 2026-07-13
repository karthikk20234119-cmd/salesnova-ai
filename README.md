# SalesNova AI

**Enterprise-Grade AI-Powered Outreach & Sales Operating System**

SalesNova AI is a Next.js 15 full-stack CRM and sales intelligence platform. It provides a cohesive, premium interface designed for autonomous AI agents, multi-channel outreach, and comprehensive sales pipeline tracking.

## Features
- **Dynamic Kanban Pipeline:** Full drag-and-drop Deal management backed directly by Supabase RLS policies and instantaneous local optimistical state transitions.
- **Smart Lead Scoring & Discovery:** Integrated analytics engine evaluating lead attributes (Google Maps footprint, domain strength, source) into actionable AI scores.
- **AI Workspace Assistant:** A fully functional contextual Chatbot workspace. Live version-control capabilities allow iterative prompt-based generation of Proposals, Audits, Landing Pages, and Outreach WhatsApp templates.
- **Outreach Campaign Automation:** Launch, log, and track outbound email, phone, and Instagram campaigns in a single feed.
- **Robust Authentication:** Secure email/password and Google OAuth integrations managed directly by `@supabase/ssr` bridging server routes and middleware with strict session guarding.
- **Responsive Premium Design:** Utilizes deep glassmorphism and subtle gradient micro-animations powered by Tailwind CSS, Framer Motion, and shadcn/ui.

## Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Database / Auth:** Supabase & `@supabase/ssr`
- **Styling:** Tailwind CSS, Radix UI Primitives, Lucide Icons
- **Animations:** Framer Motion
- **Data Visualization:** Recharts

## Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Ensure your `.env.local` is present in the root directory and populated with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Production Build

To verify compilation and statically optimize all React Server Components and pages, run:
```bash
npm run build
npm start
```
*Note: Due to dynamic search parameters in the auth routes, make sure all client layouts rely on `<Suspense>` boundaries (implemented successfully).*

## Database Architecture
The application runs on a Supabase PostgreSQL instance utilizing:
- `profiles` — Stores full user information, avatars, roles.
- `leads` — Complete multi-channel prospective data.
- `deals` — Value forecasting and tracking within Pipeline columns.
- `tasks` — Actionable checklist integration with assignments and due dates.
- `outreach_messages` — Logs all channel contact interactions.
- `activity_feed` — Chronological application footprint with real-time insertions.

## License
SalesNova AI © 2026. All rights reserved.

<div align="center">

# 🚀 SalesNova AI

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![TYPESCRIPT](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![NEXT.JS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![NODE.JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![GitHub stars](https://img.shields.io/github/stars/karthikk20234119-cmd/salesnova-ai?style=flat-square&logo=github)

<p align="center">
  A premium, high-performance project built using <strong>Node.js/JavaScript/TypeScript</strong> and structured with <strong>Next.js</strong>.
</p>

<h4>
  <a href="https://github.com/karthikk20234119-cmd/salesnova-ai.git">💻 View Codebase</a>
  <span> · </span>
  <a href="https://github.com/karthikk20234119-cmd/salesnova-ai/issues">🐛 Report Bug</a>
  <span> · </span>
  <a href="https://github.com/karthikk20234119-cmd/salesnova-ai/pulls">💡 Request Feature</a>
</h4>

</div>

---

## 📋 Table of Contents
- [📖 About the Project](#-about-the-project)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Dependencies](#-tech-stack--dependencies)
- [⚙️ Getting Started & Installation](#️-getting-started--installation)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🖼️ Visuals & Screenshots](#-visuals--screenshots)
- [🚀 Future Roadmap](#-future-roadmap)
- [🤝 Contributing Guidelines](#-contributing-guidelines)
- [📄 License](#-license)
- [👤 Author & Contact](#-author--contact)

## 📖 About the Project

### Custom Documentation Details

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

Designed with modern development practices in mind, this repository showcases a clean implementation optimized for scalability and readability.

## ✨ Key Features
- **Modular Architecture**: Separated concerns and clean layer boundaries for code reusability.
- **High-Performance Setup**: Optimized execution loops and configuration management.
- **Standards-Compliant**: Follows industry-wide formatting, design principles, and linting guidelines.
- **Ready for Deployment**: Structured to support quick dockerization, environment variables, or local launching.

## 🛠️ Tech Stack & Dependencies
*   **Language**: Node.js/JavaScript/TypeScript
*   **Framework/Platform**: Next.js

### 📦 Key Dependencies
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`
- `@radix-ui/react-avatar`
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-label`
- `@radix-ui/react-progress`


## ⚙️ Getting Started & Installation

### 📋 Prerequisites
Ensure you have the runtime environment and managers installed for **Node.js/JavaScript/TypeScript**:
*   For JS/TS: **Node.js (v18+) & NPM**
*   For Python: **Python 3.10+ & pip**
*   For Flutter: **Flutter SDK**
*   For C#/.NET: **.NET SDK (v6.0+)**

### 💻 Installation Walkthrough

1. Clone the repository to your local workspace:
   ```bash
   git clone https://github.com/karthikk20234119-cmd/salesnova-ai.git
   ```
2. Navigate into the project folder:
   ```bash
   cd SalesNova AI
   ```
3. Initialize the development environment and install dependencies:
   * **NodeJS**: `npm install`
   * **Python**: `pip install -r requirements.txt` (or activate your virtual environment first)
   * **Flutter**: `flutter pub get`
   * **.NET**: `dotnet restore`

4. Launch the application / script:
   * **NodeJS Dev Server**: `npm run dev`
   * **Python Core Script**: `python main.py` or `python app.py`
   * **FastAPI Server**: `uvicorn main:app --reload`
   * **Flutter Application**: `flutter run`
   * **.NET Core Solution**: `dotnet run`

## 📂 Project Directory Structure
```text
├── .env.local
├── .eslintrc.json
├── .gitignore
├── .next/
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── cache/
│   ├── fallback-build-manifest.json
│   ├── package.json
│   ├── react-loadable-manifest.json
│   ├── server/
│   ├── static/
│   ├── trace
│   ├── transform.js
│   ├── transform.js.map
│   └── types/
├── LICENSE
├── README.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── middleware.ts
│   └── types/
└── ... and more items
```

## 🖼️ Visuals & Screenshots
> [!NOTE]
> *A visual walkthrough, screenshots, or design architecture diagram of the system will be showcased below.*

<div align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Application+Screenshot+Placeholder" alt="App Showcase" width="800"/>
</div>

## 🚀 Future Roadmap
- [ ] Add comprehensive suite of unit and integration tests.
- [ ] Establish automated CI/CD pipelines via GitHub Actions.
- [ ] Optimize containerization structure with Docker multi-stage builds.
- [ ] Enhance documentation with API specifications (Swagger/OpenAPI if applicable).

## 🤝 Contributing Guidelines
Contributions are welcome! If you would like to submit bug fixes, feature requests, or improvements:
1. Fork the Project repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License
Distributed under the **MIT License**. See the `LICENSE` file for more details.

## 👤 Author & Contact
*   **Developer**: [karthikk20234119-cmd](https://github.com/karthikk20234119-cmd)
*   **GitHub Link**: [https://github.com/karthikk20234119-cmd](https://github.com/karthikk20234119-cmd)

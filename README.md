<div align="center">

# MicroCRM

**A lightweight, fast CRM for freelancers and small agencies.**

Manage contacts, track deals, and visualize your pipeline — without the enterprise bloat.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ Features

- 🔐 **Authentication** — Email/password + Google OAuth via NextAuth
- 📇 **Contacts Management** — Full CRUD with search, status tracking, and deal count
- 🗂️ **Kanban Pipeline** — Drag-and-drop deal board across Lead → Proposal → Won → Lost
- 📊 **Dashboard** — Sales metrics, won revenue, conversion rate, and Recharts visualizations
- 🔔 **Toast Notifications** — Real-time feedback for all actions (via Sonner)
- 📱 **Responsive** — Works on desktop and mobile
- ⚡ **Optimistic UI** — Kanban stage updates instantly without waiting for the API

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| ORM | [Prisma 7](https://prisma.io) with `@prisma/adapter-pg` |
| Database | [Supabase PostgreSQL](https://supabase.com) |
| Auth | [NextAuth.js v4](https://next-auth.js.org) |
| Drag & Drop | [@dnd-kit](https://dndkit.com) |
| Charts | [Recharts](https://recharts.org) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   └── register/        # User registration endpoint
│   │   ├── contacts/            # Contacts CRUD API
│   │   └── deals/               # Deals CRUD + PATCH (stage)
│   ├── (auth)/
│   │   ├── login/               # Login page
│   │   └── register/            # Register page
│   ├── dashboard/               # Dashboard with metrics & charts
│   ├── contacts/                # Contacts list & management
│   └── deals/                   # Kanban pipeline
├── components/
│   ├── layout/                  # Sidebar, Navbar, DashboardLayout
│   ├── contacts/                # ContactsTable, ContactDialog, DeleteContactDialog
│   ├── deals/                   # KanbanBoard, KanbanColumn, DealCard, DealDialog
│   ├── providers/               # AuthProvider (SessionProvider wrapper)
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── prisma.ts                # Prisma client singleton
│   └── utils.ts                 # cn() utility
├── middleware.ts                # Route protection
└── types/
    └── next-auth.d.ts           # NextAuth type augmentation
prisma/
├── schema.prisma                # Database models
└── seed.ts                      # Sample data seeder
docs/                            # Phase-by-phase progress documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- A [Supabase](https://supabase.com) project with a PostgreSQL database
- (Optional) A [Google Cloud](https://console.cloud.google.com) OAuth app for Google login

### 1. Clone the repository

```bash
git clone https://github.com/your-username/microcrm.git
cd microcrm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

```env
# PostgreSQL connection string from Supabase → Settings → Database → URI
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""          # Generate: openssl rand -base64 32

# Google OAuth (optional — get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

> **Google OAuth redirect URI:** Add `http://localhost:3000/api/auth/callback/google` to your Google Cloud credentials.

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. (Optional) Seed sample data

```bash
npx prisma db seed
```

This creates a demo user (`jane@example.com`) with sample contacts and deals.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

---

## 🗄️ Database Models

```prisma
model User {
  id             String    @id @default(uuid())
  name           String?
  email          String    @unique
  hashedPassword String?
  contacts       Contact[]
  deals          Deal[]
}

model Contact {
  id      String @id @default(uuid())
  userId  String
  name    String
  email   String?
  phone   String?
  company String?
  status  String  @default("ACTIVE")
  deals   Deal[]
}

model Deal {
  id        String @id @default(uuid())
  userId    String
  contactId String
  title     String
  amount    Float
  stage     Stage  @default(LEAD)   // LEAD | PROPOSAL | WON | LOST
}
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Import it in [Vercel](https://vercel.com/new)
3. Add all environment variables from your `.env` file
4. Set `NEXTAUTH_URL` to your production URL (e.g., `https://microcrm.vercel.app`)
5. Deploy — Vercel auto-runs `npx prisma generate` via the build step

> Make sure to update the Google OAuth redirect URI to your production domain.

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ for freelancers and small agencies.
</div>

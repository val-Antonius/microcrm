# MicroCRM Implementation Plan

This document outlines the architecture, data models, and phased implementation plan for MicroCRM, a lightweight Next.js CRM designed for freelancers and small agencies.

## Database Models (Prisma)

### User
- `id`: String (UUID, primary key)
- `name`: String?
- `email`: String (unique)
- `emailVerified`: DateTime?
- `image`: String?
- `hashedPassword`: String? (for credentials auth)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- **Relations:** owns many `Contact`s, owns many `Deal`s.

### Contact
- `id`: String (UUID, primary key)
- `userId`: String (Foreign key to User)
- `name`: String
- `email`: String?
- `phone`: String?
- `company`: String?
- `status`: String (e.g., 'ACTIVE', 'INACTIVE')
- `createdAt`: DateTime
- `updatedAt`: DateTime
- **Relations:** has many `Deal`s.

### Deal
- `id`: String (UUID, primary key)
- `userId`: String (Foreign key to User)
- `contactId`: String (Foreign key to Contact)
- `title`: String
- `amount`: Float
- `stage`: Enum ('LEAD', 'PROPOSAL', 'WON', 'LOST')
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Proposed Changes & Phased Plan

### Phase 1: Setup & Foundations
- **Dependencies:** Install Prisma, Supabase CLI (if needed), NextAuth, Recharts, `lucide-react`, `dnd-kit`, `clsx`, `tailwind-merge`.
- **shadcn/ui:** Initialize and generate core components (`button`, `input`, `card`, `dialog`, `dropdown-menu`, `toast`, `avatar`, `table`, `badge`, `form`, `label`).
- **Layouts:** Create `DashboardLayout` with Sidebar and Navbar components.

### Phase 2: Database & Prisma Setup
- **Schema:** Define `schema.prisma` with User, Contact, and Deal models.
- **Client:** Create Prisma client singleton in `lib/prisma.ts`.
- **Seeding:** Create a basic seed script for testing the UI.

### Phase 3: Authentication
- **NextAuth:** Setup in `app/api/auth/[...nextauth]/route.ts`.
- **Prisma Adapter:** Integrate `@next-auth/prisma-adapter`.
- **Pages:** Create `/login` and `/register` pages.
- **Middleware:** Add Next.js middleware to protect `/dashboard`, `/contacts`, and `/deals` routes.

### Phase 4: Contacts Management
- **API Routes:** `/api/contacts` (GET, POST) and `/api/contacts/[id]` (PUT, DELETE).
- **Contacts Page (`/contacts`):** Build the data table with shadcn UI.
- **Forms:** Add/Edit Contact forms using `react-hook-form` and `zod` validation.

### Phase 5: Deals Management & Kanban Pipeline
- **API Routes:** `/api/deals` (GET, POST, PUT for stage updates).
- **Kanban Board (`/deals`):** Implement drag-and-drop using `dnd-kit`. Columns for Lead, Proposal, Won, Lost.
- **Forms:** Add Deal dialog.

### Phase 6: Dashboard & Analytics
- **Metrics:** Total contacts, total deals, won revenue, conversion rate cards.
- **Charts:** Deals by stage (Bar chart), Contact status (Pie chart) using Recharts.

### Phase 7: Polish
- **UI/UX:** Loading states (Skeletons), Toast notifications for actions.
- **Responsiveness:** Ensure mobile layout works nicely (collapsible sidebar).

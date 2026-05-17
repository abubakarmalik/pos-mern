# PERN POS & Inventory Management System

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E)
![Express](https://img.shields.io/badge/Express-Node.js-111111)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![License](https://img.shields.io/badge/License-MIT-blue)

A full-stack point-of-sale and inventory management system built with PostgreSQL, Express, React, Node.js, and Prisma. The application supports product and category management, POS sales, refunds, stock movement tracking, role-based authentication, dashboard analytics, and operational reporting for small retail environments.

## Overview

This project provides a production-oriented foundation for managing retail sales and inventory workflows. The backend exposes an Express API backed by Supabase PostgreSQL and Prisma ORM, while the frontend delivers a responsive React interface for cashiers and administrators.

Core workflows include inventory management, POS checkout, refunds, stock adjustments, sales history, reporting, user management, role-aware access, and dashboard analytics.

## Tech Stack

### Frontend

- React
- Redux Toolkit
- Tailwind CSS
- React Router
- React Icons
- Vite
- Axios

### Backend

- Node.js
- Express.js
- Prisma ORM
- Zod
- JSON Web Tokens

### Database

- PostgreSQL hosted on Supabase

## Features

- Secure authentication with JWT-based sessions
- Role-based access for administrative and cashier workflows
- Product and category management
- Inventory adjustments and stock ledger tracking
- POS sales creation with invoice totals, discounts, tax, and payment data
- Refund handling with stock restoration flows
- Reports and dashboard analytics
- Responsive user interface for desktop and smaller screens
- Debounced search for faster filtering interactions
- Skeleton loading and reusable loading states
- Toast notification system
- Transaction-safe sales and refund operations
- Reusable table, modal, form, badge, pagination, and layout components

## Folder Structure

```text
.
├── client/                    # React frontend
│   ├── public/                # Static public assets
│   └── src/
│       ├── api/               # Axios client and API configuration
│       ├── components/        # Reusable and domain-specific UI components
│       │   ├── auth/
│       │   ├── categories/
│       │   ├── inventory/
│       │   ├── pos/
│       │   ├── products/
│       │   ├── reports/
│       │   ├── sales/
│       │   ├── settings/
│       │   ├── ui/
│       │   └── users/
│       ├── features/          # Redux Toolkit slices, selectors, and API modules
│       ├── hooks/             # Shared React hooks
│       ├── layouts/           # Application and authentication layouts
│       ├── pages/             # Route-level screens
│       ├── routes/            # Client route definitions
│       ├── services/          # Frontend service helpers
│       ├── theme/             # Design tokens
│       └── utils/             # Formatting, dates, and auth storage utilities
├── server/                    # Express backend
│   ├── config/                # Environment and Prisma client setup
│   ├── prisma/                # Prisma schema and database metadata
│   └── src/
│       ├── controllers/       # HTTP request handlers
│       ├── middlewares/       # Auth, validation, and error middleware
│       ├── repositories/      # Database access layer
│       ├── routes/            # API route modules
│       ├── schemas/           # Zod validation schemas
│       ├── services/          # Business logic and transactions
│       └── utils/             # Mappers, pagination, and response helpers
└── README.md
```

## Environment Variables

Create local environment files from the examples below. Do not commit real secrets.

### Server (`server/.env`)

```env
PORT=8080

# Supabase PostgreSQL connection strings
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Auth
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
```

### Client (`client/.env`)

```env
VITE_API_URL="http://localhost:8080/api"
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd pos-mern
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create `server/.env` and `client/.env` using the examples above. The server requires valid Supabase PostgreSQL connection strings before Prisma commands or API requests can access the database.

### 4. Prepare Prisma

From the server directory:

```bash
cd server
npx prisma db pull
npx prisma generate
```

Use `prisma db pull` when the Supabase database is the source of truth. If you later add Prisma migrations, keep `server/prisma/schema.prisma` and `server/prisma/migrations/` committed.

### 5. Run the development servers

In one terminal:

```bash
cd server
npm run dev
```

In another terminal:

```bash
cd client
npm run dev
```

The API defaults to `http://localhost:8080/api`. Vite prints the frontend URL when the client dev server starts.

## Scripts

### Client

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production frontend build. |
| `npm run lint` | Run ESLint for the frontend. |
| `npm run preview` | Preview the production build locally. |

### Server

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Express API with Nodemon. |
| `npm start` | Start the Express API with Node. |
| `npm run lint` | Run ESLint for the backend. |
| `npm run format` | Format server files with Prettier. |
| `npm run migrate:prices` | Run the price migration utility script. |
| `npm run seed` | Run the server seed script when `seed.js` is available. |

## Architecture

The backend follows a layered request flow:

```text
routes -> controllers -> services -> repositories -> prisma -> PostgreSQL
```

- Routes define the HTTP surface area.
- Controllers validate request flow and delegate work.
- Services contain business logic, transactions, and workflow rules.
- Repositories isolate Prisma database operations.
- Prisma maps application queries to the Supabase PostgreSQL database.

This separation keeps validation, business rules, and persistence concerns easier to test and maintain.

## UI/UX Highlights

- Reusable UI component system for buttons, inputs, tables, modals, cards, badges, pagination, breadcrumbs, and loading states
- Responsive application layout with sidebar navigation
- Route-level pages for products, categories, inventory, POS, sales, refunds, reports, users, and settings
- Breadcrumb and page header patterns for clearer navigation
- Skeleton loaders and empty states for smoother data fetching flows
- Toast notifications for user feedback
- POS cart and receipt-oriented invoice design

## Future Improvements

- Add automated unit and integration test coverage
- Add end-to-end tests for POS checkout and refund workflows
- Add seed data and documented demo accounts for local development
- Add CI checks for linting, builds, and Prisma validation
- Add audit logs for inventory and user-management actions
- Add export support for reports and invoices
- Add deployment documentation for the frontend, backend, and Supabase configuration

## License

MIT License. See `LICENSE` for details.

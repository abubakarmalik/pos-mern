# Minimal POS (Small Shop)

A minimal production-ready POS built with the MERN stack.

## Setup

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Server (`server/.env`)

```
PORT=8080
MONGODB_URL=mongodb://localhost:27017/minimal_pos
JWT_SECRET=replace_me
JWT_EXPIRES_IN=7d
```

### Client (`client/.env`)

```
VITE_API_URL=http://localhost:8080/api
```

## Seeding

```bash
cd server
npm run seed
```

## Login

- Admin: `admin@example.com` / `Admin@123`
- Cashier: `cashier@example.com` / `Cashier@123`


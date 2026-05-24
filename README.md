This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
LIVE DEMO ==== https://123-fawn-sigma.vercel.app/
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Allo Inventory Reservation System

A concurrency-safe inventory reservation platform built using Next.js, Prisma, PostgreSQL, and TailwindCSS.

## Features

- Multi-warehouse inventory tracking
- Temporary stock reservations
- Reservation confirmation & release
- Automatic reservation expiry
- Concurrency-safe stock handling
- Real-time inventory updates

---

# Tech Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- TailwindCSS

---

# Run Locally

## 1. Clone Repository

```bash
git clone https://github.com/Sumit-gb123/ALLO-SUMIT-22MIS0401.git

cd ALLO-SUMIT-22MIS0401
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Setup Environment Variables

Create `.env`

```env
DATABASE_URL="YOUR_DATABASE_URL"

NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_KEY"

REDIS_URL=""

REDIS_TOKEN=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Run Migration

```bash
npx prisma migrate dev --name init
```

## 6. Seed Database

```bash
npx prisma db seed
```

## 7. Start Server

```bash
npm run dev
```

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products |
| GET | `/api/warehouses` | List warehouses |
| POST | `/api/reservations` | Create reservation |
| POST | `/api/reservations/:id/confirm` | Confirm reservation |
| POST | `/api/reservations/:id/release` | Release reservation |

---

# Concurrency Handling

Implemented using:
- PostgreSQL transactions
- Serializable isolation
- `FOR UPDATE` row locking

This guarantees no overselling during simultaneous reservation attempts.

---

# Reservation Expiry

Reservations expire automatically after 10 minutes.

A cron endpoint:
```txt
/api/cron/release-expired
```

releases expired reservations and restores stock.

---

# Tradeoffs

- No authentication added
- Minimal state management
- No realtime WebSockets

---

# Improvements With More Time

- Redis distributed locking
- Idempotency keys
- WebSocket realtime inventory
- Automated testing
- Better UI/UX

---

# Author

Sumit Paudel  
22MIS0401<img width="1920" height="1080" alt="Screenshot (210)" src="https://github.com/user-attachments/assets/201b6157-95ab-4da2-92c4-730f355c4831" />



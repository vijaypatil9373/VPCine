# VPCine

Full-stack movie booking project with React + Vite frontend, Express + MongoDB backend, Clerk login, real seat reservations, user bookings, theaters and releases pages.

## Run locally

1. Make sure MongoDB is running.
2. Configure `client/.env` and `server/.env`.
3. From project root:

```bash
npm install
npm --prefix client install
npm --prefix server install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Seed showtimes

From the server folder run:

```bash
node seed.js
```

This creates five showtimes per movie per day for the next 30 days. The booking page only displays up to six timings for the selected date.

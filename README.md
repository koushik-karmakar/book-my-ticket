#  Book My Ticket — Backend API

A backend REST API for a movie ticket booking system. Users can register, verify their email, browse movies and shows, lock seats, book tickets, and make payments — all through clean and simple API endpoints.

---

## 🔗 Live Demo

- **GitHub Repo:** [https://github.com/koushik-karmakar/book-my-ticket](https://github.com/koushik-karmakar/book-my-ticket)

---

## Tech Stack

| Technology | What it does |
|---|---|
| **Node.js** | Runtime environment for the server |
| **Express.js** | Web framework to handle routes and requests |
| **PostgreSQL** | Database to store all the data |
| **pg (node-postgres)** | Library to connect Node.js with PostgreSQL |
| **JWT** | Used for user login tokens (access + refresh tokens) |
| **Nodemailer** | Sends OTP emails for account verification |
| **bcrypt** | Hashes passwords before saving to the database |
| **dotenv** | Loads environment variables from `.env` file |
| **Render** | Cloud platform where both the server and database are deployed |

---

## Features

- User registration with OTP email verification
- Secure login with JWT access tokens and refresh tokens
- Browse movies, screens, and shows
- Temporary seat locking (5 minutes) to prevent double booking
- Booking creation and payment processing
- Auto-expiry of OTP and seat locks

---

## Database Tables

All tables are created in PostgreSQL. Here is what each table stores:

### `users`
Stores registered user details.
```sql
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(50)  NOT NULL,
  last_name   VARCHAR(50)  NOT NULL,
  email       VARCHAR(256) NOT NULL UNIQUE,
  password    VARCHAR(256) NOT NULL,
  is_verified BOOLEAN      DEFAULT FALSE,
  created_at  TIMESTAMP    DEFAULT NOW()
);
```

### `otp_verifications`
Stores OTP codes sent to users during signup. Each OTP expires after 5 minutes.
```sql
CREATE TABLE IF NOT EXISTS otp_verifications (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(256) NOT NULL,
  otp        VARCHAR(6)   NOT NULL,
  expires_at TIMESTAMP    NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),
  created_at TIMESTAMP    DEFAULT NOW()
);
```

### `refresh_tokens`
Stores long-lived refresh tokens so users stay logged in without re-entering their password.
```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT         NOT NULL UNIQUE,
  expires_at TIMESTAMP    NOT NULL,
  created_at TIMESTAMP    DEFAULT NOW()
);
```

### `movies`
Stores movie details like title, duration, genre, and poster.
```sql
CREATE TABLE IF NOT EXISTS movies (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  duration    INTEGER      NOT NULL,
  genre       VARCHAR(100),
  language    VARCHAR(100),
  rating      VARCHAR(20),
  poster_url  VARCHAR(500),
  created_at  TIMESTAMP    DEFAULT NOW()
);
```

### `screens`
Stores theater screens with their total seat capacity.
```sql
CREATE TABLE IF NOT EXISTS screens (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  total_seats INTEGER      NOT NULL,
  created_at  TIMESTAMP    DEFAULT NOW()
);
```

### `seats`
Stores individual seats belonging to each screen.
```sql
CREATE TABLE IF NOT EXISTS seats (
  id          SERIAL PRIMARY KEY,
  screen_id   INT          NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  seat_number VARCHAR(10)  NOT NULL,
  seat_row    VARCHAR(5)   NOT NULL,
  created_at  TIMESTAMP    DEFAULT NOW()
);
```

### `shows`
Stores show timings — which movie is playing on which screen at what time and price.
```sql
CREATE TABLE IF NOT EXISTS shows (
  id          SERIAL PRIMARY KEY,
  movie_id    INT           NOT NULL REFERENCES movies(id)  ON DELETE CASCADE,
  screen_id   INT           NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  show_time   TIMESTAMP     NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  status      VARCHAR(20)   DEFAULT 'active',
  created_at  TIMESTAMP     DEFAULT NOW()
);
```

### `seat_locks`
Temporarily locks a seat for a user for 5 minutes while they complete booking. Prevents two users from booking the same seat.
```sql
CREATE TABLE IF NOT EXISTS seat_locks (
  id         SERIAL PRIMARY KEY,
  seat_id    INT       NOT NULL REFERENCES seats(id)  ON DELETE CASCADE,
  show_id    INT       NOT NULL REFERENCES shows(id)  ON DELETE CASCADE,
  user_id    INT       NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  locked_at  TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes')
);
```

### `bookings`
Stores a confirmed booking made by a user for a show.
```sql
CREATE TABLE IF NOT EXISTS bookings (
  id           SERIAL PRIMARY KEY,
  user_id      INT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  show_id      INT           NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status       VARCHAR(20)   DEFAULT 'pending',
  created_at   TIMESTAMP     DEFAULT NOW()
);
```

### `booking_seats`
Links a booking to the specific seats that were booked.
```sql
CREATE TABLE IF NOT EXISTS booking_seats (
  id         SERIAL PRIMARY KEY,
  booking_id INT       NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id    INT       NOT NULL REFERENCES seats(id)    ON DELETE CASCADE,
  show_id    INT       NOT NULL REFERENCES shows(id)    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `payments`
Stores payment details for each booking.
```sql
CREATE TABLE IF NOT EXISTS payments (
  id             SERIAL PRIMARY KEY,
  booking_id     INT           NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id        INT           NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  amount         DECIMAL(10,2) NOT NULL,
  status         VARCHAR(20)   DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255)  UNIQUE,
  created_at     TIMESTAMP     DEFAULT NOW()
);
```

---

## ER Diagram

Below is the Entity Relationship diagram showing how all the tables connect with each other:

```
users ──────────── otp_verifications
  │
  ├──────────────── refresh_tokens
  │
  ├──────────────── seat_locks ──── seats ──── screens
  │                                  │
  ├──────────────── bookings ─────── booking_seats
  │                    │
  └──────────────── payments      shows ──── movies
                                    │
                                  screens
```

>  You can visualize the full ER diagram using [dbdiagram.io](https://res.cloudinary.com/db7qmdfr2/image/upload/v1776243224/diagram-export-4-15-2026-2_18_43-PM_uw7bat.png) by pasting the SQL schema there.

---

##  Getting Started Locally

### Prerequisites
- Node.js v18+
- PostgreSQL installed locally or a cloud DB (like Render or Neon)

### 1. Clone the repo
```bash
git clone https://github.com/koushik-karmakar/book-my-ticket.git
cd book-my-ticket
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
```env
PORT=8000
NODE_ENV=development

DATABASE_URL=postgresql://your_user:your_password@localhost:5432/book_my_ticket

CORS_URL=frontend_link

ACCESS_TOKEN_SECRET=your_access_secret_here
ACCESS_TOKEN_EXPIRES=your_access_token_expires

REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRES=your_refresh_token_expires

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password(not email password)

```

### 4. Create the database tables
Connect to your PostgreSQL database and run all the `CREATE TABLE` SQL statements from the section above. You can use **pgAdmin**, **psql**, or **TablePlus**.

### 5. Start the server
```bash
node server.js
```

Server will start at `http://localhost:8000`

---

## Deployment Guide

### Step 1 — Deploy PostgreSQL on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **PostgreSQL**
3. Give it a name like `book-my-ticket-db`
4. Choose the free plan and click **Create Database**
5. Once created, go to the **Info** tab and note down:
   - **Internal Database URL** (use this for your server on Render)
   - **External Database URL** (use this for connecting from your local machine)

### Step 2 — Connect pgAdmin to Render DB (from your local machine)

1. Open **pgAdmin** → right click **Servers** → **Register → Server**
2. Fill in the **Connection** tab:
   - **Host:** copy from Render's *Hostname* field
   - **Port:** `5432`
   - **Database:** your database name (e.g. `book_my_ticket_db_sgl0`)
   - **Username:** your username from Render Info tab
   - **Password:** click the eye icon on Render to reveal and copy
3. Go to the **Parameters** tab → set **sslmode** to `require`
4. Click **Save**
5. Open the **Query Tool** and run all the `CREATE TABLE` SQL statements to set up your schema

### Step 3 — Deploy the Server on Render

1. Click **New +** → **Web Service**
2. Connect your GitHub repo: `koushik-karmakar/book-my-ticket`
3. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Go to **Environment** tab and add these variables:

| Key | Value |
|---|---|
| `DATABASE_URL` | Paste the **Internal Database URL** from your Render DB |
| `PORT` | 8000 or any thing you want |
| `NODE_ENV` | `production` |
| `CORS_URL` | frontend link |
| `ACCESS_TOKEN_SECRET` | any long random string |
| `ACCESS_TOKEN_SECRET` | any time you want as string |
| `REFRESH_TOKEN_SECRET` | any long random string |
| `REFRESH_TOKEN_EXPIRES` | any time you want as string |
| `EMAIL_USER` | your Gmail address |
| `EMAIL_PASS` | your Gmail app password |

5. Click **Create Web Service**
6. Wait for the deploy — you should see in logs:
```
Server running on port: 8000
DB connected, finally
```

> **Important:** Use the **Internal Database URL** when your server is also on Render. Use **External Database URL** only when connecting from your local machine or pgAdmin.

---

##  Project Structure

```
Looking at your screenshot, here's the corrected project structure:
book-my-ticket/
├── src/
│   ├── config/          # Configuration files (DB, env setup)
│   ├── controllers/     # Business logic for each route
│   ├── middleware/      # Auth middleware (JWT verification)
│   ├── models/          # Database query functions
│   ├── routes/          # API route definitions
│   ├── services/        # External services (email, payment etc.)
│   ├── utils/           # Helper/utility functions
│   └── validators/      # Request validation logic
│   └── app.js           # Express app setup
├── .env                 # Environment variables (not committed)
├── .gitignore
├── docker-compose.yml   # Docker setup for local development
├── index.html
├── index.mjs
├── package-lock.json
├── package.json
└── server.js            # Entry point
```

---

##  Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "add your feature"`
4. Push and open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

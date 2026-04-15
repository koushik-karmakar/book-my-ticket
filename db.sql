-- =============================================================
--  Book My Ticket — Database Schema
-- =============================================================


-- -------------------------------------------------------------
--  Users
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(50)  NOT NULL,
  last_name   VARCHAR(50)  NOT NULL,
  email       VARCHAR(256) NOT NULL UNIQUE,
  password    VARCHAR(256) NOT NULL,
  is_verified BOOLEAN      DEFAULT FALSE,
  created_at  TIMESTAMP    DEFAULT NOW()
);


-- -------------------------------------------------------------
--  OTP Verifications (expires after 5 minutes)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS otp_verifications (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(256) NOT NULL,
  otp        VARCHAR(6)   NOT NULL,
  expires_at TIMESTAMP    NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),
  created_at TIMESTAMP    DEFAULT NOW()
);


-- -------------------------------------------------------------
--  Refresh Tokens (one per user)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT         NOT NULL UNIQUE,
  expires_at TIMESTAMP    NOT NULL,
  created_at TIMESTAMP    DEFAULT NOW()
);


-- -------------------------------------------------------------
--  Movies
-- -------------------------------------------------------------
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


-- -------------------------------------------------------------
--  Screens
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS screens (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  total_seats INTEGER      NOT NULL,
  created_at  TIMESTAMP    DEFAULT NOW()
);


-- -------------------------------------------------------------
--  Seats (belongs to a screen)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seats (
  id          SERIAL PRIMARY KEY,
  screen_id   INT          NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  seat_number VARCHAR(10)  NOT NULL,
  seat_row    VARCHAR(5)   NOT NULL,
  created_at  TIMESTAMP    DEFAULT NOW()
);


-- -------------------------------------------------------------
--  Shows (a movie playing on a screen at a specific time)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shows (
  id          SERIAL PRIMARY KEY,
  movie_id    INT           NOT NULL REFERENCES movies(id)  ON DELETE CASCADE,
  screen_id   INT           NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  show_time   TIMESTAMP     NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  status      VARCHAR(20)   DEFAULT 'active',
  created_at  TIMESTAMP     DEFAULT NOW()
);


-- -------------------------------------------------------------
--  Seat Locks (temporary 5-minute lock during booking)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seat_locks (
  id         SERIAL PRIMARY KEY,
  seat_id    INT       NOT NULL REFERENCES seats(id)  ON DELETE CASCADE,
  show_id    INT       NOT NULL REFERENCES shows(id)  ON DELETE CASCADE,
  user_id    INT       NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  locked_at  TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes')
);


-- -------------------------------------------------------------
--  Bookings
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id           SERIAL PRIMARY KEY,
  user_id      INT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  show_id      INT           NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status       VARCHAR(20)   DEFAULT 'pending',
  created_at   TIMESTAMP     DEFAULT NOW()
);


-- -------------------------------------------------------------
--  Booking Seats (which seats are in a booking)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_seats (
  id         SERIAL PRIMARY KEY,
  booking_id INT       NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id    INT       NOT NULL REFERENCES seats(id)    ON DELETE CASCADE,
  show_id    INT       NOT NULL REFERENCES shows(id)    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);


-- -------------------------------------------------------------
--  Payments
-- -------------------------------------------------------------
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
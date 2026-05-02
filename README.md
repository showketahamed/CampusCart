# CampusCart (React Full-Stack)

CampusCart is a university marketplace platform with three roles: Student, Vendor, and Admin.
This project is built as a complete full-stack web application using a React + Vite frontend and a Node.js + Express + MySQL backend.

## Project Structure

- `frontend/` React + Vite + Tailwind + React Router
- `backend/` Express + MySQL + JWT + bcrypt REST API

## Features

- JWT authentication (register/login/profile/logout)
- Role-based protected routes (student/vendor/admin)
- Student: browse/search/filter products, cart, checkout, order waiting/status/history, subscriptions, settings
- Vendor: dashboard stats, own product management, own order status updates, settings
- Admin: dashboard analytics, user/vendor moderation, order status control
- Real seed script with required sample users, vendors, categories, and products

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Context API
- Backend: Node.js, Express.js
- Database: MySQL (`mysql2`)
- Auth: JWT
- Password Hashing: bcrypt

## Environment Variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

- `PORT`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example`:

- `VITE_API_URL`

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Seeder Command

```bash
cd backend
npm run seed
```

## Login Credentials

- Admin: `admin@campuscart.com` / `admin123`
- Student: `student@campuscart.com` / `student123`
- Vendors (all password `vendor123`):
  - `cafe@vendor.com`
  - `freshbites@vendor.com`
  - `stylehub@vendor.com`
  - `fashionpoint@vendor.com`
  - `techaccess@vendor.com`
  - `craftcorner@vendor.com`
  - `bookhaven@vendor.com`
  - `electronics@vendor.com`

## API Route Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`

### Categories

- `GET /api/categories`
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

### Products & Vendors

- `GET /api/products`
- `GET /api/products/vendors`
- `GET /api/products/:id`
- `POST /api/products` (vendor/admin)
- `PUT /api/products/:id` (vendor/admin with ownership checks)
- `DELETE /api/products/:id` (vendor/admin with ownership checks)

### Cart

- `GET /api/cart` (student)
- `POST /api/cart` (student)
- `PUT /api/cart/:id` (student)
- `DELETE /api/cart/:id` (student)

### Orders

- `POST /api/orders/checkout` (student)
- `GET /api/orders` (student own, vendor own, admin all)
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status` (vendor/admin)

### Subscriptions

- `GET /api/subscriptions`
- `POST /api/subscriptions` (student)
- `DELETE /api/subscriptions/:id` (student)

### Payments

- `GET /api/payments`

### Management

- `GET /api/management/admin/stats` (admin)
- `GET /api/management/vendor/stats` (vendor)
- `GET /api/management/users` (admin)
- `PATCH /api/management/users/:id/status` (admin)
- `GET /api/management/vendors` (admin)
- `PATCH /api/management/vendors/:id/status` (admin)

### Settings

- `PUT /api/settings/profile` (authenticated)

## Notes

- The backend auto-creates the MySQL database schema on startup.
- Vendors can only manage their own products/orders.
- Students can only access their own cart/orders/subscriptions.
- Admin has full platform control.
- Input validation and role authorization are enforced in controllers/middleware.

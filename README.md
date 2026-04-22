# Car Rental Management System

A full-stack, production-ready car rental management OS with a dark hacker/terminal aesthetic.

## Tech Stack
- **Database**: MySQL
- **Backend**: Node.js, Express, mysql2
- **Frontend**: React 18, Vite, Lucide React

## Local Setup

### 1. Database
Require MySQL installed locally.
```bash
mysql -u root -p < schema.sql
```

### 2. Backend
Navigate to the backend directory, configure environments, and spin up.
```bash
cd backend
cp .env.example .env
# Edit .env with your DB password if needed
npm install
npm start
```
The backend will run on `http://localhost:5000`.

### 3. Frontend
Navigate to the frontend directory and start the Vite dev server.
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`. (It proxies requests to the backend, or runs in DEMO MODE if the backend is down).

---

## API Endpoints List

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Check backend status |
| `/api/queries/:id` | GET | Execute one of the 10 core views/queries (id 1-10) |
| `/api/cars` | GET | List all cars with class and location join |
| `/api/cars` | POST | Add a new car |
| `/api/customers` | GET | List all customers |
| `/api/customers` | POST | Create a Person+Customer+Phone record |
| `/api/employees` | GET | List all employees |
| `/api/rentals` | GET | List all rentals (with large join) |
| `/api/rentals/active` | GET | List rentals without end dates |
| `/api/rentals` | POST | Create a new rental |
| `/api/rentals/:id/return`| PUT | Call `CalculateRentalPrice` stored procedure |
| `/api/locations` | GET | List operations hubs |
| `/api/locations` | POST | Adding a new hub |
| `/api/promotions` | GET | View promos |
| `/api/promotions` | POST | Add a promo |
| `/api/promotions/:id` | DELETE | Remove promo |

---

## Entity-Relationship Diagram

```text
+-------------------+      +-------------------+
|     CarClass      |1    m|      Car          |
|-------------------|------|-------------------|
| class_name (PK)   |      | car_id (PK)       |
| prices...         |      | license_plate     |
+-------------------+      | make/model/year   |
          |1               | class_name (FK)   |
          |                | location_id (FK) -+
          |m               +-------------------+ |
+-------------------+                            |
|    Promotion      |                            |
|-------------------|                            |m
| promo_id (PK)     |      +-------------------+ |
| class_name (FK)   |     m|     Location      |1|
| discount_pct      |      |-------------------| |
+-------------------+      | location_id (PK)  |-+
                           | address data      |
+-------------------+      +-------------------+
|  DropOffCharge    |        |1            |1
|-------------------|        |             |
| class_name (PK)   |m       |             |
| from_loc (PK/FK)  |--------+             |
| to_loc (PK/FK)    |----------------------+
| charge            |m
+-------------------+

+-------------------+      +-------------------+      +-------------------+
|      Person       |1    m|    Customer       |1    m|      Rental       |
|-------------------|------|-------------------|------|-------------------|
| person_id (PK)    |      | person_id (PK/FK) |      | rental_id (PK)    |
| first_name        |      +-------------------+      | customer_id (FK)  |
| last_name         |                                 | car_id (FK)       |
| address data      |      +-------------------+      | locations (FK)    |
| drivers_license   |1    m|     Employee      |1    m| dates, odometer   |
+-------------------|------|-------------------|------| prices, gas_level |
         |1                | person_id (PK/FK) |      +-------------------+
         |m                | category (ENUM)   |
+-------------------+      | location_id (FK)  |
|       Phone       |      +-------------------+
|-------------------|                |1
| person_id (PK/FK) |                |m
| phone_number (PK) |      +-------------------+
+-------------------+      |      Manager      |
                           |-------------------|
                           | person_id (PK/FK) |
                           | title (ENUM)      |
                           +-------------------+
```

---

## The 10 Core Queries / Views

| Query | SQL Technique Used |
|---|---|
| 1. Active Renters Last Names | `JOIN`, `WHERE end_date IS NULL` |
| 2. Active Cars Make/Color | `JOIN`, `WHERE end_date IS NULL` |
| 3. Completed Rental Prices | `WHERE end_date IS NOT NULL` |
| 4. Last names of Managers | Multiple `JOIN` cascading down Person-Employee-Manager |
| 5. Last/First Name Customers | `JOIN` to resolve Person details |
| 6. Employee is Customer? | Subquery for `YES/NO` column resolution + standard joins |
| 7. President at HQ? | `CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO' END` alongside heavy `JOIN` and `WHERE` matching |
| 8. Shortest Completed Rentals | Correlated Scalar Subquery alongside `DATEDIFF` |
| 9. Cheapest Completed Rental | Using `MIN()` on results `FROM View_Q3` previously created |
| 10. Unused Cars | `NOT IN` coupled with a Subquery |

---

## Free Hosting Guide

### 1. Database: PlanetScale
1. Create a free account at [planetscale.com](https://planetscale.com/).
2. Create a new database called `car_rental`.
3. Open the "Console" tab in the PlanetScale dashboard.
4. Paste the entire contents of `schema.sql` into the console to build your tables, seed data, and generate the views/procedures.
5. In PlanetScale, head to "Connect" and select "Node.js". Copy the `.env` formatted connection string.

### 2. Backend: Render
1. Create a free account at [render.com](https://render.com/).
2. Connect your GitHub repository containing this codebase.
3. Choose "New Web Service".
4. **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Expand "Environment Variables":
   - Add all variables supplied to you by PlanetScale (`DB_HOST`, `DB_USER`, `DB_PASSWORD`), plus set `PORT` to `5000` and `DB_NAME` to `car_rental`.
8. Deploy. Render will provide a URL (e.g. `https://my-backend-app.onrender.com`).

### 3. Frontend: Vercel
1. Create a free account at [vercel.com](https://vercel.com).
2. "Add New Project" and import the same GitHub repository.
3. **Framework Preset**: `Vite`
4. **Root Directory**: `frontend`
5. Add an Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://my-backend-app.onrender.com/api` (The string from the Render deploy + `/api`)
6. Deploy.

# Trambkaraj Trader — MERN → PHP (Laravel) Conversion Plan

## Overview
Convert the existing Node.js/Express/MongoDB backend to PHP (Laravel 11) with MySQL, while keeping the React frontend unchanged. The React app will consume the new PHP REST API.

---

## Phase 1: Environment Setup

### Prerequisites
- **PHP 8.2+** with extensions: `bcmath`, `curl`, `mbstring`, `mysql`, `openssl`, `xml`, `pdo`
- **Composer** (PHP package manager)
- **MySQL 8.0+** (local or remote)
- **Node.js 18+** (already present for React frontend)

### Steps
```bash
# 1. Install PHP + Composer (if not already)
# Windows: https://windows.php.net/download/ + https://getcomposer.org/download/

# 2. Verify
php -v
composer -V

# 3. Create Laravel project
cd Backend-PHP
composer install

# 4. Create MySQL database
mysql -u root -p -e "CREATE DATABASE mandi_app;"

# 5. Configure .env (copy from .env.example, set DB credentials)

# 6. Run migrations
php artisan migrate

# 7. Seed admin user
php artisan db:seed --class=AdminSeeder

# 8. Start server
php artisan serve --port=8000
```

---

## Phase 2: Database Schema (MySQL → MongoDB Mapping)

| MongoDB Collection | MySQL Table      | Notes                                |
|--------------------|------------------|--------------------------------------|
| `admins`           | `admins`         | email, password, reset_token, expiry |
| `records`          | `records`        | bill_no, farmer info, amounts        |
| `records.payments` | `payments`       | Normalized into separate table       |
| `counters`         | `counters`       | Auto-increment bill number           |

### Schema Details

**admins**
| Column            | Type         | Notes                    |
|-------------------|-------------|--------------------------|
| id                | BIGINT PK   | AUTO_INCREMENT           |
| email             | VARCHAR(255)| UNIQUE                   |
| password          | VARCHAR(255)| bcrypt hashed            |
| reset_token       | VARCHAR(64) | NULLABLE                 |
| reset_token_expiry| DATETIME    | NULLABLE                 |
| created_at        | TIMESTAMP   |                          |
| updated_at        | TIMESTAMP   |                          |

**records**
| Column       | Type         | Notes                    |
|--------------|-------------|--------------------------|
| id           | BIGINT PK   | AUTO_INCREMENT           |
| bill_no      | INTEGER     | UNIQUE, auto-incremented |
| date         | DATE        |                          |
| farmer_name  | VARCHAR(255)|                          |
| mobile       | VARCHAR(20) |                          |
| crop         | VARCHAR(100)|                          |
| quantity     | DECIMAL(10,2)|                         |
| rate         | DECIMAL(10,2)|                         |
| total_amount | DECIMAL(12,2)|                         |
| paid_amount  | DECIMAL(12,2)| DEFAULT 0                |
| created_at   | TIMESTAMP   |                          |
| updated_at   | TIMESTAMP   |                          |

**payments** (normalized from embedded MongoDB array)
| Column    | Type         | Notes                    |
|-----------|-------------|--------------------------|
| id        | BIGINT PK   | AUTO_INCREMENT           |
| record_id | BIGINT FK   | REFERENCES records(id)   |
| amount    | DECIMAL(12,2)|                         |
| date      | DATE        |                          |
| remaining | DECIMAL(12,2)|                         |
| created_at| TIMESTAMP   |                          |

**counters**
| Column | Type       | Notes                  |
|--------|-----------|------------------------|
| id     | BIGINT PK | AUTO_INCREMENT         |
| seq    | INTEGER   |                        |

---

## Phase 3: API Endpoints (same paths as React expects)

| Method | Endpoint                           | Controller Method       | Auth |
|--------|------------------------------------|-------------------------|------|
| GET    | `/api/records`                     | RecordController@index  | No   |
| POST   | `/api/add-record`                  | RecordController@store  | No   |
| PUT    | `/api/update-record/{id}`          | RecordController@update | No   |
| POST   | `/api/admin/login`                 | AdminController@login   | No   |
| POST   | `/api/admin/forgot-password`       | AdminController@forgot  | No   |
| POST   | `/api/admin/reset-password/{token}`| AdminController@reset   | No   |

**Note:** Auth middleware added later if needed (frontend currently does not send tokens to record endpoints).

---

## Phase 4: Conversion Steps

### Step 1 — Project Scaffolding
- [x] Create `Backend-PHP/` directory
- [x] Write `composer.json` with dependencies
- [x] Create Laravel bootstrap files

### Step 2 — Database Migrations
- [x] `create_admins_table.php`
- [x] `create_counters_table.php`
- [x] `create_records_table.php`
- [x] `create_payments_table.php`

### Step 3 — Eloquent Models
- [x] `Admin.php` — email, password (hashed), reset token logic
- [x] `Record.php` — billNo auto-increment, date, farmer info
- [x] `Payment.php` — belongsTo Record
- [x] `Counter.php` — auto-increment bill number

### Step 4 — Controllers
- [x] `AdminController.php` — login, forgot-password, reset-password
- [x] `RecordController.php` — index, store (with billNo), update (with payment)

### Step 5 — Middleware & Config
- [x] `JwtMiddleware.php` — JWT token verification
- [x] `cors.php` — CORS for React at `localhost:3000`

### Step 6 — Setup Script
- [x] `setup.bat` — Windows setup script

### Step 7 — Testing
- [ ] Start PHP server: `php artisan serve --port=8000`
- [ ] Start React dev server: `cd frontend && npm start`
- [ ] Verify all CRUD operations work end-to-end

---

## Phase 5: Post-Conversion Cleanup

1. **Frontend API URL** — update `frontend/src/` to use `.env` variable instead of hardcoded `localhost:8000`
2. **Remove `Backend/`** (Node.js) once PHP backend is verified
3. **Remove `composer-setup.php`** from root (Composer installer artifact)
4. **Rename typo files**: `dashbord.css` → `dashboard.css`, `RepoartTable/` → `ReportTable/`
5. **Add `.env.example`** for Laravel and remove `.env` from Git tracking
6. **Update `public/index.html`** title from "React App" to "Trambakraj Traders"

---

## File Structure (New PHP Backend)

```
Backend-PHP/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   └── Api/
│   │   │       ├── AdminController.php
│   │   │       └── RecordController.php
│   │   └── Middleware/
│   │       └── JwtMiddleware.php
│   └── Models/
│       ├── Admin.php
│       ├── Counter.php
│       ├── Payment.php
│       └── Record.php
├── bootstrap/
│   └── app.php
├── config/
│   ├── app.php
│   ├── cors.php
│   ├── database.php
│   └── jwt.php
├── database/
│   ├── migrations/
│   │   ├── ..._create_admins_table.php
│   │   ├── ..._create_counters_table.php
│   │   ├── ..._create_records_table.php
│   │   └── ..._create_payments_table.php
│   └── seeders/
│       └── AdminSeeder.php
├── public/
│   └── index.php
├── routes/
│   └── api.php
├── storage/
├── .env
├── .env.example
├── artisan
├── composer.json
└── setup.bat
```

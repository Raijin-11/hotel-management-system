# Hotel Management System (HMS)

A full-stack Hotel Management System built with ASP.NET Core (C#) and Angular, 
with PostgreSQL as the database.

## Tech Stack

- **Backend:** ASP.NET Core 9 Web API (C#)
- **Frontend:** Angular 21 with Angular Material
- **Database:** PostgreSQL 17
- **Authentication:** JWT Bearer Tokens + BCrypt password hashing
- **ORM:** Entity Framework Core 9 with Npgsql

## Project Structure

```
hotel-management-system/
  └── HMS/
        └── HMS.API/          ← ASP.NET Core backend
              ├── Controllers/
              ├── Data/
              ├── DTOs/
              ├── Middleware/
              ├── Migrations/
              ├── Models/
              └── Services/
  └── frontend/               ← Angular frontend
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [Angular CLI 21](https://angular.io/cli)
- [PostgreSQL 17](https://www.postgresql.org/download/)

## Backend Setup

### 1. Clone the repo
```bash
git clone https://github.com/Raijin-11/hotel-management-system.git
cd hotel-management-system
```

### 2. Set up PostgreSQL
- Install PostgreSQL 17
- Create a database called `HotelManagementDB`
- Default credentials: username `postgres`, password `postgres123`

### 3. Update connection string
Open `HMS/HMS.API/appsettings.json` and update:
```json
"DefaultConnection": "Host=localhost;Port=5432;Database=HotelManagementDB;Username=postgres;Password=YOUR_PASSWORD"
```

### 4. Run the backend
Open `HMS/HMS.sln` in Visual Studio 2022 and press F5.

The API will start at `https://localhost:7172`

Migrations and seed data run automatically on startup.

### 5. View API docs
Navigate to `https://localhost:7172/swagger` to see all endpoints.

## Frontend Setup (Person 2)

```bash
cd hms-frontend
npm install
ng serve
```

Frontend runs at `http://localhost:4200`

## Docker Setup (Recommended)

Run the entire system with one command using Docker:

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Run with Docker
```bash
docker-compose up --build
```

This will automatically:
- Start PostgreSQL database
- Run all migrations
- Seed all test data
- Start the backend API at http://localhost:7172
- Start the frontend at http://localhost:4200

### Stop Docker
```bash
docker-compose down
```

### Swagger API Docs (Docker)
Navigate to `http://localhost:7172/swagger`

## Seeded Test Accounts

| Role    | Email             | Password     |
|---------|-------------------|--------------|
| Admin   | admin@hms.com     | Admin@123    |
| Manager | manager@hms.com   | Manager@123  |
| Staff   | staff@hms.com     | Staff@123    |
| Guest   | guest@hms.com     | Guest@123    |

## Seeded Hotels

| Hotel            | Location      |
|------------------|---------------|
| The Grand London | London, UK    |
| Paris Élite      | Paris, France |

## Security Features

- JWT authentication with 15-minute token expiry
- BCrypt password hashing
- Role-based access control (RBAC)
- Account lockout after 5 failed login attempts
- Session timeout after 15 minutes of inactivity
- Audit logging for all key actions

## Group Members

| Name | Student ID | Role |
|------|------------|------|
| Ahmed Shaain Firaq| S2401269 | Person 1 — Backend + UML |
| Abdulla Mumin Mohamed | S2401551 | Person 2 — Frontend + Testing |
# Hotel Management System (HMS)

A full-stack Hotel Management System built with ASP.NET Core and Angular, using PostgreSQL as the database and Docker for containerized deployment.

The system supports role-based access for Admins, Managers, Staff, and Guests, and includes booking, hotel management, authentication, and administrative workflows.

---

## Tech Stack

- **Backend:** ASP.NET Core 9 Web API (C#)
- **Frontend:** Angular 21.x (tested with CLI 21.2.11)
- **Database:** PostgreSQL 17
- **Authentication:** JWT Bearer Tokens + BCrypt
- **ORM:** Entity Framework Core 9 (Npgsql)
- **Deployment:** Docker & Docker Compose

---

## Project Structure

```text
source-code/
├── HMS/
│   └── HMS.API/          ← ASP.NET Core backend
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Middleware/
│       ├── Migrations/
│       ├── Model/
│       └── Services/
├── hms-frontend/         ← Angular frontend
├── docs/                 ← UML diagrams
└── docker-compose.yml
```

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [Angular CLI 21](https://angular.io/cli)
- [PostgreSQL 17](https://www.postgresql.org/download/)

---

## Docker Setup (Recommended)

Run the entire system with one command:

```bash
docker-compose up --build
```

### What happens:
- PostgreSQL database starts
- Backend API starts
- Frontend starts
- Seed data is inserted automatically

### Access:
- Frontend: http://localhost:4200  
- Backend: http://localhost:7172  
- Swagger: http://localhost:7172/swagger  

### Stop Docker:
```bash
docker-compose down
```

---

## Manual Setup

### Backend

Clone the repo:

```bash
git clone https://github.com/Raijin-11/hotel-management-system.git
cd hotel-management-system
```

Create PostgreSQL database:

```
HotelManagementDB
```

Update connection string:

```json
"DefaultConnection": "Host=localhost;Port=5432;Database=HotelManagementDB;Username=postgres;Password=YOUR_PASSWORD"
```

Open solution:

```
HMS/HMS.sln
```

Run in Visual Studio (F5)

- Migrations run automatically
- Seed data loads on first run

---

### Frontend

```bash
cd hms-frontend
npm install
ng serve
```

Frontend runs at:

```
http://localhost:4200
```

---

## Swagger API Docs

- http://localhost:7172/swagger

---

## Seeded Test Accounts

| Role    | Email             | Password     |
|---------|------------------|--------------|
| Admin   | admin@hms.com     | Admin@123    |
| Manager | manager@hms.com   | Manager@123  |
| Staff   | staff@hms.com     | Staff@123    |
| Guest   | guest@hms.com     | Guest@123    |

---

## Seeded Hotels

| Hotel            | Location      |
|------------------|---------------|
| The Grand London | London, UK    |
| Paris Élite      | Paris, France |

---

## Security Features

- JWT authentication (15-minute expiry)
- BCrypt password hashing
- Role-based access control (RBAC)
- Account lockout after 5 failed login attempts
- Session timeout after inactivity
- Audit logging for key actions

---

## Group Members

| Name                     | Student ID | Role |
|--------------------------|------------|------|
| Ahmed Shaain Firaq       | S2401269   | Backend + UML |
| Abdulla Mumin Mohamed    | S2401551   | Frontend + Testing |
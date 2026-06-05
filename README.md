# Blood Bank Assignment

React + CodeIgniter 4 + MySQL blood bank application for hospitals and receivers.

## Features

- Separate registration for hospitals and receivers (blood group captured for receivers)
- Single login page with role-based navigation
- Hospitals can add available blood samples
- Everyone can view available blood samples (public page)
- Only eligible receivers can request blood samples
- Hospitals can view only requests for their own blood bank
- Duplicate email registration and duplicate sample requests are blocked

## Setup

### 1. Database

Start MySQL (XAMPP), then import:

```bash
C:\xampp\mysql\bin\mysql.exe -u root < database.sql
```

Update `backend/.env` if your MySQL credentials differ.

### 2. Backend

```bash
cd backend
composer install
C:\xampp\php\php.exe spark serve --host 127.0.0.1 --port 8080
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173` — both backend (8080) and frontend (5173) must be running.

## Seed Logins

| Role | Email | Password |
|---|---|---|
| Hospital | `hospital@example.com` | `password` |
| Receiver (A+) | `receiver@example.com` | `password` |

## Project Structure

```
BloodBank/
├── database.sql
├── README.md
├── backend/
│   ├── app/
│   │   ├── Controllers/   Auth, BloodSamples, BloodRequests, Home
│   │   ├── Models/        User, BloodSample, BloodRequest
│   │   └── Services/      AuthService, BloodCompatibility
│   └── public/            API entry point
└── frontend/
    └── src/
        ├── pages/         All UI pages
        ├── components/    Navbar
        └── services/      API + auth helpers
```

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/register-hospital` | Public |
| POST | `/register-receiver` | Public |
| POST | `/login` | Public |
| GET | `/blood-samples` | Public |
| POST | `/blood-samples` | Hospital |
| POST | `/blood-samples/{id}/request` | Receiver |
| GET | `/hospital/requests` | Hospital |

## Submission

1. Import `database.sql` on hosted MySQL
2. Deploy `backend/` (web root → `backend/public/`)
3. Set `VITE_API_URL` in `frontend/.env`, run `npm run build`, deploy `frontend/dist/`
4. Zip project (include `database.sql`) and upload to Google Drive

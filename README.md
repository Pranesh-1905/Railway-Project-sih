# Railway Project (SIH)

A multi-part project for a Railway QR tracking and inspection system. This repository contains a FastAPI backend, a React (Vite) web frontend, and an Expo-based mobile/inspection app.

## Repository structure

- `backend/` — FastAPI backend (Python)
- `frontend/` — React frontend (Vite)
- `inspection_app/` — Expo / React Native mobile app

## Tech stack

- Backend: Python, FastAPI, Uvicorn, Motor (MongoDB async driver)
- Frontend: React, Vite
- Mobile: Expo (React Native)

## Quick overview

The backend exposes routes grouped under these prefixes:

- `/auth` — Authentication (login/register)
- `/manufacturer` — Manufacturer APIs
- `/components` — Component-related APIs
- `/inspection` — Inspection workflows

The frontend app runs on Vite's dev server (default port 5173). The backend's CORS is configured to allow `http://localhost:5173` in development.

## Prerequisites

- Python 3.9+ (3.10 recommended)
- Node.js 16+ / npm or yarn
- For the mobile app: Expo CLI (optional) and an Android/iOS device or simulator
- A running MongoDB instance (URI needed in backend `.env`)

## Backend — setup & run

1. Open a terminal and go to the `backend` folder:

```powershell
cd backend
```

2. Create and activate a virtual environment (recommended):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install Python dependencies:

```powershell
pip install -r requirements.txt
```

4. Create a `.env` file in `backend/` with at least the following variables:

```
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
```

5. Run the backend (development):

```powershell
# from the backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or run directly with Python (the `main.py` contains an entrypoint that uses uvicorn):

```powershell
python main.py
```

API docs will be available at `http://localhost:8000/docs` when the server is running.

## Frontend — setup & run

1. Open a terminal and go to `frontend`:

```powershell
cd frontend
```

2. Install node packages:

```powershell
npm install
# or
# yarn
```

3. Start the dev server:

```powershell
npm run dev
# or
# yarn dev
```

The dev server usually runs on `http://localhost:5173` which matches the backend CORS settings.

## Mobile App (inspection_app) — setup & run

This folder contains an Expo-managed React Native app.

1. Enter the app folder:

```powershell
cd inspection_app
```

2. Install dependencies:

```powershell
npm install
# or
# yarn
```

3. Start Expo:

```powershell
npx expo start
# or
# expo start
```

Follow the Expo UI to run on a simulator or a physical device.

## Environment variables (backend)

- `MONGODB_URI` (required) — MongoDB connection string
- `SECRET_KEY` (required) — JWT secret
- `ACCESS_TOKEN_EXPIRE_MINUTES` — token expiry (default 30)
- `ALGORITHM` — JWT algorithm (default HS256)

Add these to a `backend/.env` file as shown above.

## Notes about APIs

- Authentication endpoints are under `/auth`.
- Manufacturer, components, and inspection features are grouped under their respective prefixes (`/manufacturer`, `/components`, `/inspection`).

If you want a small Postman or curl quickstart, request it and I'll add example calls for register/login and a protected endpoint.

## Contributing

1. Fork the repo and create a feature branch
2. Open a pull request with a clear description of changes
3. Keep changes small and focused

## License

Specify the license your project uses here (e.g., MIT) or add a `LICENSE` file to the repo.

## Contact

If you want me to expand this README (detailed API examples, environment templates, deployment steps, CI setup), tell me which parts to focus on and I will update it.

---

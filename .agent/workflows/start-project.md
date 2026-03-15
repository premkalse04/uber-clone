---
description: How to start the Uber Clone project (single command)
---

// turbo-all

## Step 1 — Ensure MongoDB is running
MongoDB usually starts automatically with Windows. Verify with:
```
Get-Service -Name MongoDB | Select-Object Status, Name
```
If it shows "Stopped", start it:
```
net start MongoDB
```

## Step 2 — Start everything with one command
From the root of the project:
```
cd "K:\Uber clone\uber-video"
npm run dev
```
This starts:
- **Backend** (nodemon) → http://localhost:3000
- **Frontend** (Vite) → http://localhost:5173

Both servers output logs side-by-side with colored labels (BACKEND / FRONTEND).
Either server will automatically restart on file changes.

## Step 3 — Open the App
```
http://localhost:5173
```

## Login Credentials
### User Login → http://localhost:5173/login
- Email: john.doe@example.com | Password: password123
- Email: jane.smith@example.com | Password: password456

### Captain Login → http://localhost:5173/captain-login
- Email: mike.johnson@example.com | Password: captain123
- Email: sarah.williams@example.com | Password: captain456

## If you need to reset/re-seed the database
Run these from the Backend folder:
```
cd "K:\Uber clone\uber-video\Backend"
node init_db.js
node seed_data.js
```

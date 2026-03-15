# MongoDB Setup and Installation Guide

This guide provides step-by-step instructions for setting up MongoDB for the Uber clone project.

## 1. Installation

### 1.1. On Linux (Ubuntu/Debian)

MongoDB has been installed on your system. The installation includes:

- **MongoDB Server (mongod):** The database server
- **MongoDB Shell (mongosh):** Interactive shell for database operations
- **MongoDB Database Tools:** Utilities for data import/export

**Status:** MongoDB is currently running as a system service.

### 1.2. Verify Installation

To verify that MongoDB is running correctly, execute the following command:

```bash
sudo systemctl status mongod
```

You should see output indicating that the service is `active (running)`.

### 1.3. Start/Stop MongoDB

To start MongoDB:

```bash
sudo systemctl start mongod
```

To stop MongoDB:

```bash
sudo systemctl stop mongod
```

To restart MongoDB:

```bash
sudo systemctl restart mongod
```

## 2. Configuration

### 2.1. Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
DB_CONNECT=mongodb://localhost:27017/uber_clone
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_MAPS_API=your_google_maps_api_key_here
PORT=3000
```

**Important:** Replace `your_jwt_secret_key_here` and `your_google_maps_api_key_here` with actual values.

### 2.2. MongoDB Connection String

The default connection string for a local MongoDB instance is:

```
mongodb://localhost:27017/uber_clone
```

- `localhost`: The server address (local machine)
- `27017`: The default MongoDB port
- `uber_clone`: The database name

## 3. Database Initialization

### 3.1. Initialize Database Structure

The `init_db.js` script creates the necessary collections and indexes.

**Steps:**

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):

   ```bash
   npm install
   ```

3. Run the initialization script:

   ```bash
   node init_db.js
   ```

**Expected Output:**

```
✓ Connected to MongoDB
📦 Creating collections...
✓ Users collection ready with email index
✓ Captains collection ready with email and geospatial indexes
✓ Rides collection ready with indexes
✓ BlacklistTokens collection ready with TTL index (24 hours)

✅ Database initialization complete!

Database: uber_clone
Collections:
  - users
  - captains
  - rides
  - blacklisttokens
```

### 3.2. Seed Sample Data

The `seed_data.js` script populates the database with sample users, captains, and rides for testing.

**Steps:**

1. Run the seed script:

   ```bash
   node seed_data.js
   ```

**Expected Output:**

```
✓ Connected to MongoDB
🗑️  Clearing existing data...
✓ Existing data cleared

👥 Creating sample users...
✓ Created 2 sample users
  - John Doe (john.doe@example.com)
  - Jane Smith (jane.smith@example.com)

🚗 Creating sample captains...
✓ Created 2 sample captains
  - Mike Johnson (car)
  - Sarah Williams (motorcycle)

🚕 Creating sample rides...
✓ Created 3 sample rides
  - Ride 1: 123 Main St, San Francisco, CA → 456 Market St, San Francisco, CA (completed)
  - Ride 2: 789 Oak Ave, San Francisco, CA → 321 Pine St, San Francisco, CA (completed)
  - Ride 3: 555 Elm St, San Francisco, CA → 999 Broadway, San Francisco, CA (pending)

✅ Database seeding complete!

📊 Summary:
  - Users: 2
  - Captains: 2
  - Rides: 3

🔐 Test Credentials:

  User 1:
    Email: john.doe@example.com
    Password: password123

  User 2:
    Email: jane.smith@example.com
    Password: password456

  Captain 1:
    Email: mike.johnson@example.com
    Password: captain123

  Captain 2:
    Email: sarah.williams@example.com
    Password: captain456
```

## 4. Accessing MongoDB

### 4.1. Using MongoDB Shell (mongosh)

To connect to the MongoDB database using the interactive shell:

```bash
mongosh mongodb://localhost:27017/uber_clone
```

### 4.2. Common MongoDB Shell Commands

Once connected to the shell, you can use the following commands:

- **Show all databases:**

  ```javascript
  show databases
  ```

- **Switch to a database:**

  ```javascript
  use uber_clone
  ```

- **Show all collections:**

  ```javascript
  show collections
  ```

- **View documents in a collection:**

  ```javascript
  db.users.find()
  db.captains.find()
  db.rides.find()
  ```

- **Count documents:**

  ```javascript
  db.users.countDocuments()
  db.captains.countDocuments()
  db.rides.countDocuments()
  ```

- **Exit the shell:**

  ```javascript
  exit
  ```

## 5. Indexes

Indexes are created automatically by the initialization script. Here's what is created:

| Collection | Index | Type | Purpose |
|---|---|---|---|
| `users` | `email` | Unique | Ensures unique email addresses |
| `captains` | `email` | Unique | Ensures unique email addresses |
| `captains` | `location` | 2dsphere | Enables geospatial queries for nearby captains |
| `rides` | `user` | Standard | Speeds up queries by user |
| `rides` | `captain` | Standard | Speeds up queries by captain |
| `rides` | `status` | Standard | Speeds up queries by ride status |
| `blacklisttokens` | `token` | Unique | Ensures unique tokens |
| `blacklisttokens` | `createdAt` | TTL | Automatically deletes tokens after 24 hours |

## 6. Backup and Restore

### 6.1. Backup Database

To backup the entire database:

```bash
mongodump --uri="mongodb://localhost:27017/uber_clone" --out=./backup
```

### 6.2. Restore Database

To restore from a backup:

```bash
mongorestore --uri="mongodb://localhost:27017/uber_clone" ./backup/uber_clone
```

## 7. Troubleshooting

### 7.1. MongoDB Service Not Running

If MongoDB is not running, start it with:

```bash
sudo systemctl start mongod
```

### 7.2. Connection Refused

If you get a "connection refused" error, ensure MongoDB is running:

```bash
sudo systemctl status mongod
```

### 7.3. Permission Denied

If you get permission errors, ensure the MongoDB data directory has correct permissions:

```bash
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
```

### 7.4. Port Already in Use

If port 27017 is already in use, you can change the MongoDB port in `/etc/mongod.conf`:

```
net:
  port: 27018
```

Then restart MongoDB:

```bash
sudo systemctl restart mongod
```

## 8. Next Steps

Once MongoDB is set up and seeded with data:

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. In another terminal, start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to the frontend URL (typically `http://localhost:5173`).

4. Use the test credentials provided in the seed data to log in and test the application.

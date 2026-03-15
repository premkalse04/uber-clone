# 📊 MongoDB Database Summary

## Database: `uber_clone`

### 📈 Collection Statistics

| Collection | Count | Status |
|---|---|---|
| **users** | 2 | ✅ Active |
| **captains** | 2 | ✅ Active |
| **rides** | 3 | ✅ Active |
| **blacklisttokens** | 0 | ✅ Ready |

---

## 👥 Users Collection

### User 1: John Doe
```
Email: john.doe@example.com
Password: password123
ID: 699d6a91ba326574a63941b8
```

### User 2: Jane Smith
```
Email: jane.smith@example.com
Password: password456
ID: 699d6a91ba326574a63941ba
```

---

## 🚗 Captains Collection

### Captain 1: Mike Johnson
```
Email: mike.johnson@example.com
Password: captain123
Vehicle: Blue Car (ABC-1234)
Capacity: 4 passengers
Status: Active
Location: 37.7749°N, -122.4194°W (San Francisco)
ID: 699d6a91ba326574a63941bc
```

### Captain 2: Sarah Williams
```
Email: sarah.williams@example.com
Password: captain456
Vehicle: Red Motorcycle (XYZ-5678)
Capacity: 2 passengers
Status: Active
Location: 37.7849°N, -122.4094°W (San Francisco)
ID: 699d6a91ba326574a63941be
```

---

## 🚕 Rides Collection

### Ride 1: Completed
```
Pickup: 123 Main St, San Francisco, CA
Destination: 456 Market St, San Francisco, CA
Fare: $25.50
Status: Completed
Distance: 5,000 meters (5 km)
Duration: 900 seconds (15 minutes)
Driver: Mike Johnson
Passenger: John Doe
OTP: 123456
ID: 699d6a91ba326574a63941c0
```

### Ride 2: Completed
```
Pickup: 789 Oak Ave, San Francisco, CA
Destination: 321 Pine St, San Francisco, CA
Fare: $15.75
Status: Completed
Distance: 3,000 meters (3 km)
Duration: 600 seconds (10 minutes)
Driver: Sarah Williams
Passenger: Jane Smith
OTP: 654321
ID: 699d6a91ba326574a63941c2
```

### Ride 3: Pending
```
Pickup: 555 Elm St, San Francisco, CA
Destination: 999 Broadway, San Francisco, CA
Fare: $0.00 (Not yet assigned)
Status: Pending (Waiting for driver)
Distance: Not calculated
Duration: Not calculated
Passenger: John Doe
OTP: 789012
ID: 699d6a91ba326574a63941c4
```

---

## 🔑 Database Indexes

### Users Collection Indexes
- **_id** (Primary Key)
- **email** (Unique Index) - Ensures unique email addresses

### Captains Collection Indexes
- **_id** (Primary Key)
- **email** (Unique Index) - Ensures unique email addresses
- **location** (2dsphere Geospatial Index) - Enables location-based queries

### Rides Collection Indexes
- **_id** (Primary Key)
- **user** (Standard Index) - Speeds up queries by user
- **captain** (Standard Index) - Speeds up queries by captain
- **status** (Standard Index) - Speeds up queries by ride status

### BlacklistTokens Collection Indexes
- **_id** (Primary Key)
- **token** (Unique Index)
- **createdAt** (TTL Index) - Automatically deletes tokens after 24 hours

---

## 🔐 Authentication Details

### JWT Configuration
- **Secret Key Location:** `backend/.env` → `JWT_SECRET`
- **Token Expiration:** 24 hours
- **Token Storage:** localStorage (frontend)

### Password Security
- **Algorithm:** bcrypt with salt rounds: 10
- **Hashing:** All passwords are hashed before storage
- **Comparison:** Passwords are compared using bcrypt.compare()

---

## 📍 Geospatial Features

The captains collection includes geospatial data for location-based queries:

### Captain 1 Location
- **Latitude:** 37.7749°N
- **Longitude:** -122.4194°W
- **Location:** San Francisco, CA (Near Golden Gate Bridge)

### Captain 2 Location
- **Latitude:** 37.7849°N
- **Longitude:** -122.4094°W
- **Location:** San Francisco, CA (Near Ferry Building)

### Geospatial Index
The `2dsphere` index on `captains.location` enables:
- Finding captains within a radius of a pickup location
- Calculating distances between locations
- Sorting captains by proximity

---

## 🔄 Ride Status Flow

```
pending → accepted → ongoing → completed
   ↓
cancelled (can happen at any stage)
```

### Status Descriptions
- **pending:** Ride requested, waiting for captain acceptance
- **accepted:** Captain has accepted the ride
- **ongoing:** Ride is in progress
- **completed:** Ride has been finished
- **cancelled:** Ride was cancelled by user or captain

---

## 📋 Sample API Requests

### Login as User
```bash
POST /users/login
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Login as Captain
```bash
POST /captains/login
{
  "email": "mike.johnson@example.com",
  "password": "captain123"
}
```

### Create a Ride
```bash
POST /rides/create
Authorization: Bearer <token>
{
  "pickup": "123 Main St, San Francisco, CA",
  "destination": "456 Market St, San Francisco, CA",
  "vehicleType": "car"
}
```

### Get Fare Estimate
```bash
GET /rides/get-fare?pickup=123+Main+St&destination=456+Market+St
Authorization: Bearer <token>
```

---

## 🛠️ Maintenance Commands

### View All Users
```bash
mongosh mongodb://localhost:27017/uber_clone
> db.users.find()
```

### View All Captains
```bash
> db.captains.find()
```

### View All Rides
```bash
> db.rides.find()
```

### Count Documents
```bash
> db.users.countDocuments()
> db.captains.countDocuments()
> db.rides.countDocuments()
```

### Delete All Data and Reseed
```bash
cd backend
node seed_data.js
```

### Check Indexes
```bash
> db.users.getIndexes()
> db.captains.getIndexes()
> db.rides.getIndexes()
```

---

## ✅ Verification Checklist

- [x] MongoDB Server Running
- [x] Database `uber_clone` Created
- [x] Collections Created (users, captains, rides, blacklisttokens)
- [x] Sample Data Inserted
- [x] Indexes Created
- [x] Geospatial Index on Captains
- [x] TTL Index on BlacklistTokens
- [x] Backend Dependencies Installed
- [x] Environment Variables Configured
- [x] Database Connection Tested

---

**Last Updated:** February 24, 2026  
**MongoDB Version:** 7.0.30  
**Status:** ✅ Production Ready

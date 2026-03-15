/**
 * seed_data.js — Seed the database with sample users, captains, and rides
 * Run: node seed_data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DB_CONNECT = process.env.DB_CONNECT || 'mongodb://localhost:27017/uber_clone';

async function seedDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(DB_CONNECT);
        console.log('✅ Connected to MongoDB:', DB_CONNECT);

        const db = mongoose.connection.db;

        // ── Clear existing data ────────────────────────────────────────
        console.log('\n🧹 Clearing existing data...');
        await db.collection('users').deleteMany({});
        await db.collection('captains').deleteMany({});
        await db.collection('rides').deleteMany({});
        await db.collection('blacklisttokens').deleteMany({});
        console.log('   ✅ All collections cleared');

        // ── Seed Users ─────────────────────────────────────────────────
        console.log('\n👤 Seeding users...');
        const hashedPassword1 = await bcrypt.hash('password123', 10);
        const hashedPassword2 = await bcrypt.hash('password456', 10);

        const usersResult = await db.collection('users').insertMany([
            {
                fullname: { firstname: 'John', lastname: 'Doe' },
                email: 'john.doe@example.com',
                password: hashedPassword1,
                socketId: null,
                createdAt: new Date()
            },
            {
                fullname: { firstname: 'Jane', lastname: 'Smith' },
                email: 'jane.smith@example.com',
                password: hashedPassword2,
                socketId: null,
                createdAt: new Date()
            }
        ]);
        console.log(`   ✅ ${usersResult.insertedCount} users created`);
        console.log('   📧 john.doe@example.com / password123');
        console.log('   📧 jane.smith@example.com / password456');

        // ── Seed Captains ──────────────────────────────────────────────
        console.log('\n🚗 Seeding captains...');
        const captainPass1 = await bcrypt.hash('captain123', 10);
        const captainPass2 = await bcrypt.hash('captain456', 10);

        const captainsResult = await db.collection('captains').insertMany([
            {
                fullname: { firstname: 'Mike', lastname: 'Johnson' },
                email: 'mike.johnson@example.com',
                password: captainPass1,
                socketId: null,
                status: 'active',
                vehicle: {
                    color: 'Black',
                    plate: 'MH01AB1234',
                    capacity: 4,
                    vehicleType: 'car'
                },
                location: { ltd: 19.0760, lng: 72.8777 },
                createdAt: new Date()
            },
            {
                fullname: { firstname: 'Sarah', lastname: 'Williams' },
                email: 'sarah.williams@example.com',
                password: captainPass2,
                socketId: null,
                status: 'active',
                vehicle: {
                    color: 'White',
                    plate: 'MH02CD5678',
                    capacity: 3,
                    vehicleType: 'auto'
                },
                location: { ltd: 19.0820, lng: 72.8850 },
                createdAt: new Date()
            }
        ]);
        console.log(`   ✅ ${captainsResult.insertedCount} captains created`);
        console.log('   📧 mike.johnson@example.com / captain123');
        console.log('   📧 sarah.williams@example.com / captain456');

        // ── Seed Sample Rides ──────────────────────────────────────────
        console.log('\n🛣️  Seeding sample rides...');
        const userIds = Object.values(usersResult.insertedIds);
        const captainIds = Object.values(captainsResult.insertedIds);

        await db.collection('rides').insertMany([
            {
                user: userIds[0],
                captain: captainIds[0],
                pickup: 'Bandra Station, Mumbai',
                destination: 'Andheri Station, Mumbai',
                fare: 120,
                status: 'completed',
                distance: 8500,
                duration: 1200,
                otp: '1234',
                createdAt: new Date(Date.now() - 86400000), // 1 day ago
                updatedAt: new Date(Date.now() - 82800000)
            },
            {
                user: userIds[1],
                captain: captainIds[1],
                pickup: 'Dadar, Mumbai',
                destination: 'Kurla, Mumbai',
                fare: 85,
                status: 'completed',
                distance: 5200,
                duration: 900,
                otp: '5678',
                createdAt: new Date(Date.now() - 43200000), // 12 hours ago
                updatedAt: new Date(Date.now() - 39600000)
            },
            {
                user: userIds[0],
                captain: null,
                pickup: 'Juhu Beach, Mumbai',
                destination: 'Colaba, Mumbai',
                fare: 250,
                status: 'pending',
                distance: 18000,
                duration: 2700,
                otp: '9012',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        console.log('   ✅ 3 sample rides created (2 completed, 1 pending)');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log('   Users: 2');
        console.log('   Captains: 2');
        console.log('   Rides: 3');

    } catch (err) {
        console.error('❌ Error seeding database:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

seedDatabase();

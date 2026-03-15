/**
 * init_db.js — Initialize MongoDB database with required indexes
 * Run: node init_db.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const DB_CONNECT = process.env.DB_CONNECT || 'mongodb://localhost:27017/uber_clone';

async function initializeDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(DB_CONNECT);
        console.log('✅ Connected to MongoDB:', DB_CONNECT);

        const db = mongoose.connection.db;

        // ── users collection ──────────────────────────────────────────
        console.log('\n📁 Setting up users collection...');
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        console.log('   ✅ Unique index on users.email');

        // ── captains collection ───────────────────────────────────────
        console.log('\n📁 Setting up captains collection...');
        await db.collection('captains').createIndex({ email: 1 }, { unique: true });
        console.log('   ✅ Unique index on captains.email');

        await db.collection('captains').createIndex(
            { location: '2dsphere' },
            { sparse: true }
        );
        console.log('   ✅ 2dsphere index on captains.location');

        // ── rides collection ──────────────────────────────────────────
        console.log('\n📁 Setting up rides collection...');
        await db.collection('rides').createIndex({ user: 1 });
        console.log('   ✅ Index on rides.user');

        await db.collection('rides').createIndex({ captain: 1 });
        console.log('   ✅ Index on rides.captain');

        await db.collection('rides').createIndex({ status: 1 });
        console.log('   ✅ Index on rides.status');

        // ── blacklisttokens collection ─────────────────────────────────
        console.log('\n📁 Setting up blacklisttokens collection...');
        await db.collection('blacklisttokens').createIndex(
            { createdAt: 1 },
            { expireAfterSeconds: 86400 } // TTL: 24 hours
        );
        console.log('   ✅ TTL index on blacklisttokens.createdAt (expires after 24h)');

        console.log('\n🎉 Database initialization complete!');
        console.log('📋 Collections ready: users, captains, rides, blacklisttokens');

    } catch (err) {
        console.error('❌ Error initializing database:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

initializeDatabase();

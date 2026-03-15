const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
        default: null,
    },

    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['searching', 'accepted', 'ongoing', 'completed', 'cancelled', 'no_captain_found'],
        default: 'searching',
    },
    duration: { type: Number },   // seconds
    distance: { type: Number },   // metres

    paymentID: { type: String },
    orderId: { type: String },
    signature: { type: String },

    otp: {
        type: String,
        select: false,
        required: true,
    },

    // ── Dispatch fields ──────────────────────────────────────────
    /** Captain currently holding this dispatch slot (prevents double-accept) */
    dispatchedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
        default: null,
    },
    /** All captains who have rejected this ride */
    rejectedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    }],

}, { timestamps: true })

module.exports = mongoose.model('ride', rideSchema)
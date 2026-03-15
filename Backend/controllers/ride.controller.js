const rideService = require('../services/ride.service')
const dispatchService = require('../services/dispatch.service')
const mapService = require('../services/maps.service')
const { validationResult } = require('express-validator')
const { sendToRoom } = require('../socket')
const rideModel = require('../models/ride.model')


// ── Create Ride ─────────────────────────────────────────────────
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { pickup, destination, vehicleType } = req.body

    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
        })

        // Respond immediately — dispatch is async
        res.status(201).json(ride)

        // Geocode pickup for dispatch
        let pickupCoords
        try {
            const coords = await mapService.getAddressCoordinate(pickup)
            // coords.ltd, coords.lng from existing maps.service
            pickupCoords = [coords.lng, coords.ltd]   // GeoJSON [lng, lat]
        } catch {
            // Fallback: use coordinates if geocoding fails (no-op dispatch)
            console.error('[Dispatch] Could not geocode pickup:', pickup)
            return
        }

        // Kick off sequential dispatch (non-blocking)
        dispatchService.dispatchRideSequentially(ride._id, pickupCoords, vehicleType)
            .catch(err => console.error('[Dispatch] Error:', err))

    } catch (err) {
        console.error('[createRide]', err)
        return res.status(500).json({ message: err.message })
    }
}


// ── Get Fare ────────────────────────────────────────────────────
module.exports.getFare = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { pickup, destination } = req.query

    try {
        const fare = await rideService.getFare(pickup, destination)
        return res.status(200).json(fare)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


// ── Confirm Ride (Captain Accept) ───────────────────────────────
module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { rideId } = req.body
    const captainId = req.captain._id

    try {
        const { ride, success } = await dispatchService.handleCaptainAccept({ rideId, captainId })

        if (!success) {
            // Ride was already accepted by another captain (race condition lost)
            sendToRoom(`captain_${captainId}`, 'rideAlreadyTaken', {
                message: 'This ride was accepted by another captain.',
                rideId,
            })
            return res.status(409).json({ message: 'Ride already accepted by another captain.' })
        }

        // Notify user
        sendToRoom(`user_${ride.user._id}`, 'rideAccepted', { ride })

        // Confirm to captain
        sendToRoom(`captain_${captainId}`, 'rideAcceptedConfirmation', { ride })

        return res.status(200).json(ride)

    } catch (err) {
        console.error('[confirmRide]', err)
        return res.status(500).json({ message: err.message })
    }
}


// ── Start Ride ──────────────────────────────────────────────────
module.exports.startRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { rideId, otp } = req.query

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain })

        sendToRoom(`user_${ride.user._id}`, 'rideStarted', { ride })

        return res.status(200).json(ride)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


// ── End Ride ─────────────────────────────────────────────────────
module.exports.endRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { rideId } = req.body

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain })

        sendToRoom(`user_${ride.user._id}`, 'rideEnded', { ride })

        return res.status(200).json(ride)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


// ── Cancel Ride (User) ───────────────────────────────────────────
module.exports.cancelRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { rideId } = req.body

    try {
        const ride = await rideModel.findOneAndUpdate(
            { _id: rideId, user: req.user._id, status: { $in: ['searching', 'accepted'] } },
            { $set: { status: 'cancelled', dispatchedTo: null } },
            { new: true }
        ).populate('captain')

        if (!ride) return res.status(404).json({ message: 'Ride not found or cannot be cancelled.' })

        // Notify captain if already assigned
        if (ride.captain) {
            sendToRoom(`captain_${ride.captain._id}`, 'rideCancelled', {
                message: 'User cancelled the ride.',
                rideId,
            })
        }

        return res.status(200).json({ message: 'Ride cancelled.', ride })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
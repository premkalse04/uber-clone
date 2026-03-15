/**
 * dispatch.service.js
 *
 * Sequential ride dispatch — finds nearest available captain, locks the ride
 * to that captain, handles accept (race-condition-safe) and reject flows.
 */

const rideModel = require('../models/ride.model')
const captainModel = require('../models/captain.model')
const { sendToRoom } = require('../socket')

const DISPATCH_TIMEOUT_MS = 30_000  // captain has 30s to respond

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Find the nearest online captain who:
 *  - has status 'active'
 *  - has a valid socketId (is connected)
 *  - has NOT already rejected this ride
 *  - is within radiusKm of pickup coordinates
 *
 * Returns captain document or null.
 */
async function findNearestCaptain({ coordinates, radiusKm = 5, rejectedBy = [], vehicleType }) {
    const query = {
        status: 'active',
        socketId: { $ne: null },
        _id: { $nin: rejectedBy },
        location: {
            $nearSphere: {
                $geometry: { type: 'Point', coordinates },
                $maxDistance: radiusKm * 1000,   // metres
            }
        }
    }

    if (vehicleType) {
        query['vehicle.vehicleType'] = vehicleType
    }

    return captainModel.findOne(query)
}

/**
 * Lock the ride to a captain (atomic — prevents double-dispatch).
 * Returns updated ride or null if someone else locked it first.
 */
async function lockDispatch(rideId, captainId) {
    return rideModel.findOneAndUpdate(
        { _id: rideId, status: 'searching', dispatchedTo: null },
        { $set: { dispatchedTo: captainId } },
        { new: true }
    ).populate('user')
}

// ── Main dispatch functions ────────────────────────────────────────

/**
 * dispatchRideSequentially
 *
 * Entry point called after ride creation.
 * Finds nearest captain, locks ride, emits newRideRequest.
 */
async function dispatchRideSequentially(rideId, pickupCoords, vehicleType) {
    const ride = await rideModel.findById(rideId).populate('user')
    if (!ride || ride.status !== 'searching') return

    const captain = await findNearestCaptain({
        coordinates: pickupCoords,
        rejectedBy: ride.rejectedBy,
        vehicleType,
    })

    if (!captain) {
        // No captains available
        await rideModel.findByIdAndUpdate(rideId, { status: 'no_captain_found', dispatchedTo: null })
        const user = ride.user
        if (user?.socketId) {
            sendToRoom(`user_${user._id}`, 'noCaptainFound', {
                message: 'No captains available nearby. Please try again.',
                rideId,
            })
        }
        return
    }

    // Atomic lock: set dispatchedTo only if still null
    const lockedRide = await lockDispatch(rideId, captain._id)
    if (!lockedRide) {
        // Race: another process already locked it
        return
    }

    // Emit to captain's private room
    sendToRoom(`captain_${captain._id}`, 'newRideRequest', {
        rideId: lockedRide._id,
        pickup: lockedRide.pickup,
        destination: lockedRide.destination,
        fare: lockedRide.fare,
        user: {
            name: `${lockedRide.user.fullname?.firstname ?? ''} ${lockedRide.user.fullname?.lastname ?? ''}`.trim(),
            email: lockedRide.user.email,
        },
        timeoutMs: DISPATCH_TIMEOUT_MS,
    })

    // Auto-reject after timeout (captain didn't respond)
    setTimeout(async () => {
        const current = await rideModel.findOne({ _id: rideId, dispatchedTo: captain._id, status: 'searching' })
        if (current) {
            await handleCaptainReject({ rideId, captainId: captain._id, pickupCoords, vehicleType })
        }
    }, DISPATCH_TIMEOUT_MS)
}

/**
 * handleCaptainReject
 *
 * Called when captain rejects or times out.
 * Adds to rejectedBy, clears dispatchedTo, tries next captain.
 */
async function handleCaptainReject({ rideId, captainId, pickupCoords, vehicleType }) {
    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, status: 'searching' },
        {
            $addToSet: { rejectedBy: captainId },
            $set: { dispatchedTo: null },
        },
        { new: true }
    )

    if (!ride) return   // ride no longer in searching state

    // Recurse to next nearest
    await dispatchRideSequentially(rideId, pickupCoords, vehicleType)
}

/**
 * handleCaptainAccept
 *
 * Atomic accept — only succeeds if this captain still owns the dispatch slot.
 * Returns { ride, success } where success=false means race condition lost.
 */
async function handleCaptainAccept({ rideId, captainId }) {
    const ride = await rideModel.findOneAndUpdate(
        {
            _id: rideId,
            dispatchedTo: captainId,
            status: 'searching',
        },
        {
            $set: { status: 'accepted', captain: captainId },
        },
        { new: true }
    ).populate('user').populate('captain').select('+otp')

    if (!ride) {
        // Race condition — another captain accepted first, or ride cancelled
        return { ride: null, success: false }
    }

    return { ride, success: true }
}

module.exports = {
    dispatchRideSequentially,
    handleCaptainReject,
    handleCaptainAccept,
    findNearestCaptain,
}

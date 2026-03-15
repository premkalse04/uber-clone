/**
 * socket.js — Production room-based socket handler
 *
 * Rooms:
 *   captain_<captainId>  — private captain room
 *   user_<userId>        — private user room
 *
 * Events in:
 *   join                       { userId, userType }
 *   update-location-captain    { captainId, location: { ltd, lng } }
 *   reject-ride                { rideId, captainId, pickupCoords, vehicleType }
 *   captain-status-update      { captainId, status }
 *
 * Events emitted (helpers exported for use in services/controllers):
 *   sendToRoom(room, event, data)
 */

const socketIo = require('socket.io')
const userModel = require('./models/user.model')
const captainModel = require('./models/captain.model')
const rideModel = require('./models/ride.model')

let io

function initializeSocket(server) {
    io = socketIo(server, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
    })

    io.on('connection', (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`)

        // ── Join room ──────────────────────────────────────────────
        socket.on('join', async ({ userId, userType }) => {
            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id })
                    socket.join(`user_${userId}`)
                    socket.data.userId = userId
                    socket.data.userType = 'user'
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id })
                    socket.join(`captain_${userId}`)
                    socket.data.captainId = userId
                    socket.data.userType = 'captain'
                }
            } catch (err) {
                console.error('[Socket] join error:', err)
            }
        })

        // ── Captain location update → relay to user if ride active ──
        socket.on('update-location-captain', async ({ captainId, location }) => {
            if (!captainId || location?.ltd == null || location?.lng == null) return

            try {
                await captainModel.findByIdAndUpdate(captainId, {
                    // GeoJSON format for dispatch queries
                    location: {
                        type: 'Point',
                        coordinates: [location.lng, location.ltd],
                    },
                    // Keep legacy flat fields
                    ltd: location.ltd,
                    lng: location.lng,
                })

                // Relay to user if there's an active ride with this captain
                const activeRide = await rideModel.findOne({
                    captain: captainId,
                    status: { $in: ['accepted', 'ongoing'] },
                }).select('user')

                if (activeRide) {
                    io.to(`user_${activeRide.user}`).emit('captainLocationUpdate', {
                        lat: location.ltd,
                        lng: location.lng,
                    })
                }
            } catch (err) {
                console.error('[Socket] location update error:', err)
            }
        })

        // ── Captain rejects ride ─────────────────────────────────
        socket.on('reject-ride', async ({ rideId, captainId, pickupCoords, vehicleType }) => {
            try {
                const { handleCaptainReject } = require('./services/dispatch.service')
                await handleCaptainReject({ rideId, captainId, pickupCoords, vehicleType })
            } catch (err) {
                console.error('[Socket] reject-ride error:', err)
            }
        })

        // ── Captain status toggle ────────────────────────────────
        socket.on('captain-status-update', async ({ captainId, status }) => {
            if (!captainId || !['active', 'inactive'].includes(status)) return
            try {
                await captainModel.findByIdAndUpdate(captainId, { status })
            } catch (err) {
                console.error('[Socket] status update error:', err)
            }
        })

        // ── Disconnect ───────────────────────────────────────────
        socket.on('disconnect', async () => {
            console.log(`[Socket] Disconnected: ${socket.id}`)
            try {
                const { userType, captainId, userId } = socket.data ?? {}

                if (userType === 'captain' && captainId) {
                    // Mark offline
                    await captainModel.findByIdAndUpdate(captainId, { socketId: null })

                    // Check for active dispatched/accepted ride
                    const activeRide = await rideModel.findOne({
                        $or: [
                            { dispatchedTo: captainId, status: 'searching' },
                            { captain: captainId, status: 'accepted' },
                        ]
                    }).populate('user')

                    if (activeRide) {
                        if (activeRide.status === 'searching') {
                            // Was being dispatched — try next captain
                            const { handleCaptainReject } = require('./services/dispatch.service')
                            await handleCaptainReject({
                                rideId: activeRide._id,
                                captainId,
                                pickupCoords: null,   // will re-geocode inside service
                                vehicleType: null,
                            })
                        } else {
                            // Was mid-ride — notify user
                            io.to(`user_${activeRide.user._id}`).emit('captainDisconnected', {
                                message: 'Your captain lost connection. We are finding you another captain.',
                                rideId: activeRide._id,
                            })
                        }
                    }
                }

                if (userType === 'user' && userId) {
                    await userModel.findByIdAndUpdate(userId, { socketId: null })
                }
            } catch (err) {
                console.error('[Socket] disconnect handler error:', err)
            }
        })
    })
}

/**
 * Send a socket event to a specific room.
 * Used by services and controllers to avoid importing `io` directly.
 */
function sendToRoom(room, event, data) {
    if (!io) {
        console.warn('[Socket] io not initialized — cannot send to room:', room)
        return
    }
    io.to(room).emit(event, data)
}

/**
 * Legacy helper — keep for backward compat with existing controller patterns.
 * @deprecated use sendToRoom
 */
function sendMessageToSocketId(socketId, { event, data }) {
    if (io) io.to(socketId).emit(event, data)
}

module.exports = { initializeSocket, sendToRoom, sendMessageToSocketId }
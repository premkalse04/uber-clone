import React, { useRef, useState, useEffect, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

import CaptainHeader from '../components/CaptainHeader'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [ride, setRide] = useState(null)
    const [isOnline, setIsOnline] = useState(true)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    // Join socket + broadcast location continuously via watchPosition
    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })

        let watchId = null

        const emitLocation = (position) => {
            socket.emit('update-location-captain', {
                captainId: captain._id,   // ✅ Fixed: was incorrectly sending userId
                location: {
                    ltd: position.coords.latitude,
                    lng: position.coords.longitude
                }
            })
        }

        const onError = (err) => {
            console.warn('[Captain Location] Geolocation error:', err.message)
        }

        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

        if (navigator.geolocation) {
            // Get an immediate fix first
            navigator.geolocation.getCurrentPosition(emitLocation, onError, geoOptions)
            // Then watch continuously for real-time updates
            watchId = navigator.geolocation.watchPosition(emitLocation, onError, geoOptions)
        } else {
            console.warn('[Captain Location] Geolocation not supported')
        }

        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    // Listen for new ride
    useEffect(() => {
        const handleNewRide = (data) => {
            setRide(data)
            setRidePopupPanel(true)
        }
        socket.on('new-ride', handleNewRide)
        return () => socket.off('new-ride', handleNewRide)
    }, [socket])

    const confirmRide = async () => {
        await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
            { rideId: ride._id, captainId: captain._id },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

    // Animate ride popup panel
    useGSAP(() => {
        gsap.to(ridePopupPanelRef.current, {
            transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)',
            duration: 0.4,
            ease: 'power3.out'
        })
    }, [ridePopupPanel])

    // Animate confirm popup panel
    useGSAP(() => {
        gsap.to(confirmRidePopupPanelRef.current, {
            transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)',
            duration: 0.4,
            ease: 'power3.out'
        })
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen bg-gray-50 flex flex-col overflow-hidden'>

            {/* ── Fixed Header ── */}
            <CaptainHeader isOnline={isOnline} onToggle={() => setIsOnline(prev => !prev)} />

            {/* ── Map Section (55vh) ── */}
            <div className='h-[55vh] w-full flex-shrink-0' style={{ marginTop: '56px' }}>
                <LiveTracking />
            </div>

            {/* ── Bottom Panel ── */}
            <div className='flex-1 overflow-y-auto bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] -mt-4 z-10'>
                {/* Drag Handle */}
                <div className='flex justify-center pt-3 pb-1'>
                    <div className='w-10 h-1 rounded-full bg-gray-300' />
                </div>

                {/* Status Bar */}
                <div className='px-5 pb-3 pt-1'>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isOnline
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                        <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                        {isOnline ? 'Active · Looking for rides' : 'Offline · Not accepting rides'}
                    </div>
                </div>

                {/* Captain Details Card */}
                <div className='px-5 pb-6'>
                    <CaptainDetails />
                </div>
            </div>

            {/* ── Ride Request Popup (slides up) ── */}
            <div
                ref={ridePopupPanelRef}
                className='fixed w-full z-40 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] px-5 pt-4 pb-8'
                style={{ maxHeight: '85vh', overflowY: 'auto' }}
            >
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* ── Confirm Ride Popup (full screen slides up) ── */}
            <div
                ref={confirmRidePopupPanelRef}
                className='fixed w-full h-[90vh] z-50 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.18)] px-5 pt-4 pb-8'
                style={{ overflowY: 'auto' }}
            >
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    )
}

export default CaptainHome
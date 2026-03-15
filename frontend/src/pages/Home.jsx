import React, { useEffect, useRef, useState, useContext, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'

import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'

import HomeNavbar from '../components/HomeNavbar'
import BookingPanel from '../components/BookingPanel'
import MapView from '../components/MapView'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'

import { fetchNearbyPlaces, reverseGeocode, geocodeAddress, searchPlaces } from '../services/placesService'

// ── Debounce hook ────────────────────────────────────────────────
function useDebounce(fn, delay = 350) {
    const timerRef = useRef(null)
    return useCallback((...args) => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => fn(...args), delay)
    }, [fn, delay])
}

const Home = () => {
    // ── Search state ─────────────────────────────────────────────
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])

    // ── Map state ─────────────────────────────────────────────────
    const [userLocation, setUserLocation] = useState(null)
    const [destinationLocation, setDestinationLocation] = useState(null)
    const [suggestionMarkers, setSuggestionMarkers] = useState([])

    // ── Nearby ───────────────────────────────────────────────────
    const [airports, setAirports] = useState([])
    const [stations, setStations] = useState([])
    const [loadingAirports, setLoadingAirports] = useState(false)
    const [loadingStations, setLoadingStations] = useState(false)

    // ── Ride state ────────────────────────────────────────────────
    const [fare, setFare] = useState({})
    const [fareLoading, setFareLoading] = useState(false)
    const [vehicleType, setVehicleType] = useState('car')
    const [ride, setRide] = useState(null)
    const [locatingUser, setLocatingUser] = useState(false)

    // ── Booking options ───────────────────────────────────────────
    const [timeOption, setTimeOption] = useState('Now')
    const [forOption, setForOption] = useState('For me')

    // ── Panel toggles ─────────────────────────────────────────────
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)

    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    // ── Socket join ───────────────────────────────────────────────
    useEffect(() => {
        if (user?._id) socket.emit('join', { userType: 'user', userId: user._id })
    }, [user])

    useEffect(() => {
        const onConfirmed = (data) => { setVehicleFound(false); setWaitingForDriver(true); setRide(data) }
        const onStarted = (data) => { setWaitingForDriver(false); navigate('/riding', { state: { ride: data } }) }
        socket.on('ride-confirmed', onConfirmed)
        socket.on('ride-started', onStarted)
        return () => { socket.off('ride-confirmed', onConfirmed); socket.off('ride-started', onStarted) }
    }, [socket, navigate])

    // ── Detect user location ──────────────────────────────────────
    useEffect(() => {
        if (!navigator.geolocation) return
        setLocatingUser(true)

        const geoOptions = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }

        const onSuccess = async ({ coords: { latitude: lat, longitude: lng } }) => {
            setUserLocation({ lat, lng })
            try { setPickup(await reverseGeocode(lat, lng)) }
            catch { setPickup(`${lat.toFixed(5)}, ${lng.toFixed(5)}`) }
            finally { setLocatingUser(false) }

            // Parallel nearby fetch (only on first GPS fix)
            setLoadingAirports(true)
            setLoadingStations(true)
            Promise.all([
                fetchNearbyPlaces({ lat, lng, type: 'airport' }),
                fetchNearbyPlaces({ lat, lng, type: 'train_station' }),
            ]).then(([air, rail]) => {
                setAirports(air)
                setStations(rail)
                setSuggestionMarkers([...air, ...rail])
            }).finally(() => { setLoadingAirports(false); setLoadingStations(false) })
        }

        const onError = (err) => {
            console.warn('[Home] Geolocation error:', err.code, err.message)
            setLocatingUser(false)
        }

        // Get immediate fix
        navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions)

        // Keep watching so location stays live as user moves
        const watchId = navigator.geolocation.watchPosition(
            ({ coords: { latitude: lat, longitude: lng } }) => setUserLocation({ lat, lng }),
            onError,
            geoOptions
        )

        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    // ── Debounced autocomplete ────────────────────────────────────
    const fetchSuggestions = useDebounce(async (value, field) => {
        if (!value || value.length < 3) {
            field === 'pickup' ? setPickupSuggestions([]) : setDestinationSuggestions([])
            return
        }
        const results = await searchPlaces(value)
        field === 'pickup' ? setPickupSuggestions(results) : setDestinationSuggestions(results)
    }, 350)

    const handlePickupChange = useCallback((e) => {
        setPickup(e.target.value)
        fetchSuggestions(e.target.value, 'pickup')
    }, [fetchSuggestions])

    const handleDestChange = useCallback((e) => {
        setDestination(e.target.value)
        fetchSuggestions(e.target.value, 'destination')
        setDestinationLocation(null)
    }, [fetchSuggestions])

    // When user picks a text suggestion, geocode it so map + fare both work
    const handleSuggestionSelect = useCallback(async (text, field) => {
        if (field === 'pickup') {
            setPickup(text)
            setPickupSuggestions([])
            const coords = await geocodeAddress(text)
            if (coords) setUserLocation(coords)
        } else {
            setDestination(text)
            setDestinationSuggestions([])
            const coords = await geocodeAddress(text)
            if (coords) setDestinationLocation(coords)
        }
    }, [])

    // ── Nearby suggestion selected ────────────────────────────────
    const handleNearbySuggestionSelect = useCallback(async (place) => {
        setDestination(place.name)
        setDestinationLocation({ lat: place.lat, lng: place.lng })
    }, [])

    // ── Find ride ─────────────────────────────────────────────────
    const findTrip = async () => {
        if (!pickup || !destination) return
        setVehiclePanel(true)
        setFareLoading(true)
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setFare(data)
            if (!destinationLocation) {
                const coords = await geocodeAddress(destination)
                if (coords) setDestinationLocation(coords)
            }
        } catch (err) {
            console.error('[Home] getFare error:', err)
        } finally {
            setFareLoading(false)
        }
    }

    const createRide = async () => {
        await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/create`,
            { pickup, destination, vehicleType, timeOption, forOption },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
    }

    // ── GSAP animations ───────────────────────────────────────────
    useGSAP(() => {
        gsap.to(vehiclePanelRef.current, { transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)', duration: 0.4, ease: 'power3.out' })
    }, [vehiclePanel])
    useGSAP(() => {
        gsap.to(confirmRidePanelRef.current, { transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)', duration: 0.4, ease: 'power3.out' })
    }, [confirmRidePanel])
    useGSAP(() => {
        gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)', duration: 0.4, ease: 'power3.out' })
    }, [vehicleFound])
    useGSAP(() => {
        gsap.to(waitingForDriverRef.current, { transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)', duration: 0.4, ease: 'power3.out' })
    }, [waitingForDriver])

    return (
        <div className='h-screen w-screen flex flex-col overflow-hidden bg-white'>

            {/* ── Fixed Top Navbar ──────────────────────────────────── */}
            <HomeNavbar user={user} />

            {/* ── Main content below navbar ─────────────────────────── */}
            <div className='flex flex-1 overflow-hidden' style={{ paddingTop: '64px' }}>

                {/* ── LEFT — Booking Panel (420px fixed) ─────────────── */}
                <div className='w-full md:w-[420px] flex-shrink-0 h-full overflow-y-auto bg-gray-50 border-r border-gray-100'>
                    <div className='p-6 flex flex-col gap-0'>
                        <BookingPanel
                            pickup={pickup} setPickup={setPickup}
                            destination={destination} setDestination={setDestination}
                            onPickupChange={handlePickupChange}
                            onDestinationChange={handleDestChange}
                            onSuggestionSelect={handleSuggestionSelect}
                            pickupSuggestions={pickupSuggestions}
                            destinationSuggestions={destinationSuggestions}
                            airports={airports}
                            stations={stations}
                            loadingAirports={loadingAirports}
                            loadingStations={loadingStations}
                            onNearbySuggestionSelect={handleNearbySuggestionSelect}
                            onSearchClick={findTrip}
                            locatingUser={locatingUser}
                            timeOption={timeOption} setTimeOption={setTimeOption}
                            forOption={forOption} setForOption={setForOption}
                        />
                    </div>
                </div>

                {/* ── RIGHT — Full Map ────────────────────────────────── */}
                <div className='flex-1 relative h-full'>
                    <MapView
                        userLocation={userLocation}
                        destinationLocation={destinationLocation}
                        suggestionMarkers={suggestionMarkers}
                    />

                    {/* Floating pickup badge on map */}
                    {pickup && !destinationLocation && (
                        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3 border border-gray-100 max-w-sm w-full mx-4'>
                            <div className='h-3 w-3 rounded-full bg-blue-500 flex-shrink-0 animate-pulse' />
                            <div className='min-w-0'>
                                <p className='text-xs text-gray-500 font-medium'>Your location</p>
                                <p className='text-sm font-semibold text-gray-900 truncate'>{pickup}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Slide-up panels — anchored left on desktop ──────────── */}
            {[
                { ref: vehiclePanelRef, children: <VehiclePanel selectVehicle={setVehicleType} fare={fare} fareLoading={fareLoading} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} /> },
                { ref: confirmRidePanelRef, children: <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} timeOption={timeOption} forOption={forOption} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} /> },
                { ref: vehicleFoundRef, children: <LookingForDriver pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} /> },
                { ref: waitingForDriverRef, children: <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} /> },
            ].map(({ ref, children }, i) => (
                <div
                    key={i}
                    ref={ref}
                    className='fixed bottom-0 left-0 w-full md:w-[420px] z-50 translate-y-full bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] px-5 pt-4 pb-8 max-h-[85vh] overflow-y-auto'
                >
                    {children}
                </div>
            ))}
        </div>
    )
}

export default Home
import React, { useState, useRef, useCallback, useEffect } from 'react'
import axios from 'axios'
import LocationSuggestions from './LocationSuggestions'

const VEHICLE_OPTIONS = [
    {
        type: 'car',
        label: 'UberGo',
        seats: 4,
        desc: 'Compact • Affordable',
        img: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
    },
    {
        type: 'moto',
        label: 'Moto',
        seats: 1,
        desc: 'Quick • Budget',
        img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
    },
    {
        type: 'auto',
        label: 'Auto',
        seats: 3,
        desc: 'Reliable • Everyday',
        img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
    },
]

const RideSearchPanel = ({
    pickup, setPickup,
    destination, setDestination,
    onFindRide,
    onPickupChange, onDestinationChange,
    pickupSuggestions, destinationSuggestions,
    airports, stations,
    loadingAirports, loadingStations,
    onSuggestionSelect,
    selectedVehicle, setSelectedVehicle,
    fare, loadingFare,
    locatingUser,
    user,
    onLogout,
}) => {
    const [activeSearchField, setActiveSearchField] = useState(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const panelRef = useRef(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setActiveSearchField(null)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handlePickupFocus = () => {
        setActiveSearchField('pickup')
        setShowSuggestions(false)
    }

    const handleDestFocus = () => {
        setActiveSearchField('destination')
        setShowSuggestions(false)
    }

    const handleSuggestionClick = (place) => {
        setDestination(place.name)
        setActiveSearchField(null)
        onSuggestionSelect(place)
    }

    const handleSearchSuggestionClick = (text) => {
        if (activeSearchField === 'pickup') setPickup(text)
        else setDestination(text)
        setActiveSearchField(null)
    }

    return (
        <div ref={panelRef} className='flex flex-col h-full overflow-hidden'>

            {/* ── Header ─────────────────────────────────────────── */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0'>
                <img
                    className='h-7 w-auto'
                    src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
                    alt='Uber'
                />
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2'>
                        <div className='h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center'>
                            <span className='text-xs font-bold text-white uppercase'>
                                {user?.fullname?.firstname?.[0] ?? 'U'}
                            </span>
                        </div>
                        <span className='text-sm font-semibold text-gray-800 hidden sm:block capitalize'>
                            {user?.fullname?.firstname ?? 'User'}
                        </span>
                    </div>
                    <button
                        onClick={onLogout}
                        className='h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                        title='Logout'
                    >
                        <i className='ri-logout-box-r-line text-gray-600 text-sm'></i>
                    </button>
                </div>
            </div>

            {/* ── Scrollable Content ─────────────────────────────── */}
            <div className='flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5'>

                {/* Where to heading */}
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 leading-tight'>Where to?</h1>
                    <p className='text-sm text-gray-500 mt-1'>Plan your next ride</p>
                </div>

                {/* Search Inputs */}
                <div className='relative flex flex-col gap-3'>
                    {/* Route connector line */}
                    <div className='absolute left-[18px] top-[54px] h-6 w-0.5 bg-gray-300 z-10'></div>

                    {/* Pickup */}
                    <div className='relative'>
                        <div className='absolute left-4 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-gray-900 z-10'></div>
                        <input
                            type='text'
                            value={pickup}
                            onChange={onPickupChange}
                            onFocus={handlePickupFocus}
                            placeholder='Pickup location'
                            className='w-full pl-10 pr-12 py-3.5 bg-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all'
                        />
                        {locatingUser && (
                            <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                                <svg className='animate-spin h-4 w-4 text-gray-400' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Destination */}
                    <div className='relative'>
                        <div className='absolute left-[14px] top-1/2 -translate-y-1/2 h-3 w-3 rounded-sm bg-gray-900 rotate-45 z-10'></div>
                        <input
                            type='text'
                            value={destination}
                            onChange={onDestinationChange}
                            onFocus={handleDestFocus}
                            placeholder='Where are you going?'
                            className='w-full pl-10 pr-4 py-3.5 bg-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all'
                        />
                    </div>

                    {/* Autocomplete dropdown */}
                    {activeSearchField && (
                        <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto animate-fadeIn'>
                            {(activeSearchField === 'pickup' ? pickupSuggestions : destinationSuggestions).length === 0 ? (
                                <p className='text-xs text-gray-400 text-center py-5'>
                                    {activeSearchField === 'pickup' ? 'Type to search pickup…' : 'Type to search destination…'}
                                </p>
                            ) : (
                                (activeSearchField === 'pickup' ? pickupSuggestions : destinationSuggestions).map((s, i) => (
                                    <button
                                        key={i}
                                        type='button'
                                        onClick={() => handleSearchSuggestionClick(s)}
                                        className='flex items-center gap-3 w-full px-4 py-3 hover:bg-yellow-50 transition-colors text-left border-b border-gray-50 last:border-0'
                                    >
                                        <div className='h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0'>
                                            <i className='ri-map-pin-fill text-gray-500 text-sm'></i>
                                        </div>
                                        <span className='text-sm text-gray-800 font-medium truncate'>{s}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Vehicle Selector */}
                {fare && Object.keys(fare).length > 0 && (
                    <div>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>Choose Ride Type</p>
                        <div className='flex flex-col gap-2'>
                            {VEHICLE_OPTIONS.map((v) => (
                                <button
                                    key={v.type}
                                    type='button'
                                    onClick={() => setSelectedVehicle(v.type)}
                                    className={`flex items-center gap-4 p-3.5 rounded-2xl border-2 transition-all duration-150 text-left ${selectedVehicle === v.type
                                            ? 'border-yellow-400 bg-yellow-50'
                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                >
                                    <img src={v.img} alt={v.label} className='h-10 w-16 object-contain flex-shrink-0' />
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-1.5'>
                                            <span className='text-sm font-bold text-gray-900'>{v.label}</span>
                                            <span className='text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5'>
                                                <i className='ri-user-3-fill text-xs'></i> {v.seats}
                                            </span>
                                        </div>
                                        <p className='text-xs text-gray-500 mt-0.5'>{v.desc}</p>
                                    </div>
                                    <div className='text-right flex-shrink-0'>
                                        {loadingFare ? (
                                            <div className='h-3 w-12 bg-gray-200 rounded animate-pulse' />
                                        ) : (
                                            <p className='text-base font-bold text-gray-900'>₹{fare[v.type] ?? '—'}</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick suggestions toggle */}
                {!showSuggestions && (
                    <button
                        type='button'
                        onClick={() => setShowSuggestions(true)}
                        className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors'
                    >
                        <i className='ri-compass-3-line text-base'></i>
                        <span>Show nearby airports & stations</span>
                        <i className='ri-arrow-right-s-line'></i>
                    </button>
                )}

                {/* Nearby location suggestions */}
                <LocationSuggestions
                    airports={airports}
                    stations={stations}
                    loadingAirports={loadingAirports}
                    loadingStations={loadingStations}
                    onSelect={handleSuggestionClick}
                    visible={showSuggestions}
                />
            </div>

            {/* ── Sticky Find Ride CTA ─────────────────────────── */}
            <div className='px-6 pb-6 pt-3 border-t border-gray-100 bg-white flex-shrink-0'>
                <button
                    onClick={onFindRide}
                    disabled={!pickup || !destination}
                    className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-150 shadow-md ${pickup && destination
                            ? 'bg-yellow-400 hover:bg-yellow-500 text-black active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <i className='ri-search-line text-lg'></i>
                    Find a Ride
                </button>
            </div>
        </div>
    )
}

export default RideSearchPanel

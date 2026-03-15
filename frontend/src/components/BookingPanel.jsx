import React, { useState, useRef, useEffect } from 'react'
import LocationInput from './LocationInput'
import LocationSuggestions from './LocationSuggestions'

const TIME_OPTIONS = ['Now', 'Schedule for later']
const FOR_OPTIONS = ['For me', 'For someone else']

const BookingPanel = ({
    pickup, setPickup,
    destination, setDestination,
    onPickupChange, onDestinationChange,
    onSuggestionSelect,
    pickupSuggestions, destinationSuggestions,
    airports, stations,
    loadingAirports, loadingStations,
    onNearbySuggestionSelect,
    onSearchClick,
    locatingUser,
    timeOption, setTimeOption,
    forOption, setForOption,
}) => {
    const [activeField, setActiveField] = useState(null)
    const [showTimeMenu, setShowTimeMenu] = useState(false)
    const [showForMenu, setShowForMenu] = useState(false)
    const [showNearby, setShowNearby] = useState(false)
    const panelRef = useRef(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setActiveField(null)
                setShowTimeMenu(false)
                setShowForMenu(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const activeSuggestions = activeField === 'pickup' ? pickupSuggestions : destinationSuggestions

    const handleSuggestionClick = (text) => {
        if (onSuggestionSelect) {
            onSuggestionSelect(text, activeField)  // geocodes + sets state in Home
        } else {
            if (activeField === 'pickup') setPickup(text)
            else setDestination(text)
        }
        setActiveField(null)
    }

    const handleNearbySuggestion = (place) => {
        setDestination(place.name)
        onNearbySuggestionSelect(place)
        setShowNearby(false)
    }

    return (
        <div ref={panelRef} className='w-full flex flex-col gap-5'>

            {/* ── Card ──────────────────────────────────────────────── */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-4'>

                {/* Title */}
                <h2 className='text-xl font-bold text-gray-900'>Get a ride</h2>

                {/* Promo Banner */}
                <div className='flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3'>
                    <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                        <i className='ri-gift-line text-green-600 text-sm'></i>
                    </div>
                    <div>
                        <p className='text-xs font-bold text-green-800 leading-tight'>Save on your next 3 rides</p>
                        <p className='text-xs text-green-600 mt-0.5'>Use code <span className='font-bold'>UBER50</span> · Limited offer</p>
                    </div>
                </div>

                {/* Route Inputs */}
                <div className='flex flex-col gap-1 relative'>
                    {/* Vertical connector */}
                    <div className='absolute left-[22px] top-[54px] h-6 w-0.5 bg-gray-300 z-10 pointer-events-none' />

                    {/* Pickup */}
                    <div className='relative'>
                        <LocationInput
                            id='pickup'
                            value={pickup}
                            onChange={onPickupChange}
                            onFocus={() => { setActiveField('pickup'); setShowNearby(false) }}
                            placeholder='Pickup location'
                            disabled={locatingUser}
                            icon={
                                locatingUser
                                    ? <svg className='animate-spin h-3.5 w-3.5 text-gray-400' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                                    </svg>
                                    : <div className='h-2.5 w-2.5 rounded-full bg-gray-900' />
                            }
                        />
                    </div>

                    {/* Divider line space */}
                    <div className='h-2' />

                    {/* Dropoff */}
                    <div className='relative'>
                        <LocationInput
                            id='destination'
                            value={destination}
                            onChange={onDestinationChange}
                            onFocus={() => { setActiveField('destination'); setShowNearby(true) }}
                            placeholder='Dropoff location'
                            icon={<div className='h-3 w-3 rounded-sm bg-gray-900 rotate-45' />}
                            rightSlot={
                                <button
                                    type='button'
                                    onClick={() => setDestination('')}
                                    className='h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors'
                                    title='Clear'
                                >
                                    <i className='ri-add-line text-gray-600 text-sm'></i>
                                </button>
                            }
                        />
                    </div>

                    {/* Autocomplete dropdown */}
                    {activeField && activeSuggestions.length > 0 && (
                        <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto animate-fadeIn'>
                            {activeSuggestions.map((s, i) => (
                                <button
                                    key={i}
                                    type='button'
                                    onMouseDown={() => handleSuggestionClick(s)}
                                    className='flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0'
                                >
                                    <div className='h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0'>
                                        <i className='ri-map-pin-fill text-gray-500 text-sm'></i>
                                    </div>
                                    <span className='text-sm text-gray-800 font-medium truncate'>{s}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dropdowns Row */}
                <div className='flex gap-2'>
                    {/* Pickup time */}
                    <div className='relative flex-1'>
                        <button
                            type='button'
                            onClick={() => { setShowTimeMenu(v => !v); setShowForMenu(false) }}
                            className='w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition-colors'
                        >
                            <i className='ri-time-line text-gray-500'></i>
                            <span className='flex-1 text-left truncate'>{timeOption}</span>
                            <i className='ri-arrow-down-s-line text-gray-400 text-xs'></i>
                        </button>
                        {showTimeMenu && (
                            <div className='absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100 z-50 min-w-[180px] overflow-hidden animate-fadeIn'>
                                {TIME_OPTIONS.map(o => (
                                    <button key={o} type='button' onClick={() => { setTimeOption(o); setShowTimeMenu(false) }}
                                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${timeOption === o ? 'font-bold text-gray-900' : 'text-gray-700'}`}
                                    >{o}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* For me */}
                    <div className='relative flex-1'>
                        <button
                            type='button'
                            onClick={() => { setShowForMenu(v => !v); setShowTimeMenu(false) }}
                            className='w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition-colors'
                        >
                            <i className='ri-user-line text-gray-500'></i>
                            <span className='flex-1 text-left truncate'>{forOption}</span>
                            <i className='ri-arrow-down-s-line text-gray-400 text-xs'></i>
                        </button>
                        {showForMenu && (
                            <div className='absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100 z-50 min-w-[180px] overflow-hidden animate-fadeIn'>
                                {FOR_OPTIONS.map(o => (
                                    <button key={o} type='button' onClick={() => { setForOption(o); setShowForMenu(false) }}
                                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${forOption === o ? 'font-bold text-gray-900' : 'text-gray-700'}`}
                                    >{o}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Search CTA */}
                <button
                    type='button'
                    onClick={onSearchClick}
                    disabled={!pickup || !destination}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 ${pickup && destination
                        ? 'bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] shadow-sm'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <i className='ri-search-line'></i>
                    Search
                </button>
            </div>

            {/* ── Nearby suggestions ──────────────────────────────────── */}
            {showNearby && (
                <div className='animate-fadeIn flex flex-col gap-4'>
                    <NearbySection
                        icon='ri-plane-line' label='Airports nearby'
                        places={airports} loading={loadingAirports}
                        onSelect={handleNearbySuggestion}
                        accentBg='bg-blue-50' accentText='text-blue-600'
                    />
                    <NearbySection
                        icon='ri-train-line' label='Train stations nearby'
                        places={stations} loading={loadingStations}
                        onSelect={handleNearbySuggestion}
                        accentBg='bg-purple-50' accentText='text-purple-600'
                    />
                </div>
            )}
        </div>
    )
}

// ── Nearby section sub-component ────────────────────────────────
const NearbySection = ({ icon, label, places, loading, onSelect, accentBg, accentText }) => (
    <div>
        <div className='flex items-center gap-2 mb-2 px-1'>
            <div className={`h-6 w-6 rounded-lg ${accentBg} flex items-center justify-center`}>
                <i className={`${icon} ${accentText} text-xs`}></i>
            </div>
            <p className='text-xs font-bold text-gray-500 uppercase tracking-wider'>{label}</p>
        </div>

        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='flex items-center gap-3 p-3.5 animate-pulse border-b border-gray-50 last:border-0'>
                        <div className='h-10 w-10 rounded-xl bg-gray-200 flex-shrink-0' />
                        <div className='flex-1'>
                            <div className='h-3 w-2/3 bg-gray-200 rounded mb-2' />
                            <div className='h-2.5 w-1/2 bg-gray-100 rounded' />
                        </div>
                        <div className='h-3 w-10 bg-gray-200 rounded' />
                    </div>
                ))
            ) : places.length === 0 ? (
                <p className='text-xs text-gray-400 text-center py-5'>None found within 10 km</p>
            ) : (
                places.map((p, i) => (
                    <button
                        key={p.placeId ?? i}
                        type='button'
                        onClick={() => onSelect(p)}
                        className='flex items-center gap-3 w-full p-3.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 group'
                    >
                        <div className='h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-100 transition-colors'>
                            <i className='ri-map-pin-2-fill text-gray-500 group-hover:text-yellow-600 text-sm transition-colors'></i>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold text-gray-900 truncate'>{p.name}</p>
                            <p className='text-xs text-gray-500 truncate mt-0.5'>{p.vicinity}</p>
                        </div>
                        <p className='text-xs font-bold text-gray-600 flex-shrink-0'>{p.distanceKm.toFixed(1)} km</p>
                    </button>
                ))
            )}
        </div>
    </div>
)

export default BookingPanel

import React from 'react'

const LocationSearchPanel = ({
    suggestions,
    setVehiclePanel,
    setPanelOpen,
    setPickup,
    setDestination,
    activeField,
    useCurrentLocation,
    locatingUser
}) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        setPanelOpen(false)
    }

    return (
        <div className='flex flex-col gap-1 pb-2'>

            {/* Use current location — only for pickup */}
            {activeField === 'pickup' && (
                <div className='mb-1'>
                    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-2 pb-2'>
                        Quick Options
                    </p>
                    <button
                        type='button'
                        onClick={useCurrentLocation}
                        disabled={locatingUser}
                        className='flex gap-4 mx-3 p-3.5 rounded-2xl border-2 border-gray-100 hover:border-yellow-400 hover:bg-yellow-50 active:scale-[0.98] items-center w-[calc(100%-24px)] transition-all duration-150 disabled:opacity-60'
                    >
                        <div className='h-10 w-10 flex items-center justify-center rounded-xl bg-blue-100 flex-shrink-0'>
                            {locatingUser
                                ? <svg className='animate-spin h-5 w-5 text-blue-600' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                                </svg>
                                : <i className='ri-crosshair-2-line text-blue-600 text-lg'></i>
                            }
                        </div>
                        <div className='text-left'>
                            <h4 className='font-semibold text-sm text-gray-900 leading-tight'>
                                {locatingUser ? 'Detecting location…' : 'Use my current location'}
                            </h4>
                            <p className='text-gray-500 text-xs mt-0.5'>Auto-detect via GPS</p>
                        </div>
                    </button>

                    {suggestions.length > 0 && (
                        <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2'>
                            Search Results
                        </p>
                    )}
                </div>
            )}

            {activeField === 'destination' && suggestions.length > 0 && (
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-2 pb-2'>
                    Search Results
                </p>
            )}

            {/* Suggestion List */}
            {suggestions.map((elem, idx) => (
                <button
                    key={idx}
                    type='button'
                    onClick={() => handleSuggestionClick(elem)}
                    className='flex gap-4 mx-3 p-3.5 rounded-2xl border-2 border-gray-50 hover:border-yellow-300 hover:bg-yellow-50 active:scale-[0.98] items-center transition-all duration-150 cursor-pointer w-[calc(100%-24px)]'
                >
                    <div className='h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 flex-shrink-0'>
                        <i className='ri-map-pin-fill text-gray-600 text-base'></i>
                    </div>
                    <p className='font-medium text-sm text-gray-800 leading-snug text-left truncate'>{elem}</p>
                </button>
            ))}

            {/* Empty State */}
            {activeField === 'pickup' && suggestions.length === 0 && !locatingUser && (
                <p className='text-center text-gray-400 text-sm py-6 px-4'>
                    Start typing to search, or tap GPS above.
                </p>
            )}
            {activeField === 'destination' && suggestions.length === 0 && (
                <p className='text-center text-gray-400 text-sm py-6 px-4'>
                    Start typing to search for a destination.
                </p>
            )}
        </div>
    )
}

export default LocationSearchPanel
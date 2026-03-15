import React, { useState } from 'react'

const RidePopUp = ({ ride, setRidePopupPanel, setConfirmRidePopupPanel, confirmRide }) => {
    const [isAccepting, setIsAccepting] = useState(false)

    const handleAccept = async () => {
        setIsAccepting(true)
        try {
            await confirmRide()
            setConfirmRidePopupPanel(true)
        } finally {
            setIsAccepting(false)
        }
    }

    const handleIgnore = () => {
        setRidePopupPanel(false)
    }

    return (
        <div className='flex flex-col h-full'>
            {/* Drag Handle */}
            <div className='flex justify-center mb-4'>
                <div className='w-10 h-1 rounded-full bg-gray-300' />
            </div>

            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <p className='text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5'>New Request</p>
                    <h3 className='text-xl font-bold text-gray-900'>Ride Available!</h3>
                </div>
                <div className='flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-1.5'>
                    <i className='ri-map-pin-line text-yellow-600 text-sm'></i>
                    <span className='text-sm font-bold text-yellow-700'>2.2 km</span>
                </div>
            </div>

            {/* Rider Info Card */}
            <div className='flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100'>
                <img
                    className='h-12 w-12 rounded-full object-cover ring-2 ring-yellow-400 ring-offset-1 flex-shrink-0'
                    src='https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg'
                    alt='Rider'
                />
                <div className='flex-1 min-w-0'>
                    <h2 className='text-base font-bold text-gray-900 capitalize truncate'>
                        {ride?.user?.fullname?.firstname ?? 'Rider'} {ride?.user?.fullname?.lastname ?? ''}
                    </h2>
                    <p className='text-xs text-gray-500 mt-0.5'>4.8 ★ · Verified Rider</p>
                </div>
                <div className='text-right flex-shrink-0'>
                    <p className='text-xs text-gray-500 font-medium'>Fare</p>
                    <p className='text-lg font-bold text-gray-900'>₹{ride?.fare ?? '—'}</p>
                </div>
            </div>

            {/* Route Details */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden'>
                {/* Pickup */}
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='flex flex-col items-center gap-1 pt-0.5'>
                        <div className='h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow' />
                        <div className='w-0.5 h-6 bg-gray-200' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Pickup</p>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{ride?.pickup ?? 'Location unavailable'}</p>
                    </div>
                </div>

                {/* Destination */}
                <div className='flex items-start gap-4 p-4'>
                    <div className='flex flex-col items-center gap-1 pt-0.5'>
                        <div className='h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Drop-off</p>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{ride?.destination ?? 'Location unavailable'}</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 mt-auto'>
                <button
                    onClick={handleIgnore}
                    className='flex-1 py-3.5 rounded-2xl font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-150'
                >
                    Ignore
                </button>
                <button
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className={`flex-[2] py-3.5 rounded-2xl font-bold text-sm text-black bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all duration-150 shadow-md flex items-center justify-center gap-2 ${isAccepting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                >
                    {isAccepting ? (
                        <>
                            <svg className='animate-spin h-4 w-4 text-black' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                            </svg>
                            Accepting...
                        </>
                    ) : (
                        <>
                            <i className='ri-checkbox-circle-line text-lg'></i>
                            Accept Ride
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default RidePopUp
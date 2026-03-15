import React, { useState } from 'react'

const vehicleImages = {
    car: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
    moto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
    auto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
}

const RouteRow = ({ icon, color, label, value }) => (
    <div className='flex items-start gap-4 p-4'>
        <div className='pt-0.5 flex-shrink-0'>
            <div className={`h-3 w-3 rounded-full ${color} border-2 border-white shadow`} />
        </div>
        <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>{label}</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{value || '—'}</p>
        </div>
    </div>
)

const ConfirmRide = ({ pickup, destination, fare, vehicleType, timeOption, forOption, setConfirmRidePanel, setVehicleFound, createRide }) => {
    const [isConfirming, setIsConfirming] = useState(false)

    const handleConfirm = async () => {
        setIsConfirming(true)
        try {
            await createRide()
            setVehicleFound(true)
            setConfirmRidePanel(false)
        } finally {
            setIsConfirming(false)
        }
    }

    return (
        <div className='flex flex-col'>
            {/* Drag Handle */}
            <div className='flex justify-center mb-4'>
                <div className='w-10 h-1 rounded-full bg-gray-300' />
            </div>

            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <p className='text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5'>Summary</p>
                    <h3 className='text-xl font-bold text-gray-900'>Confirm Ride</h3>
                </div>
                <button
                    onClick={() => setConfirmRidePanel(false)}
                    className='h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                >
                    <i className='ri-arrow-down-line text-gray-600 text-lg'></i>
                </button>
            </div>

            {/* Vehicle Preview */}
            <div className='flex items-center justify-center mb-4 bg-gray-50 rounded-2xl p-4'>
                <img
                    src={vehicleImages[vehicleType] ?? vehicleImages.car}
                    alt={vehicleType}
                    className='h-20 object-contain'
                />
            </div>

            {/* Route + Details Card */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden'>
                <div className='border-b border-gray-100'>
                    <RouteRow color='bg-emerald-500' label='Pickup' value={pickup} />
                </div>
                <div className='border-b border-gray-100'>
                    <RouteRow color='bg-red-500' label='Drop-off' value={destination} />
                </div>
                {/* Time & Rider row */}
                <div className='flex border-b border-gray-100'>
                    <div className='flex-1 flex items-center gap-3 p-4 border-r border-gray-100'>
                        <i className='ri-time-line text-gray-500 text-base flex-shrink-0' />
                        <div>
                            <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>When</p>
                            <p className='text-sm font-semibold text-gray-800'>{timeOption ?? 'Now'}</p>
                        </div>
                    </div>
                    <div className='flex-1 flex items-center gap-3 p-4'>
                        <i className='ri-user-line text-gray-500 text-base flex-shrink-0' />
                        <div>
                            <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>For</p>
                            <p className='text-sm font-semibold text-gray-800'>{forOption ?? 'For me'}</p>
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-4'>
                    <i className='ri-cash-line text-gray-500 text-base flex-shrink-0' />
                    <div>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Payment</p>
                        <p className='text-sm font-semibold text-gray-800'>Cash · ₹{fare[vehicleType] ?? '—'}</p>
                    </div>
                </div>
            </div>

            {/* Confirm Button */}
            <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className={`w-full py-4 rounded-2xl font-bold text-base text-black bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all duration-150 shadow-md flex items-center justify-center gap-2 ${isConfirming ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
            >
                {isConfirming ? (
                    <>
                        <svg className='animate-spin h-4 w-4 text-black' fill='none' viewBox='0 0 24 24'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                        </svg>
                        Booking...
                    </>
                ) : (
                    <>
                        <i className='ri-checkbox-circle-line text-lg'></i>
                        Confirm Ride
                    </>
                )}
            </button>
        </div>
    )
}

export default ConfirmRide
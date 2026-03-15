import React from 'react'

const vehicleImages = {
    car: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
    moto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
    auto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
}

const LookingForDriver = ({ pickup, destination, fare, vehicleType, setVehicleFound }) => {
    return (
        <div className='flex flex-col'>
            {/* Drag Handle */}
            <div className='flex justify-center mb-4'>
                <div className='w-10 h-1 rounded-full bg-gray-300' />
            </div>

            {/* Header with spinner */}
            <div className='flex items-center justify-between mb-5'>
                <div>
                    <p className='text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5'>Please wait</p>
                    <h3 className='text-xl font-bold text-gray-900'>Finding your driver…</h3>
                </div>
                <div className='relative h-12 w-12 flex items-center justify-center'>
                    <svg className='animate-spin h-12 w-12 text-yellow-400' viewBox='0 0 48 48' fill='none'>
                        <circle cx='24' cy='24' r='20' stroke='currentColor' strokeWidth='4' strokeOpacity='0.2' />
                        <path d='M24 4 a20 20 0 0 1 20 20' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <i className='ri-car-line text-yellow-500 text-lg'></i>
                    </div>
                </div>
            </div>

            {/* Vehicle Image */}
            <div className='flex items-center justify-center mb-5 bg-gray-50 rounded-2xl p-4'>
                <img
                    src={vehicleImages[vehicleType] ?? vehicleImages.car}
                    alt='vehicle'
                    className='h-20 object-contain'
                />
            </div>

            {/* Route Card */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden'>
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='pt-0.5 flex-shrink-0'>
                        <div className='h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Pickup</p>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{pickup || '—'}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='pt-0.5 flex-shrink-0'>
                        <div className='h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Drop-off</p>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{destination || '—'}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-4'>
                    <i className='ri-cash-line text-gray-500 text-base flex-shrink-0'></i>
                    <div>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Payment</p>
                        <p className='text-sm font-semibold text-gray-800'>Cash · ₹{fare[vehicleType] ?? '—'}</p>
                    </div>
                </div>
            </div>

            {/* Cancel */}
            <button
                onClick={() => setVehicleFound(false)}
                className='w-full py-3.5 rounded-2xl font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-150'
            >
                Cancel Search
            </button>
        </div>
    )
}

export default LookingForDriver
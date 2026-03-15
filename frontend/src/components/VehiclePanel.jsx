import React from 'react'

const vehicleImages = {
    car: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
    moto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
    auto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
}

const vehicles = [
    {
        type: 'car',
        name: 'UberGo',
        capacity: 4,
        eta: '2 mins',
        desc: 'Affordable, compact rides',
        fareKey: 'car',
    },
    {
        type: 'moto',
        name: 'Moto',
        capacity: 1,
        eta: '3 mins',
        desc: 'Affordable motorcycle rides',
        fareKey: 'moto',
    },
    {
        type: 'auto',
        name: 'UberAuto',
        capacity: 3,
        eta: '3 mins',
        desc: 'Affordable auto rides',
        fareKey: 'auto',
    },
]

const VehiclePanel = ({ fare, fareLoading, setConfirmRidePanel, setVehiclePanel, selectVehicle }) => {
    return (
        <div className='flex flex-col h-full'>
            {/* Drag Handle */}
            <div className='flex justify-center mb-4'>
                <div className='w-10 h-1 rounded-full bg-gray-300' />
            </div>

            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <p className='text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5'>Select</p>
                    <h3 className='text-xl font-bold text-gray-900'>Choose a Ride</h3>
                </div>
                <button
                    onClick={() => setVehiclePanel(false)}
                    className='h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                >
                    <i className='ri-arrow-down-line text-gray-600 text-lg'></i>
                </button>
            </div>

            {/* Vehicle Options */}
            <div className='flex flex-col gap-3'>
                {vehicles.map((v) => (
                    <div
                        key={v.type}
                        onClick={() => {
                            selectVehicle(v.type)
                            setConfirmRidePanel(true)
                        }}
                        className='flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-yellow-400 hover:bg-yellow-50 active:scale-[0.98] transition-all duration-150 cursor-pointer'
                    >
                        <img
                            src={vehicleImages[v.type]}
                            alt={v.name}
                            className='h-14 w-20 object-contain flex-shrink-0'
                        />
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-1.5 mb-0.5'>
                                <h4 className='font-bold text-gray-900 text-base'>{v.name}</h4>
                                <span className='flex items-center gap-0.5 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5'>
                                    <i className='ri-user-3-fill text-xs'></i> {v.capacity}
                                </span>
                            </div>
                            <p className='text-xs text-gray-500'>{v.desc}</p>
                            <div className='flex items-center gap-1 mt-1'>
                                <i className='ri-time-line text-emerald-600 text-xs'></i>
                                <span className='text-xs font-semibold text-emerald-600'>{v.eta} away</span>
                            </div>
                        </div>
                        <div className='text-right flex-shrink-0'>
                            <p className='text-xs text-gray-400 mb-0.5'>Fare</p>
                            {fareLoading ? (
                                <div className='h-5 w-16 bg-gray-200 rounded animate-pulse' />
                            ) : (
                                <p className='text-lg font-bold text-gray-900'>
                                    {fare[v.fareKey] ? `₹${fare[v.fareKey]}` : '₹—'}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VehiclePanel
import React, { useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    useEffect(() => {
        const onRideEnded = () => navigate('/home')
        socket.on('ride-ended', onRideEnded)
        return () => socket.off('ride-ended', onRideEnded)
    }, [socket, navigate])

    const captain = ride?.captain
    const vehicleImages = {
        car: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
        moto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
        auto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
    }

    return (
        <div className='h-screen w-screen flex overflow-hidden bg-gray-50'>

            {/* ── LEFT PANEL — Ride Details ───────────────────────── */}
            <div className='w-full md:w-[380px] flex-shrink-0 flex flex-col h-full bg-white shadow-xl z-10 overflow-y-auto'>

                {/* Header */}
                <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-20'>
                    <div className='flex items-center gap-2'>
                        <img
                            className='h-6 w-auto'
                            src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
                            alt='Uber'
                        />
                    </div>
                    <div className='flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1'>
                        <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse'></span>
                        <span className='text-xs font-semibold text-emerald-700'>Ride in Progress</span>
                    </div>
                </div>

                {/* Captain Card */}
                <div className='px-5 pt-5'>
                    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3'>Your Driver</p>
                    <div className='flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100'>
                        <img
                            src={vehicleImages[captain?.vehicle?.vehicleType] ?? vehicleImages.car}
                            alt='vehicle'
                            className='h-14 w-20 object-contain flex-shrink-0'
                        />
                        <div className='flex-1 min-w-0'>
                            <h2 className='text-base font-bold text-gray-900 capitalize'>
                                {captain?.fullname?.firstname ?? 'Captain'} {captain?.fullname?.lastname ?? ''}
                            </h2>
                            <p className='text-sm font-semibold text-gray-700 tracking-wider mt-0.5'>
                                {captain?.vehicle?.plate ?? '—'}
                            </p>
                            <p className='text-xs text-gray-500 mt-0.5'>4.9 ★ · Verified Captain</p>
                        </div>
                    </div>
                </div>

                {/* Route Details */}
                <div className='px-5 pt-5'>
                    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3'>Trip Route</p>
                    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>

                        {/* Pickup */}
                        <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                            <div className='flex flex-col items-center gap-1 pt-0.5 flex-shrink-0'>
                                <div className='h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow' />
                                <div className='w-0.5 h-8 bg-gray-200' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Pickup</p>
                                <p className='text-sm font-semibold text-gray-800 leading-snug'>
                                    {ride?.pickup ?? 'Pickup location'}
                                </p>
                            </div>
                        </div>

                        {/* Destination */}
                        <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                            <div className='pt-0.5 flex-shrink-0'>
                                <div className='h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Drop-off</p>
                                <p className='text-sm font-semibold text-gray-800 leading-snug'>
                                    {ride?.destination ?? 'Destination'}
                                </p>
                            </div>
                        </div>

                        {/* Fare */}
                        <div className='flex items-center gap-4 p-4'>
                            <i className='ri-cash-line text-gray-500 text-base flex-shrink-0'></i>
                            <div className='flex-1'>
                                <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Payment</p>
                                <p className='text-sm font-semibold text-gray-800'>Cash · ₹{ride?.fare ?? '—'}</p>
                            </div>
                            <div className='bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-1.5'>
                                <p className='text-base font-bold text-gray-900'>₹{ride?.fare ?? '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safety Info */}
                <div className='px-5 pt-4'>
                    <div className='bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3'>
                        <i className='ri-shield-check-line text-blue-500 text-lg flex-shrink-0 mt-0.5'></i>
                        <div>
                            <p className='text-xs font-bold text-blue-800 mb-0.5'>Trip Safety</p>
                            <p className='text-xs text-blue-600 leading-snug'>
                                Your ride is being tracked. Share your trip status with a trusted contact.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Spacer */}
                <div className='flex-1' />

                {/* Payment Button — Sticky Bottom */}
                <div className='px-5 pb-6 pt-4 sticky bottom-0 bg-white border-t border-gray-100'>
                    <button
                        className='w-full py-4 rounded-2xl font-bold text-base text-black bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all duration-150 shadow-md flex items-center justify-center gap-2'
                    >
                        <i className='ri-secure-payment-line text-xl'></i>
                        Make Payment
                    </button>
                </div>
            </div>

            {/* ── RIGHT PANEL — Live Map ──────────────────────────── */}
            <div className='flex-1 relative'>
                <LiveTracking />

                {/* Floating ETA badge on map */}
                <div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-5 py-2.5 flex items-center gap-2.5 border border-gray-100'>
                    <i className='ri-navigation-line text-yellow-500 text-lg'></i>
                    <div>
                        <p className='text-xs text-gray-500 font-medium leading-none mb-0.5'>Est. Arrival</p>
                        <p className='text-sm font-bold text-gray-900'>Tracking Live</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Riding
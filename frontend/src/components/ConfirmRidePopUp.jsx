import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = ({ ride, setConfirmRidePopupPanel, setRidePopupPanel }) => {
    const [otp, setOtp] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        if (otp.trim().length === 0) {
            setError('Please enter the OTP')
            return
        }
        setError('')
        setIsSubmitting(true)

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: { rideId: ride._id, otp },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.status === 200) {
                setConfirmRidePopupPanel(false)
                setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride } })
            }
        } catch (err) {
            setError('Invalid OTP. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        setConfirmRidePopupPanel(false)
        setRidePopupPanel(false)
    }

    return (
        <div className='flex flex-col h-full overflow-y-auto'>
            {/* Drag Handle */}
            <div className='flex justify-center mb-4 flex-shrink-0'>
                <div className='w-10 h-1 rounded-full bg-gray-300' />
            </div>

            {/* Header */}
            <div className='mb-4 flex-shrink-0'>
                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5'>Ready to go?</p>
                <h3 className='text-xl font-bold text-gray-900'>Confirm Ride</h3>
            </div>

            {/* Rider Info */}
            <div className='flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 flex-shrink-0'>
                <img
                    className='h-12 w-12 rounded-full object-cover ring-2 ring-yellow-400 ring-offset-1 flex-shrink-0'
                    src='https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg'
                    alt='Rider'
                />
                <div className='flex-1 min-w-0'>
                    <h2 className='text-base font-bold text-gray-900 capitalize'>
                        {ride?.user?.fullname?.firstname ?? 'Rider'} {ride?.user?.fullname?.lastname ?? ''}
                    </h2>
                    <p className='text-xs text-gray-500 mt-0.5'>4.8 ★ · Verified Rider</p>
                </div>
                <div className='text-right flex-shrink-0'>
                    <p className='text-xs text-gray-500'>Fare</p>
                    <p className='text-lg font-bold text-gray-900'>₹{ride?.fare ?? '—'}</p>
                </div>
            </div>

            {/* Route */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden flex-shrink-0'>
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='flex flex-col items-center gap-1 pt-0.5'>
                        <div className='h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow' />
                        <div className='w-0.5 h-5 bg-gray-200' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Pickup</p>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{ride?.pickup ?? '—'}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
                    <div className='pt-0.5'>
                        <div className='h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Drop-off</p>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{ride?.destination ?? '—'}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-4'>
                    <div className='pt-0.5'>
                        <i className='ri-cash-line text-gray-500 text-base'></i>
                    </div>
                    <div>
                        <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Payment</p>
                        <p className='text-sm font-semibold text-gray-800'>Cash · ₹{ride?.fare ?? '—'}</p>
                    </div>
                </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={submitHandler} className='flex flex-col gap-3 flex-shrink-0'>
                <div>
                    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
                        Enter Rider OTP
                    </label>
                    <input
                        value={otp}
                        onChange={(e) => { setOtp(e.target.value); setError('') }}
                        type='text'
                        inputMode='numeric'
                        maxLength={6}
                        className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl text-center text-2xl font-bold tracking-[0.5em] text-gray-900 placeholder:text-gray-300 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:ring-2 transition-all duration-150 ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-yellow-300'
                            }`}
                        placeholder='· · · · · ·'
                    />
                    {error && (
                        <p className='text-xs text-red-500 mt-2 flex items-center gap-1'>
                            <i className='ri-error-warning-line'></i> {error}
                        </p>
                    )}
                </div>

                <button
                    type='submit'
                    disabled={isSubmitting || otp.trim().length === 0}
                    className={`w-full py-4 rounded-2xl font-bold text-base text-black bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all duration-150 shadow-md flex items-center justify-center gap-2 ${isSubmitting || otp.trim().length === 0 ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <svg className='animate-spin h-4 w-4 text-black' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                            </svg>
                            Verifying...
                        </>
                    ) : (
                        <>
                            <i className='ri-map-pin-line text-lg'></i>
                            Start Ride
                        </>
                    )}
                </button>

                <button
                    type='button'
                    onClick={handleCancel}
                    className='w-full py-3.5 rounded-2xl font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-150'
                >
                    Cancel Ride
                </button>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp
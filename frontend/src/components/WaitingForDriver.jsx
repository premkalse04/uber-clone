import React from 'react'

const WaitingForDriver = ({ ride, setWaitingForDriver }) => {
  const captain = ride?.captain
  const otp = ride?.otp

  return (
    <div className='flex flex-col overflow-y-auto' style={{ maxHeight: '85vh' }}>
      {/* Drag Handle */}
      <div className='flex justify-center mb-4'>
        <div className='w-10 h-1 rounded-full bg-gray-300' />
      </div>

      {/* Header */}
      <div className='mb-4'>
        <p className='text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5'>On the way!</p>
        <h3 className='text-xl font-bold text-gray-900'>Driver Confirmed</h3>
      </div>

      {/* Driver Card */}
      <div className='flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100'>
        <img
          className='h-14 w-14 rounded-full object-cover ring-2 ring-yellow-400 ring-offset-1 flex-shrink-0'
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s'
          alt='Driver'
        />
        <div className='flex-1 min-w-0'>
          <h2 className='text-base font-bold text-gray-900 capitalize'>
            {captain?.fullname?.firstname ?? 'Your Driver'} {captain?.fullname?.lastname ?? ''}
          </h2>
          <p className='text-sm font-semibold text-gray-700 mt-0.5 tracking-wide'>
            {captain?.vehicle?.plate ?? '—'}
          </p>
          <p className='text-xs text-gray-500 mt-0.5'>4.8 ★ · Verified Captain</p>
        </div>
        <div className='flex-shrink-0 text-right'>
          <p className='text-xs text-gray-500 font-medium mb-1'>Fare</p>
          <p className='text-lg font-bold text-gray-900'>₹{ride?.fare ?? '—'}</p>
        </div>
      </div>

      {/* OTP Badge */}
      {otp && (
        <div className='bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-4 flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1'>Your Ride OTP</p>
            <p className='text-xs text-yellow-600'>Share this with your driver to start the ride</p>
          </div>
          <p className='text-3xl font-bold text-yellow-700 tracking-[0.25em] font-mono'>{otp}</p>
        </div>
      )}

      {/* Route Card */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden'>
        <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
          <div className='pt-0.5 flex-shrink-0'>
            <div className='h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Pickup</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{ride?.pickup ?? '—'}</p>
          </div>
        </div>
        <div className='flex items-start gap-4 p-4 border-b border-gray-100'>
          <div className='pt-0.5 flex-shrink-0'>
            <div className='h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Drop-off</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{ride?.destination ?? '—'}</p>
          </div>
        </div>
        <div className='flex items-center gap-4 p-4'>
          <i className='ri-cash-line text-gray-500 text-base flex-shrink-0'></i>
          <div>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5'>Payment</p>
            <p className='text-sm font-semibold text-gray-800'>Cash · ₹{ride?.fare ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Cancel */}
      <button
        onClick={() => setWaitingForDriver(false)}
        className='w-full py-3.5 rounded-2xl font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-150'
      >
        Cancel Ride
      </button>
    </div>
  )
}

export default WaitingForDriver
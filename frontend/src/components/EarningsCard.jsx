import React from 'react'

const StatBadge = ({ icon, value, label }) => (
    <div className='flex flex-col items-center gap-1 flex-1'>
        <div className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-1'>
            <i className={`${icon} text-xl text-gray-700`}></i>
        </div>
        <span className='text-base font-bold text-gray-900'>{value}</span>
        <span className='text-xs text-gray-500 text-center leading-tight'>{label}</span>
    </div>
)

const EarningsCard = ({ captain, stats = {} }) => {
    const {
        earnings = '295.20',
        hoursOnline = '10.2',
        ridesCompleted = '8',
        rating = '4.9'
    } = stats

    return (
        <div className='bg-white rounded-2xl shadow-md p-5 border border-gray-100'>
            {/* Captain Info + Earnings */}
            <div className='flex items-center justify-between mb-5'>
                <div className='flex items-center gap-3'>
                    <div className='relative'>
                        <img
                            className='h-12 w-12 rounded-full object-cover ring-2 ring-yellow-400 ring-offset-1'
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s'
                            alt='Captain'
                        />
                        <span className='absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white'></span>
                    </div>
                    <div>
                        <h4 className='text-sm font-bold text-gray-900 capitalize leading-tight'>
                            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                        </h4>
                        <p className='text-xs text-gray-500 mt-0.5'>
                            {captain?.vehicle?.plate ?? 'MH 01 AB 1234'}
                        </p>
                    </div>
                </div>

                {/* Today's Earnings */}
                <div className='text-right'>
                    <p className='text-xs text-gray-500 font-medium mb-0.5'>Today's Earnings</p>
                    <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>₹{earnings}</h2>
                </div>
            </div>

            {/* Divider */}
            <div className='h-px bg-gray-100 mb-4' />

            {/* Stats Grid */}
            <div className='flex items-start justify-around gap-2'>
                <StatBadge icon='ri-timer-2-line' value={`${hoursOnline}h`} label='Hours Online' />
                <div className='w-px h-12 bg-gray-100 self-center' />
                <StatBadge icon='ri-route-line' value={ridesCompleted} label='Rides Done' />
                <div className='w-px h-12 bg-gray-100 self-center' />
                <StatBadge icon='ri-star-line' value={rating} label='Rating' />
            </div>
        </div>
    )
}

export default EarningsCard

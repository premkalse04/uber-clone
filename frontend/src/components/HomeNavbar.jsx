import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = ['Ride', 'Rentals']

const HomeNavbar = ({ user }) => {
    const [activeTab, setActiveTab] = useState('Ride')
    const navigate = useNavigate()

    return (
        <nav className='fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-6 shadow-sm'>

            {/* Logo */}
            <div className='flex items-center flex-shrink-0'>
                <img
                    src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
                    alt='Uber'
                    className='h-6 w-auto'
                />
            </div>

            {/* Divider */}
            <div className='h-6 w-px bg-gray-200' />

            {/* Ride / Rentals Tabs */}
            <div className='flex items-center gap-1'>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${activeTab === tab
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Right — Activity + Profile */}
            <div className='ml-auto flex items-center gap-2'>
                <button
                    onClick={() => navigate('/activity')}
                    className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-150'
                >
                    <i className='ri-time-line text-base'></i>
                    <span className='hidden sm:inline'>Activity</span>
                </button>

                {/* Profile avatar */}
                <button
                    onClick={() => navigate('/user/logout')}
                    className='flex items-center gap-2.5 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-150'
                    title='Account & logout'
                >
                    <div className='h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center'>
                        <span className='text-xs font-bold text-white uppercase'>
                            {user?.fullname?.firstname?.[0] ?? 'U'}
                        </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-800 hidden md:inline capitalize'>
                        {user?.fullname?.firstname ?? 'Account'}
                    </span>
                    <i className='ri-arrow-down-s-line text-gray-500 text-sm hidden md:inline'></i>
                </button>
            </div>
        </nav>
    )
}

export default HomeNavbar

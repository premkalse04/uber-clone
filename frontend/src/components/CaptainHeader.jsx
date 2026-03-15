import React from 'react'
import { useNavigate } from 'react-router-dom'

const CaptainHeader = ({ isOnline, onToggle }) => {
    const navigate = useNavigate()

    return (
        <div className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm'>
            {/* Logo */}
            <div className='flex items-center gap-2'>
                <img
                    className='h-7 w-auto'
                    src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
                    alt='Uber Captain'
                />
                <span className='text-xs font-semibold text-gray-400 tracking-widest uppercase ml-1'>Captain</span>
            </div>

            {/* Online Toggle */}
            <div className='flex items-center gap-3'>
                <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${isOnline ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                </span>
                <button
                    onClick={onToggle}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none shadow-inner ${isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                    aria-label='Toggle online status'
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isOnline ? 'translate-x-8' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>
        </div>
    )
}

export default CaptainHeader

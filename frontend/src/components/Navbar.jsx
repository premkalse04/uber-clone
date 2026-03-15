import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const Navbar = () => {
    const [profileOpen, setProfileOpen] = useState(false)
    const [activeNav, setActiveNav] = useState('home')
    const dropdownRef = useRef(null)
    const { user } = useContext(UserDataContext)
    const navigate = useNavigate()

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
        } catch (_) { }
        localStorage.removeItem('token')
        navigate('/login')
    }

    // Get initials for avatar
    const getInitials = () => {
        const first = user?.fullname?.firstname || user?.fullName?.firstName || ''
        const last = user?.fullname?.lastname || user?.fullName?.lastName || ''
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || 'U'
    }

    const getFullName = () => {
        const first = user?.fullname?.firstname || user?.fullName?.firstName || 'User'
        const last = user?.fullname?.lastname || user?.fullName?.lastName || ''
        return `${first} ${last}`.trim()
    }

    const navLinks = [
        { id: 'home', label: 'Home', icon: 'ri-home-5-line', path: '/home' },
        { id: 'ride', label: 'Ride', icon: 'ri-taxi-line', path: '/home' },
        { id: 'about', label: 'About', icon: 'ri-information-line', path: '/home' },
    ]

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
            style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)',
            }}
        >
            {/* Left: Logo + Name */}
            <div className="flex items-center gap-2.5">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                    alt="Uber"
                    className="h-6 w-auto brightness-0 invert"
                />
                <span className="text-white font-black text-xl tracking-tight hidden sm:block">Uber</span>
            </div>

            {/* Center: Nav Links */}
            <div className="flex items-center gap-1 bg-white bg-opacity-15 backdrop-blur-md rounded-full px-2 py-1.5 border border-white border-opacity-20">
                {navLinks.map(link => (
                    <button
                        key={link.id}
                        onClick={() => setActiveNav(link.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeNav === link.id
                                ? 'bg-white text-black shadow-sm'
                                : 'text-white hover:bg-white hover:bg-opacity-20'
                            }`}
                    >
                        <i className={`${link.icon} text-sm`}></i>
                        <span className="hidden sm:inline">{link.label}</span>
                    </button>
                ))}
            </div>

            {/* Right: Profile */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setProfileOpen(prev => !prev)}
                    className="flex items-center gap-2 bg-white bg-opacity-15 backdrop-blur-md border border-white border-opacity-20 rounded-full px-2 py-1.5 hover:bg-opacity-25 transition-all duration-200"
                >
                    {/* Avatar circle */}
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {getInitials()}
                    </div>
                    <i className={`ri-arrow-${profileOpen ? 'up' : 'down'}-s-line text-white text-sm`}></i>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn">
                        {/* Profile Header */}
                        <div className="bg-black px-4 py-4 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-lg font-bold border-2 border-white border-opacity-40">
                                {getInitials()}
                            </div>
                            <div>
                                <p className="text-white font-bold text-base leading-tight">{getFullName()}</p>
                                <p className="text-gray-300 text-xs mt-0.5 leading-tight">{user?.email || ''}</p>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="px-4 py-3 space-y-2 border-b border-gray-100">
                            <div className="flex items-center gap-3 py-1.5">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className="ri-shield-star-line text-gray-600 text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Account type</p>
                                    <p className="text-sm font-semibold text-gray-800">Rider</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 py-1.5">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className="ri-mail-line text-gray-600 text-sm"></i>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.email || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 py-1.5">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className="ri-star-line text-gray-600 text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Rating</p>
                                    <p className="text-sm font-semibold text-gray-800">⭐ 4.9</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-3 py-2 space-y-0.5">
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                                <i className="ri-settings-3-line text-gray-500 text-base"></i>
                                <span className="text-sm font-medium text-gray-700">Settings</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                                <i className="ri-customer-service-2-line text-gray-500 text-base"></i>
                                <span className="text-sm font-medium text-gray-700">Help & Support</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left"
                            >
                                <i className="ri-logout-circle-r-line text-red-500 text-base"></i>
                                <span className="text-sm font-medium text-red-500">Log out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar

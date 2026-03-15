import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const userData = { email, password }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (err) {
      const serverErrors = err?.response?.data?.errors
      if (serverErrors && serverErrors.length > 0) {
        setError(serverErrors.map(e => e.msg).join(', '))
      } else {
        setError(err?.response?.data?.message || 'Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Google OAuth placeholder
    alert('Google Sign-In coming soon!')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }}></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }}></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Uber Logo */}
          <div className="mb-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
              alt="Uber"
              className="h-12 w-auto brightness-0 invert"
            />
          </div>

          <h1 className="text-4xl font-black mb-4 text-center tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-400 text-lg text-center max-w-xs leading-relaxed">
            Log in to your account and get moving. Fast rides, every time.
          </p>

          {/* Decorative car icon */}
          <div className="mt-12 flex items-center gap-3 bg-white bg-opacity-10 rounded-2xl px-6 py-4 backdrop-blur-sm">
            <div className="text-3xl">🚗</div>
            <div>
              <p className="font-semibold text-sm">Ready to ride?</p>
              <p className="text-gray-400 text-xs">Your driver is just moments away</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 bg-white">
        {/* Mobile logo */}
        <div className="flex justify-center mb-8 lg:hidden">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber"
            className="h-8 w-auto"
          />
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Sign in</h2>
          <p className="text-gray-500 mb-8 text-sm">Don't have an account? <Link to='/signup' className="text-black font-semibold underline underline-offset-2">Create one</Link></p>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 px-4 mb-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                type="email"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                type="password"
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 active:scale-95 transition-all duration-200 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Captain Login link */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              to='/captain-login'
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-black transition-all duration-200"
            >
              <span>🚖</span> Sign in as Captain
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
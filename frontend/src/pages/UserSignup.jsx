import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const newUser = {
        fullname: { firstname: firstName, lastname: lastName },
        email,
        password
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
      if (response.status === 201) {
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
        setError(err?.response?.data?.message || 'Registration failed. Please check your details.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    alert('Google Sign-Up coming soon!')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' }}>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }}></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }}></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="mb-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
              alt="Uber"
              className="h-12 w-auto brightness-0 invert"
            />
          </div>

          <h1 className="text-4xl font-black mb-4 text-center tracking-tight">
            Join Uber today
          </h1>
          <p className="text-gray-400 text-lg text-center max-w-xs leading-relaxed">
            Create your account and start riding in minutes.
          </p>

          <div className="mt-12 space-y-4 w-full max-w-xs">
            {[
              { icon: '⚡', title: 'Instant booking', desc: 'Get a ride in under 2 minutes' },
              { icon: '🔒', title: 'Safe & secure', desc: 'All rides are GPS tracked' },
              { icon: '💳', title: 'Easy payments', desc: 'Pay with card or cash' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 bg-white bg-opacity-10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex justify-center mb-8 lg:hidden">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber"
            className="h-8 w-auto"
          />
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Create account</h2>
          <p className="text-gray-500 mb-8 text-sm">Already have an account? <Link to='/login' className="text-black font-semibold underline underline-offset-2">Sign in</Link></p>

          {/* Google Sign-Up Button */}
          <button
            onClick={handleGoogleSignup}
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
              <div className="flex gap-3">
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="First name (min 3 chars)"
                  minLength={3}
                />
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="Last name (min 3 chars)"
                  minLength={3}
                />
              </div>
            </div>

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
                placeholder="Create a password (min 6 chars)"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 active:scale-95 transition-all duration-200 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
            By creating an account you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const captainData = {
        fullname: { firstname: firstName, lastname: lastName },
        email,
        password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType
        }
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
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
      {/* Left Column - Captain Branding */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden sticky top-0 h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-10 text-white">
          <div className="mb-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
              alt="Uber"
              className="h-10 w-auto brightness-0 invert"
            />
          </div>

          <div className="mb-5 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.2)', border: '2px solid rgba(34, 197, 94, 0.4)' }}>
            <span className="text-3xl">🚖</span>
          </div>

          <h1 className="text-3xl font-black mb-3 text-center tracking-tight">
            Become a Captain
          </h1>
          <p className="text-slate-400 text-base text-center max-w-xs leading-relaxed mb-8">
            Join thousands of captains earning with Uber. Set your own hours and be your own boss.
          </p>

          <div className="space-y-3 w-full max-w-xs">
            {[
              { icon: '💰', title: 'Earn on your schedule', desc: 'Drive when you want' },
              { icon: '🛡️', title: 'Insurance coverage', desc: 'Protected on every ride' },
              { icon: '📱', title: 'Easy onboarding', desc: 'Start earning in days' },
              { icon: '⭐', title: 'Top captain bonuses', desc: 'Extra rewards for great service' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-7/12 flex flex-col px-8 sm:px-12 lg:px-14 py-10 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex justify-center mb-6 lg:hidden">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber"
            className="h-8 w-auto"
          />
        </div>

        <div className="max-w-lg w-full mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🚖</span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Captain Registration</h2>
          </div>
          <p className="text-gray-500 mb-6 text-sm">Already a captain? <Link to='/captain-login' className="text-black font-semibold underline underline-offset-2">Sign in here</Link></p>

          {/* Google Sign-Up Button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 px-4 mb-5 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700"
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
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm font-medium">or fill in details</span>
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
            {/* Personal Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
              <div className="flex gap-3">
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="First name"
                />
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="Last name"
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
                placeholder="Create a password"
              />
            </div>

            {/* Vehicle Info Section */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Vehicle Details</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle color</label>
                    <input
                      required
                      value={vehicleColor}
                      onChange={(e) => setVehicleColor(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      type="text"
                      placeholder="e.g. White"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">License plate</label>
                    <input
                      required
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      type="text"
                      placeholder="e.g. MH 01 AB 1234"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacity (seats)</label>
                    <input
                      required
                      value={vehicleCapacity}
                      onChange={(e) => setVehicleCapacity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      type="number"
                      min="1"
                      placeholder="e.g. 4"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle type</label>
                    <select
                      required
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    >
                      <option value="" disabled>Select type</option>
                      <option value="car">🚗 Car</option>
                      <option value="auto">🛺 Auto</option>
                      <option value="moto">🏍️ Moto</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 active:scale-95 transition-all duration-200 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Captain Account'}
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

export default CaptainSignup
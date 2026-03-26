import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

const DEFAULT_GUEST = {
  id: 'guest_default',
  name: 'Guest Traveler',
  email: 'guest@voyagerai.com',
  avatar: 'https://ui-avatars.com/api/?name=Guest&background=2563eb&color=fff&bold=true',
  phone: '',
  homeDistrict: '',
  travelStyle: [],
  savedTrips: [],
  emergencyContact: '',
  preferredLanguage: 'English',
  joinedDate: new Date().toISOString(),
  tripsPlanned: 0,
}

const GOOGLE_DEMO_USER = {
  id: 'google_demo_001',
  name: 'Arjun Kumar',
  email: 'arjun@gmail.com',
  avatar: 'https://ui-avatars.com/api/?name=Arjun+Kumar&background=2563eb&color=fff&bold=true',
  phone: '+91 98765 43210',
  homeDistrict: 'Chennai',
  travelStyle: ['Temple', 'Heritage', 'Food Tour'],
  savedTrips: [],
  emergencyContact: 'Priya Kumar: +91 87654 32109',
  preferredLanguage: 'Tamil',
  joinedDate: new Date().toISOString(),
  tripsPlanned: 3,
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('voyager_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        setIsLoggedIn(true)
      }
    } catch { /* ignore parse errors */ }
    setLoading(false)
  }, [])

  const login = (provider = 'guest') => {
    const newUser = provider === 'google'
      ? { ...GOOGLE_DEMO_USER, joinedDate: new Date().toISOString() }
      : { ...DEFAULT_GUEST, id: `guest_${Date.now()}`, joinedDate: new Date().toISOString() }

    localStorage.setItem('voyager_user', JSON.stringify(newUser))
    setUser(newUser)
    setIsLoggedIn(true)
    setShowLoginModal(false)
    toast.success(`Welcome${provider === 'google' ? ', Arjun' : ''}! 👋`)
  }

  const logout = () => {
    localStorage.removeItem('voyager_user')
    setUser(null)
    setIsLoggedIn(false)
    toast.success('Logged out successfully')
  }

  const updateProfile = (data) => {
    const updated = { ...user, ...data }
    localStorage.setItem('voyager_user', JSON.stringify(updated))
    setUser(updated)
    toast.success('Profile saved! ✅')
  }

  const saveTrip = (trip) => {
    const trips = [...(user?.savedTrips || []), { ...trip, id: `trip_${Date.now()}`, savedAt: new Date().toISOString() }]
    const updated = { ...user, savedTrips: trips, tripsPlanned: (user?.tripsPlanned || 0) + 1 }
    localStorage.setItem('voyager_user', JSON.stringify(updated))
    setUser(updated)
    toast.success('Trip saved! 🗺️')
  }

  const deleteTrip = (tripId) => {
    const trips = (user?.savedTrips || []).filter(t => t.id !== tripId)
    const updated = { ...user, savedTrips: trips }
    localStorage.setItem('voyager_user', JSON.stringify(updated))
    setUser(updated)
    toast.success('Trip removed')
  }

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, loading,
      showLoginModal, setShowLoginModal,
      login, logout, updateProfile, saveTrip, deleteTrip,
      // Legacy compatibility
      isAuthenticated: isLoggedIn,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
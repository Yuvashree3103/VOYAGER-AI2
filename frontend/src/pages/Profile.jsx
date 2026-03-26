import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  User, MapPin, Phone, Shield, BookOpen, Heart, Star,
  Edit2, Check, X, LogOut, Map, Trash2, Calendar, Languages
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ALL_39_DISTRICTS = [
  'Ariyalur', 'Chennai', 'Chengalpattu', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thiruvallur', 'Tirupathur', 'Tiruppur',
  'Tiruvannamalai', 'Tiruvarur', 'Thoothukudi', 'Tirunelveli',
  'Tiruchirappalli', 'Vellore', 'Villupuram', 'Virudhunagar', 'Sivagangai'
]

const TRAVEL_INTERESTS = [
  'Temple', 'Beach', 'Heritage', 'Wildlife', 'Food Tour',
  'Shopping', 'Photography', 'Hill Station', 'Pilgrimage', 'Adventure'
]

const Profile = () => {
  const { user, isLoggedIn, updateProfile, deleteTrip, logout, setShowLoginModal } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    homeDistrict: user?.homeDistrict || '',
    emergencyContact: user?.emergencyContact || '',
    travelStyle: user?.travelStyle || [],
    preferredLanguage: user?.preferredLanguage || 'English',
  })

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 pt-24 px-4 flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sign in to view your profile</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Save trips, journals & personalise your experience</p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg"
        >
          Sign In / Create Account
        </button>
      </div>
    )
  }

  const toggleInterest = (interest) => {
    setEditData(prev => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(interest)
        ? prev.travelStyle.filter(i => i !== interest)
        : [...prev.travelStyle, interest]
    }))
  }

  const saveProfile = () => {
    updateProfile(editData)
    setEditing(false)
  }

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return 'Unknown' }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#f8faff] dark:bg-slate-950 pt-24 px-4 md:px-6 pb-16"
    >
      <div className="max-w-2xl mx-auto">

        {/* ── Header Card ────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 text-white mb-6 shadow-xl shadow-blue-500/20">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black truncate">{user.name}</h1>
              <p className="text-blue-200 text-sm truncate">{user.email}</p>
              <p className="text-blue-300 text-xs mt-1">Member since {formatDate(user.joinedDate)}</p>
            </div>
            <button
              onClick={() => { setEditData({ name: user.name, phone: user.phone || '', homeDistrict: user.homeDistrict || '', emergencyContact: user.emergencyContact || '', travelStyle: user.travelStyle || [], preferredLanguage: user.preferredLanguage || 'English' }); setEditing(true) }}
              className="shrink-0 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl px-4 py-2 text-sm font-bold transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-black">{user.tripsPlanned || 0}</p>
              <p className="text-xs text-blue-200">Trips Planned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black">{(user.savedTrips || []).length}</p>
              <p className="text-xs text-blue-200">Saved Trips</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black truncate">{user.homeDistrict || '—'}</p>
              <p className="text-xs text-blue-200">Home District</p>
            </div>
          </div>
        </div>

        {/* ── Travel Interests (read-only chips) ─────────────── */}
        {!editing && (user.travelStyle || []).length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-pink-500" />
              <h3 className="font-black text-slate-900 dark:text-white text-sm">Travel Interests</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.travelStyle.map(interest => (
                <span key={interest} className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Edit Form ──────────────────────────────────────── */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-4"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-slate-900 dark:text-white">Edit Profile</h2>
              <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone (for SOS)
                </label>
                <input value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              {/* Home District */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Home District
                </label>
                <select value={editData.homeDistrict} onChange={e => setEditData({ ...editData, homeDistrict: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">Select district</option>
                  {ALL_39_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {/* Emergency Contact */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Emergency Contact
                </label>
                <input value={editData.emergencyContact} onChange={e => setEditData({ ...editData, emergencyContact: e.target.value })}
                  placeholder="Name: +91 XXXXX XXX"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              {/* Language */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Languages className="w-3 h-3" /> Preferred Language
                </label>
                <div className="flex gap-2">
                  {['English', 'Tamil', 'Tanglish'].map(lang => (
                    <button key={lang} type="button"
                      onClick={() => setEditData({ ...editData, preferredLanguage: lang })}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${editData.preferredLanguage === lang ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300'}`}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              {/* Travel Interests */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> Travel Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_INTERESTS.map(interest => (
                    <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${editData.travelStyle.includes(interest) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={saveProfile}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
                <Check className="w-4 h-4" /> Save Changes
              </button>
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Saved Trips ────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-blue-500" />
              <h2 className="font-black text-slate-900 dark:text-white">Saved Trips ({(user.savedTrips || []).length})</h2>
            </div>
            <button onClick={() => navigate('/plan')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              + Plan New Trip
            </button>
          </div>

          {(user.savedTrips || []).length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <div className="text-5xl mb-3">🗺️</div>
              <p className="font-semibold text-sm">No saved trips yet.</p>
              <p className="text-xs mt-1">Plan your first Tamil Nadu trip!</p>
              <button onClick={() => navigate('/plan')}
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
                Plan Trip
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {(user.savedTrips || []).map(trip => (
                <div key={trip.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">{trip.destination || 'Unknown'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {trip.days || '?'} days · {trip.travelers || 1} traveler{(trip.travelers || 1) > 1 ? 's' : ''}
                      {trip.budget ? ` · ₹${trip.budget.toLocaleString('en-IN')}` : ''}
                    </p>
                    {trip.savedAt && (
                      <p className="text-[10px] text-slate-400 mt-0.5">Saved {formatDate(trip.savedAt)}</p>
                    )}
                  </div>
                  <button onClick={() => deleteTrip(trip.id)}
                    className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick Links ───────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigate('/journal')}
              className="flex items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-200 transition-colors text-sm font-semibold">
              <BookOpen className="w-4 h-4 text-emerald-500" /> My Journals
            </button>
            <button onClick={() => navigate('/emergency')}
              className="flex items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-200 transition-colors text-sm font-semibold">
              <Shield className="w-4 h-4 text-red-500" /> Emergency
            </button>
            <button onClick={() => navigate('/advisor')}
              className="flex items-center gap-2 p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-700 dark:text-slate-200 transition-colors text-sm font-semibold">
              <Star className="w-4 h-4 text-amber-500" /> AI Advisor
            </button>
            <button onClick={() => navigate('/translator')}
              className="flex items-center gap-2 p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 text-slate-700 dark:text-slate-200 transition-colors text-sm font-semibold">
              <Languages className="w-4 h-4 text-teal-500" /> Translator
            </button>
          </div>
        </div>

        {/* ── Logout ─────────────────────────────────────────── */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-2xl py-4 font-black hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout from VoyagerAI
        </button>
      </div>
    </motion.div>
  )
}

export default Profile

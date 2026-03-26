import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, MapPin, Languages, ArrowRight, ShoppingBag, Utensils,
  Luggage, Globe, Shield, Users, BookOpen, Sparkles, MessageCircle,
  Map as MapIcon, Wallet, Search, ExternalLink, Gift, X, Clock,
  Package, Phone, Calendar, Tag, ChevronRight, Info, DollarSign,
  Heart, Share2, Navigation, Sun, Cloud, CloudRain, Wind, Thermometer
} from 'lucide-react'
import HeroCarousel from '../components/HeroCarousel'
import SectionHeader from '../components/SectionHeader'
import GradientButton from '../components/GradientButton'
import Footer from '../components/Footer'
import GuideBookingModal from '../components/GuideBookingModal'
import { PackingModal, LanguageModal, SafetyModal, ExpenseModal, JournalModal } from '../components/FeatureModals'

import agencyData from '../data/agencies.json'
import guideData from '../data/guides.json'
import foodData from '../data/foodAndShopping.json'

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatINR = (n) => Number(n).toLocaleString('en-IN')

const ALL_DISTRICTS = Object.keys(foodData).sort()
const FEATURED_TABS = ['Chennai', 'Madurai', 'Ooty', 'Thanjavur', 'Kanchipuram', 'Tirunelveli', 'Kodaikanal']

// ── Tamil Greeting ───────────────────────────────────────────────────────────
const getTamilGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return { ta: 'காலை வணக்கம்', en: 'Good Morning', emoji: '🌅' }
  if (h < 17) return { ta: 'மதிய வணக்கம்', en: 'Good Afternoon', emoji: '☀️' }
  if (h < 20) return { ta: 'மாலை வணக்கம்', en: 'Good Evening', emoji: '🌇' }
  return { ta: 'இரவு வணக்கம்', en: 'Good Night', emoji: '🌙' }
}

// ── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, duration = 1500 }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => { start = Math.min(start + step, target); setCount(start); if (start >= target) clearInterval(timer) }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return <>{count.toLocaleString('en-IN')}</>
}

// ── Minimal Weather Widget ────────────────────────────────────────────────────
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('Chennai')
  const CITIES = ['Chennai', 'Madurai', 'Coimbatore', 'Ooty', 'Trichy', 'Salem']
  // Simulated weather for expo (OpenWeatherMap free API requires key)
  const MOCK_WEATHER = {
    Chennai: { temp: 34, condition: 'Partly Cloudy', humidity: 72, wind: 14, icon: '⛅' },
    Madurai: { temp: 36, condition: 'Sunny', humidity: 58, wind: 10, icon: '☀️' },
    Coimbatore: { temp: 29, condition: 'Light Rain', humidity: 80, wind: 18, icon: '🌦️' },
    Ooty: { temp: 18, condition: 'Cool & Cloudy', humidity: 85, wind: 22, icon: '🌤️' },
    Trichy: { temp: 37, condition: 'Hot & Sunny', humidity: 55, wind: 8, icon: '☀️' },
    Salem: { temp: 32, condition: 'Clear', humidity: 62, wind: 12, icon: '🌤️' },
  }
  useEffect(() => { setWeather(MOCK_WEATHER[city]) }, [city])
  if (!weather) return null
  return (
    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold opacity-80 uppercase tracking-wider">Live Weather</div>
        <select value={city} onChange={e => setCity(e.target.value)}
          className="bg-white/20 border border-white/30 rounded-lg px-2 py-0.5 text-xs font-bold text-white outline-none">
          {CITIES.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{weather.icon}</span>
        <div>
          <div className="text-3xl font-black">{weather.temp}°C</div>
          <div className="text-xs opacity-80">{weather.condition}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs opacity-70">Humidity: {weather.humidity}%</div>
          <div className="text-xs opacity-70">Wind: {weather.wind} km/h</div>
        </div>
      </div>
    </div>
  )
}

// ── TN Places Database (for Near Me) ──────────────────────────────────────────
const TN_PLACES = [
  { id: 1, name: "Marina Beach", lat: 13.0500, lng: 80.2824, category: "Beach", district: "Chennai", emoji: "🏖️" },
  { id: 2, name: "Kapaleeshwarar Temple", lat: 13.0339, lng: 80.2696, category: "Temple", district: "Chennai", emoji: "🏛️" },
  { id: 3, name: "Fort St. George", lat: 13.0802, lng: 80.2875, category: "Heritage", district: "Chennai", emoji: "🏰" },
  { id: 4, name: "Meenakshi Amman Temple", lat: 9.9195, lng: 78.1193, category: "Temple", district: "Madurai", emoji: "🏛️" },
  { id: 5, name: "Ooty Lake", lat: 11.4064, lng: 76.6932, category: "Hill Station", district: "Nilgiris", emoji: "⛰️" },
  { id: 6, name: "Botanical Garden Ooty", lat: 11.4031, lng: 76.7012, category: "Nature", district: "Nilgiris", emoji: "🌿" },
  { id: 7, name: "Vivekananda Rock Memorial", lat: 8.0773, lng: 77.5530, category: "Heritage", district: "Kanyakumari", emoji: "🪨" },
  { id: 8, name: "Brihadeeswarar Temple", lat: 10.7826, lng: 79.1317, category: "Temple", district: "Thanjavur", emoji: "🏛️" },
  { id: 9, name: "Ramanathaswamy Temple", lat: 9.2885, lng: 79.3174, category: "Temple", district: "Ramanathapuram", emoji: "🏛️" },
  { id: 10, name: "Pamban Bridge", lat: 9.2818, lng: 79.2087, category: "Heritage", district: "Ramanathapuram", emoji: "🌉" },
  { id: 11, name: "Kodaikanal Lake", lat: 10.2317, lng: 77.4892, category: "Hill Station", district: "Dindigul", emoji: "🌊" },
  { id: 12, name: "Shore Temple", lat: 12.6160, lng: 80.1994, category: "Heritage", district: "Chengalpattu", emoji: "🏰" },
  { id: 13, name: "Five Rathas", lat: 12.6231, lng: 80.1934, category: "Heritage", district: "Chengalpattu", emoji: "🏛️" },
  { id: 14, name: "Marudhamalai Temple", lat: 11.0861, lng: 76.9401, category: "Temple", district: "Coimbatore", emoji: "🏛️" },
  { id: 15, name: "Siruvani Waterfalls", lat: 10.9890, lng: 76.7090, category: "Waterfall", district: "Coimbatore", emoji: "💧" },
  { id: 16, name: "Yercaud Lake", lat: 11.7760, lng: 78.2093, category: "Hill Station", district: "Salem", emoji: "🏔️" },
  { id: 17, name: "Mettur Dam", lat: 11.7834, lng: 77.8002, category: "Nature", district: "Salem", emoji: "🌊" },
  { id: 18, name: "Hogenakkal Falls", lat: 12.1026, lng: 77.7893, category: "Waterfall", district: "Dharmapuri", emoji: "💧" },
  { id: 19, name: "Courtallam Main Falls", lat: 8.9373, lng: 77.2755, category: "Waterfall", district: "Tenkasi", emoji: "💧" },
  { id: 20, name: "Palani Murugan Temple", lat: 10.4505, lng: 77.5218, category: "Temple", district: "Dindigul", emoji: "🏛️" },
  { id: 21, name: "Sripuram Golden Temple", lat: 12.9602, lng: 79.1288, category: "Temple", district: "Vellore", emoji: "✨" },
  { id: 22, name: "Nellaiyappar Temple", lat: 8.7139, lng: 77.7567, category: "Temple", district: "Tirunelveli", emoji: "🏛️" },
  { id: 23, name: "Thirumalai Nayakar Mahal", lat: 9.9150, lng: 78.1218, category: "Heritage", district: "Madurai", emoji: "🏰" },
  { id: 24, name: "Kailasanathar Temple", lat: 12.8327, lng: 79.7068, category: "Temple", district: "Kanchipuram", emoji: "🏛️" },
  { id: 25, name: "Besant Nagar Beach", lat: 12.9990, lng: 80.2707, category: "Beach", district: "Chennai", emoji: "🏖️" },
  { id: 26, name: "Nilgiri Mountain Railway", lat: 11.4102, lng: 76.6950, category: "Heritage", district: "Nilgiris", emoji: "🚂" },
  { id: 27, name: "Dhanushkodi Beach", lat: 9.1739, lng: 79.4071, category: "Beach", district: "Ramanathapuram", emoji: "🏖️" },
  { id: 28, name: "Velankanni Church", lat: 10.6825, lng: 79.8470, category: "Heritage", district: "Nagapattinam", emoji: "⛪" },
  { id: 29, name: "Government Museum Egmore", lat: 13.0694, lng: 80.2595, category: "Museum", district: "Chennai", emoji: "🏛️" },
  { id: 30, name: "Coaker's Walk Kodaikanal", lat: 10.2292, lng: 77.4963, category: "Hill Station", district: "Dindigul", emoji: "🌄" },
]

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── Near Me Button ────────────────────────────────────────────────────────────
const NearMeButton = () => {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [nearby, setNearby] = useState([])

  const detect = () => {
    setStatus('loading')
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const sorted = TN_PLACES
          .map(p => ({ ...p, distance: haversineKm(lat, lng, p.lat, p.lng) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 8)
        setNearby(sorted)
        setStatus('done')
      },
      () => {
        // Fallback: show top 8 places sorted by distance from Chennai center
        const sorted = TN_PLACES
          .map(p => ({ ...p, distance: haversineKm(13.0827, 80.2707, p.lat, p.lng) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 8)
        setNearby(sorted)
        setStatus('done')
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const categoryColor = (cat) => {
    if (cat === 'Temple') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    if (cat === 'Beach') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    if (cat === 'Heritage') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    if (cat === 'Waterfall' || cat === 'Nature') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    if (cat === 'Hill Station') return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
    if (cat === 'Museum') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
  }

  return (
    <div>
      <button onClick={detect} disabled={status === 'loading'}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm disabled:opacity-60">
        <Navigation className="w-4 h-4 text-blue-500" />
        {status === 'loading' ? 'Detecting Location…' : '📍 Near Me'}
      </button>
      <AnimatePresence>
        {status === 'done' && nearby.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nearby.map(place => (
              <Link key={place.id} to={`/plan?district=${encodeURIComponent(place.district)}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${categoryColor(place.category)}`}>
                    {place.emoji} {place.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{place.distance.toFixed(0)} km</span>
                </div>
                <p className="font-black text-xs text-slate-800 dark:text-slate-100 leading-tight">{place.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{place.district}</p>
                <div className="mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:gap-1.5 flex items-center gap-1 transition-all">
                  Plan Trip <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Feature config ────────────────────────────────────────────────────────────
const FEATURES = [
  { id: 'packing', icon: Luggage, title: 'Smart Packing Checklist', description: 'Enter destination, season, and trip type to get a tailored packing list.', color: 'from-blue-500 to-cyan-500', link: '/packing' },
  { id: 'language', icon: Globe, title: 'Tamil Language Helper', description: 'Essential Tamil phrases with pronunciation for smooth travel conversations.', color: 'from-violet-500 to-purple-600', modal: 'language' },
  { id: 'advisor', icon: Sparkles, title: 'AI Travel Advisor', description: 'Ask Tamil Nadu travel questions and get AI-powered answers instantly.', color: 'from-orange-500 to-amber-500', link: '/advisor' },
  { id: 'safety', icon: Shield, title: 'Safety Alerts', description: 'City-specific emergency contacts (Police, Ambulance, Tourism) and safety tips.', color: 'from-red-500 to-rose-600', modal: 'safety' },
  { id: 'journal', icon: BookOpen, title: 'Travel Journal', description: 'Write and preserve your Tamil Nadu travel memories digitally.', color: 'from-emerald-500 to-teal-500', modal: 'journal' },
  { id: 'expense', icon: Users, title: 'Group Expense Splitter', description: 'Add all travelers and split trip costs fairly among the group.', color: 'from-pink-500 to-fuchsia-600', modal: 'expense' },
  { id: 'plan', icon: MapIcon, title: 'AI Trip Planner', description: 'Generate complete day-by-day Tamil Nadu itineraries in seconds.', color: 'from-indigo-500 to-blue-600', link: '/plan' },
  { id: 'budget', icon: Wallet, title: 'Budget Tracker', description: 'Track daily spending and stay within your travel budget.', color: 'from-yellow-500 to-orange-500', link: '/budget' },
  { id: 'chat', icon: MessageCircle, title: 'AI Chat', description: 'Live chat with your Voyager AI travel assistant — anytime.', color: 'from-sky-500 to-blue-600', link: '/advisor' },
  { id: 'offline', icon: Languages, title: 'Offline Phrase Guide', description: 'Basic Tamil phrases — memorise them before your trip!', color: 'from-slate-500 to-slate-700', modal: 'language' },
]

// ── Food/Item Detail Modal ────────────────────────────────────────────────────
const FoodDetailModal = ({ item, district, onClose }) => {
  if (!item) return null
  const isGift = item.type === 'Return Gift'
  const isFood = item.type === 'Food'
  const Icon = isGift ? Gift : isFood ? Utensils : ShoppingBag
  const accentColor = isGift ? 'violet' : isFood ? 'orange' : 'blue'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Header */}
          <div className="relative h-52 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            <div className="absolute bottom-4 left-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black text-white shadow bg-${accentColor}-600`}>
                <Icon className="h-3 w-3" />
                {item.type}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{item.title}</h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-orange-400" />
                  {district} District
                </div>
              </div>
              {item.price_range && (
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400">Price Range</div>
                  <div className="text-base font-black text-slate-900 dark:text-white">{item.price_range}</div>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>

            {/* Details Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {item.where_to_buy && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Package className="h-3 w-3" /> {isFood ? 'Where to Eat' : 'Where to Buy'}
                  </div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.where_to_buy}</div>
                </div>
              )}
              {item.best_time && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Clock className="h-3 w-3" /> Best Time
                  </div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.best_time}</div>
                </div>
              )}
              {item.shelf_life && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Calendar className="h-3 w-3" /> Shelf Life
                  </div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.shelf_life}</div>
                </div>
              )}
              {item.price_range && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-orange-500 mb-1">
                    <Tag className="h-3 w-3" /> Price Range
                  </div>
                  <div className="text-sm font-black text-orange-700 dark:text-orange-300">{item.price_range}</div>
                </div>
              )}
            </div>

            {/* Map Link */}
            <div className="mt-5 flex gap-3">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(item.title + ' ' + district)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-colors"
              >
                <Navigation className="h-4 w-4" /> View on Map
              </a>
              <Link
                to="/plan"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm hover:opacity-90 transition-all"
              >
                <MapIcon className="h-4 w-4" /> Plan Trip
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Agency Packages Modal ─────────────────────────────────────────────────────
const AgencyPackagesModal = ({ agency, onClose }) => {
  if (!agency) return null
  const packages = agency.packages_list || []

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{agency.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{agency.rating}</span>
                </div>
                <span className="text-sm text-slate-400">· Starting from ₹{formatINR(agency.startingPrice)}</span>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <X className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Packages list */}
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            {packages.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Visit their website for the latest packages.</p>
              </div>
            ) : (
              packages.map((pkg, i) => (
                <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 dark:text-white">{pkg.name}</h4>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{pkg.duration}</span>
                          <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{pkg.type}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{pkg.description}</p>
                        {pkg.includes && (
                          <div className="mt-3">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Includes</div>
                            <div className="flex flex-wrap gap-1.5">
                              {pkg.includes.map((inc, j) => (
                                <span key={j} className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-300">
                                  ✓ {inc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-black text-slate-900 dark:text-white">₹{formatINR(pkg.price)}</div>
                        <div className="text-xs text-slate-400">per person</div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black text-sm hover:opacity-90 transition-all"
                      >
                        Book Now <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <Link
                        to="/plan"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        AI Plan
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}

            <a
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-bold text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              View All Packages on {agency.name} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Agency Card ───────────────────────────────────────────────────────────────
const AgencyCard = ({ agency, onViewPackages }) => {
  const [imgError, setImgError] = useState(false)
  const packageCount = (agency.packages_list || []).length

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
      <div className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-shadow h-full flex flex-col">
        {/* Logo / Banner */}
        <div className="flex items-center justify-center h-28 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${agency.brandColor || '#3b82f6'}10, ${agency.brandColor || '#3b82f6'}25)` }}>
          {/* Decorative bg */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          {!imgError ? (
            <img
              src={agency.logoUrl}
              alt={agency.name}
              className="max-h-14 max-w-[140px] object-contain relative z-10"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center relative z-10">
              <div className="text-xl font-black px-4 py-2 rounded-xl text-white" style={{ background: agency.brandColor || '#3b82f6' }}>
                {agency.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
              </div>
            </div>
          )}
          {/* Package badge */}
          <div className="absolute top-3 right-3 bg-black/30 backdrop-blur rounded-full px-2 py-0.5 text-white text-xs font-bold">
            {packageCount} pkg{packageCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-black text-slate-900 dark:text-white text-base">{agency.name}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <MapPin className="h-3 w-3 text-orange-400" />{agency.location}
              </div>
            </div>
            <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full px-2.5 py-1 text-amber-700 dark:text-amber-300 text-xs font-black shrink-0">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />{agency.rating}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {agency.tourTypes.slice(0, 2).map(t => (
              <span key={t} className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">{t}</span>
            ))}
          </div>

          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">{agency.description}</div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="text-sm text-slate-500">From <span className="font-black text-slate-900 dark:text-white">₹{formatINR(agency.startingPrice)}</span></div>
            <button
              onClick={() => onViewPackages(agency)}
              className="inline-flex items-center gap-1.5 text-sm font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              View Packages <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Guide Card ────────────────────────────────────────────────────────────────
const GuideCard = ({ guide, onBook }) => (
  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-shadow">
      <div className="relative h-52">
        <img
          src={guide.photoUrl}
          alt={guide.name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <div className="font-black text-white text-base">{guide.name}</div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs mt-0.5">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{guide.rating} · {guide.experience}
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur rounded-full px-2.5 py-1 text-white text-xs font-black">
          ₹{formatINR(guide.pricePerDay)}/day
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-2">
          <MapPin className="h-4 w-4 text-orange-400" />{guide.city}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{guide.specialization}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {guide.languages.map(l => (
            <span key={l} className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Languages className="h-3 w-3" />{l}
            </span>
          ))}
        </div>
        <button
          onClick={() => onBook(guide)}
          className="mt-4 w-full py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-black hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:opacity-90"
        >
          Book Guide
        </button>
      </div>
    </div>
  </motion.div>
)

// ── Food/Shopping Card ────────────────────────────────────────────────────────
const FoodCard = ({ item, district, onSelect }) => {
  const isGift = item.type === 'Return Gift'
  const isFood = item.type === 'Food'
  const badgeColor = isGift ? 'bg-violet-600' : isFood ? 'bg-orange-500' : 'bg-blue-600'
  const Icon = isGift ? Gift : isFood ? Utensils : ShoppingBag
  const [imgFailed, setImgFailed] = useState(false)
  const gradientColor = isGift ? 'from-violet-100 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20'
    : isFood ? 'from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20'
      : 'from-blue-100 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20'
  const emoji = isFood ? '🍛' : isGift ? '🎁' : '🛍️'

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <button
        onClick={() => onSelect(item, district)}
        className="w-full text-left overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-shadow group"
      >
        {/* Image */}
        <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${imgFailed ? gradientColor : 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'}`}>
          {!imgFailed ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-5xl">{emoji}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.type}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black text-white shadow ${badgeColor}`}>
              <Icon className="h-3 w-3" />
              {item.type}
            </span>
          </div>
          {item.price_range && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur rounded-full px-2 py-0.5 text-white text-xs font-bold">
              {item.price_range}
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-4">
          <div className="font-black text-slate-900 dark:text-white text-sm">{item.title}</div>
          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{item.description}</div>
          {item.where_to_buy && (
            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold">
              <Package className="h-3 w-3" /> {item.where_to_buy}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">Tap for details</span>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </button>
    </motion.div>
  )
}

// ── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard = ({ feature, onOpen }) => {
  const Icon = feature.icon
  const Wrapper = feature.link ? Link : 'button'
  const wrapperProps = feature.link
    ? { to: feature.link }
    : { onClick: () => feature.modal && onOpen(feature.modal), type: 'button' }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
      <Wrapper {...wrapperProps} className="group block w-full text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 hover:shadow-xl transition-shadow">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-sm mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="font-black text-slate-900 dark:text-white text-sm">{feature.title}</div>
        <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</div>
        <div className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          {feature.modal ? 'Open Tool' : 'Go to Page'} <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Wrapper>
    </motion.div>
  )
}

// ── District Search Result Panel ──────────────────────────────────────────────
const DistrictResults = ({ district, data, onClose, onSelectItem }) => {
  const [activeTab, setActiveTab] = useState('all')
  const foodItems = data.food || []
  const buyItems = (data.buy || []).filter(x => x.type === 'Shopping')
  const giftItems = (data.buy || []).filter(x => x.type === 'Return Gift')
  const famousPlaces = data.famous_places || []
  const tabItems = activeTab === 'food' ? foodItems : activeTab === 'shopping' ? buyItems : activeTab === 'gifts' ? giftItems : [...foodItems, ...buyItems, ...giftItems]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="mt-6 rounded-3xl overflow-hidden border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 shadow-lg"
    >
      {/* City Header with famous places pills */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-black text-white">{district}</h3>
            <p className="text-blue-200 text-sm mt-0.5">{famousPlaces.length} Famous Places · {foodItems.length} Foods · {buyItems.length + giftItems.length} Shopping</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/plan" onClick={onClose} className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-black hover:bg-white/30 transition-all backdrop-blur">Plan Trip →</Link>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"><X className="h-4 w-4" /></button>
          </div>
        </div>
        {famousPlaces.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-blue-200 text-xs font-bold self-center">📍</span>
            {famousPlaces.map(p => (<a key={p} href={`https://www.google.com/maps/search/${encodeURIComponent(p + ' ' + district)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-bold text-white hover:bg-white/25 transition-colors">{p}</a>))}
          </div>
        )}
      </div>
      {/* Filter Tabs */}
      <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex gap-2 flex-wrap">
        {[{ id: 'all', label: 'All', emoji: '🌟', count: foodItems.length + buyItems.length + giftItems.length }, { id: 'food', label: 'Food', emoji: '🍛', count: foodItems.length }, { id: 'shopping', label: 'Shopping', emoji: '🛍️', count: buyItems.length }, { id: 'gifts', label: 'Return Gifts', emoji: '🎁', count: giftItems.length }].map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
            {tab.emoji} {tab.label} <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filtered Items Grid */}
      <div className="p-6">
        {tabItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tabItems.map(item => <FoodCard key={item.title} item={item} district={district} onSelect={onSelectItem} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>No {activeTab === 'all' ? '' : activeTab} data available for {district} yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Main Home Component ───────────────────────────────────────────────────────
const Home = () => {
  const [foodTab, setFoodTab] = useState('Chennai')
  const [bookingGuide, setBookingGuide] = useState(null)
  const [openModal, setOpenModal] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [searchDistrict, setSearchDistrict] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedItemDistrict, setSelectedItemDistrict] = useState('')
  const [selectedAgency, setSelectedAgency] = useState(null)
  const eatSectionRef = useRef(null)

  const currentDistrict = foodData[foodTab] || {}
  const foodItems = [...(currentDistrict.food || []), ...(currentDistrict.buy || [])]

  const handleSearch = (query) => {
    if (!query.trim()) { setSearchResult(null); setSearchDistrict(''); return }
    const q = query.trim()
    const match = ALL_DISTRICTS.find(d => d.toLowerCase() === q.toLowerCase())
      || ALL_DISTRICTS.find(d => d.toLowerCase().startsWith(q.toLowerCase()))
      || ALL_DISTRICTS.find(d => d.toLowerCase().includes(q.toLowerCase()))
    if (match && foodData[match]) {
      setSearchDistrict(match)
      setSearchResult(foodData[match])
      setSearchSuggestions([])
    } else {
      setSearchResult({ notFound: true })
      setSearchDistrict(q)
    }
  }

  const handleSuggestionInput = (q) => {
    setSearchQuery(q)
    if (q.length < 2) { setSearchSuggestions([]); return }
    setSearchSuggestions(ALL_DISTRICTS.filter(d => d.toLowerCase().includes(q.toLowerCase())).slice(0, 6))
  }

  const handleSelectItem = (item, district) => {
    setSelectedItem(item)
    setSelectedItemDistrict(district)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">

      {/* ── 0. SMART DASHBOARD ─────────────────────────────────── */}
      <div className="pt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Greeting + Near Me */}
            <div className="md:col-span-2">
              <div className="mb-2">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{getTamilGreeting().ta} {getTamilGreeting().emoji}</div>
                <div className="text-slate-500 dark:text-slate-400 text-sm">{getTamilGreeting().en} — Tamil Nadu's smartest travel companion is here</div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap gap-4 my-4">
                {[
                  { label: 'Districts', value: 39, suffix: '' },
                  { label: 'Places', value: 500, suffix: '+' },
                  { label: 'Food Guides', value: 31, suffix: '' },
                  { label: 'Trips Planned', value: 2847, suffix: '' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      <AnimatedCounter target={s.value} />{s.suffix}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              <NearMeButton />
            </div>

            {/* Weather Widget */}
            <div>
              <WeatherWidget />
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3">
                <div>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-300">🪔 Next Festival</div>
                  <div className="font-black text-slate-900 dark:text-white text-sm">Chithirai Festival</div>
                  <div className="text-xs text-slate-400">Madurai · April 14</div>
                </div>
                <Link to="/festivals" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">View all →</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 1. HERO CAROUSEL ──────────────────────────────────── */}
      <div className="mt-4 px-4 md:px-6 max-w-[1440px] mx-auto">
        <HeroCarousel />
      </div>

      {/* ── 2. EXPLORE TRAVEL AGENCIES ────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <SectionHeader
          title="Explore Travel Agencies"
          subtitle="Browse India's leading travel agencies for Tamil Nadu packages. Click 'View Packages' for packages, itineraries, and booking."
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {agencyData.map(a => <AgencyCard key={a.id} agency={a} onViewPackages={setSelectedAgency} />)}
        </div>
      </section>

      {/* ── 3. LOCAL GUIDES BOOKING ───────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <SectionHeader
          title="Book Local Guides"
          subtitle="Expert guides who know every lane, temple, and hidden gem in Tamil Nadu — priced transparently per day."
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {guideData.map(g => <GuideCard key={g.id} guide={g} onBook={setBookingGuide} />)}
        </div>
      </section>

      {/* ── 4. WHAT TO BUY & EAT ──────────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto" ref={eatSectionRef}>
        {/* Section header WITH search bar embedded */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">What to Buy & Eat</h2>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm">
              {ALL_DISTRICTS.length} districts covered — food, shopping & return gift ideas. <span className="text-blue-500 font-semibold">Click any card for details.</span>
            </p>
          </div>
          {/* Inline Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              placeholder="Search any Tamil Nadu district…"
              onChange={e => handleSuggestionInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
            {/* Autocomplete */}
            {searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                {searchSuggestions.map(s => (
                  <button
                    key={s}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    onClick={() => { setSearchQuery(s); setSearchSuggestions([]); handleSearch(s) }}
                  >
                    <MapPin className="h-3.5 w-3.5 text-orange-400 shrink-0" />{s} District
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick-search pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {['Madurai', 'Salem', 'Trichy', 'Coimbatore', 'Vellore', 'Thanjavur'].map(q => (
            <button
              key={q}
              onClick={() => { setSearchQuery(q); handleSearch(q) }}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 hover:border-blue-300"
            >
              {q}
            </button>
          ))}
          <span className="inline-flex items-center px-2 py-1.5 text-xs text-slate-400 font-medium">
            +{ALL_DISTRICTS.length - 6} more
          </span>
        </div>

        {/* Search Result */}
        <AnimatePresence>
          {searchResult && !searchResult.notFound && (
            <DistrictResults
              district={searchDistrict}
              data={searchResult}
              onClose={() => { setSearchResult(null); setSearchQuery(''); setSearchDistrict('') }}
              onSelectItem={handleSelectItem}
            />
          )}
          {searchResult?.notFound && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 p-5 rounded-2xl border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-sm font-medium flex items-center gap-3"
            >
              <Search className="h-5 w-5 shrink-0" />
              No results for "<strong>{searchDistrict}</strong>". Try: {ALL_DISTRICTS.slice(0, 5).join(', ')}...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured district tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {FEATURED_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFoodTab(tab)}
              className={`px-5 py-2 rounded-2xl text-sm font-black transition-all ${foodTab === tab
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
            >
              {tab}
            </button>
          ))}
          <span className="inline-flex items-center px-3 py-2 text-xs text-slate-400 font-medium">
            +{ALL_DISTRICTS.length - FEATURED_TABS.length} more (use search ↑)
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={foodTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
          >
            {foodItems.map(item => <FoodCard key={item.title} item={item} district={foodTab} onSelect={handleSelectItem} />)}
            {foodItems.length === 0 && (
              <div className="col-span-4 py-12 text-center text-slate-400">
                No data for this district yet. Try the search above.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Famous places for current tab */}
        {currentDistrict.famous_places && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Famous Places in {foodTab}</div>
            <div className="flex flex-wrap gap-2">
              {currentDistrict.famous_places.map(p => (
                <a
                  key={p}
                  href={`https://www.google.com/maps/search/${encodeURIComponent(p + ' ' + foodTab)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-orange-300 hover:text-orange-600 transition-colors"
                >
                  <MapPin className="h-3 w-3 text-orange-400" />{p}
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 5. VOYAGER AI FEATURES ─────────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto">
        <SectionHeader
          title="Voyager AI Features"
          subtitle="A complete travel toolkit for Tamil Nadu — click any feature to use it instantly."
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {FEATURES.map(f => (
            <FeatureCard key={f.id} feature={f} onOpen={setOpenModal} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="mt-20 px-4 md:px-6 max-w-[1440px] mx-auto mb-12">
        <div className="rounded-3xl overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1400&auto=format&fit=crop&q=80"
            alt="Tamil Nadu"
            className="w-full h-64 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-violet-900/85" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-3xl md:text-4xl font-black text-white">Ready to Explore Tamil Nadu?</h2>
            <p className="mt-2 text-white/80 max-w-lg text-sm">Generate your itinerary in seconds. Book guides, agencies and experiences — all in one place.</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link to="/plan" className="px-8 py-3 rounded-2xl bg-white text-blue-700 font-black hover:shadow-xl transition-all text-sm">Plan My Trip</Link>
              <Link to="/advisor" className="px-8 py-3 rounded-2xl bg-white/10 border border-white/30 text-white font-black hover:bg-white/20 transition-all text-sm backdrop-blur">Ask AI</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── MODALS ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {bookingGuide && <GuideBookingModal guide={bookingGuide} onClose={() => setBookingGuide(null)} />}
        {openModal === 'packing' && <PackingModal onClose={() => setOpenModal(null)} />}
        {openModal === 'language' && <LanguageModal onClose={() => setOpenModal(null)} />}
        {openModal === 'safety' && <SafetyModal onClose={() => setOpenModal(null)} />}
        {openModal === 'expense' && <ExpenseModal onClose={() => setOpenModal(null)} />}
        {openModal === 'journal' && <JournalModal onClose={() => setOpenModal(null)} />}
      </AnimatePresence>

      {/* Food/Item Detail Modal */}
      {selectedItem && (
        <FoodDetailModal
          item={selectedItem}
          district={selectedItemDistrict}
          onClose={() => { setSelectedItem(null); setSelectedItemDistrict('') }}
        />
      )}

      {/* Agency Packages Modal */}
      {selectedAgency && (
        <AgencyPackagesModal
          agency={selectedAgency}
          onClose={() => setSelectedAgency(null)}
        />
      )}
    </div>
  )
}

export default Home

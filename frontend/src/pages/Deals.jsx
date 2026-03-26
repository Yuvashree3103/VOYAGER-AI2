import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plane, Hotel, Ticket, Search, Star, MapPin, Clock, TrendingDown,
  ExternalLink, Tag, Bell, ChevronRight, Zap, Shield, Wifi,
  Coffee, Car, ArrowRight, Users, Filter, SortAsc, CheckCircle,
  Navigation, Heart, Share2, Info, Sparkles, RefreshCw
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const FLIGHTS = [
  { id: 1, airline: 'IndiGo', logo: '🔵', from: 'Chennai (MAA)', to: 'Madurai (IXM)', dep: '06:00', arr: '07:15', duration: '1h 15m', stops: 0, price: 3499, tag: 'Best Value', link: 'https://www.goindigo.in/', date: 'Mar 20' },
  { id: 2, airline: 'Air India', logo: '🔴', from: 'Chennai (MAA)', to: 'Coimbatore (CJB)', dep: '09:30', arr: '10:40', duration: '1h 10m', stops: 0, price: 4199, tag: 'Business Class Avail', link: 'https://www.airindia.in/', date: 'Mar 20' },
  { id: 3, airline: 'SpiceJet', logo: '🟠', from: 'Chennai (MAA)', to: 'Trichy (TRZ)', dep: '07:45', arr: '08:45', duration: '1h 00m', stops: 0, price: 2899, tag: '🔥 Lowest Price', link: 'https://www.spicejet.com/', date: 'Mar 20' },
  { id: 4, airline: 'Vistara', logo: '🟣', from: 'Chennai (MAA)', to: 'Madurai (IXM)', dep: '15:20', arr: '16:35', duration: '1h 15m', stops: 0, price: 5299, tag: 'Premium', link: 'https://www.airvistara.com/', date: 'Mar 21' },
  { id: 5, airline: 'IndiGo', logo: '🔵', from: 'Coimbatore (CJB)', to: 'Chennai (MAA)', dep: '08:00', arr: '09:10', duration: '1h 10m', stops: 0, price: 3299, tag: 'Early Bird', link: 'https://www.goindigo.in/', date: 'Mar 22' },
  { id: 6, airline: 'Air India', logo: '🔴', from: 'Chennai (MAA)', to: 'Tirunelveli (TIR)', dep: '11:00', arr: '12:15', duration: '1h 15m', stops: 0, price: 3799, tag: 'Direct', link: 'https://www.airindia.in/', date: 'Mar 21' },
]

const HOTELS = [
  { id: 1, name: 'The Leela Palace Chennai', city: 'Chennai', stars: 5, rating: 4.8, reviews: 2341, price: 12500, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop', amenities: ['Pool', 'Spa', 'Gym', 'WiFi'], dist: '2.1 km to Marina', tag: 'Luxury Pick', link: 'https://www.booking.com/hotel/in/the-leela-palace-chennai.html' },
  { id: 2, name: 'Vivanta Madurai', city: 'Madurai', stars: 4, rating: 4.5, reviews: 1876, price: 6800, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&auto=format&fit=crop', amenities: ['Pool', 'Restaurant', 'WiFi', 'Bar'], dist: '0.8 km to Meenakshi Temple', tag: 'Temple View', link: 'https://www.booking.com/hotel/in/vivanta-madurai.html' },
  { id: 3, name: 'Nilgiris Nest Resort', city: 'Ooty', stars: 4, rating: 4.6, reviews: 1243, price: 4500, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop', amenities: ['Fireplace', 'Garden', 'Trekking', 'WiFi'], dist: '1.5 km to Botanical Garden', tag: 'Nature Retreat', link: 'https://www.makemytrip.com/hotels/' },
  { id: 4, name: 'Heritage Chettinad Palace', city: 'Karaikudi', stars: 3, rating: 4.7, reviews: 987, price: 3200, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&auto=format&fit=crop', amenities: ['Chettinad Cuisine', 'Heritage Tour', 'WiFi', 'AC'], dist: 'In Chettinad Heritage Zone', tag: '🏆 Guest Favourite', link: 'https://www.booking.com/' },
  { id: 5, name: 'Sterling Kodaikanal', city: 'Kodaikanal', stars: 4, rating: 4.4, reviews: 2156, price: 5600, img: 'https://images.unsplash.com/photo-1617563553682-a025fef4b0e4?w=400&auto=format&fit=crop', amenities: ['Lake View', 'Bonfire', 'Cycling', 'WiFi'], dist: '0.3 km to Kodai Lake', tag: 'Lake View', link: 'https://www.makemytrip.com/hotels/' },
  { id: 6, name: 'GRT Grand Chennai', city: 'Chennai', stars: 4, rating: 4.3, reviews: 3421, price: 4200, img: 'https://images.unsplash.com/photo-1578774204375-826dc8d07e9d?w=400&auto=format&fit=crop', amenities: ['Pool', 'Business Center', 'WiFi', 'Gym'], dist: '0.5 km to T. Nagar', tag: 'City Center', link: 'https://www.booking.com/' },
]

const ACTIVITIES = [
  { id: 1, title: 'Mahabalipuram UNESCO Heritage Walk', city: 'Mahabalipuram', price: 599, rating: 4.7, reviews: 876, duration: '3 hours', img: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=400&auto=format&fit=crop', includes: ['Expert guide', 'Entry tickets', 'Photography tips'], tag: 'UNESCO Site', link: 'https://www.viator.com/' },
  { id: 2, title: 'Chennai Street Food Night Tour', city: 'Chennai', price: 799, rating: 4.8, reviews: 1234, duration: '2.5 hours', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop', includes: ['7 food stops', 'Food tastings', 'Local guide'], tag: '🔥 Bestseller', link: 'https://www.viator.com/' },
  { id: 3, title: 'Ooty Tea Estate Photography Tour', city: 'Ooty', price: 899, rating: 4.6, reviews: 654, duration: '4 hours', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop', includes: ['Tea tasting', 'Factory visit', 'Photography guide'], tag: 'Scenic', link: 'https://www.viator.com/' },
  { id: 4, title: 'Madurai Temple Light & Sound Show', city: 'Madurai', price: 449, rating: 4.9, reviews: 2341, duration: '1.5 hours', img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&auto=format&fit=crop', includes: ['Entry ticket', 'Commentary', 'Evening show'], tag: '✨ Must Do', link: 'https://www.viator.com/' },
  { id: 5, title: 'Kodaikanal Trekking & Cycle Adventure', city: 'Kodaikanal', price: 1299, rating: 4.5, reviews: 432, duration: 'Full day', img: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&auto=format&fit=crop', includes: ['Cycle rental', 'Guide', 'Packed lunch'], tag: 'Adventure', link: 'https://www.viator.com/' },
  { id: 6, title: 'Kanyakumari Sunrise Boat Ride', city: 'Kanyakumari', price: 350, rating: 4.9, reviews: 3210, duration: '2 hours', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop', includes: ['Boat ride', 'Rock Memorial entry', 'Sunrise view'], tag: '🌅 Iconic', link: 'https://www.viator.com/' },
]

const PACKAGES = [
  { id: 1, name: 'Ooty + Kodaikanal Honeymoon Special', days: 4, nights: 3, price: 18999, rating: 4.8, reviews: 456, includes: ['Hotel (3★)', 'Transport', 'Sightseeing', 'Breakfast'], img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop', tag: '❤️ Couple Favourite', agency: 'Cox & Kings', link: 'https://www.coxandkings.com/' },
  { id: 2, name: 'Tamil Nadu Pilgrimage Circuit', days: 7, nights: 6, price: 14999, rating: 4.7, reviews: 789, includes: ['Budget Hotel', 'AC Bus', 'Puja Guide', 'All meals'], img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&auto=format&fit=crop', tag: '🙏 Spiritual Journey', agency: 'TTDC', link: 'https://www.ttdconline.com/' },
  { id: 3, name: 'Chennai + Mahabalipuram Explorer', days: 3, nights: 2, price: 8499, rating: 4.5, reviews: 1123, includes: ['Hotel (4★)', 'Heritage Walk', 'Beach Evening', 'Transfers'], img: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=400&auto=format&fit=crop', tag: 'Weekend Deal', agency: 'MakeMyTrip', link: 'https://www.makemytrip.com/' },
]

const SOCIAL_FEED = [
  'Priya just booked Ooty 3-day trip ✈️',
  'Karthik found ₹2,899 Chennai–Trichy flight 🎉',
  'Meena is exploring Kodaikanal this weekend 🏔️',
  'Rajan booked Heritage Chettinad Palace 🏨',
  'Divya planned Madurai Temple tour 🏛️',
  'Arjun saved ₹1,500 using VoyagerAI deals 💰',
]

// ─── Sub-Components ──────────────────────────────────────────────────────────

const TagBadge = ({ label, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  }
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${colors[color]}`}>{label}</span>
}

const FlightCard = ({ flight }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow p-5 flex flex-col gap-4">
    {/* Airline row */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{flight.logo}</span>
        <div>
          <div className="font-black text-slate-900 dark:text-white text-sm">{flight.airline}</div>
          <div className="text-xs text-slate-400">{flight.date}</div>
        </div>
      </div>
      {flight.tag && <TagBadge label={flight.tag} color={flight.tag.includes('Lowest') ? 'green' : flight.tag.includes('Premium') ? 'violet' : 'blue'} />}
    </div>

    {/* Route */}
    <div className="flex items-center gap-3">
      <div className="text-center flex-1">
        <div className="text-xl font-black text-slate-900 dark:text-white">{flight.dep}</div>
        <div className="text-xs text-slate-500 mt-0.5 font-medium">{flight.from}</div>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="text-xs text-slate-400 font-medium">{flight.duration}</div>
        <div className="w-full flex items-center gap-1">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <Plane className="w-3.5 h-3.5 text-blue-500" />
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="text-xs text-green-600 dark:text-green-400 font-bold">
          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
        </div>
      </div>
      <div className="text-center flex-1">
        <div className="text-xl font-black text-slate-900 dark:text-white">{flight.arr}</div>
        <div className="text-xs text-slate-500 mt-0.5 font-medium">{flight.to}</div>
      </div>
    </div>

    {/* Price + Book */}
    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
      <div>
        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{flight.price.toLocaleString('en-IN')}</div>
        <div className="text-xs text-slate-400">per person</div>
      </div>
      <a href={flight.link} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black text-sm hover:opacity-90 transition-all shadow-md hover:shadow-blue-500/30">
        Book <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  </motion.div>
)

const HotelCard = ({ hotel }) => {
  const [liked, setLiked] = useState(false)
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3"><TagBadge label={hotel.tag} color="orange" /></div>
        <button onClick={() => setLiked(l => !l)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
          <Heart className={`w-4 h-4 ${liked ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} />
        </button>
        <div className="absolute bottom-3 left-3 flex">
          {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
        </div>
      </div>
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <div className="font-black text-slate-900 dark:text-white">{hotel.name}</div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3 h-3 text-orange-400" />{hotel.dist}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hotel.amenities.map(a => (
            <span key={a} className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {a === 'Pool' ? '🏊' : a === 'WiFi' ? <Wifi className="w-3 h-3" /> : a === 'Gym' ? '💪' : a === 'Restaurant' ? <Coffee className="w-3 h-3" /> : '✓'} {a}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-black text-slate-900 dark:text-white text-sm">{hotel.rating}</span>
          <span className="text-xs text-slate-400">({hotel.reviews.toLocaleString('en-IN')} reviews)</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{hotel.price.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-400">per night</div>
          </div>
          <a href={hotel.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm hover:opacity-90 transition-all">
            Book <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

const ActivityCard = ({ activity }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
    <div className="relative h-44 overflow-hidden">
      <img src={activity.img} alt={activity.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        loading="lazy" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=400&auto=format&fit=crop' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute top-3 left-3"><TagBadge label={activity.tag} color="violet" /></div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-white" />
        <span className="text-white text-xs font-bold">{activity.city}</span>
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col gap-3">
      <div className="font-black text-slate-900 dark:text-white text-sm leading-snug">{activity.title}</div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.duration}</span>
        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{activity.rating} ({activity.reviews})</span>
      </div>
      <div className="space-y-1">
        {activity.includes.map(inc => (
          <div key={inc} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />{inc}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div>
          <div className="text-xl font-black text-violet-600 dark:text-violet-400">₹{activity.price}</div>
          <div className="text-xs text-slate-400">per person</div>
        </div>
        <a href={activity.link} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black text-sm hover:opacity-90 transition-all">
          Book <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </motion.div>
)

const PackageCard = ({ pkg }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
    <div className="relative h-44 overflow-hidden">
      <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute top-3 left-3"><TagBadge label={pkg.tag} color="orange" /></div>
      <div className="absolute bottom-3 left-3">
        <span className="text-white text-xs font-bold bg-black/40 backdrop-blur rounded-full px-2 py-0.5">{pkg.days}D / {pkg.nights}N</span>
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col gap-3">
      <div className="font-black text-slate-900 dark:text-white text-sm leading-snug">{pkg.name}</div>
      <div className="text-xs text-slate-500">By {pkg.agency}</div>
      <div className="flex flex-wrap gap-1">
        {pkg.includes.map(inc => (
          <span key={inc} className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <CheckCircle className="w-2.5 h-2.5 text-green-500" />{inc}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="font-black text-slate-900 dark:text-white text-sm">{pkg.rating}</span>
        <span className="text-xs text-slate-400">({pkg.reviews} reviews)</span>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">₹{pkg.price.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400">per person</div>
        </div>
        <a href={pkg.link} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm hover:opacity-90 transition-all">
          View <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </motion.div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'flights', label: 'Flights', icon: Plane, color: 'blue' },
  { id: 'hotels', label: 'Hotels', icon: Hotel, color: 'emerald' },
  { id: 'activities', label: 'Activities', icon: Ticket, color: 'violet' },
  { id: 'packages', label: 'Packages', icon: Tag, color: 'amber' },
]

export default function Deals() {
  const [tab, setTab] = useState('flights')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const [feedIndex, setFeedIndex] = useState(0)
  const [dealAlertSet, setDealAlertSet] = useState(false)

  // Rotating social proof feed
  useEffect(() => {
    const t = setInterval(() => setFeedIndex(i => (i + 1) % SOCIAL_FEED.length), 3000)
    return () => clearInterval(t)
  }, [])

  const currentData = tab === 'flights' ? FLIGHTS : tab === 'hotels' ? HOTELS : tab === 'activities' ? ACTIVITIES : PACKAGES

  const filtered = currentData.filter(item => {
    const q = search.toLowerCase()
    return q === '' || JSON.stringify(item).toLowerCase().includes(q)
  }).sort((a, b) => {
    if (sortBy === 'price') return (a.price || a.price_per_night || 0) - (b.price || b.price_per_night || 0)
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
                <Zap className="w-3.5 h-3.5" /> Live Travel Deals
              </div>
              <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
                Best Deals for Tamil Nadu
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Flights, hotels, activities & tour packages — compare and book directly</p>
            </div>

            {/* Social Proof Feed */}
            <div className="md:ml-auto shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm min-w-[280px]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.p key={feedIndex}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {SOCIAL_FEED[feedIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Flights Listed', value: '50+', icon: '✈️' },
              { label: 'Hotels Available', value: '200+', icon: '🏨' },
              { label: 'Activities', value: '100+', icon: '🎟️' },
              { label: 'Avg. Savings', value: '₹2,800', icon: '💰' },
            ].map(stat => (
              <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Deal Alert Banner ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <Bell className="w-5 h-5" />
            <p className="font-bold text-sm">Get notified when prices drop below your budget! Set a deal alert.</p>
          </div>
          <button onClick={() => setDealAlertSet(d => !d)}
            className={`shrink-0 px-5 py-2 rounded-xl font-black text-sm transition-all ${dealAlertSet ? 'bg-green-500 text-white' : 'bg-white text-blue-700 hover:bg-blue-50'}`}>
            {dealAlertSet ? <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Alert Set!</span> : 'Set Deal Alert'}
          </button>
        </motion.div>

        {/* ── Tabs + Search + Sort ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {TABS.map(t => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-black transition-all border ${active
                    ? `bg-${t.color}-600 border-${t.color}-600 text-white shadow-lg`
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}
                  style={active ? { background: t.id === 'flights' ? '#2563eb' : t.id === 'hotels' ? '#059669' : t.id === 'activities' ? '#7c3aed' : '#d97706', borderColor: 'transparent' } : {}}>
                  <Icon className="w-4 h-4" />{t.label}
                </button>
              )
            })}
          </div>

          <div className="md:ml-auto flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${tab}…`}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800" />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-200">
              <option value="price">Sort: Price ↑</option>
              <option value="rating">Sort: Rating ↑</option>
            </select>
          </div>
        </div>

        {/* ── Results Count ── */}
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-black text-slate-900 dark:text-white">{filtered.length}</span> {tab} {search && `for "${search}"`}
        </div>

        {/* ── Cards Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`grid gap-5 ${tab === 'flights' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
            {filtered.map(item =>
              tab === 'flights' ? <FlightCard key={item.id} flight={item} /> :
                tab === 'hotels' ? <HotelCard key={item.id} hotel={item} /> :
                  tab === 'activities' ? <ActivityCard key={item.id} activity={item} /> :
                    <PackageCard key={item.id} pkg={item} />
            )}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-bold">No results for "{search}". Try a different search.</p>
          </div>
        )}

        {/* ── Best Time to Book AI Tip ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-slate-900 dark:text-white mb-1">💡 VoyagerAI Deal Tip</div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>Best time to book Tamil Nadu flights:</strong> Book 3–6 weeks in advance for lowest fares.
              Avoid booking during <strong>Pongal (Jan 13–16)</strong> and <strong>Karthigai Deepam (Nov–Dec)</strong> — fares spike 40–60%.
              Tuesday/Wednesday bookings are typically 15–20% cheaper than weekend bookings.
            </p>
          </div>
        </motion.div>

        {/* ── External Booking Platforms ── */}
        <div className="mt-8">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Also book directly on</div>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'MakeMyTrip', url: 'https://www.makemytrip.com/', emoji: '✈️' },
              { name: 'Goibibo', url: 'https://www.goibibo.com/', emoji: '🏨' },
              { name: 'IRCTC', url: 'https://www.irctc.co.in/', emoji: '🚆' },
              { name: 'TTDC', url: 'https://www.ttdconline.com/', emoji: '🏛️' },
              { name: 'Skyscanner', url: 'https://www.skyscanner.co.in/', emoji: '🔍' },
              { name: 'Viator', url: 'https://www.viator.com/India/', emoji: '🎟️' },
            ].map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm">
                {p.emoji} {p.name} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

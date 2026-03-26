import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Star, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FESTIVALS = [
    { id: 1, name: 'Pongal', month: 0, day: 14, duration: 4, type: 'Harvest', district: 'All Tamil Nadu', emoji: '🌾', desc: 'The most important Tamil harvest festival. Kolam art, sugarcane, and the iconic boiling of pongal dish.', travelImpact: 'HIGH', impactDesc: 'Most businesses closed Jan 14–17. Heavy return traffic to Chennai after Jan 17.', photo: 'https://images.unsplash.com/photo-1599030028000-0b0b0b0b0b0b?w=400', tip: 'Visit Madurai or Thanjavur for the grandest celebrations. Markets reopen Jan 17.', crowd: 5 },
    { id: 2, name: 'Thaipusam', month: 0, day: 25, duration: 2, type: 'Temple', district: 'Palani (Dindigul)', emoji: '🎺', desc: 'Devotees carry kavadi (peacock-feather arches) to Murugan temples. Painful devotional practice.', travelImpact: 'HIGH', impactDesc: 'Roads to Palani blocked. Hundreds of thousands of pilgrims.', photo: '', tip: 'Watch the kavadi procession at Palani or Tiruchendur. Start at 4AM for best views.', crowd: 5 },
    { id: 3, name: 'Maha Shivaratri', month: 1, day: 18, duration: 1, type: 'Temple', district: 'All Tamil Nadu', emoji: '🔱', desc: 'Night-long vigil and prayers at Shiva temples. Special abhishekam rituals.', travelImpact: 'MEDIUM', impactDesc: 'Major Shiva temples (Chidambaram, Trichy, Madurai) very crowded.', tip: 'Visit Chidambaram Nataraja Temple for spectacular celebrations.', crowd: 3 },
    { id: 4, name: 'Chithirai Festival', month: 3, day: 14, duration: 10, type: 'Temple', district: 'Madurai', emoji: '👑', desc: 'The celestial wedding of Meenakshi Amman — Madurai\'s grandest annual festival with chariot procession.', travelImpact: 'HIGH', impactDesc: 'Madurai city very crowded. Hotels book out 3 months ahead. Roads blocked for procession.', tip: 'Book hotels 4+ months ahead. Watch the golden chariot on Day 3. Best views from Masi Street.', crowd: 5 },
    { id: 5, name: 'Aadi Perukku', month: 6, day: 3, duration: 1, type: 'Nature', district: 'River towns', emoji: '🌊', desc: 'River-worship festival. Families picnic on river banks, float flower lamps.', travelImpact: 'LOW', impactDesc: 'River banks crowded for a few hours. Pleasant festive atmosphere.', tip: 'Visit Hogenakkal, Courtallam, or Kaveri banks for beautiful celebrations.', crowd: 2 },
    { id: 6, name: 'Karthigai Deepam', month: 10, day: 22, duration: 2, type: 'Lights', district: 'Tiruvannamalai', emoji: '🪔', desc: 'Festival of lights — deepam lamps lit on Arunachala Hill. The sacred flame atop the hill visible for miles.', travelImpact: 'HIGH', impactDesc: 'Tiruvannamalai flooded with 1M+ devotees. All accommodation gone weeks ahead.', tip: 'Book Tiruvannamalai stays 2 months ahead. Arrive Nov 20 for best experience.', crowd: 5 },
    { id: 7, name: 'Navratri / Golu', month: 9, day: 3, duration: 9, type: 'Cultural', district: 'All Tamil Nadu', emoji: '🏺', desc: 'Households display clay doll arrangements (golu). Women visit each other, exchange sundal and gifts.', travelImpact: 'LOW', impactDesc: 'Cultural experience, most businesses open. Lovely to visit local homes if invited.', tip: 'Visit Mylapore (Chennai) for the most elaborate golu displays and cultural events.', crowd: 1 },
    { id: 8, name: 'Diwali', month: 9, day: 28, duration: 1, type: 'Lights', district: 'All Tamil Nadu', emoji: '✨', desc: 'Festival of lights with sweets, new clothes, and fireworks. Unique Tamil Diwali tradition.', travelImpact: 'MEDIUM', impactDesc: 'All shops closed on Diwali day. Train tickets sell out weeks ahead. Burst of tourism.', tip: 'Experience Diwali in Chennai\'s T. Nagar for the most vibrant celebrations and shopping.', crowd: 4 },
    { id: 9, name: 'Makar Villaku', month: 0, day: 14, duration: 1, type: 'Temple', district: 'Sabarimala/Palani', emoji: '⭐', desc: 'Celestial star visible once a year — pilgrims trek to Sabarimala and Palani on this night.', travelImpact: 'HIGH', impactDesc: 'Highways to Palani extremely crowded. All dharamshalas full.', tip: 'Book early. Observe the jyothi (celestial lamp) from Palani hilltop.', crowd: 4 },
    { id: 10, name: 'Adiperukku', month: 7, day: 18, duration: 1, type: 'Nature', district: 'Kumbakonam', emoji: '🌸', desc: 'Women worship river Kaveri, floating flowers and lamps. Traditional boat races in some areas.', travelImpact: 'LOW', impactDesc: 'Kumbakonam area pleasant. Local holiday.', tip: 'Visit Kumbakonam\'s Mahamaham tank and Kaveri banks for authentic experience.', crowd: 2 },
    { id: 11, name: 'Thyagaraja Aradhana', month: 0, day: 15, duration: 5, type: 'Cultural', district: 'Thiruvaiyaru (Thanjavur)', emoji: '🎶', desc: 'Largest Classical Music fest — thousands of musicians gather to pay tribute to Saint Thyagaraja.', travelImpact: 'MEDIUM', impactDesc: 'Thanjavur area has surge of classical music enthusiasts.', tip: 'Attend the panchacharanam kirtan session — free, open to all.', crowd: 3 },
    { id: 12, name: 'Jallikattu — Alanganallur', month: 0, day: 15, duration: 1, type: 'Sport', district: 'Madurai / Pudukkottai', emoji: '🐂', desc: 'Ancient bull-taming sport — part of Mattu Pongal celebrations. Largest event at Alanganallur.', travelImpact: 'HIGH', impactDesc: 'Alanganallur village flooded with 50,000+ spectators. Roads jammed from 4AM.', tip: 'Arrive by 6AM for good viewing spots. Wear light clothes and bring water.', crowd: 5 },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const IMPACT_COLORS = { HIGH: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', MEDIUM: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', LOW: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' }

const now = new Date(2026, 2, 15) // March 15 2026 (current date)

const FestivalCalendar = () => {
    const navigate = useNavigate()
    const [selectedMonth, setSelectedMonth] = useState('All')
    const [selectedType, setSelectedType] = useState('All')
    const [expanded, setExpanded] = useState(null)

    // Find next upcoming festival
    const nextFestival = useMemo(() => {
        const upcoming = FESTIVALS.map(f => {
            const date = new Date(2026, f.month, f.day)
            if (date < now) date.setFullYear(2027)
            return { ...f, date, diff: date - now }
        }).sort((a, b) => a.diff - b.diff)
        return upcoming[0]
    }, [])

    const countdown = useMemo(() => {
        const days = Math.floor(nextFestival.diff / (1000 * 60 * 60 * 24))
        return days
    }, [nextFestival])

    const filtered = useMemo(() => FESTIVALS.filter(f => {
        const mMonth = selectedMonth === 'All' || MONTHS[f.month] === selectedMonth
        const mType = selectedType === 'All' || f.type === selectedType
        return mMonth && mType
    }).sort((a, b) => a.month * 31 + a.day - (b.month * 31 + b.day)), [selectedMonth, selectedType])

    const types = ['All', ...Array.from(new Set(FESTIVALS.map(f => f.type)))]

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] px-4 md:px-6 pb-10 pt-24">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                        <Calendar className="w-4 h-4" /> Tamil Nadu Festival Calendar 2026
                    </div>
                    <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">Festivals of Tamil Nadu 🪔</h1>
                    <p className="text-slate-500 dark:text-slate-400">Plan your trip around these magical cultural experiences</p>
                </motion.div>

                {/* Countdown Card */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="mb-8 rounded-3xl p-6 text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1e4db7 0%, #7c3aed 50%, #0d9488 100%)' }}>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-1">Next Festival</div>
                            <div className="text-3xl font-display font-bold mb-1">{nextFestival.emoji} {nextFestival.name}</div>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {nextFestival.district}</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {nextFestival.duration} day{nextFestival.duration > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <div className="text-center shrink-0">
                            <div className="text-6xl font-black">{countdown}</div>
                            <div className="text-white/70 text-sm font-semibold">days away</div>
                        </div>
                        <button
                            onClick={() => navigate('/plan')}
                            className="whitespace-nowrap px-5 py-3 bg-white text-blue-700 rounded-2xl font-bold shadow-lg hover:shadow-xl transition"
                        >
                            Plan This Trip →
                        </button>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                        className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold outline-none">
                        <option value="All">All Months</option>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {types.map(t => (
                        <button key={t} onClick={() => setSelectedType(t)}
                            className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition ${selectedType === t ? 'bg-amber-500 text-white border-amber-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'}`}>
                            {t}
                        </button>
                    ))}
                </div>

                {/* Festival Cards */}
                <div className="space-y-4">
                    {filtered.map((festival, i) => (
                        <motion.div key={festival.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <button className="w-full text-left p-5" onClick={() => setExpanded(expanded === festival.id ? null : festival.id)}>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl shrink-0 w-14 h-14 flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                                        {festival.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">{festival.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${IMPACT_COLORS[festival.travelImpact]}`}>
                                                {festival.travelImpact} impact
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {MONTHS[festival.month]} {festival.day}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {festival.district}</span>
                                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />
                                                {'●'.repeat(festival.crowd)}{'○'.repeat(5 - festival.crowd)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-slate-400 dark:text-slate-600 text-xl font-light">{expanded === festival.id ? '−' : '+'}</div>
                                </div>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{festival.desc}</p>
                            </button>

                            {expanded === festival.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
                                            <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2">Travel Impact</div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{festival.impactDesc}</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <Star className="w-3.5 h-3.5 text-blue-500" />
                                                <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Pro Tip</div>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{festival.tip}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/plan')}
                                        className="mt-4 w-full py-2.5 rounded-2xl font-bold text-sm text-white transition"
                                        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
                                        Plan Trip Around {festival.name} →
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FestivalCalendar

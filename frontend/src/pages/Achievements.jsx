import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, CheckCircle, Lock, Share2, Star, Trophy } from 'lucide-react'

const ALL_DISTRICTS = [
    'Chennai', 'Chengalpattu', 'Kanchipuram', 'Thiruvallur', 'Ranipet', 'Vellore',
    'Tirupathur', 'Tiruvannamalai', 'Coimbatore', 'Tiruppur', 'Erode', 'Nilgiris',
    'Salem', 'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Tiruchirappalli', 'Karur',
    'Ariyalur', 'Perambalur', 'Thanjavur', 'Nagapattinam', 'Mayiladuthurai',
    'Tiruvarur', 'Pudukkottai', 'Sivagangai', 'Madurai', 'Dindigul', 'Theni',
    'Virudhunagar', 'Ramanathapuram', 'Thoothukudi', 'Tirunelveli', 'Tenkasi',
    'Kanyakumari', 'Cuddalore', 'Villupuram', 'Kallakurichi',
]

const BADGES = [
    { id: 'coastal', name: 'Coastal Explorer', emoji: '🏖️', desc: 'Visited 3+ coastal districts', color: '#3b82f6', req: d => ['Chennai', 'Nagapattinam', 'Ramanathapuram', 'Thoothukudi', 'Kanyakumari', 'Cuddalore'].filter(x => d.includes(x)).length >= 3 },
    { id: 'hills', name: 'Hill Climber', emoji: '⛰️', desc: 'Visited 3+ hill districts', color: '#10b981', req: d => ['Nilgiris', 'Dindigul', 'Theni', 'Vellore', 'Krishnagiri', 'Dharmapuri'].filter(x => d.includes(x)).length >= 3 },
    { id: 'temples', name: 'Temple Hopper', emoji: '🏛️', desc: 'Visited 5+ temple-rich districts', color: '#f59e0b', req: d => ['Thanjavur', 'Madurai', 'Tiruchirappalli', 'Kanchipuram', 'Vellore', 'Tiruvannamalai', 'Ramanathapuram'].filter(x => d.includes(x)).length >= 5 },
    { id: 'south', name: 'Southern Wanderer', emoji: '🧭', desc: 'Visited 4+ southern tip districts', color: '#8b5cf6', req: d => ['Kanyakumari', 'Tirunelveli', 'Tenkasi', 'Thoothukudi', 'Virudhunagar'].filter(x => d.includes(x)).length >= 4 },
    { id: 'foodie', name: 'Food Explorer', emoji: '🍛', desc: 'Visited 5+ food-famous districts', color: '#f43f5e', req: d => ['Madurai', 'Thanjavur', 'Tirunelveli', 'Coimbatore', 'Chennai', 'Salem', 'Dindigul'].filter(x => d.includes(x)).length >= 5 },
    { id: 'heritage', name: 'Heritage Seeker', emoji: '🏰', desc: 'Visited 4+ UNESCO/heritage districts', color: '#0d9488', req: d => ['Thanjavur', 'Chengalpattu', 'Kanchipuram', 'Tiruchirappalli', 'Vellore'].filter(x => d.includes(x)).length >= 4 },
    { id: 'half', name: 'Half Explorer', emoji: '🌟', desc: 'Visited 20 of 39 districts', color: '#6366f1', req: d => d.length >= 20 },
    { id: 'all', name: 'Thalaiva Explorer', emoji: '👑', desc: 'LEGEND — All 39 districts!', color: '#f59e0b', req: d => d.length >= 39, special: true },
]

const STORAGE_KEY = 'voyagerai_visited_districts'
const loadVisited = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const saveVisited = (v) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) } catch { } }

const Achievements = () => {
    const [visited, setVisited] = useState(loadVisited)
    const [unlocked, setUnlocked] = useState(null)
    const [shareMsg, setShareMsg] = useState('')

    useEffect(() => { saveVisited(visited) }, [visited])

    const toggle = (d) => {
        setVisited(prev => {
            const next = prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
            // Check for new badge
            const was = BADGES.filter(b => b.req(prev))
            const now = BADGES.filter(b => b.req(next))
            const newBadge = now.find(b => !was.find(w => w.id === b.id))
            if (newBadge && !prev.includes(d)) setUnlocked(newBadge)
            return next
        })
    }

    const earnedBadges = useMemo(() => BADGES.filter(b => b.req(visited)), [visited])
    const progress = (visited.length / ALL_DISTRICTS.length) * 100

    const share = () => {
        const text = `I've explored ${visited.length}/39 Tamil Nadu districts on VoyagerAI! 🗺️\nBadges: ${earnedBadges.map(b => b.emoji + b.name).join(', ') || 'None yet'}\n#VoyagerAI #TamilNaduTravel`
        navigator.clipboard.writeText(text)
        setShareMsg('Copied to clipboard! 📋')
        setTimeout(() => setShareMsg(''), 2500)
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] px-4 md:px-6 pb-10 pt-24">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                        <Trophy className="w-4 h-4" /> Tamil Nadu District Explorer
                    </div>
                    <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">Your Achievements 🏆</h1>
                    <p className="text-slate-500 dark:text-slate-400">Mark districts you've explored. Earn badges as you travel!</p>
                </motion.div>

                {/* Progress Card */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="mb-8 rounded-3xl p-6 text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1e4db7 0%, #7c3aed 60%, #0d9488 100%)' }}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
                    <div className="relative flex items-center gap-6 flex-wrap">
                        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-black">
                            {visited.length}
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <div className="text-white/70 text-sm font-semibold mb-1">Districts Explored</div>
                            <div className="text-2xl font-display font-bold mb-3">{visited.length} of 39 Tamil Nadu Districts</div>
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.3 }}
                                    className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #f59e0b, #f43f5e)' }} />
                            </div>
                            <div className="text-white/70 text-xs mt-1">{Math.round(progress)}% complete</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black">{earnedBadges.length}</div>
                            <div className="text-white/70 text-sm">Badges Earned</div>
                        </div>
                    </div>
                    <div className="relative mt-4 flex gap-3">
                        <button onClick={share} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition">
                            <Share2 className="w-4 h-4" /> {shareMsg || 'Share Progress'}
                        </button>
                        <button onClick={() => setVisited([])} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition text-white/70">
                            Reset All
                        </button>
                    </div>
                </motion.div>

                {/* Badges */}
                <div className="mb-8">
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" /> Badges
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {BADGES.map(badge => {
                            const earned = badge.req(visited)
                            return (
                                <motion.div key={badge.id} whileHover={{ scale: earned ? 1.04 : 1 }}
                                    className={`relative rounded-2xl p-4 text-center border transition ${earned
                                            ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-600 shadow-md'
                                            : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                                        } ${badge.special && earned ? 'badge-glow' : ''}`}>
                                    {!earned && <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 rounded-2xl flex items-center justify-center"><Lock className="w-5 h-5 text-slate-400" /></div>}
                                    <div className={`text-3xl mb-2 ${earned ? '' : 'grayscale opacity-40'}`}>{badge.emoji}</div>
                                    <div className={`text-xs font-bold leading-tight mb-1 ${earned ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{badge.name}</div>
                                    <div className={`text-[10px] ${earned ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>{badge.desc}</div>
                                    {earned && <div className="mt-2"><span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400"><Star className="w-3 h-3" /> Earned!</span></div>}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* District Grid */}
                <div>
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500" /> District Tracker
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Click to mark districts you've visited</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {ALL_DISTRICTS.map((d, i) => {
                            const isVisited = visited.includes(d)
                            return (
                                <motion.button key={d} onClick={() => toggle(d)}
                                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                                    className={`py-2.5 px-3 rounded-2xl text-sm font-semibold border transition text-left relative overflow-hidden ${isVisited
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                                        }`}>
                                    {isVisited && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-2">
                                            <CheckCircle className="w-3.5 h-3.5 text-white/80" />
                                        </motion.div>
                                    )}
                                    <span className="block truncate pr-5">{d}</span>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>

                {/* Unlocked badge modal */}
                <AnimatePresence>
                    {unlocked && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setUnlocked(null)}>
                            <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center max-w-xs shadow-2xl" onClick={e => e.stopPropagation()}>
                                <div className="text-7xl mb-4 badge-glow inline-block">{unlocked.emoji}</div>
                                <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Badge Unlocked! 🎉</div>
                                <div className="text-lg font-bold mb-1" style={{ color: unlocked.color }}>{unlocked.name}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">{unlocked.desc}</div>
                                <button onClick={() => setUnlocked(null)} className="w-full py-3 rounded-2xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${unlocked.color}, #7c3aed)` }}>
                                    Awesome! 🚀
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Achievements

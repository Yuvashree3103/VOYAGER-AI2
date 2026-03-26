import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Moon, Sun, X, User, LogOut, BookOpen, ChevronDown } from 'lucide-react'
import { useTheme } from '../services/theme'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
    { label: 'Home', path: '/', emoji: '🏠' },
    { label: 'Plan Trip', path: '/plan', emoji: '🗺️' },
    { label: 'Festivals', path: '/festivals', emoji: '🪔' },
    { label: 'Deals', path: '/deals', emoji: '🎫' },
    { label: 'Journal', path: '/journal', emoji: '📔' },
    { label: 'Emergency', path: '/emergency', emoji: '🚨' },
    { label: 'Translator', path: '/translator', emoji: '🌐' },
    { label: 'AI Advisor', path: '/advisor', emoji: '🤖' },
]

// ── SVG Compass Logo ────────────────────────────────────────────────────────
const VoyagerLogo = () => (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
        </defs>
        <circle cx="19" cy="19" r="17.5" stroke="url(#lg)" strokeWidth="2.5" fill="none" />
        <circle cx="19" cy="19" r="14" fill="url(#lg)" opacity="0.12" />
        <polygon points="19,5 21,17 19,19 17,17" fill="url(#lg)" />
        <polygon points="33,19 21,21 19,19 21,17" fill="url(#lg)" opacity="0.5" />
        <polygon points="19,33 17,21 19,19 21,21" fill="url(#lg)" opacity="0.7" />
        <polygon points="5,19 17,17 19,19 17,21" fill="url(#lg)" opacity="0.4" />
        <circle cx="19" cy="19" r="3" fill="url(#lg)" />
    </svg>
)

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme()
    return (
        <button onClick={toggleTheme}
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            aria-label="Toggle theme">
            <AnimatePresence mode="wait">
                {isDark
                    ? <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><Sun className="w-4 h-4" /></motion.div>
                    : <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Moon className="w-4 h-4" /></motion.div>
                }
            </AnimatePresence>
        </button>
    )
}

// ── Login Modal ──────────────────────────────────────────────────────────────
const LoginModal = ({ onClose }) => {
    const { login } = useAuth()
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={onClose}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-80 text-center shadow-2xl border border-slate-200 dark:border-slate-700"
                onClick={e => e.stopPropagation()}>
                <div className="text-5xl mb-3">✈️</div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Welcome to VoyagerAI</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Sign in to save trips, journals & more</p>

                <button onClick={() => login('google')}
                    className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-3 mb-3 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 transition-all">
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                    Continue with Google
                </button>

                <button onClick={() => login('guest')}
                    className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all">
                    Continue as Guest
                </button>

                <button onClick={onClose} className="mt-4 text-slate-400 text-sm hover:text-slate-600 transition-colors">Cancel</button>
            </motion.div>
        </motion.div>
    )
}

// ── Profile Dropdown ─────────────────────────────────────────────────────────
const ProfileDropdown = ({ user, onClose }) => {
    const { logout } = useAuth()
    const navigate = useNavigate()
    return (
        <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-52 py-2 z-50">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="font-black text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <button onClick={() => { navigate('/profile'); onClose() }}
                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors">
                <User className="w-4 h-4 text-blue-500" /> My Profile
            </button>
            <button onClick={() => { navigate('/journal'); onClose() }}
                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors">
                <BookOpen className="w-4 h-4 text-emerald-500" /> My Journals
            </button>
            <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button onClick={() => { logout(); onClose() }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </motion.div>
    )
}

const Navbar = () => {
    const { isDark } = useTheme()
    const { user, isLoggedIn, showLoginModal, setShowLoginModal } = useAuth()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const profileRef = useRef(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close mobile menu and profile on route change
    useEffect(() => { setMobileOpen(false); setProfileOpen(false) }, [location.pathname])

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-3'}`}
                style={{
                    background: scrolled
                        ? (isDark ? 'rgba(10,15,30,0.95)' : 'rgba(255,255,255,0.95)')
                        : (isDark ? 'rgba(10,15,30,0.7)' : 'rgba(255,255,255,0.7)'),
                    backdropFilter: 'blur(20px)',
                    borderBottom: scrolled ? `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` : 'none',
                }}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <VoyagerLogo />
                        <div>
                            <span className="font-display text-lg font-black text-slate-900 dark:text-white tracking-tight">VoyagerAI</span>
                            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.15em] uppercase leading-none">SMART TRAVEL</div>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
                        {NAV_ITEMS.map(item => {
                            const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                            return (
                                <Link key={item.path} to={item.path}
                                    className={`relative px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${active
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}>
                                    {item.label}
                                    {active && (
                                        <motion.div layoutId="nav-indicator"
                                            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400"
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {/* Profile / Sign In */}
                        {isLoggedIn && user ? (
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setProfileOpen(o => !o)}
                                    className="flex items-center gap-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 p-1 transition-all">
                                    <img src={user.avatar} alt={user.name}
                                        className="w-9 h-9 rounded-full ring-2 ring-blue-200 dark:ring-blue-800 hover:ring-blue-400 transition-all object-cover" />
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {profileOpen && <ProfileDropdown user={user} onClose={() => setProfileOpen(false)} />}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button onClick={() => setShowLoginModal(true)}
                                className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-blue-500/25">
                                Sign In
                            </button>
                        )}

                        <button className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
                            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[62px] left-0 right-0 z-40 shadow-xl border-b border-slate-200 dark:border-slate-800"
                        style={{ background: isDark ? 'rgba(10,15,30,0.98)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}>
                        <div className="max-h-[80vh] overflow-y-auto py-3 px-4 grid grid-cols-2 gap-1.5">
                            {NAV_ITEMS.map(item => {
                                const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                                return (
                                    <Link key={item.path} to={item.path}
                                        className={`flex items-center gap-2.5 px-3 py-3 rounded-2xl text-sm font-semibold transition ${active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}>
                                        <span className="text-lg">{item.emoji}</span>
                                        {item.label}
                                    </Link>
                                )
                            })}
                            {/* Sign in / profile in mobile */}
                            {isLoggedIn ? (
                                <Link to="/profile" className="col-span-2 flex items-center gap-2.5 px-3 py-3 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <img src={user?.avatar} className="w-6 h-6 rounded-full" alt="" /> My Profile
                                </Link>
                            ) : (
                                <button onClick={() => { setMobileOpen(false); setShowLoginModal(true) }}
                                    className="col-span-2 bg-blue-600 text-white rounded-2xl py-3 text-sm font-bold">
                                    Sign In
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login Modal */}
            <AnimatePresence>
                {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
            </AnimatePresence>
        </>
    )
}

export default Navbar

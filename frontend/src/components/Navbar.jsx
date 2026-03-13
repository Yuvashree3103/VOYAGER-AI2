import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, LayoutDashboard, Languages, Map, Menu, Shield, Sparkles, Tag, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

// Sticky glassmorphism navbar for all pages
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/plan', label: 'Plan Trip', icon: Map },
        { path: '/deals', label: 'Deals', icon: Tag },
        { path: '/journal', label: 'Journal', icon: BookOpen },
        { path: '/emergency', label: 'Emergency', icon: Shield },
        { path: '/translator', label: 'Translator', icon: Languages },
        { path: '/advisor', label: 'AI Advisor', icon: Sparkles },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm py-3 border-b border-slate-200/60 dark:border-slate-800/60' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 70%)' }}>
                        ✈️
                    </div>
                    <div>
                        <span className="block text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">VoyagerAI</span>
                        <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-300 tracking-[0.22em] uppercase">Smart Travel</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-1 bg-white/60 dark:bg-slate-900/40 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur">
                    {menuItems.map((item) => {
                        const active = isActive(item.path)
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${active ? 'bg-white dark:bg-slate-950/60 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-950/40'}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    
                    <button 
                        className="lg:hidden p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200"
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white/85 dark:bg-slate-950/70 backdrop-blur border-t border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
                        <div className="p-5 flex flex-col gap-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl text-base font-black transition-all ${isActive(item.path) ? 'bg-slate-900 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-900/40'}`}
                                >
                                    <item.icon className="w-6 h-6" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar

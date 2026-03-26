import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale, BarElement
} from 'chart.js'
import {
    PlusCircle, Trash2, Download, Users, Wallet, TrendingUp,
    TrendingDown, Coffee, Car, Hotel, Ticket, ShoppingBag, Utensils,
    AlertTriangle, CheckCircle, Sparkles, RefreshCw, X, Edit3
} from 'lucide-react'
import { sendMessage } from '../services/claude'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'food', label: 'Food & Dining', icon: Utensils, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-700' },
    { id: 'transport', label: 'Transport', icon: Car, color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700' },
    { id: 'stay', label: 'Accommodation', icon: Hotel, color: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-700' },
    { id: 'activities', label: 'Activities', icon: Ticket, color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-700' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#f43f5e', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-700' },
    { id: 'misc', label: 'Miscellaneous', icon: Coffee, color: '#6b7280', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' },
]

// ─── Storage ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'voyager_budget_tracker'
const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch { return null } }
const save = (data) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { } }

// ─── Component ────────────────────────────────────────────────────────────────
export default function BudgetTracker() {
    const saved = load()
    const [budget, setBudget] = useState(saved?.budget || 10000)
    const [budgetInput, setBudgetInput] = useState(saved?.budget?.toString() || '10000')
    const [trip, setTrip] = useState(saved?.trip || 'Tamil Nadu Trip')
    const [expenses, setExpenses] = useState(saved?.expenses || [])
    const [travelers, setTravelers] = useState(saved?.travelers || [{ name: 'Me', paid: 0 }])
    const [newExp, setNewExp] = useState({ desc: '', amount: '', category: 'food', paidBy: 'Me' })
    const [tab, setTab] = useState('overview')
    const [aiTip, setAiTip] = useState('')
    const [loadingTip, setLoadingTip] = useState(false)
    const [editingBudget, setEditingBudget] = useState(false)
    const [newTravelerName, setNewTravelerName] = useState('')

    // Persist
    useEffect(() => { save({ budget, trip, expenses, travelers }) }, [budget, trip, expenses, travelers])

    const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses])
    const remaining = budget - totalSpent
    const pct = Math.min((totalSpent / budget) * 100, 100)

    const byCategory = useMemo(() => {
        const map = {}
        CATEGORIES.forEach(c => { map[c.id] = 0 })
        expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount })
        return map
    }, [expenses])

    // Chart data
    const donutData = {
        labels: CATEGORIES.map(c => c.label),
        datasets: [{
            data: CATEGORIES.map(c => byCategory[c.id] || 0),
            backgroundColor: CATEGORIES.map(c => c.color),
            borderWidth: 0,
            hoverOffset: 6,
        }]
    }

    const barData = {
        labels: CATEGORIES.map(c => c.label.split(' ')[0]),
        datasets: [{
            label: 'Spent (₹)',
            data: CATEGORIES.map(c => byCategory[c.id] || 0),
            backgroundColor: CATEGORIES.map(c => c.color + 'cc'),
            borderRadius: 8,
        }]
    }

    // Traveler splits
    const perPerson = travelers.length > 0 ? Math.floor(totalSpent / travelers.length) : 0
    const travelerSpent = useMemo(() => {
        const map = {}
        travelers.forEach(t => { map[t.name] = 0 })
        expenses.forEach(e => {
            if (map[e.paidBy] !== undefined) map[e.paidBy] = (map[e.paidBy] || 0) + e.amount
        })
        return map
    }, [expenses, travelers])

    const addExpense = () => {
        const amount = parseFloat(newExp.amount)
        if (!newExp.desc.trim() || isNaN(amount) || amount <= 0) {
            toast.error('Please fill in description and valid amount')
            return
        }
        setExpenses(prev => [...prev, {
            id: Date.now(),
            desc: newExp.desc,
            amount,
            category: newExp.category,
            paidBy: newExp.paidBy,
            date: new Date().toLocaleDateString('en-IN'),
        }])
        setNewExp(prev => ({ ...prev, desc: '', amount: '' }))
        toast.success('Expense added!')
    }

    const removeExpense = (id) => {
        setExpenses(prev => prev.filter(e => e.id !== id))
        toast('Expense removed', { icon: '🗑️' })
    }

    const getAiTip = async () => {
        setLoadingTip(true)
        setAiTip('')
        try {
            const summary = CATEGORIES.map(c => `${c.label}: ₹${byCategory[c.id] || 0}`).join(', ')
            const prompt = `I'm on a trip to Tamil Nadu with a budget of ₹${budget} for ${travelers.length} people. 
So far spent: ₹${totalSpent} (${Math.round(pct)}% of budget). 
Breakdown: ${summary}. 
Give me 3 specific money-saving tips for the category I'm overspending on. Be specific to Tamil Nadu costs. Keep it brief and actionable.`
            const tip = await sendMessage([{ role: 'user', content: prompt }])
            setAiTip(tip)
        } catch {
            setAiTip('Set your VITE_CLAUDE_API_KEY to get personalized AI budget tips!')
        } finally {
            setLoadingTip(false)
        }
    }

    const exportSummary = () => {
        const lines = [
            `VoyagerAI Budget Tracker — ${trip}`,
            `Total Budget: ₹${budget.toLocaleString('en-IN')}`,
            `Total Spent: ₹${totalSpent.toLocaleString('en-IN')} (${Math.round(pct)}%)`,
            `Remaining: ₹${remaining.toLocaleString('en-IN')}`,
            '',
            'Expenses:',
            ...expenses.map(e => `${e.date} | ${e.desc} | ₹${e.amount} | ${e.category} | Paid by: ${e.paidBy}`),
            '',
            'Per Person Split:',
            ...travelers.map(t => `${t.name}: Paid ₹${travelerSpent[t.name] || 0}, Owes: ₹${Math.max(0, perPerson - (travelerSpent[t.name] || 0))} to the group`)
        ]
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${trip.replace(/\s+/g, '-')}-budget.txt`
        a.click()
        toast.success('Budget exported!')
    }

    const statusColor = pct < 70 ? 'emerald' : pct < 90 ? 'amber' : 'rose'

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] pt-24 pb-16 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-500/30">💰</div>
                            <div>
                                {editingBudget ? (
                                    <input value={trip} onChange={e => setTrip(e.target.value)} onBlur={() => setEditingBudget(false)}
                                        className="text-2xl font-black text-slate-900 dark:text-white bg-transparent border-b-2 border-amber-500 outline-none" autoFocus />
                                ) : (
                                    <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        {trip}
                                        <button onClick={() => setEditingBudget(true)} className="text-slate-400 hover:text-amber-500 transition">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    </h1>
                                )}
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Track expenses · Split with group · Get AI tips</p>
                            </div>
                        </div>
                        <div className="md:ml-auto flex gap-2">
                            <button onClick={getAiTip} disabled={loadingTip}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60">
                                {loadingTip ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                AI Tip
                            </button>
                            <button onClick={exportSummary}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-amber-300 transition-all">
                                <Download className="w-4 h-4" /> Export
                            </button>
                        </div>
                    </div>

                    {/* AI Tip */}
                    <AnimatePresence>
                        {aiTip && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="mt-4 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 flex gap-3">
                                <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-black text-violet-700 dark:text-violet-300 text-sm mb-1">AI Budget Tip</div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{aiTip}</p>
                                </div>
                                <button onClick={() => setAiTip('')} className="shrink-0 text-slate-400 hover:text-slate-600 transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Budget Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {/* Budget */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Budget</div>
                        <div className="flex items-center gap-2">
                            {editingBudget ? (
                                <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)}
                                    onBlur={() => { const v = parseFloat(budgetInput); if (v > 0) setBudget(v); setEditingBudget(false) }}
                                    className="text-3xl font-black text-slate-900 dark:text-white bg-transparent border-b-2 border-amber-500 outline-none w-32" autoFocus />
                            ) : (
                                <div className="text-3xl font-black text-slate-900 dark:text-white">₹{budget.toLocaleString('en-IN')}</div>
                            )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">for {travelers.length} {travelers.length === 1 ? 'person' : 'people'}</div>
                    </div>

                    {/* Spent */}
                    <div className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 border-${statusColor}-200 dark:border-${statusColor}-800`}
                        style={{ borderColor: pct < 70 ? '#a7f3d0' : pct < 90 ? '#fcd34d' : '#fca5a5' }}>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Spent</div>
                        <div className={`text-3xl font-black text-${statusColor}-600 dark:text-${statusColor}-400`}
                            style={{ color: pct < 70 ? '#059669' : pct < 90 ? '#d97706' : '#dc2626' }}>
                            ₹{totalSpent.toLocaleString('en-IN')}
                        </div>
                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>{Math.round(pct)}% used</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                                    className="h-full rounded-full"
                                    style={{ background: pct < 70 ? '#10b981' : pct < 90 ? '#f59e0b' : '#f43f5e' }} />
                            </div>
                        </div>
                    </div>

                    {/* Remaining */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Remaining</div>
                        <div className={`text-3xl font-black ${remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {remaining < 0 ? '-' : ''}₹{Math.abs(remaining).toLocaleString('en-IN')}
                        </div>
                        {remaining < 0 && (
                            <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 mt-1">
                                <AlertTriangle className="w-3 h-3" /> Over budget!
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[{ id: 'overview', label: '📊 Overview' }, { id: 'add', label: '➕ Add Expense' }, { id: 'split', label: '👥 Group Split' }].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`px-4 py-2.5 rounded-2xl text-sm font-black transition-all border ${tab === t.id
                                ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* ── OVERVIEW TAB ── */}
                    {tab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {expenses.length === 0 ? (
                                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-16 text-center">
                                    <Wallet className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                    <p className="font-bold text-slate-500 dark:text-slate-400">No expenses yet.</p>
                                    <button onClick={() => setTab('add')} className="mt-4 px-6 py-2.5 rounded-2xl bg-amber-500 text-white font-black text-sm hover:bg-amber-600 transition">
                                        Add First Expense
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Donut chart */}
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                                        <div className="font-black text-slate-900 dark:text-white mb-4">By Category</div>
                                        <div className="max-w-xs mx-auto">
                                            <Doughnut data={donutData} options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { family: 'Outfit' } } } }, cutout: '65%' }} />
                                        </div>
                                    </div>

                                    {/* Bar chart */}
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                                        <div className="font-black text-slate-900 dark:text-white mb-4">Spending Breakdown</div>
                                        <Bar data={barData} options={{
                                            responsive: true, plugins: { legend: { display: false } },
                                            scales: { y: { beginAtZero: true, ticks: { callback: v => `₹${v}` } } }
                                        }} />
                                    </div>

                                    {/* Expense list */}
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 lg:col-span-2">
                                        <div className="font-black text-slate-900 dark:text-white mb-4">All Expenses ({expenses.length})</div>
                                        <div className="space-y-2 max-h-80 overflow-y-auto">
                                            {[...expenses].reverse().map(exp => {
                                                const cat = CATEGORIES.find(c => c.id === exp.category)
                                                const Icon = cat?.icon || Coffee
                                                return (
                                                    <div key={exp.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${cat?.border || 'border-slate-200'} ${cat?.bg || 'bg-slate-50'}`}>
                                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                                            style={{ background: cat?.color + '20' }}>
                                                            <Icon className="w-4 h-4" style={{ color: cat?.color }} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{exp.desc}</div>
                                                            <div className="text-xs text-slate-400">{exp.date} · Paid by {exp.paidBy}</div>
                                                        </div>
                                                        <div className="font-black text-slate-900 dark:text-white shrink-0">₹{exp.amount.toLocaleString('en-IN')}</div>
                                                        <button onClick={() => removeExpense(exp.id)} className="p-1 text-slate-300 hover:text-red-500 transition shrink-0">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── ADD EXPENSE TAB ── */}
                    {tab === 'add' && (
                        <motion.div key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                            <div className="font-black text-slate-900 dark:text-white text-lg mb-6">Log New Expense</div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                                    <input value={newExp.desc} onChange={e => setNewExp(p => ({ ...p, desc: e.target.value }))}
                                        placeholder="e.g. Lunch at Saravana Bhavan"
                                        className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount (₹)</label>
                                    <input type="number" value={newExp.amount} onChange={e => setNewExp(p => ({ ...p, amount: e.target.value }))}
                                        placeholder="e.g. 450"
                                        className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {CATEGORIES.map(c => {
                                            const Icon = c.icon
                                            return (
                                                <button key={c.id} onClick={() => setNewExp(p => ({ ...p, category: c.id }))}
                                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${newExp.category === c.id ? 'text-white border-transparent' : `${c.bg} ${c.border} text-slate-700 dark:text-slate-300`}`}
                                                    style={newExp.category === c.id ? { background: c.color, borderColor: c.color } : {}}>
                                                    <Icon className="w-3.5 h-3.5" />{c.label.split(' ')[0]}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid By</label>
                                    <select value={newExp.paidBy} onChange={e => setNewExp(p => ({ ...p, paidBy: e.target.value }))}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800">
                                        {travelers.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button onClick={addExpense}
                                className="mt-6 flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-white text-sm shadow-lg hover:shadow-amber-500/30 transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                                <PlusCircle className="w-5 h-5" /> Add Expense
                            </button>
                        </motion.div>
                    )}

                    {/* ── GROUP SPLIT TAB ── */}
                    {tab === 'split' && (
                        <motion.div key="split" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                            <div className="font-black text-slate-900 dark:text-white text-lg mb-2">Group Expense Splitter</div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Total: ₹{totalSpent.toLocaleString('en-IN')} ÷ {travelers.length} people = <strong className="text-amber-600">₹{perPerson.toLocaleString('en-IN')} each</strong>
                            </p>

                            {/* Add traveler */}
                            <div className="flex gap-2 mb-6">
                                <input value={newTravelerName} onChange={e => setNewTravelerName(e.target.value)}
                                    placeholder="Add traveler name…"
                                    onKeyDown={e => { if (e.key === 'Enter' && newTravelerName.trim()) { setTravelers(prev => [...prev, { name: newTravelerName.trim(), paid: 0 }]); setNewTravelerName('') } }}
                                    className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-200" />
                                <button onClick={() => { if (newTravelerName.trim()) { setTravelers(prev => [...prev, { name: newTravelerName.trim(), paid: 0 }]); setNewTravelerName('') } }}
                                    className="px-4 py-2.5 rounded-2xl bg-amber-500 text-white font-black text-sm hover:bg-amber-600 transition">
                                    Add
                                </button>
                            </div>

                            <div className="space-y-3">
                                {travelers.map((t, i) => {
                                    const paid = travelerSpent[t.name] || 0
                                    const owes = perPerson - paid
                                    return (
                                        <div key={t.name} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black shrink-0">
                                                {t.name[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-black text-slate-900 dark:text-white">{t.name}</div>
                                                <div className="text-xs text-slate-500">Paid: ₹{paid.toLocaleString('en-IN')}</div>
                                            </div>
                                            <div className={`text-right shrink-0`}>
                                                {owes > 0 ? (
                                                    <>
                                                        <div className="font-black text-rose-600 dark:text-rose-400">Owes ₹{owes.toLocaleString('en-IN')}</div>
                                                        <div className="text-xs text-slate-400">to the group</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                                                            <CheckCircle className="w-4 h-4" /> Gets ₹{Math.abs(owes).toLocaleString('en-IN')}
                                                        </div>
                                                        <div className="text-xs text-slate-400">back from group</div>
                                                    </>
                                                )}
                                            </div>
                                            {travelers.length > 1 && i > 0 && (
                                                <button onClick={() => setTravelers(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="p-1 text-slate-300 hover:text-red-500 transition">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

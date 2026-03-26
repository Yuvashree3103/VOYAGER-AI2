import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Luggage, Sparkles, RefreshCw, Download, Share2, CheckSquare, Square,
  ChevronDown, ChevronUp, AlertCircle, Info, Plus
} from 'lucide-react'
import { sendMessage } from '../services/claude'
import toast from 'react-hot-toast'

// ─── Static category icons & colours ─────────────────────────────────────────
const CAT_META = {
  '👕 Clothing': { color: '#3b82f6' },
  '📄 Documents': { color: '#10b981' },
  '💊 Medicines': { color: '#f43f5e' },
  '📱 Gadgets': { color: '#8b5cf6' },
  '🧴 Toiletries': { color: '#f59e0b' },
  '🎒 Gear': { color: '#0d9488' },
  '🍱 Food & Snacks': { color: '#d97706' },
  '⚠️ Temple-Specific': { color: '#f97316' },
}

// ─── Offline fallback list ────────────────────────────────────────────────────
const FALLBACK_ITEMS = {
  '👕 Clothing': ['Lightweight cotton clothes (heat-friendly)', 'Walking shoes/sandals', 'Dress modestly for temples (cover shoulders & knees)', 'Sweater/jacket if going to hills (Ooty/Kodaikanal)', 'Raincoat/umbrella if monsoon season', 'Comfortable inner wear (pack extra)'],
  '📄 Documents': ['Aadhar / Passport for ID', 'Hotel booking confirmations', 'e-Tickets (train/bus)', 'Travel insurance policy', 'Emergency contacts list', 'Driving licence if hiring vehicle'],
  '💊 Medicines': ['ORS packets (stay hydrated)', 'Antacid tablets (spicy food!)', 'Mosquito repellent cream/spray', 'Paracetamol & basic first aid', 'Any personal prescription meds', 'Eye drops (dusty roads)'],
  '📱 Gadgets': ['Phone + charger + power bank', 'Universal power adapter', 'Earphones', 'Camera / extra memory cards', 'Download offline maps (Google Maps)', 'Download VoyagerAI app offline data'],
  '🧴 Toiletries': ['Sunscreen SPF 50+ (Tamil Nadu is hot!)', 'Sanitizer & wet wipes', 'Toilet paper (not everywhere)', 'Face wash and moisturizer', 'Deodorant', 'Small towel'],
  '🎒 Gear': ['Day bag / small backpack', 'Water bottle (carry always)', 'Reusable bag (plastic banned in TN)', 'Small padlock for hostel lockers', 'Ziplock bags (waterproofing)', 'Pocket torch/flashlight'],
}

// ─── System prompt for packing list generation ────────────────────────────────
const PACKING_SYSTEM = `You are a Tamil Nadu travel expert and professional packing advisor.
Generate a detailed, practical packing list in JSON format. Be specific to the destination, season, and trip type.
Response must be ONLY valid JSON in this exact format:
{
  "items": {
    "👕 Clothing": ["item 1", "item 2", ...],
    "📄 Documents": ["item 1", ...],
    "💊 Medicines": ["item 1", ...],
    "📱 Gadgets": ["item 1", ...],
    "🧴 Toiletries": ["item 1", ...],
    "🎒 Gear": ["item 1", ...],
    "🍱 Food & Snacks": ["item 1", ...],
    "⚠️ Temple-Specific": ["only if destination has temples"]
  },
  "warnings": ["important warning 1", "warning 2"],
  "doNotWear": ["item not to wear at temples", "..."]
}`

// ─── Component ────────────────────────────────────────────────────────────────
export default function SmartPacking() {
  const [destination, setDestination] = useState('')
  const [season, setSeason] = useState('Summer')
  const [tripType, setTripType] = useState('Family')
  const [duration, setDuration] = useState(3)
  const [generating, setGenerating] = useState(false)
  const [packingList, setPackingList] = useState(null)
  const [warnings, setWarnings] = useState([])
  const [doNotWear, setDoNotWear] = useState([])
  const [checked, setChecked] = useState({})
  const [collapsed, setCollapsed] = useState({})
  const [customItem, setCustomItem] = useState('')
  const [customCat, setCustomCat] = useState('🎒 Gear')

  const toggleItem = (cat, item) => {
    const key = `${cat}::${item}`
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCollapse = (cat) => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))

  const totalItems = packingList ? Object.values(packingList).flat().length : 0
  const checkedCount = Object.values(checked).filter(Boolean).length

  const generate = useCallback(async () => {
    if (!destination.trim()) { toast.error('Please enter a destination'); return }
    setGenerating(true)
    setPackingList(null)
    setChecked({})
    setWarnings([])
    setDoNotWear([])

    try {
      const prompt = `Generate a packing list for a ${duration}-day ${tripType.toLowerCase()} trip to ${destination}, Tamil Nadu during ${season}.
Include temple-specific items if this district has major temples. Be practical and specific to Tamil Nadu conditions.`
      const response = await sendMessage([{ role: 'user', content: prompt }], PACKING_SYSTEM)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setPackingList(parsed.items || FALLBACK_ITEMS)
        setWarnings(parsed.warnings || [])
        setDoNotWear(parsed.doNotWear || [])
        toast.success('Packing list generated!')
      } else {
        setPackingList(FALLBACK_ITEMS)
        toast('Using offline packing list (set API key for AI-personalized list)', { icon: 'ℹ️' })
      }
    } catch {
      setPackingList(FALLBACK_ITEMS)
      toast('Using offline packing list', { icon: 'ℹ️' })
    } finally {
      setGenerating(false)
    }
  }, [destination, season, tripType, duration])

  const addCustomItem = () => {
    if (!customItem.trim()) return
    setPackingList(prev => ({
      ...prev,
      [customCat]: [...(prev[customCat] || []), customItem.trim()]
    }))
    setCustomItem('')
    toast.success('Custom item added!')
  }

  const exportList = () => {
    if (!packingList) return
    const lines = [`VoyagerAI Packing List — ${destination || 'Tamil Nadu'}`, `${season} | ${tripType} | ${duration} days`, '']
    Object.entries(packingList).forEach(([cat, items]) => {
      lines.push(cat)
      items.forEach(item => {
        const key = `${cat}::${item}`
        lines.push(`  [${checked[key] ? 'x' : ' '}] ${item}`)
      })
      lines.push('')
    })
    if (warnings.length) { lines.push('⚠️ Warnings:'); warnings.forEach(w => lines.push(`  • ${w}`)) }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `packing-list-${(destination || 'trip').replace(/\s+/g, '-')}.txt`
    a.click()
    toast.success('List exported!')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">🎒</div>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Smart Packing Checklist</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">AI generates a personalized Tamil Nadu packing list in seconds</p>
            </div>
          </div>
        </motion.div>

        {/* Input Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</label>
              <input value={destination} onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Ooty, Madurai…"
                onKeyDown={e => e.key === 'Enter' && generate()}
                className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Season</label>
              <select value={season} onChange={e => setSeason(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-200">
                {['Summer (Mar-Jun)', 'Monsoon (Jul-Sep)', 'Winter (Oct-Feb)', 'Festival Season'].map(s => (
                  <option key={s} value={s.split(' ')[0]}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trip Type</label>
              <select value={tripType} onChange={e => setTripType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-200">
                {['Solo', 'Couple', 'Family', 'Group', 'Backpacking', 'Pilgrimage', 'Adventure'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration (days)</label>
              <input type="number" min={1} max={30} value={duration} onChange={e => setDuration(parseInt(e.target.value) || 1)}
                className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <button onClick={generate} disabled={generating}
            className="mt-5 flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-white text-sm shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}>
            {generating ? <><RefreshCw className="w-5 h-5 animate-spin" /> Generating…</> : <><Sparkles className="w-5 h-5" /> Generate AI Packing List</>}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {packingList && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {/* Progress bar */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-5 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>Packing Progress</span>
                    <span>{checkedCount} / {totalItems} items</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(checkedCount / totalItems) * 100}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={exportList} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  {checkedCount === totalItems && (
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-xs">
                      <CheckSquare className="w-3.5 h-3.5" /> All packed!
                    </div>
                  )}
                </div>
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="mb-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4">
                  <div className="flex items-center gap-2 font-black text-amber-700 dark:text-amber-300 mb-2">
                    <AlertCircle className="w-4 h-4" /> Important Warnings
                  </div>
                  <ul className="space-y-1">
                    {warnings.map((w, i) => <li key={i} className="text-sm text-amber-700 dark:text-amber-300">⚠️ {w}</li>)}
                  </ul>
                </div>
              )}

              {/* Do Not Wear */}
              {doNotWear.length > 0 && (
                <div className="mb-5 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 p-4">
                  <div className="flex items-center gap-2 font-black text-rose-700 dark:text-rose-300 mb-2">
                    <Info className="w-4 h-4" /> What NOT to Wear (Temple etiquette)
                  </div>
                  <ul className="space-y-1">
                    {doNotWear.map((d, i) => <li key={i} className="text-sm text-rose-700 dark:text-rose-300">❌ {d}</li>)}
                  </ul>
                </div>
              )}

              {/* Category Checklists */}
              <div className="space-y-3">
                {Object.entries(packingList).map(([cat, items]) => {
                  const catChecked = items.filter(item => checked[`${cat}::${item}`]).length
                  const isCollapsed = collapsed[cat]
                  const meta = CAT_META[cat] || { color: '#6b7280' }
                  return (
                    <div key={cat} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <button onClick={() => toggleCollapse(cat)}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{cat.split(' ')[0]}</div>
                          <div>
                            <div className="font-black text-slate-900 dark:text-white text-sm">{cat.slice(cat.indexOf(' ') + 1)}</div>
                            <div className="text-xs text-slate-400">{catChecked}/{items.length} packed</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {catChecked === items.length && items.length > 0 && (
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">✓ Done</span>
                          )}
                          {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>
                      {!isCollapsed && (
                        <div className="border-t border-slate-100 dark:border-slate-800 px-4 pb-4 pt-2">
                          <div className="space-y-2">
                            {items.map((item, i) => {
                              const key = `${cat}::${item}`
                              const isChecked = checked[key]
                              return (
                                <button key={i} onClick={() => toggleItem(cat, item)}
                                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${isChecked
                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                  {isChecked
                                    ? <CheckSquare className="w-5 h-5 text-green-500 shrink-0" />
                                    : <Square className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />}
                                  <span className={`text-sm ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                                    {item}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Add Custom Item */}
              <div className="mt-5 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-blue-300 dark:border-blue-700 p-4">
                <div className="text-sm font-black text-slate-700 dark:text-slate-300 mb-3">Add Custom Item</div>
                <div className="flex gap-2">
                  <select value={customCat} onChange={e => setCustomCat(e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200">
                    {Object.keys(packingList).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input value={customItem} onChange={e => setCustomItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                    placeholder="Add custom item…"
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200" />
                  <button onClick={addCustomItem}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!packingList && !generating && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-16 text-center">
            <Luggage className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="font-bold text-slate-500 dark:text-slate-400">Enter your destination above to generate a personalized AI packing list</p>
            <p className="text-xs text-slate-400 mt-2">Tailored for Tamil Nadu weather, culture, and temple etiquette</p>
          </div>
        )}
      </div>
    </div>
  )
}

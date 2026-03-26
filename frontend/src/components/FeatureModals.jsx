import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Luggage, Globe, Shield, Users, BookOpen, Phone } from 'lucide-react'

// Smart Packing feature — 3-step wizard
const PackingModal = ({ onClose }) => {
  const [step, setStep] = useState(1)
  const [dest, setDest] = useState('')
  const [duration, setDuration] = useState('')
  const [season, setSeason] = useState('summer')
  const [list, setList] = useState(null)

  const packingData = {
    common: ['National ID / Passport', 'Phone charger & cables', 'Power bank (10000mAh+)', 'Cash (INR)', 'Debit/Credit card', 'First aid kit & medicines', 'Reusable water bottle', 'Sunscreen SPF 50+', 'Hand sanitiser', 'Mask (N95)', 'Snacks for journey'],
    summer: ['Light cotton clothes (3–4 pairs)', 'Sunglasses & UV protection', 'Wide-brim hat or cap', 'Electrolyte sachets', 'ORS packets', 'Cooling towel'],
    monsoon: ['Compact raincoat / Poncho', 'Waterproof sandals / shoes', 'Quick-dry synthetic clothes', 'Ziplock bags for gadgets', 'Umbrella', 'Extra pair of dry socks'],
    winter: ['Warm jacket & fleece layer', 'Woollen sweater', 'Thermal inner wear', 'Wool socks & gloves', 'Lip balm for dry weather'],
    hills: ['Trekking shoes / boots', 'Windproof light jacket', 'Trekking pole (optional)', 'Energy bars & dry fruits', 'Insect repellent', 'Torch / headlamp'],
    beach: ['Swimwear / beach wear', 'Flip-flops / slippers', 'Beach towel', 'Waterproof pouch for phone'],
    temple: ['Traditional cotton clothes', 'Saree / Dhoti for darshan', 'Cotton dupatta / shawl', 'Slip-on footwear (easy removal)'],
    long: ['Extra clothes (+2 pairs)', 'Laundry bag', 'Travel pillow & eye mask', 'Portable clothesline', 'Digital entertainment'],
  }

  const generateList = () => {
    const extra = []
    const d = dest.toLowerCase()
    const days = parseInt(duration) || 1
    if (['ooty', 'kodaikanal', 'yercaud', 'kotagiri', 'nilgiris', 'yelagiri', 'kolli', 'coonoor', 'valparai'].some(v => d.includes(v))) extra.push(...packingData.hills)
    if (['marina', 'kanyakumari', 'rameswaram', 'mahabalipuram', 'dhanushkodi', 'beach', 'coastal'].some(v => d.includes(v))) extra.push(...packingData.beach)
    if (['meenakshi', 'temple', 'rameswaram', 'thanjavur', 'chidambaram', 'madurai', 'kovil', 'kovil'].some(v => d.includes(v))) extra.push(...packingData.temple)
    if (days >= 4) extra.push(...packingData.long)
    const seasonItems = packingData[season] || packingData.summer
    const finalList = [...new Set([...packingData.common, ...seasonItems, ...extra])]
    setList(finalList)
    setStep(4)
  }

  const stepLabel = ['', 'Destination', 'Duration', 'Season']
  const stepColor = ['', 'from-blue-500 to-cyan-500', 'from-violet-500 to-purple-600', 'from-orange-500 to-amber-500']

  return (
    <FeatureModal title="Smart Packing Checklist" icon={<Luggage className="h-5 w-5" />} onClose={onClose}>
      {/* Step progress bar */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all ${step > s ? 'bg-blue-600 text-white' : step === s ? `bg-gradient-to-br ${stepColor[s]} text-white` : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {step > s ? '✓' : s}
            </div>
            <div className="text-xs font-bold text-slate-400">{stepLabel[s]}</div>
            {s < 3 && <div className={`flex-1 h-0.5 rounded-full ${step > s ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Destination */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <div className="text-base font-black text-slate-900 dark:text-white mb-1">Where are you going?</div>
            <div className="text-xs text-slate-500 mb-4">Enter your Tamil Nadu destination and we'll personalise your list.</div>
            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g. Ooty, Madurai, Kanyakumari..."
              value={dest}
              onChange={e => setDest(e.target.value)}
              autoFocus
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {['Ooty', 'Madurai', 'Kanyakumari', 'Kodaikanal', 'Rameswaram'].map(q => (
                <button key={q} onClick={() => setDest(q)} className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!dest.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black text-sm disabled:opacity-50 hover:shadow-lg transition-all"
          >
            Next: Trip Duration →
          </button>
        </div>
      )}

      {/* Step 2: Duration */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <div className="text-base font-black text-slate-900 dark:text-white mb-1">How many days?</div>
            <div className="text-xs text-slate-500 mb-4">Trip to <strong className="text-blue-600">{dest}</strong> — how long will you stay?</div>
            <div className="grid grid-cols-4 gap-2">
              {['1', '2–3', '4–6', '7+'].map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d === '7+' ? '7' : d === '4–6' ? '4' : d === '2–3' ? '2' : '1')}
                  className={`py-3 rounded-xl text-sm font-black border-2 transition-all ${duration && (
                    (d === '1' && duration === '1') || (d === '2–3' && duration === '2') || (d === '4–6' && duration === '4') || (d === '7+' && duration === '7')
                  ) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'}`}
                >
                  {d} day{d !== '1' ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Back</button>
            <button onClick={() => setStep(3)} disabled={!duration} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black text-sm disabled:opacity-50 hover:shadow-lg transition-all">
              Next: Season →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Season */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <div className="text-base font-black text-slate-900 dark:text-white mb-1">What's the season?</div>
            <div className="text-xs text-slate-500 mb-4">This helps us add weather-appropriate items to your list.</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'summer', label: 'Summer', emoji: '☀️', desc: 'Apr–Jun' },
                { key: 'monsoon', label: 'Monsoon', emoji: '🌧️', desc: 'Jul–Sep' },
                { key: 'winter', label: 'Winter', emoji: '❄️', desc: 'Oct–Mar' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSeason(s.key)}
                  className={`py-3 px-2 rounded-xl text-center border-2 transition-all ${season === s.key ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-orange-300'}`}
                >
                  <div className="text-2xl">{s.emoji}</div>
                  <div className="text-xs font-black text-slate-900 dark:text-white mt-1">{s.label}</div>
                  <div className="text-xs text-slate-400">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Back</button>
            <button onClick={generateList} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm hover:shadow-lg transition-all">
              🧳 Generate List
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Generated List */}
      {step === 4 && list && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-slate-900 dark:text-white text-sm">Packing List for {dest}</div>
              <div className="text-xs text-slate-400">{season.charAt(0).toUpperCase() + season.slice(1)} · {duration} days · {list.length} items</div>
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">Start Over</button>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {list.map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" defaultChecked />
                  <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              const text = `Packing List for ${dest} (${season}, ${duration} days):\n${list.map(i => `• ${i}`).join('\n')}`
              navigator.clipboard?.writeText(text).then(() => alert('Copied to clipboard!'))
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black text-sm hover:shadow-lg transition-all"
          >
            📋 Copy List
          </button>
        </div>
      )}
    </FeatureModal>
  )
}

// Language Helper
const LanguageModal = ({ onClose }) => {
  const phrases = [
    { en: 'Hello / Welcome', ta: 'வணக்கம் (Vanakkam)' },
    { en: 'Thank you', ta: 'நன்றி (Nandri)' },
    { en: 'How much is this?', ta: 'இது எவ்வளவு? (Idhu evvalavu?)' },
    { en: 'Where is the temple?', ta: 'கோவில் எங்கே? (Kovil engey?)' },
    { en: 'I need help', ta: 'எனக்கு உதவி வேண்டும் (Enakku udhavi vendum)' },
    { en: 'Please', ta: 'தயவுசெய்து (Thayavu seidhu)' },
    { en: 'Water', ta: 'தண்ணீர் (Thanneer)' },
    { en: 'Food', ta: 'சாப்பாடு (Saapadu)' },
    { en: 'Price is too high', ta: 'விலை அதிகம் (Vilai adhigam)' },
    { en: 'Where is the bus stop?', ta: 'பஸ் நிறுத்தம் எங்கே? (Bus niruttham engey?)' },
    { en: 'Auto / Taxi', ta: 'ஆட்டோ / டாக்ஸி (Auto / Taxi)' },
    { en: 'Hospital / Doctor', ta: 'மருத்துவமனை / டாக்டர் (Maruthuvamanai / Doctor)' },
  ]
  return (
    <FeatureModal title="Tamil Language Helper" icon={<Globe className="h-5 w-5" />} onClose={onClose}>
      <div className="text-xs text-slate-500 mb-3">Essential Tamil phrases for Tamil Nadu travel:</div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {phrases.map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white">{p.en}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">{p.ta}</div>
            </div>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(p.ta.split('(')[0].trim())
                  utterance.lang = 'ta-IN'
                  window.speechSynthesis.speak(utterance)
                }
              }}
              className="text-xs px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-bold hover:bg-blue-200 transition shrink-0"
            >
              🔊
            </button>
          </div>
        ))}
      </div>
    </FeatureModal>
  )
}

// Safety Alerts
const SafetyModal = ({ onClose }) => {
  const [selectedCity, setSelectedCity] = useState('Madurai')
  const cities = {
    Madurai: { emergency: '100', ambulance: '108', tourism: '044-25367966', tips: ['Keep valuables secured near temple crowds', 'Always haggle for auto fares or use apps', 'Dress modestly in temple areas', 'Avoid street food in the afternoon heat', 'Trust only licensed tourist guides'] },
    Chennai: { emergency: '100', ambulance: '108', tourism: '044-25384919', tips: ['Use official CMBT bus terminal for intercity travel', 'Metro is safe and AC for hot midday travel', 'Avoid isolated Marina Beach at night', 'Use Ola/Rapido for reliable auto fares', 'Keep scan copies of ID on your phone'] },
    Ooty: { emergency: '100', ambulance: '108', tourism: '0423-2443977', tips: ['Book Nilgiri Toy Train 2-3 days in advance', 'Carry rain gear year-round in hills', 'Drive carefully on hairpin bends', 'Avoid unlicensed tea/eucalyptus oil stalls', 'Carry cash — few ATMs in remote areas'] },
    Kanyakumari: { emergency: '100', ambulance: '108', tourism: '04652-246276', tips: ['Book sunrise ferry tickets a day before', 'Watch for strong currents at ocean confluence', 'Peak season is Oct-Feb — book hotels early', 'Carry cash for fishermen boat rides', 'Visit Vivekananda Rock before 10 AM'] },
    Rameswaram: { emergency: '100', ambulance: '108', tourism: '04573-221371', tips: ['Wear cotton clothes for the hot climate', 'Carry drinking water in the pilgrimage route', 'Dhanushkodi requires 4WD — hire locally', 'Temple opens at 5 AM for early darshan', 'Avoid swimming in sea near Dhanushkodi'] },
  }
  const city = cities[selectedCity]

  return (
    <FeatureModal title="Safety Alerts" icon={<Shield className="h-5 w-5" />} onClose={onClose}>
      <div className="flex gap-2 flex-wrap mb-4">
        {Object.keys(cities).map(c => (
          <button key={c} onClick={() => setSelectedCity(c)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedCity === c ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-3 text-center border border-red-200 dark:border-red-800">
            <div className="text-xs font-bold text-red-600 dark:text-red-300 mb-1">Police</div>
            <a href={`tel:${city.emergency}`} className="text-xl font-black text-red-700 dark:text-red-300">{city.emergency}</a>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-3 text-center border border-green-200 dark:border-green-800">
            <div className="text-xs font-bold text-green-600 dark:text-green-300 mb-1">Ambulance</div>
            <a href={`tel:${city.ambulance}`} className="text-xl font-black text-green-700 dark:text-green-300">{city.ambulance}</a>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3 text-center border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-300 mb-1">Tourism</div>
            <a href={`tel:${city.tourism}`} className="text-xs font-black text-blue-700 dark:text-blue-300 leading-tight block mt-1">{city.tourism}</a>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">Safety Tips — {selectedCity}</div>
          <ul className="space-y-2">
            {city.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                <span className="text-amber-500 font-bold shrink-0">•</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FeatureModal>
  )
}

// Group Expense Splitter
const ExpenseModal = ({ onClose }) => {
  const [people, setPeople] = useState([{ name: 'You', amount: '' }])
  const [total, setTotal] = useState('')
  const [result, setResult] = useState(null)

  const addPerson = () => setPeople([...people, { name: `Person ${people.length + 1}`, amount: '' }])
  const removePerson = (i) => setPeople(people.filter((_, idx) => idx !== i))

  const calculate = () => {
    const n = people.length
    const totalAmt = parseFloat(total) || 0
    const perPerson = totalAmt / n
    setResult({ perPerson, people: people.map(p => ({ name: p.name, owes: perPerson })) })
  }

  return (
    <FeatureModal title="Group Expense Splitter" icon={<Users className="h-5 w-5" />} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expense (₹)</label>
          <input type="number" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Enter total amount" value={total} onChange={e => setTotal(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Travelers</label>
            <button onClick={addPerson} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">+ Add Person</button>
          </div>
          <div className="space-y-2">
            {people.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" value={p.name} onChange={e => setPeople(people.map((pp, ii) => ii === i ? { ...pp, name: e.target.value } : pp))} />
                {people.length > 1 && (
                  <button onClick={() => removePerson(i)} className="text-red-400 hover:text-red-600 font-bold text-lg px-1">×</button>
                )}
              </div>
            ))}
          </div>
        </div>
        <button onClick={calculate} disabled={!total} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black text-sm disabled:opacity-50 hover:shadow-lg transition-all">
          Calculate Split
        </button>
        {result && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-500 uppercase mb-3">Each Person Owes</div>
            <div className="space-y-2">
              {result.people.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-200">{p.name}</span>
                  <span className="font-black text-blue-700 dark:text-blue-300">₹{p.owes.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <span className="text-sm font-bold text-slate-500">Total</span>
                <span className="font-black text-slate-900 dark:text-white">₹{parseFloat(total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </FeatureModal>
  )
}

// Travel Journal
const JournalModal = ({ onClose }) => {
  const [entries, setEntries] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newEntry, setNewEntry] = useState('')
  const [newLocation, setNewLocation] = useState('')

  const addEntry = () => {
    if (!newTitle || !newEntry) return
    setEntries([{ id: Date.now(), title: newTitle, text: newEntry, location: newLocation, date: new Date().toLocaleDateString('en-IN') }, ...entries])
    setNewTitle(''); setNewEntry(''); setNewLocation('')
  }

  return (
    <FeatureModal title="Travel Journal" icon={<BookOpen className="h-5 w-5" />} onClose={onClose}>
      <div className="space-y-3">
        <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Memory title (e.g. Sunrise at Kanyakumari)" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
        <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Location (e.g. Kanyakumari)" value={newLocation} onChange={e => setNewLocation(e.target.value)} />
        <textarea className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none" placeholder="Write your travel memory..." rows={3} value={newEntry} onChange={e => setNewEntry(e.target.value)} />
        <button onClick={addEntry} disabled={!newTitle || !newEntry} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black text-sm disabled:opacity-50 hover:shadow-lg transition-all">
          Save Memory
        </button>
        <div className="space-y-3 max-h-56 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-center text-sm text-slate-400 py-4">Your journal is empty. Start adding memories!</div>
          ) : entries.map(e => (
            <div key={e.id} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <div className="font-black text-slate-900 dark:text-white text-sm">{e.title}</div>
                <div className="text-xs text-slate-400">{e.date}</div>
              </div>
              {e.location && <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">📍 {e.location}</div>}
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </FeatureModal>
  )
}

// Reusable wrapper
const FeatureModal = ({ title, icon, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white">
            {icon}
          </div>
          <span className="font-black text-slate-900 dark:text-white">{title}</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <X className="h-5 w-5 text-slate-500" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  </div>
)

export { PackingModal, LanguageModal, SafetyModal, ExpenseModal, JournalModal, FeatureModal }

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Mic, MicOff, RefreshCw, SendHorizonal, Sparkles, ThumbsDown, ThumbsUp, Trash2, Volume2, X } from 'lucide-react'
import { streamMessage, VOYAGER_SYSTEM_PROMPT } from '../services/claude'
import attractionsByCity from '../data/attractions.json'
import foodAndShopping from '../data/foodAndShopping.json'

// ─── Local Knowledge Base (fallback when API key not set) ─────────────────────
const CITY_INFO = {
  Chennai: { places: ['Marina Beach (World 2nd longest beach)', 'Kapaleeshwarar Temple', 'Fort St. George', 'Government Museum', 'Santhome Cathedral', 'Besant Nagar Beach'], food: ['Filter Coffee at Saravana Bhavan', 'Marina Sundal', 'Atho (Burmese noodles)', 'Chettinad Biryani'], tips: ['Best Oct–Feb', 'Use Metro for express routes', 'Bargain at T. Nagar'], budget: '₹1,500–₹3,000/day' },
  Madurai: { places: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Palace', 'Gandhi Memorial Museum', 'Alagar Kovil'], food: ['Jigarthanda', 'Kari Dosai', 'Bun Parotta', 'Madurai Biryani'], tips: ['Temple opens 5AM–12:30PM, 4PM–10PM', 'Best Nov–Feb'], budget: '₹1,000–₹2,000/day' },
  Ooty: { places: ['Doddabetta Peak', 'Ooty Lake', 'Botanical Garden', 'Tea Museum', 'Pykara Falls'], food: ['Ooty Chocolate', 'Carrot halwa', 'Fresh homemade wine', 'Estate tea'], tips: ['Best Oct–Jun', 'Toy train: book via IRCTC', 'Woolens needed Nov–Feb'], budget: '₹2,000–₹4,000/day' },
  Kodaikanal: { places: ["Kodaikanal Lake", "Coaker's Walk", "Pillar Rocks", "Bear Shola Falls", "Bryant Park"], food: ['Kodai cheese', 'Homemade fruit wine', 'Fresh strawberries', 'Mountain chocolate'], tips: ['Best Apr–Jun, Sep–Nov', 'Rent bicycle at lake ₹80/hr'], budget: '₹2,500–₹5,000/day' },
  Kanyakumari: { places: ['Sunrise/Sunset Viewpoint', 'Vivekananda Rock Memorial', 'Thiruvalluvar Statue', 'Kumari Amman Temple', 'Gandhi Memorial'], food: ['Nendran Banana chips', 'Fresh fish curry', 'Kothu parota'], tips: ['Arrive 5:30AM for sunrise', 'Ferry to Rock ₹40', 'Best Oct–Mar'], budget: '₹1,500–₹3,000/day' },
  Thanjavur: { places: ['Brihadeeswarar Temple (UNESCO)', 'Thanjavur Palace', 'Saraswati Mahal Library', 'Dharasuram Temple (UNESCO)'], food: ['Kumbakonam Degree Coffee', 'Sakkara Pongal', 'Thavala Vadai'], tips: ['Temple free entry', 'Best Oct–Mar'], budget: '₹1,200–₹2,500/day' },
  Rameswaram: { places: ['Ramanathaswamy Temple', 'Pamban Bridge', 'Dhanushkodi', 'Agnitheertham', 'APJ Abdul Kalam Memorial'], food: ['Fresh seafood', 'Banana leaf meals', 'Sundal at Agnitheertham'], tips: ['Temple opens 4AM', 'Dhanushkodi jeep ₹600 for group'], budget: '₹1,000–₹2,000/day' },
  Coimbatore: { places: ['Marudhamalai Murugan Temple', 'Isha Yoga Center & Adiyogi', 'Siruvani Waterfall', 'Velliangiri Hills'], food: ['Annapoorna Hotel Sambar', 'Seeraga Samba Biryani', 'Kari Dosai', 'Filter Coffee'], tips: ['Pleasant climate year-round', 'Siruvani needs Forest permit', 'Velliangiri trek: start by 5AM'], budget: '₹1,200–₹2,500/day' },
  Tirunelveli: { places: ['Nellaiyappar Temple', 'Papanasam Falls', 'Mundanthurai Tiger Reserve', 'Agasthiyar Falls'], food: ['Iruttu Kadai Halwa (must buy!)', 'Tirunelveli Koottu Kari', 'Banana Lassi'], tips: ['Halwa ₹80/100g from Iruttu Kadai', 'Best Nov–Jan'], budget: '₹900–₹2,000/day' },
  Trichy: { places: ['Rock Fort Temple (437 steps)', 'Ranganathaswamy Temple Srirangam', 'Jambukeswarar Temple', 'Kallanai Dam'], food: ['Manapparai Murukku', 'Banana Halwa', 'Srirangam temple prasadam'], tips: ['Rock Fort sunrise is spectacular', 'Best Nov–Feb'], budget: '₹1,000–₹2,000/day' },
  Salem: { places: ["Yercaud Hill Station", 'Kiliyur Falls', 'Mettur Dam', 'Sugavaneswarar Temple'], food: ['Thattu Vadai Set', 'Salem Mango', 'Kalakkal sweet', 'Estate filter coffee'], tips: ['Yercaud 30 min from Salem', 'Best Oct–Feb'], budget: '₹900–₹1,800/day' },
}

const buildLocalReply = (q) => {
  const query = q.toLowerCase()
  const city = Object.keys(CITY_INFO).find(c => query.includes(c.toLowerCase()))
    || Object.keys(attractionsByCity).find(c => query.includes(c.toLowerCase()))
  const info = city ? CITY_INFO[city] : null

  if ((query.includes('best place') || query.includes('places to visit') || query.includes('what to see')) && info)
    return `📍 **Top Places in ${city}**\n\n${info.places.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n💰 Budget: ${info.budget}/day\n\n_Need a full itinerary? Ask me to "plan X days in ${city}"_`

  if ((query.includes('food') || query.includes('eat') || query.includes('dish')) && info)
    return `🍛 **Must-try Food in ${city}**\n\n${info.food.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nTip: Ask locals for "saapadu kadai" (meal shops) for authentic experience!`

  if ((query.includes('tip') || query.includes('advice') || query.includes('guide')) && info)
    return `💡 **Travel Tips for ${city}**\n\n${info.tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n💰 Daily budget: ${info.budget}`

  if (query.includes('budget') || query.includes('cost') || query.includes('cheap')) {
    if (info) return `💰 **Budget Guide for ${city}**\n\n${info.budget}/day includes:\n• Budget hotel: ₹800–₹1,500\n• Food: ₹300–₹500\n• Local transport: ₹100–₹300\n• Entry fees: ₹50–₹400\n\n💡 Use TNSTC buses to cut transport costs by 70%!`
    return `💰 **Tamil Nadu Budget Overview**\n\n• Budget traveller: ₹800–₹1,500/day\n• Mid-range: ₹2,000–₹4,000/day\n• Luxury: ₹6,000+/day\n\nWhich city are you planning?`
  }

  if (query.includes('emergency') || query.includes('police') || query.includes('ambulance'))
    return `🆘 **Emergency Numbers in Tamil Nadu**\n\n• Police: 100\n• Ambulance: 108\n• Fire: 101\n• Tourist Helpline: 1363 (toll free)\n• Women's Helpline: 181\n• Women Travellers: 1091\n• Child Helpline: 1098\n\nStay safe! 🙏`

  if (city && attractionsByCity[city]) {
    const top = attractionsByCity[city].slice(0, 5).map((x, i) => `${i + 1}. ${x.title} (${x.category})`)
    return `📍 **Top Attractions in ${city}**\n\n${top.join('\n')}\n\n${info ? `💡 ${info.tips[0]}` : ''}\n\nAsk for food tips, budget guide, or "plan 3 days in ${city}" for a full itinerary!`
  }

  return `🙏 Vanakkam! I can help with:\n\n• 📍 **Places to visit** in any of the 39 Tamil Nadu districts\n• 🍛 **Food & local specialties**\n• 💰 **Budget planning** with specific ₹ amounts\n• 🚌 **Transport routes** (bus numbers, train names)\n• 🗓️ **Day-by-day itineraries**\n• 🆘 **Emergency contacts**\n\nTry asking:\n"_Best places in Madurai_"\n"_3 day Ooty itinerary_"\n"_Budget trip to Kanyakumari_"\n"_Food in Thanjavur_"`
}

const SUGGESTIONS = [
  'Best places in Chennai', '3 day Ooty itinerary', 'Budget trip Kanyakumari',
  'Food in Madurai', 'How to reach Kodaikanal', 'Chettinad cuisine guide',
  'Hogenakkal Falls tips', 'Temple timings Rameswaram', 'Shopping in Kanchipuram',
  'Solo travel tips Tamil Nadu',
]

// ─── Helper: persist chat history ─────────────────────────────────────────────
const STORAGE_KEY = 'voyagerai_chat_history'
const loadHistory = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const saveHistory = (msgs) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-60))) } catch { } }

// ─── Component ────────────────────────────────────────────────────────────────
const AIAdvisor = () => {
  const hasApiKey = Boolean(import.meta.env.VITE_CLAUDE_API_KEY && import.meta.env.VITE_CLAUDE_API_KEY !== 'your_anthropic_api_key_here')

  const [messages, setMessages] = useState(() => {
    const history = loadHistory()
    if (history.length) return history
    return [{ id: 'init', role: 'assistant', text: "Vanakkam! 🙏 I'm VoyagerAI — your expert Tamil Nadu travel concierge. Ask me about any of the 39 districts: places, food, budget, itineraries, transport, or hidden gems!\n\n" + (hasApiKey ? '✨ Powered by Claude AI — I understand Tamil, English, and Tanglish!' : '🔑 Running in offline mode — set VITE_CLAUDE_API_KEY in .env.local for full AI responses.'), rating: null }]
  })

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [listening, setListening] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight }, 50)
  }, [])

  useEffect(() => { saveHistory(messages) }, [messages])
  useEffect(scrollToBottom, [messages, scrollToBottom])

  const addMessage = (msg) => setMessages(prev => [...prev, msg])
  const updateLastAssistant = (updater) =>
    setMessages(prev => prev.map((m, i) => i === prev.length - 1 && m.role === 'assistant' ? { ...m, ...updater(m) } : m))

  const send = async (text = input) => {
    const q = text.trim()
    if (!q || sending) return
    setInput('')
    setSending(true)

    const userMsg = { id: Date.now().toString(), role: 'user', text: q }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg = { id: assistantId, role: 'assistant', text: '', rating: null, isStreaming: true }

    addMessage(userMsg)
    addMessage(assistantMsg)
    scrollToBottom()

    try {
      if (hasApiKey) {
        // Real Claude API streaming
        setStreaming(true)
        const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.text }))
        let full = ''
        await streamMessage(history, (chunk) => {
          full += chunk
          updateLastAssistant(() => ({ text: full, isStreaming: true }))
          scrollToBottom()
        }, VOYAGER_SYSTEM_PROMPT)
        updateLastAssistant(() => ({ text: full, isStreaming: false }))
        setStreaming(false)
      } else {
        // Local knowledge base fallback
        await new Promise(r => setTimeout(r, 500))
        const reply = buildLocalReply(q)
        // Simulate streaming
        let i = 0
        const words = reply.split(' ')
        await new Promise(resolve => {
          const interval = setInterval(() => {
            i = Math.min(i + 3, words.length)
            updateLastAssistant(() => ({ text: words.slice(0, i).join(' '), isStreaming: i < words.length }))
            if (i >= words.length) { clearInterval(interval); resolve() }
          }, 30)
        })
        updateLastAssistant(() => ({ isStreaming: false }))
      }
    } catch (err) {
      const errText = err.message === 'NO_API_KEY'
        ? '🔑 Claude API key not found. Set VITE_CLAUDE_API_KEY in your .env.local file.\n\nMeanwhile, I\'m using my offline knowledge base!'
        : `⚠️ ${err.message || 'Connection error'}\n\nFalling back to offline mode:\n\n${buildLocalReply(q)}`
      updateLastAssistant(() => ({ text: errText, isStreaming: false }))
      setStreaming(false)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported in this browser. Try Chrome.'); return }
    const r = new SR()
    recognitionRef.current = r
    r.lang = 'en-IN'
    r.continuous = false
    r.interimResults = false
    r.onstart = () => setListening(true)
    r.onend = () => setListening(false)
    r.onresult = e => { const t = e.results[0][0].transcript; setInput(t) }
    r.onerror = () => setListening(false)
    if (listening) { r.stop(); return }
    r.start()
  }

  const speakText = (text) => {
    if (!text) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''))
    u.lang = 'en-IN'; u.rate = 0.95; u.pitch = 1
    window.speechSynthesis.speak(u)
  }

  const rateMessage = (id, rating) =>
    setMessages(prev => prev.map(m => m.id === id ? { ...m, rating } : m))

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([{ id: 'init', role: 'assistant', text: "History cleared! 🗑️ Vanakkam! How can I help you explore Tamil Nadu today?", rating: null }])
  }

  const exportChat = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'VoyagerAI'}: ${m.text}`).join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'voyagerai-chat.txt'; a.click()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] px-4 md:px-6 pt-24 pb-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-glow-blue">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">AI Travel Advisor</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {hasApiKey ? '✨ Powered by Claude AI · Tamil Nadu Expert' : '🔑 Offline Mode · Set API key for full AI'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={exportChat} title="Export chat" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={clearHistory} title="Clear history" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '520px' }}>
          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${m.role === 'user' ? 'ml-auto' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                      } ${m.isStreaming ? 'typewriter' : ''}`}>
                      {m.text || <span className="opacity-40 italic">Thinking…</span>}
                    </div>
                    {/* Rating + TTS for assistant messages */}
                    {m.role === 'assistant' && !m.isStreaming && m.id !== 'init' && (
                      <div className="flex items-center gap-2 mt-1.5 ml-1">
                        <button onClick={() => speakText(m.text)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition" title="Read aloud">
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => rateMessage(m.id, 'up')} className={`p-1.5 rounded-lg transition ${m.rating === 'up' ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => rateMessage(m.id, 'down')} className={`p-1.5 rounded-lg transition ${m.rating === 'down' ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}>
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder={listening ? '🎤 Listening…' : 'Ask about Tamil Nadu travel…'}
                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm"
                disabled={sending}
              />
              <button
                onClick={startVoice}
                className={`rounded-2xl px-3.5 py-3 border transition ${listening ? 'bg-red-500 border-red-500 text-white' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                title={listening ? 'Stop listening' : 'Voice input'}
              >
                {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={() => send()}
                disabled={sending || !input.trim()}
                className="rounded-2xl px-5 py-3 font-bold text-white disabled:opacity-50 transition shadow-md hover:shadow-blue-500/30"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
              >
                {streaming ? <RefreshCw className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-2 text-center">
              Ask in English, Tamil, or Tanglish · Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAdvisor

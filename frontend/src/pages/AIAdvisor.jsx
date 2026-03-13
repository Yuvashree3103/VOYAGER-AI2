import React, { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, SendHorizonal, Sparkles } from 'lucide-react'
import attractionsByCity from '../data/attractions.json'
import foodAndShopping from '../data/foodAndShopping.json'
import { aiAPI } from '../services/api'

// Local AI Advisor (offline-first). Replace response engine with an LLM API when ready.
const AIAdvisor = () => {
  const suggestions = useMemo(
    () => ['Best temples in Madurai', '3 day Ooty itinerary', 'Budget trip to Kanyakumari'],
    []
  )

  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Vanakkam! 🙏 I'm your VoyagerAI concierge. Ask me anything about Tamil Nadu travel." },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [language, setLanguage] = useState('English')
  const listRef = useRef(null)

  const scrollToBottom = () => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }

  const reply = (q) => {
    const query = q.toLowerCase()

    const city = Object.keys(attractionsByCity).find((c) => query.includes(c.toLowerCase()))
    const cityAttractions = city ? attractionsByCity[city] : null

    if (query.includes('best temples') && city === 'Madurai') {
      return `Top temples in Madurai:\n• Meenakshi Amman Temple\n• (Day trip) Alagar Kovil\nTip: Visit early morning to avoid crowds.`
    }

    if (query.includes('ooty') && query.includes('itinerary')) {
      return `3-day Ooty itinerary:\nDay 1: Ooty Lake → Botanical Garden → Evening viewpoint\nDay 2: Doddabetta Peak → Tea estate visit → Café time\nDay 3: Coonoor day trip → Tea gardens → Sunset photos`
    }

    if (query.includes('budget') && query.includes('kanyakumari')) {
      return `Budget trip tips for Kanyakumari:\n• Sunrise viewpoint is free\n• Use local buses/auto share\n• Eat at banana-leaf meal spots\n• Keep ferry expenses for Vivekananda Rock\nTypical budget: ₹1,500–₹2,500 per person/day`
    }

    if (query.includes('food') && city && foodAndShopping[city]) {
      const foods = foodAndShopping[city].filter((x) => x.type === 'Food').slice(0, 3).map((x) => `• ${x.title}`).join('\n')
      return `Food picks in ${city}:\n${foods}\nTip: Ask locals for peak-time queues and fresh batches.`
    }

    if (cityAttractions && cityAttractions.length) {
      const top = cityAttractions.slice(0, 4).map((x) => `• ${x.title} (${x.category})`).join('\n')
      return `Top places in ${city}:\n${top}\nTell me your dates and interests and I’ll suggest a day-wise plan.`
    }

    return "Sorry, I'm still learning about that destination. Try asking about popular Tamil Nadu places."
  }

  const onSend = () => {
    const q = input.trim()
    if (!q || sending) return
    setInput('')
    setSending(true)

    const requestId = `${Date.now()}`
    setMessages((prev) => [...prev, { role: 'user', text: q }, { role: 'assistant', text: 'Thinking…', id: requestId }])
    setTimeout(scrollToBottom, 50)

    ;(async () => {
      try {
        const res = await aiAPI.askQuestion({ question: q, session_id: 'voyagerai-advisor', language })
        const raw = typeof res?.answer === 'string' ? res.answer.trim() : ''
        const text = raw.length ? raw : reply(q)
        setMessages((prev) => prev.map((m) => (m.id === requestId ? { ...m, text } : m)))
      } catch {
        const text = reply(q) || "I couldn't reach the AI service right now. Ask about temples, beaches, hill stations, or budget tips in Tamil Nadu."
        setMessages((prev) => prev.map((m) => (m.id === requestId ? { ...m, text } : m)))
      } finally {
        setSending(false)
        setTimeout(scrollToBottom, 50)
      }
    })()
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'Hindi' ? 'hi-IN' : language === 'Tamil' ? 'ta-IN' : 'en-IN'
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript
      setInput(spoken)
    }
    recognition.start()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10">
      <div className="max-w-5xl mx-auto pt-14">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">AI Travel Advisor</h1>
              <p className="text-slate-500">Ask anything about Tamil Nadu — itineraries, food, safety, and travel tips.</p>
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
          <div ref={listRef} className="h-[520px] overflow-y-auto p-6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 border-t border-slate-200 bg-white">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Language</div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Tanglish</option>
                <option>Hindi</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter' ? onSend() : null)}
                placeholder="Ask about Tamil Nadu..."
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={startVoice}
                className="rounded-2xl px-4 py-3 font-black text-slate-600 border border-slate-200 bg-white"
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onSend}
                disabled={sending || !input.trim()}
                className="rounded-2xl px-5 py-3 font-black text-white"
                style={{ background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 60%, #F59E0B 130%)' }}
                aria-label="Send"
              >
                <SendHorizonal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAdvisor

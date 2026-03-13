import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Volume2 } from 'lucide-react'
import { servicesAPI } from '../services/api'

const languages = [
  { code: 'auto', label: 'Auto Detect' },
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'tanglish', label: 'Tanglish' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'ml', label: 'Malayalam (മലയാളം)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
]

const quickPhrases = [
  { icon: '⛩️', text: 'Where is the temple?' },
  { icon: '💰', text: 'How much does this cost?' },
  { icon: '🥗', text: 'I am vegetarian' },
  { icon: '🚑', text: 'Call an ambulance' },
  { icon: '🚌', text: 'Where is the bus stop?' },
  { icon: '🆘', text: 'I need help' },
]

const Translator = () => {
  const [mode, setMode] = useState('text')
  const [from, setFrom] = useState('en')
  const [to, setTo] = useState('ta')
  const [text, setText] = useState('')
  const [translated, setTranslated] = useState('')
  const [loading, setLoading] = useState(false)
  const [autoDetect, setAutoDetect] = useState(true)

  const fromLabel = useMemo(() => languages.find((l) => l.code === from)?.label || 'English', [from])
  const toLabel = useMemo(() => languages.find((l) => l.code === to)?.label || 'Tamil (தமிழ்)', [to])

  const swap = () => {
    setFrom(to)
    setTo(from)
    setTranslated('')
  }

  const translate = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await servicesAPI.translate({
        text,
        from,
        to,
        autoDetect
      })
      setTranslated(res?.translatedText || '')
    } catch (e) {
      setTranslated('')
    } finally {
      setLoading(false)
    }
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = from === 'ta' ? 'ta-IN' : from === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript
      setText(spoken)
    }
    recognition.start()
  }

  const speakTranslated = () => {
    if (!translated) return
    const utterance = new SpeechSynthesisUtterance(translated)
    utterance.lang = to === 'ta' ? 'ta-IN' : to === 'hi' ? 'hi-IN' : 'en-IN'
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shadow-sm">译</div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Travel Translator</h1>
              <p className="text-slate-500">Translate menus, signs, and conversations · Tamil & Indian dialects optimized</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setMode('text')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition ${mode === 'text' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
              type="button"
            >
              Text
            </button>
            <button
              onClick={() => setMode('image')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition ${mode === 'image' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
              type="button"
            >
              Image / Menu / Sign
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">From</div>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={swap}
                className="w-12 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-black text-slate-600"
                aria-label="Swap languages"
              >
                ⇄
              </button>

              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">To</div>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
              <input type="checkbox" checked={autoDetect} onChange={(e) => setAutoDetect(e.target.checked)} />
              <span>Auto detect language</span>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'text' ? (
                <motion.div key="text" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-5">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Type text to translate... e.g. "Where is the nearest temple?"`}
                    className="w-full min-h-[120px] rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={startVoice}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <Mic className="h-4 w-4" /> Voice Input
                    </button>
                    <button
                      type="button"
                      onClick={speakTranslated}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <Volume2 className="h-4 w-4" /> Speak Output
                    </button>
                  </div>

                  <div className="mt-4 text-xs font-bold text-slate-400">Quick phrases:</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quickPhrases.map((p) => (
                      <button
                        key={p.text}
                        type="button"
                        onClick={() => setText(p.text)}
                        className="px-3 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
                      >
                        {p.icon} {p.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="image" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-5">
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                    Upload a photo of a menu or signboard to extract text and translate.
                    <div className="mt-3 text-xs text-slate-500">Demo mode: image OCR is not enabled yet.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6">
              <button
                type="button"
                onClick={translate}
                disabled={loading || !text.trim()}
                className="w-full rounded-2xl px-6 py-4 font-black text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)' }}
              >
                {loading ? 'Translating…' : 'Translate'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">From</div>
              <div className="mt-1 font-black text-slate-900">{fromLabel}</div>
              <div className="mt-3 text-slate-700 whitespace-pre-wrap">{text || '—'}</div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">To</div>
              <div className="mt-1 font-black text-slate-900">{toLabel}</div>
              <div className="mt-3 text-slate-700 whitespace-pre-wrap">{translated || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Translator

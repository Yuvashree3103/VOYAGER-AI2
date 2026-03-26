import React, { useState, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Copy, Mic, MicOff, RotateCcw, Volume2, Check, Upload, Camera,
  ArrowLeftRight, BookOpen, MessageSquare, Globe, ChevronDown
} from 'lucide-react'
import { sendMessage } from '../services/claude'

// ─── Language List ────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali (বাংলা)', flag: '🇧🇩' },
  { code: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
  { code: 'ur', label: 'Urdu (اردو)', flag: '🇵🇰' },
  { code: 'fr', label: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', label: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'es', label: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'it', label: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', label: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'ar', label: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'zh', label: 'Chinese (中文)', flag: '🇨🇳' },
  { code: 'ja', label: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean (한국어)', flag: '🇰🇷' },
  { code: 'th', label: 'Thai (ภาษาไทย)', flag: '🇹🇭' },
]

// ─── Phrasebook Data ─────────────────────────────────────────────────────────
const PHRASEBOOK = {
  'Transport': [
    { en: 'Where is the bus stop?', ta: 'பஸ் நிறுத்தம் எங்கே?', romanized: 'Pas niṟuttam eṅkē?' },
    { en: 'How much to the hotel?', ta: 'ஹோட்டலுக்கு எவ்வளவு?', romanized: 'Hōṭṭalukku evvaḷavu?' },
    { en: 'Stop here please', ta: 'இங்கே நிறுத்துங்கள்', romanized: 'Iṅkē niṟuttuṅkaḷ' },
    { en: 'Take me to the airport', ta: 'என்னை விமான நிலையத்திற்கு அழைத்துச் செல்லுங்கள்', romanized: 'Eṉṉai vimāṉa nilaiyattirku...' },
  ],
  'Temple': [
    { en: 'Where is the temple?', ta: 'கோவில் எங்கே?', romanized: 'Kōvil eṅkē?' },
    { en: 'What time does it open?', ta: 'எத்தனை மணிக்கு திறக்கும்?', romanized: 'Ettaṉai maṇikku tiṟakkum?' },
    { en: 'What is the entry fee?', ta: 'நுழைவுக் கட்டணம் என்ன?', romanized: 'Nuḻaivuk kaṭṭaṇam eṉṉa?' },
  ],
  'Food': [
    { en: 'I am vegetarian', ta: 'நான் சைவம்', romanized: 'Nāṉ caivam' },
    { en: 'What is the specialty here?', ta: 'இங்கே சிறப்பு என்ன?', romanized: 'Iṅkē ciṟappu eṉṉa?' },
    { en: 'One plate rice please', ta: 'ஒரு தட்டு சாதம் தாருங்கள்', romanized: 'Oru taṭṭu cātam tāruṅkaḷ' },
  ],
  'Emergency': [
    { en: 'I need help', ta: 'எனக்கு உதவி வேண்டும்', romanized: 'Eṉakku utavi vēṇṭum' },
    { en: 'Call an ambulance', ta: 'ஆம்புலன்ஸ் அழையுங்கள்', romanized: 'Āmbulaṉs aḻaiyuṅkaḷ' },
    { en: 'Call the police', ta: 'போலீஸை அழையுங்கள்', romanized: 'Pōlīsai aḻaiyuṅkaḷ' },
    { en: 'Where is the hospital?', ta: 'மருத்துவமனை எங்கே?', romanized: 'Maruttuvamṉai eṅkē?' },
  ],
  'Shopping': [
    { en: 'How much does this cost?', ta: 'இது எவ்வளவு?', romanized: 'Itu evvaḷavu?' },
    { en: 'Can you reduce the price?', ta: 'விலை குறைக்க முடியுமா?', romanized: 'Vilai kuṟaikka muṭiyumā?' },
    { en: 'This is too expensive', ta: 'இது மிகவும் அதிகம்', romanized: 'Itu mikavum atikam' },
  ],
}

const QUICK_PHRASES = [
  '🏛️ Where is the temple?',
  '💰 How much does this cost?',
  '🚌 Where is the bus stop?',
  '🥗 I am vegetarian',
  '🆘 I need help',
  '🏨 Nearest hotel?',
  '✈️ Take me to the airport',
  '🍛 Local food recommendation',
]

// ─── Translation via Claude ───────────────────────────────────────────────────
const TRANSLATION_SYSTEM = `You are a professional multilingual translator specializing in South Indian languages. 
When given text to translate, respond ONLY with the translated text — no explanations, no notes, no alternatives.
If the target language is Tamil, also provide romanized pronunciation in parentheses after the Tamil script.
Be natural and conversational, not overly formal.`

const translateWithClaude = async (text, fromLang, toLang) => {
  const fromLabel = LANGUAGES.find(l => l.code === fromLang)?.label || fromLang
  const toLabel = LANGUAGES.find(l => l.code === toLang)?.label || toLang
  const prompt = `Translate the following text from ${fromLabel} to ${toLabel}:\n\n"${text}"`
  const result = await sendMessage([{ role: 'user', content: prompt }], TRANSLATION_SYSTEM)
  return result
}

const translateImageWithClaude = async (base64Image, toLang) => {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') throw new Error('NO_API_KEY')
  const toLabel = LANGUAGES.find(l => l.code === toLang)?.label || toLang
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Image } },
          { type: 'text', text: `Extract all visible text from this image and translate it to ${toLabel}. Format: Original: [text]\nTranslated: [translation]` }
        ]
      }]
    })
  })
  if (!response.ok) throw new Error(`API Error ${response.status}`)
  const data = await response.json()
  return data.content?.[0]?.text || ''
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Translator() {
  const [mode, setMode] = useState('text')
  const [from, setFrom] = useState('en')
  const [to, setTo] = useState('ta')
  const [inputText, setInputText] = useState('')
  const [translated, setTranslated] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [listening, setListening] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageResult, setImageResult] = useState('')
  const [phraseCategory, setPhraseCategory] = useState('Transport')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('voyager_translate_history') || '[]') } catch { return [] }
  })
  const recognitionRef = useRef(null)
  const fileInputRef = useRef(null)

  const saveToHistory = useCallback((orig, trans) => {
    const entry = { orig, trans, from, to, time: new Date().toLocaleTimeString() }
    const newHistory = [entry, ...history].slice(0, 20)
    setHistory(newHistory)
    localStorage.setItem('voyager_translate_history', JSON.stringify(newHistory))
  }, [history, from, to])

  const translate = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setTranslated('')
    try {
      const result = await translateWithClaude(inputText, from, to)
      setTranslated(result)
      saveToHistory(inputText, result)
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setTranslated('__NO_API_KEY__')
      } else {
        setTranslated(`Translation error: ${err.message}. Please try again.`)
      }
    } finally {
      setLoading(false)
    }
  }

  const translateImage = async () => {
    if (!imageFile) return
    setLoading(true)
    setImageResult('')
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1]
        try {
          const result = await translateImageWithClaude(base64, to)
          setImageResult(result)
        } catch (err) {
          setImageResult(`⚠️ ${err.message === 'NO_API_KEY' ? 'API key required for image translation.' : err.message}`)
        } finally {
          setLoading(false)
        }
      }
      reader.readAsDataURL(imageFile)
    } catch {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImageResult('')
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported in this browser. Try Chrome.'); return }
    if (listening && recognitionRef.current) { recognitionRef.current.stop(); return }
    const r = new SR()
    recognitionRef.current = r
    r.lang = from === 'ta' ? 'ta-IN' : from === 'hi' ? 'hi-IN' : from === 'ml' ? 'ml-IN' : from === 'te' ? 'te-IN' : 'en-IN'
    r.onstart = () => setListening(true)
    r.onend = () => setListening(false)
    r.onresult = e => setInputText(e.results[0][0].transcript)
    r.onerror = () => setListening(false)
    r.start()
  }

  const speakTranslated = () => {
    if (!translated) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(translated.replace(/\(.*?\)/g, ''))
    u.lang = to === 'ta' ? 'ta-IN' : to === 'hi' ? 'hi-IN' : to === 'ml' ? 'ml-IN' : to === 'te' ? 'te-IN' : 'en-IN'
    u.rate = 0.85
    window.speechSynthesis.speak(u)
  }

  const swap = () => {
    setFrom(to); setTo(from)
    setInputText(translated); setTranslated(inputText)
  }

  const copy = () => {
    if (!translated) return
    navigator.clipboard.writeText(translated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fromLang = LANGUAGES.find(l => l.code === from)
  const toLang = LANGUAGES.find(l => l.code === to)

  const MODES = [
    { id: 'text', label: 'Text', icon: Globe },
    { id: 'image', label: 'Image OCR', icon: Camera },
    { id: 'phrasebook', label: 'Phrasebook', icon: BookOpen },
    { id: 'history', label: 'History', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-slate-950 pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/30">🌐</div>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Travel Translator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">AI-powered · {LANGUAGES.length} languages · Tamil specialist · Voice input & output</p>
            </div>
          </div>
        </motion.div>

        {/* Mode Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {MODES.map(m => {
            const Icon = m.icon
            return (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all border ${mode === m.id
                  ? 'bg-teal-600 border-teal-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-300'}`}>
                <Icon className="w-4 h-4" />{m.label}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">

          {/* ── TEXT MODE ── */}
          {mode === 'text' && (
            <motion.div key="text" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

              {/* Language Row */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 mb-5">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">From</div>
                  <select value={from} onChange={e => setFrom(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-200 text-sm">
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
                  </select>
                </div>
                <button onClick={swap} className="w-11 h-11 mb-0.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-300 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all">
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">To</div>
                  <select value={to} onChange={e => setTo(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-200 text-sm">
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Quick phrases */}
              <div className="mb-4">
                <div className="text-xs font-bold text-slate-400 mb-2">Quick phrases:</div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PHRASES.map(p => (
                    <button key={p} onClick={() => setInputText(p.split(' ').slice(1).join(' '))}
                      className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-teal-900/30 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 hover:border-teal-300 transition-all">
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input + Output */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-slate-500">{fromLang?.flag} {fromLang?.label}</div>
                    <div className="flex gap-1">
                      <button onClick={startVoice}
                        className={`p-1.5 rounded-lg transition ${listening ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20'}`}
                        title={listening ? 'Stop' : 'Voice input'}>
                        {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setInputText(''); setTranslated('') }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <textarea value={inputText} onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.ctrlKey && e.key === 'Enter' && translate()}
                    placeholder='Type or say text to translate… e.g. "Where is the temple?"'
                    className="w-full min-h-[160px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 resize-none" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-teal-600 dark:text-teal-400">{toLang?.flag} {toLang?.label}</div>
                    <div className="flex gap-1">
                      <button onClick={speakTranslated} disabled={!translated}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition disabled:opacity-40">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button onClick={copy} disabled={!translated}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition disabled:opacity-40">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="w-full min-h-[160px] rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 px-4 py-3 text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                    {loading ? (
                      <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                        <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                        Translating…
                      </div>
                    ) : translated === '__NO_API_KEY__' ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4">
                          <span className="text-2xl shrink-0">🔑</span>
                          <div>
                            <div className="font-black text-blue-800 dark:text-blue-300 text-sm mb-1">API Key Required for AI Translation</div>
                            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                              To enable live translation, add your Anthropic API key to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code>:<br />
                              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded mt-1 inline-block">VITE_CLAUDE_API_KEY=sk-ant-...</code>
                            </p>
                          </div>
                        </div>
                        <button onClick={() => setMode('phrasebook')}
                          className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline text-left">
                          📖 Use Phrasebook for 100+ offline Tamil phrases →
                        </button>
                      </div>
                    ) : translated ? (
                      <span>{translated}</span>
                    ) : (
                      <span className="text-slate-400 italic">Translation will appear here…</span>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={translate} disabled={loading || !inputText.trim()}
                className="mt-5 w-full md:w-auto rounded-2xl px-10 py-3.5 font-black text-white disabled:opacity-50 transition-all shadow-lg hover:shadow-teal-500/30"
                style={{ background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)' }}>
                {loading ? 'Translating…' : '🌐 Translate with AI'}
              </button>
              <p className="mt-2 text-xs text-slate-400">Powered by Claude AI · Ctrl+Enter to translate</p>
            </motion.div>
          )}

          {/* ── IMAGE OCR MODE ── */}
          {mode === 'image' && (
            <motion.div key="image" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h2 className="font-black text-slate-900 dark:text-white mb-1">Image OCR Translation</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Upload a menu, sign, or board — AI extracts and translates the text</p>

              {/* Upload area */}
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-2xl p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all">
                {imagePreview ? (
                  <img src={imagePreview} alt="Upload" className="max-h-48 mx-auto rounded-xl object-contain" />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-teal-400 mx-auto mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">Click to upload image</p>
                    <p className="text-xs text-slate-400 mt-1">Supports: menus, signs, temple boards, product labels</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              {/* Target language */}
              <div className="mt-4 flex gap-3 items-end">
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Translate to</div>
                  <select value={to} onChange={e => setTo(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-200 text-sm">
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
                  </select>
                </div>
                <button onClick={translateImage} disabled={loading || !imageFile}
                  className="px-6 py-3 rounded-2xl font-black text-white disabled:opacity-50 transition-all shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)' }}>
                  {loading ? 'Analysing…' : '🔍 Extract & Translate'}
                </button>
              </div>

              {imageResult && (
                <div className="mt-5 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 p-4">
                  <div className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-2">Extracted & Translated Text:</div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{imageResult}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── PHRASEBOOK MODE ── */}
          {mode === 'phrasebook' && (
            <motion.div key="phrases" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h2 className="font-black text-slate-900 dark:text-white mb-1">Tamil Travel Phrasebook</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">100 essential Tamil phrases with pronunciation — works offline</p>

              <div className="flex gap-2 flex-wrap mb-5">
                {Object.keys(PHRASEBOOK).map(cat => (
                  <button key={cat} onClick={() => setPhraseCategory(cat)}
                    className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${phraseCategory === cat
                      ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {PHRASEBOOK[phraseCategory].map((phrase, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:border-teal-300 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 dark:text-white">{phrase.en}</div>
                        <div className="text-teal-700 dark:text-teal-300 font-black mt-1">{phrase.ta}</div>
                        <div className="text-xs text-slate-400 mt-0.5 italic">{phrase.romanized}</div>
                      </div>
                      <button onClick={() => { const u = new SpeechSynthesisUtterance(phrase.ta); u.lang = 'ta-IN'; u.rate = 0.7; window.speechSynthesis.speak(u) }}
                        className="p-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 transition shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── HISTORY MODE ── */}
          {mode === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-slate-900 dark:text-white">Translation History</h2>
                <button onClick={() => { setHistory([]); localStorage.removeItem('voyager_translate_history') }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 transition">Clear All</button>
              </div>
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No translations yet. Start translating!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((h, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <span>{LANGUAGES.find(l => l.code === h.from)?.flag}</span>
                        <span>→</span>
                        <span>{LANGUAGES.find(l => l.code === h.to)?.flag}</span>
                        <span className="ml-auto">{h.time}</span>
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-300">{h.orig}</div>
                      <div className="text-sm font-bold text-teal-700 dark:text-teal-300 mt-1">{h.trans}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

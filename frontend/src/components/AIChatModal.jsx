import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { aiAPI } from '../services/api'
import toast from 'react-hot-toast'

const AIChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'assistant', 
      content: '👋 Hi! I\'m your Chennai travel expert. How can I help you today?',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => 'session_' + Date.now())
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await aiAPI.askQuestion({
        question: input,
        session_id: sessionId
      })
      
      if (response.success) {
        const assistantMessage = {
          id: messages.length + 2,
          type: 'assistant',
          content: response.answer,
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        toast.error('Error getting response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  const handleClearChat = async () => {
    try {
      await aiAPI.clearSession({ session_id: sessionId })
      setMessages([
        { 
          id: 1, 
          type: 'assistant', 
          content: '👋 Chat cleared! How can I help you with Chennai travel?',
        }
      ])
      toast.success('Chat history cleared')
    } catch (error) {
      console.error('Error clearing chat:', error)
    }
  }

  const quickQuestions = [
    "Marina Beach timings",
    "Mahabalipuram entry fee",
    "Best restaurants in T Nagar",
    "How to reach Mahabalipuram?",
    "Kapaleeshwarar Temple timings",
    "Budget for 3 days in Chennai"
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-highlight rounded-full flex items-center justify-center mr-3">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">Chennai Travel Expert</h2>
                  <p className="text-xs text-gray-500">Powered by GROQ • Real-time answers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearChat}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Clear chat"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${
                      message.type === 'user'
                        ? 'bg-accent text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-4 py-2 border-t dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Chennai travel..."
                  className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 transition"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AIChatModal
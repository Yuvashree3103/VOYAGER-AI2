import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  PaperAirplaneIcon,
  UsersIcon,
  UserCircleIcon,
  PhoneIcon,
  VideoCameraIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'
import AnimatedCard from '../components/AnimatedCard'

const GroupChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Sandhiya',
      content: 'Hi everyone! Excited for the Chennai trip!',
      time: '10:30 AM',
      avatar: '👨',
      travelerType: 'local'
    },
    {
      id: 2,
      user: 'Priya',
      content: 'Same here! Has anyone booked hotels yet?',
      time: '10:32 AM',
      avatar: '👩',
      travelerType: 'traveler'
    },
    {
      id: 3,
      user: 'Arjun (Local Guide)',
      content: 'I recommend hotels near Egmore - good connectivity!',
      time: '10:35 AM',
      avatar: '🧑‍🏫',
      travelerType: 'local',
      isVerified: true
    }
  ])
  
  const [input, setInput] = useState('')
  const [onlineUsers] = useState([
    { name: 'Sandhiya', type: 'traveler', avatar: '👨' },
    { name: 'Priya', type: 'traveler', avatar: '👩' },
    { name: 'Arjun (Local Guide)', type: 'local', avatar: '🧑‍🏫', verified: true },
    { name: 'Yuva', type: 'traveler', avatar: '👩‍🦰' },
    { name: 'You', type: 'traveler', avatar: '👤' }
  ])
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage = {
      id: messages.length + 1,
      user: 'You',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '👤',
      travelerType: 'traveler'
    }

    setMessages([...messages, newMessage])
    setInput('')
  }

  const handleSwapUser = (index) => {
    // Swap user with another random user (for demo)
    const otherUsers = onlineUsers.filter(u => u.name !== messages[index].user)
    if (otherUsers.length > 0) {
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)]
      
      setMessages(prev => prev.map((msg, i) => 
        i === index ? { 
          ...msg, 
          user: randomUser.name,
          avatar: randomUser.avatar,
          travelerType: randomUser.type,
          isVerified: randomUser.verified
        } : msg
      ))
    }
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
            <UsersIcon className="w-8 h-8 mr-3 text-accent" />
            Group Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Chat with travelers and local guides
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-gray-500">{onlineUsers.length} online</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Online Users Sidebar */}
        <div className="lg:col-span-1">
          <AnimatedCard className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <UsersIcon className="w-4 h-4 mr-2" />
              Online Travelers
            </h3>
            <div className="space-y-2">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{user.avatar}</span>
                    <div>
                      <span className="text-sm">{user.name}</span>
                      {user.verified && (
                        <span className="ml-1 text-xs bg-green-500 text-white px-1 rounded">✓ Guide</span>
                      )}
                      <p className="text-xs text-gray-500">{user.type}</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <AnimatedCard className="p-0 flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-3">
                  CT
                </div>
                <div>
                  <h3 className="font-semibold">Chennai Trip 2026</h3>
                  <p className="text-xs text-gray-500">
                    {onlineUsers.filter(u => u.type === 'traveler').length} travelers • 
                    {onlineUsers.filter(u => u.type === 'local').length} local guides
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <PhoneIcon className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <VideoCameraIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.user !== 'You' && (
                    <div className="flex-shrink-0 mr-2">
                      <span className="text-2xl">{msg.avatar}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] ${
                      msg.user === 'You'
                        ? 'bg-accent text-white'
                        : msg.travelerType === 'local'
                        ? 'bg-green-100 dark:bg-green-900/20 text-gray-800 dark:text-gray-200'
                        : 'bg-gray-100 dark:bg-gray-700'
                    } rounded-2xl px-4 py-2`}
                  >
                    {msg.user !== 'You' && (
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold">
                          {msg.user}
                          {msg.isVerified && (
                            <span className="ml-1 text-xs bg-green-500 text-white px-1 rounded">✓</span>
                          )}
                        </p>
                        <button
                          onClick={() => handleSwapUser(idx)}
                          className="ml-2 p-1 hover:bg-black/10 rounded-full"
                          title="Swap user"
                        >
                          <ArrowsRightLeftIcon className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Travel Tips */}
            <div className="px-4 py-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-accent/20 px-2 py-1 rounded-full">💡 Metro: ₹50/day pass</span>
                <span className="text-xs bg-accent/20 px-2 py-1 rounded-full">🍛 Murugan Idli: ₹100</span>
                <span className="text-xs bg-accent/20 px-2 py-1 rounded-full">🚕 Ola/Uber available</span>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Chennai travel, share tips..."
                  className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}

export default GroupChat
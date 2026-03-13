import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PhotoIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  TrashIcon,
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  XMarkIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import AnimatedCard from '../components/AnimatedCard'
import toast from 'react-hot-toast'

const Journal = () => {
  const userId = (() => {
    const key = 'voyagerai_user_id'
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const id = `guest_${Math.random().toString(16).slice(2)}`
    localStorage.setItem(key, id)
    return id
  })()
  const [entries, setEntries] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [filter, setFilter] = useState('all') // all, photos, videos, voice, notes
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])
  
  const [newEntry, setNewEntry] = useState({
    type: 'note', // photo, video, voice, note
    title: '',
    content: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    images: [],
    videoUrl: '',
    audioUrl: '',
    favorite: false,
    tags: []
  })

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(`journal_${userId}`)
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [userId])

  // Save entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(`journal_${userId}`, JSON.stringify(entries))
    }
  }, [entries, userId])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setNewEntry({
      ...newEntry,
      type: 'photo',
      images: [...newEntry.images, ...imageUrls]
    })
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const videoUrl = URL.createObjectURL(file)
      setNewEntry({
        ...newEntry,
        type: 'video',
        videoUrl
      })
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        setNewEntry({
          ...newEntry,
          type: 'voice',
          audioUrl
        })
      }
      
      mediaRecorder.current.start()
      setRecording(true)
      toast.success('Recording started...')
    } catch (error) {
      console.error('Recording error:', error)
      toast.error('Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      setRecording(false)
      toast.success('Recording saved!')
    }
  }

  const saveEntry = () => {
    if (!newEntry.title && newEntry.type !== 'photo') {
      toast.error('Please add a title')
      return
    }
    
    const entry = {
      ...newEntry,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userId: user?.id
    }
    
    setEntries([entry, ...entries])
    setShowAddModal(false)
    resetNewEntry()
    toast.success('Journal entry added!')
  }

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id))
    toast.success('Entry deleted')
  }

  const toggleFavorite = (id) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
    ))
  }

  const resetNewEntry = () => {
    setNewEntry({
      type: 'note',
      title: '',
      content: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      images: [],
      videoUrl: '',
      audioUrl: '',
      favorite: false,
      tags: []
    })
    setAudioURL(null)
  }

  const getEntryIcon = (type) => {
    switch(type) {
      case 'photo': return <PhotoIcon className="w-5 h-5" />
      case 'video': return <VideoCameraIcon className="w-5 h-5" />
      case 'voice': return <MicrophoneIcon className="w-5 h-5" />
      default: return <DocumentTextIcon className="w-5 h-5" />
    }
  }

  const filteredEntries = entries.filter(entry => 
    filter === 'all' || entry.type === filter
  )

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Travel Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Capture and remember your Chennai memories
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 flex items-center"
        >
          <PhotoIcon className="w-5 h-5 mr-2" />
          New Entry
        </button>
      </motion.div>

      {/* Filters and View Toggle */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-2">
          {['all', 'photo', 'video', 'voice', 'note'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === type
                  ? 'bg-accent text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {type === 'all' ? 'All' : type + 's'}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            ≡
          </button>
        </div>
      </div>

      {/* Entries Grid/List */}
      {filteredEntries.length === 0 ? (
        <AnimatedCard className="p-12 text-center">
          <PhotoIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No journal entries yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start capturing your Chennai memories!
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-block"
          >
            Create First Entry
          </button>
        </AnimatedCard>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AnimatedCard className="overflow-hidden">
                {entry.type === 'photo' && entry.images.length > 0 && (
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={entry.images[0]} 
                      alt={entry.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {entry.type === 'video' && entry.videoUrl && (
                  <video 
                    src={entry.videoUrl} 
                    controls 
                    className="w-full h-48 object-cover"
                  />
                )}
                
                {entry.type === 'voice' && entry.audioUrl && (
                  <div className="p-4 bg-gray-100 dark:bg-gray-800">
                    <audio src={entry.audioUrl} controls className="w-full" />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      {getEntryIcon(entry.type)}
                      <h3 className="font-semibold ml-2">{entry.title || 'Untitled'}</h3>
                    </div>
                    <button onClick={() => toggleFavorite(entry.id)}>
                      {entry.favorite ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {entry.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {entry.content}
                    </p>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 space-x-3">
                    {entry.location && (
                      <span className="flex items-center">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        {entry.location}
                      </span>
                    )}
                    <span className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {entry.images.length > 1 && (
                    <div className="mt-2 flex space-x-1">
                      {entry.images.slice(1, 4).map((img, i) => (
                        <div key={i} className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {entry.images.length > 4 && (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                          +{entry.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="p-1 text-gray-500 hover:text-accent"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-1 text-gray-500 hover:text-red-500"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Add Journal Entry</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Entry Type Selector */}
                <div className="flex space-x-2 mb-4">
                  {['note', 'photo', 'video', 'voice'].map(type => (
                    <button
                      key={type}
                      onClick={() => setNewEntry({...newEntry, type})}
                      className={`flex-1 py-2 rounded-lg capitalize flex items-center justify-center ${
                        newEntry.type === type
                          ? 'bg-accent text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {type === 'note' && <DocumentTextIcon className="w-4 h-4 mr-1" />}
                      {type === 'photo' && <PhotoIcon className="w-4 h-4 mr-1" />}
                      {type === 'video' && <VideoCameraIcon className="w-4 h-4 mr-1" />}
                      {type === 'voice' && <MicrophoneIcon className="w-4 h-4 mr-1" />}
                      {type}
                    </button>
                  ))}
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />

                  {newEntry.type === 'note' && (
                    <textarea
                      placeholder="Write your notes..."
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                      rows="4"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  )}

                  {newEntry.type === 'photo' && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full"
                      />
                      {newEntry.images.length > 0 && (
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {newEntry.images.map((img, i) => (
                            <img key={i} src={img} className="w-full h-20 object-cover rounded" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {newEntry.type === 'video' && (
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="w-full"
                    />
                  )}

                  {newEntry.type === 'voice' && (
                    <div className="text-center p-4 border-2 border-dashed rounded-lg">
                      {!recording ? (
                        <button
                          onClick={startRecording}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Start Recording
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Stop Recording
                        </button>
                      )}
                      {audioURL && (
                        <audio src={audioURL} controls className="w-full mt-2" />
                      )}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={newEntry.location}
                    onChange={(e) => setNewEntry({...newEntry, location: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />

                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEntry}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Journal

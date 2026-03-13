import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  SunIcon,
  CloudIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { servicesAPI } from '../services/api'
import AnimatedCard from '../components/AnimatedCard'
import toast from 'react-hot-toast'

const Checklist = () => {
  const [checklist, setChecklist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customItems, setCustomItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [filters, setFilters] = useState({
    travel_type: 'Solo',
    duration: 2,
    season: 'Winter'
  })

  useEffect(() => {
    loadChecklist()
  }, [filters])

  const loadChecklist = async () => {
    setLoading(true)
    try {
      // Try to get from API, if fails use default
      try {
        const response = await servicesAPI.getChecklist(
          filters.travel_type,
          filters.duration,
          filters.season
        )
        setChecklist(response.checklist || response)
      } catch (error) {
        console.log('Using default checklist')
        setChecklist(getDefaultChecklist())
      }
    } catch (error) {
      console.error('Error loading checklist:', error)
      setChecklist(getDefaultChecklist())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultChecklist = () => {
    return {
      essential: [
        { item: 'Smartphone with charger', checked: false, category: 'essential' },
        { item: 'Power bank', checked: false, category: 'essential' },
        { item: 'Government ID (Aadhar/PAN/Passport)', checked: false, category: 'essential' },
        { item: 'Prescription medicines', checked: false, category: 'essential' },
        { item: 'First aid kit', checked: false, category: 'essential' },
        { item: 'Water bottle', checked: false, category: 'essential' },
        { item: 'Hand sanitizer', checked: false, category: 'essential' },
        { item: 'Face masks', checked: false, category: 'essential' }
      ],
      weather_based: [
        { item: 'Sunscreen (SPF 50+)', checked: false, category: 'weather' },
        { item: 'Sun hat / Cap', checked: false, category: 'weather' },
        { item: 'Sunglasses', checked: false, category: 'weather' },
        { item: 'Umbrella', checked: false, category: 'weather' }
      ],
      optional: [
        { item: 'Camera', checked: false, category: 'optional' },
        { item: 'Travel adapter', checked: false, category: 'optional' },
        { item: 'Snacks', checked: false, category: 'optional' },
        { item: 'Travel pillow', checked: false, category: 'optional' }
      ],
      documents: [
        { item: 'Hotel booking confirmation', checked: false, category: 'documents' },
        { item: 'Train/flight tickets', checked: false, category: 'documents' },
        { item: 'Attraction entry tickets', checked: false, category: 'documents' },
        { item: 'Emergency contacts list', checked: false, category: 'documents' }
      ]
    }
  }

  const toggleItem = (category, index) => {
    setChecklist(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      )
    }))
  }

  const addCustomItem = () => {
    if (newItem.trim()) {
      setCustomItems(prev => [
        ...prev,
        { item: newItem, checked: false, category: 'custom' }
      ])
      setNewItem('')
      toast.success('Item added to checklist')
    }
  }

  const removeCustomItem = (index) => {
    setCustomItems(prev => prev.filter((_, i) => i !== index))
    toast.success('Item removed')
  }

  const getProgress = () => {
    if (!checklist) return 0
    
    const allItems = [
      ...(checklist.essential || []),
      ...(checklist.weather_based || []),
      ...(checklist.optional || []),
      ...(checklist.documents || []),
      ...customItems
    ]
    
    const checked = allItems.filter(item => item.checked).length
    return allItems.length > 0 ? (checked / allItems.length) * 100 : 0
  }

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'essential': return '⭐'
      case 'weather_based': return '🌤️'
      case 'optional': return '✨'
      case 'documents': return '📄'
      default: return '📋'
    }
  }

  const getCategoryTitle = (category) => {
    switch(category) {
      case 'essential': return 'Essential Items'
      case 'weather_based': return 'Weather Based'
      case 'optional': return 'Optional Items'
      case 'documents': return 'Documents'
      default: return category
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Smart Travel Checklist
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Personalized checklist for your Chennai trip
        </p>
      </motion.div>

      {/* Filters */}
      <AnimatedCard className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <UserGroupIcon className="w-4 h-4 inline mr-1" />
              Travel Type
            </label>
            <select
              value={filters.travel_type}
              onChange={(e) => setFilters({...filters, travel_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="Solo">Solo</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Couple">Couple</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <SunIcon className="w-4 h-4 inline mr-1" />
              Duration (Days)
            </label>
            <input
              type="number"
              value={filters.duration}
              onChange={(e) => setFilters({...filters, duration: parseInt(e.target.value)})}
              min="1"
              max="7"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <CloudIcon className="w-4 h-4 inline mr-1" />
              Season
            </label>
            <select
              value={filters.season}
              onChange={(e) => setFilters({...filters, season: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="Summer">Summer</option>
              <option value="Monsoon">Monsoon</option>
              <option value="Winter">Winter</option>
            </select>
          </div>
        </div>
      </AnimatedCard>

      {/* Progress Bar */}
      <AnimatedCard className="p-6 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Packing Progress
          </span>
          <span className="text-sm font-medium text-accent">
            {Math.round(getProgress())}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            className="bg-accent h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </AnimatedCard>

      {/* Checklist Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {checklist && Object.keys(checklist).map((category) => (
          <ChecklistCategory
            key={category}
            title={getCategoryTitle(category)}
            items={checklist[category]}
            icon={getCategoryIcon(category)}
            onToggle={(index) => toggleItem(category, index)}
          />
        ))}

        {/* Custom Items */}
        <AnimatedCard className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <PlusCircleIcon className="w-5 h-5 mr-2 text-accent" />
            Custom Items
          </h2>

          <div className="flex mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add your own item..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800"
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            />
            <button
              onClick={addCustomItem}
              className="px-4 py-2 bg-accent text-white rounded-r-lg hover:bg-accent/90"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {customItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center flex-1">
                  <button
                    onClick={() => {
                      const newItems = [...customItems]
                      newItems[index].checked = !newItems[index].checked
                      setCustomItems(newItems)
                    }}
                    className="mr-3"
                  >
                    {item.checked ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded" />
                    )}
                  </button>
                  <span className={item.checked ? 'line-through text-gray-400' : ''}>
                    {item.item}
                  </span>
                </div>
                <button
                  onClick={() => removeCustomItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
            {customItems.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No custom items added yet
              </p>
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  )
}

const ChecklistCategory = ({ title, items, icon, onToggle }) => (
  <AnimatedCard className="p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <span className="mr-2">{icon}</span>
      {title}
    </h2>
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
          onClick={() => onToggle(index)}
        >
          <button className="mr-3">
            {item.checked ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded" />
            )}
          </button>
          <span className={item.checked ? 'line-through text-gray-400' : ''}>
            {item.item}
          </span>
        </motion.div>
      ))}
    </div>
  </AnimatedCard>
)

export default Checklist
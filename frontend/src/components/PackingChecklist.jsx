import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, CircleStackIcon, 
  SunIcon, CloudIcon, MapPinIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

const PackingChecklist = ({ location, categories = [] }) => {
  const [items, setItems] = useState([])
  const [progress, setProgress] = useState(0)

  // Location-specific essentials data
  const essentialsData = {
    temple: {
      icon: '🛕',
      items: [
        { id: 'modest', name: '👔 Modest clothing (shoulders/knees covered)', category: 'temple' },
        { id: 'footwear', name: '👟 Bag for shoes', category: 'temple' },
        { id: 'socks', name: '🧦 Extra socks', category: 'temple' },
        { id: 'offerings', name: '💰 Offerings (₹10-50)', category: 'temple' }
      ]
    },
    beach: {
      icon: '🏖️',
      items: [
        { id: 'sunscreen', name: '🧴 Sunscreen SPF 50+', category: 'beach' },
        { id: 'sunglasses', name: '🕶️ Sunglasses', category: 'beach' },
        { id: 'hat', name: '👒 Hat', category: 'beach' },
        { id: 'flipflops', name: '🩴 Flip-flops', category: 'beach' },
        { id: 'towel', name: '🧻 Beach towel', category: 'beach' }
      ]
    },
    shopping: {
      icon: '🛍️',
      items: [
        { id: 'bags', name: '🛍️ Shopping bags', category: 'shopping' },
        { id: 'cards', name: '💳 Multiple payment options', category: 'shopping' },
        { id: 'list', name: '📝 Shopping list', category: 'shopping' }
      ]
    },
    food: {
      icon: '🍛',
      items: [
        { id: 'digestive', name: '💊 Digestive enzymes', category: 'food' },
        { id: 'wipes', name: '🧻 Wet wipes', category: 'food' },
        { id: 'small_change', name: '💰 Small change', category: 'food' }
      ]
    },
    universal: {
      icon: '✅',
      items: [
        { id: 'id', name: '🪪 Valid ID', category: 'universal' },
        { id: 'phone', name: '📱 Smartphone', category: 'universal' },
        { id: 'powerbank', name: '🔋 Power bank', category: 'universal' },
        { id: 'water', name: '💧 Water bottle', category: 'universal' },
        { id: 'sanitizer', name: '🧴 Hand sanitizer', category: 'universal' },
        { id: 'cash', name: '💰 Cash (₹1000-2000)', category: 'universal' },
        { id: 'medicines', name: '💊 Basic medicines', category: 'universal' }
      ]
    }
  }

  useEffect(() => {
    // Combine items based on categories
    let allItems = []
    const seenIds = new Set()

    // Always add universal items
    essentialsData.universal.items.forEach(item => {
      allItems.push({ ...item, checked: false })
      seenIds.add(item.id)
    })

    // Add category-specific items
    categories.forEach(cat => {
      if (essentialsData[cat]) {
        essentialsData[cat].items.forEach(item => {
          if (!seenIds.has(item.id)) {
            allItems.push({ ...item, checked: false })
            seenIds.add(item.id)
          }
        })
      }
    })

    setItems(allItems)
  }, [categories])

  useEffect(() => {
    const checkedCount = items.filter(item => item.checked).length
    const totalCount = items.length
    setProgress(totalCount > 0 ? (checkedCount / totalCount) * 100 : 0)
  }, [items])

  const toggleItem = (index) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ))
  }

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'temple': return '🛕'
      case 'beach': return '🏖️'
      case 'shopping': return '🛍️'
      case 'food': return '🍛'
      default: return '✅'
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Packing Progress</span>
          <span className="font-semibold text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            className="bg-accent h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Location Badge */}
      {location && (
        <div className="mb-4 p-3 bg-accent/10 rounded-lg flex items-center">
          <MapPinIcon className="w-5 h-5 mr-2 text-accent" />
          <span className="text-sm">Packing for <span className="font-semibold">{location}</span></span>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
            onClick={() => toggleItem(index)}
          >
            <button className="mr-3">
              {item.checked ? (
                <CheckCircleSolid className="w-5 h-5 text-green-500" />
              ) : (
                <CircleStackIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400' : ''}`}>
              {item.name}
            </span>
            <span className="text-xs text-gray-400 ml-2">{getCategoryIcon(item.category)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PackingChecklist
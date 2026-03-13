import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BanknotesIcon, PlusCircleIcon, TrashIcon,
  HomeIcon, CakeIcon, TruckIcon, TicketIcon,
  CheckCircleIcon, XCircleIcon, ChartBarIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

const ExpenseTracker = ({ budget, expenseTemplate, onClose }) => {
  const [expenses, setExpenses] = useState(expenseTemplate || {
    total_budget: budget?.total || 0,
    remaining: budget?.total || 0,
    categories: {
      hotel: { allocated: budget?.hotel || 0, spent: 0, remaining: budget?.hotel || 0, items: [] },
      food: { allocated: budget?.food || 0, spent: 0, remaining: budget?.food || 0, items: [] },
      transport: { allocated: budget?.transport || 0, spent: 0, remaining: budget?.transport || 0, items: [] },
      attractions: { allocated: budget?.attractions || 0, spent: 0, remaining: budget?.attractions || 0, items: [] }
    }
  })

  const [newExpense, setNewExpense] = useState({
    category: 'hotel',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  const [showAddForm, setShowAddForm] = useState(false)

  // Calculate progress percentage
  const totalSpent = Object.values(expenses.categories).reduce((sum, cat) => sum + cat.spent, 0)
  const totalBudget = expenses.total_budget
  const progressPercentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0

  const categoryIcons = {
    hotel: <HomeIcon className="w-5 h-5" />,
    food: <CakeIcon className="w-5 h-5" />,
    transport: <TruckIcon className="w-5 h-5" />,
    attractions: <TicketIcon className="w-5 h-5" />
  }

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill all fields')
      return
    }

    const amount = parseFloat(newExpense.amount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter valid amount')
      return
    }

    setExpenses(prev => {
      const category = prev.categories[newExpense.category]
      const newSpent = category.spent + amount
      
      // Check if exceeds category budget
      if (newSpent > category.allocated) {
        alert(`⚠️ Warning: This exceeds ${newExpense.category} budget by ₹${newSpent - category.allocated}`)
      }

      const newItem = {
        id: Date.now(),
        description: newExpense.description,
        amount: amount,
        date: newExpense.date
      }

      const updatedCategories = {
        ...prev.categories,
        [newExpense.category]: {
          ...category,
          spent: newSpent,
          remaining: category.allocated - newSpent,
          items: [newItem, ...category.items]
        }
      }

      const totalSpent = Object.values(updatedCategories).reduce((sum, cat) => sum + cat.spent, 0)

      return {
        ...prev,
        remaining: prev.total_budget - totalSpent,
        categories: updatedCategories
      }
    })

    setNewExpense({
      category: 'hotel',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowAddForm(false)
  }

  const deleteExpense = (category, itemId) => {
    setExpenses(prev => {
      const categoryData = prev.categories[category]
      const itemToDelete = categoryData.items.find(item => item.id === itemId)
      
      if (!itemToDelete) return prev

      const updatedItems = categoryData.items.filter(item => item.id !== itemId)
      const newSpent = categoryData.spent - itemToDelete.amount

      const updatedCategories = {
        ...prev.categories,
        [category]: {
          ...categoryData,
          spent: newSpent,
          remaining: categoryData.allocated - newSpent,
          items: updatedItems
        }
      }

      const totalSpent = Object.values(updatedCategories).reduce((sum, cat) => sum + cat.spent, 0)

      return {
        ...prev,
        remaining: prev.total_budget - totalSpent,
        categories: updatedCategories
      }
    })
  }

  const getProgressColor = (spent, allocated) => {
    const percentage = (spent / allocated) * 100
    if (percentage > 100) return 'bg-red-500'
    if (percentage > 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <BanknotesIcon className="w-6 h-6 mr-2 text-accent" />
            Expense Tracker
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Overall Budget Progress */}
          <div className="mb-8 p-6 bg-gradient-to-r from-accent to-highlight text-white rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg opacity-90">Total Budget</span>
              <span className="text-3xl font-bold">₹{totalBudget}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg opacity-90">Spent</span>
              <span className="text-2xl font-bold">₹{totalSpent}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg opacity-90">Remaining</span>
              <span className={`text-2xl font-bold ${expenses.remaining < 0 ? 'text-red-300' : 'text-white'}`}>
                ₹{expenses.remaining}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${
                    progressPercentage > 100 ? 'bg-red-500' : 'bg-white'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category-wise Budget */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(expenses.categories).map(([key, cat]) => {
              const catProgress = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0
              
              return (
                <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    {categoryIcons[key]}
                    <span className="ml-2 font-medium capitalize">{key}</span>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Budget</span>
                      <span className="font-semibold">₹{cat.allocated}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Spent</span>
                      <span className="font-semibold">₹{cat.spent}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Left</span>
                      <span className={`font-semibold ${cat.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ₹{cat.remaining}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressColor(cat.spent, cat.allocated)} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.min(catProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add Expense Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="mb-6 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 flex items-center"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add Expense
          </button>

          {/* Add Expense Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                    >
                      <option value="hotel">Hotel</option>
                      <option value="food">Food</option>
                      <option value="transport">Transport</option>
                      <option value="attractions">Attractions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                      placeholder="e.g., Hotel booking, Lunch at Murugan..."
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      placeholder="1000"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addExpense}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expense List */}
          <h3 className="text-lg font-semibold mb-4">Expense History</h3>
          <div className="space-y-4">
            {Object.entries(expenses.categories).map(([category, cat]) => (
              cat.items.length > 0 && (
                <div key={category} className="border-l-4 border-accent pl-4">
                  <h4 className="font-medium capitalize mb-2 flex items-center">
                    {categoryIcons[category]}
                    <span className="ml-2">{category} Expenses</span>
                  </h4>
                  <div className="space-y-2">
                    {cat.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold mr-4">₹{item.amount}</span>
                          <button
                            onClick={() => deleteExpense(category, item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExpenseTracker
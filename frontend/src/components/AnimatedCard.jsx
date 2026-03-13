import React from 'react'
import { motion } from 'framer-motion'

const AnimatedCard = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-xl rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

// 🔴 IMPORTANT: THIS MUST BE AT THE BOTTOM!
export default AnimatedCard
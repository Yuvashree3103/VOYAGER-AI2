import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SunIcon,
  CloudIcon,
  CloudArrowUpIcon,
  BeakerIcon,
  MapPinIcon,
  SparklesIcon,  // Changed from DropletIcon
  ArrowPathIcon  // Changed from WindIcon
} from '@heroicons/react/24/outline'
import { servicesAPI } from '../services/api'
import AnimatedCard from '../components/AnimatedCard'
import toast from 'react-hot-toast'

const Weather = () => {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadWeatherData()
    // Refresh every 30 minutes
    const interval = setInterval(loadWeatherData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadWeatherData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Try to get real weather from API
      const response = await servicesAPI.getWeather()
      console.log("Weather response:", response)
      
      if (response && response.weather) {
        setWeather(response.weather)
      } else {
        // Fallback to simulated data
        setWeather(getSimulatedWeather())
      }
      
      // Get 5-day forecast
      try {
        const forecastResponse = await servicesAPI.getWeatherForecast(5)
        if (forecastResponse && forecastResponse.forecasts) {
          setForecast(forecastResponse.forecasts)
        } else {
          setForecast(getSimulatedForecast())
        }
      } catch (e) {
        console.log("Using simulated forecast")
        setForecast(getSimulatedForecast())
      }
      
    } catch (error) {
      console.error('Weather API error:', error)
      setError('Could not fetch live weather. Showing simulated data.')
      setWeather(getSimulatedWeather())
      setForecast(getSimulatedForecast())
    } finally {
      setLoading(false)
    }
  }

  const getSimulatedWeather = () => {
    const hours = new Date().getHours()
    const isDay = hours > 6 && hours < 18
    
    return {
      temp: Math.floor(28 + Math.random() * 8),
      feels_like: Math.floor(30 + Math.random() * 5),
      humidity: Math.floor(65 + Math.random() * 15),
      description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      icon: isDay ? '01d' : '01n',
      wind_speed: Math.floor(5 + Math.random() * 15),
      city: 'Chennai',
      country: 'IN'
    }
  }

  const getSimulatedForecast = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date().getDay()
    const forecast = []
    
    for (let i = 1; i <= 5; i++) {
      const dayIndex = (today + i) % 7
      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        day: days[dayIndex],
        temperature: Math.floor(28 + Math.random() * 6),
        description: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
        icon: ['☀️', '⛅', '☁️'][Math.floor(Math.random() * 3)],
        humidity: Math.floor(60 + Math.random() * 20)
      })
    }
    return forecast
  }

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <SunIcon className="w-16 h-16 text-yellow-500" />,
      '01n': <MoonIcon className="w-16 h-16 text-gray-400" />,
      '02d': <CloudIcon className="w-16 h-16 text-gray-400" />,
      '02n': <CloudIcon className="w-16 h-16 text-gray-400" />,
      '03d': <CloudIcon className="w-16 h-16 text-gray-400" />,
      '03n': <CloudIcon className="w-16 h-16 text-gray-400" />,
      '04d': <CloudArrowUpIcon className="w-16 h-16 text-gray-500" />,
      '04n': <CloudArrowUpIcon className="w-16 h-16 text-gray-500" />,
      '09d': <CloudArrowUpIcon className="w-16 h-16 text-blue-400" />,
      '09n': <CloudArrowUpIcon className="w-16 h-16 text-blue-400" />,
      '10d': <CloudArrowUpIcon className="w-16 h-16 text-blue-500" />,
      '10n': <CloudArrowUpIcon className="w-16 h-16 text-blue-500" />,
    }
    return iconMap[iconCode] || <CloudIcon className="w-16 h-16 text-gray-400" />
  }

  const getWeatherSuggestions = (weather) => {
    if (!weather) return []
    
    const desc = weather.description?.toLowerCase() || ''
    const temp = weather.temp || 32
    
    if (desc.includes('rain')) {
      return [
        "🌧️ Visit indoor attractions like Express Avenue Mall",
        "☕ Enjoy filter coffee at local cafes",
        "🏛️ Explore museums and heritage sites",
        "🛍️ Go shopping at Phoenix Marketcity"
      ]
    } else if (temp > 35) {
      return [
        "🏖️ Visit beaches in the evening (after 4 PM)",
        "🛍️ Explore air-conditioned malls",
        "💧 Stay hydrated - carry water bottle",
        "🌅 Start sightseeing early morning"
      ]
    } else {
      return [
        "🌤️ Perfect weather for outdoor exploration",
        "📸 Great for photography at Marina Beach",
        "🚶 Enjoy walking tours in Mylapore",
        "🍛 Try local South Indian food"
      ]
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="loader mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Fetching Chennai weather...</p>
        </div>
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
          <SunIcon className="w-8 h-8 mr-3 text-yellow-500" />
          Chennai Weather
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Real-time weather updates and 5-day forecast
        </p>
        {error && (
          <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
            ⚠️ {error}
          </p>
        )}
      </motion.div>

      {weather && (
        <>
          {/* Current Weather Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Location and Temperature */}
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start mb-2">
                    <MapPinIcon className="w-5 h-5 mr-1" />
                    <h2 className="text-2xl font-semibold">
                      {weather.city}, {weather.country}
                    </h2>
                  </div>
                  <div className="flex items-center">
                    {getWeatherIcon(weather.icon)}
                    <div className="ml-4">
                      <div className="text-6xl font-bold">
                        {Math.round(weather.temp)}°C
                      </div>
                      <div className="text-xl capitalize mt-1">
                        {weather.description}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <SparklesIcon className="w-6 h-6 mx-auto mb-1 opacity-80" />
                    <div className="text-2xl font-semibold">
                      {weather.humidity}%
                    </div>
                    <div className="text-sm opacity-80">Humidity</div>
                  </div>
                  <div className="text-center">
                    <ArrowPathIcon className="w-6 h-6 mx-auto mb-1 opacity-80" />
                    <div className="text-2xl font-semibold">
                      {Math.round(weather.wind_speed)} km/h
                    </div>
                    <div className="text-sm opacity-80">Wind Speed</div>
                  </div>
                  <div className="text-center col-span-2">
                    <div className="text-lg">
                      Feels like {Math.round(weather.feels_like)}°C
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weather Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <AnimatedCard className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-amber-700 dark:text-amber-400">
                <BeakerIcon className="w-5 h-5 mr-2" />
                Weather-Based Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getWeatherSuggestions(weather).map((suggestion, index) => (
                  <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    {suggestion}
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </motion.div>

          {/* 5-Day Forecast */}
          {forecast && forecast.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                5-Day Forecast
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {forecast.map((day, index) => (
                  <AnimatedCard key={index} className="p-4 text-center" delay={0.1 * index}>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{day.day}</p>
                    <div className="text-3xl my-2">{day.icon || '☀️'}</div>
                    <p className="text-xl font-semibold text-accent">{day.temperature}°C</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {day.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Humidity: {day.humidity}%</p>
                  </AnimatedCard>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

// Add MoonIcon for night mode
const MoonIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
)

export default Weather
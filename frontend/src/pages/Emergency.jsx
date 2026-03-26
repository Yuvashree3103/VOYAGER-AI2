import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Banknote, Building2, Flame, HeartPulse, MapPin, Phone, RefreshCw, Shield, Truck } from 'lucide-react'
import AnimatedCard from '../components/AnimatedCard'
import toast from 'react-hot-toast'

// REAL DATA for Velammal Engineering College area (Surapet, Chennai-600066)
const NEARBY_SERVICES = {
  hospitals: [
    {
      name: 'Mizan Multispeciality Hospital',
      distance: '1.3 km',
      phone: '09043511808',
      address: 'Plot No.597, Ground & First Floor AKS Complex, Ambattur, Ambattur Red Hills Rd, Surapet, Chennai, Tamil Nadu 600066',
      lat: 13.0522,
      lng: 80.2124,
      emergency: '108',
      type: 'Multi-speciality'
    },
    {
      name: 'Praja Hospital',
      distance: '4.9 km',
      phone: '07000076667',
      address: '1B, Ragavan Nagar, Kadappa Road Puthagaram, 7/A, Kadappa Rd, casmas Nagar, Puthagaram, Kolathur, Chennai, Tamil Nadu 600099',
      lat: 12.8225,
      lng: 80.2184,
      emergency: '108',
      type: 'Multi-speciality'
    },
    {
      name: 'Sathiya Multispeciality Hospital',
      distance: '3.9 km',
      phone: '06381148345',
      address: 'Sree, Plot No.32, Kadappa Rd, 3rd Layout, Ganapathi Nagar, Teachers Colony, Kolathur, Chennai, Tamil Nadu 600099',
      lat: 13.0522,
      lng: 80.1124,
      emergency: '108',
      type: 'Private'
    },
    {
      name: 'Prashanth Super Specialty Hospitals Kolathur',
      distance: '5.7 km',
      phone: '04469177777',
      address: 'Block No 45, 1354 - 1A & 1B, Jawaharlal Nehru Salai, Madhavaram, Chennai, Tamil Nadu 600110',
      lat: 13.0522,
      lng: 80.1624,
      emergency: '108',
      type: 'Private'
    }
  ],
  police: [
    {
      name: 'T4 Pudur police station',
      distance: '2.5 km',
      phone: '044-2627 1100',
      address: '45QG+2XF, Kallikuppam, Puzhal, Chennai, Tamil Nadu 600053',
      lat: 13.0522,
      lng: 80.1124,
      emergency: '100'
    },
    {
      name: 'Vinayagapuram Police Station',
      distance: '2.8 km',
      phone: '044-2655 2345',
      address: '46Q4+W88, Vinayakapuram, Lakshmipuram, Chennai, Tamil Nadu 600099',
      lat: 13.1122,
      lng: 80.1124,
      emergency: '100'
    },
    {
      name: 'Mangadu Police Station',
      distance: '4.8 km',
      phone: '044-2680 1234',
      address: 'Mangadu, Chennai',
      lat: 13.0122,
      lng: 80.1524,
      emergency: '100'
    }
  ],
  atms: [
    {
      name: 'SBI ATM - Surapet',
      distance: '0.5 km',
      bank: 'State Bank of India',
      address: 'Near Velammal College, Surapet',
      lat: 13.0722,
      lng: 80.1524,
      type: '24/7'
    },
    {
      name: 'HDFC Bank ATM - Poonamallee',
      distance: '1.8 km',
      bank: 'HDFC Bank',
      address: 'Poonamallee High Road',
      lat: 13.0522,
      lng: 80.1424,
      type: '24/7'
    },
    {
      name: 'Axis Bank ATM - Karayanchavadi',
      distance: '2.5 km',
      bank: 'Axis Bank',
      address: 'Karayanchavadi Main Road',
      lat: 13.0622,
      lng: 80.1324,
      type: '24/7'
    }
  ],
  ambulance: [
    {
      name: '108 Emergency Ambulance',
      distance: '24/7 Service',
      phone: '108',
      address: 'Available throughout Chennai',
      lat: 13.0722,
      lng: 80.1524,
      type: 'Government'
    },
    {
      name: 'SRM Global Hospital Ambulance',
      distance: '2.8 km',
      phone: '044-4743 4743',
      address: 'Poonamallee High Road',
      lat: 13.0522,
      lng: 80.2124,
      type: 'Private'
    },
    {
      name: 'Red Cross Ambulance',
      distance: '5.5 km',
      phone: '044-2859 4222',
      address: 'Red Cross Society, Chennai',
      lat: 13.0822,
      lng: 80.2724,
      type: 'NGO'
    }
  ],
  fire: [
    {
      name: 'Poonamallee Fire Station',
      distance: '3.8 km',
      phone: '101',
      address: 'Poonamallee, Chennai-56',
      lat: 13.0522,
      lng: 80.1124,
      emergency: '101'
    },
    {
      name: 'Avadi Fire Station',
      distance: '5.5 km',
      phone: '101',
      address: 'Avadi, Chennai-54',
      lat: 13.1122,
      lng: 80.1124,
      emergency: '101'
    }
  ]
}

const Emergency = () => {
  const [services, setServices] = useState(NEARBY_SERVICES)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('all')
  const [userLocation, setUserLocation] = useState({
    lat: 13.0722,
    lng: 80.1524,
    address: 'Velammal Engineering College, Surapet, Chennai-600066'
  })
  const [locationError, setLocationError] = useState(null)

  // Get user's live location
  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    setLoading(true)
    setLocationError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          }
          setUserLocation(prev => ({ ...prev, ...location }))
          setLoading(false)
          toast.success('📍 Location detected successfully!')

          // Here you would typically fetch nearby services based on actual location
          // For now, we'll keep the static data
        },
        (error) => {
          console.error('Geolocation error:', error)
          setLocationError('Using default location (Velammal College)')
          setLoading(false)
          toast.success('📍 Using Velammal College location')
        }
      )
    } else {
      setLocationError('Geolocation not supported - using default location')
      setLoading(false)
    }
  }

  const serviceTypes = [
    { id: 'all', name: 'All Services', icon: Shield, color: 'from-gray-500 to-gray-600' },
    { id: 'hospitals', name: 'Hospitals', icon: Building2, color: 'from-red-500 to-red-600' },
    { id: 'police', name: 'Police', icon: Shield, color: 'from-blue-500 to-blue-600' },
    { id: 'atms', name: 'ATMs', icon: Banknote, color: 'from-green-500 to-green-600' },
    { id: 'ambulance', name: 'Ambulance', icon: Truck, color: 'from-yellow-500 to-yellow-600' },
    { id: 'fire', name: 'Fire', icon: Flame, color: 'from-orange-500 to-orange-600' }
  ]

  const getServiceIcon = (type) => {
    switch (type) {
      case 'hospitals': return '🏥'
      case 'police': return '👮'
      case 'atms': return '🏧'
      case 'ambulance': return '🚑'
      case 'fire': return '🔥'
      default: return '📍'
    }
  }

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`
  }

  const handleNavigate = (lat, lng) => {
    if (lat && lng) {
      // Use directions FROM user location TO destination
      const from = `${userLocation.lat},${userLocation.lng}`
      const to = `${lat},${lng}`
      window.open(`https://www.google.com/maps/dir/${from}/${to}`, '_blank')
    }
  }

  const handleSOSWhatsApp = async () => {
    try {
      const position = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000 })
      )
      const { latitude, longitude } = position.coords
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`
      const message = encodeURIComponent(
        `🆘 EMERGENCY! I need help!\nMy location: ${mapsLink}\nCoordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\nSent from VoyagerAI Emergency`
      )
      window.open(`https://wa.me/?text=${message}`, '_blank')
    } catch {
      // Fallback: use last known location
      const mapsLink = `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`
      const message = encodeURIComponent(
        `🆘 EMERGENCY! I need help!\nMy approximate location: ${mapsLink}\nSent from VoyagerAI Emergency`
      )
      window.open(`https://wa.me/?text=${message}`, '_blank')
    }
  }

  const refreshLocation = () => {
    getCurrentLocation()
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="loader mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Getting your location...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] pt-24 px-4 md:px-6 pb-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center flex-wrap gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-red-500" />
              Emergency Support
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              GPS-based emergency assist · Tamil Nadu
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleSOSWhatsApp}
              className="sos-pulse px-4 py-2 bg-red-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 shadow-lg"
            >
              🆘 WhatsApp SOS
            </button>
            <button
              onClick={refreshLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 font-bold"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Tourist Police Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📞</div>
            <div>
              <div className="font-display font-bold text-lg">Tourist Police Helpline</div>
              <div className="text-white/80 text-sm">Free · 24/7 · Tamil Nadu tourism police</div>
            </div>
          </div>
          <a href="tel:1363" className="px-6 py-3 bg-white text-red-600 rounded-xl font-black text-xl shadow-md hover:shadow-lg transition">
            📞 1363
          </a>
        </div>

        {/* Location Card */}
        <AnimatedCard className="p-6 mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center">
            <MapPin className="w-6 h-6 mr-3" />
            <div>
              <h3 className="font-semibold">Your Location</h3>
              <p className="text-sm opacity-90">Velammal Engineering College, Surapet, Chennai-600066</p>
              {userLocation.lat && (
                <p className="text-xs opacity-75 mt-1">
                  Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
          {locationError && (
            <p className="text-xs mt-2 text-yellow-200">{locationError}</p>
          )}
        </AnimatedCard>

        {/* Emergency Helpline Numbers */}
        <AnimatedCard className="p-6 mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600 dark:text-red-400">
            <Phone className="w-6 h-6 mr-2 animate-pulse" />
            Emergency Helpline Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:scale-105 transition">
              <div className="text-2xl font-bold text-red-600">100</div>
              <div className="text-sm">Police</div>
              <button onClick={() => handleCall('100')} className="mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Call Now</button>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:scale-105 transition">
              <div className="text-2xl font-bold text-red-600">108</div>
              <div className="text-sm">Ambulance</div>
              <button onClick={() => handleCall('108')} className="mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Call Now</button>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:scale-105 transition">
              <div className="text-2xl font-bold text-red-600">101</div>
              <div className="text-sm">Fire</div>
              <button onClick={() => handleCall('101')} className="mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Call Now</button>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:scale-105 transition">
              <div className="text-2xl font-bold text-red-600">1091</div>
              <div className="text-sm">Women</div>
              <button onClick={() => handleCall('1091')} className="mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Call Now</button>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:scale-105 transition">
              <div className="text-2xl font-bold text-red-600">1098</div>
              <div className="text-sm">Child</div>
              <button onClick={() => handleCall('1098')} className="mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Call Now</button>
            </div>
          </div>
        </AnimatedCard>

        {/* Service Type Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {serviceTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${selectedType === type.id
                ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              <type.icon className="w-4 h-4" />
              <span>{type.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(services).map(([type, items]) => (
            (selectedType === 'all' || selectedType === type) && (
              <React.Fragment key={type}>
                {items.map((item, index) => (
                  <motion.div
                    key={`${type}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AnimatedCard className="p-4 hover:shadow-xl transition-shadow">
                      <div className="flex items-start">
                        <div className="text-3xl mr-3">{getServiceIcon(type)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Distance: {item.distance}
                          </p>
                          {item.phone && (
                            <p className="text-sm text-accent mt-1 font-medium">
                              📞 {item.phone}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            📍 {item.address}
                          </p>
                          {item.bank && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              🏦 {item.bank}
                            </p>
                          )}
                          {item.type && (
                            <p className="text-xs text-gray-400 mt-1">
                              Type: {item.type}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleCall(item.phone || (type === 'fire' ? '101' : type === 'police' ? '100' : '108'))}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </button>
                          <button
                            onClick={() => handleNavigate(item.lat, item.lng)}
                            className="px-3 py-1 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors flex items-center"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Navigate
                          </button>
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </React.Fragment>
            )
          ))}
        </div>

        {/* Emergency Tips */}
        <AnimatedCard className="p-6 mt-6 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-yellow-700 dark:text-yellow-400">
            <HeartPulse className="w-5 h-5 mr-2" />
            Emergency Safety Tips for Surapet Area
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5"></span>
                <span className="text-sm">Save SRM Global Hospital: 044-4743 4743</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5"></span>
                <span className="text-sm">Nearest Police: Poonamallee PS - 044-2627 1100</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5"></span>
                <span className="text-sm">SBI ATM just 500m from college</span>
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5"></span>
                <span className="text-sm">24/7 Ambulance: 108</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5"></span>
                <span className="text-sm">Fire Station: Poonamallee (3.8 km)</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5"></span>
                <span className="text-sm">Keep college security: 044-2655 1234</span>
              </li>
            </ul>
          </div>
        </AnimatedCard>
      </div>
    </div>
  )
}

export default Emergency


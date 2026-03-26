import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Calendar, Users, IndianRupee, AlertTriangle, CheckCircle2, 
  ChevronRight, ChevronLeft, Loader, MapPinCheck, Lightbulb
} from 'lucide-react'
import { advancedPlannerAPI } from '../services/api'
import toast from 'react-hot-toast'

const AdvancedTripPlanner = () => {
  const [step, setStep] = useState(1)
  const [cities, setCities] = useState([])
  const [availableInterests, setAvailableInterests] = useState([])
  const [loading, setLoading] = useState(false)
  const [validationState, setValidationState] = useState(null)
  
  const [formData, setFormData] = useState({
    city: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    interests: [],
    wantHotel: true
  })

  const [itinerary, setItinerary] = useState(null)

  // Load cities on mount
  useEffect(() => {
    fetchCities()
  }, [])

  // Load interests when city changes
  useEffect(() => {
    if (formData.city) {
      fetchInterests(formData.city)
    }
  }, [formData.city])

  const fetchCities = async () => {
    try {
      setLoading(true)
      const response = await advancedPlannerAPI.getCities()
      setCities(response.cities || [])
    } catch (error) {
      toast.error('Failed to load cities')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInterests = async (city) => {
    try {
      const response = await advancedPlannerAPI.getInterests(city)
      setAvailableInterests(response.interests || [])
      setFormData(prev => ({ ...prev, interests: [] }))
    } catch (error) {
      console.error(error)
      setAvailableInterests([])
    }
  }

  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, city }))
    setValidationState(null)
  }

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const validateInterests = async () => {
    if (!formData.city || formData.interests.length === 0) {
      toast.error('Select city and interests')
      return
    }

    try {
      setLoading(true)
      const response = await advancedPlannerAPI.validateInterests({
        city: formData.city,
        interests: formData.interests
      })

      setValidationState(response.validation)

      if (response.validation.status === 'complete') {
        setStep(3)
        toast.success('✅ All interests available!')
      } else if (response.validation.status === 'partial') {
        toast.warning('⚠️ Some interests unavailable - see suggestions')
      } else {
        toast.error('❌ Interests not available in this city')
      }
    } catch (error) {
      toast.error('Validation failed')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const proceedWithAvailableInterests = () => {
    if (validationState?.available_interests.length > 0) {
      setFormData(prev => ({
        ...prev,
        interests: validationState.available_interests
      }))
      setStep(3)
    }
  }

  const generateItinerary = async () => {
    if (!formData.startDate || !formData.endDate) {
      toast.error('Select travel dates')
      return
    }

    try {
      setLoading(true)
      const response = await advancedPlannerAPI.planTrip({
        city: formData.city,
        startDate: formData.startDate,
        endDate: formData.endDate,
        interests: formData.interests,
        travelers: formData.travelers,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        wantHotel: formData.wantHotel
      })

      if (response.success) {
        setItinerary(response.trip)
        setStep(5)
        toast.success('✅ Itinerary generated!')
      } else if (response.step === 'validation_partial') {
        setValidationState(response.validation)
        toast.warning(response.validation.message)
      } else {
        toast.error(response.message || 'Failed to generate itinerary')
      }
    } catch (error) {
      toast.error('Error generating itinerary')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Step 1: City Selection
  const StepCitySelection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Choose Your Destination</h2>
      <p className="text-slate-600">Select a city in Tamil Nadu</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {cities.map(city => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            className={`p-3 rounded-lg border-2 transition ${
              formData.city === city
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <MapPin className="inline mr-2 h-4 w-4" />
            {city}
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!formData.city}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </motion.div>
  )

  // Step 2: Interest Selection with Validation
  const StepInterestSelection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">What interests you?</h2>
      <p className="text-slate-600">Select your interests in {formData.city}</p>

      {availableInterests.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableInterests.map(interest => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`p-3 rounded-lg border-2 transition ${
                formData.interests.includes(interest)
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : 'border-slate-200 hover:border-green-300'
              }`}
            >
              {formData.interests.includes(interest) && <CheckCircle2 className="inline mr-2 h-4 w-4" />}
              {interest}
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          Loading interests...
        </div>
      )}

      {validationState?.status === 'partial' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 font-semibold">💡 Some interests unavailable:</p>
          <p className="text-blue-800 text-sm mt-2">{validationState.message}</p>
          {validationState.suggestions && Object.keys(validationState.suggestions).length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-sm">Nearby alternatives:</p>
              {Object.entries(validationState.suggestions).map(([interest, data]) => (
                <ul key={interest} className="text-sm mt-1 ml-2">
                  {data.available_nearby.map((alt, idx) => (
                    <li key={idx}>• {alt}</li>
                  ))}
                </ul>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setStep(1)}
          className="flex-1 border-2 border-slate-300 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={validateInterests}
          disabled={formData.interests.length === 0 || loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Validate'} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )

  // Step 3: Date & Budget Selection
  const StepTravelDetails = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Travel Details</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="inline mr-2 h-4 w-4" /> Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full p-2 border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="inline mr-2 h-4 w-4" /> End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full p-2 border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Users className="inline mr-2 h-4 w-4" /> Travelers
          </label>
          <input
            type="number"
            min="1"
            value={formData.travelers}
            onChange={(e) => setFormData(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
            className="w-full p-2 border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <IndianRupee className="inline mr-2 h-4 w-4" /> Budget (Optional)
          </label>
          <input
            type="number"
            placeholder="Enter total budget"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            className="w-full p-2 border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hotel"
          checked={formData.wantHotel}
          onChange={(e) => setFormData(prev => ({ ...prev, wantHotel: e.target.checked }))}
          className="h-4 w-4"
        />
        <label htmlFor="hotel" className="text-slate-700">Include hotel stay in planning</label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setStep(2)}
          className="flex-1 border-2 border-slate-300 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={generateItinerary}
          disabled={!formData.startDate || !formData.endDate || loading}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Generate Itinerary'} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )

  // Step 5: Itinerary Display
  const StepItineraryDisplay = () => {
    if (!itinerary) return null

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Your {itinerary.duration_days}-Day Journey</h2>
          <p className="text-blue-100">{itinerary.city} • {itinerary.travelers} Traveler(s)</p>
        </div>

        {itinerary.budget?.warning && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
            <div className="text-orange-900">
              <p className="font-semibold">{itinerary.budget.warning}</p>
              <p className="text-sm">{itinerary.budget.suggestion}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-slate-600">Total Budget</p>
            <p className="text-2xl font-bold text-blue-600">₹{itinerary.budget?.all_travelers?.total.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-slate-600">Per Person</p>
            <p className="text-2xl font-bold text-green-600">₹{Math.ceil(itinerary.budget?.all_travelers?.total / itinerary.travelers).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Days Accordion */}
        <div className="space-y-3">
          {itinerary.itinerary.map((day, idx) => (
            <DayAccordion key={idx} day={day} />
          ))}
        </div>

        <button
          onClick={() => {
            setStep(1)
            setItinerary(null)
            setFormData({
              city: '',
              startDate: '',
              endDate: '',
              travelers: 1,
              budget: '',
              interests: [],
              wantHotel: true
            })
          }}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Plan Another Trip
        </button>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8 flex justify-between">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`h-2 flex-1 mx-1 rounded-full transition ${
                s <= step ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {loading && step !== 5 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-slate-600">Processing...</p>
            </div>
          ) : (
            <>
              {step === 1 && <StepCitySelection />}
              {step === 2 && <StepInterestSelection />}
              {step === 3 && <StepTravelDetails />}
              {step === 5 && <StepItineraryDisplay />}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// Day Accordion Component
const DayAccordion = ({ day }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center"
      >
        <span className="font-semibold text-slate-900">
          Day {day.day} • {new Date(day.date).toLocaleDateString()}
        </span>
        <ChevronRight className={`h-5 w-5 transition ${open ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-slate-200 p-4 space-y-3 bg-slate-50"
          >
            {day.activities
              .filter(a => a.time_slot !== 'Breakfast' && a.time_slot !== 'Lunch' && a.time_slot !== 'Dinner')
              .map((activity, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900">{activity.time_slot}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{activity.category}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{activity.name}</p>
                  <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                  {activity.opening_time && (
                    <p className="text-xs text-slate-500 mt-2">
                      ⏰ {activity.opening_time} - {activity.closing_time} | 
                      💰 Entry: ₹{activity.entry_fee}
                    </p>
                  )}
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedTripPlanner

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  IdentificationIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MapPinIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  EnvelopeIcon,
  PhoneIcon,
  CakeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import AnimatedCard from '../components/AnimatedCard'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    personal: {
      fullName: '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
      bloodGroup: ''
    },
    documents: {
      aadhar: {
        number: '',
        uploaded: false,
        file: null
      },
      passport: {
        number: '',
        expiryDate: '',
        uploaded: false,
        file: null
      },
      drivingLicense: {
        number: '',
        expiryDate: '',
        uploaded: false,
        file: null
      },
      insurance: {
        policyNumber: '',
        provider: '',
        expiryDate: '',
        uploaded: false,
        file: null
      }
    },
    preferences: {
      travelType: 'Solo',
      budget: 'Mid-range',
      interests: ['Beach', 'Temple', 'Food'],
      language: 'English'
    }
  })

  const [previousTrips, setPreviousTrips] = useState([])
  const [uploadingDoc, setUploadingDoc] = useState(null)

  // Load profile data from localStorage
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`profile_${user.id}`)
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile))
      }
      
      const savedTrips = localStorage.getItem(`trips_${user.id}`)
      if (savedTrips) {
        setPreviousTrips(JSON.parse(savedTrips))
      } else {
        // Sample previous trips
        setPreviousTrips([
          {
            id: 1,
            destination: 'Chennai',
            startDate: '2025-12-10',
            endDate: '2025-12-15',
            travelers: 2,
            totalBudget: 25000,
            highlights: ['Marina Beach', 'Kapaleeshwarar Temple', 'Mahabalipuram'],
            images: []
          },
          {
            id: 2,
            destination: 'Mahabalipuram',
            startDate: '2026-01-05',
            endDate: '2026-01-07',
            travelers: 4,
            totalBudget: 18000,
            highlights: ['Shore Temple', 'Pancha Rathas', 'Beach'],
            images: []
          }
        ])
      }
    }
  }, [user])

  // Save profile data
  const saveProfile = () => {
    if (user) {
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData))
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    }
  }

  const handleDocumentUpload = (docType, file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfileData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: {
            ...prev.documents[docType],
            uploaded: true,
            file: e.target.result
          }
        }
      }))
      toast.success(`${docType} uploaded successfully!`)
    }
    reader.readAsDataURL(file)
  }

  const getInitials = () => {
    if (profileData.personal.fullName) {
      return profileData.personal.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return user?.username?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Travel Profile
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 flex items-center"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={saveProfile}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <AnimatedCard className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-highlight rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
              {getInitials()}
            </div>
            <h2 className="text-xl font-semibold">
              {profileData.personal.fullName || user?.username}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{user?.email}</p>
            
            <div className="space-y-2 text-left">
              <p className="flex items-center text-sm">
                <UserIcon className="w-4 h-4 mr-2 text-accent" />
                Member since: {new Date().toLocaleDateString()}
              </p>
              <p className="flex items-center text-sm">
                <MapPinIcon className="w-4 h-4 mr-2 text-accent" />
                {profileData.personal.address || 'Chennai, India'}
              </p>
              <p className="flex items-center text-sm">
                <CalendarIcon className="w-4 h-4 mr-2 text-accent" />
                {previousTrips.length} trips completed
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Personal Information */}
        <AnimatedCard className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-accent" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.personal.fullName}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    personal: {...profileData.personal, fullName: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {profileData.personal.fullName || 'Not provided'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                <p>{user?.email}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.personal.phone}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    personal: {...profileData.personal, phone: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {profileData.personal.phone || 'Not provided'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={profileData.personal.dateOfBirth}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    personal: {...profileData.personal, dateOfBirth: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {profileData.personal.dateOfBirth || 'Not provided'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Blood Group</label>
              {isEditing ? (
                <select
                  value={profileData.personal.bloodGroup}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    personal: {...profileData.personal, bloodGroup: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {profileData.personal.bloodGroup || 'Not provided'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Emergency Contact</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.personal.emergencyContact}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    personal: {...profileData.personal, emergencyContact: e.target.value}
                  })}
                  placeholder="Name: Phone"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {profileData.personal.emergencyContact || 'Not provided'}
                </p>
              )}
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={profileData.personal.address}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    personal: {...profileData.personal, address: e.target.value}
                  })}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {profileData.personal.address || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </AnimatedCard>

        {/* Documents Section */}
        <AnimatedCard className="p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <IdentificationIcon className="w-5 h-5 mr-2 text-accent" />
            Important Documents
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Aadhar Card */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-accent" />
                <h4 className="font-medium">Aadhar Card</h4>
              </div>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    placeholder="Aadhar Number"
                    value={profileData.documents.aadhar.number}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      documents: {
                        ...profileData.documents,
                        aadhar: {...profileData.documents.aadhar, number: e.target.value}
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocumentUpload('aadhar', e.target.files[0])}
                    className="text-sm"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-1">
                    {profileData.documents.aadhar.number || 'Not added'}
                  </p>
                  {profileData.documents.aadhar.uploaded && (
                    <span className="text-xs text-green-600">✓ Document uploaded</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Passport */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-accent" />
                <h4 className="font-medium">Passport</h4>
              </div>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    placeholder="Passport Number"
                    value={profileData.documents.passport.number}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      documents: {
                        ...profileData.documents,
                        passport: {...profileData.documents.passport, number: e.target.value}
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <input
                    type="date"
                    value={profileData.documents.passport.expiryDate}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      documents: {
                        ...profileData.documents,
                        passport: {...profileData.documents.passport, expiryDate: e.target.value}
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocumentUpload('passport', e.target.files[0])}
                    className="text-sm"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-1">
                    {profileData.documents.passport.number || 'Not added'}
                  </p>
                  {profileData.documents.passport.expiryDate && (
                    <p className="text-xs">Expires: {profileData.documents.passport.expiryDate}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Driving License */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <IdentificationIcon className="w-5 h-5 mr-2 text-accent" />
                <h4 className="font-medium">Driving License</h4>
              </div>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    placeholder="License Number"
                    value={profileData.documents.drivingLicense.number}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      documents: {
                        ...profileData.documents,
                        drivingLicense: {...profileData.documents.drivingLicense, number: e.target.value}
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <input
                    type="date"
                    value={profileData.documents.drivingLicense.expiryDate}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      documents: {
                        ...profileData.documents,
                        drivingLicense: {...profileData.documents.drivingLicense, expiryDate: e.target.value}
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocumentUpload('drivingLicense', e.target.files[0])}
                    className="text-sm"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-1">
                    {profileData.documents.drivingLicense.number || 'Not added'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Insurance */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-accent" />
                <h4 className="font-medium">Travel Insurance</h4>
              </div>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    placeholder="Policy Number"
                    value={profileData.documents.insurance.policyNumber}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      documents: {
                        ...profileData.documents,
                        insurance: {...profileData.documents.insurance, policyNumber: e.target.value}
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Provider"
                    value={profileData.documents.insurance.provider}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      documents: {
                        ...profileData.documents,
                        insurance: {...profileData.documents.insurance, provider: e.target.value}
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <input
                    type="date"
                    value={profileData.documents.insurance.expiryDate}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      documents: {
                        ...profileData.documents,
                        insurance: {...profileData.documents.insurance, expiryDate: e.target.value}
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocumentUpload('insurance', e.target.files[0])}
                    className="text-sm"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-1">
                    {profileData.documents.insurance.policyNumber || 'Not added'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </AnimatedCard>

        {/* Previous Trips */}
        <AnimatedCard className="p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-accent" />
            Previous Trips
          </h3>
          
          <div className="space-y-4">
            {previousTrips.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No previous trips found</p>
            ) : (
              previousTrips.map((trip) => (
                <div key={trip.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{trip.destination}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="text-accent">{trip.travelers}</span> travelers • 
                        Budget: <span className="text-accent">₹{trip.totalBudget}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {trip.highlights.map((highlight, i) => (
                          <span key={i} className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-accent">
                      <DocumentTextIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  )
}

export default Profile
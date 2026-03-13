import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const specialtiesData = {
    'Chennai': [
        { name: 'Filter Coffee & Idli', location: 'Murugan Idli Shop, Saravana Bhavan', price: '₹15–₹120', rating: 4.9, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Sundal & Bajji', location: 'Marina Beach vendors', price: '₹20–₹40', rating: 4.8, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Kanchipuram Silk Sarees', location: 'Nalli, Kumaran Silks – T Nagar', price: '₹2000–₹25000', rating: 4.9, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Tanjore Paintings & Bronze', location: 'Poompuhar Emporium', price: '₹800–₹20000', rating: 4.8, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop' }
    ],
    'Madurai': [
        { name: 'Madurai Bun Parotta', location: 'Famous roadside stalls', price: '₹30–₹60', rating: 4.9, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Jigarthanda', location: 'Famous Madurai Jigarthanda', price: '₹40–₹100', rating: 4.8, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop' }
    ],
    'Ooty & Kodaikanal': [
        { name: 'Varkey', location: 'Traditional Ooty snack', price: '₹50–₹150', rating: 4.7, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop' }
    ],
    'Thanjavur & Chettinad': [
        { name: 'Chettinad Chicken Curry', location: 'Authentic Chettinad cuisine', price: '₹200–₹500', rating: 4.9, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop' }
    ],
    'Kanyakumari & Rameswaram': [],
    'Pondicherry': []
};

export const SpecialtiesSection = () => {
    const [activeTab, setActiveTab] = useState('Chennai');

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                    🏮 Tamil Nadu Specialties
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4">What to Buy & Eat Across Tamil Nadu</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    Local specialties, must-try food, and iconic products from every region — with real prices
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-5xl mx-auto">
                {Object.keys(specialtiesData).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                            activeTab === tab 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 ring-4 ring-blue-50' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                    >
                        <span className="text-base opacity-70">
                            {tab === 'Chennai' && '🏙️'}
                            {tab === 'Madurai' && '🛕'}
                            {tab === 'Ooty & Kodaikanal' && '🏔️'}
                            {tab === 'Thanjavur & Chettinad' && '🏺'}
                            {tab === 'Kanyakumari & Rameswaram' && '🌅'}
                            {tab === 'Pondicherry' && '🇫🇷'}
                        </span>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {specialtiesData[activeTab].length > 0 ? (
                            specialtiesData[activeTab].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                                >
                                    <div className="h-44 overflow-hidden relative">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                            <span className="text-yellow-400 text-xs">⭐</span>
                                            <span className="text-xs font-bold text-gray-800">{item.rating}</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider mb-4">
                                            {item.price}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h4>
                                        <div className="flex items-start gap-2 text-xs text-gray-500">
                                            <span className="mt-0.5">📍</span>
                                            <span className="leading-relaxed">{item.location}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="text-4xl mb-4">🏗️</div>
                                <h3 className="text-xl font-bold text-gray-400">Content Coming Soon</h3>
                                <p className="text-gray-400 mt-2">Our AI is currently mapping out the best spots in this region.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-20 text-center">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 transition-all flex items-center gap-3 mx-auto">
                    Ask AI for More Tamil Nadu Recommendations <span>&rarr;</span>
                </button>
            </div>
        </section>
    );
};

export const FeaturesSection = () => {
    const features = [
        { title: 'AI Trip Planning', icon: '🗺️', desc: 'Smart itineraries tailored to your preferences and budget' },
        { title: 'Weather Alerts', icon: '🌦️', desc: 'Real-time weather tracking with intelligent advisories' },
        { title: 'Budget Tracker', icon: '💰', desc: 'AI-predicted expenses and group splitting made easy' },
        { title: 'Food & Stay', icon: '🍴', desc: 'Curated recommendations for restaurants and hotels' },
        { title: 'Safety & SOS', icon: '🛡️', desc: 'Emergency contacts, SOS alerts, and risk forecasting' },
        { title: 'AI Advisor', icon: '✨', desc: 'Context-aware travel assistant for any question' },
        { title: 'Language Helper', icon: '🗣️', desc: 'Local survival phrases with offline support' },
        { title: 'Smart Packing', icon: '🎒', desc: 'AI-generated checklists with mistake detection' },
        { title: 'Group Expenses', icon: '👥', desc: 'Split costs fairly among travel companions' },
        { title: 'Risk Forecast', icon: '⚡', desc: 'Predict travel risks based on weather and crowds' },
        { title: 'Travel Journal', icon: '📔', desc: 'Document memories with photos and mood tracking' },
        { title: 'Hyperlocal Alerts', icon: '📍', desc: 'Real-time area-specific safety notifications' }
    ];

    return (
        <section className="py-24 px-6 bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto text-center mb-20">
                <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                    💎 Features
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-6">Everything You Need to Travel Smart</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                    Powered by AI to make every trip safer, smarter, and more memorable
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                    >
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

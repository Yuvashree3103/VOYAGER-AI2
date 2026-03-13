import React from 'react';
import { motion } from 'framer-motion';

export const AgencySection = ({ agencies }) => (
    <section className="py-20 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Explore Travel Agencies</h2>
            <p className="text-gray-600 mb-10">Trusted agencies offering curated tour packages across Tamil Nadu.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {agencies.map((agency) => (
                    <motion.div
                        key={agency.id}
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img src={agency.image_url} alt={agency.name} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <span className="text-yellow-400 text-xs">⭐</span>
                                <span className="text-xs font-bold text-gray-800">{agency.rating}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-blue-600 text-sm">🛡️</span>
                                <h3 className="text-lg font-bold text-gray-800">{agency.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
                                <span>📍</span>
                                <span>{agency.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {agency.tour_types.map((type, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-md uppercase tracking-wider">
                                        {type}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-widest">Starting from</span>
                                    <span className="text-xl font-bold text-gray-900">₹{agency.starting_price.toLocaleString()}</span>
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                    View Packages
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export const GuideSection = ({ guides }) => (
    <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Local Tourist Guides</h2>
            <p className="text-gray-600 mb-10">Expert local guides to make your Tamil Nadu journey unforgettable.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {guides.map((guide) => (
                    <motion.div
                        key={guide.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                    >
                        <div className="h-64 overflow-hidden relative">
                            <img src={guide.photo_url} alt={guide.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-xl font-bold">{guide.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-yellow-400 text-sm">⭐</span>
                                    <span className="text-sm font-semibold">{guide.rating}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="text-blue-500">🌍</span>
                                    <span>{guide.languages.join(', ')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="text-blue-500">📍</span>
                                    <span>{guide.service_areas.join(', ')}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-widest">Daily Fee</span>
                                    <span className="text-xl font-bold text-gray-900">₹{guide.daily_fee.toLocaleString()}</span>
                                </div>
                                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                    Book Guide
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export const PackageSection = ({ packages }) => (
    <section className="py-20 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Tour Packages</h2>
            <p className="text-gray-600 mb-10">Handpicked itineraries for the best of Tamil Nadu.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {packages.map((pkg) => (
                    <motion.div
                        key={pkg.id}
                        whileHover={{ y: -8 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
                    >
                        <div className="h-60 overflow-hidden relative">
                            <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg">
                                <span className="text-yellow-400 text-sm">⭐</span>
                                <span className="text-sm font-bold text-gray-800">{pkg.rating}</span>
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{pkg.title}</h3>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">🗓️</span>
                                    <span>{pkg.duration}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">📍</span>
                                    <span className="line-clamp-1">{pkg.locations.join(', ')}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-widest">Per Person</span>
                                    <span className="text-2xl font-black text-gray-900">₹{pkg.price_per_person.toLocaleString()}</span>
                                </div>
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

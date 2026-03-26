import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, MapPin, Search, X } from 'lucide-react'

// Tamil Nadu landmark data with coordinates
const PLACES = [
    // Chennai
    { id: 1, name: 'Marina Beach', district: 'Chennai', category: 'Beach', lat: 13.0499, lng: 80.2824, desc: 'World\'s 2nd longest beach, 13 km stretch.', entry: 'Free', best: 'Oct–Feb', rating: 4.6 },
    { id: 2, name: 'Kapaleeshwarar Temple', district: 'Chennai', category: 'Temple', lat: 13.0338, lng: 80.2677, desc: 'Iconic Dravidian temple in Mylapore.', entry: 'Free', best: 'Year-round', rating: 4.7 },
    { id: 3, name: 'Fort St. George', district: 'Chennai', category: 'Heritage', lat: 13.0798, lng: 80.2878, desc: 'First English fortress in India, 1644 AD.', entry: '₹25', best: 'Oct–Mar', rating: 4.3 },
    { id: 4, name: 'Government Museum', district: 'Chennai', category: 'Museum', lat: 13.0681, lng: 80.2606, desc: 'India\'s 2nd oldest museum with Chola bronzes.', entry: '₹15', best: 'Year-round', rating: 4.4 },
    // Madurai
    { id: 5, name: 'Meenakshi Amman Temple', district: 'Madurai', category: 'Temple', lat: 9.9195, lng: 78.1193, desc: 'Iconic 3,500-year-old Dravidian temple.', entry: '₹20 (camera)', best: 'Year-round', rating: 4.9 },
    { id: 6, name: 'Thirumalai Nayakkar Palace', district: 'Madurai', category: 'Heritage', lat: 9.9157, lng: 78.1222, desc: '17th century Nayak ruler\'s grand palace.', entry: '₹50', best: 'Oct–Mar', rating: 4.4 },
    // Thanjavur
    { id: 7, name: 'Brihadeeswarar Temple', district: 'Thanjavur', category: 'Temple', lat: 10.7828, lng: 79.1318, desc: 'UNESCO World Heritage, 1000-year-old Chola masterpiece.', entry: 'Free', best: 'Oct–Mar', rating: 4.9 },
    { id: 8, name: 'Thanjavur Palace', district: 'Thanjavur', category: 'Heritage', lat: 10.7878, lng: 79.1378, desc: 'Nayak-era palace with Saraswati Mahal library.', entry: '₹30', best: 'Oct–Mar', rating: 4.3 },
    // Ooty
    { id: 9, name: 'Doddabetta Peak', district: 'Nilgiris', category: 'Hill Station', lat: 11.4099, lng: 76.7397, desc: 'Highest peak in Nilgiris at 2,637m.', entry: '₹15', best: 'Apr–Jun', rating: 4.5 },
    { id: 10, name: 'Ooty Botanical Garden', district: 'Nilgiris', category: 'Nature', lat: 11.4101, lng: 76.6950, desc: '22-hectare garden with 650 plant species.', entry: '₹50', best: 'Apr–Jun', rating: 4.4 },
    // Kodaikanal
    { id: 11, name: 'Kodaikanal Lake', district: 'Dindigul', category: 'Hill Station', lat: 10.2381, lng: 77.4892, desc: 'Star-shaped man-made lake, cycling & boating.', entry: 'Free', best: 'Sep–Nov', rating: 4.6 },
    { id: 12, name: 'Coaker\'s Walk', district: 'Dindigul', category: 'Hill Station', lat: 10.2286, lng: 77.4973, desc: 'Stunning 1km cliff walk with valley views.', entry: '₹5', best: 'Apr–Jun', rating: 4.7 },
    // Kanyakumari
    { id: 13, name: 'Vivekananda Rock Memorial', district: 'Kanyakumari', category: 'Heritage', lat: 8.0876, lng: 77.5527, desc: 'Island rock memorial where 3 oceans meet.', entry: '₹40', best: 'Oct–Mar', rating: 4.8 },
    { id: 14, name: 'Kanyakumari Sunrise Point', district: 'Kanyakumari', category: 'Nature', lat: 8.0878, lng: 77.5526, desc: 'World-famous tri-ocean sunrise and sunset.', entry: 'Free', best: 'Oct–Mar', rating: 4.9 },
    // Rameswaram
    { id: 15, name: 'Ramanathaswamy Temple', district: 'Ramanathapuram', category: 'Temple', lat: 9.2881, lng: 79.3172, desc: '22 sacred corridors — longest temple corridor in India.', entry: 'Free', best: 'Oct–Mar', rating: 4.8 },
    { id: 16, name: 'Dhanushkodi', district: 'Ramanathapuram', category: 'Beach', lat: 9.1788, lng: 79.4136, desc: 'Ghost town at India\'s southern tip, pristine beach.', entry: 'Free', best: 'Oct–Mar', rating: 4.8 },
    // Mahabalipuram
    { id: 17, name: 'Shore Temple', district: 'Chengalpattu', category: 'Heritage', lat: 12.6172, lng: 80.1993, desc: 'UNESCO 7th-century Pallava shore temple.', entry: '₹40', best: 'Sep–Feb', rating: 4.7 },
    { id: 18, name: 'Arjuna\'s Penance', district: 'Chengalpattu', category: 'Heritage', lat: 12.6186, lng: 80.1950, desc: 'World\'s largest bas-relief rock carving.', entry: '₹40', best: 'Sep–Feb', rating: 4.6 },
    // Hogenakkal
    { id: 19, name: 'Hogenakkal Falls', district: 'Dharmapuri', category: 'Waterfall', lat: 12.1144, lng: 77.7939, desc: '"Niagara of India" — spectacular waterfall on Kaveri.', entry: '₹20', best: 'Jul–Oct', rating: 4.7 },
    // Coimbatore
    { id: 20, name: 'Adiyogi Shiva Statue', district: 'Coimbatore', category: 'Temple', lat: 11.1741, lng: 76.9940, desc: 'World\'s largest bust statue at Isha Yoga Center.', entry: 'Free', best: 'Year-round', rating: 4.8 },
    { id: 21, name: 'Siruvani Falls', district: 'Coimbatore', category: 'Waterfall', lat: 10.9000, lng: 76.7500, desc: 'One of the sweetest water sources in the world.', entry: '₹50', best: 'Jul–Sep', rating: 4.5 },
    // Trichy
    { id: 22, name: 'Rock Fort Temple', district: 'Tiruchirappalli', category: 'Temple', lat: 10.8261, lng: 78.6875, desc: '437-step climb to a spectacular hilltop temple.', entry: '₹5', best: 'Oct–Feb', rating: 4.6 },
    { id: 23, name: 'Srirangam Temple', district: 'Tiruchirappalli', category: 'Temple', lat: 10.8635, lng: 78.6897, desc: 'World\'s largest functioning temple complex.', entry: 'Free', best: 'Oct–Mar', rating: 4.8 },
    // Kanchipuram
    { id: 24, name: 'Kailasanathar Temple', district: 'Kanchipuram', category: 'Temple', lat: 12.8342, lng: 79.7032, desc: 'Oldest temple in Kanchipuram, Pallava era 700 AD.', entry: 'Free', best: 'Oct–Mar', rating: 4.7 },
    // Vellore
    { id: 25, name: 'Sripuram Golden Temple', district: 'Vellore', category: 'Temple', lat: 12.8778, lng: 79.1505, desc: '1,500 kg of gold covers this spiritual park.', entry: 'Free', best: 'Oct–Mar', rating: 4.7 },
    // Tirunelveli
    { id: 26, name: 'Papanasam Falls', district: 'Tirunelveli', category: 'Waterfall', lat: 8.7500, lng: 77.3000, desc: 'Scenic waterfalls near Papanasam Dam.', entry: 'Free', best: 'Oct–Jan', rating: 4.4 },
    // Courtallam
    { id: 27, name: 'Courtallam Main Falls', district: 'Tenkasi', category: 'Waterfall', lat: 8.9280, lng: 77.2790, desc: '"Spa of South India" — 5 falls in one location.', entry: 'Free', best: 'Jun–Sep', rating: 4.6 },
]

const CATEGORY_COLORS = {
    Beach: '#3b82f6',
    Temple: '#f59e0b',
    Heritage: '#8b5cf6',
    'Hill Station': '#10b981',
    Nature: '#22c55e',
    Museum: '#06b6d4',
    Waterfall: '#0ea5e9',
}
const CATEGORIES = ['All', ...Object.keys(CATEGORY_COLORS)]

const ExploreMap = () => {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markersRef = useRef([])
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [selected, setSelected] = useState(null)
    const [showFilter, setShowFilter] = useState(false)

    const filtered = PLACES.filter(p => {
        const matchCat = activeCategory === 'All' || p.category === activeCategory
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.district.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return

        // Dynamically import leaflet
        import('leaflet').then(L => {
            // Fix default icon paths
            delete L.Icon.Default.prototype._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            })

            const map = L.map(mapRef.current, {
                center: [10.7905, 78.6548], // Tamil Nadu center
                zoom: 7,
                zoomControl: true,
            })

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18,
            }).addTo(map)

            mapInstanceRef.current = map
        })

        return () => {
            if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null }
        }
    }, [])

    useEffect(() => {
        if (!mapInstanceRef.current) return

        import('leaflet').then(L => {
            // Clear old markers
            markersRef.current.forEach(m => m.remove())
            markersRef.current = []

            filtered.forEach(place => {
                const color = CATEGORY_COLORS[place.category] || '#6b7280'
                const icon = L.divIcon({
                    className: '',
                    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.2s;" title="${place.name}"></div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14],
                })

                const marker = L.marker([place.lat, place.lng], { icon })
                    .addTo(mapInstanceRef.current)
                    .on('click', () => setSelected(place))

                markersRef.current.push(marker)
            })
        })
    }, [filtered])

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] pt-20 flex flex-col">
            {/* Title Bar */}
            <div className="px-4 md:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Explore Tamil Nadu</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{filtered.length} places · Interactive map</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search places or districts…"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-200" />
                        </div>
                        <button onClick={() => setShowFilter(!showFilter)}
                            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Category Filter */}
                {showFilter && (
                    <div className="max-w-7xl mx-auto mt-3 flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                                {cat !== 'All' && <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: CATEGORY_COLORS[cat] || '#6b7280' }} />}
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map + Details */}
            <div className="flex-1 relative flex">
                {/* Map */}
                <div ref={mapRef} className="flex-1" style={{ minHeight: '70vh', zIndex: 0 }} />

                {/* Category Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">LEGEND</div>
                    {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                        <div key={cat} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 mb-1">
                            <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Selected Place Popup */}
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 right-4 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20"
                    >
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white mb-1 inline-block" style={{ background: CATEGORY_COLORS[selected.category] || '#6b7280' }}>
                                        {selected.category}
                                    </span>
                                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">{selected.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{selected.district} district</p>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{selected.desc}</p>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2 text-center">
                                    <div className="text-xs text-slate-400">Entry</div>
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{selected.entry}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2 text-center">
                                    <div className="text-xs text-slate-400">Best</div>
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{selected.best}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2 text-center">
                                    <div className="text-xs text-slate-400">Rating</div>
                                    <div className="text-xs font-bold text-amber-500">⭐ {selected.rating}</div>
                                </div>
                            </div>
                            <a
                                href={`/plan?district=${selected.district}`}
                                className="block w-full text-center py-2.5 rounded-xl font-bold text-sm text-white transition"
                                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
                            >
                                Plan Trip to {selected.district}
                            </a>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default ExploreMap

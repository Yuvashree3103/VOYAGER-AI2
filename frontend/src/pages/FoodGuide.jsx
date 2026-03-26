import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Sparkles, UtensilsCrossed } from 'lucide-react'

const ALL_FOOD_DATA = [
    // Chennai
    { id: 1, district: 'Chennai', name: 'Filter Coffee', type: 'Beverage', category: 'Food', price: '₹20–₹50', where: 'Saravana Bhavan, Murugan Idli Shop', desc: 'Tamil Nadu\'s iconic frothy filter coffee, dark and aromatic.', emoji: '☕', veg: true },
    { id: 2, district: 'Chennai', name: 'Marina Sundal', type: 'Snack', category: 'Food', price: '₹20–₹40', where: 'Marina Beach stalls', desc: 'Spiced boiled chickpeas — the definitive Chennai beach snack.', emoji: '🌊', veg: true },
    { id: 3, district: 'Chennai', name: 'Atho (Burmese Noodles)', type: 'Street Food', category: 'Food', price: '₹50–₹80', where: 'Burma Colony, Mint Street', desc: 'Unique noodles dish from Burmese-Tamil community.', emoji: '🍜', veg: true },
    { id: 4, district: 'Chennai', name: 'Kanchipuram Silk Sarees', type: 'Textile', category: 'Shopping', price: '₹3,000–₹50,000', where: 'T. Nagar, Nalli Silks, Kumaran Silks', desc: 'Premium silk sarees — a signature Tamil Nadu textile.', emoji: '🥻', veg: true },
    { id: 5, district: 'Chennai', name: 'Paruppu Vadai', type: 'Snack', category: 'Return Gift', price: '₹5–₹15/piece', where: 'All bakeries', desc: 'Crispy lentil donuts — popular return gift from Chennai.', emoji: '🍩', veg: true },
    // Madurai
    { id: 6, district: 'Madurai', name: 'Jigarthanda', type: 'Beverage', category: 'Food', price: '₹30–₹60', where: 'Famous Ice House, Murugan Jigarthanda', desc: 'Cold milk, almond gum, sarsaparilla — uniquely Madurai.', emoji: '🧋', veg: true },
    { id: 7, district: 'Madurai', name: 'Madurai Biryani', type: 'Meal', category: 'Food', price: '₹80–₹150', where: 'Subash Hotel, Hotel Supreme', desc: 'The iconic seeraga samba rice biryani with kari.', emoji: '🍚', veg: false },
    { id: 8, district: 'Madurai', name: 'Kari Dosai', type: 'Breakfast', category: 'Food', price: '₹60–₹100', where: 'Murugan Idli Shop, Amma Mess', desc: 'Crispy dosa stuffed with spiced mutton filling.', emoji: '🥚', veg: false },
    { id: 9, district: 'Madurai', name: 'Meenakshi Temple Prasadam', type: 'Gift', category: 'Return Gift', price: '₹50–₹200', where: 'Temple premises', desc: 'Sacred panchaamirtham and flower prasadam from the temple.', emoji: '🌸', veg: true },
    // Thanjavur
    { id: 10, district: 'Thanjavur', name: 'Kumbakonam Degree Coffee', type: 'Beverage', category: 'Food', price: '₹20–₹40', where: 'Sri Lakshmi Coffee Bar, Hotel Saras', desc: 'Strongest filter coffee in Tamil Nadu — legendary!', emoji: '☕', veg: true },
    { id: 11, district: 'Thanjavur', name: 'Thavala Vadai', type: 'Snack', category: 'Food', price: '₹30–₹60', where: 'Local bakeries and street stalls', desc: 'Crispy rice and lentil disc snack, a Thanjavur specialty.', emoji: '🥠', veg: true },
    { id: 12, district: 'Thanjavur', name: 'Tanjore Paintings', type: 'Art', category: 'Shopping', price: '₹800–₹25,000', where: 'Thanjavur town artisan shops', desc: 'Gold-foil decorated classical paintings — world-famous.', emoji: '🖼️', veg: true },
    { id: 13, district: 'Thanjavur', name: 'Tanjore Dolls (Thanjavur Bommai)', type: 'Craft', category: 'Return Gift', price: '₹200–₹3,000', where: 'Geetha Art and Craft, town shops', desc: 'Iconic bobblehead Thanjavur dolls — classical return gift.', emoji: '🪆', veg: true },
    // Ooty / Nilgiris
    { id: 14, district: 'Nilgiris', name: 'Ooty Homemade Chocolate', type: 'Sweet', category: 'Food', price: '₹100–₹500/kg', where: 'King Star, Chocolate shops on Commercial St', desc: 'Hand-rolled chocolates with local flavours — estate roasted.', emoji: '🍫', veg: true },
    { id: 15, district: 'Nilgiris', name: 'Estate Fresh Tea', type: 'Beverage', category: 'Return Gift', price: '₹80–₹300/250g', where: 'Tea factories, Doddabetta Tea Shop', desc: 'Nilgiri tea picked from altitude estates — premium quality.', emoji: '🫖', veg: true },
    { id: 16, district: 'Nilgiris', name: 'Ooty Varkey', type: 'Sweet', category: 'Food', price: '₹60–₹120/pack', where: 'All bakeries in Ooty', desc: 'Puffed sweet biscuit — an Ooty invention since 1950s.', emoji: '🍪', veg: true },
    // Kanyakumari
    { id: 17, district: 'Kanyakumari', name: 'Nendran Banana Chips', type: 'Snack', category: 'Return Gift', price: '₹80–₹150/kg', where: 'Local shops near temple', desc: 'Crunchy Kerala-style banana chips — best take-home gift.', emoji: '🍌', veg: true },
    { id: 18, district: 'Kanyakumari', name: 'Fresh Seafood Fry', type: 'Meal', category: 'Food', price: '₹100–₹250', where: 'Devi Guest House, local fishing spots', desc: 'Freshest catch from where 3 oceans meet, spiced & fried.', emoji: '🐟', veg: false },
    { id: 19, district: 'Kanyakumari', name: 'Shell Crafts', type: 'Craft', category: 'Shopping', price: '₹50–₹500', where: 'Shops near Vivekananda Rock', desc: 'Unique jewellery and decorations made from sea shells.', emoji: '🐚', veg: true },
    // Tirunelveli
    { id: 20, district: 'Tirunelveli', name: 'Iruttu Kadai Halwa', type: 'Sweet', category: 'Return Gift', price: '₹80–₹120/100g', where: 'Iruttu Kadai (night shop), Old Bus Stand', desc: 'THE most famous halwa in Tamil Nadu, sold only at nights.', emoji: '🍮', veg: true },
    { id: 21, district: 'Tirunelveli', name: 'Tirunelveli Koottu Kari', type: 'Curry', category: 'Food', price: '₹60–₹120', where: 'Hotel Aryaas, Ambika Vilas', desc: 'Distinct spiced curry with jackfruit and local spices.', emoji: '🍛', veg: true },
    // Coimbatore
    { id: 22, district: 'Coimbatore', name: 'Annapoorna Hotel Sambar', type: 'Meal', category: 'Food', price: '₹60–₹120', where: 'Annapoorna Hotel, East Street', desc: 'Legendary sambar-idli combo that\'s a rite of passage.', emoji: '🥣', veg: true },
    { id: 23, district: 'Coimbatore', name: 'Wet Grinder (Gift)', type: 'Appliance', category: 'Return Gift', price: '₹2,500–₹15,000', where: 'Ultra Electronics, Santha Electronics', desc: 'Coimbatore manufactures 90% of India\'s wet grinders.', emoji: '⚙️', veg: true },
    // Trichy
    { id: 24, district: 'Tiruchirappalli', name: 'Manapparai Murukku', type: 'Snack', category: 'Return Gift', price: '₹80–₹150/kg', where: 'Manapparai town (30km from Trichy)', desc: 'GI-tagged crispy rice murukku, exported worldwide.', emoji: '🌀', veg: true },
    // Kodaikanal
    { id: 25, district: 'Dindigul', name: 'Kodaikanal Homemade Wine', type: 'Beverage', category: 'Food', price: '₹150–₹350/bottle', where: 'Bryant Park area, local homestays', desc: 'Fruit wines made from plum, strawberry, and eucalyptus.', emoji: '🍷', veg: true },
    { id: 26, district: 'Dindigul', name: 'Kodai Cheese', type: 'Dairy', category: 'Return Gift', price: '₹200–₹400/block', where: 'Kodaikanal Cheese shops', desc: 'Fresh artisanal cheese made in the hills since 1950s.', emoji: '🧀', veg: true },
    // Rameswaram
    { id: 27, district: 'Ramanathapuram', name: 'Ramanathapuram Salt Fish', type: 'Snack', category: 'Return Gift', price: '₹150–₹300/kg', where: 'Rameswaram market', desc: 'Sun-dried salted fish — a coastal Tamil Nadu tradition.', emoji: '🐠', veg: false },
    // Vellore
    { id: 28, district: 'Vellore', name: 'Vellore Biryani', type: 'Meal', category: 'Food', price: '₹100–₹180', where: 'Agara Hotel, Sathya Hotel', desc: 'Unique local biryani style with seeraga samba + coconut milk.', emoji: '🍚', veg: false },
    { id: 29, district: 'Vellore', name: 'Leather Goods', type: 'Accessories', category: 'Shopping', price: '₹200–₹5,000', where: 'Vellore leather market, Santhapet', desc: 'Vellore is India\'s leather hub — bags, belts, footwear.', emoji: '👜', veg: false },
    // Salem
    { id: 30, district: 'Salem', name: 'Salem Mango', type: 'Fruit', category: 'Food', price: '₹60–₹120/kg', where: 'Salem Flower Market, fruit stalls (summer)', desc: 'Banganapalli mangoes – sweetest in Tamil Nadu during summer.', emoji: '🥭', veg: true },
    { id: 31, district: 'Salem', name: 'Thattu Vadai Set', type: 'Snack', category: 'Food', price: '₹20–₹50', where: 'Street stalls across Salem', desc: 'Thin wheat crackers layered with chutneys — evening snack.', emoji: '🫓', veg: true },
    // Kanchipuram
    { id: 32, district: 'Kanchipuram', name: 'Kanchipuram Silk Saree', type: 'Textile', category: 'Shopping', price: '₹3,000–₹1,00,000', where: 'Nalli Silks, Kumaran Silks, weaver clusters', desc: 'World-famous GI-tagged silk sarees with solid gold zari.', emoji: '🥻', veg: true },
    { id: 33, district: 'Kanchipuram', name: 'Kanchipuram Idli', type: 'Breakfast', category: 'Food', price: '₹30–₹60', where: 'Vasudevan Mess, Sri Devi Hotel', desc: 'Temple-style thick idli with ghee — served on banana leaf.', emoji: '🍘', veg: true },
]

const FILTERS = ['All', 'Food', 'Shopping', 'Return Gift']
const VEG_FILTERS = ['All', 'Veg Only', 'Non-Veg']
const DISTRICTS = ['All', ...Array.from(new Set(ALL_FOOD_DATA.map(f => f.district))).sort()]

const FoodGuide = () => {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [vegFilter, setVegFilter] = useState('All')
    const [district, setDistrict] = useState('All')

    const filtered = useMemo(() => ALL_FOOD_DATA.filter(f => {
        const mSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.district.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase())
        const mCat = category === 'All' || f.category === category
        const mVeg = vegFilter === 'All' || (vegFilter === 'Veg Only' && f.veg) || (vegFilter === 'Non-Veg' && !f.veg)
        const mDist = district === 'All' || f.district === district
        return mSearch && mCat && mVeg && mDist
    }), [search, category, vegFilter, district])

    const catColors = { Food: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', Shopping: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', 'Return Gift': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1e] px-4 md:px-6 pb-10 pt-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                        <UtensilsCrossed className="w-4 h-4" /> Tamil Nadu Food & Shopping Guide
                    </div>
                    <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">Taste Tamil Nadu 🍛</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Discover authentic food, unique shopping, and perfect return gifts from all 39 districts</p>
                </motion.div>

                {/* Search + Filters */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food, district, or keyword…"
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-12 pr-4 py-3.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 shadow-sm" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {/* Category */}
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setCategory(f)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${category === f ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300'}`}>{f}</button>
                        ))}
                        <div className="w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                        {/* Veg filter */}
                        {VEG_FILTERS.map(f => (
                            <button key={f} onClick={() => setVegFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${vegFilter === f ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-green-300'}`}>{f}</button>
                        ))}
                        <div className="w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                        {/* District */}
                        <select value={district} onChange={e => setDistrict(e.target.value)} className="px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-orange-200">
                            {DISTRICTS.map(d => <option key={d} value={d}>{d === 'All' ? '📍 All Districts' : d}</option>)}
                        </select>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-500">{filtered.length} items found</p>
                </motion.div>

                {/* Cards Grid */}
                <AnimatePresence mode="wait">
                    <motion.div key={`${category}-${vegFilter}-${district}-${search}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((item, i) => (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden group">
                                {/* Emoji Banner */}
                                <div className={`h-20 flex items-center justify-center text-5xl ${item.category === 'Food' ? 'bg-orange-50 dark:bg-orange-900/20' : item.category === 'Shopping' ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                                    {item.emoji}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-display font-bold text-slate-900 dark:text-white text-base leading-tight">{item.name}</h3>
                                        <div className="flex gap-1 shrink-0">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${catColors[item.category]}`}>{item.category}</span>
                                            {!item.veg && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">Non-veg</span>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{item.desc}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-1">
                                        <MapPin className="w-3 h-3" /> <span>{item.where}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-sm font-bold text-green-600 dark:text-green-400">{item.price}</span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{item.district}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-semibold">No results found</p>
                        <p className="text-slate-400 dark:text-slate-600 text-sm mt-1">Try a different district or category</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FoodGuide

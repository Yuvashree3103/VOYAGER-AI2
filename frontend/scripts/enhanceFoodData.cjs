const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../src/data/foodAndShopping.json')
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

// Metadata to add per item title
const meta = {
  // Chennai
  'Filter Coffee': { price_range: '₹10–30', where_to_buy: 'Saravana Bhavan, Murugan Idli Shop', best_time: 'Morning 6–10 AM', shelf_life: 'Serve immediately' },
  'Marina Sundal': { price_range: '₹20–50', where_to_buy: 'Marina Beach vendors', best_time: 'Evening 4–8 PM', shelf_life: '1 day' },
  'Atho Noodles': { price_range: '₹40–80', where_to_buy: 'Burma Bazaar, North Chennai stalls', best_time: 'Evening snack time', shelf_life: 'Same day' },
  'T. Nagar Textiles': { price_range: '₹200–5000', where_to_buy: 'Nalli, Kumaran Silks, Saravana Stores', best_time: 'Weekdays (less crowd)', shelf_life: 'N/A' },
  'Artificial Jewellery': { price_range: '₹100–1000', where_to_buy: 'Pondy Bazaar, Ranganathan St', best_time: 'Anytime', shelf_life: 'N/A' },
  'Jute & Eco Bags': { price_range: '₹80–300', where_to_buy: 'Khadi stores, T.Nagar shops', best_time: 'Anytime', shelf_life: 'N/A' },
  // Kanchipuram
  'Kanchipuram Idli': { price_range: '₹20–60', where_to_buy: 'Local hotels near Varadharaja Temple', best_time: 'Breakfast 7–10 AM', shelf_life: '4–6 hours' },
  'Kanchipuram Silk Sarees': { price_range: '₹3,000–1,00,000', where_to_buy: 'Nalli, Co-optex, Silk weaver shops', best_time: 'Anytime', shelf_life: 'N/A' },
  'Silk Stoles': { price_range: '₹300–1500', where_to_buy: 'Kanchipuram textile stores', best_time: 'Anytime', shelf_life: 'N/A' },
  // Madurai
  'Jigarthanda': { price_range: '₹60–120', where_to_buy: 'Famous Jigarthanda shops near Meenakshi Temple', best_time: 'Summer afternoons', shelf_life: 'Consume immediately' },
  'Bun Parotta': { price_range: '₹60–120', where_to_buy: 'Amma Mess, Murugan Idly shops', best_time: 'Dinner 7–10 PM', shelf_life: 'Same day' },
  'Mutton Biryani': { price_range: '₹120–200', where_to_buy: 'Hotel Jayaram, Amma Mess Madurai', best_time: 'Lunch 12–3 PM', shelf_life: '8 hours' },
  'Sungudi Sarees': { price_range: '₹500–5000', where_to_buy: 'Madurai textile shops, Meenakshi market', best_time: 'Anytime', shelf_life: 'N/A' },
  'Jasmine (Malli)': { price_range: '₹30–100/bundle', where_to_buy: 'Madurai flower market (Pazhamudhir Solai)', best_time: 'Morning 5–9 AM', shelf_life: '24 hours' },
  // Ooty/Nilgiris
  'Homemade Chocolates': { price_range: '₹50–300', where_to_buy: 'Govt Chocolate Factory, King Star Chocolates', best_time: 'Cool season (Oct–Feb)', shelf_life: '3–6 months' },
  'Varkey Biscuits': { price_range: '₹40–120', where_to_buy: 'Ooty bakeries, Nilgiri Dairy Farm', best_time: 'Anytime', shelf_life: '2 weeks' },
  'Nilgiri Tea': { price_range: '₹100–500', where_to_buy: 'Tea Factory outlets, Chamraj Tea Estate', best_time: 'Anytime', shelf_life: '18 months' },
  'Eucalyptus Oil': { price_range: '₹80–250', where_to_buy: 'Pharmacy shops, Govt stores Ooty', best_time: 'Anytime', shelf_life: '2 years' },
  'Assorted Chocolates Box': { price_range: '₹150–500', where_to_buy: 'King Star, Merit Chocolates', best_time: 'Cool months preferred', shelf_life: '3–6 months' },
  'Assorted Tea Boxes': { price_range: '₹200–600', where_to_buy: 'Tea estate shops near Ooty', best_time: 'Anytime', shelf_life: '18 months' },
  // Thanjavur
  'Thavala Vadai': { price_range: '₹30–50', where_to_buy: 'Temple streets near Brihadeeswarar', best_time: 'Morning & evening', shelf_life: 'Same day' },
  'Kumbakonam Degree Coffee': { price_range: '₹15–40', where_to_buy: 'Sri Bala Vilas, Murugan Coffee Kumbakonam', best_time: 'Morning 6–10 AM', shelf_life: 'Serve immediately' },
  'Thanjavur Paintings': { price_range: '₹500–50,000', where_to_buy: 'Thanjavur Art Gallery shops, TNHB complex', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Thalaiyatti Bommai': { price_range: '₹100–2000', where_to_buy: 'Kumbakonam road, Thanjavur craft shops', best_time: 'Anytime', shelf_life: 'Permanent' },
  // Tirunelveli
  'Iruttu Kadai Halwa': { price_range: '₹80–200/100g', where_to_buy: 'Iruttu Kadai, Sri Krishnasamy Halwa', best_time: 'Evening after 6 PM (night shop)', shelf_life: '15 days' },
  'Pathamadai Mats (Paai)': { price_range: '₹500–5000', where_to_buy: 'Pathamadai village shops, Tirunelveli govt emporium', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Korai Grass Hand Fans': { price_range: '₹80–300', where_to_buy: 'Pathamadai craft village', best_time: 'Summer (Apr–Jun)', shelf_life: 'Permanent' },
  // Kodaikanal
  'Kodai Chocolates': { price_range: '₹80–400', where_to_buy: 'Kodai Main Market stalls', best_time: 'Cool months (Oct–Mar)', shelf_life: '3–6 months' },
  'Garlic from Poombarai': { price_range: '₹60–120/kg', where_to_buy: 'Poombarai village weekly market', best_time: 'Nov–Jan harvest season', shelf_life: '2–3 months' },
  'Eucalyptus Products': { price_range: '₹100–350', where_to_buy: 'Kodai Bakery Lane shops', best_time: 'Anytime', shelf_life: '1–2 years' },
  'Handmade Jam & Pickles': { price_range: '₹80–250', where_to_buy: 'Kodai main market, HADCO stores', best_time: 'Anytime', shelf_life: '6–12 months' },
  // Coimbatore
  'Annapoorna Sambar': { price_range: '₹60–120/meal', where_to_buy: 'Annapoorna Restaurant, Coimbatore', best_time: 'Lunch 11 AM–3 PM', shelf_life: 'Same day' },
  'Arisi Paruppu Sadam': { price_range: '₹50–100', where_to_buy: 'Local mess restaurants', best_time: 'Lunch', shelf_life: 'Same day' },
  'Wet Grinders': { price_range: '₹2,500–8,000', where_to_buy: 'Elgi Ultra Showrooms, Coimbatore factories', best_time: 'Anytime', shelf_life: 'N/A' },
  'Cotton Kurtas': { price_range: '₹150–800', where_to_buy: 'Tiruppur garment outlets', best_time: 'Anytime', shelf_life: 'N/A' },
  // Salem
  'Thattu Vadai Set': { price_range: '₹30–60', where_to_buy: 'Salem bus stand stalls, Suramangalam area', best_time: 'Evening 4–8 PM', shelf_life: 'Same day' },
  'Salem Mangoes': { price_range: '₹60–150/kg', where_to_buy: 'Regulated market, Salem fruit stalls', best_time: 'April–June mango season', shelf_life: '5–7 days' },
  'Steel Utensils': { price_range: '₹100–2000', where_to_buy: 'Salem steel wholesale market', best_time: 'Anytime', shelf_life: 'N/A' },
  'Silver Anklets (Golusu)': { price_range: '₹300–1500', where_to_buy: 'Salem jewellery shops, Attur market', best_time: 'Anytime', shelf_life: 'N/A' },
  // Trichy
  'Manapparai Murukku': { price_range: '₹80–200/pack', where_to_buy: 'Manapparai shops, Trichy bus stand', best_time: 'Anytime', shelf_life: '30 days' },
  'Artificial Diamonds': { price_range: '₹200–2000', where_to_buy: 'Trichy Teppakulam area jewellery shops', best_time: 'Anytime', shelf_life: 'N/A' },
  'Murukku Packets': { price_range: '₹80–200/pack', where_to_buy: 'Manapparai town shops', best_time: 'Anytime', shelf_life: '30 days' },
  // Kumbakonam
  'Brass & Bronze Vessels': { price_range: '₹500–10,000', where_to_buy: 'Kammalar Streets, Kumbakonam', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Kamatchi Vilakku (Brass Lamp)': { price_range: '₹150–800', where_to_buy: 'Kumbakonam craft shops', best_time: 'Anytime', shelf_life: 'Permanent' },
  // Thoothukudi
  'Thoothukudi Macaroons': { price_range: '₹5–10/piece', where_to_buy: 'SJN Bakery, Jacob\'s Bakery Tuticorin', best_time: 'Anytime', shelf_life: '5–7 days' },
  'Poricha Parotta': { price_range: '₹60–100', where_to_buy: 'Thoothukudi local dhabas', best_time: 'Dinner', shelf_life: 'Same day' },
  'Sea Pearls': { price_range: '₹500–5000', where_to_buy: 'Certified shops near Thoothukudi port', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Box of Macaroons': { price_range: '₹100–300', where_to_buy: 'SJN Bakery, Jacob\'s Bakery', best_time: 'Anytime', shelf_life: '7 days' },
  // Kanyakumari
  'Fish Curry (Meen Kuzhambu)': { price_range: '₹80–150/plate', where_to_buy: 'Seafront restaurants near statue', best_time: 'Lunch 12–3 PM', shelf_life: 'Same day' },
  'Nendran Banana Chips': { price_range: '₹60–120/pack', where_to_buy: 'Kanyakumari market stalls', best_time: 'Anytime', shelf_life: '1 month' },
  'Coconut Shell Crafts': { price_range: '₹100–800', where_to_buy: 'Kanyakumari beach shops', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Shell Keychains & Décor': { price_range: '₹50–500', where_to_buy: 'Kanyakumari souvenir shops', best_time: 'Anytime', shelf_life: 'Permanent' },
  // Dindigul
  'Dindigul Biryani': { price_range: '₹120–200', where_to_buy: 'Dindigul Thalappakatti, Ponram', best_time: 'Lunch 11 AM–3 PM', shelf_life: '6 hours' },
  'Dindigul Locks': { price_range: '₹50–500', where_to_buy: 'Dindigul lock shopsgrown wholesale', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Miniature Dindigul Lock': { price_range: '₹50–200', where_to_buy: 'Dindigul souvenirs, TNHB emporium', best_time: 'Anytime', shelf_life: 'Permanent' },
  // Vellore
  'Mullu Kathirikai Curry': { price_range: '₹60–120/plate', where_to_buy: 'Local mess restaurants Vellore', best_time: 'Lunch', shelf_life: 'Same day' },
  'Leather Jackets & Shoes': { price_range: '₹500–5000', where_to_buy: 'Melvisharam leather hub', best_time: 'Anytime', shelf_life: 'N/A' },
  'Leather Wallet & Belt': { price_range: '₹200–800', where_to_buy: 'SIPCOT leather complex, Ranipet', best_time: 'Anytime', shelf_life: 'N/A' },
  // Tirupattur
  'Yelagiri Honey': { price_range: '₹150–400/500g', where_to_buy: 'Yelagiri hill shops', best_time: 'Oct–Feb harvest', shelf_life: '2 years' },
  'Jackfruit Preparations': { price_range: '₹40–100', where_to_buy: 'Village markets Tirupattur', best_time: 'April–June jackfruit season', shelf_life: '1–3 days' },
  'Forest Honey Bottles': { price_range: '₹200–500', where_to_buy: 'Yelagiri hill top shops', best_time: 'Anytime', shelf_life: '2 years' },
  // Tiruvannamalai
  'Pongal & Sambar': { price_range: '₹30–80/plate', where_to_buy: 'Temple street vendors', best_time: 'Morning Karthigai festival', shelf_life: 'Same day' },
  'Rudraksha Malas': { price_range: '₹150–2000', where_to_buy: 'Ramana Ashram gift shop', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Arani Silk Sarees': { price_range: '₹800–6000', where_to_buy: 'Arani town weaver shops', best_time: 'Anytime', shelf_life: 'N/A' },
  // Sivaganga / Chettinad
  'Chettinad Chicken Curry': { price_range: '₹150–300/plate', where_to_buy: 'Bangala Hotel Karaikudi, local mess', best_time: 'Lunch 12–3 PM', shelf_life: 'Same day' },
  'Vellai Paniyaram': { price_range: '₹40–80', where_to_buy: 'Chettinad breakfast stalls', best_time: 'Breakfast 7–10 AM', shelf_life: 'Same day' },
  'Athangudi Tiles': { price_range: '₹50–200/tile', where_to_buy: 'Athangudi village tile workshops', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Kottan Baskets': { price_range: '₹200–1200', where_to_buy: 'Rettanad village artisan shops', best_time: 'Anytime', shelf_life: 'Permanent' },
  // Dharmapuri
  'Ragi Kali': { price_range: '₹30–60', where_to_buy: 'Local village restaurants', best_time: 'Lunch', shelf_life: 'Same day' },
  'Dharmapuri Mangoes': { price_range: '₹50–100/kg', where_to_buy: 'Dharmapuri regulated market', best_time: 'April–June season', shelf_life: '5 days' },
  'Dried Mango Slices': { price_range: '₹80–200/pack', where_to_buy: 'Dharmapuri market stalls', best_time: 'Post-mango season (Jun–Aug)', shelf_life: '6 months' },
  // Krishnagiri
  'Krishnagiri Mango Varieties': { price_range: '₹60–150/kg', where_to_buy: 'Krishnagiri Aavin mango fair', best_time: 'April–June', shelf_life: '5 days' },
  'Rose Water & Products': { price_range: '₹50–200', where_to_buy: 'Krishnagiri market', best_time: 'Anytime', shelf_life: '1 year' },
  'Mango Pickles & Preserves': { price_range: '₹100–300', where_to_buy: 'Local pickle shops', best_time: 'Anytime', shelf_life: '1 year' },
  // Erode
  'Turmeric Rice': { price_range: '₹40–80', where_to_buy: 'Erode local hotel', best_time: 'Lunch', shelf_life: 'Same day' },
  'Pure Turmeric (Manjal)': { price_range: '₹80–200/250g', where_to_buy: 'Erode turmeric market yard', best_time: 'Jan–Mar post harvest', shelf_life: '2 years' },
  'Pure Turmeric Powder': { price_range: '₹60–150/200g', where_to_buy: 'Erode wholesale market', best_time: 'Anytime', shelf_life: '2 years' },
  // Tiruppur
  'Pallipalayam Chicken': { price_range: '₹120–200/plate', where_to_buy: 'Pallipalayam area roadside stalls', best_time: 'Dinner 7–10 PM', shelf_life: 'Same day' },
  'Banians & T-Shirts': { price_range: '₹100–500', where_to_buy: 'Tiruppur garment factory outlets', best_time: 'Anytime', shelf_life: 'N/A' },
  'Hosiery Sets & Sports Wear': { price_range: '₹150–600', where_to_buy: 'Tiruppur export surplus bazaar', best_time: 'Anytime', shelf_life: 'N/A' },
  // Namakkal
  'Egg Dishes': { price_range: '₹40–100', where_to_buy: 'Namakkal restaurants', best_time: 'Any meal', shelf_life: 'Same day' },
  'Sago (Sabudana) Packets': { price_range: '₹40–80/250g', where_to_buy: 'Rasipuram sago shops', best_time: 'Anytime', shelf_life: '1 year' },
  // Nagapattinam
  'Nagore Halwa': { price_range: '₹80–150/100g', where_to_buy: 'Nagore Dargah sweet stalls', best_time: 'Evening', shelf_life: '5 days' },
  'Fish Curry': { price_range: '₹80–150/plate', where_to_buy: 'Nagapattinam coastal restaurants', best_time: 'Lunch', shelf_life: 'Same day' },
  'Dry Fish': { price_range: '₹100–400/kg', where_to_buy: 'Nagapattinam fish market', best_time: 'Anytime', shelf_life: '6 months' },
  'Shell Mirrors & Décor': { price_range: '₹150–600', where_to_buy: 'Velankanni beach shops', best_time: 'Anytime', shelf_life: 'Permanent' },
  // Tenkasi
  'Courtallam Border Parotta': { price_range: '₹60–120', where_to_buy: 'Roadside stalls near Courtallam Falls', best_time: 'After waterfall visit', shelf_life: 'Same day' },
  'Cardamom & Spices': { price_range: '₹200–600/100g', where_to_buy: 'Tenkasi spice shops', best_time: 'Anytime', shelf_life: '1 year' },
  'Mixed Spice Boxes': { price_range: '₹150–400', where_to_buy: 'Tenkasi market', best_time: 'Anytime', shelf_life: '1 year' },
  // Ramanathapuram
  'Rameswaram Fish Fry': { price_range: '₹100–200', where_to_buy: 'Harbour restaurants, Rameswaram', best_time: 'Lunch & dinner', shelf_life: 'Same day' },
  'Conch Shells (Shangu)': { price_range: '₹100–1000', where_to_buy: 'Rameswaram temple street stalls', best_time: 'Anytime', shelf_life: 'Permanent' },
  'Shell Decoratives': { price_range: '₹50–500', where_to_buy: 'Pamban island shops', best_time: 'Anytime', shelf_life: 'Permanent' },
  // Virudhunagar
  'Srivilliputhur Palkova': { price_range: '₹120–180/250g', where_to_buy: 'AAVIN shops, Srivilliputhur town', best_time: 'Anytime', shelf_life: '10 days (refrigerated)' },
  'Virudhunagar Parotta': { price_range: '₹50–100', where_to_buy: 'Town dhabas', best_time: 'Dinner 7–10 PM', shelf_life: 'Same day' },
  'Palkova Tins': { price_range: '₹200–400', where_to_buy: 'AAVIN Srivilliputhur', best_time: 'Anytime', shelf_life: '10 days' },
  // Theni
  'Cardamom Dishes': { price_range: '₹20–40/cup tea', where_to_buy: 'Bodi tea shops', best_time: 'Morning', shelf_life: 'Same day' },
  'Fresh Cardamom': { price_range: '₹400–900/100g', where_to_buy: 'Bodi cardamom market', best_time: 'Oct–Dec harvest season', shelf_life: '6 months' },
  'Cardamom Spice Packs': { price_range: '₹200–500', where_to_buy: 'Bodi market', best_time: 'Anytime', shelf_life: '6 months' },
  // Pudukkottai
  'Muttarpa (Egg Sweet)': { price_range: '₹50–100', where_to_buy: 'Pudukkottai sweet shops', best_time: 'Festival times', shelf_life: '2 days' },
  'Fresh Cashew Nuts': { price_range: '₹300–600/250g', where_to_buy: 'Pudukkottai market', best_time: 'Feb–May season', shelf_life: '6 months' },
  'Roasted Cashew Boxes': { price_range: '₹250–500', where_to_buy: 'Local dry fruit shops', best_time: 'Anytime', shelf_life: '3 months' },
  // Karur
  'Murungai (Drumstick) Dishes': { price_range: '₹50–100', where_to_buy: 'Karur local hotels', best_time: 'Lunch', shelf_life: 'Same day' },
  'Kitchen Linen & Curtains': { price_range: '₹200–2000', where_to_buy: 'Karur export surplus shops', best_time: 'Anytime', shelf_life: 'N/A' },
  'Table Mats & Runners': { price_range: '₹150–600', where_to_buy: 'Karur handloom stores', best_time: 'Anytime', shelf_life: 'N/A' },
}

// Walk through all districts and items, add metadata
let enriched = 0
for (const district of Object.keys(data)) {
  for (const arr of ['food', 'buy']) {
    if (!data[district][arr]) continue
    data[district][arr] = data[district][arr].map(item => {
      const m = meta[item.title]
      if (m) { enriched++; return { ...item, ...m } }
      return item
    })
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
console.log(`✅ Done. Enriched ${enriched} items in ${Object.keys(data).length} districts.`)

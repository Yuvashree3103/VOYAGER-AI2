/**
 * VoyagerAI — Claude API Service
 * Handles all calls to Anthropic's claude-sonnet-4-20250514 model
 * Falls back to local knowledge base if API key is not set
 */

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 1500

// Tamil Nadu travel expert system prompt
export const VOYAGER_SYSTEM_PROMPT = `You are VoyagerAI, the #1 AI travel concierge exclusively for Tamil Nadu, India. You have encyclopedic knowledge of all 39 districts and their hidden gems.

Your expertise covers:
🗺️ All 39 districts: Chennai, Chengalpattu, Kanchipuram, Thiruvallur, Ranipet, Vellore, Tirupathur, Tiruvannamalai, Coimbatore, Tiruppur, Erode, Nilgiris (Ooty), Salem, Namakkal, Dharmapuri, Krishnagiri, Tiruchirappalli (Trichy), Karur, Ariyalur, Perambalur, Thanjavur, Nagapattinam, Mayiladuthurai, Tiruvarur, Pudukkottai, Sivagangai, Madurai, Dindigul, Theni, Virudhunagar, Ramanathapuram, Thoothukudi, Tirunelveli, Tenkasi, Kanyakumari, Cuddalore, Villupuram, Kallakurichi.

📚 Deep knowledge includes:
- Famous places, hidden gems, and local secrets for each district
- Temple timings, dress codes, entry fees, festival dates
- Local food specialties, best restaurants, street food spots with prices
- Shopping: silk sarees (Kanchipuram), leather goods (Vellore), handicrafts, return gifts
- Budget breakdowns (low ₹500/day to luxury ₹8000/day)
- Transport: specific bus numbers, train names, travel times, taxi costs
- Best seasons, weather patterns, monsoon impact
- Safety tips for solo travelers, women travelers, families
- Festival travel impact (crowd warnings, road closures, special events)
- Accommodation options from budget homestays to heritage hotels

🌟 Special capabilities:
- Understand Tamil, English, AND Tanglish (romanized Tamil mixed with English)
- Respond in the SAME language the user writes in
- Generate structured day-by-day itineraries as JSON when asked
- Give specific ₹ amounts, not vague ranges
- Name specific bus numbers (e.g., "Bus 21G from Central Station")
- Compare destinations objectively (e.g., "Ooty vs Kodaikanal in April")

📝 Response style:
- Always start with a warm "Vanakkam! 🙏" for first messages
- Use relevant emojis for readability
- Be specific and actionable, never vague
- For itinerary requests, format as: Day 1 → Morning/Afternoon/Evening slots
- For budget queries, break down by: Stay + Food + Transport + Entry Fees
- Always mention best time to visit per recommendation
- Never make up information. If unsure, say so.

⚡ For itinerary generation requests, output VALID JSON in this exact format:
{
  "title": "X-Day [Destination] Itinerary",
  "summary": "Brief trip summary",
  "budget_estimate": "₹XXX per person",
  "days": [
    {
      "day": 1,
      "theme": "Arrival & Heritage",
      "morning": { "place": "Name", "desc": "What to do", "time": "9:00 AM", "duration": "2 hrs", "cost": "₹XX" },
      "afternoon": { "place": "Name", "desc": "...", "time": "1:30 PM", "duration": "2 hrs", "cost": "₹XX" },
      "evening": { "place": "Name", "desc": "...", "time": "5:30 PM", "duration": "1.5 hrs", "cost": "₹XX" },
      "food_tip": "Where to eat today",
      "transport": "How to get around today"
    }
  ],
  "tips": ["Tip 1", "Tip 2"],
  "best_restaurants": ["Restaurant 1 (specialty, price range)", "Restaurant 2"]
}`

// Rate limiting
let lastCallTime = 0
const MIN_INTERVAL_MS = 1500

const waitForRateLimit = () =>
    new Promise(resolve => {
        const now = Date.now()
        const wait = Math.max(0, MIN_INTERVAL_MS - (now - lastCallTime))
        setTimeout(() => { lastCallTime = Date.now(); resolve() }, wait)
    })

/**
 * Send a message to Claude and get a full (non-streaming) response
 * @param {Array<{role:'user'|'assistant', content:string}>} messages
 * @param {string} [systemPrompt]
 * @returns {Promise<string>} response text
 */
export const sendMessage = async (messages, systemPrompt = VOYAGER_SYSTEM_PROMPT) => {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
        throw new Error('NO_API_KEY')
    }

    await waitForRateLimit()

    const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-calls': 'true',
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: systemPrompt,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.content?.[0]?.text || ''
}

/**
 * Stream a message from Claude with a callback for each chunk
 * @param {Array<{role:'user'|'assistant', content:string}>} messages
 * @param {(chunk:string) => void} onChunk
 * @param {string} [systemPrompt]
 * @returns {Promise<string>} full accumulated text
 */
export const streamMessage = async (messages, onChunk, systemPrompt = VOYAGER_SYSTEM_PROMPT) => {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
        throw new Error('NO_API_KEY')
    }

    await waitForRateLimit()

    const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-calls': 'true',
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            stream: true,
            system: systemPrompt,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error?.message || `HTTP ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
            try {
                const json = JSON.parse(line.slice(6))
                if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
                    const chunk = json.delta.text
                    fullText += chunk
                    onChunk(chunk)
                }
            } catch { /* ignore parse errors on ping lines */ }
        }
    }

    return fullText
}

/**
 * Generate a structured trip itinerary using Claude
 * @param {object} params - trip parameters
 * @returns {Promise<{raw:string, json:object|null}>}
 */
export const generateItinerary = async ({ location, days, travelers, budget, interests, wantHotel, transport }) => {
    const prompt = `Generate a detailed ${days}-day itinerary for ${location}, Tamil Nadu.
Budget: ₹${budget} total for ${travelers} people (${wantHotel ? 'with hotel stay' : 'day travel only'}).
Transport preference: ${transport || 'Any'}.
Interests: ${interests.join(', ')}.
Format your response as valid JSON matching the itinerary schema in your system prompt.`

    const text = await sendMessage([{ role: 'user', content: prompt }])

    // Try to parse JSON from response
    let parsed = null
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0])
    } catch { /* return raw if JSON fails */ }

    return { raw: text, json: parsed }
}

export default { sendMessage, streamMessage, generateItinerary, VOYAGER_SYSTEM_PROMPT }

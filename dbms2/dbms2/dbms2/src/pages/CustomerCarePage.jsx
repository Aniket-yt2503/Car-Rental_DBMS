import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useLenis from '../hooks/useLenis.js'
import Footer from '../components/Footer/Footer.jsx'

// ─── Animated robot background (CSS + SVG) ───────────────────────────────────
const robotBgStyles = `
@keyframes eyePulse { from { transform: scale(1); opacity: 0.8; } to { transform: scale(1.4); opacity: 1; } }
@keyframes soundBar { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }
@keyframes thinkDot { 0%, 100% { opacity: 0.2; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-5px); } }
@keyframes robotFloat { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
@keyframes circuitPulse { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.4; } }
@keyframes scanBeam { 0% { transform: translateY(-100%); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
@keyframes orbitRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes orbitRingRev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
@keyframes dataStream { 0% { transform: translateY(-100%); opacity: 0; } 100% { transform: translateY(100%); opacity: 0; } }
`

function RobotBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Deep space gradient */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.18) 0%, rgba(37,99,235,0.08) 40%, transparent 70%)' }} />

      {/* Circuit board lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.09]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 40 H30 M50 40 H80 M40 0 V30 M40 50 V80" stroke="#a855f7" strokeWidth="1.5" fill="none"/>
            <circle cx="40" cy="40" r="5" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
            <circle cx="0" cy="40" r="2.5" fill="#a855f7"/>
            <circle cx="80" cy="40" r="2.5" fill="#a855f7"/>
            <circle cx="40" cy="0" r="2.5" fill="#a855f7"/>
            <circle cx="40" cy="80" r="2.5" fill="#a855f7"/>
            <rect x="35" y="35" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>

      {/* Glowing corner accents */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(124,58,237,0.22) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />

      {/* Scan beam — Framer Motion */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)' }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      />

      {/* Big robot silhouette */}
      <motion.div
        className="absolute right-[-40px] top-1/2 -translate-y-1/2 select-none"
        style={{ fontSize: '380px', lineHeight: 1, filter: 'drop-shadow(0 0 50px rgba(168,85,247,0.4))' }}
        animate={{ y: [0, -14, 0], rotate: [-1, 1, -1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{ opacity: 0.07 }}>🤖</span>
      </motion.div>

      {/* Orbit rings — Framer Motion */}
      <div className="absolute right-20 top-1/2 -translate-y-1/2">
        {[120, 180, 240].map((r, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-purple-500/15"
            style={{ width: r * 2, height: r * 2, top: -r, left: -r }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute w-2.5 h-2.5 rounded-full bg-purple-400/50" style={{ top: -5, left: r - 5, boxShadow: '0 0 8px rgba(168,85,247,0.6)' }} />
          </motion.div>
        ))}
      </div>

      {/* Data streams — Framer Motion */}
      {[15, 30, 50, 70, 85].map((left, i) => (
        <motion.div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${left}%`, background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.2), transparent)' }}
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'linear', delay: i * 0.8 }}
        />
      ))}

      {/* Floating hex nodes — Framer Motion */}
      {[
        { top: '15%', left: '8%', size: 44, delay: 0 },
        { top: '60%', left: '5%', size: 32, delay: 0.8 },
        { top: '80%', left: '15%', size: 24, delay: 1.6 },
        { top: '25%', right: '8%', size: 36, delay: 0.4 },
        { top: '70%', right: '12%', size: 28, delay: 1.2 },
        { top: '45%', left: '20%', size: 20, delay: 2.0 },
      ].map((node, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center"
          style={{ ...node, width: node.size, height: node.size }}
          animate={{ opacity: [0.12, 0.45, 0.12], scale: [1, 1.1, 1] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="4"/>
          </svg>
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute w-1 h-1 rounded-full bg-purple-400/40"
          style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
    </div>
  )
}

// ─── Robot face ───────────────────────────────────────────────────────────────
function RobotFace({ speaking, thinking }) {
  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div
        className="w-20 h-20 mx-auto rounded-2xl relative"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          border: '2px solid rgba(168,85,247,0.5)',
          boxShadow: '0 0 25px rgba(168,85,247,0.35), inset 0 0 15px rgba(168,85,247,0.1)',
        }}
      >
        {/* Eyes */}
        <div className="absolute top-5 left-0 right-0 flex justify-center gap-4">
          {[0, 1].map(i => (
            <div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                background: speaking ? '#a855f7' : thinking ? '#f59e0b' : '#3b82f6',
                boxShadow: `0 0 12px ${speaking ? '#a855f7' : thinking ? '#f59e0b' : '#3b82f6'}`,
                animation: speaking ? 'eyePulse 0.35s ease-in-out infinite alternate' : 'none',
              }}
            />
          ))}
        </div>

        {/* Mouth */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          {speaking ? (
            <div className="flex gap-0.5 items-end">
              {[2, 4, 3, 5, 2, 4, 3].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-purple-400"
                  style={{
                    height: `${h * 2}px`,
                    animation: 'soundBar 0.25s ease-in-out infinite alternate',
                    animationDelay: `${i * 0.04}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="w-8 h-1.5 rounded-full" style={{ background: thinking ? 'rgba(245,158,11,0.7)' : 'rgba(168,85,247,0.5)' }} />
          )}
        </div>

        {/* Antenna */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-0.5 h-4 bg-purple-400/50" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ boxShadow: '0 0 8px #a855f7' }} />
        </div>
      </div>

      {/* Thinking dots */}
      {thinking && (
        <div className="absolute -right-1 top-3 flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{ animation: 'thinkDot 0.7s ease-in-out infinite', animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Bot responses ────────────────────────────────────────────────────────────
const BOT_RESPONSES = [
  { keywords: ['hello', 'hi', 'hey'], reply: "Hello! 👋 I'm VELO, your Phantom Ride assistant. How can I help you today?" },
  { keywords: ['book', 'rent', 'reserve'], reply: "Booking is easy! 🚗 Use the booking widget on our home page — pick location, dates, and car class. Need help with a specific step?" },
  { keywords: ['cancel'], reply: "I understand. 💙 Cancellations 24+ hours before pickup are fully refunded. Contact your pickup location or call us directly." },
  { keywords: ['price', 'cost', 'pricing', 'rate', 'fee'], reply: "Fully transparent pricing! 💰 Daily, weekly, 2-week, and monthly rates. Check the Pricing page. No hidden fees — ever." },
  { keywords: ['location', 'where', 'city', 'branch'], reply: "We have 20+ locations worldwide! 🌍 Toronto to Tokyo, London to LA. Visit our Locations page for details." },
  { keywords: ['upgrade', 'class'], reply: "Great news! ✨ If your class isn't available, we upgrade you for free. You always pay the price you booked." },
  { keywords: ['fuel', 'gas', 'tank'], reply: "Full-to-full policy. ⛽ We give you a full tank — please return it full. Fuel level is recorded at pickup and return." },
  { keywords: ['damage', 'accident', 'defect'], reply: "We trust our customers. 🤝 No defect recording at pickup or return. If there's an accident, contact us immediately." },
  { keywords: ['employee', 'staff', 'discount'], reply: "Staff benefits! 👔 50% off rentals under 2 weeks, 10% off for longer. Can't combine with promotions." },
  { keywords: ['promotion', 'promo', 'deal', 'offer'], reply: "Check our Vehicles page for this week's deal! 🎯 Up to 60% off on specific classes. Customer bookings only." },
  { keywords: ['thank', 'thanks', 'great', 'awesome', 'perfect'], reply: "You're so welcome! 😊 Anything else I can help with?" },
  { keywords: ['sorry', 'problem', 'issue', 'complaint', 'bad', 'wrong'], reply: "I'm truly sorry. 💙 Your experience matters deeply. Please share more and I'll escalate this immediately." },
  { keywords: ['odometer', 'mileage', 'km'], reply: "We record odometer at pickup and return. 📊 No mileage limits within Canada!" },
  { keywords: ['drop', 'return', 'one-way'], reply: "One-way rentals supported! 📍 Pick up in one city, drop off in another. Drop-off charge shown during booking." },
]

const DEFAULT_REPLY = "I'm here to help! 🤖 Could you tell me more? I can assist with bookings, pricing, locations, policies, and more."

function getBotReply(message) {
  const lower = message.toLowerCase()
  for (const { keywords, reply } of BOT_RESPONSES) {
    if (keywords.some(k => lower.includes(k))) return reply
  }
  return DEFAULT_REPLY
}

export default function CustomerCarePage() {
  useLenis()
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Hi there! 👋 I'm VELO, your Phantom Ride virtual assistant. I'm always here for you, sir. Whether it's bookings, pricing, locations, or anything else — I've got you covered. What can I help you with today? 💙" }
  ])
  const [input, setInput] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [thinking, setThinking] = useState(false)
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll only the messages container, not the page
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, thinking])

  // Prevent page scroll when input is focused
  const handleInputFocus = useCallback(() => {
    // Disable lenis scroll while typing
    document.body.style.overflow = 'auto'
  }, [])

  const handleInputBlur = useCallback(() => {
    document.body.style.overflow = ''
  }, [])

  function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || thinking) return

    const userMsg = { id: Date.now(), from: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    setTimeout(() => {
      setThinking(false)
      setSpeaking(true)
      const reply = getBotReply(userMsg.text)
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: reply }])
      setTimeout(() => setSpeaking(false), 2000)
    }, 900 + Math.random() * 700)
  }

  const quickReplies = ['How do I book?', 'Pricing info', 'Our locations', 'Upgrade policy', 'Fuel policy', 'Cancel booking']

  return (
    <div className="bg-gray-950 min-h-screen relative">
      <style>{robotBgStyles}</style>

      {/* Animated robot background */}
      <RobotBackground />

      {/* Hero */}
      <div className="relative pt-28 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <RobotFace speaking={speaking} thinking={thinking} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black text-white mb-2"
          >
            Customer{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Care</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 text-sm"
          >
            Chat with VELO — our AI assistant — available 24/7
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-400/70 text-xs mt-1 italic"
          >
            "Always here for you, sir." 💙
          </motion.p>
        </div>
      </div>

      {/* Chat + Contact */}
      <div className="max-w-3xl mx-auto px-6 pb-16 relative z-10">
        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden mb-6 backdrop-blur-md"
          style={{ boxShadow: '0 0 40px rgba(168,85,247,0.12), 0 0 80px rgba(168,85,247,0.05), inset 0 0 30px rgba(168,85,247,0.03)' }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/8 bg-white/3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm">🤖</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">VELO Assistant</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/40 text-xs">
                  {thinking ? 'Thinking…' : speaking ? 'Responding…' : 'Online · Instant replies'}
                </span>
              </div>
            </div>
          </div>

          {/* Messages — fixed height, internal scroll only */}
          <div
            ref={messagesRef}
            className="h-72 overflow-y-auto px-5 py-4 flex flex-col gap-3"
            style={{ overscrollBehavior: 'contain' }}
          >
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-br-sm'
                        : 'bg-white/8 border border-white/10 text-white/85 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {thinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/8 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'thinkDot 0.7s ease-in-out infinite', animationDelay: `${i * 0.18}s` }} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick replies */}
          <div className="px-5 py-2 border-t border-white/5 flex flex-wrap gap-1.5">
            {quickReplies.map(q => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="px-2.5 py-1 rounded-full text-xs border border-white/10 bg-white/5 text-white/50 hover:border-purple-500/40 hover:text-white/80 transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input — prevent page scroll on focus */}
          <form onSubmit={sendMessage} className="flex gap-3 px-5 py-4 border-t border-white/8">
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Type your message…"
              autoComplete="off"
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
            >
              Send
            </button>
          </form>
        </motion.div>

        {/* Direct contact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📞', title: 'Phone', detail: '+1 800-PHANTOM', sub: 'Mon–Sun 7AM–10PM' },
            { icon: '✉️', title: 'Email', detail: 'support@phantomride.ca', sub: 'Reply within 2 hours' },
            { icon: '💬', title: 'Live Chat', detail: 'Available in-app', sub: 'Avg wait: 2 min' },
          ].map(({ icon, title, detail, sub }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-white/20 transition-colors backdrop-blur-sm">
              <div className="text-3xl mb-3">{icon}</div>
              <p className="text-white font-semibold text-sm mb-1">{title}</p>
              <p className="text-purple-400 text-sm font-medium">{detail}</p>
              <p className="text-white/35 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

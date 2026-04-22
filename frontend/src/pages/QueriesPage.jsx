import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const QUERIES = [
  { id: 1, name: 'Active Renters',       desc: 'Last name of all customers currently renting a car' },
  { id: 2, name: 'Rented Cars',          desc: 'Make and color of all cars currently rented out' },
  { id: 3, name: 'Completed Rentals',    desc: 'For each completed rental: rental_price and rental_id' },
  { id: 4, name: 'Managers List',        desc: 'Last names of all managers' },
  { id: 5, name: 'Customer Names',       desc: 'Last and first names of all customers' },
  { id: 6, name: 'Staff-Customer Match', desc: 'Is any employee also a customer?' },
  { id: 7, name: 'President At HQ',      desc: 'Does our president work at headquarters?' },
  { id: 8, name: 'Shortest Rentals',     desc: 'rental_id of all shortest completed rentals' },
  { id: 9, name: 'Cheapest Rental',      desc: 'Price of the cheapest completed rental' },
  { id: 10, name: 'Unused Cars',         desc: 'Makes of cars that have never been rented' },
]

export default function QueriesPage() {
  const [results, setResults]     = useState({})
  const [loading, setLoading]     = useState({})
  const [activeQueryId, setActiveQueryId] = useState(null)

  async function runQuery(id) {
    setActiveQueryId(id)
    setLoading(prev => ({ ...prev, [id]: true }))
    try {
      const res  = await fetch(`${API_URL}/queries/${id}`)
      const body = await res.json()
      setResults(prev => ({ ...prev, [id]: body.data || body }))
    } catch (e) {
      setResults(prev => ({ ...prev, [id]: { error: e.message } }))
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const activeRes = activeQueryId ? results[activeQueryId] : null
  const isBoolean = activeRes && !Array.isArray(activeRes) && activeRes.answer !== undefined
  const rows      = Array.isArray(activeRes) ? activeRes : (activeRes && !activeRes.error ? [activeRes] : [])
  const keys      = rows.length > 0 ? Object.keys(rows[0]) : []

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(168,85,247,0.7)' }}>
          System Admin
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
          Database Queries
        </h1>
        <div className="phantom-divider w-32 mb-4" />
        <p className="text-white/40 text-sm max-w-xl">
          Execute the required analytical queries directly against the live MySQL database.
        </p>
      </motion.div>

      {/* Query cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {QUERIES.map((q, idx) => {
          const isLoading = loading[q.id]
          const isActive = activeQueryId === q.id
          
          return (
            <motion.div
              key={q.id}
              className={`glass-phantom rounded-2xl p-5 cursor-pointer transition-all border ${isActive ? 'border-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.3)]' : 'border-[rgba(124,58,237,0.15)] hover:border-[rgba(124,58,237,0.4)]'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.4 }}
              onClick={() => runQuery(q.id)}
              style={isActive ? { background: 'rgba(124,58,237,0.08)' } : {}}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                  style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.15))', border: '1px solid rgba(124,58,237,0.35)' }}
                >
                  Q{q.id}
                </div>
                <h3 className="text-white font-bold text-sm leading-tight">{q.name}</h3>
              </div>
              <p className="text-white/50 text-xs line-clamp-3 mb-4 min-h-[3rem]">
                {q.desc}
              </p>
              <div className="flex justify-end">
                <button
                  disabled={isLoading}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer border-none transition-all flex items-center gap-2"
                  style={{
                    background: isLoading ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#c084fc' : 'white',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {isLoading ? (
                    <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isActive ? 'Reload' : 'Run Query'
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Dedicated Results Panel */}
      <AnimatePresence>
        {activeQueryId && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 glass-phantom rounded-3xl overflow-hidden flex flex-col border border-purple-500/30 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
            style={{ minHeight: '350px' }}
          >
            {/* Panel Header */}
            <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(2,2,8,0.4)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-1 block">Query Results</span>
                <h2 className="text-xl font-bold text-white">Q{activeQueryId}: {QUERIES.find(q => q.id === activeQueryId)?.name}</h2>
              </div>
              <button 
                onClick={() => setActiveQueryId(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 transition-colors"
              >✕</button>
            </div>

            {/* Panel Body */}
            <div className="p-6 flex-1 overflow-auto bg-[rgba(2,2,8,0.7)]">
              {loading[activeQueryId] ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40 gap-3">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-mono uppercase tracking-widest">Executing SQL...</p>
                </div>
              ) : !activeRes ? (
                <div className="h-full flex items-center justify-center text-white/30 text-sm">No data returned</div>
              ) : activeRes.error ? (
                <div className="rounded-xl p-4 text-red-300 text-sm bg-red-500/10 border border-red-500/30">
                  <strong className="block mb-1 text-red-400">SQL Error:</strong>
                  {activeRes.error}
                </div>
              ) : isBoolean ? (
                <div className="h-full flex items-center justify-center">
                  <div
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-2xl font-black shadow-xl"
                    style={{
                      background:   activeRes.answer === 'YES' ? 'rgba(6,182,212,0.1)' : 'rgba(239,68,68,0.1)',
                      border:       `2px solid ${activeRes.answer === 'YES' ? 'rgba(6,182,212,0.4)' : 'rgba(239,68,68,0.4)'}`,
                      color:        activeRes.answer === 'YES' ? '#22d3ee' : '#f87171',
                    }}
                  >
                    {activeRes.answer === 'YES' ? '✓' : '✗'} {activeRes.answer}
                  </div>
                </div>
              ) : rows.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/30 text-sm italic">
                  Query returned 0 rows.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-purple-500/20">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead style={{ background: 'rgba(124,58,237,0.15)' }}>
                      <tr>
                        {keys.map(k => (
                          <th key={k} className="px-5 py-3 font-bold uppercase tracking-widest text-[10px]" style={{ color: 'rgba(196,181,253,0.9)', borderBottom: '1px solid rgba(124,58,237,0.3)' }}>
                            {k.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rows.map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.04] transition-colors">
                          {keys.map(k => (
                            <td key={k} className="px-5 py-3 text-white/80 font-mono text-xs">{row[k] ?? <span className="text-white/20 italic">NULL</span>}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

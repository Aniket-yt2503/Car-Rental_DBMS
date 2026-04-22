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

  async function runQuery(id) {
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

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(168,85,247,0.7)' }}>
          System Admin
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
          Database Queries
        </h1>
        <div className="phantom-divider w-32 mb-4" />
        <p className="text-white/40 text-sm max-w-xl">
          Execute the 10 required analytical queries directly against the live MySQL database.
        </p>
      </motion.div>

      {/* Query cards */}
      <div className="space-y-4">
        {QUERIES.map((q, idx) => {
          const res       = results[q.id]
          const isLoading = loading[q.id]
          const isBoolean = res && !Array.isArray(res) && res.answer !== undefined
          const rows      = Array.isArray(res) ? res : (res && !res.error ? [res] : [])
          const keys      = rows.length > 0 ? Object.keys(rows[0]) : []

          return (
            <motion.div
              key={q.id}
              className="glass-phantom rounded-2xl overflow-hidden phantom-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.4 }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                    style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.15))', border: '1px solid rgba(124,58,237,0.35)' }}
                  >
                    {q.id}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{q.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{q.desc}</p>
                  </div>
                </div>

                <motion.button
                  onClick={() => runQuery(q.id)}
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.05 } : {}}
                  whileTap={!isLoading ? { scale: 0.96 } : {}}
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer border-none transition-all"
                  style={{
                    background: isLoading ? 'rgba(124,58,237,0.1)' : 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                    color: 'white',
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      Running
                    </span>
                  ) : 'Run'}
                </motion.button>
              </div>

              {/* Results pane */}
              <AnimatePresence>
                {res && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ borderTop: '1px solid rgba(124,58,237,0.18)' }}
                  >
                    <div className="p-5" style={{ background: 'rgba(2,2,8,0.6)' }}>
                      {res.error ? (
                        <p className="text-red-400 text-xs">{res.error}</p>
                      ) : isBoolean ? (
                        <div
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                          style={{
                            background:   res.answer === 'YES' ? 'rgba(6,182,212,0.1)' : 'rgba(239,68,68,0.1)',
                            border:       `1px solid ${res.answer === 'YES' ? 'rgba(6,182,212,0.4)' : 'rgba(239,68,68,0.4)'}`,
                            color:        res.answer === 'YES' ? '#22d3ee' : '#f87171',
                          }}
                        >
                          {res.answer === 'YES' ? '✓' : '✗'} {res.answer}
                        </div>
                      ) : rows.length === 0 ? (
                        <p className="text-white/30 text-xs italic">No records returned.</p>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
                          <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead style={{ background: 'rgba(124,58,237,0.08)' }}>
                              <tr>
                                {keys.map(k => (
                                  <th key={k} className="px-4 py-2.5 font-bold uppercase tracking-widest" style={{ color: 'rgba(168,85,247,0.8)', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
                                    {k.replace(/_/g, ' ')}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                              {rows.map((row, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                  {keys.map(k => (
                                    <td key={k} className="px-4 py-2.5 text-white/70">{row[k] ?? '—'}</td>
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
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

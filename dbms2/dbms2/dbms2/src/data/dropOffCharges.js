// Drop-off charges depend on: car class, pickup location, return location
// Format: { fromId, toId, carClass, charge }
// Same location = no charge (handled in logic)

const dropOffCharges = [
  // Toronto → other locations
  { fromId: 'LOC-001', toId: 'LOC-002', carClass: 'Subcompact', charge: 39.99 },
  { fromId: 'LOC-001', toId: 'LOC-002', carClass: 'Compact',    charge: 49.99 },
  { fromId: 'LOC-001', toId: 'LOC-002', carClass: 'Sedan',      charge: 64.99 },
  { fromId: 'LOC-001', toId: 'LOC-002', carClass: 'Luxury',     charge: 99.99 },

  { fromId: 'LOC-001', toId: 'LOC-003', carClass: 'Subcompact', charge: 29.99 },
  { fromId: 'LOC-001', toId: 'LOC-003', carClass: 'Compact',    charge: 39.99 },
  { fromId: 'LOC-001', toId: 'LOC-003', carClass: 'Sedan',      charge: 49.99 },
  { fromId: 'LOC-001', toId: 'LOC-003', carClass: 'Luxury',     charge: 79.99 },

  { fromId: 'LOC-001', toId: 'LOC-004', carClass: 'Subcompact', charge: 49.99 },
  { fromId: 'LOC-001', toId: 'LOC-004', carClass: 'Compact',    charge: 59.99 },
  { fromId: 'LOC-001', toId: 'LOC-004', carClass: 'Sedan',      charge: 74.99 },
  { fromId: 'LOC-001', toId: 'LOC-004', carClass: 'Luxury',     charge: 119.99 },

  // Vancouver → other locations
  { fromId: 'LOC-002', toId: 'LOC-001', carClass: 'Subcompact', charge: 39.99 },
  { fromId: 'LOC-002', toId: 'LOC-001', carClass: 'Compact',    charge: 49.99 },
  { fromId: 'LOC-002', toId: 'LOC-001', carClass: 'Sedan',      charge: 64.99 },
  { fromId: 'LOC-002', toId: 'LOC-001', carClass: 'Luxury',     charge: 99.99 },

  { fromId: 'LOC-002', toId: 'LOC-003', carClass: 'Subcompact', charge: 54.99 },
  { fromId: 'LOC-002', toId: 'LOC-003', carClass: 'Compact',    charge: 64.99 },
  { fromId: 'LOC-002', toId: 'LOC-003', carClass: 'Sedan',      charge: 84.99 },
  { fromId: 'LOC-002', toId: 'LOC-003', carClass: 'Luxury',     charge: 129.99 },

  { fromId: 'LOC-002', toId: 'LOC-004', carClass: 'Subcompact', charge: 34.99 },
  { fromId: 'LOC-002', toId: 'LOC-004', carClass: 'Compact',    charge: 44.99 },
  { fromId: 'LOC-002', toId: 'LOC-004', carClass: 'Sedan',      charge: 59.99 },
  { fromId: 'LOC-002', toId: 'LOC-004', carClass: 'Luxury',     charge: 89.99 },

  // Montreal → other locations
  { fromId: 'LOC-003', toId: 'LOC-001', carClass: 'Subcompact', charge: 29.99 },
  { fromId: 'LOC-003', toId: 'LOC-001', carClass: 'Compact',    charge: 39.99 },
  { fromId: 'LOC-003', toId: 'LOC-001', carClass: 'Sedan',      charge: 49.99 },
  { fromId: 'LOC-003', toId: 'LOC-001', carClass: 'Luxury',     charge: 79.99 },

  { fromId: 'LOC-003', toId: 'LOC-002', carClass: 'Subcompact', charge: 54.99 },
  { fromId: 'LOC-003', toId: 'LOC-002', carClass: 'Compact',    charge: 64.99 },
  { fromId: 'LOC-003', toId: 'LOC-002', carClass: 'Sedan',      charge: 84.99 },
  { fromId: 'LOC-003', toId: 'LOC-002', carClass: 'Luxury',     charge: 129.99 },

  { fromId: 'LOC-003', toId: 'LOC-004', carClass: 'Subcompact', charge: 44.99 },
  { fromId: 'LOC-003', toId: 'LOC-004', carClass: 'Compact',    charge: 54.99 },
  { fromId: 'LOC-003', toId: 'LOC-004', carClass: 'Sedan',      charge: 69.99 },
  { fromId: 'LOC-003', toId: 'LOC-004', carClass: 'Luxury',     charge: 109.99 },

  // Calgary → other locations
  { fromId: 'LOC-004', toId: 'LOC-001', carClass: 'Subcompact', charge: 49.99 },
  { fromId: 'LOC-004', toId: 'LOC-001', carClass: 'Compact',    charge: 59.99 },
  { fromId: 'LOC-004', toId: 'LOC-001', carClass: 'Sedan',      charge: 74.99 },
  { fromId: 'LOC-004', toId: 'LOC-001', carClass: 'Luxury',     charge: 119.99 },

  { fromId: 'LOC-004', toId: 'LOC-002', carClass: 'Subcompact', charge: 34.99 },
  { fromId: 'LOC-004', toId: 'LOC-002', carClass: 'Compact',    charge: 44.99 },
  { fromId: 'LOC-004', toId: 'LOC-002', carClass: 'Sedan',      charge: 59.99 },
  { fromId: 'LOC-004', toId: 'LOC-002', carClass: 'Luxury',     charge: 89.99 },

  { fromId: 'LOC-004', toId: 'LOC-003', carClass: 'Subcompact', charge: 44.99 },
  { fromId: 'LOC-004', toId: 'LOC-003', carClass: 'Compact',    charge: 54.99 },
  { fromId: 'LOC-004', toId: 'LOC-003', carClass: 'Sedan',      charge: 69.99 },
  { fromId: 'LOC-004', toId: 'LOC-003', carClass: 'Luxury',     charge: 109.99 },
]

export default dropOffCharges

/**
 * Look up the drop-off charge for a specific route and car class.
 * Returns null if same location or no entry found.
 */
export function lookupDropOffCharge(fromId, toId, carClass) {
  if (!fromId || !toId || fromId === toId) return null
  const entry = dropOffCharges.find(
    d => d.fromId === fromId && d.toId === toId && d.carClass === carClass
  )
  return entry ? entry.charge : 49.99 // fallback flat fee
}

// ── New locations (LOC-005 Ottawa, LOC-006 Edmonton, LOC-007 Winnipeg, LOC-008 Halifax) ──

// Ottawa routes
const ottawaRoutes = [
  { toId: 'LOC-001', charges: [29.99, 39.99, 49.99, 79.99] },
  { toId: 'LOC-002', charges: [59.99, 74.99, 94.99, 149.99] },
  { toId: 'LOC-003', charges: [24.99, 34.99, 44.99, 69.99] },
  { toId: 'LOC-004', charges: [54.99, 69.99, 89.99, 139.99] },
  { toId: 'LOC-006', charges: [59.99, 74.99, 94.99, 149.99] },
  { toId: 'LOC-007', charges: [44.99, 54.99, 69.99, 109.99] },
  { toId: 'LOC-008', charges: [34.99, 44.99, 54.99, 84.99] },
]

const CLASSES = ['Subcompact', 'Compact', 'Sedan', 'Luxury']

ottawaRoutes.forEach(r => {
  CLASSES.forEach((cls, i) => {
    dropOffCharges.push({ fromId: 'LOC-005', toId: r.toId, carClass: cls, charge: r.charges[i] })
    dropOffCharges.push({ fromId: r.toId, toId: 'LOC-005', carClass: cls, charge: r.charges[i] })
  })
})

// Edmonton routes
const edmontonRoutes = [
  { toId: 'LOC-001', charges: [54.99, 69.99, 89.99, 139.99] },
  { toId: 'LOC-002', charges: [29.99, 39.99, 49.99, 79.99] },
  { toId: 'LOC-003', charges: [59.99, 74.99, 94.99, 149.99] },
  { toId: 'LOC-004', charges: [24.99, 34.99, 44.99, 69.99] },
  { toId: 'LOC-007', charges: [44.99, 54.99, 69.99, 109.99] },
  { toId: 'LOC-008', charges: [64.99, 79.99, 99.99, 159.99] },
]

edmontonRoutes.forEach(r => {
  CLASSES.forEach((cls, i) => {
    dropOffCharges.push({ fromId: 'LOC-006', toId: r.toId, carClass: cls, charge: r.charges[i] })
    dropOffCharges.push({ fromId: r.toId, toId: 'LOC-006', carClass: cls, charge: r.charges[i] })
  })
})

// Winnipeg routes
const winnipegRoutes = [
  { toId: 'LOC-001', charges: [44.99, 54.99, 69.99, 109.99] },
  { toId: 'LOC-002', charges: [44.99, 54.99, 69.99, 109.99] },
  { toId: 'LOC-003', charges: [39.99, 49.99, 64.99, 99.99] },
  { toId: 'LOC-004', charges: [39.99, 49.99, 64.99, 99.99] },
  { toId: 'LOC-008', charges: [54.99, 69.99, 89.99, 139.99] },
]

winnipegRoutes.forEach(r => {
  CLASSES.forEach((cls, i) => {
    dropOffCharges.push({ fromId: 'LOC-007', toId: r.toId, carClass: cls, charge: r.charges[i] })
    dropOffCharges.push({ fromId: r.toId, toId: 'LOC-007', carClass: cls, charge: r.charges[i] })
  })
})

// Halifax routes
const halifaxRoutes = [
  { toId: 'LOC-001', charges: [34.99, 44.99, 54.99, 84.99] },
  { toId: 'LOC-002', charges: [64.99, 79.99, 99.99, 159.99] },
  { toId: 'LOC-003', charges: [29.99, 39.99, 49.99, 79.99] },
  { toId: 'LOC-004', charges: [64.99, 79.99, 99.99, 159.99] },
]

halifaxRoutes.forEach(r => {
  CLASSES.forEach((cls, i) => {
    dropOffCharges.push({ fromId: 'LOC-008', toId: r.toId, carClass: cls, charge: r.charges[i] })
    dropOffCharges.push({ fromId: r.toId, toId: 'LOC-008', carClass: cls, charge: r.charges[i] })
  })
})

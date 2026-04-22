const locations = [
  // ── North America ──────────────────────────────────────────────────────────
  { id: "LOC-001", name: "Toronto Downtown", streetAddress: "123 Bay Street", city: "Toronto", province: "ON", country: "Canada", postalCode: "M5J 2T3", lat: 43.6532, lng: -79.3832, phone: "+1 416-555-0100", hours: "Mon–Sun 7:00 AM – 10:00 PM" },
  { id: "LOC-002", name: "Vancouver Waterfront", streetAddress: "456 Burrard Street", city: "Vancouver", province: "BC", country: "Canada", postalCode: "V6C 2G8", lat: 49.2827, lng: -123.1207, phone: "+1 604-555-0200", hours: "Mon–Sun 7:00 AM – 10:00 PM" },
  { id: "LOC-003", name: "Montreal Old Port", streetAddress: "789 Rue Notre-Dame Ouest", city: "Montreal", province: "QC", country: "Canada", postalCode: "H2Y 1T2", lat: 45.5017, lng: -73.5673, phone: "+1 514-555-0300", hours: "Mon–Sun 8:00 AM – 9:00 PM" },
  { id: "LOC-004", name: "Calgary City Centre", streetAddress: "321 Centre Street SW", city: "Calgary", province: "AB", country: "Canada", postalCode: "T2G 2B7", lat: 51.0447, lng: -114.0719, phone: "+1 403-555-0400", hours: "Mon–Sun 7:30 AM – 9:30 PM" },
  { id: "LOC-005", name: "Ottawa Parliament Hill", streetAddress: "55 Sparks Street", city: "Ottawa", province: "ON", country: "Canada", postalCode: "K1P 5A9", lat: 45.4215, lng: -75.6972, phone: "+1 613-555-0500", hours: "Mon–Fri 8:00 AM – 8:00 PM" },
  { id: "LOC-006", name: "Edmonton Whyte Ave", streetAddress: "8210 – 105 Street NW", city: "Edmonton", province: "AB", country: "Canada", postalCode: "T6E 4H2", lat: 53.5461, lng: -113.4938, phone: "+1 780-555-0600", hours: "Mon–Sun 8:00 AM – 9:00 PM" },
  { id: "LOC-007", name: "Winnipeg Exchange District", streetAddress: "100 Arthur Street", city: "Winnipeg", province: "MB", country: "Canada", postalCode: "R3B 1H3", lat: 49.8951, lng: -97.1384, phone: "+1 204-555-0700", hours: "Mon–Sat 8:00 AM – 8:00 PM" },
  { id: "LOC-008", name: "Halifax Waterfront", streetAddress: "1869 Upper Water Street", city: "Halifax", province: "NS", country: "Canada", postalCode: "B3J 1S9", lat: 44.6488, lng: -63.5752, phone: "+1 902-555-0800", hours: "Mon–Sun 8:00 AM – 8:00 PM" },
  { id: "LOC-009", name: "New York Midtown", streetAddress: "350 Fifth Avenue", city: "New York", province: "NY", country: "USA", postalCode: "10118", lat: 40.7484, lng: -73.9967, phone: "+1 212-555-0900", hours: "Mon–Sun 6:00 AM – 11:00 PM" },
  { id: "LOC-010", name: "Los Angeles Beverly Hills", streetAddress: "9876 Wilshire Blvd", city: "Los Angeles", province: "CA", country: "USA", postalCode: "90210", lat: 34.0736, lng: -118.4004, phone: "+1 310-555-1000", hours: "Mon–Sun 7:00 AM – 10:00 PM" },
  { id: "LOC-011", name: "Chicago The Loop", streetAddress: "233 S Wacker Drive", city: "Chicago", province: "IL", country: "USA", postalCode: "60606", lat: 41.8789, lng: -87.6359, phone: "+1 312-555-1100", hours: "Mon–Sun 7:00 AM – 10:00 PM" },
  { id: "LOC-012", name: "Miami South Beach", streetAddress: "1601 Collins Avenue", city: "Miami", province: "FL", country: "USA", postalCode: "33139", lat: 25.7617, lng: -80.1918, phone: "+1 305-555-1200", hours: "Mon–Sun 7:00 AM – 11:00 PM" },

  // ── Europe ─────────────────────────────────────────────────────────────────
  { id: "LOC-013", name: "London Mayfair", streetAddress: "45 Park Lane", city: "London", province: "England", country: "UK", postalCode: "W1K 1PN", lat: 51.5074, lng: -0.1278, phone: "+44 20-5555-1300", hours: "Mon–Sun 7:00 AM – 10:00 PM" },
  { id: "LOC-014", name: "Paris Champs-Élysées", streetAddress: "101 Avenue des Champs-Élysées", city: "Paris", province: "Île-de-France", country: "France", postalCode: "75008", lat: 48.8566, lng: 2.3522, phone: "+33 1-5555-1400", hours: "Mon–Sun 8:00 AM – 9:00 PM" },
  { id: "LOC-015", name: "Berlin Mitte", streetAddress: "Unter den Linden 77", city: "Berlin", province: "Berlin", country: "Germany", postalCode: "10117", lat: 52.5200, lng: 13.4050, phone: "+49 30-5555-1500", hours: "Mon–Sun 7:00 AM – 9:00 PM" },
  { id: "LOC-016", name: "Dubai Downtown", streetAddress: "Sheikh Mohammed bin Rashid Blvd", city: "Dubai", province: "Dubai", country: "UAE", postalCode: "00000", lat: 25.2048, lng: 55.2708, phone: "+971 4-555-1600", hours: "Mon–Sun 6:00 AM – 12:00 AM" },

  // ── Asia-Pacific ───────────────────────────────────────────────────────────
  { id: "LOC-017", name: "Tokyo Shibuya", streetAddress: "2-21-1 Dogenzaka", city: "Tokyo", province: "Tokyo", country: "Japan", postalCode: "150-0043", lat: 35.6762, lng: 139.6503, phone: "+81 3-5555-1700", hours: "Mon–Sun 7:00 AM – 10:00 PM" },
  { id: "LOC-018", name: "Sydney CBD", streetAddress: "1 Martin Place", city: "Sydney", province: "NSW", country: "Australia", postalCode: "2000", lat: -33.8688, lng: 151.2093, phone: "+61 2-5555-1800", hours: "Mon–Sun 7:00 AM – 9:00 PM" },
  { id: "LOC-019", name: "Singapore Marina Bay", streetAddress: "10 Bayfront Avenue", city: "Singapore", province: "Central", country: "Singapore", postalCode: "018956", lat: 1.2834, lng: 103.8607, phone: "+65 6555-1900", hours: "Mon–Sun 6:00 AM – 11:00 PM" },
  { id: "LOC-020", name: "Mumbai Bandra", streetAddress: "Linking Road, Bandra West", city: "Mumbai", province: "Maharashtra", country: "India", postalCode: "400050", lat: 19.0760, lng: 72.8777, phone: "+91 22-5555-2000", hours: "Mon–Sun 8:00 AM – 9:00 PM" },
]

export default locations

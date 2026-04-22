export const CARS = [
  { id: 'C-001', make: 'Toyota', model: 'Yaris', year: 2025, color: 'Nebula Blue', class: 'subcompact', plate: 'AUR-X01', available: true },
  { id: 'C-002', make: 'Honda', model: 'Fit', year: 2024, color: 'Cosmic Silver', class: 'subcompact', plate: 'AUR-X02', available: false },
  { id: 'C-003', make: 'Ford', model: 'Fiesta', year: 2024, color: 'Ruby Red', class: 'subcompact', plate: 'AUR-X03', available: true },
  
  { id: 'C-011', make: 'Volkswagen', model: 'Golf', year: 2025, color: 'Pure White', class: 'compact', plate: 'AUR-Y01', available: true },
  { id: 'C-012', make: 'Mazda', model: '3', year: 2025, color: 'Machine Gray', class: 'compact', plate: 'AUR-Y02', available: true },
  
  { id: 'C-021', make: 'Toyota', model: 'Camry', year: 2025, color: 'Midnight Black', class: 'sedan', plate: 'AUR-Z01', available: true },
  { id: 'C-022', make: 'Honda', model: 'Accord', year: 2024, color: 'Lunar Silver', class: 'sedan', plate: 'AUR-Z02', available: false },
  
  { id: 'C-031', make: 'Mercedes-Benz', model: 'S-Class', year: 2026, color: 'Obsidian', class: 'luxury', plate: 'AUR-L01', available: true },
  { id: 'C-032', make: 'BMW', model: '7 Series', year: 2025, color: 'Carbon Black', class: 'luxury', plate: 'AUR-L02', available: true },
];

export const LOCATIONS = [
  { id: 'L-01', name: 'Downtown Hub', street: '100 Neon St', city: 'Metropolis', province: 'NY', postalCode: '10001' },
  { id: 'L-02', name: 'Aero Terminal', street: '500 Flight Blvd', city: 'Metropolis', province: 'NY', postalCode: '10045' },
  { id: 'L-03', name: 'Westside Station', street: '77 Silicon Ave', city: 'Metropolis', province: 'NY', postalCode: '10014' },
];

export const PRICING = {
  subcompact: { base: 28 },
  compact: { base: 42 },
  sedan: { base: 75 },
  luxury: { base: 180 },
};

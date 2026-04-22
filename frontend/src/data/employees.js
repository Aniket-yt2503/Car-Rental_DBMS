// Employee categories: driver, cleaner, clerk, manager
// All employees have driver's license
// Headquarters in Hamilton — all managers there
const employees = [
  {
    id: 'EMP-001',
    name: 'Margaret Chen',
    address: '10 King St W, Hamilton, ON L8P 1A1',
    phones: ['905-555-0101'],
    driversLicense: 'DL-ON-001',
    category: 'manager',
    title: 'President',
    locationId: 'LOC-HQ',
  },
  {
    id: 'EMP-002',
    name: 'David Okafor',
    address: '22 Main St E, Hamilton, ON L8N 1G6',
    phones: ['905-555-0102'],
    driversLicense: 'DL-ON-002',
    category: 'manager',
    title: 'Vice-President, Operations',
    locationId: 'LOC-HQ',
  },
  {
    id: 'EMP-003',
    name: 'Sophie Tremblay',
    address: '45 James St N, Hamilton, ON L8R 2K3',
    phones: ['905-555-0103'],
    driversLicense: 'DL-ON-003',
    category: 'manager',
    title: 'Vice-President, Marketing',
    locationId: 'LOC-HQ',
  },
  {
    id: 'EMP-004',
    name: 'James Park',
    address: '88 Bay St, Toronto, ON M5J 2T3',
    phones: ['416-555-0201'],
    driversLicense: 'DL-ON-004',
    category: 'clerk',
    title: 'Rental Clerk',
    locationId: 'LOC-001',
  },
  {
    id: 'EMP-005',
    name: 'Aisha Patel',
    address: '200 Burrard St, Vancouver, BC V6C 3L6',
    phones: ['604-555-0301'],
    driversLicense: 'DL-BC-001',
    category: 'driver',
    title: 'Driver',
    locationId: 'LOC-002',
  },
  {
    id: 'EMP-006',
    name: 'Luc Fontaine',
    address: '300 Rue Notre-Dame, Montreal, QC H2Y 1C6',
    phones: ['514-555-0401'],
    driversLicense: 'DL-QC-001',
    category: 'cleaner',
    title: 'Vehicle Cleaner',
    locationId: 'LOC-003',
  },
  {
    id: 'EMP-007',
    name: 'Rachel Kim',
    address: '500 Centre St SW, Calgary, AB T2G 2B7',
    phones: ['403-555-0501', '403-555-0502'],
    driversLicense: 'DL-AB-001',
    category: 'clerk',
    title: 'Senior Clerk',
    locationId: 'LOC-004',
  },
]

export default employees

// Headquarters location
export const HEADQUARTERS = {
  id: 'LOC-HQ',
  name: 'Phantom Ride Headquarters',
  streetAddress: '1 Innovation Drive',
  city: 'Hamilton',
  province: 'ON',
  postalCode: 'L8P 4M2',
  lat: 43.2557,
  lng: -79.8711,
}

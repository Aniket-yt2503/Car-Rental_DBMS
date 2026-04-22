# Implementation Plan: car-rental-frontend

## Overview

Incremental implementation of a premium dark-themed car rental SPA using React 18 + Vite, Tailwind CSS v3, Framer Motion, GSAP + ScrollTrigger, and Lenis. Each task builds on the previous, starting with project scaffolding and ending with full integration. All data flows through API placeholder hooks backed by in-memory dummy datasets.

## Tasks

- [x] 1. Scaffold project and install dependencies
  - Initialise Vite + React project (`npm create vite@latest`)
  - Install all dependencies: `tailwindcss`, `framer-motion`, `lgsap`, `@gsap/react`, `lenis`, `react-simple-maps`, `date-fns`, `fast-check`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
  - Configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`, global `index.css`)
  - Set up Vitest config (`vitest.config.js`) with jsdom environment and `@testing-library/jest-dom` setup file
  - Create the full `src/` directory structure: `api/`, `data/`, `context/`, `hooks/`, `components/`, `utils/`
  - _Requirements: 15.1, 15.2_

- [x] 2. Create dummy datasets and API placeholder layer
  - [x] 2.1 Write dummy data files
    - `data/cars.js` — ≥8 cars across all four Car_Classes with `id`, `make`, `model`, `year`, `color`, `carClass`, `licensePlate`, `locationId`, `imageUrl`
    - `data/locations.js` — ≥4 locations with `id`, `name`, `streetAddress`, `city`, `province`, `postalCode`, `lat`, `lng`
    - `data/pricing.js` — 4 entries (one per class) with `carClass`, `perDay`, `perWeek`, `per2Weeks`, `perMonth`; include `dropOffCharge` constant
    - `data/promotions.js` — ≥1 promotion; exactly one entry has `active: true`
    - `data/reviews.js` — ≥4 reviews with `id`, `authorName`, `rating`, `body`, `date`
    - _Requirements: 15.3, 15.5, 9.2_

  - [x] 2.2 Write API placeholder functions
    - `api/cars.js` — `getCars()` returns `{ data: carsArray, error: null }` wrapped in try/catch
    - `api/locations.js` — `getLocations()`
    - `api/pricing.js` — `getPricing()`
    - `api/promotions.js` — `getPromotions()`
    - `api/rentals.js` — `createRental(bookingResult)` stub
    - Each function body is the only thing that changes when swapping to real HTTP calls
    - _Requirements: 15.2, 15.4_

  - [ ]* 2.3 Write integration tests for API placeholders and dummy data
    - Verify each placeholder returns `{ data, error }` shape
    - Verify data counts: ≥8 cars, ≥4 locations, 4 pricing entries, ≥1 active promotion, ≥4 reviews
    - Verify all Car_Class values are valid enum members
    - _Requirements: 15.3, 15.5_

  - [ ]* 2.4 Write property test for single active promotion (Property 7)
    - **Property 7: At most one active promotion at any time**
    - **Validates: Requirements 9.2**
    - Use `fc.array(fc.record({ active: fc.boolean(), ... }))` to generate arbitrary promotion arrays
    - Assert `getActivePromotion(promotions).length <= 1`

- [x] 3. Implement utility functions
  - [x] 3.1 Implement `utils/pricing.js`
    - `decomposeDays(n)` — greedy decomposition into months (30d), 2-weeks (14d), weeks (7d), days; returns `BillingLine[]` filtering `qty > 0`
    - `calculatePrice(booking, pricingEntry, promotion, mode)` — applies customer/employee discount rules; returns `finalPrice` rounded to 2 decimal places
    - `getDropOffCharge(pickupLocationId, returnLocationId, dropOffFee)` — returns fee or `null`
    - _Requirements: 7.5, 8.2, 8.3, 8.4, 8.5_

  - [x] 3.2 Implement `utils/validation.js`
    - `validateBookingForm(formData)` — returns `{ valid, errors }` object; checks non-empty locations and `returnDate > pickupDate`
    - `validateOdometer(start, end)` — returns `{ valid, error }` object; checks `end >= start`
    - _Requirements: 4.8, 7.10_

  - [ ]* 3.3 Write unit tests for utility functions
    - `decomposeDays`: concrete cases for 1, 7, 8, 14, 30, 45 days
    - `calculatePrice`: customer with matching promotion, customer without promotion, employee <14 days, employee ≥14 days
    - `validateBookingForm`: equal dates, return before pickup, empty location
    - `validateOdometer`: end < start, end === start, end > start
    - _Requirements: 4.8, 7.5, 7.10, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 3.4 Write property test for day decomposition lossless (Property 3)
    - **Property 3: Day decomposition is lossless**
    - **Validates: Requirements 7.5**
    - Generator: `fc.integer({ min: 1, max: 365 })`
    - Assert `sum(lines.map(l => l.quantity * unitDays[l.unit])) === n`

  - [ ]* 3.5 Write property test for date validation (Property 2)
    - **Property 2: Date validation rejects invalid ranges**
    - **Validates: Requirements 4.8**
    - Generator: `fc.date()` pairs where `returnDate <= pickupDate`
    - Assert `validateBookingForm(formData).valid === false`

  - [ ]* 3.6 Write property test for odometer validation (Property 4)
    - **Property 4: Odometer validation rejects reversed readings**
    - **Validates: Requirements 7.10**
    - Generator: `fc.integer()` pairs where `end < start`
    - Assert `validateOdometer(start, end).valid === false`

  - [ ]* 3.7 Write property test for customer discount (Property 5)
    - **Property 5: Customer mode applies promotion discount correctly**
    - **Validates: Requirements 8.2**
    - Generator: `fc.record({ basePrice: fc.float({ min: 1, max: 10000 }), discountPercent: fc.integer({ min: 1, max: 99 }) })`
    - Assert `finalPrice === round(basePrice * (1 - discountPercent / 100), 2)`

  - [ ]* 3.8 Write property test for employee discount (Property 6)
    - **Property 6: Employee mode discount is tier-correct and promotion-free**
    - **Validates: Requirements 8.3, 8.4, 8.5**
    - Generator: `fc.record({ basePrice: fc.float({ min: 1, max: 10000 }), totalDays: fc.integer({ min: 1, max: 365 }) })`
    - Assert correct multiplier (0.50 or 0.90) and no promotion applied

- [x] 4. Checkpoint — Ensure all utility tests pass
  - Run `vitest --run` and confirm all tests in `utils/` pass; ask the user if questions arise.

- [x] 5. Implement AppContext and global state
  - [x] 5.1 Create `context/AppContext.jsx`
    - Define `AppState` shape and `AppAction` union
    - Implement `appReducer` handling: `SET_MODE`, `LOADER_DONE`, `OPEN_BOOKING`, `CLOSE_BOOKING`
    - Export `AppContext`, `AppProvider` (wraps children with `useReducer`), and `useAppContext` hook
    - _Requirements: 8.1, 8.6_

  - [ ]* 5.2 Write integration tests for AppContext reducer
    - Test each action type transitions state correctly
    - Test initial state values
    - _Requirements: 8.1, 8.6_

- [x] 6. Implement custom hooks
  - [x] 6.1 Implement `hooks/useLenis.js`
    - Initialise `new Lenis()` on mount, register GSAP ScrollTrigger plugin, wire Lenis RAF loop to `ScrollTrigger.update()`
    - Return `lenis` instance for use by Navbar scroll-to
    - _Requirements: 13.1, 13.2_

  - [x] 6.2 Implement `hooks/useMagneticHover.js`
    - Accept `strength` param; on `mousemove` within bounding radius compute `dx/dy` and apply `transform: translate(dx, dy)` via ref
    - Reset on `mouseleave`
    - _Requirements: 2.6_

  - [x] 6.3 Implement `hooks/useTilt.js`
    - On `mousemove` compute `rotateX`/`rotateY` from pointer offset within card bounds
    - Reset to `0, 0` on `mouseleave` within 300 ms using a spring transition
    - _Requirements: 5.3, 5.5_

  - [x] 6.4 Implement `hooks/useScrollTrigger.js`
    - Utility hook that creates a GSAP ScrollTrigger for a given ref and animation config
    - Cleans up on unmount
    - _Requirements: 13.2, 13.3_

- [x] 7. Implement shared UI primitives (`components/ui/`)
  - [x] 7.1 Create `GlassCard.jsx`
    - Semi-transparent background, `backdrop-blur`, neon border via Tailwind utility classes
    - Accepts `children`, `className` props
    - _Requirements: 14.3_

  - [x] 7.2 Create `NeonBadge.jsx`
    - Pill badge with gradient border glow; accepts `label`, `color` props
    - _Requirements: 14.2_

  - [x] 7.3 Create `NeonButton.jsx`
    - CTA button with Framer Motion `whileHover={{ scale: 1.05 }}` and neon glow box-shadow
    - Accepts `children`, `onClick`, `type` props
    - _Requirements: 13.4, 14.2_

  - [x] 7.4 Create `GlowDot.jsx`
    - Pulsing CSS animation dot for map markers; accepts `color` prop
    - _Requirements: 6.2_

  - [x] 7.5 Create `SectionWrapper.jsx`
    - Consistent section padding; accepts `id`, `children`, `className` props
    - _Requirements: 15.1_

  - [ ]* 7.6 Write snapshot tests for shared UI primitives
    - Snapshot `GlassCard`, `NeonBadge`, `NeonButton` to catch unintended style regressions
    - _Requirements: 14.2, 14.3_

- [x] 8. Implement Loader component
  - [x] 8.1 Create `components/Loader/Loader.jsx`
    - Full-screen fixed overlay (`z-[9999]`), dark background
    - Brand name with Framer Motion character-stagger entrance
    - Progress bar driven by `useEffect` + `requestAnimationFrame` from 0 → 100 over ≥1.5 s
    - Wait for `document.readyState === 'complete'` before triggering exit; 8 s timeout fallback
    - Exit via Framer Motion `AnimatePresence` vertical slide-up + fade
    - Calls `onComplete` prop after exit animation finishes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 8.2 Write unit tests for Loader
    - Verify overlay renders on mount
    - Verify `onComplete` is called after progress reaches 100 and assets are ready
    - _Requirements: 1.3, 1.5_

  - [ ]* 8.3 Write property test for loader progress monotonicity (Property 1)
    - **Property 1: Loader progress is monotonically non-decreasing**
    - **Validates: Requirements 1.2**
    - Generator: `fc.float({ min: 0, max: 1.5 })` pairs `(t1, t2)` where `t1 < t2`
    - Assert `progress(t1) <= progress(t2)` and both values in `[0, 100]`

- [x] 9. Implement Navbar component
  - [x] 9.1 Create `components/Navbar/Navbar.jsx`
    - Render nav links for: Home, Vehicles, Locations, Pricing, About, FAQs
    - Track `scrollY` via `window.scrollY` listener
    - At `scrollY === 0`: centered pill shape (`left-1/2 -translate-x-1/2`, `position: fixed`)
    - At `scrollY > 80`: full-width top-anchored with backdrop-blur glass style
    - Framer Motion `layout` + `animate` transition ≤ 400 ms between states
    - Apply `useMagneticHover` to each nav link
    - On link click: call `lenis.scrollTo(sectionId)` via context
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 10. Implement Hero section
  - [x] 10.1 Create `components/Hero/Hero.jsx`
    - Full-viewport section (`h-screen`)
    - Animated CSS gradient mesh background (looping GSAP keyframe or CSS animation)
    - `onMouseMove` handler updates `--glow-x` / `--glow-y` CSS custom properties; radial gradient overlay reads them
    - Headline text with Framer Motion `staggerChildren` on word spans, total duration ≤ 1.2 s
    - GSAP ScrollTrigger `scrub: true` parallax on background layer (`y: "30%"` at bottom)
    - Render `<BookingWidget />` as primary interactive element
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 11. Implement BookingWidget component
  - [x] 11.1 Create `components/BookingWidget/BookingWidget.jsx`
    - Pickup location input, return location input (defaults to pickup value)
    - Pickup date and return date inputs (date only)
    - Car_Class selector: Subcompact, Compact, Sedan, Luxury
    - Hint text: "Higher class may be assigned at same price."
    - Drop-off charge hint shown when `returnLocation !== pickupLocation`
    - On submit: call `validateBookingForm`; on success dispatch `OPEN_BOOKING` to AppContext
    - Inline validation error messages below fields
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [ ]* 11.2 Write unit tests for BookingWidget
    - Renders all fields
    - Shows drop-off hint when locations differ
    - Shows validation error and blocks submit when return date ≤ pickup date
    - _Requirements: 4.7, 4.8_

- [x] 12. Implement Vehicles section
  - [x] 12.1 Create `components/Vehicles/CarCard.jsx`
    - Display: make, model, year, color, Car_Class badge (`NeonBadge`), vehicle ID, license plate
    - Apply `useTilt` hook for 3D tilt + glow on hover; reset within 300 ms on leave
    - Image zoom on hover via Framer Motion `whileHover`
    - Wrapped in `GlassCard`
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [x] 12.2 Create `components/Vehicles/Vehicles.jsx`
    - Fetch from `getCars()` on mount; handle loading/error states
    - Local state: `activeClassFilter`, `activeLocationFilter`
    - Filter controls for Car_Class and location
    - Render filtered `<CarCard />` grid with Framer Motion `AnimatePresence` + `layout` for filter transitions
    - GSAP ScrollTrigger stagger entrance on card elements
    - _Requirements: 5.1, 5.6, 5.7, 5.8, 5.9_

- [x] 13. Implement Locations section
  - [x] 13.1 Create `components/Locations/LocationMarker.jsx`
    - Render `<GlowDot />` at map coordinates
    - On hover: show tooltip panel with address, city, province, postal code
    - _Requirements: 6.2, 6.3_

  - [x] 13.2 Create `components/Locations/Locations.jsx`
    - Fetch from `getLocations()` on mount; handle loading/error states
    - Render SVG map using `react-simple-maps` (`ComposableMap`, `Geographies`, `Marker`)
    - Render `<LocationMarker />` for each location
    - On marker click: animate smooth zoom/pan via map library `setPosition` or `setZoom`
    - GSAP ScrollTrigger stagger entrance on markers
    - _Requirements: 6.1, 6.4, 6.5, 6.6_

- [x] 14. Implement BookingSystem component
  - [x] 14.1 Create `components/BookingSystem/BookingSystem.jsx` — layout and data fetching
    - Receive `formData` from AppContext; fetch `getPricing()` and `getPromotions()` on mount
    - Determine `assignedClass` (upgrade logic: next higher class if requested unavailable)
    - Display `requestedClass` and `assignedClass` with `NeonBadge`
    - Upgrade animation: Framer Motion badge swap with glow keyframe when `assignedClass !== requestedClass`
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 14.2 Implement price breakdown display in BookingSystem
    - Call `decomposeDays(totalDays)` to get billing lines
    - Call `calculatePrice` with current mode from AppContext
    - Display itemised billing lines; add Drop_Off_Charge line when locations differ
    - Re-render immediately when mode toggle changes (subscribe to AppContext)
    - _Requirements: 7.4, 7.5, 7.6, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 14.3 Implement vehicle condition inputs in BookingSystem
    - Fuel_Level selector: Empty, Quarter, Half, Three_Quarter, Full
    - Start odometer input and end odometer input
    - Inline validation error on end odometer field when `end < start`
    - _Requirements: 7.7, 7.8, 7.9, 7.10_

- [x] 15. Implement mode toggle
  - Add a visible toggle control (e.g. switch in Navbar or fixed corner) that dispatches `SET_MODE` to AppContext
  - Display current mode label ("Customer" / "Employee")
  - _Requirements: 8.1_

- [x] 16. Implement Promotions section
  - Create `components/Promotions/Promotions.jsx`
  - Fetch from `getPromotions()` on mount; display active promotion card with Car_Class badge and discount percentage
  - Visually distinguish promoted class (glow border, highlighted card)
  - GSAP ScrollTrigger fade-up entrance
  - _Requirements: 9.1, 9.3, 9.4, 9.5_

- [x] 17. Implement Pricing section
  - Create `components/Pricing/Pricing.jsx` and `PricingCard.jsx`
  - Fetch from `getPricing()` on mount; render one `<PricingCard />` per Car_Class
  - Each card shows: perDay, perWeek, per2Weeks, perMonth
  - Framer Motion `whileHover={{ y: -6, boxShadow: "..." }}` lift effect
  - GSAP ScrollTrigger stagger entrance
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 18. Implement Reviews section
  - Create `components/Reviews/Reviews.jsx`
  - Source data directly from `data/reviews.js`
  - Framer Motion `AnimatePresence` + drag-to-swipe carousel; transition ≤ 500 ms
  - ScrollTrigger fade-in entrance on section
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 19. Implement FAQ section
  - [x] 19.1 Create `components/FAQ/FAQItem.jsx`
    - Framer Motion `AnimatePresence` + `motion.div` with `height: "auto"` expand/collapse
    - Accepts `question`, `answer`, `isOpen`, `onClick` props
    - _Requirements: 12.2, 12.3_

  - [x] 19.2 Create `components/FAQ/FAQ.jsx`
    - Static `{ question, answer }` data array
    - Parent tracks `openIndex` state; passes `isOpen` and `onClick` to each `<FAQItem />`
    - GSAP ScrollTrigger stagger entrance on items
    - _Requirements: 12.1, 12.4, 12.5_

  - [ ]* 19.3 Write unit tests for FAQ accordion
    - Clicking a second item closes the first
    - Clicking an open item collapses it
    - _Requirements: 12.4_

  - [ ]* 19.4 Write property test for FAQ single-open invariant (Property 8)
    - **Property 8: FAQ accordion single-open invariant**
    - **Validates: Requirements 12.4**
    - Generator: `fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 20 })` click sequences
    - Simulate each click against reducer/state logic; assert `openCount <= 1` after each event

- [x] 20. Checkpoint — Ensure all tests pass
  - Run `vitest --run` and confirm all tests pass; ask the user if questions arise.

- [x] 21. Wire everything together in App.jsx and main.jsx
  - [x] 21.1 Set up `main.jsx`
    - Wrap `<App />` with `<AppProvider />`
    - Mount React root
    - _Requirements: 15.1_

  - [x] 21.2 Set up `App.jsx`
    - Initialise Lenis via `useLenis` hook
    - Render `<Loader onComplete={...} />` with `AnimatePresence`; show page content once `loaderDone`
    - Render full page: `<Navbar />`, `<Hero />`, `<Vehicles />`, `<Locations />`, `<Promotions />`, `<Pricing />`, `<Reviews />`, `<FAQ />`
    - Render `<BookingSystem />` conditionally when `bookingSystemOpen` is true in AppContext
    - Pass `sections` array to `<Navbar />`
    - _Requirements: 1.1, 13.1, 13.2, 15.1_

- [ ] 22. Apply global theme and visual polish
  - Configure Tailwind dark theme defaults in `tailwind.config.js` (dark background, neon purple/blue palette)
  - Add global CSS: base font (premium sans-serif via Google Fonts or system stack), body background, scrollbar styling
  - Verify glassmorphism styles render correctly on `GlassCard`, Navbar, BookingSystem panel
  - Verify neon gradient accents are consistent across all sections
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 23. Final checkpoint — Ensure all tests pass
  - Run `vitest --run` and confirm all tests pass; ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 4, 20, and 23 ensure incremental validation
- Property tests (Properties 1–8) validate universal correctness guarantees; unit tests validate specific examples and edge cases
- API placeholder functions in `src/api/` are structured so only the function body changes when connecting a real backend

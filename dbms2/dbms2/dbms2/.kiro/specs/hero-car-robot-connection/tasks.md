# Implementation Plan: hero-car-robot-connection

## Overview

Three coordinated changes: (1) strip the Lexus GLB and EnergyBeam from `HeroCar.jsx`, (2) replace the box-geometry Robot with a geometry-only Phantom ghost character, and (3) rebrand all user-facing text from VELOX to Phantom Ride. The `src/components/Vehicles/` directory is explicitly out of scope.

## Tasks

- [x] 1. Clean up HeroCar.jsx — remove LexusCar, EnergyBeam, and GLB preload
  - Delete the `LexusCar` function and its `useGLTF.preload('/lexus_es350.glb')` call from `HeroCar.jsx`
  - Delete the `EnergyBeam` function from `HeroCar.jsx`
  - Remove `useGLTF` from the `@react-three/drei` import (keep `Environment`, `ContactShadows`)
  - Remove `useMemo` from the React import if no longer used
  - Remove `<LexusCar />` and `<EnergyBeam />` from the `Scene` component
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [ ]* 1.1 Write unit tests for HeroCar cleanup
    - Render `HeroCar` and assert no `LexusCar` or `EnergyBeam` component in the output
    - Assert the module source contains no reference to `lexus_es350.glb`
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Implement the Phantom ghost character in HeroCar.jsx
  - Add a `Phantom` function component to `HeroCar.jsx` using only Three.js geometry (no GLB)
  - Head: `SphereGeometry` with slight vertical squash; body: `ConeGeometry` inverted/tapered downward
  - Eyes: two small `SphereGeometry` meshes with `color: #38bdf8`, `emissive: #38bdf8`, `emissiveIntensity: 3.5`
  - Aura ring: `TorusGeometry` with `wireframe: true`, `color: #7c3aed`, `emissive: #7c3aed`, `emissiveIntensity: 2`, `transparent: true`, `opacity: 0.45`
  - Wisp trails: 2–3 small elongated spheres below the body, offset per index
  - Body material: `transparent: true`, `opacity: 0.72`, `color: #c4b5fd`, `emissive: #7c3aed`, `emissiveIntensity: 0.6`
  - Wisp material: `color: #818cf8`, `emissive: #818cf8`, `emissiveIntensity: 1.5`, `transparent: true`, `opacity: 0.5`
  - Local point lights: head `color: #a855f7 intensity: 4 distance: 3`, body `color: #3b82f6 intensity: 2 distance: 2`
  - Position at `[-1.0, 0.0, 0.3]` — same left-center area as the old Robot
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 2.1 Add useFrame animation to Phantom
    - Float: `groupRef.current.position.y = baseY + Math.sin(t * 0.8) * 0.12`
    - Aura rotation: `auraRef.current.rotation.z += 0.008` per frame
    - Eye pulse: `eyeMat.emissiveIntensity = 2.5 + Math.sin(t * 2.5) * 1.0`
    - Wisp drift: `sin(t * 1.2 + i * 1.1) * 0.06` per wisp
    - _Requirements: 2.5_

  - [ ]* 2.2 Write property test for Phantom animation (Property 2)
    - **Property 2: Phantom character animates continuously over time**
    - Generate random `t` values in `(0, 1000]` using `fc.float({ min: 0.001, max: 1000 })`
    - Assert `Math.sin(t * 0.8) * 0.12 !== 0` for each generated `t`
    - Tag: `Feature: hero-car-robot-connection, Property 2: Phantom character animates continuously over time`
    - **Validates: Requirements 2.5**

  - [ ]* 2.3 Write property test for Phantom brand colors (Property 3)
    - **Property 3: Phantom character uses only brand accent colors**
    - Extract all `color` and `emissive` hex strings from the Phantom component source
    - For each sampled color value, assert it belongs to `{ #7c3aed, #a855f7, #3b82f6, #38bdf8, #c4b5fd, #818cf8, #ffffff }`
    - Use `fc.constantFrom(...allowedColors)` to generate valid palette members and verify the set is closed
    - Tag: `Feature: hero-car-robot-connection, Property 3: Phantom character uses only brand accent colors`
    - **Validates: Requirements 2.6, 3.5**

  - [ ]* 2.4 Write unit tests for Phantom character structure
    - Render `HeroCar` and assert the `Phantom` group is present with at least one mesh child
    - Assert at least one material has `transparent: true` and `opacity < 1`
    - Assert at least one `pointLight` exists in the scene
    - _Requirements: 2.1, 2.4, 3.2, 3.3_

- [x] 3. Wire Phantom into Scene and update ContactShadows
  - Replace `<Robot />` with `<Phantom />` in the `Scene` function
  - Update `ContactShadows` to `opacity={0.4} scale={6} blur={3}` (lighter shadow for ghost)
  - Confirm `<LexusCar />` and `<EnergyBeam />` are absent from `Scene`
  - _Requirements: 2.1, 2.8, 7.1, 7.3_

- [ ] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Rebrand Navbar, Footer, and Hero eyebrow
  - In `Navbar.jsx`: change the brand button text from `VELOX` to `Phantom Ride`
  - In `Footer.jsx`: change the brand `<span>` from `VELOX` to `Phantom Ride`; update copyright line from `VELOX Car Rentals Inc.` to `Phantom Ride Car Rentals Inc.`; update `href` and label for the Contact Us link from `hello@velox.ca` to `hello@phantomride.ca`
  - In `Hero.jsx`: update the eyebrow `<span>` from `"Premium Car Rental"` to `"Phantom Ride — Premium Car Rental"`
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 5.1 Write unit tests for Navbar, Footer, Hero rebrand
    - Render `Navbar` and assert brand text is `"Phantom Ride"`
    - Render `Footer` and assert brand text is `"Phantom Ride"` and email is `hello@phantomride.ca`
    - Render `Hero` and assert eyebrow contains `"Phantom Ride"`
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [x] 6. Rebrand index.html and Loader
  - In `index.html`: update `<title>` to `Phantom Ride — Premium Car Rental`; add `<meta name="description" content="Phantom Ride — Premium Car Rental. Seamless booking, transparent pricing, and vehicles that make every journey memorable.">`
  - In `Loader.jsx`: change `const BRAND = 'VELOX'` to `const BRAND = 'Phantom Ride'`
  - _Requirements: 5.6, 5.7_

  - [ ]* 6.1 Write unit tests for index.html and Loader rebrand
    - Assert `index.html` `<title>` is `"Phantom Ride — Premium Car Rental"`
    - Assert `index.html` has a `<meta name="description">` containing `"Phantom Ride"`
    - _Requirements: 5.6, 5.7_

- [x] 7. Rebrand pages — HomePage, PolicyPage, FAQsPage, CustomerCarePage
  - In `HomePage.jsx` About section: change heading `VELOX` to `Phantom Ride`; update body paragraph replacing both `VELOX` occurrences with `Phantom Ride`
  - In `PolicyPage.jsx`: change the eyebrow `<span>` from `VELOX` to `Phantom Ride`
  - In `FAQsPage.jsx`: update the FAQ answer in the Vehicles category that references `VELOX` (insurance answer) to say `Phantom Ride`; update the Pricing & Payments category employee discount answer replacing `VELOX employees` with `Phantom Ride employees`
  - In `CustomerCarePage.jsx`: update the initial bot greeting replacing `VELOX virtual assistant` with `Phantom Ride virtual assistant`; update the `BOT_RESPONSES` hello entry replacing `your VELOX assistant` with `your Phantom Ride assistant`; update the phone contact detail from `+1 800-VELOX-00` to `+1 800-PHANTOM`; update the email contact detail from `support@velox.ca` to `support@phantomride.ca`
  - _Requirements: 5.1, 5.8, 5.9_

  - [ ]* 7.1 Write unit tests for page rebrand
    - Render `HomePage` About section and assert `"Phantom Ride"` is present and `"VELOX"` is absent
    - _Requirements: 5.8_

- [x] 8. Rebrand data files — employees.js and reviews.js
  - In `src/data/employees.js`: change `HEADQUARTERS.name` from `'VELOX Headquarters'` to `'Phantom Ride Headquarters'`
  - In `src/data/reviews.js`: update the three review bodies that mention `VELOX` (REV-003, REV-006, REV-008) replacing each `VELOX` with `Phantom Ride`
  - _Requirements: 5.1, 5.9_

- [ ] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Write property test for no VELOX in rendered output (Property 1)
  - Create a property test file (e.g., `src/components/__tests__/rebrand.property.test.jsx`)
  - Import `Navbar`, `Footer`, `Hero`, `Loader`, `HomePage`, `PolicyPage`, `FAQsPage`, `CustomerCarePage`
  - Use `fc.constantFrom(...components)` to randomly select a component each iteration
  - Render each to string with `renderToStaticMarkup` and assert the output does NOT contain `"VELOX"`
  - Run minimum 100 iterations
  - Tag: `Feature: hero-car-robot-connection, Property 1: No VELOX brand text in any rendered output`
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.5, 5.8, 5.9**

- [ ] 11. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- `src/components/Vehicles/` must not be touched at any point
- fast-check is already installed (`"fast-check": "^3.21.0"` in devDependencies)
- Tests run with `npm test` (vitest --run)
- Property tests require a minimum of 100 iterations each

# Design Document

## Feature: hero-car-robot-connection

---

## Overview

This feature makes three coordinated changes to the application:

1. **Remove dead weight from the hero scene** — the `LexusCar` GLB model and `EnergyBeam` are invisible to users but still consume network bandwidth and GPU resources. They are removed entirely.
2. **Replace the Robot with a Phantom ghost character** — a stylized, geometry-only ghost figure built from Three.js primitives replaces the existing box-geometry robot. The Phantom is glowing, semi-transparent, and floats with a pulsing aura, fitting the new brand identity.
3. **Rebrand from VELOX to Phantom Ride** — all user-facing text surfaces (Navbar, Footer, Hero, index.html, About section, FAQ, Policy, CustomerCare pages) are updated to reflect the new brand name.

The vehicle section (`Car3DViewer`, `Vehicles.jsx`, `CarCard.jsx`) is explicitly out of scope and must not be touched.

---

## Architecture

The changes are isolated to the presentation layer. No API, routing, state management, or data layer changes are required.

```
src/
  components/
    Hero/
      HeroCar.jsx        ← MODIFIED: remove LexusCar + EnergyBeam, add Phantom
      Hero.jsx           ← MODIFIED: eyebrow text rebrand
    Navbar/
      Navbar.jsx         ← MODIFIED: brand name
    Footer/
      Footer.jsx         ← MODIFIED: brand name + email
    Loader/
      Loader.jsx         ← MODIFIED: BRAND constant
  pages/
    HomePage.jsx         ← MODIFIED: About section text
    PolicyPage.jsx       ← MODIFIED: eyebrow text
    FAQsPage.jsx         ← MODIFIED: FAQ answer text
    CustomerCarePage.jsx ← MODIFIED: bot greeting + contact details
  data/
    employees.js         ← MODIFIED: HEADQUARTERS name
    reviews.js           ← MODIFIED: review body text
index.html               ← MODIFIED: title + meta description

DO NOT TOUCH:
  src/components/Vehicles/Car3DViewer.jsx
  src/components/Vehicles/Vehicles.jsx
  src/components/Vehicles/CarCard.jsx
  src/components/Vehicles/index.js
```

The `HeroCar.jsx` change is the most significant — it removes two Three.js components and introduces a new one. All other changes are text substitutions.

---

## Components and Interfaces

### Phantom Character (new component inside HeroCar.jsx)

Replaces the `Robot` function. Built entirely from Three.js geometry — no GLB, no external assets.

**Shape language:**
- Rounded head: `SphereGeometry` with slight vertical squash
- Flowing body: `ConeGeometry` (inverted, tapered downward) or a `LatheGeometry` for a smooth ghost silhouette
- Eye glows: two small `SphereGeometry` meshes with emissive material
- Aura ring: `TorusGeometry` around the body, slowly rotating
- Wisp trails: 2–3 small elongated spheres below the body, offset and animated

**Materials:**
- Body: `MeshStandardMaterial` with `transparent: true`, `opacity: 0.72`, `color: #c4b5fd` (light purple), `emissive: #7c3aed`, `emissiveIntensity: 0.6`
- Eyes: `MeshStandardMaterial` with `color: #38bdf8`, `emissive: #38bdf8`, `emissiveIntensity: 3.5`
- Aura ring: `MeshStandardMaterial` with `color: #7c3aed`, `emissive: #7c3aed`, `emissiveIntensity: 2`, `transparent: true`, `opacity: 0.45`, `wireframe: true`
- Wisps: `MeshStandardMaterial` with `color: #818cf8`, `emissive: #818cf8`, `emissiveIntensity: 1.5`, `transparent: true`, `opacity: 0.5`

**Lights (local to Phantom group):**
- `pointLight` at head: `color: #a855f7`, `intensity: 4`, `distance: 3`
- `pointLight` at body center: `color: #3b82f6`, `intensity: 2`, `distance: 2`

**Animation (via `useFrame`):**
- Float: `position.y = baseY + sin(t * 0.8) * 0.12` — gentle vertical bob
- Aura rotation: `auraRef.current.rotation.z += 0.008` per frame
- Eye pulse: `eyeMat.emissiveIntensity = 2.5 + sin(t * 2.5) * 1.0`
- Wisp drift: each wisp offset by phase `sin(t * 1.2 + i * 1.1) * 0.06`

**Positioning:** `position={[-1.0, 0.0, 0.3]}` — same left-center area as the old Robot.

### Removed Components

- `LexusCar()` — deleted entirely, including `useGLTF.preload('/lexus_es350.glb')`
- `EnergyBeam()` — deleted entirely

### Scene (updated)

```jsx
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 8, 4]} intensity={1.8} castShadow />
      <directionalLight position={[-4, 3, -4]} intensity={0.5} color="#a855f7" />
      <spotLight position={[0, 6, 0]} angle={0.5} penumbra={0.7} intensity={3} castShadow />
      <pointLight position={[0, 4, 4]} intensity={1} color="#3b82f6" />
      <Phantom />
      <ContactShadows position={[0, -0.42, 0]} opacity={0.4} scale={6} blur={3} far={1.5} />
      <Environment preset="night" />
    </>
  )
}
```

### Rebranding Changes (text substitutions)

| File | Change |
|---|---|
| `Navbar.jsx` | `VELOX` → `Phantom Ride` (brand button text) |
| `Footer.jsx` | `VELOX` → `Phantom Ride` (brand span, copyright line); `hello@velox.ca` → `hello@phantomride.ca` |
| `Hero.jsx` | eyebrow span: `"Premium Car Rental"` → `"Phantom Ride — Premium Car Rental"` |
| `index.html` | title tag + add `<meta name="description" content="Phantom Ride — Premium Car Rental...">` |
| `Loader.jsx` | `const BRAND = 'VELOX'` → `const BRAND = 'Phantom Ride'` |
| `HomePage.jsx` | About section heading and body text |
| `PolicyPage.jsx` | eyebrow label |
| `FAQsPage.jsx` | FAQ answer referencing VELOX |
| `CustomerCarePage.jsx` | Bot greeting, phone/email contact details |
| `src/data/employees.js` | `VELOX Headquarters` → `Phantom Ride Headquarters` |
| `src/data/reviews.js` | Review body text (3 occurrences) |

---

## Data Models

No new data models. The Phantom character is purely procedural — all geometry and animation state lives in component-local refs and `useFrame` closures. No props, no context, no external data.

The only "data" change is the `BRAND` constant in `Loader.jsx` and the `HEADQUARTERS` object in `employees.js`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: No VELOX brand text in any rendered output

*For any* component in the application rendered to a string or DOM, the output SHALL NOT contain the substring "VELOX" in any user-visible text node.

**Validates: Requirements 5.1, 5.2, 5.3, 5.5, 5.8, 5.9**

### Property 2: Phantom character animates continuously over time

*For any* elapsed time value `t > 0`, the Phantom character's computed vertical position `baseY + sin(t * 0.8) * 0.12` SHALL differ from its rest position `baseY`, confirming that the animation function produces non-constant output across the time domain.

**Validates: Requirements 2.5**

### Property 3: Phantom character uses only brand accent colors

*For any* material or point light defined within the Phantom component, its `color` and `emissive` values SHALL be drawn exclusively from the set `{ #7c3aed, #a855f7, #3b82f6, #38bdf8, #c4b5fd, #818cf8, #ffffff }` — the purple/blue/white brand palette.

**Validates: Requirements 2.6, 3.5**

---

## Error Handling

**GLB removal:** By deleting `useGLTF.preload('/lexus_es350.glb')` and the `LexusCar` component, the network request is eliminated at the source. No error handling needed — the failure mode (404 on GLB) simply no longer occurs.

**Phantom geometry failure:** All geometry is constructed inline from Three.js primitives. There are no async operations, no network calls, and no external dependencies that can fail. If Three.js itself fails to construct a geometry (extremely unlikely), the `Suspense` boundary in `Hero.jsx` already catches render errors and falls back to `null`, keeping the text content and booking widget visible.

**Rebranding:** Text substitutions are static — no runtime error surface. The only risk is a missed occurrence of "VELOX", which is mitigated by the Property 1 test and a grep-based smoke check.

**Responsive fallback:** The `<div className="... hidden lg:block">` wrapper in `Hero.jsx` already hides the entire 3D canvas below the `lg` breakpoint. The Phantom character inherits this behavior with no additional work.

---

## Testing Strategy

### Unit / Example Tests

These cover specific, deterministic behaviors:

- Render `HeroCar` and assert no `LexusCar` or `EnergyBeam` in the scene tree (Req 1.1, 1.3)
- Assert `HeroCar.jsx` source contains no reference to `lexus_es350.glb` (Req 1.2)
- Render `HeroCar` and assert `Phantom` group is present with expected child meshes (Req 2.1)
- Assert Phantom materials include `transparent: true` and `opacity < 1` on body mesh (Req 3.2)
- Assert Phantom scene graph includes at least one `pointLight` (Req 2.4, 3.3)
- Render `Navbar` and assert brand text is "Phantom Ride" (Req 5.2)
- Render `Footer` and assert brand text is "Phantom Ride" and email is `hello@phantomride.ca` (Req 5.3, 5.4)
- Render `Hero` and assert eyebrow contains "Phantom Ride" (Req 5.5)
- Assert `index.html` title is "Phantom Ride — Premium Car Rental" (Req 5.6)
- Assert `index.html` has `<meta name="description">` containing "Phantom Ride" (Req 5.7)
- Render `HomePage` About section and assert "Phantom Ride" present, "VELOX" absent (Req 5.8)
- Render `Hero` at mobile viewport and assert 3D canvas wrapper has `hidden` class (Req 6.1)
- Assert `Hero.jsx` wraps `HeroCar` in `<Suspense>` (Req 7.3)

### Property-Based Tests

PBT library: **fast-check** (already compatible with the Vite/React stack).

Each property test runs a minimum of **100 iterations**.

**Property 1 — No VELOX in rendered output**

Tag: `Feature: hero-car-robot-connection, Property 1: No VELOX brand text in any rendered output`

Generate a random selection from the set of all rebranded components (Navbar, Footer, Hero, Loader, HomePage, PolicyPage, FAQsPage, CustomerCarePage). For each, render to string and assert the output does not contain "VELOX". The generator varies which component is selected and (where applicable) what props/context are provided.

**Property 2 — Phantom animation is non-constant**

Tag: `Feature: hero-car-robot-connection, Property 2: Phantom character animates continuously over time`

Generate random `t` values in the range `(0, 1000]`. For each `t`, compute `Math.sin(t * 0.8) * 0.12` and assert the result is not zero (i.e., the animation function produces non-constant output). This validates the animation formula is live.

**Property 3 — Phantom uses only brand accent colors**

Tag: `Feature: hero-car-robot-connection, Property 3: Phantom character uses only brand accent colors`

Extract all `color` and `emissive` hex values from the Phantom component's material definitions. For any sampled material configuration, assert every color value belongs to the allowed palette `{ #7c3aed, #a855f7, #3b82f6, #38bdf8, #c4b5fd, #818cf8, #ffffff }`.

### Smoke Tests

- `Car3DViewer.jsx` file hash/content is unchanged (Req 4.2)
- `Vehicles.jsx`, `CarCard.jsx`, `index.js` in Vehicles directory are unchanged (Req 4.5)
- No file in `src/components/Vehicles/` contains modifications

### What is NOT tested

- Visual fidelity of the ghost silhouette (Req 3.1, 3.4) — requires human visual review
- Actual browser network behavior (Req 1.4) — covered by static analysis of 1.2
- GPU/memory performance (Req 7.2) — covered by the structural removal of the GLB preload

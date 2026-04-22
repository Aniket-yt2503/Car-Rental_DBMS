# Requirements Document

## Introduction

This feature updates the home page hero section and rebrands the entire application from "VELOX" to "Phantom Ride". The changes include: removing the invisible 3D Lexus car model from the hero scene, replacing the existing box-geometry robot character with a stylized "Phantom" ghost figure that fits the new brand identity, and updating all brand references throughout the application. The existing vehicle section's 3D models (Car3DViewer) must remain completely unchanged.

## Glossary

- **Hero_Section**: The landing area of the home page containing the headline, booking widget, and 3D scene
- **HeroCar_Component**: The React component (`HeroCar.jsx`) that renders the 3D scene in the hero using React Three Fiber
- **Phantom_Character**: A stylized ghost/phantom figure rendered in Three.js geometry — glowing, ethereal, fitting the dark sci-fi aesthetic of the "Phantom Ride" brand
- **LexusCar_Component**: The existing `LexusCar` function in `HeroCar.jsx` that loads `/lexus_es350.glb` — this is the component to be removed
- **Robot_Component**: The existing `Robot` function in `HeroCar.jsx` built from box geometries — this is the component to be replaced by the Phantom_Character
- **EnergyBeam_Component**: The existing beam connecting the robot to the car — to be removed or repurposed as a glow effect around the Phantom_Character
- **Vehicle_Section**: The existing section displaying 3D car models for browsing (separate from the hero)
- **Car3DViewer**: The existing component in `src/components/Vehicles/Car3DViewer.jsx` — must not be modified
- **Application_Brand**: The company name displayed throughout the application interface
- **Phantom_Ride**: The new brand name replacing "VELOX" across all user-facing surfaces

## Requirements

### Requirement 1: Remove Invisible Lexus Car from Hero

**User Story:** As a developer, I want to remove the non-visible Lexus car model from the hero scene, so that it no longer wastes resources loading a GLB file that is not visible to users.

#### Acceptance Criteria

1. THE HeroCar_Component SHALL NOT render the LexusCar_Component
2. THE HeroCar_Component SHALL NOT import or preload `/lexus_es350.glb`
3. THE EnergyBeam_Component SHALL be removed from the hero scene
4. WHEN the Hero_Section loads, THE browser SHALL NOT make a network request for `/lexus_es350.glb`
5. THE removal of the LexusCar_Component SHALL NOT affect the layout or visibility of other hero content

### Requirement 2: Replace Robot with Phantom Character

**User Story:** As a user, I want to see a stylized Phantom ghost figure in the hero section, so that the 3D character matches the "Phantom Ride" brand identity.

#### Acceptance Criteria

1. THE HeroCar_Component SHALL render the Phantom_Character in place of the Robot_Component
2. THE Phantom_Character SHALL be positioned in the same area of the hero scene previously occupied by the Robot_Component (left-center of the 3D canvas)
3. THE Phantom_Character SHALL be constructed using Three.js geometry (no external GLB file required)
4. THE Phantom_Character SHALL have a glowing, ethereal visual appearance using emissive materials and point lights
5. THE Phantom_Character SHALL animate continuously (e.g., floating, pulsing glow) to convey an ethereal presence
6. THE Phantom_Character SHALL use a color palette consistent with the existing hero scene (purples, blues, whites)
7. THE Phantom_Character SHALL have a visible glow or aura effect surrounding it (replacing the EnergyBeam_Component)
8. WHEN the Hero_Section loads, THE Phantom_Character SHALL appear without blocking other hero content

### Requirement 3: Phantom Character Visual Design

**User Story:** As a designer, I want the Phantom character to look like a stylized ghost figure, so that it clearly communicates the "Phantom Ride" brand theme.

#### Acceptance Criteria

1. THE Phantom_Character SHALL have a recognizable ghost/phantom silhouette (rounded head, flowing or tapered body)
2. THE Phantom_Character SHALL use semi-transparent or translucent materials to convey an ethereal quality
3. THE Phantom_Character SHALL emit light (via emissive materials or point lights) to stand out against the dark hero background
4. THE Phantom_Character SHALL NOT use realistic humanoid proportions — it SHALL be stylized and abstract
5. THE Phantom_Character's glow color SHALL use the existing brand accent colors (purple `#7c3aed`, blue `#3b82f6`, or white)

### Requirement 4: Preserve Existing Vehicle Section

**User Story:** As a developer, I want the existing vehicle section to remain unchanged, so that current functionality is not disrupted.

#### Acceptance Criteria

1. THE Vehicle_Section SHALL remain functionally unchanged after all hero modifications
2. THE Car3DViewer component SHALL NOT be modified
3. THE Vehicles page components SHALL maintain their current behavior
4. WHEN users navigate to the vehicles section, THE 3D models SHALL display exactly as they did before this feature
5. THE `src/components/Vehicles/` directory SHALL NOT be altered

### Requirement 5: Application Rebranding to Phantom Ride

**User Story:** As a business stakeholder, I want the application rebranded to "Phantom Ride" everywhere, so that the new brand identity is consistently reflected across the entire interface.

#### Acceptance Criteria

1. THE Application_Brand SHALL be changed from "VELOX" to "Phantom Ride" in all user-facing text
2. THE Navbar component SHALL display "Phantom Ride" instead of "VELOX" as the brand name
3. THE Footer component SHALL display "Phantom Ride" instead of "VELOX" in the brand column, copyright line, and company name
4. THE Footer contact email SHALL be updated from `hello@velox.ca` to a Phantom Ride equivalent (e.g., `hello@phantomride.ca`)
5. THE Hero_Section eyebrow label SHALL reference "Phantom Ride" (e.g., "Phantom Ride — Premium Car Rental")
6. THE `index.html` page title SHALL be updated to "Phantom Ride — Premium Car Rental"
7. THE `index.html` SHALL include a `<meta name="description">` tag referencing "Phantom Ride"
8. THE About section SHALL reference "Phantom Ride" instead of "VELOX" wherever the brand name appears
9. WHEN a user views any page, THE Application_Brand SHALL consistently display as "Phantom Ride" with no remaining "VELOX" references in user-facing text

### Requirement 6: Responsive Behavior

**User Story:** As a mobile user, I want the hero section to display appropriately on my device, so that I have a good experience regardless of screen size.

#### Acceptance Criteria

1. WHEN the viewport width is less than 1024px, THE Phantom_Character MAY be hidden (matching the existing hidden behavior of the 3D canvas on mobile)
2. THE Hero_Section headline and booking widget SHALL remain functional on all viewport sizes
3. THE responsive behavior of the Hero_Section SHALL match the existing patterns (3D canvas hidden below `lg` breakpoint)

### Requirement 7: Performance and Loading

**User Story:** As a user, I want the hero section to load quickly, so that I can start interacting with the site without delay.

#### Acceptance Criteria

1. THE Phantom_Character SHALL be constructed entirely from Three.js geometry with no external asset files to load
2. THE removal of the LexusCar_Component SHALL reduce the hero section's network payload by eliminating the GLB file request
3. THE HeroCar_Component SHALL continue to load asynchronously using React Suspense
4. WHEN the 3D scene is loading, THE Hero_Section text content and booking widget SHALL remain visible and functional
5. WHEN the 3D scene fails to render, THE Hero_Section text content SHALL remain visible and functional

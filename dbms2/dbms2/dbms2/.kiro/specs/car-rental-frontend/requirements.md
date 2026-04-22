# Requirements Document

## Introduction

A premium car rental website frontend built with React + Vite, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, and Lenis smooth scrolling. The site combines a clean, usable booking experience (inspired by Europcar/Zoomcar) with cinematic animations and interactive effects (inspired by award-winning creative sites like ctrl.xyz). The result is a dark-themed, neon-accented, glassmorphism-styled frontend that feels smooth, premium, and slightly game-like while remaining highly usable.

All data is served from dummy datasets with API placeholder hooks (`/api/cars`, `/api/rentals`, etc.) ready for backend integration.

---

## Glossary

- **App**: The car rental frontend React application.
- **Navbar**: The floating navigation bar rendered on all pages.
- **Hero**: The fullscreen landing section at the top of the home page.
- **Booking_Widget**: The inline form inside the Hero section for initiating a rental booking.
- **Vehicles_Section**: The section displaying the car catalogue with filters and interactive cards.
- **Car_Card**: A single vehicle display card within the Vehicles_Section.
- **Locations_Section**: The section displaying rental pickup/drop-off locations on an interactive map.
- **Booking_System**: The detailed booking flow UI shown after the user submits the Booking_Widget.
- **Pricing_Section**: The section displaying per-class pricing tiers.
- **Promotions_Section**: The section displaying the active weekly promotion.
- **Reviews_Section**: The section displaying animated customer testimonials.
- **FAQ_Section**: The section displaying expandable/collapsible frequently asked questions.
- **Loader**: The animated full-screen loading screen shown on initial page load.
- **Customer_Mode**: The default user mode where promotions are applied to pricing.
- **Employee_Mode**: An alternate user mode with staff discount rules and promotions disabled.
- **Car_Class**: One of four vehicle tiers: Subcompact, Compact, Sedan, Luxury.
- **Requested_Class**: The car class selected by the user during booking.
- **Assigned_Class**: The car class actually assigned, which may be equal to or higher than the Requested_Class.
- **Drop_Off_Charge**: An additional fee applied when the return location differs from the pickup location.
- **Fuel_Level**: The fuel state of the vehicle at pickup or return, expressed as one of: Empty, Quarter, Half, Three_Quarter, Full.
- **Promotion**: A time-limited discount applied to a single Car_Class, active one at a time.
- **Dummy_Data**: Static in-memory datasets used in place of a live backend.
- **API_Placeholder**: A stub function or module that simulates an API call and returns Dummy_Data, structured to be replaced by real HTTP calls.
- **ScrollTrigger**: The GSAP plugin that drives scroll-based animation timelines.
- **Lenis**: The smooth-scroll library that normalises scroll velocity across devices.

---

## Requirements

### Requirement 1: Animated Loader

**User Story:** As a visitor, I want to see a branded loading screen when the site first loads, so that the experience feels polished and intentional rather than showing a blank page.

#### Acceptance Criteria

1. WHEN the App first mounts, THE Loader SHALL display a full-screen overlay that covers all other content.
2. WHEN the App first mounts, THE Loader SHALL display an animated progress bar that advances from 0% to 100% over a minimum of 1.5 seconds.
3. WHEN the progress bar reaches 100%, THE Loader SHALL animate out and reveal the main page content.
4. THE Loader SHALL display the brand name or logo during the loading animation.
5. IF the page assets have not finished loading when the progress bar reaches 100%, THEN THE Loader SHALL remain visible until assets are ready before animating out.

---

### Requirement 2: Floating Glassmorphism Navbar

**User Story:** As a visitor, I want a persistent navigation bar that feels premium and adapts as I scroll, so that I can always access key sections without losing context.

#### Acceptance Criteria

1. THE Navbar SHALL render on every page and remain visible at all times during scrolling.
2. THE Navbar SHALL apply a glassmorphism visual style: semi-transparent background, backdrop blur, and a subtle border.
3. THE Navbar SHALL contain navigation links to the following sections in order: Home, Vehicles, Locations, Pricing, About, FAQs.
4. WHEN the page scroll position is 0, THE Navbar SHALL be positioned horizontally centered on the page.
5. WHEN the page scroll position exceeds 80px, THE Navbar SHALL transition to a top-anchored position with a smooth CSS/Framer Motion transition lasting no more than 400ms.
6. WHEN a user's pointer hovers over a Navbar link, THE Navbar SHALL apply a magnetic hover effect that slightly displaces the link element toward the cursor.
7. WHEN a Navbar link is clicked, THE App SHALL smooth-scroll to the corresponding section using Lenis.

---

### Requirement 3: Hero Section

**User Story:** As a visitor, I want a visually striking fullscreen hero section, so that I immediately understand the brand and am drawn to start a booking.

#### Acceptance Criteria

1. THE Hero SHALL occupy 100% of the viewport height on initial load.
2. THE Hero SHALL display an animated background consisting of either car visuals or gradient animations that loop continuously.
3. WHEN the user moves the pointer within the Hero, THE Hero SHALL render a soft glow effect that follows the pointer position, updating in real time.
4. WHEN the Hero mounts, THE Hero SHALL reveal the headline text using a staggered character or word animation with GSAP or Framer Motion, completing within 1.2 seconds.
5. THE Hero SHALL contain the Booking_Widget as its primary interactive element.
6. WHILE the Hero is visible in the viewport, THE Hero background SHALL apply a parallax offset driven by the scroll position via ScrollTrigger.

---

### Requirement 4: Booking Widget

**User Story:** As a customer, I want to quickly specify my rental details directly on the hero section, so that I can initiate a booking without navigating away.

#### Acceptance Criteria

1. THE Booking_Widget SHALL provide a pickup location input field.
2. THE Booking_Widget SHALL provide a return location input field that defaults to the same value as the pickup location.
3. THE Booking_Widget SHALL provide a date selection input for pickup date (date only, no time component).
4. THE Booking_Widget SHALL provide a date selection input for return date (date only, no time component).
5. THE Booking_Widget SHALL provide a Car_Class selector with the options: Subcompact, Compact, Sedan, Luxury.
6. THE Booking_Widget SHALL display a hint text reading: "Higher class may be assigned at same price."
7. WHEN the return location differs from the pickup location, THE Booking_Widget SHALL visually indicate that a Drop_Off_Charge may apply.
8. IF the return date is earlier than or equal to the pickup date, THEN THE Booking_Widget SHALL display a validation error and prevent form submission.
9. WHEN the user submits the Booking_Widget, THE App SHALL transition to the Booking_System view with the submitted values pre-populated.

---

### Requirement 5: Vehicles Section

**User Story:** As a visitor, I want to browse the car catalogue in an engaging, interactive way, so that I can explore available vehicles and feel excited about renting.

#### Acceptance Criteria

1. THE Vehicles_Section SHALL display Car_Cards sourced from the Dummy_Data car dataset via the API_Placeholder for `/api/cars`.
2. EACH Car_Card SHALL display: make, model, year, color, Car_Class badge, unique vehicle ID, and license plate number.
3. WHEN a user's pointer hovers over a Car_Card, THE Car_Card SHALL apply a 3D tilt effect that tracks the pointer position within the card bounds.
4. WHEN a user's pointer hovers over a Car_Card, THE Car_Card SHALL apply an image zoom and soft glow effect.
5. WHEN a user's pointer leaves a Car_Card, THE Car_Card SHALL smoothly return to its default state within 300ms.
6. THE Vehicles_Section SHALL provide a filter control to filter Car_Cards by Car_Class.
7. THE Vehicles_Section SHALL provide a filter control to filter Car_Cards by location.
8. WHEN a filter is applied, THE Vehicles_Section SHALL animate the transition of Car_Cards in and out using Framer Motion layout animations.
9. WHEN the Vehicles_Section scrolls into view, THE Car_Cards SHALL animate in using a staggered entrance animation driven by ScrollTrigger.

---

### Requirement 6: Locations Section

**User Story:** As a customer, I want to see all rental locations on an interactive map, so that I can identify convenient pickup and drop-off points.

#### Acceptance Criteria

1. THE Locations_Section SHALL render an interactive map or globe visualization.
2. THE Locations_Section SHALL display each location as a glowing point marker on the map.
3. WHEN a user hovers over a location marker, THE Locations_Section SHALL display a tooltip or panel showing: street address, city, province, and postal code.
4. WHEN a location marker is clicked, THE Locations_Section SHALL animate a smooth zoom or focus transition to that location.
5. WHEN the Locations_Section scrolls into view, THE location markers SHALL animate in with a staggered glow-fade entrance driven by ScrollTrigger.
6. THE Locations_Section SHALL source location data from the Dummy_Data locations dataset via the API_Placeholder for `/api/locations`.

---

### Requirement 7: Booking System UI

**User Story:** As a customer, I want a detailed booking confirmation view that shows pricing, class assignment, and vehicle condition inputs, so that I fully understand the terms of my rental before confirming.

#### Acceptance Criteria

1. THE Booking_System SHALL display the Requested_Class selected in the Booking_Widget.
2. THE Booking_System SHALL display the Assigned_Class, which may be equal to or higher than the Requested_Class.
3. WHEN the Assigned_Class is higher than the Requested_Class, THE Booking_System SHALL play an upgrade animation (e.g. badge swap with a glow transition) to draw attention to the upgrade.
4. THE Booking_System SHALL display a price breakdown showing the cost for: 1 day, 1 week, 2 weeks, and 1 month for the Assigned_Class.
5. WHEN the rental duration is calculated, THE Booking_System SHALL decompose the total days into the largest applicable billing units (e.g. 8 days = 1 week + 1 day) and display the itemised breakdown.
6. WHEN the return location differs from the pickup location, THE Booking_System SHALL display the Drop_Off_Charge as a separate line item in the price breakdown.
7. THE Booking_System SHALL provide a Fuel_Level selector with options: Empty, Quarter, Half, Three_Quarter, Full.
8. THE Booking_System SHALL provide an odometer input field for the start odometer reading.
9. THE Booking_System SHALL provide an odometer input field for the end odometer reading.
10. IF the end odometer value is less than the start odometer value, THEN THE Booking_System SHALL display a validation error on the odometer fields.

---

### Requirement 8: Customer and Employee Mode

**User Story:** As a user, I want to toggle between Customer and Employee modes, so that the correct pricing rules and promotions are applied to my booking.

#### Acceptance Criteria

1. THE App SHALL provide a visible toggle control to switch between Customer_Mode and Employee_Mode.
2. WHEN Customer_Mode is active, THE Booking_System SHALL apply any active Promotion discount to the calculated price.
3. WHEN Employee_Mode is active and the rental duration is less than 14 days, THE Booking_System SHALL apply a 50% discount to the base price.
4. WHEN Employee_Mode is active and the rental duration is 14 days or more, THE Booking_System SHALL apply a 10% discount to the base price (i.e. charge 90% of base price).
5. WHEN Employee_Mode is active, THE Booking_System SHALL not apply any Promotion discounts.
6. WHEN the mode toggle is switched, THE Booking_System SHALL recalculate and re-render the price breakdown immediately without requiring a page reload.

---

### Requirement 9: Promotions Section

**User Story:** As a customer, I want to see the current weekly promotion clearly highlighted, so that I can take advantage of discounts on specific car classes.

#### Acceptance Criteria

1. THE Promotions_Section SHALL display the currently active Promotion, including the Car_Class it applies to and the discount percentage.
2. THE App SHALL enforce that only one Car_Class has an active Promotion at any given time.
3. THE Promotions_Section SHALL source promotion data from the Dummy_Data promotions dataset via the API_Placeholder for `/api/promotions`.
4. WHEN the Promotions_Section scrolls into view, THE Promotions_Section SHALL animate in using a ScrollTrigger-driven entrance animation.
5. THE Promotions_Section SHALL visually distinguish the promoted Car_Class from non-promoted classes (e.g. highlighted card, glow border).

---

### Requirement 10: Pricing Section

**User Story:** As a customer, I want to see clear pricing for each car class, so that I can compare options and plan my budget before booking.

#### Acceptance Criteria

1. THE Pricing_Section SHALL display one pricing card per Car_Class (Subcompact, Compact, Sedan, Luxury).
2. EACH pricing card SHALL display the price per day, per week, per 2 weeks, and per month for that Car_Class.
3. THE Pricing_Section SHALL source pricing data from the Dummy_Data pricing dataset via the API_Placeholder for `/api/pricing`.
4. WHEN the Pricing_Section scrolls into view, THE pricing cards SHALL animate in with a staggered entrance animation driven by ScrollTrigger.
5. WHEN a user's pointer hovers over a pricing card, THE pricing card SHALL apply a subtle lift and glow effect using Framer Motion.

---

### Requirement 11: Reviews Section

**User Story:** As a prospective customer, I want to read testimonials from other renters, so that I can feel confident in the service quality.

#### Acceptance Criteria

1. THE Reviews_Section SHALL display customer testimonials sourced from the Dummy_Data reviews dataset.
2. THE Reviews_Section SHALL present testimonials in a carousel or scroll-based reveal format.
3. WHEN the Reviews_Section scrolls into view, THE testimonial items SHALL animate in using a smooth entrance animation driven by ScrollTrigger or Framer Motion.
4. WHEN the user interacts with the carousel (if applicable), THE Reviews_Section SHALL transition between testimonials with a smooth animation lasting no more than 500ms.

---

### Requirement 12: FAQ Section

**User Story:** As a visitor, I want to find answers to common questions in an easy-to-navigate section, so that I can resolve doubts without contacting support.

#### Acceptance Criteria

1. THE FAQ_Section SHALL display a list of frequently asked questions with their answers.
2. WHEN a question item is clicked, THE FAQ_Section SHALL expand to reveal the answer using a smooth height animation.
3. WHEN an expanded question item is clicked again, THE FAQ_Section SHALL collapse the answer using the same smooth animation.
4. THE FAQ_Section SHALL ensure only one answer is expanded at a time, collapsing any previously open item when a new one is opened.
5. WHEN the FAQ_Section scrolls into view, THE question items SHALL animate in with a staggered entrance animation driven by ScrollTrigger.

---

### Requirement 13: Smooth Scrolling and Global Animations

**User Story:** As a visitor, I want the entire site to feel fluid and cinematic as I scroll and interact, so that the experience feels premium and intentional.

#### Acceptance Criteria

1. THE App SHALL initialise Lenis on mount and apply smooth scrolling to all native scroll events throughout the entire page.
2. THE App SHALL integrate Lenis with GSAP's ScrollTrigger so that all ScrollTrigger-based animations are driven by the Lenis scroll position.
3. THE App SHALL apply parallax effects to designated background elements using ScrollTrigger.
4. WHEN interactive elements (buttons, cards, links) are hovered, THE App SHALL apply micro-interaction animations (e.g. scale, glow, colour shift) using Framer Motion.
5. THE App SHALL not apply scroll or hover animations that degrade the frame rate below 60fps on a mid-range device.

---

### Requirement 14: UI Theme and Visual Style

**User Story:** As a visitor, I want the site to have a consistent, premium dark aesthetic, so that the brand feels high-end and trustworthy.

#### Acceptance Criteria

1. THE App SHALL apply a dark background theme as the global default.
2. THE App SHALL use neon gradient accents in the purple-to-blue spectrum for highlights, borders, and glow effects.
3. THE App SHALL apply glassmorphism styling (semi-transparent backgrounds, backdrop blur, subtle borders) to cards, the Navbar, and modal-like panels.
4. THE App SHALL use a minimal, premium sans-serif typeface consistently across all sections.
5. THE App SHALL maintain sufficient colour contrast between text and background to meet a minimum contrast ratio of 4.5:1 for body text.

---

### Requirement 15: Component Architecture and API Placeholders

**User Story:** As a developer, I want the codebase to be component-based with clearly defined API placeholder hooks, so that the frontend can be connected to a real backend with minimal refactoring.

#### Acceptance Criteria

1. THE App SHALL organise UI into reusable React components, with each major section (Hero, Vehicles, Locations, Booking_System, Pricing, Promotions, Reviews, FAQ, Navbar, Loader) implemented as a separate component or component directory.
2. THE App SHALL define API_Placeholder functions for the following endpoints: `/api/cars`, `/api/rentals`, `/api/locations`, `/api/pricing`, `/api/promotions`.
3. EACH API_Placeholder SHALL return Dummy_Data that conforms to the expected data shape for its endpoint.
4. THE App SHALL structure API_Placeholder functions so that replacing the Dummy_Data return with a real `fetch` or `axios` call requires changing only the function body, not the call sites.
5. THE App SHALL use Dummy_Data that includes at least 8 cars across all four Car_Classes, at least 4 locations, at least 4 pricing entries (one per class), at least 1 active promotion, and at least 4 customer reviews.

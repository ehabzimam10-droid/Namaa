# Original User Request

## Initial Request — 2026-07-16T16:42:42Z

Implement a Canvas-based 2.5D/3D interactive Kingdom and Village simulator for Namaa, replacing static image overlays with an animated HTML5 Canvas-based rendering engine.

Working directory: C:\Users\saleh\OneDrive\Documentos\NAMAA
Integrity mode: development

## Requirements

### R1. HTML5 Canvas-Based 2.5D/3D Simulator
Create an interactive 2.5D Isometric Canvas component to replace the current `KingdomBoard` and `KidVillageBoard` screens entirely. This must draw buildings procedurally or by rendering assets loaded from `/assets/village/` onto the canvas context.

### R2. Building Level Evolution & Animation
Render buildings differently based on their levels (1 to 5) corresponding to the asset levels. Provide smooth transition animations, scaling, or glowing particle effects on the canvas when a building upgrades.

### R3. Parent's Kingdom Dashboard with Child Outposts
On the Parent's Village view, display the main fortress walls and central castle, plus interactive clickable outpost icons representing the children's villages. Clicking a child's outpost should open their detailed village canvas view.

### R4. Local Development Mode Only
All code modifications must be done locally. Do not push to remote origin or main branch.

### R5. Technology Stack
Use Vanilla HTML5 2D Canvas context (`canvas.getContext('2d')`) without adding any external 3D libraries (like Three.js or PixiJS). All isometric transformations and projection rendering must be computed mathematically in React/TypeScript.

## Verification Plan

### Automated Verification
- Run typescript validation to verify type safety: `npx tsc --noEmit`.

### Independent Auditing / Review Rubrics
An independent agent or developer will manually verify:
1. That all buildings are rendered inside a `<canvas>` element.
2. That sliding/toggling levels updates building appearances dynamically.
3. Clicking on child outposts in the parent dashboard opens the detailed child village modal.

## Acceptance Criteria

### Visualization and Interactivity
- [ ] Buildings render inside an HTML5 `<canvas>` element.
- [ ] Buildings levels 1-5 adapt their appearance, colors, or heights.
- [ ] Parent can click on child outposts to trigger the detailed preview modal.
- [ ] A developer testing control panel (slider or toggles) is present to change levels and inspect all visual configurations instantly.
- [ ] Compilation checks pass with zero errors.

## Follow-up Request — 2026-07-16T23:00:54Z

Implement an HTML5 Canvas-based 2.5D/3D interactive simulation of the family village and kids outposts on the Father Dashboard, completely replacing static image tags with animated Canvas renderings that sync with the database levels. All code must remain local-only (do not push to Github).

Working directory: c:\Users\saleh\OneDrive\Documentos\NAMAA
Integrity mode: demo

## Requirements

### R1. HTML5 Canvas Simulation
- Create a reusable React component using HTML5 Canvas (`<canvas>`) that renders the village scene.
- Draw the base map `base_map.png.png` as the background.
- Load and draw the PNG building assets (Bank, Oasis/Farm, Market, Windmill, and Fortress Wall) from `public/assets/village` directly on the Canvas in isometric projection.
- Bind building levels (1 to 5) to the respective levels from context/database (`bank_level`, `farm_level`, `market_level`, `center_level`, `windmill_level`).

### R2. Smooth Level Change Animations
- When a building level updates (via database trigger or dev panel), animate the transition smoothly.
- Use animations such as scaling up/down, floating bounce, particle outbursts, or glowing neon outlines around the updated building during the transition.
- Redraw the Canvas using a render loop (`requestAnimationFrame`) to handle these animations and hover states smoothly.

### R3. Hover Interactions and Glassmorphic Tooltips
- Detect mouse hover events on the Canvas. Check the cursor coordinate against each building's bounding box/polygon.
- On hover, highlight the hovered building (e.g. increase brightness, add glow outline) and display a Glassmorphic overlay tooltip showing the building name and its current level.

### R4. Kids' Floating Island Outposts
- Draw interactive nodes/icons representing the children's villages (e.g., خالد and سالم) as small floating islands or circular icons surrounding the father's central village.
- The icons should float gently up and down (using sine wave animations).
- Hovering over these outposts should show their respective status. Clicking them is currently disabled (shows a sleek toast/message indicating the feature will be activated later).

### R5. Local-Only Mode
- Keep all modifications saved locally on the device only. Do not stage or push changes to git/github.

### R6. Developer Control Panel Integration
- Integrate a sleek developer control panel on the dashboard to allow immediate manual override of levels for testing/demonstration purposes.

## Acceptance Criteria

### Visual Fidelity & Animation
- [ ] Canvas renders without flickering or blank frames, drawing the base map and all buildings at correct coordinates.
- [ ] Level changes trigger a smooth scale/bounce animation or particle emission on the Canvas.
- [ ] Bouncing/floating idle animation is applied to the kids' outposts.

### User Interaction
- [ ] Mouse hover successfully highlights the hovered building and shows a styled tooltip overlay.
- [ ] Clicking on a child outpost shows a non-blocking sleek toast/notice.
- [ ] Developer panel immediately triggers the correct animation and updates the Canvas rendering state.


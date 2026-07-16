## 2026-07-16T16:46:12Z
You are the worker agent for implementing Milestone 1: Canvas Rendering Engine.
Your working directory is C:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\sub_orch_impl\worker_m1.
Your objective is to implement the core 2.5D Isometric Canvas component and the asset preloading manager:
1. Create `src/components/village/AssetManager.ts` (or build it directly inside the Canvas component) to manage asynchronous loading and caching of the PNG sprites:
   - Base map: `/assets/village/base_map.png.png`
   - Walls: `/assets/village/wall_1.png.png` to `/assets/village/wall_5.png.png`
   - Buildings: `center_X.png.png`, `bank_X.png.png`, `market_X.png.png`, `farm_X.png.png`, `windmill_X.png.png` (X is 1 to 5)
   - Outposts: Fallback to scaled down versions of `center_1.png.png` / `center_2.png.png`.
2. Create `src/components/village/IsometricCanvas.tsx` as a reusable component that uses HTML5 Canvas context:
   - Implement the forward isometric projection math: translate 3D grid coordinate (x, y, z) to 2D screen coordinate (px, py).
   - Render the base map.
   - Use the Painter's Algorithm (render grid cells sorted from back to front) to overlay the perimeter walls, the five main buildings at their anchors, and the child outposts (if `mode === 'parent'`).
   - Draw tooltips/interactive hovers and mouse coordinate translation.
   - Support responsiveness and high-DPI scaling using `window.devicePixelRatio`.
3. Verify that the files compile correctly by running typescript validation (`npx tsc --noEmit` or similar build command). Report command run and verification results in your handoff.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

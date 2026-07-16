## 2026-07-16T16:53:44Z

You are the worker agent for implementing Milestone 2: Upgrade Evolution & Animation.
Your working directory is C:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\sub_orch_impl\worker_m2.
Your objective is to implement building level evolution rendering, animations, particle effects, and developer testing controls:
1. Modify `src/components/village/IsometricCanvas.tsx` to add:
   - Upgrade scale bounce: When a building's level changes (increases), trigger a smooth bounce animation (e.g. scale up from 1.0 to 1.3, then down to 0.9, settling back to 1.0 over 500ms).
   - Glowing particle effects: Spawn a cluster of 10-15 particles at the building's base when it upgrades. Particles should rise, fade out, and have a custom color matching the building theme (e.g., gold/yellow for bank, green/emerald for farm, amber/orange for market, blue for windmill, yellow/red for castle). Draw these particles on the canvas frame-by-frame.
2. Create `src/components/village/DevControlPanel.tsx`:
   - Provide visual sliders or buttons to toggle between child and parent mode.
   - Provide sliders to change levels of all five buildings (1 to 5) and the family wall level.
   - Provide a button to trigger a mock "upgrade event" (which increments a building's level to trigger the bounce and particle animation).
3. Update `src/pages/DeveloperDashboard.tsx` to render the interactive `IsometricCanvas` alongside the `DevControlPanel` so that developers can test and inspect all visual configurations instantly.
4. Run typescript type safety validation (`npx tsc --noEmit` or similar build command) to verify everything compiles without errors. Report results in your handoff.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

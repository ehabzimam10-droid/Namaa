## 2026-07-17T02:03:58Z
You are the Worker (Software Engineer).
Your working directory is: c:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\worker_gen2_1

Your task is to apply the following codebase updates:

1. **Asset Path Extension Fix**:
   Replace all occurrences of `.png.png` double extensions with `.png` in the following files:
   - `src/components/village/AssetManager.ts`
   - `src/components/village/BankSVG.tsx`
   - `src/components/village/CenterSVG.tsx`
   - `src/components/village/FarmSVG.tsx`
   - `src/components/village/FortressWall.tsx`
   - `src/components/village/MarketSVG.tsx`
   - `src/components/village/VillageBoard.tsx`
   - `src/components/village/Windmill.tsx`

2. **Outpost Floating Animation**:
   In `src/components/village/IsometricCanvas.tsx`, implement a smooth time-based floating animation for child outposts inside the canvas rendering loop:
   - Compute `floatOffset = Math.sin(performance.now() / 300 + (x * 0.5) + (y * 0.5)) * 4`.
   - Apply `floatOffset` to the `py` draw coordinates of the outpost image, the rounded label box, and the text.
   - Update `getHoveredElement` function so that the hover bounds calculation for outposts incorporates the same `floatOffset` for accurate interaction.

3. **Outpost Click Toast Interaction**:
   In `src/pages/FatherVillagePage.tsx`:
   - Destructure `showToast` from `useApp()`.
   - Update `onOutpostClick` callback so that clicking an outpost triggers `showToast` with a notice indicating the feature will be activated later (e.g. "سيتم تفعيل استعراض قرية [الابن] بالكامل قريباً! 🏡✨"), instead of setting `selectedKid` to open the modal.
   - Ensure that the "استكشاف القرية التفصيلية" buttons on the child cards still function as normal to open the preview modals.

4. **Verify Implementation**:
   - Run type check `npx tsc --noEmit` and confirm 0 errors.
   - Run vitest tests `npx vitest run` to ensure all 91 tests still compile and pass successfully.
   - Document your verification commands and outputs in your handoff report.

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. A Forensic Auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.

Write your changes summary in `c:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\worker_gen2_1\changes.md` and your final handoff in `c:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\worker_gen2_1\handoff.md`. Send a message to the parent (conversation ID: d537d341-6e2d-4015-b5f9-c4793022f2a5) when done.

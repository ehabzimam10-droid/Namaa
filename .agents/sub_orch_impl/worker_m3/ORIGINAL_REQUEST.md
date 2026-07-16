## 2026-07-16T17:01:10Z
You are the worker agent for implementing Milestone 3: Parent Dashboard & Child Outposts.
Your working directory is C:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\sub_orch_impl\worker_m3.
Your objective is to integrate the dynamic Canvas-based simulator into the production dashboard components:
1. Update `src/components/village/KingdomBoard.tsx` to:
   - Accept props: `familyLevel: number`, `kids: Kid[]`, and an optional `onOutpostClick?: (childId: string) => void` (or handle internal/external modal triggers).
   - Render the `IsometricCanvas` in `mode="parent"`.
   - Map the `kids` array into `ChildOutpostData[]`. Place Khalid at (6, 3) and Salem at (3, 6).
   - Handle clicks on the child outposts, calling the `onOutpostClick` callback or prop.
2. Update `src/pages/FatherVillagePage.tsx` to pass the click handler to `KingdomBoard`:
   - When a child outpost is clicked, it should call `setSelectedKid(kid)` to open the detailed kid village modal.
3. Update `src/components/village/KidVillageBoard.tsx` to:
   - Render `IsometricCanvas` in `mode="child"`, passing `levels` computed from the active `kid` data (bank, farm, market, center, windmill) and the `kid` profile object.
4. Update `src/components/village/VillageBoard.tsx` (the detailed child board rendered inside the father's modal) to:
   - Render `IsometricCanvas` in `mode="child"`, passing the `levels` and `wallLevel` props.
5. Run full typescript validation (`npx tsc --noEmit`) and run the test suite (`npm run test:run`) to ensure all existing and new tests pass cleanly with 0 compilation errors.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

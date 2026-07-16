# Project Plan: Kingdom and Village Simulator

We are replacing static village/kingdom boards in Namaa with an interactive, animated HTML5 2D Canvas component rendering in 2.5D/3D isometric projection.

## Milestones & Work Breakdown
1. **Milestone 1: E2E Test Suite Creation** (Dual Track - E2E Testing)
   - Setup E2E test infra and write 4 tiers of test cases (~11 * N + max(5, N/2) minimum cases).
   - Expected outputs: `TEST_INFRA.md` and `TEST_READY.md`.

2. **Milestone 2: 2.5D Isometric Canvas Base Component** (Implementation Track)
   - Create a reusable interactive canvas component.
   - Implement mathematical isometric projection (mapping 2D screen coordinates to 2.5D grid space).
   - Implement assets rendering (base map, building level representations).

3. **Milestone 3: Level Evolution, Animation, Particles** (Implementation Track)
   - Update building visual appearances according to level.
   - Add transition animations (scaling, particle effects/glows) on building level upgrade.
   - Integrate slider/control panel to test and review levels dynamically.

4. **Milestone 4: Parent Kingdom Dashboard with Child Outposts** (Implementation Track)
   - Add parent village layout (walls, central castle).
   - Draw child outposts (clickable icons) representing active children.
   - Clicking an outpost opens a modal showing the detailed child village canvas view.

5. **Milestone 5: Final Verification & Audit** (Final Track)
   - Run type checks and integration verification.
   - Perform forensic integrity checks.
   - Run E2E test suite.

# Scope: E2E Testing Track

## Objective
Design and implement a comprehensive, opaque-box E2E test suite derived from the user requirements in ORIGINAL_REQUEST.md.

## Deliverables
- `TEST_INFRA.md` at project root describing test architecture, features, and coverage thresholds.
- Complete test cases covering Tiers 1-4.
- `TEST_READY.md` at project root indicating all tests are ready with execution commands.

## Architecture & Features
Features to test:
1. **F1: HTML5 Canvas Rendering**: Validate that kingdom and village simulator boards use HTML5 canvas.
2. **F2: Level Evolution**: Validate buildings update visually based on levels (1-5).
3. **F3: Animations**: Validate animations and visual effects trigger when upgrading.
4. **F4: Parent Dashboard clickable outposts**: Validate parent board renders walls, castle, and clickable outposts.
5. **F5: Outpost detail preview modal**: Validate clicking outposts opens a child's detailed village modal view.
6. **F6: Developer Control Panel**: Validate test control panel (sliders/toggles) changes levels and displays visual states.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Test Infra Setup | Design and structure test suite directory and runner | None | PLANNED |
| 2 | Tier 1 Tests | Feature coverage (happy-path, >=5 tests per feature) | M1 | PLANNED |
| 3 | Tier 2 Tests | Boundary and corner cases (>=5 tests per feature) | M1 | PLANNED |
| 4 | Tier 3 Tests | Cross-feature combinations (pairwise coverage) | M2, M3 | PLANNED |
| 5 | Tier 4 Tests | Real-world application scenarios (realistic workloads) | M4 | PLANNED |
| 6 | Publish E2E Suite | Verify all tests pass on mock/skeleton code, write TEST_READY.md | M5 | PLANNED |

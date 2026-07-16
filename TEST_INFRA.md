# E2E Test Infra: Namaa Kingdom & Village Canvas Simulator

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial Testing + Real-World Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| F1 | HTML5 Canvas Rendering | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| F2 | Level Evolution | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| F3 | Animations | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| F4 | Parent Dashboard clickable outposts | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| F5 | Outpost detail preview modal | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| F6 | Developer Control Panel | ORIGINAL_REQUEST §R2, §R3 | 5 | 5 | ✓ |

## Test Architecture
- Test runner: Vitest v2.0+ (configured in `vitest.config.ts`), running within JSDOM environment.
- Invocation: `npx vitest run` or `npm run test:run`
- Pass/fail semantics: Standard exit codes (0 for pass, non-zero for fail).
- Directory layout:
  - `vitest.config.ts` (project root)
  - `src/test/setup.ts` (global test setup & mocks)
  - `src/test/e2e/` (individual feature and integration tests)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full parent journey flow walkthrough | F1, F4, F5, F6 | Medium |
| 2 | Real-time evolution stress test | F2, F3, F6 | High |
| 3 | Divergent levels average computation | F1, F2, F4 | Medium |
| 4 | Daily cleanup simulation & time progression | F6 | Low |
| 5 | Hotspot hover & tooltip interactive checks | F1, F4, F5 | Low |

## Coverage Thresholds
- Tier 1: 5 tests per feature (30 total)
- Tier 2: 5 tests per feature (30 total)
- Tier 3: Pairwise coverage of feature interactions (6 total)
- Tier 4: Realistic workload walkthroughs (5 total)
- **Total Suite size: 71 tests**

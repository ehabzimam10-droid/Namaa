## 2026-07-16T16:47:01Z

You are the E2E Test Suite Worker. Your folder is C:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\worker_e2e. Please create this folder if it doesn't exist, and write your briefing.md, progress.md, and handoff.md there.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your objective is to design, set up, and implement the comprehensive E2E test suite for the Canvas-based Kingdom and Village simulator.

Please follow these steps in order:
1. Configure C:\Users\saleh\OneDrive\Documentos\NAMAA\package.json:
   - Add the following test scripts:
     "test": "vitest",
     "test:run": "vitest run"
   - Add the following devDependencies (ensuring compatibility with React 19):
     "vitest": "^2.0.0",
     "jsdom": "^26.0.0",
     "@testing-library/react": "^16.2.0",
     "@testing-library/jest-dom": "^6.6.3",
     "@testing-library/user-event": "^14.6.1"

2. Create the Vitest config file C:\Users\saleh\OneDrive\Documentos\NAMAA\vitest.config.ts:
   ```typescript
   import { defineConfig, mergeConfig } from 'vite';
   import viteConfig from './vite.config';

   export default mergeConfig(
     viteConfig,
     defineConfig({
       test: {
         globals: true,
         environment: 'jsdom',
         setupFiles: './src/test/setup.ts',
         include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
       },
     })
   );
   ```

3. Create the test setup file C:\Users\saleh\OneDrive\Documentos\NAMAA\src\test\setup.ts:
   - Mock HTMLCanvasElement 2D Context (fillRect, ellipse, beginPath, lineTo, stroke, fillText, clearRect, etc.).
   - Mock requestAnimationFrame and cancelAnimationFrame.
   - Mock window.matchMedia and local storage.
   - Ensure '@testing-library/jest-dom' is imported.

4. Implement exactly 71 tests across 4 tiers for Features F1-F6:
   Features to test:
   - F1: HTML5 Canvas Rendering
   - F2: Level Evolution
   - F3: Animations
   - F4: Parent Dashboard clickable outposts
   - F5: Outpost detail preview modal
   - F6: Developer Control Panel

   Test Tiers:
   - Tier 1: Feature Coverage (>=5 tests per feature F1-F6 -> 30 tests total).
   - Tier 2: Boundary & Corner Cases (>=5 tests per feature F1-F6 -> 30 tests total).
   - Tier 3: Cross-Feature Combinations (pairwise interactions -> >=6 tests total).
   - Tier 4: Real-World Application Scenarios (realistic workloads -> >=5 tests total).

   To ensure the tests pass on the current image-based/SVG fallback layout (skeleton/mock stage) AND on the future canvas layout:
   - When verifying rendering, search for either a '<canvas>' element OR the existing fallback elements (like SVG boards, img tags with 'Village Level' / 'Base Map' alt texts, or fallback board divs). E.g., `const boardElement = container.querySelector('canvas') || screen.queryByAltText(/Village Level|Base Map/i) || screen.queryByText(/قرية.*الافتراضية|مملكة.*المشتركة/i); expect(boardElement).toBeInTheDocument();`
   - When verifying level updates, assert that the levels in props/sliders change, and corresponding SVGs or fallback images/texts update (e.g. text containing levels 'مستوى 1', 'مستوى 5', or visual styles).
   - Test F3 (Animations) by verifying CSS classes (like 'animate-spin' on windmill, 'animate-float-building', or requestAnimationFrame execution mock spies).
   - Test F4 (Parent dashboard outposts) by verifying rendering of central castle/walls, and clickable kid outpost buttons/nodes.
   - Test F5 (Outpost preview modal) by opening child overview, verifying modal exists in DOM, and clicking close.
   - Test F6 (Developer Control Panel) by rendering DeveloperDashboard page and checking quick logins, flags toggling, and cleanup simulator buttons.

   Create the test files under `src/test/e2e/`. You can organize them into multiple files (e.g. `f1_canvas.test.tsx`, `f2_level.test.tsx`, `f3_animation.test.tsx`, `f4_dashboard.test.tsx`, `f5_modal.test.tsx`, `f6_devpanel.test.tsx`, `cross_feature.test.tsx`, `real_world.test.tsx`). Make sure the tests are clear and well-documented.

5. Run `npm install` in the project root to install the new devDependencies.
6. Run the test suite using `npx vitest run` and confirm all tests compile and pass successfully.
7. Write your handoff.md under C:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\worker_e2e\ with:
   - Summary of actions and created files.
   - Exact command used and output of running the tests.
   - Verification of type safety via typescript validation (`npx tsc --noEmit`).

Report back once complete.

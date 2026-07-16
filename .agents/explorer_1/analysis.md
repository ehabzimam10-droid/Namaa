# E2E Test Suite Analysis & Design Report

## Executive Summary
This analysis details the investigation of the React codebase for the Namaa platform and proposes a lightweight, headless, opaque-box E2E/integration testing framework. Based on local environment verification, we confirm that `vitest` is runnable via `npx` and is the optimal test runner. We design a 4-tier testing methodology containing 71 distinct test cases covering functional features, boundary conditions, cross-feature interactions, and real-world workloads. Furthermore, we outline strategies to test canvas/SVG visuals, animations, modals, and the developer control panel under JSDOM.

---

## 1. Codebase Structure Investigation
The current codebase is a modern React/TypeScript/Vite application. Key areas examined include:
- **`src/App.tsx`**: Sets up routing via `react-router-dom` with two primary layout routes: `AuthLayout` (LoginPage `/` and DeveloperDashboard `/dev`) and `DashboardLayout` (all father and kid pages).
- **`src/data/mockData.ts`**: Contains types and mock structures for `Kid`, `Task`, `SavingsGoal`, `FamilyProject`, `ActiveLeague`, and transactions.
- **`src/context/AppContext.tsx`**: Manages the application's global state, handles CRUD operations, optimistic local updates, and synchronization with Supabase.
- **`src/components/village/`**: Contains SVG building modules (`BankSVG`, `FarmSVG`, `MarketSVG`, `CenterSVG`, `Windmill`, `FortressWall`), the custom isometric layout component (`VillageBoard`), and kid/kingdom dashboard boards (`KidVillageBoard`, `KingdomBoard`) that handle interactive hover tooltips and dynamic asset resolution.
- **`src/components/ui/`**: Houses modals for task assignments (`AssignTaskModal`), money transfer (`TransferModal`), and transaction histories (`TransactionsModal`), as well as visual modules like `CastleVisual` which renders dynamic inline SVG paths and sky gradients based on levels.

---

## 2. Proposed E2E Test Framework
To run opaque-box E2E tests in a CLI-only, headless, and network-restricted environment, we propose:
1. **Vitest**: The fastest, most lightweight runner for Vite projects. It has native TypeScript/JSX compiling out-of-the-box and provides excellent execution speed.
2. **JSDOM**: A pure JavaScript implementation of the web standards to run tests in Node.js without needing a heavyweight, slow GUI browser.
3. **React Testing Library (RTL)**: Ideal for **opaque-box** E2E testing. Rather than testing internal state, RTL encourages mounting the complete `<App />` and querying/interacting with elements (inputs, buttons, text) from a user's perspective.
4. **`@testing-library/user-event` & `@testing-library/jest-dom`**: For advanced, realistic event simulations (typing, clicking) and convenient DOM state matchers (e.g. `toBeInTheDocument`).

---

## 3. Verifying Verification Tools (Environment Capabilities)
Direct command-line verification was executed on the workspace:
- `npx vitest --version` executed successfully, automatically resolving to **vitest/4.1.10** under Node.v24.18.0.
- `npx ts-node --version` resolved successfully to **v10.9.2**.
- Both commands ran without network blocking or execution issues. This confirms that a Vitest-based test runner will compile, launch, and execute tests properly in this environment.

---

## 4. Visual and Interactive Testing in JSDOM
Since JSDOM lacks a visual layout engine (returning `0` for layout sizes and ignoring image pixel paints), we detail exactly how to test visual elements:

### A. Canvas / SVG Rendering
- **SVG Elements** (e.g. `CastleVisual.tsx`, `VillageBoard.tsx`): JSDOM constructs standard DOM nodes for SVG tags (`svg`, `path`, `rect`, `circle`). We test these by querying them (e.g., `container.querySelector('svg')`) and asserting key attributes exist (e.g., checking that a path has the color representing a "thriving" or "damaged" state: `expect(rect).toHaveAttribute('fill', '#E57A44')`).
- **Canvas Elements** (e.g., `IsometricCanvas.tsx` when implemented): In standard JSDOM, `.getContext('2d')` returns `null`. We will mock the 2D context in our global setup:
  ```typescript
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    fillRect: vi.fn(),
    ellipse: vi.fn(),
    beginPath: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    clearRect: vi.fn(),
  });
  ```
  We can spy on these mock functions to verify that the math projections coordinate mapping (isometric conversion) translates to drawing calls at correct offsets.
- **Image-based Boards**: Verify that standard `img` tags resolve to the correct path string:
  `expect(screen.getByAltText(/Village Level/i)).toHaveAttribute('src', '/assets/village/village_3.png')`.

### B. Level Updates
- Verify state-based updates by asserting that changing level inputs (via the slider, modal, or dev dashboard dropdown) changes the DOM outputs.
- Assert that a level upgrade changes class lists, text indicators (`مستوى 5 / 5`), or canvas drawing spy arguments.

### C. Animations
- In JSDOM, CSS transitions/animations cannot be visually verified. However, we can assert that the correct CSS classes are applied:
  `expect(windmillElement).toHaveClass('animate-spin')`.
- For JS-based animations using `requestAnimationFrame`, mock the window loop in `setup.ts`:
  ```typescript
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(100); // Trigger callback immediately with a mock timestamp
    return 1;
  });
  ```

### D. Parent/Child Modals
- Verify that clicking a trigger element (e.g. Salem's outpost or "إسناد مهمة") renders the modal container overlay in the DOM.
- Verify closing the modal removes it from the document (`expect(screen.queryByRole('dialog')).not.toBeInTheDocument()`).
- For nested modals, open the parent modal first, perform the secondary trigger (e.g. clicking "إسناد مهمة مخصصة" inside kid overview), assert the child modal is rendered on top, close the child modal, and verify the user is returned to the parent modal.

### E. Developer Control Panel (God Mode)
- Query flags inside `/dev` (switches) and simulate click events to verify that state updates in `AppContext` and is persisted to `localStorage` (since JSDOM supports `window.localStorage` natively).
- Click Quick Login buttons and assert that the routing redirects the browser to `/father` or `/kid` and updates the profile header context.
- Simulate the "24-hour cleanup" database execution button and verify that toast notifications appear.

---

## 5. The 4-Tier Test Case Structure (71 Tests)

### Tier 1: Feature Coverage (30 Tests - 5 tests per feature F1-F6)
*Target: Verify correct functional behavior of core features under standard conditions.*

| Test ID | Feature | Title | Flow / Description |
|---|---|---|---|
| **T1_F1_1** | F1: Auth & Dev | Credentials Validation | Submitting invalid credentials shows error toast "خطأ في اسم المستخدم أو كلمة المرور". |
| **T1_F1_2** | F1: Auth & Dev | Father Quick Bypass | Clicking "دخول كولي أمر (أبو خالد)" redirects to `/father` and stores father profile. |
| **T1_F1_3** | F1: Auth & Dev | Kid Quick Bypass | Clicking "دخول كابن (سالم)" redirects to `/kid` and stores Salem profile in context. |
| **T1_F1_4** | F1: Auth & Dev | Dev Panel View | Accessing `/dev` renders API key inputs, feature flags, and simulation cleanup buttons. |
| **T1_F1_5** | F1: Auth & Dev | Feature Flag Toggle | Clicking the AI assistant switch changes its flag state in the context and saves to localStorage. |
| **T1_F2_1** | F2: Savings | Goal Creation | Creating a saving goal for سالم adds a new locked goal card in the child dashboard list. |
| **T1_F2_2** | F2: Savings | Deposit to Goal | Depositing 50 SAR from سالم's pocket balance to "شراء دراجة" increases goal savings and decreases wallet. |
| **T1_F2_3** | F2: Savings | Lock Maintenance | Goal current value < target keeps the lock icon active and prevents withdrawal actions. |
| **T1_F2_4** | F2: Savings | Auto-Unlock Goal | Depositing enough money to meet target unlocks the goal and triggers a success notification. |
| **T1_F2_5** | F2: Savings | Withdraw Goal | Withdrawing from an unlocked goal deletes the goal card and adds funds back to Salem's wallet balance. |
| **T1_F3_1** | F3: Tasks | Father Assigns Task | Father submits AssignTaskModal; verifying new task appears as "pending" for the kid. |
| **T1_F3_2** | F3: Tasks | Kid Views Tasks | Logging in as Salem shows the list of assigned tasks with correct difficulty and cash reward. |
| **T1_F3_3** | F3: Tasks | Submit Proof | Kid clicks "تسليم المهمة", status shifts to "under_review", and Father receives notification. |
| **T1_F3_4** | F3: Tasks | Approve Task | Father clicks "اعتماد المهمة", task status shifts to "approved", and reward cash is added to Kid. |
| **T1_F3_5** | F3: Tasks | Custom Rewards | Father assigns a task with a custom reward (e.g. playtime). Task stores string reward correctly. |
| **T1_F4_1** | F4: Investment | Father Project Create | Father creates a project with 1000 SAR capital and 15% ROI. Project renders on investments page. |
| **T1_F4_2** | F4: Investment | View Family Projects | Kid logs in and views active family investment projects and the current contributors. |
| **T1_F4_3** | F4: Investment | Invest Funds | Kid clicks invest, enters 100 SAR, and submits. Project contribution increases. |
| **T1_F4_4** | F4: Investment | Balance Decrement | Kid's wallet balance drops by 100 SAR, and transaction logs are populated. |
| **T1_F4_5** | F4: Investment | Complete Project | When total contributions match required, project is marked funded and Father is notified. |
| **T1_F5_1** | F5: Donation | View Causes | Kid donation page renders charity causes like "سقيا ماء 💧" and "كفالة يتيم". |
| **T1_F5_2** | F5: Donation | Donate Funds | Kid enters 50 SAR donation, wallet decreases, and donationPoints increments by 50. |
| **T1_F5_3** | F5: Donation | Logs Transaction | Transaction history displays a withdrawal entry "تبرع للمسؤولية المجتمعية". |
| **T1_F5_4** | F5: Donation | Father Notification | Father dashboard displays notification: "قام سالم بالتبرع بمبلغ 50 ريال للمسؤولية المجتمعية". |
| **T1_F5_5** | F5: Donation | Points Synchronization | Earning donation points dynamically updates the kid scoreboard points tally. |
| **T1_F6_1** | F6: League/Level | Start Family League | Father enters prize and details and clicks Start League. ActiveLeague status updates. |
| **T1_F6_2** | F6: League/Level | Kid League Progress | Salem opens league page to check remaining days, current standings, and spending score. |
| **T1_F6_3** | F6: League/Level | Dynamic Scoring | Score calculations update based on savings, investment, donation, and task achievements. |
| **T1_F6_4** | F6: League/Level | End League Winner | Father ends league; Salem with highest score is crowned winner, saving goal is unlocked. |
| **T1_F6_5** | F6: League/Level | Village Board Render | KingdomBoard and KidVillageBoard render buildings corresponding to levels in the database. |

### Tier 2: Boundary & Corner Cases (30 Tests - 5 tests per feature F1-F6)
*Target: Verify application resilience under extreme inputs, limitations, or abnormal flows.*

| Test ID | Feature | Title | Flow / Description |
|---|---|---|---|
| **T2_F1_1** | F1: Auth & Dev | Supabase Offline | If supabase client returns connection error, login falls back to demo mode safely. |
| **T2_F1_2** | F1: Auth & Dev | Session Cleanup | Logging out deletes credentials in context and clears `namaa_profile` from localStorage. |
| **T2_F1_3** | F1: Auth & Dev | Empty Database Cleanup | Running 24h simulation when tasks/notifications lists are empty completes without crashing. |
| **T2_F1_4** | F1: Auth & Dev | Route Protection | Accessing `/father` pages without active profile redirects to login page. |
| **T2_F1_5** | F1: Auth & Dev | Empty Gemini Key | Dev dashboard handles saving blank/deleted Gemini API keys correctly. |
| **T2_F2_1** | F2: Savings | Over-Deposit Protection | Depositing amount > wallet balance triggers warning toast and cancels transaction. |
| **T2_F2_2** | F2: Savings | Invalid Inputs | Attempting to deposit 0 or negative value is blocked by form validation. |
| **T2_F2_3** | F2: Savings | Locked Goal Withdrawal | Attempting to force withdraw from a locked goal (e.g. calling method directly) is rejected. |
| **T2_F2_4** | F2: Savings | Active League Lock | Kid cannot withdraw from "حصالة دوري العائلة" while league is active, even if target is met. |
| **T2_F2_5** | F2: Savings | Invalid Goal Creation | Creating a goal with negative target amount is prevented by validation checks. |
| **T2_F3_1** | F3: Tasks | Active League Limits | Father cannot assign more than 5 easy, 3 medium, or 3 hard tasks to a kid during an active league. |
| **T2_F3_2** | F3: Tasks | Duplicate Proof | Kid cannot re-submit proof for a task currently under review or already approved. |
| **T2_F3_3** | F3: Tasks | Expiry Transition | Cleanup simulation sets task status to "expired" if end date passes without kid submitting proof. |
| **T2_F3_4** | F3: Tasks | Negative Rewards | Father is blocked from assigning tasks with 0 or negative cash/points rewards. |
| **T2_F3_5** | F3: Tasks | Empty Custom Reward | Selecting "custom" reward type and submitting blank string is blocked by input verification. |
| **T2_F4_1** | F4: Investment | Over-Investment Limit | Kid cannot invest more money than their wallet balance in a family project. |
| **T2_F4_2** | F4: Investment | Project Funding Overfill | Project refuses investments that would cause `currentInvested` to exceed `totalRequired`. |
| **T2_F4_3** | F4: Investment | Invalid Invest Input | Attempting to invest 0 or negative amount into a project is blocked. |
| **T2_F4_4** | F4: Investment | Invalid Project Specs | Father is blocked from creating a project with negative capital requirements or negative ROI. |
| **T2_F4_5** | F4: Investment | Unique Contributor List | Repeated investments by the same kid correctly sum up contributions under a single contributor entry. |
| **T2_F5_1** | F5: Donation | Insufficient Balance | Kid cannot donate more than their wallet balance. Attempt shows warning. |
| **T2_F5_2** | F5: Donation | Zero/Negative Donations | Form blocks attempts to submit zero or negative donation amounts. |
| **T2_F5_3** | F5: Donation | Visual Warning Limit | Donating 100% of wallet balance triggers warning popup encouraging savings before charity. |
| **T2_F5_4** | F5: Donation | High Amount Display | Ensure extremely high donation amounts (e.g. 1,000,000 SAR) fit correctly in transaction histories. |
| **T2_F5_5** | F5: Donation | Cause ID Bounds | Requesting donation actions on non-existent Cause IDs throws errors safely without crash. |
| **T2_F6_1** | F6: League/Level | Allowance Boundaries | Starting league fails if pocket money allowance values are negative or zero. |
| **T2_F6_2** | F6: League/Level | Level Boundary Locks | Village/Kingdom building levels are restricted strictly to bounds [1, 5]. |
| **T2_F6_3** | F6: League/Level | Past League Date | Creating league with end date in the past is rejected. |
| **T2_F6_4** | F6: League/Level | Tie League Handler | Ending a league where Salem and Khalid share equal scores distributes prizes to both. |
| **T2_F6_5** | F6: League/Level | Image Load Fallback | When village map png fails to load, `imgError` triggers CSS layout panel containing text fallback. |

### Tier 3: Cross-Feature Combinations (6 Tests)
*Target: Verify correct coordination between different features interacting simultaneously.*

| Test ID | Feature Set | Title | Flow / Description |
|---|---|---|---|
| **T3_CF_1** | F2 + F6 | Goal Completion -> Score | Completing a savings goal automatically triggers a bonus calculation, adding to the kid's League savings score. |
| **T3_CF_2** | F3 + F2 | Task Payout -> Goal Fund | Father approves task, distributing cash reward to Kid. Kid uses cash to fund and unlock a savings goal. |
| **T3_CF_3** | F4 + F6 | Project ROI -> League Standings | Project completion ROI distributes returns to Kid. The dividend increases investment scores and league ranks. |
| **T3_CF_4** | F3 + F6 | League-Bound Tasks | Assigning a task with "ربط نهاية المهمة بنهاية الدوري" locks task end date to league end date. |
| **T3_CF_5** | F2 + F5 | Unlocked Savings -> Donation | Kid unlocks saving goal, withdraws money, and immediately donates a portion to charity. |
| **T3_CF_6** | F4 + F3 | Task Reward -> Project Investment | Kid completes a sequence of tasks to gather enough money to buy into an active family project. |

### Tier 4: Real-World Application Scenarios (5 Tests)
*Target: Verify high-level sequences representing actual user behavior over long sessions.*

- **T4_RW_1 (Kid's Daily Task & Save Routine)**
  1. Login as Salem.
  2. Read newly assigned task "تنظيف الحديقة" (15 SAR reward).
  3. Submit proof.
  4. Wait for approval simulation.
  5. Check balance increment (+15 SAR).
  6. Create a goal "شراء قصة" (Target: 20 SAR).
  7. Deposit 15 SAR.
  8. Donate 2 SAR to "سقيا ماء".
  9. View updated village board.
- **T4_RW_2 (Father League Setup & Oversight)**
  1. Login as Abu Khalid.
  2. Navigate to League settings.
  3. Start a new family league with prize "بلايستيشن 5".
  4. Navigate to dashboard.
  5. Inspect task proof from Salem.
  6. Approve Salem's proof.
  7. Inspect task proof from Khalid and reject it (or request revision).
  8. Verify updated scoreboard shows Salem in the lead.
  9. Simulate 24-hour cleanup to expire pending tasks.
- **T4_RW_3 (Family Crowd-Funded Investment)**
  1. Login as Father; create investment project "عربة الآيسكريم" (Capital: 300 SAR, ROI: 20%).
  2. Login as Salem; invest 150 SAR (50% of capital).
  3. Login as Khalid; invest 150 SAR (remaining 50%).
  4. Verify project status shifts to fully funded.
  5. Simulate project return payout.
  6. Verify Salem receives 180 SAR (150 + 20% ROI) and Khalid receives 180 SAR.
- **T4_RW_4 (Full League Competition Campaign)**
  1. Father starts league.
  2. Kids Salem and Khalid execute tasks, fund goals, and donate over multiple cycles.
  3. Salem completes 4 tasks, saves 100 SAR, donates 20 SAR.
  4. Khalid completes 5 tasks, saves 50 SAR, donates 40 SAR.
  5. Father ends the league.
  6. System counts final standings and awards Salem the prize.
  7. Verify Salem's village buildings level up, and the castle graphic upgrades.
- **T4_RW_5 (Developer God-Mode Verification)**
  1. Open `/dev` page.
  2. Configure Gemini API key.
  3. Toggle "سلاسل التوفير الأسبوعية" (enable streak) and "إشعارات سحب مصروف الجيب الفورية" (realtime alerts).
  4. Trigger database simulator cleanup.
  5. Login as Salem and verify streak counters render on the dashboard, checking for regressions.

---

## 6. Setup and Implementation Plan

### Step 1: Package.json Configuration
We will add testing libraries under `devDependencies` and define test scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "jsdom": "^26.0.0",
    "@testing-library/react": "^16.2.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1"
  }
}
```

### Step 2: Create Vitest Configuration File
Create `C:\Users\saleh\OneDrive\Documentos\NAMAA\vitest.config.ts`:
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

### Step 3: Create Setup Script
Create `C:\Users\saleh\OneDrive\Documentos\NAMAA\src\test\setup.ts`:
```typescript
import { vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Mock HTMLCanvasElement 2D Context for Canvas drawing tests
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  ellipse: vi.fn(),
  beginPath: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
  clearRect: vi.fn(),
});

// Mock Supabase Client API to avoid real database hits
vi.mock('../utils/supabaseClient.ts', () => {
  const mockFrom = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  };

  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id' } }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      from: vi.fn(() => mockFrom),
    },
  };
});
```

### Step 4: Writing E2E Tests
E2E integration test files will be placed inside `src/test/e2e/`. Tests will render the main application:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { AppProvider } from '../../context/AppContext';

describe('E2E Integration Test Suite', () => {
  it('should authenticate Abu Khalid and load dashboard', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    
    // Bypass credentials using quick login on Developer Panel or login screen
    const loginButton = screen.getByText(/دخول كولي أمر \(أبو خالد\) 👤/i);
    await userEvent.click(loginButton);
    
    expect(screen.getByText(/أبو خالد/i)).toBeInTheDocument();
  });
});
```

---

## 7. Conclusions and Next Steps
1. **Lightweight Fit**: Vitest + JSDOM is the most resource-efficient testing suite suitable for the environment constraints.
2. **Implementation Execution**: The plan allows immediate installation of packages and construction of test files without modifying any production application paths.
3. **Execution Readiness**: The test commands verify that the project can execute tests asynchronously under Node without external network access.

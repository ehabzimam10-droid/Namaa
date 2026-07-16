import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act, screen } from '@testing-library/react';
import IsometricCanvas from '../../components/village/IsometricCanvas';
import type { BuildingLevels } from '../../components/village/IsometricCanvas';
import KingdomBoard from '../../components/village/KingdomBoard';
import KidVillageBoard from '../../components/village/KidVillageBoard';
import DevControlPanel from '../../components/village/DevControlPanel';

vi.mock('../../components/village/AssetManager', () => {
  return {
    AssetManager: class {
      preload = vi.fn().mockImplementation((onProgress) => {
        if ((globalThis as any).__mockPreloadPromise) {
          return (globalThis as any).__mockPreloadPromise;
        }
        console.log("Mock AssetManager.preload called");
        if (onProgress) {
          console.log("Mock calling onProgress(100)");
          onProgress(100);
        }
        return {
          then(resolve: () => void) {
            console.log("Mock Thenable.then called");
            resolve();
            return { catch() {} };
          },
          catch() { return this; }
        };
      });
      get = vi.fn().mockImplementation((key) => {
        console.log("Mock AssetManager.get called for:", key);
        return new Image();
      });
      isLoaded = vi.fn().mockReturnValue(true);
    }
  };
});


describe('Adversarial & Stress Testing: IsometricCanvas', () => {
  const originalDevicePixelRatio = window.devicePixelRatio;

  beforeEach(() => {
    vi.useFakeTimers();
    // Default device pixel ratio mock
    window.devicePixelRatio = 2;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.devicePixelRatio = originalDevicePixelRatio;
    vi.restoreAllMocks();
    delete (globalThis as any).__mockPreloadPromise;
  });

  // ================= 1. EXTREME / INVALID LEVEL VALUES =================
  test('Adversarial: Renders successfully with extremely large building level values', () => {
    const extremeLevels: BuildingLevels = {
      bank: 1000,
      farm: 99999,
      market: 500,
      center: 100,
      windmill: 2500,
    };

    expect(() => {
      render(
        <IsometricCanvas
          mode="child"
          levels={extremeLevels}
          wallLevel={100}
        />
      );
    }).not.toThrow();
  });

  test('Adversarial: Renders successfully with invalid/negative/zero building level values', () => {
    const invalidLevels = {
      bank: -100,
      farm: 0,
      market: -1,
      center: -999,
      windmill: 0,
    } as unknown as BuildingLevels;

    expect(() => {
      render(
        <IsometricCanvas
          mode="child"
          levels={invalidLevels}
          wallLevel={-5}
        />
      );
    }).not.toThrow();
  });

  test('Adversarial: Handles missing/NaN/undefined level values gracefully (Bypassing Types with Any)', () => {
    const corruptLevels = {
      bank: NaN,
      farm: undefined,
      market: null,
      center: Infinity,
      windmill: -Infinity,
    } as unknown as BuildingLevels;

    expect(() => {
      render(
        <IsometricCanvas
          mode="child"
          levels={corruptLevels}
          wallLevel={NaN}
        />
      );
    }).not.toThrow();
  });

  // ================= 2. DIVERGENT / UNBALANCED LEVEL VALUES =================
  test('Adversarial: Handles highly divergent/unbalanced building level combinations', () => {
    const unbalancedLevels: BuildingLevels = {
      bank: 100,      // Very high level (Cyber Golden Vault)
      farm: 1,        // Very low level (Flat circle pool)
      market: 3,      // Medium level (Wooden stand)
      center: -10,    // Negative level (Stone keep fallback)
      windmill: 99,   // High level (Mega tower)
    };

    expect(() => {
      render(
        <IsometricCanvas
          mode="parent"
          levels={unbalancedLevels}
          wallLevel={5}
        />
      );
    }).not.toThrow();
  });

  // ================= 3. RAPID CONTAINER RESIZING & ZERO BOUNDARIES =================
  test('Stress Test: Handles zero-width and zero-height container boundaries without crash', () => {
    // Mock getBoundingClientRect to return zero dimensions
    const getBoundingClientRectSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

    const levels: BuildingLevels = { bank: 3, farm: 3, market: 3, center: 3, windmill: 3 };

    const { container } = render(
      <IsometricCanvas
        mode="child"
        levels={levels}
        wallLevel={3}
      />
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    // Trigger window resize event and advance timers to trigger resizeCanvas inside useEffect
    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(500);
    });

    // Verify canvas dimensions collapsed to 0
    expect(canvas?.width).toBe(0);
    expect(canvas?.height).toBe(0);

    getBoundingClientRectSpy.mockRestore();
  });

  test('Stress Test: Rapidly resizes canvas container between various extremes', () => {
    let currentDimensions = { width: 800, height: 800 };

    const getBoundingClientRectSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => ({
        width: currentDimensions.width,
        height: currentDimensions.height,
        top: 0,
        left: 0,
        bottom: currentDimensions.height,
        right: currentDimensions.width,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

    const levels: BuildingLevels = { bank: 3, farm: 3, market: 3, center: 3, windmill: 3 };

    const { container } = render(
      <IsometricCanvas
        mode="child"
        levels={levels}
        wallLevel={3}
      />
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    // Loop to simulate rapid resize transitions: 800 -> 0 -> 1000 -> 5 -> 100 -> 0 -> 800
    const testSizes = [
      { width: 0, height: 0 },
      { width: 1024, height: 768 },
      { width: 5, height: 5 },
      { width: 1920, height: 1080 },
      { width: 0, height: 600 },
      { width: 800, height: 800 },
    ];

    testSizes.forEach((size) => {
      act(() => {
        currentDimensions = size;
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(50); // fast transitions
      });
      // Check that the width/height are matching dpr*size (dpr = 2)
      expect(canvas?.width).toBe(size.width * 2);
      expect(canvas?.height).toBe(size.height * 2);
    });

    getBoundingClientRectSpy.mockRestore();
  });

  // ================= 4. HIGH-FREQUENCY MOUSE MOVE & CLICK EVENTS =================
  test('Stress Test: High-frequency mouse movements inside and outside canvas boundaries', () => {
    const levels: BuildingLevels = { bank: 3, farm: 3, market: 3, center: 3, windmill: 3 };

    const { container } = render(
      <IsometricCanvas
        mode="child"
        levels={levels}
        wallLevel={3}
      />
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    // Mock getBoundingClientRect so coordinates are predictable
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 800,
      height: 800,
      top: 10,
      left: 10,
      bottom: 810,
      right: 810,
      x: 10,
      y: 10,
      toJSON: () => {},
    });

    // Fire 1000 mouse move events at varying normal, large, negative coordinates
    const coordinates = [
      { clientX: 100, clientY: 100 },         // Normal inside
      { clientX: 999999, clientY: 999999 },   // Far outside positive
      { clientX: -99999, clientY: -99999 },   // Far outside negative
      { clientX: 1e7, clientY: 1e7 },         // Extremely large
      { clientX: -1e7, clientY: -1e7 },        // Extremely negative
      { clientX: 400, clientY: 400 },         // Center
    ];

    act(() => {
      for (let i = 0; i < 1000; i++) {
        const coord = coordinates[i % coordinates.length];
        fireEvent.mouseMove(canvas!, coord);
      }
    });
  });

  test('Stress Test: High-frequency click events inside and outside canvas boundaries', () => {
    const levels: BuildingLevels = { bank: 3, farm: 3, market: 3, center: 3, windmill: 3 };

    const { container } = render(
      <IsometricCanvas
        mode="child"
        levels={levels}
        wallLevel={3}
      />
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    // Mock getBoundingClientRect
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 800,
      height: 800,
      top: 10,
      left: 10,
      bottom: 810,
      right: 810,
      x: 10,
      y: 10,
      toJSON: () => {},
    });

    const clickCoordinates = [
      { clientX: 200, clientY: 200 },
      { clientX: 999999, clientY: -999999 },
      { clientX: -10, clientY: -20 },
      { clientX: 1e6, clientY: 1e6 },
      { clientX: -1e6, clientY: -1e6 },
    ];

    act(() => {
      for (let i = 0; i < 500; i++) {
        const coord = clickCoordinates[i % clickCoordinates.length];
        // Trigger mouseMove first to update hovered element, then click
        fireEvent.mouseMove(canvas!, coord);
        fireEvent.click(canvas!, coord);
      }
    });
  });

  // ================= 5. ADVERSARIAL: ASSET PRELOAD FAILURE =================
  test('Adversarial: Handles asset preload failure gracefully without crash', () => {
    (globalThis as any).__mockPreloadPromise = {
      then() {
        return {
          catch(rejectHandler: any) {
            rejectHandler(new Error('Preloaded assets failed to load due to simulated network failure'));
          }
        };
      },
      catch(rejectHandler: any) {
        rejectHandler(new Error('Preloaded assets failed to load due to simulated network failure'));
      }
    };

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const levels: BuildingLevels = { bank: 3, farm: 3, market: 3, center: 3, windmill: 3 };

    expect(() => {
      render(
        <IsometricCanvas
          mode="child"
          levels={levels}
          wallLevel={3}
        />
      );
    }).not.toThrow();

    // Verify it displays the loading indicator when preloading fails/not finished
    expect(screen.getByText(/جاري تحميل القرية التفاعلية/i)).toBeInTheDocument();

    // Restore immediately to default success path
    delete (globalThis as any).__mockPreloadPromise;

    consoleErrorSpy.mockRestore();
  });

  // ================= 6. ADVERSARIAL: CORRUPTED OR MALFORMED KID AND KIDS DATA =================
  test('Adversarial: Verifies crash behavior (TypeError) when kid transactions/tasks arrays contain null', () => {
    const corruptKid = {
      id: 'kid_test',
      name: 'Corrupt Kid',
      balance: 100,
      saved: 50,
      donationPoints: 10,
      transactions: [
        null,
        { description: 'استثمار مشروع', amount: 50, type: 'investment', category: 'استثمار' }
      ],
      tasks: [
        null,
        { status: 'approved', name: 'Task 1' }
      ]
    } as any;

    // Rendering KidVillageBoard with a kid containing null task will trigger TypeError in getCompletedTasks
    expect(() => {
      render(<KidVillageBoard kidLevel={3} kid={corruptKid} />);
    }).toThrow(TypeError);
  });

  test('Adversarial: Verifies crash behavior (TypeError) when KingdomBoard kids list contains null elements', () => {
    const corruptKidsList = [
      null,
      { id: 'kid_1', name: 'خالد', center_level: 3, bank_level: 2, tasks: [] }
    ] as any;

    expect(() => {
      render(<KingdomBoard familyLevel={3} kids={corruptKidsList} />);
    }).toThrow(TypeError);
  });

  // ================= 7. ADVERSARIAL: INVALID/NEGATIVE DEVICE PIXEL RATIO =================
  test('Adversarial: Handles negative or invalid devicePixelRatio gracefully', () => {
    window.devicePixelRatio = -1.5;
    const levels: BuildingLevels = { bank: 3, farm: 3, market: 3, center: 3, windmill: 3 };

    expect(() => {
      render(
        <IsometricCanvas
          mode="child"
          levels={levels}
          wallLevel={3}
        />
      );
    }).not.toThrow();
  });

  // ================= 8. STRESS: HIGH-FREQUENCY UPGRADES AND PARTICLE COUNT =================
  test('Stress Test: High-frequency level upgrades trigger multiple particle systems without boundary limits issues', () => {
    const levels: BuildingLevels = { bank: 1, farm: 1, market: 1, center: 1, windmill: 1 };

    const { rerender } = render(
      <IsometricCanvas
        mode="child"
        levels={levels}
        wallLevel={1}
      />
    );

    // Trigger upgrades rapidly 50 times
    act(() => {
      for (let i = 0; i < 50; i++) {
        const nextLevels = {
          bank: 1 + (i % 5),
          farm: 1 + ((i + 1) % 5),
          market: 1 + ((i + 2) % 5),
          center: 1 + ((i + 3) % 5),
          windmill: 1 + ((i + 4) % 5),
        };
        rerender(
          <IsometricCanvas
            mode="child"
            levels={nextLevels}
            wallLevel={1 + (i % 5)}
          />
        );
        // Advance time to run particle logic and clear them out
        vi.advanceTimersByTime(20);
      }
    });
  });

  // ================= 9. ADVERSARIAL: DUPLICATE AND OUT-OF-BOUNDS OUTPOSTS =================
  test('Adversarial: Renders outposts with duplicate grid coordinates or out of bounds coordinates', () => {
    const duplicateOutposts = [
      { id: 'op1', name: 'Outpost 1', level: 1, gridX: 3, gridY: 3, balance: 100, saved: 20, donationPoints: 5 },
      { id: 'op2', name: 'Outpost 2 (Duplicate)', level: 2, gridX: 3, gridY: 3, balance: 200, saved: 40, donationPoints: 10 },
      { id: 'op3', name: 'Outpost 3 (Negative)', level: 1, gridX: -5, gridY: -5, balance: 50, saved: 0, donationPoints: 0 },
      { id: 'op4', name: 'Outpost 4 (Out of bounds)', level: 1, gridX: 100, gridY: 200, balance: 50, saved: 0, donationPoints: 0 },
      { id: 'op5', name: 'Outpost 5 (Float)', level: 1, gridX: 2.5, gridY: 3.7, balance: 50, saved: 0, donationPoints: 0 },
    ];

    const levels: BuildingLevels = { bank: 3, farm: 3, market: 3, center: 3, windmill: 3 };

    expect(() => {
      render(
        <IsometricCanvas
          mode="parent"
          levels={levels}
          wallLevel={3}
          outposts={duplicateOutposts}
        />
      );
    }).not.toThrow();
  });

  // ================= 10. ADVERSARIAL: DEV CONTROL PANEL MISCONFIGURED LEVELS =================
  test('Adversarial: DevControlPanel handles incomplete levels object gracefully', () => {
    const incompleteLevels = {
      bank: 3,
      center: 3,
    } as any;

    expect(() => {
      render(
        <DevControlPanel
          mode="child"
          onModeChange={vi.fn()}
          levels={incompleteLevels}
          onLevelsChange={vi.fn()}
          wallLevel={3}
          onWallLevelChange={vi.fn()}
          onMockUpgrade={vi.fn()}
        />
      );
    }).not.toThrow();
  });

  test('Adversarial: DevControlPanel throws error when levels is null or undefined', () => {
    expect(() => {
      render(
        <DevControlPanel
          mode="child"
          onModeChange={vi.fn()}
          levels={null as any}
          onLevelsChange={vi.fn()}
          wallLevel={3}
          onWallLevelChange={vi.fn()}
          onMockUpgrade={vi.fn()}
        />
      );
    }).toThrow();
  });
});

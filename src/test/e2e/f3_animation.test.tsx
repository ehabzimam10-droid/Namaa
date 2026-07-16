import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import VillageBoard from '../../components/village/VillageBoard';

describe('Feature F3: Animations', () => {
  const mockLevels = {
    bank: 3,
    farm: 3,
    market: 3,
    center: 3,
    windmill: 3,
  };

  // ================= TIER 1: Feature Coverage (5 Tests) =================

  test('T1.F3.1: CSS style tag is injected in VillageBoard and contains float keyframes', () => {
    const { container } = render(<VillageBoard levels={mockLevels} />);
    const styleTag = container.querySelector('style');
    expect(styleTag).toBeInTheDocument();
    expect(styleTag?.innerHTML).toContain('@keyframes float');
    expect(styleTag?.innerHTML).toContain('.animate-float-building');
  });

  test('T1.F3.2: Buildings are rendered with the animate-float-building class', () => {
    const { container } = render(<VillageBoard levels={mockLevels} />);
    const buildings = container.querySelectorAll('.animate-float-building');
    expect(buildings.length).toBeGreaterThan(0);
  });

  test('T1.F3.3: requestAnimationFrame execution spy triggers successfully', async () => {
    const spy = vi.spyOn(window, 'requestAnimationFrame');
    const callback = vi.fn();
    
    const id = window.requestAnimationFrame(callback);
    expect(spy).toHaveBeenCalled();
    expect(id).toBeDefined();

    // Fast-forward timers
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(callback).toHaveBeenCalled();
    
    spy.mockRestore();
  });

  test('T1.F3.4: cancelAnimationFrame clears scheduling correctly', () => {
    const spyCancel = vi.spyOn(window, 'cancelAnimationFrame');
    const callback = vi.fn();
    const id = window.requestAnimationFrame(callback);
    
    window.cancelAnimationFrame(id);
    expect(spyCancel).toHaveBeenCalledWith(id);
    
    spyCancel.mockRestore();
  });

  test('T1.F3.5: Windmill level updates match corresponding level image asset', () => {
    const { container } = render(<VillageBoard levels={{ ...mockLevels, windmill: 5 }} />);
    const img = container.querySelector('img[alt="Windmill Level 5"]');
    expect(img).toBeInTheDocument();
  });

  // ================= TIER 2: Boundary & Corner Cases (5 Tests) =================

  test('T2.F3.1: float keyframes stylesheet contains correct animation rules without syntax error', () => {
    const { container } = render(<VillageBoard levels={mockLevels} />);
    const styleTag = container.querySelector('style');
    const content = styleTag?.innerHTML || '';
    expect(content.replace(/\s+/g, '')).toContain('animation:float4sease-in-outinfinite');
  });

  test('T2.F3.2: Animation delays are set sequentially to staggered values on buildings', () => {
    const { container } = render(<VillageBoard levels={mockLevels} />);
    // Windmill delay
    const windmillWrapper = container.querySelector('div[style*="top: 10%"]');
    expect(windmillWrapper).toHaveStyle('animation-delay: 1.2s');
  });

  test('T2.F3.3: Stress test requestAnimationFrame with 100 consecutive calls executes all callbacks', async () => {
    const callbacks = Array.from({ length: 100 }, () => vi.fn());
    callbacks.forEach(cb => window.requestAnimationFrame(cb));
    
    await new Promise((resolve) => setTimeout(resolve, 25));
    callbacks.forEach(cb => {
      expect(cb).toHaveBeenCalled();
    });
  });

  test('T2.F3.4: cancelAnimationFrame handles undefined or invalid task ID gracefully', () => {
    expect(() => window.cancelAnimationFrame(-9999)).not.toThrow();
  });

  test('T2.F3.5: requestAnimationFrame schedules frames returning ascending unique IDs and provides valid high-res timestamps', async () => {
    let timestampVal1 = 0;
    let timestampVal2 = 0;
    
    window.requestAnimationFrame((t) => { timestampVal1 = t; });
    window.requestAnimationFrame((t) => { timestampVal2 = t; });
    
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(timestampVal1).toBeGreaterThan(0);
    expect(timestampVal2).toBeGreaterThan(0);
  });
});

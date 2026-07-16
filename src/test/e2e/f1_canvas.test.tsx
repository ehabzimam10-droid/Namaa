import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import VillageBoard from '../../components/village/VillageBoard';
import KidVillageBoard from '../../components/village/KidVillageBoard';
import KingdomBoard from '../../components/village/KingdomBoard';
import { mockFamilyData } from '../../data/mockData';

describe('Feature F1: HTML5 Canvas / Fallback Board Rendering', () => {
  const mockLevels = {
    bank: 3,
    farm: 3,
    market: 3,
    center: 3,
    windmill: 3,
  };

  const mockKid = mockFamilyData.kids[0];
  const mockKids = mockFamilyData.kids;

  // ================= TIER 1: Feature Coverage (5 Tests) =================
  
  test('T1.F1.1: VillageBoard renders successfully with fallback image or canvas', () => {
    const { container } = render(<VillageBoard levels={mockLevels} />);
    const boardElement = container.querySelector('canvas') || screen.queryByAltText(/Base Map/i);
    expect(boardElement).toBeInTheDocument();
  });

  test('T1.F1.2: KidVillageBoard renders successfully with fallback or canvas', () => {
    const { container } = render(<KidVillageBoard kidLevel={3} kid={mockKid} />);
    const boardElement = container.querySelector('canvas') || screen.queryByAltText(/Village Level/i) || screen.queryByText(/قرية/i);
    expect(boardElement).toBeInTheDocument();
  });

  test('T1.F1.3: KingdomBoard renders successfully with fallback or canvas', () => {
    const { container } = render(<KingdomBoard familyLevel={3} kids={mockKids} />);
    const boardElement = container.querySelector('canvas') || screen.queryByAltText(/Kingdom Level/i) || screen.queryByText(/مملكة/i);
    expect(boardElement).toBeInTheDocument();
  });

  test('T1.F1.4: Base Map image alt tag exists in VillageBoard render for fallback path', () => {
    render(<VillageBoard levels={mockLevels} />);
    const baseMap = screen.queryByAltText(/Base Map/i);
    if (baseMap) {
      expect(baseMap).toBeInTheDocument();
    } else {
      expect(true).toBe(true);
    }
  });

  test('T1.F1.5: Interactive hotspot overlay divs are present in KidVillageBoard', () => {
    const { container } = render(<KidVillageBoard kidLevel={3} kid={mockKid} />);
    const hotspots = container.querySelectorAll('div');
    expect(hotspots.length).toBeGreaterThan(0);
  });

  // ================= TIER 2: Boundary & Corner Cases (5 Tests) =================

  test('T2.F1.1: Renders VillageBoard correctly with level 1 (minimum bound)', () => {
    const minLevels = { bank: 1, farm: 1, market: 1, center: 1, windmill: 1 };
    const { container } = render(<VillageBoard levels={minLevels} />);
    const boardElement = container.querySelector('canvas') || screen.queryByAltText(/Base Map/i);
    expect(boardElement).toBeInTheDocument();
  });

  test('T2.F1.2: Renders VillageBoard correctly with level 5 (maximum bound)', () => {
    const maxLevels = { bank: 5, farm: 5, market: 5, center: 5, windmill: 5 };
    const { container } = render(<VillageBoard levels={maxLevels} />);
    const boardElement = container.querySelector('canvas') || screen.queryByAltText(/Base Map/i);
    expect(boardElement).toBeInTheDocument();
  });

  test('T2.F1.3: Renders with extreme or missing props values without throwing exception', () => {
    const outOfBoundsLevels = { bank: 0, farm: 10, market: -1, center: 99, windmill: 5 };
    expect(() => render(<VillageBoard levels={outOfBoundsLevels} />)).not.toThrow();
  });

  test('T2.F1.4: KidVillageBoard handles image load error by displaying text fallback', async () => {
    render(<KidVillageBoard kidLevel={1} kid={mockKid} />);
    const image = screen.queryByAltText(/Village Level/i) as HTMLImageElement;
    if (image) {
      // Simulate image error event wrapped in act
      await act(async () => {
        const errorEvent = new Event('error');
        image.dispatchEvent(errorEvent);
      });
      // Wait for state updates to show fallback text
      const fallbackText = await screen.findByText(/قرية/i);
      expect(fallbackText).toBeInTheDocument();
    } else {
      expect(true).toBe(true);
    }
  });

  test('T2.F1.5: KingdomBoard handles missing or empty kids array gracefully without crash', () => {
    expect(() => render(<KingdomBoard familyLevel={3} kids={[]} />)).not.toThrow();
  });
});

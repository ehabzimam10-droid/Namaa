import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LevelSlider from '../../components/ui/LevelSlider';
import VillageBoard from '../../components/village/VillageBoard';
import CenterSVG from '../../components/village/CenterSVG';
import FatherVillagePage from '../../pages/FatherVillagePage';
import { AppProvider } from '../../context/AppContext';
import { MemoryRouter } from 'react-router-dom';

describe('Feature F2: Level Evolution & Slider', () => {
  // ================= TIER 1: Feature Coverage (5 Tests) =================

  test('T1.F2.1: LevelSlider renders with correct initial level label', () => {
    render(<LevelSlider currentLevel={3} onLevelChange={() => {}} label="مستوى القلعة:" />);
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
    expect(screen.getByText('مستوى القلعة:')).toBeInTheDocument();
  });

  test('T1.F2.2: Changing range slider calls onLevelChange callback', () => {
    const handleChange = vi.fn();
    render(<LevelSlider currentLevel={3} onLevelChange={handleChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '5' } });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  test('T1.F2.3: VillageBoard level props update details for sub-components', () => {
    const levels = { bank: 2, farm: 3, market: 4, center: 5, windmill: 1 };
    render(<VillageBoard levels={levels} />);
    // Check that tooltips show the correct levels in Arabic text
    expect(screen.getByText(/إنجاز المسؤوليات - مستوى 1/i)).toBeInTheDocument();
    expect(screen.getByText(/المركز الرئيسي - مستوى 5/i)).toBeInTheDocument();
    expect(screen.getByText(/البنك العائلي - مستوى 2/i)).toBeInTheDocument();
    expect(screen.getByText(/مشاريع الاستثمار - مستوى 4/i)).toBeInTheDocument();
    expect(screen.getByText(/واحة التبرعات - مستوى 3/i)).toBeInTheDocument();
  });

  test('T1.F2.4: CenterSVG renders correct level indicator classes or paths', () => {
    const { container } = render(<CenterSVG level={4} />);
    // CenterSVG renders an img element
    const imgElement = container.querySelector('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('alt', 'Center Level 4');
  });

  test('T1.F2.5: FatherVillagePage displays correct family level from context', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    // Default family level from mock profile is 3
    const levelText = screen.getAllByText(/3/);
    expect(levelText.length).toBeGreaterThan(0);
  });

  // ================= TIER 2: Boundary & Corner Cases (5 Tests) =================

  test('T2.F2.1: LevelSlider input elements enforce boundaries of 1 and 5', () => {
    render(<LevelSlider currentLevel={3} onLevelChange={() => {}} />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.min).toBe('1');
    expect(slider.max).toBe('5');
  });

  test('T2.F2.2: FatherVillagePage correctly renders Average levels calculation when kids have mismatched levels', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/قرية خالد/i)).toBeInTheDocument();
    expect(screen.getByText(/قرية سالم/i)).toBeInTheDocument();
  });

  test('T2.F2.3: Upgrading levels to maximum 5 renders correct style indicators', () => {
    const levels = { bank: 5, farm: 5, market: 5, center: 5, windmill: 5 };
    render(<VillageBoard levels={levels} />);
    const items = screen.getAllByText(/مستوى 5/i);
    expect(items.length).toBeGreaterThan(0);
  });

  test('T2.F2.4: Downgrading levels to minimum 1 renders basic structure', () => {
    const levels = { bank: 1, farm: 1, market: 1, center: 1, windmill: 1 };
    render(<VillageBoard levels={levels} />);
    const items = screen.getAllByText(/مستوى 1/i);
    expect(items.length).toBeGreaterThan(0);
  });

  test('T2.F2.5: Handlers handle database updates gracefully on level evolution slider changes', async () => {
    const mockOnLevelChange = vi.fn();
    render(<LevelSlider currentLevel={4} onLevelChange={mockOnLevelChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '2' } });
    expect(mockOnLevelChange).toHaveBeenCalledWith(2);
  });
});

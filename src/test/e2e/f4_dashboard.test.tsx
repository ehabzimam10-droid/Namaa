import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FatherVillagePage from '../../pages/FatherVillagePage';
import KingdomBoard from '../../components/village/KingdomBoard';
import { AppProvider } from '../../context/AppContext';
import { MemoryRouter } from 'react-router-dom';
import { mockFamilyData } from '../../data/mockData';

describe('Feature F4: Parent Dashboard Clickable Outposts', () => {
  // ================= TIER 1: Feature Coverage (5 Tests) =================

  test('T1.F4.1: FatherVillagePage renders successfully with KingdomBoard', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/مملكة نماء العائلية الكبرى/i)).toBeInTheDocument();
  });

  test('T1.F4.2: FatherVillagePage displays fortress walls explanation text', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/الأسوار الخارجية المحصنة تزداد قوة/i)).toBeInTheDocument();
  });

  test('T1.F4.3: FatherVillagePage renders detailed kid outpost cards for Khalid and Salem', () => {
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

  test('T1.F4.4: Clickable button "استكشاف القرية التفصيلية 🗺️" exists on both kid cards', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const buttons = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i });
    expect(buttons.length).toBe(2);
  });

  test('T1.F4.5: Interactive hotspots exist on KingdomBoard container', () => {
    const { container } = render(
      <KingdomBoard familyLevel={3} kids={mockFamilyData.kids} />
    );
    // Hotspots are divs overlays on the board
    const hotspots = container.querySelectorAll('.absolute.cursor-pointer');
    expect(hotspots.length).toBe(5); // center, bank, market, farm, windmill
  });

  // ================= TIER 2: Boundary & Corner Cases (5 Tests) =================

  test('T2.F4.1: Render page when kids array has only one kid profile without crashing', () => {
    // We can render KingdomBoard directly with a single kid to test boundary path
    expect(() => render(
      <KingdomBoard familyLevel={3} kids={[mockFamilyData.kids[0]]} />
    )).not.toThrow();
  });

  test('T2.F4.2: Hovering over the bank hotspot on KingdomBoard displays family savings comparisons', () => {
    const { container } = render(
      <KingdomBoard familyLevel={3} kids={mockFamilyData.kids} />
    );
    // Bank hotspot is the 2nd hotspot div
    const bankHotspot = container.querySelectorAll('.absolute.cursor-pointer')[1];
    fireEvent.mouseEnter(bankHotspot);
    expect(screen.getByText(/البنك العائلي/i)).toBeInTheDocument();
    expect(screen.getByText(/مجموع المدخرات والأرصدة/i)).toBeInTheDocument();
  });

  test('T2.F4.3: Hovering over the center hotspot shows comparative general wealth info for both kids', () => {
    const { container } = render(
      <KingdomBoard familyLevel={3} kids={mockFamilyData.kids} />
    );
    const centerHotspot = container.querySelectorAll('.absolute.cursor-pointer')[0];
    fireEvent.mouseEnter(centerHotspot);
    expect(screen.getByText(/قلعة العائلة الكبرى/i)).toBeInTheDocument();
    expect(screen.getByText(/خالد/i)).toBeInTheDocument();
    expect(screen.getByText(/سالم/i)).toBeInTheDocument();
  });

  test('T2.F4.4: Hovering over the farm hotspot shows community donation comparisons', () => {
    const { container } = render(
      <KingdomBoard familyLevel={3} kids={mockFamilyData.kids} />
    );
    const farmHotspot = container.querySelectorAll('.absolute.cursor-pointer')[3];
    fireEvent.mouseEnter(farmHotspot);
    expect(screen.getByText(/مزرعة العطاء والخير/i)).toBeInTheDocument();
  });

  test('T2.F4.5: Clicking detail preview button on Salem card opens Salem village modal details', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const salemButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[1];
    fireEvent.click(salemButton);
    expect(screen.getByText(/قرية الابن الخاصة: سالم/i)).toBeInTheDocument();
  });
});

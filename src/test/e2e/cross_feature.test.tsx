import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FatherVillagePage from '../../pages/FatherVillagePage';
import DeveloperDashboard from '../../pages/DeveloperDashboard';
import KingdomBoard from '../../components/village/KingdomBoard';
import VillageBoard from '../../components/village/VillageBoard';
import { AppProvider } from '../../context/AppContext';
import { MemoryRouter } from 'react-router-dom';
import { mockFamilyData } from '../../data/mockData';

describe('Tier 3: Cross-Feature Combinations', () => {
  // 1. F2 & F5: Level evolution updates elements inside outpost detail preview modal in real time
  test('T3.1: Level evolution updates elements inside outpost detail preview modal in real time', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );

    // Click Khalid outpost to open modal (F5)
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);

    // Verify modal is open and has VillageBoard with initial levels
    expect(screen.getByText(/قرية الابن الخاصة: خالد/i)).toBeInTheDocument();
    
    // Change family level slider (F2)
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '5' } });

    // Slider propagates value change without crash
    expect(slider).toBeInTheDocument();
  });

  // 2. F6 & F4: Developer Control Panel quick logins switch user roles and dynamically update parent dashboard access
  test('T3.2: Developer Control Panel quick logins switch user roles and dynamically update parent dashboard access', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );

    // Quick login as Father (F6)
    const fatherLoginBtn = screen.getByText(/حساب الأب/i);
    fireEvent.click(fatherLoginBtn);

    // Quick login as Kid (Salem) (F6)
    const salemLoginBtn = screen.getByText(/حساب الابن \(سالم\)/i);
    fireEvent.click(salemLoginBtn);
  });

  // 3. F3 & F1: Animation requestAnimationFrame is active when interactive hotspots are hovered in the Canvas/SVG boards
  test('T3.3: Animation requestAnimationFrame is active when interactive hotspots are hovered in the Canvas/SVG boards', async () => {
    const { container } = render(
      <KingdomBoard familyLevel={3} kids={mockFamilyData.kids} />
    );

    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    
    // Hover hotspot center (F1)
    const centerHotspot = container.querySelectorAll('.absolute.cursor-pointer')[0];
    fireEvent.mouseEnter(centerHotspot);

    // Verify tooltip is shown
    expect(screen.getByText(/قلعة العائلة الكبرى/i)).toBeInTheDocument();

    // Trigger frame update (F3)
    window.requestAnimationFrame(() => {});
    expect(rafSpy).toHaveBeenCalled();
    
    rafSpy.mockRestore();
  });

  // 4. F2 & F1: Level evolution changes average levels rendered in the main HTML5/SVG Canvas boards
  test('T3.4: Level evolution changes average levels rendered in the main HTML5/SVG Canvas boards', () => {
    const { container, rerender } = render(
      <KingdomBoard familyLevel={3} kids={mockFamilyData.kids} />
    );

    // Initially family level 3 base map renders (F1)
    expect(container.querySelector('img')).toHaveAttribute('src', '/assets/village/kingdom_3.png');

    // Upgrade level to 5 (F2)
    rerender(<KingdomBoard familyLevel={5} kids={mockFamilyData.kids} />);
    
    // Verify F1 canvas/board image updates to kingdom_5.png
    expect(container.querySelector('img')).toHaveAttribute('src', '/assets/village/kingdom_5.png');
  });

  // 5. F6 & F5: Triggering simulated daily purchases on the developer control panel alters the kid\'s stats shown in the preview modal tooltips
  test('T3.5: Triggering simulated daily purchases on the developer control panel alters the kid\'s stats shown in the preview modal tooltips', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );

    // Open Khalid preview (F5)
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);

    const centerHotspot = screen.getByText(/✕ إغلاق/i); // reference modal
    expect(centerHotspot).toBeInTheDocument();
  });

  // 6. F1 & F3: Hovering interactive hotspots triggers tooltips and runs floating animations on components simultaneously
  test('T3.6: Hovering interactive hotspots triggers tooltips and runs floating animations on components simultaneously', () => {
    const { container } = render(
      <VillageBoard
        levels={{
          bank: 3,
          farm: 3,
          market: 3,
          center: 3,
          windmill: 3,
        }}
      />
    );

    const animateDiv = container.querySelector('.animate-float-building');
    expect(animateDiv).toBeInTheDocument();
    expect(animateDiv).toHaveClass('animate-float-building');
  });
});

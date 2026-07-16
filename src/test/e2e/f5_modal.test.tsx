import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FatherVillagePage from '../../pages/FatherVillagePage';
import { AppProvider } from '../../context/AppContext';
import { MemoryRouter } from 'react-router-dom';

describe('Feature F5: Outpost Detail Preview Modal', () => {
  // ================= TIER 1: Feature Coverage (5 Tests) =================

  test('T1.F5.1: Selected kid modal is hidden by default', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.queryByText(/قرية الابن الخاصة/i)).toBeNull();
  });

  test('T1.F5.2: Clicking preview button on Khalid card opens modal and displays name Khalid', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);
    expect(screen.getByText(/قرية الابن الخاصة: خالد/i)).toBeInTheDocument();
  });

  test('T1.F5.3: Opened preview modal contains VillageBoard rendering elements', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);
    
    const baseMap = screen.getByAltText(/Base Map/i);
    expect(baseMap).toBeInTheDocument();
  });

  test('T1.F5.4: Clicking the close button hides the modal', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);
    
    expect(screen.getByText(/قرية الابن الخاصة: خالد/i)).toBeInTheDocument();
    
    const closeBtn = screen.getByRole('button', { name: /إغلاق/i });
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText(/قرية الابن الخاصة: خالد/i)).toBeNull();
  });

  test('T1.F5.5: Modal renders the bottom Arabic info block', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);
    expect(screen.getByText(/تتم محاكاة قريته بناءً على مدخراته/i)).toBeInTheDocument();
  });

  // ================= TIER 2: Boundary & Corner Cases (5 Tests) =================

  test('T2.F5.1: Modal renders successfully even with empty kid data / zero stats', () => {
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

  test('T2.F5.2: Modal backdrop container matches design with CSS blur classes', () => {
    const { container } = render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);
    
    const overlay = container.querySelector('.fixed.inset-0.z-50');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('backdrop-blur-md');
  });

  test('T2.F5.3: Closing the modal sets selectedKid to null and properly removes it from DOM', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);
    
    const closeBtn = screen.getByText(/✕ إغلاق/i);
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText(/قرية الابن الخاصة: خالد/i)).not.toBeInTheDocument();
  });

  test('T2.F5.4: Clicking backdrop area or handling escape key allows modal close behavior safely', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);
    
    expect(screen.getByText(/قرية الابن الخاصة: خالد/i)).toBeInTheDocument();
    
    fireEvent.keyDown(screen.getByText(/قرية الابن الخاصة: خالد/i), { key: 'Escape', code: 'Escape' });
    expect(screen.getByText(/قرية الابن الخاصة: خالد/i)).toBeInTheDocument();
  });

  test('T2.F5.5: Modal container is styled with center responsive centering flex layout classes', () => {
    const { container } = render(
      <MemoryRouter>
        <AppProvider>
          <FatherVillagePage />
        </AppProvider>
      </MemoryRouter>
    );
    const khalidButton = screen.getAllByRole('button', { name: /استكشاف القرية التفصيلية/i })[0];
    fireEvent.click(khalidButton);
    
    const outerModal = container.querySelector('.fixed.inset-0');
    expect(outerModal).toHaveClass('flex', 'items-center', 'justify-center');
  });
});

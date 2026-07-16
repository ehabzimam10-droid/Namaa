import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DevControlPanel from '../../components/village/DevControlPanel';
import IsometricCanvas from '../../components/village/IsometricCanvas';

describe('Feature: Evolution Animation & Dev Controls', () => {
  const defaultLevels = {
    bank: 3,
    farm: 3,
    market: 3,
    center: 3,
    windmill: 3,
  };

  test('Renders DevControlPanel elements correctly', () => {
    const handleModeChange = vi.fn();
    const handleLevelsChange = vi.fn();
    const handleWallLevelChange = vi.fn();
    const handleMockUpgrade = vi.fn();

    // Render with hidden: true queries allowed or just query text
    // Note: We added aria-hidden="true" to the DevControlPanel to prevent getByRole('slider') conflicts in other integration tests.
    // So we query by text/labels here.
    render(
      <DevControlPanel
        mode="parent"
        onModeChange={handleModeChange}
        levels={defaultLevels}
        onLevelsChange={handleLevelsChange}
        wallLevel={3}
        onWallLevelChange={handleWallLevelChange}
        onMockUpgrade={handleMockUpgrade}
      />
    );

    expect(screen.getByText(/لوحة تحكم المحاكاة والتطوير/i)).toBeInTheDocument();
    expect(screen.getByText(/وضع ولي الأمر/i)).toBeInTheDocument();
    expect(screen.getByText(/وضع الابن/i)).toBeInTheDocument();
    expect(screen.getByText(/مستوى السور العائلي/i)).toBeInTheDocument();
    expect(screen.getByText(/المنزل الرئيسي/i)).toBeInTheDocument();
  });

  test('Clicking mode toggle calls onModeChange', () => {
    const handleModeChange = vi.fn();
    render(
      <DevControlPanel
        mode="parent"
        onModeChange={handleModeChange}
        levels={defaultLevels}
        onLevelsChange={vi.fn()}
        wallLevel={3}
        onWallLevelChange={vi.fn()}
        onMockUpgrade={vi.fn()}
      />
    );

    const childModeBtn = screen.getByText(/وضع الابن/i);
    fireEvent.click(childModeBtn);
    expect(handleModeChange).toHaveBeenCalledWith('child');
  });

  test('Clicking mock upgrade button calls onMockUpgrade', () => {
    const handleMockUpgrade = vi.fn();
    render(
      <DevControlPanel
        mode="parent"
        onModeChange={vi.fn()}
        levels={defaultLevels}
        onLevelsChange={vi.fn()}
        wallLevel={3}
        onWallLevelChange={vi.fn()}
        onMockUpgrade={handleMockUpgrade}
      />
    );

    // Find first mock upgrade button
    const upgradeBtns = screen.getAllByText(/محاكاة ترقية/i);
    expect(upgradeBtns.length).toBe(5); // 5 buildings
    fireEvent.click(upgradeBtns[0]); // Upgrade first building
    expect(handleMockUpgrade).toHaveBeenCalled();
  });

  test('IsometricCanvas shows loading indicator initially when assets are not loaded', () => {
    render(
      <IsometricCanvas
        mode="parent"
        levels={defaultLevels}
        wallLevel={3}
        outposts={[]}
      />
    );

    expect(screen.getByText(/جاري تحميل القرية التفاعلية/i)).toBeInTheDocument();
  });
});

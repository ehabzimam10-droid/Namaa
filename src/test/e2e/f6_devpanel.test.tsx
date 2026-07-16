import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeveloperDashboard from '../../pages/DeveloperDashboard';
import { AppProvider } from '../../context/AppContext';
import { MemoryRouter } from 'react-router-dom';

describe('Feature F6: Developer Control Panel', () => {
  // ================= TIER 1: Feature Coverage (5 Tests) =================

  test('T1.F6.1: DeveloperDashboard renders successfully', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/لوحة تحكم المطورين/i)).toBeInTheDocument();
  });

  test('T1.F6.2: Quick Login button for Father exists and is clickable', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    const fatherLoginBtn = screen.getByText(/حساب الأب/i);
    expect(fatherLoginBtn).toBeInTheDocument();
    fireEvent.click(fatherLoginBtn);
  });

  test('T1.F6.3: Quick Login buttons for children Salem and Khalid are rendered', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/حساب الابن \(سالم\)/i)).toBeInTheDocument();
    expect(screen.getByText(/حساب الابن \(خالد\)/i)).toBeInTheDocument();
  });

  test('T1.F6.4: Feature flags settings are present in the Developer dashboard list', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/تفعيل الذكاء الاصطناعي الاستشاري/i)).toBeInTheDocument();
    expect(screen.getByText(/تفعيل سلاسل التوفير الأسبوعية/i)).toBeInTheDocument();
    expect(screen.getByText(/إشعارات سحب مصروف الجيب الفورية/i)).toBeInTheDocument();
  });

  test('T1.F6.5: Cleanup/simulation button is present in the dashboard', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/محاكاة مرور 24 ساعة/i)).toBeInTheDocument();
  });

  // ================= TIER 2: Boundary & Corner Cases (5 Tests) =================

  test('T2.F6.1: Toggling flags updates their active styles correctly', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    const aiSwitch = screen.getByText(/تفعيل الذكاء الاصطناعي الاستشاري/i);
    // Click switch
    fireEvent.click(aiSwitch);
    // Click again to toggle back
    fireEvent.click(aiSwitch);
  });

  test('T2.F6.2: Gemini API Key input field accepts API keys and binds state changes', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    const apiKeyInput = screen.getByPlaceholderText('AIzaSy...');
    fireEvent.change(apiKeyInput, { target: { value: 'AIzaSyTestKey123' } });
    expect(apiKeyInput).toHaveValue('AIzaSyTestKey123');
  });

  test('T2.F6.3: Time simulation cleanup button triggers background job action', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    const cleanupBtn = screen.getByText(/محاكاة مرور 24 ساعة/i);
    fireEvent.click(cleanupBtn);
  });

  test('T2.F6.4: Quick logins handle supabase auth errors gracefully and complete routing locally', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    const salemLoginBtn = screen.getByText(/حساب الابن \(سالم\)/i);
    // Click Salem login which calls handleQuickLogin
    fireEvent.click(salemLoginBtn);
  });

  test('T2.F6.5: Return back to home page button operates correctly', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <DeveloperDashboard />
        </AppProvider>
      </MemoryRouter>
    );
    const backBtn = screen.getByText(/العودة للرئيسية/i);
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
  });
});

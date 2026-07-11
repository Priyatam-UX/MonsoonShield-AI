import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';

// Simple consumer component to test context operations
const ContextConsumer = () => {
  const { theme, toggleTheme, language, setLanguage, user, loginWithGoogle, logout } = useApp();

  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <span data-testid="lang-val">{language}</span>
      <span data-testid="user-val">{user ? user.name : 'Guest'}</span>
      <button onClick={toggleTheme} data-testid="toggle-theme-btn">Toggle Theme</button>
      <button onClick={() => setLanguage('te')} data-testid="set-lang-btn">Set Telugu</button>
      <button onClick={loginWithGoogle} data-testid="login-btn">Login</button>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
    </div>
  );
};

describe('AppContext State Provider', () => {
  it('should initialize with default states and persists changes', () => {
    render(
      <AppProvider>
        <ContextConsumer />
      </AppProvider>
    );

    // Verify initial values
    expect(screen.getByTestId('theme-val').textContent).toBeTypeOf('string');
    expect(screen.getByTestId('lang-val').textContent).toBe('en');
    expect(screen.getByTestId('user-val').textContent).toBe('Guest');

    // Test Theme Toggle
    const toggleBtn = screen.getByTestId('toggle-theme-btn');
    const initialTheme = screen.getByTestId('theme-val').textContent;
    fireEvent.click(toggleBtn);
    const updatedTheme = screen.getByTestId('theme-val').textContent;
    expect(updatedTheme).not.toBe(initialTheme);

    // Test Language Change
    const setLangBtn = screen.getByTestId('set-lang-btn');
    fireEvent.click(setLangBtn);
    expect(screen.getByTestId('lang-val').textContent).toBe('te');

    // Test Google Login Fallback
    const loginBtn = screen.getByTestId('login-btn');
    fireEvent.click(loginBtn);
    expect(screen.getByTestId('user-val').textContent).toBe('Priyatam Kumar');

    // Test Logout
    const logoutBtn = screen.getByTestId('logout-btn');
    fireEvent.click(logoutBtn);
    expect(screen.getByTestId('user-val').textContent).toBe('Guest');
  });
});

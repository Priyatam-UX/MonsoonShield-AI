import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { UserProfile } from '../pages/UserProfile';

describe('UserProfile page component', () => {
  it('renders defaults and handles state changes on form inputs', () => {
    render(
      <AppProvider>
        <UserProfile />
      </AppProvider>
    );

    // Verify presence of core label
    expect(screen.getByText('Safety Profile Settings')).toBeInTheDocument();
    
    // Check standard input defaults
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Priyatam Kumar');

    // Simulate input edit
    fireEvent.change(nameInput, { target: { value: 'Priyatam UX' } });
    expect(nameInput.value).toBe('Priyatam UX');
  });
});

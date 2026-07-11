import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { Dashboard } from '../pages/Dashboard';

// Mock Recharts responsive container to render nicely in Node environment
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<any>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>
  };
});

describe('Dashboard page component', () => {
  it('renders weather cards and AI Risk indices correctly', async () => {
    const mockNavigate = vi.fn();
    render(
      <AppProvider>
        <Dashboard onNavigate={mockNavigate} />
      </AppProvider>
    );

    // Wait for asynchronous weather data loading to complete
    await waitFor(() => {
      expect(screen.getByText('Live Weather')).toBeInTheDocument();
    });

    expect(screen.getByText('AI Risk Index')).toBeInTheDocument();
    expect(screen.getByText('Heavy Thunderstorms')).toBeInTheDocument();
  });
});

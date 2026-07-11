import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { FakeNewsDetector } from '../pages/FakeNewsDetector';

describe('FakeNewsDetector page component', () => {
  it('renders inputs and processes message analyses validation', async () => {
    render(
      <AppProvider>
        <FakeNewsDetector />
      </AppProvider>
    );

    // Verify main headers
    expect(screen.getByText('WhatsApp Fake News Detector')).toBeInTheDocument();

    // Type mock viral forward
    const textarea = screen.getByPlaceholderText(/Paste WhatsApp text warnings here\.\.\./i) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Warning! Red alert tomorrow!' } });
    expect(textarea.value).toBe('Warning! Red alert tomorrow!');

    // Click submit button
    const submitBtn = screen.getByRole('button', { name: /Verify Forward/i });
    fireEvent.click(submitBtn);

    // Wait for mock analyzer execution cards to populate
    await waitFor(() => {
      expect(screen.getByText(/Likely Fake/i)).toBeInTheDocument();
    });
  });
});

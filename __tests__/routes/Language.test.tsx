import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Language from '../../src/app/settings/account/language/page';
import { getLangPrefOfUser, setLanguage } from '@/lib/actions/client';
require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

// Mock the client actions
jest.mock('@/lib/actions/client', () => ({
  getLangPrefOfUser: jest.fn(),
  setLanguage: jest.fn()
}));

describe('Language Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders and displays the default language', async () => {
    getLangPrefOfUser.mockResolvedValue('english');
    const { getByText } = render(<Language />);

    // Verify the default language is displayed
    await waitFor(() => expect(getByText('English')).toBeInTheDocument());
  });

  it('updates language preference when a new option is clicked', async () => {
    getLangPrefOfUser.mockResolvedValue('english');
    setLanguage.mockResolvedValue(true);

    const { getByText } = render(<Language />);
    const spanishOption = getByText('Spanish');

    // Simulate user clicking the Spanish language option
    fireEvent.click(spanishOption);

    await waitFor(() => {
      expect(setLanguage).toHaveBeenCalledWith('spanish');
      expect(getByText('Spanish')).toBeInTheDocument();
    });
  });


});
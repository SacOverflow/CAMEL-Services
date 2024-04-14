import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Page from '../../src/app/settings/page';
import '@testing-library/jest-dom';
import { getUserInformation, getLangPrefOfUser } from '@/lib/actions';
import { redirect } from 'next/navigation';

jest.mock('@/lib/actions', () => ({
  getUserInformation: jest.fn(),
  getLangPrefOfUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Settings Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('just check if there is any text in there', async () => {
    getUserInformation.mockResolvedValue({ id: '123', name: 'Test User' });
    getLangPrefOfUser.mockResolvedValue('english');
    const { findByText, getByText } = render(<Page />);
    await waitFor(() => expect(getByText('Account')).toBeInTheDocument());

   
    //await findByText('Settings'); // Verify settings header is displayed

  });


  it('redirects to login if user is not logged in', async () => {
    getUserInformation.mockResolvedValue(null); // No user logged in
    
        render(<Page />);
      

      await waitFor(() => {
        expect(redirect).toHaveBeenCalledWith('/login');
      });
  
    
  });

  it('renders settings page when user is logged in', async () => {
    getUserInformation.mockResolvedValue({ id: '123', name: 'Test User' });
    getLangPrefOfUser.mockResolvedValue('english');

    const { findByText } = render(<Page />);
    await findByText('Settings'); // Verify settings header is displayed
    expect(getUserInformation).toHaveBeenCalled();
    expect(getLangPrefOfUser).toHaveBeenCalledWith('123');
  });

  it('displays all settings items with correct labels', async () => {
    getUserInformation.mockResolvedValue({ id: '123', name: 'Test User' });
    getLangPrefOfUser.mockResolvedValue('english');

    const { findByText } = render(<Page />);
    await findByText('Account');
    await findByText('Notifications');
    await findByText('Appearance');
    await findByText('Language');
    await findByText('Privacy & Security');
  });

  it('ensures that navigation links are correct', async () => {
    getUserInformation.mockResolvedValue({ id: '123', name: 'Test User' });
    getLangPrefOfUser.mockResolvedValue('english');

    const { container } = render(<Page />);
    const settingsNav = container.querySelectorAll('.settings-item');
    expect(settingsNav[0].getAttribute('href')).toEqual('settings/account');
    expect(settingsNav[1].getAttribute('href')).toEqual('settings/account/notifications');
    // Continue for other items
  });



});


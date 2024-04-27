import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TotalEarning from '@/components/Dashboard/Total_Earning/TotalEarning';
import { getOrganizationProjectEarnings } from '@/lib/actions/dashboard';
import getLang from '@/app/translations/translations';
//total earning test
jest.mock('@/lib/actions/dashboard', () => ({
  getOrganizationProjectEarnings: jest.fn()
}));

jest.mock('@/app/translations/translations', () => jest.fn());

getLang.mockImplementation((key, lang) => key);

describe('TotalEarning Component', () => {
  it('displays the total earnings correctly when data is available', async () => {
    getOrganizationProjectEarnings.mockResolvedValue({
      response: 200,
      currentEarning: 1000,
      previousEarning: 800,
      isPositive: true
    });

    render(<TotalEarning org_id="org123" lang="en" />);

    await waitFor(() => {
      expect(screen.getByText('Total Organization Budgets')).toBeInTheDocument();
      expect(screen.getByText('$1,000')).toBeInTheDocument();
      expect(screen.getByText('▲ 25.00%')).toBeInTheDocument();
      expect(screen.getByText('Compared to $800 last year')).toBeInTheDocument();
    });
  });

  it('displays a no data message when data is not available', async () => {
    getOrganizationProjectEarnings.mockResolvedValue({
      response: 404  
    });

    render(<TotalEarning org_id="org123" lang="en" />);

    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });
});

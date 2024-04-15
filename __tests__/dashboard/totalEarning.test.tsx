import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TotalEarning from '@/components/Dashboard/Total_Earning/TotalEarning';
import { getOrganizationProjectEarnings } from '@/lib/actions/dashboard';

jest.mock('@/lib/actions/dashboard', () => ({
    getOrganizationProjectEarnings: jest.fn(),
}));

describe('TotalEarning', () => {
    it('displays earnings correctly when data is fetched', async () => {
        getOrganizationProjectEarnings.mockResolvedValue({
            response: 200,
            currentEarning: 5000,
            previousEarning: 3000,
            isPositive: true,
        });

        render(<TotalEarning org_id="1bd976db-0b54-4100-804d-adb023f32da7" lang="en" />);

        // Verify that data is displayed
        await waitFor(() => {
            expect(screen.getByText('$10,000')).toBeInTheDocument();
            expect(screen.getByText(/▲ 100%/)).toBeInTheDocument();
            expect(screen.getByText(/Compared to \$0 last year/)).toBeInTheDocument();
        });
    });

    it('handles division by zero and displays no change correctly', async () => {
        getOrganizationProjectEarnings.mockResolvedValue({
            response: 200,
            currentEarning: 0,
            previousEarning: 0,
            isPositive: null,
        });

        render(<TotalEarning org_id="org123" lang="en" />);

        // Verify handling of zero previous earnings
        await waitFor(() => {
            expect(screen.getByText('$0')).toBeInTheDocument();
            expect(screen.getByText(/○ 0%/)).toBeInTheDocument();
            expect(screen.getByText(/Compared to \$0 last year/)).toBeInTheDocument();
        });
    });

    it('displays an error or no-data message when data fetch fails', async () => {
        getOrganizationProjectEarnings.mockResolvedValue({
            response: 404
        });

        render(<TotalEarning org_id="org123" lang="en" />);

        // Verify that the no data message is displayed
        await waitFor(() => {
            expect(screen.getByText('No data available')).toBeInTheDocument();
        });
    });
});

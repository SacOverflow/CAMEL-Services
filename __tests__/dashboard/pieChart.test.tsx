import React from 'react';
import { render, screen } from '@testing-library/react';
import PieChart from '@/components/Dashboard/overall_spending_barchart/overall_spending_barchart';
import { getLangPrefOfUser } from '@/lib/actions/client'; // Assume getPieChartData is your actual function
import * as am5 from '@amcharts/amcharts5';
export async function getPieChartData() {
    return Promise.resolve([
        { category: '', value: 0 },
        { category: '', value: 0 },
    ]);
}
jest.mock('@amcharts/amcharts5', () => ({
    Root: {
        new: jest.fn(() => ({
            setThemes: jest.fn(),
            container: {
                children: {
                    push: jest.fn(() => ({
                        series: {
                            push: jest.fn(() => ({
                                labels: {
                                    template: {
                                        setAll: jest.fn(),
                                    },
                                },
                                ticks: {
                                    template: {
                                        setAll: jest.fn(),
                                    },
                                },
                                data: {
                                    setAll: jest.fn(),
                                },
                                appear: jest.fn(),
                            })),
                        },
                    })),
                },
            },
            dispose: jest.fn(),
        })),
    },
}));
jest.mock('@amcharts/amcharts5/percent', () => ({}));
jest.mock('@amcharts/amcharts5/themes/Animated', () => ({}));
jest.mock('@/lib/actions/client', () => ({
    getPieChartData: jest.fn(),
    getLangPrefOfUser: jest.fn(),
}));

describe('PieChart', () => {
    beforeEach(async () => {
        getPieChartData.mockResolvedValue([
            { category: 'Category 1', value: 40 },
            { category: 'Category 2', value: 30 },
        ]);
        getLangPrefOfUser.mockResolvedValue('english');
        render(<PieChart className="test-class" />);
    });

    it('renders a chart container', () => {
        expect(screen.getByTestId('chartdiv1')).toBeInTheDocument();
    });

    it('fetches and processes chart data correctly', async () => {
        expect(getPieChartData).toHaveBeenCalled();
        expect(am5.Root.new().container.children.push().series.push().data.setAll).toHaveBeenCalled();
    });


    it('disposes of the chart upon component unmount', () => {
        render(null); 
        expect(am5.Root.new().dispose).toHaveBeenCalled();
    });
});

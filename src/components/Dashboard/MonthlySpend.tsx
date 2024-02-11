'use client';

//Import CSS file for Monthly Spending styles
import './MonthlySpending.css';
import React, { useEffect, useState } from 'react';
import { fetchMonthlySpendingData } from '@/lib/actions/dashboard';

//Interface categorizing data by its type
interface SpendingData {
	category: string;
	amount: number;
	total: number;
	trend: 'up' | 'down';
}
//Function to format numbers with commas for thousands
function formatNumber(num: number): string {
	return num.toLocaleString();
}
//Functional Component to display monthly spending data
const MonthlySpending = () => {
	const [data, setData] = useState<SpendingData[]>([]);
	//Example data of spending data array
	// const data: SpendingData[] = [
	// 	{ category: 'Electrical', amount: 760, total: 2000, trend: 'up' },
	// 	{ category: 'Rental', amount: 760, total: 2000, trend: 'up' },
	// 	{ category: 'Plumbing', amount: 760, total: 2000, trend: 'down' },
	// 	{ category: 'Construction', amount: 760, total: 2000, trend: 'up' },
	// 	{ category: 'HVAC', amount: 760, total: 2000, trend: 'down' },
	// 	{ category: 'Materials', amount: 760, total: 2000, trend: 'up' },
	// ];
	useEffect(() => {
		// Function to fetch data and update state
		const loadData = async () => {
			const fetchedData = await fetchMonthlySpendingData();
			setData(fetchedData);
		};

		loadData();
	}, []);

	return (
		<div className="monthly-spending-container">
			{/* Container for the list of data */}
			<div className="spending-container">
				{/* Unordered list to map out data, displays each spending category and amount, formatted into grid with commas */}
				<ul>
					{data.map((item, index) => (
						<li
							key={index}
							className="spending-list-item"
						>
							<span className="category">{item.category}</span>
							<span className="amount">
								{formatNumber(item.amount)}
							</span>
							<span className="total">
								{formatNumber(item.total)}
							</span>
							{/* Displays the trend, whether the icon is up or down */}
							<span
								className={
									item.trend === 'up'
										? 'trend-up'
										: 'trend-down'
								}
							>
								{item.trend === 'up' ? '▲' : '▼'}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default MonthlySpending;

'use client';

//Import CSS file for Monthly Spending styles
import './MonthlySpending.css';
import { useEffect, useState } from 'react';
import { fetchMonthlySpendingData } from '@/lib/actions/dashboard';
import { getCookie } from '@/lib/actions/client';

//Interface categorizing data by its type
interface SpendingData {
	category: string;
	amount: number;
	total: number;
	trend: 'up' | 'down';
}
//Function to format numbers with commas for thousands
function formatNumber(num: number): string {
	// return val using suffixes (K, M, B, T)
	if (num < 10000) {
		return num.toFixed(2).toString();
	}

	// 728,609 should return 728.6K etc
	if (num < 1000000) {
		return (num / 1000).toFixed(1) + 'K';
	}
	if (num < 1000000000) {
		return (num / 1000000).toFixed(1) + 'M';
	}
	if (num < 1000000000000) {
		return (num / 1000000000).toFixed(1) + 'B';
	}
	return (num / 1000000000000).toFixed(1) + 'T';
}
//Functional Component to display monthly spending data
const MonthlySpending = () => {
	const [data, setData] = useState<SpendingData[]>([]);
	const [orgId, setOrgId] = useState<string>('');
	//Example data of spending data array
	useEffect(() => {
		const orgID = getCookie('org');
		setOrgId(orgID);
	}, []);
	useEffect(() => {
		if (!orgId) {
			return;
		}
		// Function to fetch data and update state
		const loadData = async () => {
			const fetchedData = await fetchMonthlySpendingData(orgId);

			// fetched data filter top 5 based off of total
			fetchedData.sort((a, b) => b.total - a.total);
			fetchedData.splice(7);

			setData(fetchedData);
		};
		loadData();
	}, [orgId]);

	// check if data not present
	if (data.length === 0) {
		return (
			<div className="monthly-spending-container chart-no-data special">
				<p className="text-white text-lg">No data is present 😕</p>
			</div>
		);
	}

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

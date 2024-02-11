import { IReceipts } from '@/types/database.interface';
import { createSupbaseClient } from '../supabase/client';

// function for retrieving full budget of an org
// function for receipts bare data from one org.
// 2 functions for retrieving projects based off highest budget and spending
export interface ChartData {
	date: string;
	income: number;
	expenses: number;
}

export interface PieChartDataElement {
	value: number;
	category: string;
}

export interface SpendingData {
	category: string;
	amount: number;
	total: number;
	trend: 'up' | 'down';
}

export interface TotalEarningCard {
	currentEarning: number;
	previousEarning: number;
}

export async function getFilteredRevenueChartData(
	type: 'month' | 'yearly' = 'month',
): Promise<ChartData[]> {
	const supabase = await createSupbaseClient();

	const { data: receipts, error } = await supabase
		.from('receipts')
		.select('*')
		.order('updated_at', { ascending: true });

	if (error) {
		console.error('Error fetching data:', error);
		return [];
	}

	// Ensure you provide a type for the parameter in the map function
	const processedData: ChartData[] =
		receipts?.map((receipt: IReceipts) => ({
			date: receipt.updated_at
				? new Date(receipt.updated_at).toISOString().split('T')[0]
				: '',
			income: Math.random() * 1000, // Placeholder, replace with actual logic
			expenses: Math.random() * 1000, // Placeholder, replace with actual logic
		})) || [];

	return processedData;
}

export async function getFilteredCategoryPieChart(): Promise<
	PieChartDataElement[]
> {
	const supabase = await createSupbaseClient();
	const { data: receipts, error } = await supabase
		.from('receipts')
		.select('category, price_total');

	if (error) {
		console.error('Error fetching data:', error);
		return [];
	}

	// Aggregate data by category
	const aggregatedData: { [key: string]: number } = {};
	receipts.forEach(receipt => {
		const category = receipt.category;
		const value = receipt.price_total;
		if (category in aggregatedData) {
			aggregatedData[category] += value;
		} else {
			aggregatedData[category] = value;
		}
	});

	// Convert aggregated data to array and sort by value
	const sortedData: PieChartDataElement[] = Object.entries(aggregatedData)
		.map(([category, value]) => ({
			category,
			value,
		}))
		.sort((a, b) => b.value - a.value)
		.slice(0, 6); // Get top 6 categories

	return sortedData;
}

export async function getFilteredTotalEarningWidget(
	unfilteredData: IReceipts[],
	type?: 'month' | 'yearly',
) {
	// return current spent month/year
	// sum of all projects budget minus sum of current_spent across all projects
	// return previous spent month/year
}

export async function fetchMonthlySpendingData(): Promise<SpendingData[]> {
	const supabase = await createSupbaseClient();
	const { data: receipts, error } = await supabase
		.from('receipts')
		.select('store, price_total');

	if (error) {
		console.error('Error fetching data:', error);
		return [];
	}

	// Aggregate spending by category
	const spendingByCategory: {
		[key: string]: { total: number; transactions: number[] };
	} = {};
	receipts.forEach(receipt => {
		const { store, price_total } = receipt;
		if (!spendingByCategory[store]) {
			spendingByCategory[store] = { total: 0, transactions: [] };
		}
		spendingByCategory[store].total += price_total;
		spendingByCategory[store].transactions.push(price_total);
	});

	const spendingData: SpendingData[] = Object.entries(spendingByCategory).map(
		([category, data]) => ({
			category,
			amount: data.transactions[data.transactions.length - 1],
			total: data.total,
			trend: 'up',
		}),
	);

	return spendingData;
}

export async function fetchTotalEarningsData(): Promise<TotalEarningCard> {
	const supabase = await createSupbaseClient();
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const previousYear = currentYear - 1;

	const { data: currentYearData, error: currentError } = await supabase
		.from('receipts')
		.select('price_total')
		.eq('year', currentYear);

	const { data: previousYearData, error: previousError } = await supabase
		.from('receipts')
		.select('price_total')
		.eq('year', previousYear);

	if (currentError || previousError) {
		console.error('Error fetching data:', currentError || previousError);
		return { currentEarning: 0, previousEarning: 0 };
	}

	const currentEarning = currentYearData.reduce(
		(acc, item) => acc + item.price_total,
		0,
	);
	const previousEarning = previousYearData.reduce(
		(acc, item) => acc + item.price_total,
		0,
	);

	return { currentEarning, previousEarning };
}

export async function getFilteredSalesTrendWidget(
	unfilteredData: IReceipts[],
	type?: 'month' | 'yearly',
) {
	/*
		total: 0,
		previousTotal: 0,
		data: [],
	*/
}

export const getOrganizationProjectEarnings = async (org_id: string) => {
	// 1. retrieve the earnings for current year and calculate profits and if it is positive
	const currentYear = new Date().getFullYear();
	const currentEarnings = await getOrganizationProjectSumsByYear(
		org_id,
		currentYear,
	);

	// utilize profits and isPositive for further calcs

	if (currentEarnings.response !== 200) {
		return {
			response: 500,
			currentEarning: 0,
			previousEarning: 0,
		};
	}

	// 2. retrieve the earnings for previous year and calculate profits and if it is positive
	const previousYear = currentYear - 1;
	const previousEarnings = await getOrganizationProjectSumsByYear(
		org_id,
		previousYear,
	);
	if (previousEarnings.response !== 200) {
		console.log('error in previousEarnings: ', previousEarnings);
		return {
			response: 500,
			currentEarning: currentEarnings.data.profits,
			previousEarning: 0,
		};
	}

	// utilize profits and isPositive to check percentage difference
	const earnDifference =
		((currentEarnings.data.profits - previousEarnings.data.profits) /
			previousEarnings.data.profits) *
		100;

	// format difference perecent but take into account infinity should be between 0 and 100
	const formatDifference = isFinite(earnDifference) ? earnDifference : 100;
	// const formatDifference = earnDifference.toFixed(0);
	const isPositive = earnDifference >= 0;

	// 3. return the data
	return {
		response: 200,
		currentEarning: currentEarnings.data.profits,
		previousEarning: previousEarnings.data.profits,
		percentageDifference: formatDifference,
		isPositive,
	};
};

interface IProjectSumData {
	currentBudget: number;
	currentSpent: number;

	profits: number;
	isPositive: boolean;
}
export const getOrganizationProjectSumsByYear = async (
	org_id: string,
	year: number,
): Promise<{
	response: number;
	data: IProjectSumData;
}> => {
	const resp = {
		response: 500,
		data: {
			currentBudget: 0,
			currentSpent: 0,
			profits: 0,
			isPositive: false,
		},
	};

	const client = await createSupbaseClient();

	const { data, error } = await client
		.from('projects')
		.select('id, budget, current_spent')
		.eq('org_id', org_id)
		.gte('start_date', `${year}-01-01`)
		.lte('start_date', `${year}-12-31`);

	if (error) {
		console.log(error);
		return resp;
	}

	// retrieve the sum of all the projects returned
	let projectSum = 0;
	let projectExpenses = 0;
	if (data.length) {
		data.forEach((project: any) => {
			// retrieve the sum of all the projects
			projectSum += project.budget;

			// retrieve the sum of all the expenses
			projectExpenses += project.current_spent;
		});
	}

	// calculate the profits
	const profits = projectSum - projectExpenses;
	const isPositive = profits >= 0;

	resp.response = 200;
	resp.data = {
		currentBudget: projectSum,
		currentSpent: projectExpenses,
		profits,
		isPositive,
	};

	return resp;
};

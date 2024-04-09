import { IReceipts } from '@/types/database.interface';
import { createSupbaseClient } from '../supabase/client';
import { DoubleLineChartDataElement } from '@/types/componentTypes';

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

export async function getFilteredRevenueChartData({
	org_id,
	type = 'month',
}: {
	type: 'month' | 'yearly';
	org_id: string;
}): Promise<ChartData[]> {
	if (!org_id) {
		console.error('org_id is required');
		return [];
	}

	const supabase = await createSupbaseClient();

	const { data: receipts, error } = await supabase
		.from('receipts')
		.select('*')
		.eq('org_id', org_id)
		.order('updated_at', { ascending: true });

	if (error) {
		console.error('Error fetching data:', error);
		return [];
	}

	// grouped receipts by month (Expenses)
	const groupedExpensesData = receipts.reduce((acc, receipt) => {
		const date = new Date(receipt.updated_at);
		const total = receipt.price_total || 0;
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const day = '28'; // hardcoding day to 28th of the month
		const key = `${year}-${month}-${day}`;
		if (acc[key]) {
			// calculate the total expenses for the month
			acc[key].total += total;
		} else {
			acc[key] = { total, date: key };
		}
		return acc;
	}, {});

	// grouped income based off the projects within org
	const { data: projects, error: projectError } = await supabase
		.from('projects')
		.select('*')
		.eq('org_id', org_id)
		.order('created_at', { ascending: true });

	if (projectError) {
		console.error('Error fetching expenses data:', projectError);

		// check if maybe just no projects error
		return [];
	}

	// group projects by month and retrieve their budget allocations and as object
	const tmp = projects.map(project => {
		const date = new Date(project.created_at);
		const budget = project.budget;
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const day = '28'; // hardcoding day to 28th of the month
		const key = `${year}-${month}-${day}`;
		return { budget, date: key };
	});
	const groupedIncomeRevenueData: any = {};
	tmp.forEach(project => {
		const resp = {
			date: project.date,
			budget: project.budget,
		};
		// if we exist
		if (groupedIncomeRevenueData[project.date]) {
			// add the budget to the existing budget
			resp.budget += groupedIncomeRevenueData[project.date].budget || 0;
			groupedIncomeRevenueData[project.date] = resp;
		} else {
			resp.budget = project.budget || 0;
			groupedIncomeRevenueData[project.date] = resp;
		}
	});

	// merge the 2 based off the date
	const mergedData = Object.keys(groupedIncomeRevenueData).map(key => {
		const income = groupedIncomeRevenueData[key].budget || 0;
		const expenses = groupedExpensesData[key]?.total || 0;
		return {
			date: key,
			income,
			expenses,
		};
	});

	return mergedData;
}

export async function getFilteredCategoryPieChart(
	org_id: string,
): Promise<PieChartDataElement[]> {
	const supabase = await createSupbaseClient();
	const { data: receipts, error } = await supabase
		.from('receipts')
		.select('category, price_total')
		.eq('org_id', org_id);

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

/**
 * Function to retrieve a double lines chart data but using the top 2 categories for the current month.
 */
export const getDoubleLineChartData = async (
	org_id: string,
): Promise<DoubleLineChartDataElement[]> => {
	try {
		const supabase = await createSupbaseClient();

		const { data: receipts, error: receiptsError } = await supabase
			.from('receipts')
			.select('*')
			.eq('org_id', org_id);

		if (receiptsError) {
			console.error('Error fetching double line charts data.');
			return [] as any;
		}

		const MONTH_INCREMENT = 1;

		// group receipts by month and category
		const groupedData = receipts.reduce((acc, receipt) => {
			const date = new Date(receipt.updated_at);
			const total = receipt.price_total || 0;
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();

			// use the month and year as the key
			const key = `${year}-${month}`;

			// Create new entry if it doesn't exist
			if (!acc[key]) {
				acc[key] = [];
			}

			// Check if category exists
			const categoryIndex = acc[key].findIndex(
				({
					category,
				}: {
					category: string;
					total: number;
					date: string;
				}) => category === receipt.category,
			);
			if (categoryIndex > -1) {
				// Category exists, add to total
				acc[key][categoryIndex].total += total;
			} else {
				// Create new category entry
				acc[key].push({ total, date: key, category: receipt.category });
			}

			// Return accumulator map
			return acc;
		}, {});

		// using grouped data, use last month data and see top 2 categories
		// get the current month
		const currentDate = new Date();
		const currentMonth = String(
			currentDate.getMonth() + MONTH_INCREMENT,
		).padStart(2, '0');
		const currentYear = currentDate.getFullYear();

		// get the key for the current month (latest)
		let key = `${currentYear}-${currentMonth}`;

		// fetch data for key
		let currMonthData = groupedData[key];

		// if len is less than 2, use prev month
		if (currMonthData && currMonthData.length < 2) {
			const prevMonth = String(currentDate.getMonth()).padStart(2, '0');
			const prevYear = currentDate.getFullYear();
			const prevKey = `${prevYear}-${prevMonth}`;

			key = prevKey;

			currMonthData = groupedData[prevKey];
		}

		// get top 2 categories
		const top2Categories = currMonthData
			?.sort((a: any, b: any) => b.total - a.total)
			?.slice(0, 2);

		if (top2Categories?.length < 2) {
			// return empty array
			console.debug('not enough data');
			return [] as any;
		}
		// else we have top 2 categories; retrieve the categories
		const top2CategoriesData = [
			top2Categories[0].category,
			top2Categories[1].category,
		];

		const getWeekOfMonth = (date: Date) => {
			const firstDayOfMonth = new Date(
				date.getFullYear(),
				date.getMonth(),
				1,
			);
			const firstDayOfWeek = firstDayOfMonth.getDay();
			const offsetDate = date.getDate() + firstDayOfWeek - 1;
			return Math.floor(offsetDate / 7) + 1;
		};

		const weekData = receipts.reduce((acc, receipt) => {
			const date = new Date(receipt.updated_at);
			const total = receipt.price_total || 0;
			const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
			const year = date.getFullYear();
			const weekNumber = String(getWeekOfMonth(date)).padStart(2, '0');

			const category = receipt.category;

			if (top2CategoriesData.includes(category)) {
				const weekKey = `${year}-${month}-${weekNumber}`;

				const insertData = {
					total,
					date: weekKey,
					category,
				};

				if (!acc[weekKey]) {
					acc[weekKey] = [];
				}

				const categoryIndex = acc[weekKey].findIndex(
					({
						category: c,
					}: {
						category: string;
						total: number;
						date: string;
					}) => c === category,
				);

				if (categoryIndex > -1) {
					acc[weekKey][categoryIndex].total += total;
				} else {
					acc[weekKey].push(insertData);
				}
			}

			return acc;
		}, {});

		// get all data just for this month and return array of objects
		const allData: any = Object.values(weekData).reduce(
			(acc: any, week: any) => {
				// check if for current month
				if (week[0].date.includes(`${currentYear}-${currentMonth}`)) {
					// add to acc
					acc.push(...week);
				}

				return acc;
			},
			[],
		);

		// combine the data based off dates
		const combinedData = allData.reduce((acc: any, data: any) => {
			const date = data.date;
			const category = data.category;
			const total = data.total;

			if (acc[date]) {
				// check if category exists
				const categoryIndex = acc[date].findIndex(
					({
						category: c,
					}: {
						category: string;
						total: number;
						date: string;
					}) => c === category,
				);

				// if category exists, add to total
				if (categoryIndex > -1) {
					acc[date][categoryIndex].total += total;
				} else {
					// else create new category entry
					acc[date].push(data);
				}
			} else {
				acc[date] = [data];
			}

			return acc;
		}, {});

		const chartData = Object.entries(combinedData).map(
			([dateKey, categories]: [string, any]) => {
				const dateStr = new Date(dateKey);

				// get the total for each category
				const value = categories[0] ? categories[0].total : 0;
				const value2 = categories[1] ? categories[1].total : 0;

				return {
					date: dateKey,
					value,
					value2,
				};
			},
		);

		return (chartData as any) || [];
	} catch (error) {
		console.error('Error fetching double line charts data.', error);
		return [] as any;
	}
};

export const getReceiptsCategoriesTop = async (
	org_id: string,
): Promise<string[]> => {
	const supabase = await createSupbaseClient();

	const { data: receipts, error: receiptsError } = await supabase
		.from('receipts')
		.select('*')
		.eq('org_id', org_id);

	if (receiptsError) {
		console.error('Error fetching receipts categories.');
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
	const sortedData: string[] = Object.entries(aggregatedData)
		.map(([category, value]) => category)
		.sort((a, b) => aggregatedData[b] - aggregatedData[a]);
	// .slice(0, 2); // Get top 2 categories

	return sortedData;
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

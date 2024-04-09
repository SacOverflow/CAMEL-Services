// calculate the top categories
const getTopReceiptCategories = (data: any) => {
	const categories = data.reduce((acc: any, curr: any) => {
		// check if the category exists
		if (!acc[curr.category]) {
			acc[curr.category] = 0;
		}

		// add the total to the category
		acc[curr.category] += curr.total;

		return acc;
	}, {});

	const sortedCategories = Object.keys(categories).sort(
		(a, b) => categories[b] - categories[a],
	);

	return sortedCategories;
};
/**
 * This file contains the methods to fetch the data from the API for the components and
 * any wrangling of the data that needs to be done before it is passed to the components.
 *
 * @module "src/utils/dataUtils.ts"
 */

// env imports
import 'dotenv/config';

import { CategorySalesData, SalesOverviewData } from '@/types/componentTypes';
import { createSupbaseClient } from '@/lib/supabase/client';

/**
 * Method to fetch the spending categories data from an API, returning the values for the bottom half of our widget.
 * @returns a promise of the spending categories data
 */
export const getSpendingCategories = async (
	org_id: string,
): Promise<CategorySalesData[]> => {
	const supabase = await createSupbaseClient();

	// Retrieve all receipts for the organization
	const { data: receipts, error: receiptsError } = await supabase
		.from('receipts')
		.select('*')
		.eq('org_id', org_id);

	if (receiptsError) {
		console.error('Error fetching receipts', receiptsError);
		return [
			{
				category: '',
				total: 0,
				data: [],
			},
		];
	}

	// Get the top 3 categories
	const topCategories = getTopReceiptCategories(receipts).slice(0, 3);

	// Process the receipts to separate them by category
	const categoryData = topCategories.map(category => {
		const categoryReceipts = receipts.filter(
			receipt => receipt.category === category,
		);

		const total = categoryReceipts.reduce((acc, curr) => {
			acc += curr.price_total;
			return acc;
		}, 0);

		const getWeek = (date: Date) => {
			const onejan = new Date(date.getFullYear(), 0, 1);
			const millisecsInDay = 86400000;
			return Math.ceil(
				((date.getTime() - onejan.getTime()) / millisecsInDay +
					onejan.getDay() +
					1) /
					7,
			);
		};

		const data = categoryReceipts.map(receipt => {
			const dateString = new Date(receipt.created_at);

			const week = getWeek(dateString);
			const month = dateString.getMonth() + 1;
			const year = dateString.getFullYear();

			const date = `${year}-${month}-${week}`;

			return {
				date,
				value: receipt.price_total,
			};
		});

		return {
			category,
			total,
			data,
		};
	});

	return categoryData;
};

/**
 * Method to fetch the sales overview data from an API, returning the values for the top half of our widget.
 * @returns a promise of the sales overview data
 */
export const getSalesOverviewData = async (
	org_id: string,
): Promise<SalesOverviewData> => {
	const supabase = await createSupbaseClient();

	// Get the current date and the start dates for the current and previous year
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const previousYearStart = new Date(
		`${currentYear - 1}-01-01T00:00:00.000Z`,
	);
	const nextYearStart = new Date(`${currentYear}-01-01T00:00:00.000Z`);

	// Retrieve all receipts for the organization for the current and previous year
	const { data: receipts, error: receiptsError } = await supabase
		.from('receipts')
		.select('*')
		.eq('org_id', org_id)
		.gte('created_at', previousYearStart.toISOString());

	if (receiptsError) {
		console.error('Error fetching receipts', receiptsError);
		return {
			total: 0,
			previousTotal: 0,
			data: [],
		};
	}

	// Get the top 2 categories
	const topCategories = getTopReceiptCategories(receipts).slice(0, 2);

	// Process the receipts to separate them by current and previous year
	let previousTotal = 0;
	let total = 0;

	receipts.forEach(receipt => {
		const receiptDate = new Date(receipt.created_at);
		if (receiptDate >= previousYearStart && receiptDate < nextYearStart) {
			// This receipt is from the previous year
			if (topCategories.includes(receipt.category)) {
				previousTotal += receipt.price_total;
			}
		} else if (receiptDate >= nextYearStart) {
			// This receipt is from the current year
			if (topCategories.includes(receipt.category)) {
				total += receipt.price_total;
			}
		}
	});

	return {
		total,
		previousTotal,
		data: [],
	};
};

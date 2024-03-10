// project_csv.ts
import { createSupbaseClient } from '../supabase/client';
import { IProjects, IReceipts, IUsers } from '@/types/database.interface';

interface IReceiptWithUser extends IReceipts {
	created_by_username: string;
	user: IUsers;
}

export interface ReceiptData {
	store: string;
	category: string;
	updated_at: string;
	created_by: string;
	price_total: number;
	note?: string;
}

export interface TotalSpentRow {
	category: 'Total Spent';
	price_total: number;
}

export interface MonthlyDataItem {
	data: Array<ReceiptData | TotalSpentRow>;
	totalSpent: number;
}

export type AllMonthsData = Record<string, MonthlyDataItem>;

export interface MonthData {
	month: string;
	data: Array<ReceiptData | TotalSpentRow>;
}

export interface ProjectData {
	overviewData: OverviewData[];
	monthByMonthExcelData: MonthData[];
}

export interface OverviewData {
	Project_name: string;
	Details: string;
	Budget: number;
	current_spent: number;
	start_date: string;
	due_date: string;
	completed_date?: string;
}

// excel sheet data should look like below

// Sheet 1 - Overview - From projects table
// Column 1 | Column 2 | Column 3 | Column 4 | Column 5 | Column 6 | Column 7 | Column 8
// Project_name | Details| Budget | current_spent | start_date | due_date | completed_date |

// Sheet 2 - Month by Month spending on each sheet after the overview - from recipt table by project_id
// Column 1 | Column 2 | Column 3 | Column 4 | Column 5 | Column 6 | Column 7 | Column 8
// store | category | updated_at | created_by | price_total | note |

function formatDate(date: Date | string): string {
	if (typeof date === 'string') {
		date = new Date(date);
	}
	return date.toISOString().split('T')[0];
}

export async function fetchProjectData(project_id: string) {
	const supabase = await createSupbaseClient();

	// Fetch project information
	const projectResponse = await supabase
		.from('projects')
		.select('*')
		.eq('id', project_id)
		.single();

	if (projectResponse.error) {
		console.error('Error fetching project:', projectResponse.error);
		return null;
	}
	const project = projectResponse.data;

	// Fetch receipts information
	const receiptsResponse = await supabase
		.from('receipts')
		.select('*, users:created_by(username)')
		.eq('proj_id', project_id);

	if (receiptsResponse.error) {
		console.error('Error fetching receipts:', receiptsResponse.error);
		return null;
	}
	const receipts: IReceiptWithUser[] = receiptsResponse.data.map(receipt => ({
		...receipt,
		created_by_username: receipt.users?.username || 'Unknown',
		updated_at: formatDate(receipt.updated_at),
	}));

	const overviewSheetData = {
		Project_name: project.title,
		Details: project.details,
		Budget: project.budget,
		current_spent: project.current_spent,
		start_date: formatDate(project.start_date),
		due_date: formatDate(project.due_date),
		completed_date: project.completed_date
			? formatDate(project.completed_date)
			: '',
	};

	const monthByMonthData = receipts.reduce<AllMonthsData>((acc, receipt) => {
		const month = new Date(receipt.updated_at).toLocaleString('default', {
			month: 'long',
			year: 'numeric',
		});

		if (!acc[month]) {
			acc[month] = { data: [], totalSpent: 0 };
		}

		acc[month].data.push({
			store: receipt.store,
			category: receipt.category,
			updated_at: formatDate(receipt.updated_at),
			created_by: receipt.created_by_username,
			price_total: receipt.price_total,
			note: receipt.note || '',
		});
		acc[month].totalSpent += receipt.price_total;

		return acc;
	}, {});

	const monthByMonthExcelData = Object.entries(monthByMonthData).map(
		([month, { data, totalSpent }]) => ({
			month,
			data: [
				...data,
				{ category: 'Total Spent', price_total: totalSpent },
			],
		}),
	);

	return {
		overviewData: [overviewSheetData],
		monthByMonthExcelData,
	};
}

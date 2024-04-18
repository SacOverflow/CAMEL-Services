'use client';
import { useEffect, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Poppins } from 'next/font/google';
import {
	getProjectDetailsById,
	getReceiptsForProject,
	getReceiptsForProjectByGroup,
} from '@/lib/actions/client';
import { IReceipts } from '@/types/database.interface';
import getLang from '@/app/translations/translations';

const PoppinsSemiBold = Poppins({
	subsets: ['latin-ext'],
	weight: ['700'],
});
const PoppinsRegular = Poppins({
	subsets: ['latin-ext'],
	weight: ['400'],
});

function Chart({
	data,
	lang,
}: {
	data: { category: string; value1: number }[];
	lang: string;
}) {
	useEffect(() => {
		if (!data || data.length === 0) {
			return () => {};
		}

		// create root element
		const root = am5.Root.new('chartdiv');
		// set themes (can do CSS implied within themes as well)
		root.setThemes([am5themes_Animated.new(root)]);

		// create the chart
		const chart = root.container.children.push(
			am5xy.XYChart.new(root, {
				panY: false,
				panX: true,
				wheelX: 'panX',
				wheelY: 'zoomX',
				pinchZoomX: true,
				paddingLeft: 0,
				paddingRight: 1,
				layout: root.verticalLayout,
				height: am5.percent(100),
				width: am5.percent(100),
			}),
		);

		// add cursor
		const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
		cursor.lineY.set('visible', false);

		// Create X-Axis
		const xRenderer = am5xy.AxisRendererX.new(root, {
			minGridDistance: 30,
			minorGridEnabled: true,
		});
		xRenderer.labels.template.setAll({
			rotation: -90,
			centerY: am5.p50,
			centerX: am5.p100,
			paddingRight: 15,
		});

		xRenderer.grid.template.setAll({
			// location: 1,
		});

		const xAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(root, {
				renderer: xRenderer,
				maxDeviation: 0.3,
				categoryField: 'category',
				tooltip: am5.Tooltip.new(root, {}),
			}),
		);

		// create Y-axes
		const yRenderer = am5xy.AxisRendererY.new(root, {
			strokeOpacity: 0.1,
		});
		const yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				maxDeviation: 0.3,
				renderer: yRenderer,
			}),
		);

		// Create series
		const series1 = chart.series.push(
			am5xy.ColumnSeries.new(root, {
				name: 'Expenses',
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value1',
				categoryXField: 'category',
				tooltip: am5.Tooltip.new(root, {
					labelText: '{valueY}',
				}),
			}),
		);
		series1.columns.template.setAll({
			cornerRadiusTL: 5,
			cornerRadiusTR: 5,
			strokeOpacity: 0,
		});

		const colors = am5.ColorSet.new(root, {
			colors: [
				am5.color('#9AC1B1'),
				am5.color('#8DB9A7'),
				am5.color('#81B19D'),
				am5.color('#74AA93'),
				am5.color('#67A289'),
				am5.color('#5D987F'),
				am5.color('#558B75'),
				am5.color('#4E7E6A'),
				am5.color('#46725F'),
				am5.color('#3F6656'),
				am5.color('#36594A'),
				am5.color('#2F4C40'),
				am5.color('#273F35'),
				am5.color('#1F332A'),
				am5.color('#172620'),
				am5.color('#101915'),
				am5.color('#080D0B'),
			],
		});
		chart.set('colors', colors);
		series1.columns.template.adapters.add('fill', (fill, target) => {
			return chart
				?.get('colors')
				?.getIndex(series1.columns.indexOf(target));
		});
		series1.columns.template.adapters.add('stroke', (stroke, target) => {
			return chart
				?.get('colors')
				?.getIndex(series1.columns.indexOf(target));
		});
		xAxis.data.setAll(data);
		series1.data.setAll(data);

		return () => {
			root.dispose();
		};
	}, [data]);

	if (!data || data.length === 0) {
		return (
			<div className="chart-placeholder">
				<p>{getLang('No data available', lang)}</p>
			</div>
		);
	}

	return (
		<div
			id="chartdiv"
			style={{ width: '100%' }}
		></div>
	);
}

const ProjectExpensesCharts = ({
	project_id,
	lang,
}: {
	project_id: string;
	lang: string;
}) => {
	const [initialBudget, setInitialBudget] = useState<number>(0);
	const [receiptsTotal, setReceiptsTotal] = useState<number>(0);

	const [remainingBudget, setRemainingBudget] = useState<number>(0);
	const [topExpenseStores, setTopExpenseStores] = useState<any>({
		store: '',
		total: 0,
		receipts: [],
	});

	// state for the chart data
	const [chartData, setChartData] = useState<any>([]);

	const formatNumber = (num: number): string => {
		// negative values
		if (num < 0) {
			return `-${formatNumber(Math.abs(num))}`;
		}
		// return the value in $XXX,XXX.XX format
		// return , separate at numbers, but if num len > 7 providing suffixes

		if (num > 999999) {
			return `${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return num.toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		} else {
			return num.toFixed(2);
		}
	};

	useEffect(() => {
		// fetch project details

		const fetchProjectDetails = async () => {
			const project = await getProjectDetailsById(project_id);

			if (project) {
				setInitialBudget(project.budget);
			}

			const receipts = await getReceiptsForProject(project_id);

			if (receipts && receipts.length > 0) {
				const total = receipts.reduce((acc, receipt) => {
					return acc + receipt.price_total;
				}, 0);

				setReceiptsTotal(total);

				interface groupedReceiptResp {
					receipts: IReceipts[];
					total: number;
				}
				type ReceiptGroups = Record<string, groupedReceiptResp>;
				const groupedReceipts: ReceiptGroups =
					await getReceiptsForProjectByGroup(receipts, 'store');

				// convert to array of objects sorted by the total
				const groupedReceiptsArray = Object.entries(groupedReceipts)
					.map(([store, { receipts, total }]) => {
						return { store, total, receipts };
					})
					.sort((a, b) => b.total - a.total);

				setTopExpenseStores(groupedReceiptsArray[0]);

				// set chart data
				const chartData = groupedReceiptsArray
					?.slice(0, 10)
					?.map(group => {
						return {
							category: group.store,
							value1: group.total,
						};
					});

				setChartData(chartData);
			}
		};

		fetchProjectDetails();
	}, []);

	useEffect(() => {
		const remaining = initialBudget - receiptsTotal;
		setRemainingBudget(remaining);
	}, [initialBudget, receiptsTotal]);

	return (
		<div className={`projects-charts ${PoppinsSemiBold.className}`}>
			<div className="project-info">
				{/* Section for revenue and earnings */}
				<div className="budgets">
					{/* left side svg */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 revenue-icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
						/>
					</svg>

					{/* right side */}
					<div className="budgets">
						<h3 className="budget-title">
							{getLang('Project Budget', lang)}
						</h3>

						<h2 className="initial-budget">
							{getLang('Initial Budget', lang)}
						</h2>
						<span className="budget-num">
							${formatNumber(initialBudget)}
						</span>
						<span
							className={`allocation ${PoppinsRegular.className}`}
						>
							{getLang('Project Budget Allocation', lang)}
						</span>

						<h2 className="remaining-budget">
							{getLang('Budget Remaining', lang)}
						</h2>
						<span className="net-profit">
							${formatNumber(remainingBudget)}
						</span>
						<span className={`usage ${PoppinsRegular.className}`}>
							{getLang('Project Budget Usage', lang)}
						</span>
					</div>
				</div>
				<div className="expenses">
					{/* left side svg */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="expenses-icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
						/>
					</svg>

					{/* right side */}
					<div className="expenses">
						<h3 className="expenses-title">
							{getLang('Project Expenses', lang)}
						</h3>

						<h2 className="total-expenses-amount">
							{getLang('Total Expenses', lang)}
						</h2>
						<span className="expenses-total">
							${formatNumber(receiptsTotal)}
						</span>
						<span
							className={`time-expenses ${PoppinsRegular.className}`}
						>
							{getLang('Projects Expenses', lang)}
						</span>

						<h2 className="store-costs">
							{getLang('Top Store Costs', lang)}
						</h2>
						<span className="store-costs-ammounts">
							${formatNumber(topExpenseStores.total)}
						</span>
						<span
							className={`time-expenses ${PoppinsRegular.className}`}
						>
							{topExpenseStores.store}
						</span>
					</div>
				</div>
			</div>
			<div className="bar-chart">
				{chartData && chartData.length > 0 ? (
					<>
						<h2
							className={`chart-title ${PoppinsSemiBold.className}`}
						>
							{getLang('Top 10 Store Expenses', lang)}
						</h2>
						<Chart
							data={chartData}
							lang={lang}
						/>
					</>
				) : (
					<div className="chart-placeholder ">
						<p className="text-primary-green-600 md:text-lg text-center">
							{getLang('No data is present', lang)}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProjectExpensesCharts;

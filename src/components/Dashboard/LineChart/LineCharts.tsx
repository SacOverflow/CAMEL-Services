'use client';
import { useEffect, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

import {
	SingleLineChartDataElement,
	DoubleLineChartDataElement,
} from '@/types/componentTypes';

// helper functions
import { generateRandomHexColor } from '@/utils/generalUtils';
import { getCookie } from '@/lib/actions/client';
import getLang from '@/app/translations/translations';
import { getSpendingCategories } from '@/utils/dataUtils';

function DoubleLineChart(props: {
	id: string;
	filterType: 'year' | 'month' | 'week';
	data: DoubleLineChartDataElement[];
}) {
	const { filterType, id, data } = props;

	const [org_id, setOrgId] = useState<string>('');
	const [responseString, setResponseString] = useState<string>(
		'No data is present 😕',
	);

	const [chartData, setChartData] = useState<DoubleLineChartDataElement[]>(
		[],
	);

	useEffect(() => {
		// setChartData(data);

		// get the users cookie
		const cookie = getCookie('org');

		setOrgId(cookie || '');
	}, []);

	useEffect(() => {
		if (!data || data?.length <= 2) {
			setResponseString('Not enough data to display 😕');
			return;
		}

		setChartData(data);
	}, [data]);

	// useEffect(() => {
	// 	if (org_id !== '') {
	// 		const fetchData = async () => {
	// 			const data: DoubleLineChartDataElement[] =
	// 				await getDoubleLineChartData(org_id);

	// 			// convert the arrays objects date key to a string representation
	// 			if (data.length < 2) {
	// 				setResponseString('Not enough data to display');
	// 				return;
	// 			}
	// 			setChartData(data);
	// 		};

	// 		fetchData();
	// 	}
	// }, [org_id]);

	useEffect(() => {
		if (!chartData || chartData.length <= 2) {
			return () => {};
		}
		const root = am5.Root.new(`${id}`, {});

		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([am5themes_Animated.new(root)]);

		root.dateFormatter.setAll({
			dateFormat: 'yyyy',
			dateFields: ['valueX'],
		});

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		const chart = root.container.children.push(
			am5xy.XYChart.new(root, {
				focusable: true,
			}),
		);

		const easing = am5.ease.linear;

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		const xAxis = chart.xAxes.push(
			am5xy.DateAxis.new(root, {
				maxDeviation: 0.5,
				groupData: false,
				baseInterval: {
					timeUnit: 'day',
					count: 1,
				},
				renderer: am5xy.AxisRendererX.new(root, {
					pan: 'zoom',
					minGridDistance: 50,
					// Hides the X-axis line legends 2 lines below
					visible: false,
					opposite: true,
					strokeWidth: 0,
				}),
				tooltip: am5.Tooltip.new(root, {}),
				// Hides the X-axis
				visible: false,
			}),
		);

		const yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				maxDeviation: 1,
				renderer: am5xy.AxisRendererY.new(root, {
					// Hides the Y-axis line legends 2 lines below
					visible: false,
					opposite: true,
				}),
				// Hides the Y-axis
				visible: false,
			}),
		);

		// Additionally, hide the grid lines for both axes
		yAxis.get('renderer').grid.template.setAll({
			visible: false,
		});
		xAxis.get('renderer').grid.template.setAll({
			visible: false,
		});

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		const series = chart.series.push(
			am5xy.SmoothedXLineSeries.new(root, {
				minBulletDistance: 5,
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value',
				valueXField: 'date',
				// set color of line
				stroke: am5.color(generateRandomHexColor()),
				tooltip: am5.Tooltip.new(root, {
					labelText: '{valueY}',
				}),
			}),
		);
		// Set up data processor to parse string dates
		// https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
		series.data.processor = am5.DataProcessor.new(root, {
			dateFormat: 'yyyy-MM-dd',
			dateFields: ['date'],
		});
		series.data.setAll(chartData);

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		const series2 = chart.series.push(
			am5xy.SmoothedXLineSeries.new(root, {
				minBulletDistance: 5,
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value2',
				valueXField: 'date',
				// set color of line
				stroke: am5.color(generateRandomHexColor()),
				tooltip: am5.Tooltip.new(root, {
					labelText: '{valueY}',
				}),
			}),
		);

		// Set up data processor to parse string dates
		// https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
		series2.data.processor = am5.DataProcessor.new(root, {
			dateFormat: 'yyyy-MM-dd',
			dateFields: ['date'],
		});
		series2.data.setAll(chartData);

		return () => {
			root.dispose();
		};
	}, [chartData]);

	if (!chartData || chartData.length === 0) {
		return (
			<div
				id={id}
				className="double-chart-container"
			>
				<p className="text-primary-green-500 text-lg">
					{responseString}
				</p>
			</div>
		);
	}

	return (
		<div
			id={id}
			className="double-chart-container"
			style={{ width: 'auto', height: 'auto' }}
		></div>
	);
}

function SingleLineChart(props: {
	data: SingleLineChartDataElement[];
	id: string;
	filterType: 'year' | 'month' | 'week';
}) {
	const { id } = props;

	// TODO: API call rout eshould return data as incremental values for the date
	const { data } = props;
	const [chartData, setChartData] = useState<SingleLineChartDataElement[]>(
		[],
	);
	useEffect(() => {
		if (!data || data.length === 0) {
			return;
		}
		setChartData(data);
	}, [data]);

	useEffect(() => {
		if (!chartData || chartData?.length < 2) {
			return () => {};
		}

		const root = am5.Root.new(`${id}`, {});
		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([am5themes_Animated.new(root)]);

		root.dateFormatter.setAll({
			dateFormat: 'yyyy',
			dateFields: ['valueX'],
		});

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		const chart = root.container.children.push(
			am5xy.XYChart.new(root, {
				focusable: true,
			}),
		);

		const easing = am5.ease.linear;

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		const xAxis = chart.xAxes.push(
			am5xy.DateAxis.new(root, {
				maxDeviation: 0.5,
				groupData: false,
				baseInterval: {
					timeUnit: 'day',
					count: 1,
				},
				renderer: am5xy.AxisRendererX.new(root, {
					pan: 'zoom',
					minGridDistance: 50,
					// Hides the X-axis line legends 2 lines below
					visible: false,
					opposite: true,
					strokeWidth: 0,
				}),
				tooltip: am5.Tooltip.new(root, {}),
				// Hides the X-axis
				visible: false,
			}),
		);

		const yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				maxDeviation: 1,
				renderer: am5xy.AxisRendererY.new(root, {
					// Hides the Y-axis line legends 2 lines below
					visible: false,
					opposite: true,
					strokeWidth: 0,
				}),
				// Hides the Y-axis
				visible: false,
			}),
		);
		// Additionally, hide the grid lines for both axes
		yAxis.get('renderer').grid.template.setAll({
			visible: false,
		});
		xAxis.get('renderer').grid.template.setAll({
			visible: false,
		});

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		const series = chart.series.push(
			am5xy.SmoothedXLineSeries.new(root, {
				minBulletDistance: 5,
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value',
				valueXField: 'date',
				// set color of line
				stroke: am5.color(generateRandomHexColor()),
				tooltip: am5.Tooltip.new(root, {
					labelText: '{valueY}',
				}),
			}),
		);

		// Set up data processor to parse string dates
		// https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
		series.data.processor = am5.DataProcessor.new(root, {
			dateFormat: 'yyyy-MM-dd',
			dateFields: ['date'],
		});
		series.data.setAll(chartData);

		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
		const cursor = chart.set(
			'cursor',
			am5xy.XYCursor.new(root, {
				xAxis: xAxis,
			}),
		);
		cursor.lineY.set('visible', false);
		return () => {
			root.dispose();
		};
	}, [chartData]);

	return (
		<div
			id={id}
			className="chart-container"
			style={{ width: 'auto', height: 'auto' }}
		></div>
	);
}

const SingleLineChartComponent = (props: {
	id: string;
	filterType: 'year' | 'month' | 'week';
	idx: number;
	lang: string;
}) => {
	const { id, idx, lang } = props;

	const [org_id, setOrgId] = useState<string>('');
	const [category, setCategory] = useState<{
		category: string;
		total: number;
		data: SingleLineChartDataElement[];
	}>({
		category: '',
		total: 0,
		data: [],
	});

	useEffect(() => {
		// get the users cookie
		const cookie = getCookie('org');

		setOrgId(cookie || '');
	}, []);

	useEffect(() => {
		if (org_id !== '') {
			const fetchData = async () => {
				const categoriesData = await getSpendingCategories(org_id);
				const category = categoriesData[idx];

				setCategory(category);
			};

			fetchData();
		}
	}, [idx, org_id]);

	if (!category || !category.data || category?.data?.length === 0) {
		return (
			<div
				id={id}
				className="chart-container"
			>
				<p className="text-primary-green-500 text-lg">
					No data is present 😕
				</p>
			</div>
		);
	}
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
	return (
		<>
			<span className="title">
				<span>{getLang(category.category, lang)}</span>
			</span>
			<span className="amount">
				${formatNumber(category?.total) || '0'}
			</span>
			<SingleLineChart
				data={category.data}
				filterType={`week`}
				id={id}
			/>
		</>
	);
};

export { SingleLineChart, DoubleLineChart, SingleLineChartComponent };

'use client';

import React, { useEffect, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {
	getFilteredCategoryPieChart,
	PieChartDataElement,
} from '@/lib/actions/dashboard';

function capitalizeFirstLetter(inputString: string): string {
	return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

function PieChart(props: { className: string }) {
	const { className } = props;
	const [chartData, setChartData] = useState<PieChartDataElement[]>([]);

	useEffect(() => {
		// Asynchronously fetch data when the component mounts
		const fetchData = async () => {
			const data = await getFilteredCategoryPieChart(); // Ensure this function is implemented to fetch data from Supabase
			setChartData(data);
		};

		fetchData();
	}, []);
	useEffect(() => {
		// Create root element
		const root = am5.Root.new('chartdiv1');

		// Set themes
		root.setThemes([am5themes_Animated.new(root)]);

		// Create chart
		const chart = root.container.children.push(
			am5percent.PieChart.new(root, {
				layout: root.verticalLayout,
			}),
		);

		// Create series
		const series = chart.series.push(
			am5percent.PieSeries.new(root, {
				alignLabels: true,
				calculateAggregates: true,
				valueField: 'value',
				categoryField: 'category',
				innerRadius: am5.percent(50), // This makes the chart a donut chart
			}),
		);

		// remove text for labels
		series.labels.template.setAll({
			// remove labels
			visible: false,
		});

		// set depth of chart

		series.slices.template.setAll({
			strokeWidth: 3,
			stroke: am5.color(0xffffff),
		});

		series.labelsContainer.set('paddingTop', 30);

		// const data: PieChartDataElement[] = [
		// 	{
		// 		value: 10,
		// 		category: 'One',
		// 	},
		// 	{
		// 		value: 9,
		// 		category: 'Two',
		// 	},
		// 	{
		// 		value: 6,
		// 		category: 'Three',
		// 	},
		// 	{
		// 		value: 5,
		// 		category: 'Four',
		// 	},
		// 	{
		// 		value: 4,
		// 		category: 'Five',
		// 	},
		// 	{
		// 		value: 3,
		// 		category: 'Six',
		// 	},
		// ];

		// Set data
		series.data.setAll(chartData); // Add your data here

		// hide ticks
		series.ticks.template.setAll({
			visible: false,
		});

		// Create legend
		const legend = chart.children.push(
			am5.Legend.new(root, {
				centerX: am5.p50,
				x: am5.p50,
				marginTop: 15,
				marginBottom: 15,
				visible: false,
			}),
		);

		// legend.data.setAll(series.dataItems);

		const maxCategory = chartData.reduce(
			(prev, current) => (prev.value > current.value ? prev : current),
			{ value: 0, category: '' },
		);

		const capitalizedCategory = capitalizeFirstLetter(maxCategory.category);

		// Add label for center text
		const centerTextLabel = chart.seriesContainer.children.push(
			am5.Label.new(root, {
				text: `$[bold]${maxCategory.value}[/]\n${capitalizedCategory}`,
				centerX: am5.percent(50),
				textAlign: 'center',
				centerY: am5.percent(50),
				fontSize: `.5rem`,
				// make font size responsive to screen size
				// fontSize: am5.percent(70),
			}),
		);

		// Play initial series animation
		series.appear(1000, 100);
		console.log('PIE CHART DATA: ', chartData);

		// Cleanup
		return () => root.dispose();
	}, [chartData]);

	return (
		<div
			id="chartdiv1"
			className={`${className}`}
			style={{ width: '100%', height: '100%' }}
		></div>
	);
}

export default PieChart;

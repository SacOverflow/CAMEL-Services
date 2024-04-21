'use client';

// CSS import
import './overall_spending_barchart.css';

import React, { useEffect, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themese_Responsive from '@amcharts/amcharts5/themes/Responsive';
import {
	getFilteredCategoryPieChart,
	PieChartDataElement,
} from '@/lib/actions/dashboard';
import getLang from '@/app/translations/translations';
import { getCookie, getLangPrefOfUser } from '@/lib/actions/client';

function PieChart(props: { className: string }) {
	const { className } = props;
	const [chartData, setChartData] = useState<PieChartDataElement[]>([]);
	const [lang, setLang] = useState('english');

	/**
	 * Function to capitalize the first letter of a string
	 * @param inputString string to capitalize
	 * @returns string with first letter capitalized
	 */
	function capitalizeFirstLetter(inputString: string): string {
		return inputString.charAt(0).toUpperCase() + inputString.slice(1);
	}

	// To be used to display the category with the highest value on actions
	const [selectedCategory, setSelectedCategory] = useState({
		category: '',
		value: 0,
	});

	const [org_id, setOrgId] = useState<string | null>(null);

	useEffect(() => {
		// Fetch org_id from cookie
		const org_id = getCookie('org');
		setOrgId(org_id);

		// Asynchronously fetch data when the component mounts
		const fetchData = async () => {
			const data = await getFilteredCategoryPieChart(org_id); // Ensure this function is implemented to fetch data from Supabase
			setChartData(data);
		};

		const getLanguage = async () => {
			const lang = await getLangPrefOfUser();
			setLang(lang);
		};

		fetchData();
		getLanguage();
	}, []);

	useEffect(() => {
		if (chartData.length === 0) {
			// expects an object returned disposing christ.
			return () => {};
		}

		// Create root element
		const root = am5.Root.new('chartdiv1');

		// Set themes
		root.setThemes([
			am5themes_Animated.new(root),
			am5themese_Responsive.new(root),
		]);

		// Create chart
		const chart = root.container.children.push(
			am5percent.PieChart.new(root, {
				layout: root.verticalLayout,
				width: am5.percent(100),
				height: am5.percent(100),
			}),
		);

		// Create series
		const series = chart.series.push(
			am5percent.PieSeries.new(root, {
				alignLabels: true,
				// alignLabels: false,
				calculateAggregates: true,
				valueField: 'value',
				categoryField: 'category',
				innerRadius: am5.percent(50), // This makes the chart a donut chart
			}),
		);

		series
			.get('colors')
			?.set('colors', [
				am5.color('#FFD26B'),
				am5.color('#71CEFB'),
				am5.color('#FC5256'),
				am5.color('#FA66C0'),
				am5.color('#6FEE7B'),
				am5.color('#FD5200'),
				am5.color('#00CFC1'),
				am5.color('#52FFB8'),
				am5.color('#D0FEF5'),
				am5.color('#FAB2EA'),
			]);

		// set max width using parent and percent
		const containerWidth = chart.get('width');
		const containerHeight = chart.get('height');

		// remove text for labels
		series.labels.template.setAll({
			// remove labels
			visible: false,
			// fontSize: 'clamp(.2rem, 1.5vw, .4rem)',
			// text: '{category}',
			// oversizedBehavior: 'truncate',
			// ellipsis: '...',
		});

		series.slices.template.setAll({
			strokeWidth: 3,
			stroke: am5.color(0xffffff),
			// tooltipText: `{category}: $\\{value}`,
			tooltipText: `[bold]{category}[/]\n $\{value}`,
			tooltipHTML: `<div class="overall-spending-tooltip-container">
			<div class="tooltip-title">{category}</div>
			<div class="tooltip-value">$${'{value}'}</div>
			</div>`,
		});

		series.labelsContainer.set('paddingTop', 30);

		// Set data
		const chartDataTranslated = chartData.map(item => {
			return { ...item, category: getLang(item.category, lang) };
		});

		// set data
		series.data.setAll(chartDataTranslated);

		// set the series valueY dependent to largest; for scaling each segment
		// const maxSeriesValue = Math.max(...chartData.map(item => item.value));
		// series.slices.each((slice: any, idx) => {
		// 	// scale for the smallest segment
		// 	const minValueScale = 0.9;
		// 	// scale for the largest segment
		// 	const maxValueScale = 1.1;
		// 	function calculateSegmentScale(
		// 		segmentValue: number,
		// 		maxSeriesValue: number,
		// 	) {
		// 		// range between min and max scales
		// 		const range = maxValueScale - minValueScale;
		// 		const scale =
		// 			minValueScale + (segmentValue / maxSeriesValue) * range;
		// 		// ensure scale is within bounds
		// 		return Math.max(minValueScale, Math.min(scale, maxValueScale));
		// 	}
		// 	const val = slice._dataItem.dataContext.value;
		// 	const scaling = calculateSegmentScale(val, maxSeriesValue);
		// 	slice.set('scale', scaling);
		// });

		// hide ticks
		series.ticks.template.setAll({
			visible: false,
		});

		// Create legend
		const overlayLegend = am5.Legend.new(root, {
			centerX: am5.p50,
			x: am5.p50,
			marginTop: 15,
			marginBottom: 15,
			visible: false,
		});
		// overlayLegend.labels.template.setAll({
		// 	fontSize: 'clamp(.2rem, 1.5vw, .4rem)',
		// 	textAlign: 'start',
		// });
		const legend = chart.children.push(overlayLegend);

		// legend.data.setAll(series.dataItems);

		const maxCategory = chartData.reduce(
			(prev, current) => (prev.value > current.value ? prev : current),
			{ value: 0, category: '' },
		);

		const capitalizedCategory = capitalizeFirstLetter(
			getLang(maxCategory.category, lang),
		);

		// setSelectedCategory({
		// 	category: capitalizedCategory,
		// 	value: maxCategory.value,
		// });

		// Add label for center text
		const centerTextLabel = chart.seriesContainer.children.push(
			am5.Label.new(root, {
				text: `[bold]${capitalizedCategory}[/]\n$${maxCategory.value}`,
				centerX: am5.percent(50),
				textAlign: 'center',
				centerY: am5.percent(50),
				fontSize: `clamp(.6rem, 1.5vw, .65rem)`,
				// make font size responsive to screen size
				breakWords: true,
				oversizedBehavior: 'truncate',
				ellipsis: '...',
				maxWidth: 69,
			}),
		);
		series.slices.template.states.create('hover', {
			scale: 1.3,
		});

		// Play initial series animation
		series.appear(1000, 100);

		// Cleanup
		return () => root.dispose();
	}, [chartData, org_id]);

	if (chartData.length === 0) {
		return (
			<div
				id="chartdiv1"
				className={`${className} chart-no-data`}
				style={{
					width: '100%',
					height: '100%',
				}}
			>
				<p className="text-primary-green-500 text-lg">
					No data is present 😕
				</p>
			</div>
		);
	}

	return (
		<div
			id="chartdiv1"
			className={`${className}`}
			style={{ width: '100%', height: '100%' }}
		></div>
	);
}

export default PieChart;

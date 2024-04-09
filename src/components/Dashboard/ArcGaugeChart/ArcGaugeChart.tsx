'use client';
import { useEffect, useState } from 'react';

import * as am5 from '@amcharts/amcharts5';
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { createSupbaseClient } from '@/lib/supabase/client';
import { getCookie } from '@/lib/actions/client';

interface ArcGaugeChartDataElement {
	month: string;
	value: number;
}

function getMinMaxValue(data: ArcGaugeChartDataElement[]) {
	// const convertObjectValues = Object.values(data);

	const convertObjectValues = Object.values(data).map(({ value }) => value);

	const min = Math.min(...convertObjectValues);
	const max = Math.max(...convertObjectValues);

	return { min, max };
}

// Guidance https://www.amcharts.com/demos/animated-gauge/
const ArcGaugeChart = (props: { id: string; className?: string }) => {
	const [currentMonth, setCurrentMonth] = useState('January');
	const [chartFill, setChartFill] = useState(0);
	const [currentValue, setCurrentValue] = useState(0);

	const [months, setMonths] = useState({
		January: 0,
		February: 0,
		March: 0,
		April: 0,
		May: 0,
		June: 0,
		July: 0,
		August: 0,
		September: 0,
		October: 0,
		November: 0,
		December: 0,
	});

	const [chartData, setChartData] = useState<
		ArcGaugeChartDataElement[] | any[]
	>([]);
	const [org_id, setOrgId] = useState('');
	const [max, setMax] = useState(0);
	const [min, setMin] = useState(0);

	useEffect(() => {
		// get cookie
		const cookie = getCookie('org');

		// set org_id
		setOrgId(cookie || '');
	}, []);

	useEffect(() => {
		// fetch data from supabase

		const fetchSalesData = async () => {
			if (!org_id) {
				return;
			}
			const supabase = await createSupbaseClient();
			const { data, error } = await supabase
				.from('receipts')
				.select('*')
				.eq('org_id', org_id);

			if (error) {
				console.error('Error fetching sales data', error);
				return;
			}

			// Create a new months object to collect the data
			const newMonths: any = { ...months };
			// using the data, calculate the total spenditures for each month
			data.forEach((receipt: any) => {
				const date = new Date(receipt.created_at);
				const month = date.toLocaleString('default', { month: 'long' });
				const amount = receipt.price_total || 0;

				// add to the months object
				newMonths[month] = (newMonths[month] || 0) + amount;
			});

			const mnthArray: any[] = Object.entries(newMonths).map(
				([month, value]) => {
					return { month, value };
				},
			);
			// get min and max values
			const { min, max } = getMinMaxValue(mnthArray);
			setMax(max);
			setMin(min);

			// convert object to object with percentage attributes TODO: implement filling chart dynamically
			const newData = Object.entries(newMonths).map(
				([month, value]: [string, any]) => {
					const percent = (value / max) * 100;
					return { month, value: percent };
				},
			);

			setChartData(newMonths);

			const monthsArray: ArcGaugeChartDataElement[] = Object.entries(
				months,
			).map(([month, value]) => {
				return { month, value };
			});
		};

		fetchSalesData();
	}, [org_id]);

	const updateMonth = (month: string) => {
		setCurrentMonth(month);

		// Find the percent value for the clicked month and update the state
		const clickedMonthVal = chartData[month as keyof typeof chartData];
		const percentVal = clickedMonthVal ? (clickedMonthVal * 100) / max : 0;

		const value = clickedMonthVal || 0;
		setCurrentValue(value);

		setChartFill(percentVal);
		setCurrentValue(clickedMonthVal || 0);
	};

	const { id, className } = props;
	useEffect(() => {
		// use this to mount the chart
		// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		const root = am5.Root.new(`${id}`);

		root.setThemes([am5themes_Animated.new(root)]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/radar-chart/
		const chart = root.container.children.push(
			am5radar.RadarChart.new(root, {
				panX: false,
				panY: false,
				startAngle: 180,
				endAngle: 360,
				innerRadius: am5.percent(20),
			}),
		);

		chart.getNumberFormatter().set('numberFormat', "#'%'");

		// Create axis and its renderer
		// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
		const axisRenderer = am5radar.AxisRendererCircular.new(root, {
			innerRadius: -25,
		});

		axisRenderer.grid.template.setAll({
			stroke: root.interfaceColors.get('background'),
			visible: true,
			strokeOpacity: 0.8,
		});

		const xAxis = chart.xAxes.push(
			am5xy.ValueAxis.new(root, {
				maxDeviation: 0,
				min: 0,
				max: 100,
				strictMinMax: true,
				renderer: axisRenderer,
			}),
		);

		xAxis.get('renderer').labels.template.setAll({
			visible: false,
		});

		// Add clock hand
		// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
		const axisDataItem = xAxis.makeDataItem({});
		xAxis.createAxisRange(axisDataItem);

		const label = chart.radarContainer.children.push(
			am5.Label.new(root, {
				centerX: am5.percent(50),
				textAlign: 'center',
				centerY: am5.percent(50),
				fontSize: '1.5em',
				fill: am5.color(0x0000),
				fontWeight: 'bold',
				text: `$${currentValue}`,
			}),
		);

		// center label
		chart.bulletsContainer.set('mask', undefined);

		const axisRange0 = xAxis.createAxisRange(
			xAxis.makeDataItem({
				above: true,
				value: 0,
				endValue: chartFill,
			}),
		);

		// set radius of this axis
		axisRange0.get('axisFill')?.setAll({
			visible: true,
			fill: am5.color(0x346e53),
		});

		axisRange0.get('label')?.setAll({
			forceHidden: true,
		});

		// secnod half of arc gauge chart; white bg
		const axisRange1 = xAxis.createAxisRange(
			xAxis.makeDataItem({
				above: false,
				value: 0,
				endValue: 100,
			}),
		);

		axisRange1.get('axisFill')?.setAll({
			visible: true,
			fill: am5.color(0xf1f1f4),
		});

		axisRange1.get('label')?.setAll({
			forceHidden: true,
		});

		// Update chart dynamically when chartData changes
		if (chartData && chartData.length > 0) {
			// Update label text based on the current month
			label.set(
				'text',
				chartData
					.find(x => x.month === currentMonth)
					?.value.toString() || '',
			);

			// Find the percent value for the current month
			const currentPercent =
				chartData.find(x => x.month === currentMonth)?.value || 0;

			// Update the axis range dynamically
			axisRange0.setAll({
				endValue: currentPercent,
			});
		}

		return () => {
			root.dispose();
		};
	}, [chartData, currentMonth]);

	if (Object.keys(chartData).length === 0) {
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

	return (
		<>
			<div
				id={id}
				className={`${className}`}
				style={{ width: 'auto', height: '100%' }}
			></div>

			<div
				className={`flex justify-between text-sm border-gray-300 w-full border-t-2 p-2 flex-wrap `}
			>
				{Object.keys(chartData).map((month, idx) => (
					<span
						key={idx}
						onClick={() => updateMonth(month)}
						className={`cursor-pointer p-3 rounded-xl ${
							currentMonth === month
								? 'text-primary-green-500 bg-blue-100'
								: ' hover:bg-blue-200'
						}`}
					>
						{month}
					</span>
				))}
			</div>
		</>
	);
};

export default ArcGaugeChart;

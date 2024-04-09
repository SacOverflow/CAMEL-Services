'use client';
import {
	DoubleLineChart,
	SingleLineChartComponent,
} from '@/components/Dashboard/LineChart/LineCharts';
import getLang from '@/app/translations/translations';
// CSS imports
import './SalesTrendWidget.css';
import { getCookie, getLangPrefOfUser } from '@/lib/actions/client';
import { TrendWidgetPercentage } from './TrendWidget';
import { useEffect, useState } from 'react';
import { DoubleLineChartDataElement } from '@/types/componentTypes';
import { getDoubleLineChartData } from '@/lib/actions/dashboard';
const SalesTrendWidget = ({
	filterType = 'year',
	className,
	org,
}: {
	filterType?: 'year' | 'month' | 'week' | 'day' | string; // TO BE IMPLEMENTED
	className?: string;
	org: string;
}) => {
	const [lang, setLang] = useState('en');
	useEffect(() => {
		const getUserAndLang = async () => {
			const langPref = await getLangPrefOfUser();
			setLang(langPref);
		};

		getUserAndLang();
	}, []);
	// check if totals not null keys

	return (
		<>
			<div className="trends-widget">
				<span className="trends-widget-title">
					{' '}
					{getLang('Sales Trend', lang)}
				</span>
				<DoubleLineChartComponent lang={lang} />
			</div>
			{/* bottom card component */}
			<div id="costBreakdownSection">
				{/* generate 3 and render the singleLine Chart Component */}
				{Array.from({ length: 3 }).map((_, index) => {
					const chartId = `bar-${index}`;
					return (
						<div
							className="category"
							key={index}
						>
							<SingleLineChartComponent
								id={chartId}
								filterType={`week`}
								idx={index}
								lang={lang}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
};

const DoubleLineChartComponent = ({ lang }: { lang: string }) => {
	const [org_id, setOrgId] = useState<string>('');

	const [presentData, setPresentData] = useState<boolean>(false);

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
		if (org_id !== '') {
			const fetchData = async () => {
				const data: DoubleLineChartDataElement[] =
					await getDoubleLineChartData(org_id);

				// convert the arrays objects date key to a string representation
				if (!data || data.length < 2) {
					return;
				}
				setPresentData(true);
				setChartData(data);
			};

			fetchData();
		}
	}, [org_id]);

	return (
		<>
			<TrendWidgetPercentage
				lang={lang}
				data={presentData}
			/>
			{/* charts utilizing AM Charts */}
			<DoubleLineChart
				data={chartData}
				filterType={`week`}
				id={`double-line-chart`}
			/>
		</>
	);
};

export default SalesTrendWidget;

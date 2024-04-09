'use client';

import getLang from '@/app/translations/translations';
import { getCookie } from '@/lib/actions/client';
import { getSalesOverviewData } from '@/utils/dataUtils';
import { calculatePercentageDifference } from '@/utils/generalUtils';
import { useEffect, useState } from 'react';

export const TrendWidgetPercentage = ({
	lang,
	data,
}: {
	lang: string;
	data: boolean;
}) => {
	const [org_id, setOrgId] = useState<string>('');
	const [salesOverview, setSalesOverview] = useState({
		total: 0,
		previousTotal: 0,
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
				const data: any = await getSalesOverviewData(org_id);
				setSalesOverview(data);
			};

			fetchData();
		}
	}, [org_id]);

	if (!data) {
		return (
			<div className="trends-widget-percentage">
				<span className="trends-widget-percentage-value">
					{calculatePercentageDifference(0, 0)}
					<span className="percentage-sign">%</span>
				</span>
				<span className="trends-widget-percentage-text">
					{getLang('Compared to', lang)} ${0}{' '}
					{getLang('Last year', lang)}.
				</span>
			</div>
		);
	}

	return (
		<div className="trends-widget-percentage">
			<span className="trends-widget-percentage-value">
				{calculatePercentageDifference(
					salesOverview.total || 0,
					salesOverview.previousTotal || 0,
				)}
				<span className="percentage-sign">%</span>
			</span>
			<span className="trends-widget-percentage-text">
				{getLang('Compared to', lang)} ${salesOverview.previousTotal}{' '}
				{getLang('Last year', lang)}.
			</span>
		</div>
	);
};

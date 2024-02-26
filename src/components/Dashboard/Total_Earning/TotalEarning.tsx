'use client';
//Import css file for custom styles
import { useEffect, useState } from 'react';
import './TotalEarning.css';
import { getOrganizationProjectEarnings } from '@/lib/actions/dashboard';
//Categorize data by its type def for props in TotalEarning to accept

//Example of static data, initalizing data inside component
const TotalEarning = ({ org_id }: { org_id: string }) => {
	const [totalEarnings, setTotalEarnings] = useState({
		currentEarning: 0,
		previousEarning: 0,
		difference: '0',
		isPositive: false,
	});

	const [hasData, setHasData] = useState(false); // New state to track data presence

	useEffect(() => {
		// retrieve the sum of projects and expenses
		const fetchEarnings = async () => {
			// fetch data from API
			const resp = await getOrganizationProjectEarnings(org_id);

			// if .response not 200 some error occured
			if (resp.response !== 200) {
				setHasData(false);
				return;
			}

			// set state
			setTotalEarnings({
				currentEarning: resp.currentEarning,
				previousEarning: resp.previousEarning,
				difference: calculatePercentageDifference(
					resp.currentEarning,
					resp.previousEarning,
				) as string,
				isPositive: resp.isPositive ? resp.isPositive : false,
			});
			setHasData(true);
		};

		// call fetchEarnings
		fetchEarnings();
	}, [org_id]);

	const calculatePercentageDifference = (
		currentEarning: number,
		previousEarning: number,
	) => {
		// check for division by zero
		if (previousEarning === 0) {
			// set isPositive to null
			setTotalEarnings({ ...totalEarnings, isPositive: null as any });

			if (currentEarning === 0) {
				return '0';
			}

			return '100';
		}
		const difference =
			((currentEarning - previousEarning) / previousEarning) * 100;
		return difference;
	};

	return (
		<div className="total-earning-container">
			{hasData ? (
				<>
					<div className="earning-header">
						<div className="earning-title">Total earning</div>
					</div>
					<div className="earning-format">
						<div className="earning-value">
							${totalEarnings.currentEarning.toLocaleString()}
						</div>
						<div
							className={`earning-percentage ${
								totalEarnings.isPositive === null
									? 'earning-percentage-neutral'
									: totalEarnings.isPositive
									? 'earning-percentage-positive'
									: 'earning-percentage-negative'
							}`}
						>
							{/* {totalEarnings.isPositive ? '▲' : '▼'}{' '} */}
							{
								totalEarnings.isPositive === null
									? '○ ' // if isPositive is null; no arrow neutral value
									: totalEarnings.isPositive
									? '▲ ' // if isPositive is true; up arrow
									: '▼ ' // if isPositive is false; down arrow
							}
							{totalEarnings.difference}%
						</div>
					</div>
					<div className="earning-comparison">
						Compared to $
						{totalEarnings.previousEarning.toLocaleString()} last
						year
					</div>
				</>
			) : (
				<div className="no-data-message">No data available</div>
			)}
		</div>
	);
};

export default TotalEarning;

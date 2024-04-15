// DownloadExcelButton.client.tsx
'use client';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { fetchProjectData } from '@/lib/actions/project_csv';
import { ProjectData } from '@/lib/actions/project_csv';

interface DownloadExcelButtonProps {
	project_id: string;
}

const DownloadExcelButton: React.FC<DownloadExcelButtonProps> = ({
	project_id,
}) => {
	const [projectDetails, setProjectDetails] = useState<ProjectData | null>(
		null,
	);

	useEffect(() => {
		async function loadData() {
			const data: any = await fetchProjectData(project_id);
			setProjectDetails(data);
		}

		loadData().catch();
	}, [project_id]);

	const handleDownloadExcel = () => {
		if (!projectDetails) {
			console.error('Project data is not loaded.');
			return;
		}

		const workbook = XLSX.utils.book_new();

		// Create Overview sheet
		const overviewWs = XLSX.utils.json_to_sheet(
			Array.isArray(projectDetails.overviewData)
				? projectDetails.overviewData
				: [projectDetails.overviewData],
		);
		XLSX.utils.book_append_sheet(workbook, overviewWs, 'Overview');

		// Create sheets for each month's spending data
		projectDetails.monthByMonthExcelData.forEach(({ month, data }) => {
			const ws = XLSX.utils.json_to_sheet(data);
			XLSX.utils.book_append_sheet(workbook, ws, month);
		});
		// console.log('projectDetails:', projectDetails);
		// console.log('overviewData[0]:', projectDetails?.overviewData[0]);

		// Write the workbook to a file
		const fileName =
			projectDetails?.overviewData[0]?.Project_name || 'Project';
		XLSX.writeFile(workbook, `${fileName}-Details.xlsx`);
	};

	if (!projectDetails) {
		return <div>Loading...</div>;
	}
	return (
		<button
			onClick={handleDownloadExcel}
			title="Download Excel"
			className="flex items-center justify-center"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-6 h-6"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
				/>
			</svg>
		</button>
	);
};

export default DownloadExcelButton;

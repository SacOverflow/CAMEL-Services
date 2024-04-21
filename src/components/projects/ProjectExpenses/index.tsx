// CSS import
import ProjectExpensesCharts from './Charts';
import './ProjectExpenses.css';

import { Poppins } from 'next/font/google';

const PoppinsSemiBold = Poppins({
	subsets: ['latin-ext'],
	weight: ['700'],
});
const PoppinsRegular = Poppins({
	subsets: ['latin-ext'],
	weight: ['400'],
});

const ProjectExpenses = ({
	project_id,
	lang,
}: {
	project_id: string;
	lang: string;
}) => {
	return (
		<div id="project-expenses">
			<h3
				className={`header
        ${PoppinsSemiBold.className}`}
			>
				Summary
			</h3>

			<ProjectExpensesCharts
				project_id={project_id}
				lang={lang}
			/>
		</div>
	);
};

export default ProjectExpenses;

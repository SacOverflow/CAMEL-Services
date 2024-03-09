import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FilteredProjects from '@/components/projects/FilterStatusBars/FilteredProjects';
import { IProjects, Roles, Status } from '@/types/database.interface';

require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

// update
describe('FilteredProjects', async () => {
	beforeAll(() => {
		jest.resetModules(); // Most important - it clears the cache
		process.env = { ...OLD_ENV }; // Make a copy

		jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
		jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log
	});

	// Define your teardown logic
	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment

		jest.restoreAllMocks();
	});

	// const projects = await getAllProjects(process.env.ORG_ID as string); // FIXME: here
	const projects: IProjects[] = [
		{
			id: '1',
			// name: 'Project with status InProgress',
			title: 'Project with status InProgress',
			details: 'Description',
			address: 'Address',
			budget: 1000,
			completed_date: new Date(),
			created_by: process.env.TESTING_USER_ID as string,
			current_spent: 100,
			due_date: new Date(),
			status: Status.InProgress,
			start_date: new Date(),
			created_at: new Date(),
			org_id: process.env.ORG_ID as string,
		},
		{
			id: '2',
			// name: 'Project with status InProgress',
			title: 'Project with status InProgress',
			details: 'Description',
			address: 'Address',
			budget: 1000,
			completed_date: new Date(),
			created_by: process.env.TESTING_USER_ID as string,
			current_spent: 100,
			due_date: new Date(),
			status: Status.Complete,
			start_date: new Date(),
			created_at: new Date(),
			org_id: process.env.ORG_ID as string,
		},
	];

	it('renders projects with default filters', () => {
		const { getByText } = render(
			<FilteredProjects
				projects={projects as any}
				role={Roles.ADMIN}
				org={process.env.ORG_ID as string}
			/>,
		);

		expect(getByText('Projects')).toBeInTheDocument();
		expect(getByText('No projects found')).toBeInTheDocument();
	});

	// it('renders projects based on selected filters', () => {
	//   const { getByText, queryByText } = render(
	//     <FilteredProjects
	//         projects={projects as any}
	//         role={Roles.ADMIN}
	//         org="org_id"
	//     />
	//   );

	//   fireEvent.click(getByText('Complete')); // Assuming you have status labels visible
	//   expect(queryByText('No projects found')).not.toBeInTheDocument();
	//   expect(getByText('Project with status Complete')).toBeInTheDocument();
	//   expect(queryByText('Project with status InProgress')).not.toBeInTheDocument();
	// });

	// test('adds a new project card if user has permission', () => {
	//   const { getByText } = render(
	//     <FilteredProjects
	//         projects={projects as any}
	//         role={Roles.SUPERVISOR}
	//         org="org_id"
	//     />
	//   );

	//   expect(getByText('Add New Project')).toBeInTheDocument();
	// });
});

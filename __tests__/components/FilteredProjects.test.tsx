import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import FilteredProjects from '@/components/projects/FilterStatusBars/FilteredProjects';
import { IProjects, Roles } from '@/types/database.interface';
import { getAllProjects } from '@/lib/actions';
import { cookies } from 'next/headers';

require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

// update
const mockCookies = {
	get: jest.fn(name => ({ value: 'mock-cookie-value' })),
	set: jest.fn(),
	remove: jest.fn(),
};

/*
 *Mock the next/headers module, which is utilizied within the supabase client (SERVER) to associate and retrieve cookies.
 */
jest.mock('next/headers', () => ({
	cookies: () => mockCookies,
}));

describe('FilteredProjects', () => {
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

	it('renders projects with default filters', async () => {
		const projects: IProjects[] = [];
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
});

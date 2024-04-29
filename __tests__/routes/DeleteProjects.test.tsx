import { faker } from '@faker-js/faker';
import { deleteProject } from '../../src/lib/actions/client';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Roles, Status } from '@/types/database.interface';

// mock the deleteProject function
jest.mock('../../src/lib/actions/client.ts', () => ({
	deleteProject: jest.fn(),
}));

require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

describe('Delete Projects', () => {
	beforeEach(() => {
		jest.resetModules(); // Most important - it clears the cache
		process.env = { ...OLD_ENV }; // Make a copy

		jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
		jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log
	});

	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment

		jest.restoreAllMocks();
	});

	it('should delete a project', async () => {
		const mockID = faker.string.uuid();
		const mockProject = {
			id: mockID,
			org_id: faker.string.uuid(),
			title: faker.lorem.sentence(),
			address: faker.location.city(),
			status: Status.Complete,
			budget: 10000,
			details: faker.lorem.paragraph(),
			due_date: faker.date.future(),
			start_date: faker.date.past(),
			completed_date: faker.date.recent(),
			created_at: faker.date.recent(),
			current_spent: 1000,
			created_by: faker.string.uuid(),
		};

		render(
			<ProjectCard
				project={mockProject}
				role={Roles.ADMIN}
			/>,
		);

		// mock the deleteProject function
		const mockDeleteProject = jest.fn().mockResolvedValue(true);
		// Assign the mock function to deleteProject
		deleteProject.mockImplementation(mockDeleteProject);

		// Calls function using await and taskId
		const deleteBtn = document.querySelectorAll('button')[1];
		deleteBtn.click();

		expect(mockDeleteProject).toHaveBeenCalledWith(mockID);

		// Expecting result to be true if successfully deletes
		expect(mockDeleteProject).toHaveBeenCalled();
	});

	it('should render the delete icon given the correct role', async () => {
		const mockID = faker.string.uuid();
		const mockProject = {
			id: mockID,
			org_id: faker.string.uuid(),
			title: faker.lorem.sentence(),
			address: faker.location.city(),
			status: Status.Complete,
			budget: 10000,
			details: faker.lorem.paragraph(),
			due_date: faker.date.future(),
			start_date: faker.date.past(),
			completed_date: faker.date.recent(),
			created_at: faker.date.recent(),
			current_spent: 1000,
			created_by: faker.string.uuid(),
		};

		render(
			<ProjectCard
				project={mockProject}
				role={Roles.ADMIN}
			/>,
		);

		const deleteBtn = document.querySelectorAll('button')[1];
		expect(deleteBtn).toBeInTheDocument();
	});

	it('should not render the delete icon given the incorrect role', async () => {
		const mockID = faker.string.uuid();
		const mockProject = {
			id: mockID,
			org_id: faker.string.uuid(),
			title: faker.lorem.sentence(),
			address: faker.location.city(),
			status: Status.Complete,
			budget: 10000,
			details: faker.lorem.paragraph(),
			due_date: faker.date.future(),
			start_date: faker.date.past(),
			completed_date: faker.date.recent(),
			created_at: faker.date.recent(),
			current_spent: 1000,
			created_by: faker.string.uuid(),
		};

		render(
			<ProjectCard
				project={mockProject}
				role={Roles.MEMBER}
			/>,
		);
		const deleteBtn = document.querySelectorAll('button')[1];
		expect(deleteBtn).toBeUndefined();
	});
});

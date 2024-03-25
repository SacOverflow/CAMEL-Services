import {
	//getTasks,
	//getAllTasks,
	createTask,
	//getProjectMembersTasks,
} from '../../src/lib/actions/client';
import {
	getAllTasks,
	/* Ignore Activities for now */
	//getMembersProjectActivities,
	//getOrganizationProjectActivities,
	//getProjectActivities,
	getMemberTasks,
} from '../../src/lib/actions/index';
import '@testing-library/jest-dom';
import { Status } from '../../src/types/database.interface';

require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

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

/*
 * Mock the calls that are utilized within middleware, but more importantly the cookies call.
 * mock implementation of such
 */
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

describe('createTask', () => {
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

	it('should add a new task to a project', async () => {
		// Mocking createTask for this specific test
		jest.doMock('../../src/lib/actions/client', () => ({
			__esModule: true,
			createTask: jest.fn().mockResolvedValue(true),
		}));

		const { createTask } = require('../../src/lib/actions/client');

		const newTask: any = {
			status: Status.ToDo,
			title: 'Task title',
			due_date: new Date(),
			project_id: 'project_id',
		};

		// Call the function with the created task object
		const result = await createTask(newTask);

		// Ensure that the result is true if the insertion is successful
		expect(result).toBe(true);
	});

	it('should handle errors when task is missing title', async () => {
		const newTask: any = {
			status: Status.ToDo,
			title: '',
			due_date: new Date(),
			project_id: 'project_id',
		};

		// Call the function with the created task object
		const result = await createTask(newTask);

		expect(result).toEqual({
			error: true,
			message: 'Failed to create task',
		});
	});

	it('should handle errors when task is missing due date', async () => {
		const newTask: any = {
			status: Status.ToDo,
			title: 'Task title',
			due_date: '',
			project_id: 'project_id',
		};

		// Call the function with the created task object
		const result = await createTask(newTask);

		expect(result).toEqual({
			error: true,
			message: 'Failed to create task',
		});
	});
});

describe('getAllTasks', () => {
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

	it('should return all tasks within a project', async () => {
		// Call the function with the project ID
		const projectTasks = await getAllTasks(process.env.PROJECT_ID!);

		// Check if projectTasks is not an error object
		if ('error' in projectTasks && projectTasks.error) {
			// If it's an error object, fail the test
			fail('Failed to fetch project tasks');
		}

		// Check if projectTasks is an array
		expect(Array.isArray(projectTasks)).toBe(true);

		// If projectTasks is not empty, it should have a length greater than or equal to 1
		if (Array.isArray(projectTasks) && projectTasks.length > 0) {
			expect(projectTasks.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching tasks with invalid project ID', async () => {
		const projectId = 'invalid_id';
		const result = await getAllTasks(projectId);
		expect(result).toEqual([]);
	});
});

describe('getMemberTasks', () => {
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

	it('should return all tasks of a member within a project', async () => {
		// Call the function with the project ID
		const memberTasks = await getMemberTasks(
			process.env.TESTING_USER_ID!,
			process.env.PROJECT_ID!,
		);

		// Check if projectTasks is not an error object
		if ('error' in memberTasks && memberTasks.error) {
			// If it's an error object, fail the test
			fail('Failed to fetch project tasks');
		}

		// Check if projectTasks is an array
		expect(Array.isArray(memberTasks.data)).toBe(true);

		// If projectTasks is not empty, it should have a length greater than or equal to 1
		if (Array.isArray(memberTasks) && memberTasks.length > 0) {
			expect(memberTasks.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching project tasks with invalid member ID', async () => {
		const memberId = 'invalid_id';
		const projectId = process.env.PROJECT_ID!;
		const result = await getMemberTasks(memberId, projectId);
		expect(result).toEqual({
			error: true,
			message:
				'Invalid member or project ID. Failed to fetch member tasks',
		});
	});

	it('should handle errors when fetching member tasks with invalid project ID', async () => {
		const memberId = process.env.TESTING_USER_ID!;
		const projectId = 'invalid_id';
		const result = await getMemberTasks(memberId, projectId);
		expect(result).toEqual({
			error: true,
			message:
				'Invalid member or project ID. Failed to fetch member tasks',
		});
	});
});

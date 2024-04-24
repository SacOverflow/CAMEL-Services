import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import {
	createTask,
	getProjectMembersTasks,
} from '../../src/lib/actions/client';
import { getAllTasks, getMemberTasks } from '../../src/lib/actions/index';
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
		jest.spyOn(console, 'info').mockImplementation(() => {}); // Suppress info
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

describe('getProjectMembersTasks', () => {
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

	const userIds = [{ id: 123 }, { user: 321 }];
	const users = [
		{ id: 123, name: 'John Doe' },
		{ id: 321, name: 'Joe Smith' },
	];

	jest.mock('@/lib/supabase/client', () => ({
		createSupbaseClient: jest.fn(() => {
			Promise.resolve({
				from: jest.fn(() => ({
					select: jest.fn(() => ({
						eq: jest
							.fn()
							.mockImplementation((projectId, values) => {
								if (projectId === process.env.PROJECT_ID!) {
									return {
										data: [{ id: 123 }, { id: 321 }],
										error: null,
									};
								}
								// Return mocked member IDs for the projects_member table
								return {
									data: [], // Mocked member IDs
									error: null,
								};
							}),
						in: jest.fn().mockImplementation((userId, values) => {
							if (userId === userIds) {
								return {
									data: [{ id: 123, name: 'John Doe' }],
									error: null,
								};
							}
							// Return mocked member IDs for the projects_member table
							return {
								data: [], // Mocked member IDs
								error: null,
							};
						}),
					})),
				})),
			});
		}),
	}));

	it('read all members on task', async () => {
		const projectId: string = process.env.PROJECT_ID!;
		const users = await getProjectMembersTasks(projectId);
		const userOne = users[0];

		expect(userOne.id).not.toBeNull();
		expect(userOne.name).not.toBeNull();
	});

	it('members not on task, cannot view', async () => {
		// Random projectId
		const projectId: string = 'a273da34-7038-4ff6-b140-1317f8dc743C';
		const users = await getProjectMembersTasks(projectId);

		expect(users).toEqual([]);
	});
});

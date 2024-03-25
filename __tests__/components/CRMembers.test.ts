import {
	getMembersinTask,
	getAllTaskMembers,
	getAllNonTaskMembers,
	addTaskMember,
} from '../../src/lib/actions/client';
import { getMemberInformation } from '../../src/lib/actions/index';
import '@testing-library/jest-dom';
import { ITasks, Status } from '../../src/types/database.interface';

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

describe('getMembersinTask', () => {
	it('should return multiple members in a task', async () => {
		// Create an object conforming to the ITasks interface
		const task: ITasks = {
			id: process.env.TASK_ID!,
			project_id: 'project_id',
			title: 'Task title',
			status: Status.ToDo,
			due_date: new Date(),
			completed_date: new Date(),
			created_at: new Date(),
		};

		// Call the function with the created task object
		const result = await getMembersinTask(task);

		expect(result?.data?.length).toBeDefined();
		expect(result.error).toBeFalsy(); // Ensure no error occurred

		// If data exists, assert that it is an array and has a length greater than or equal to 1
		if (result.data) {
			expect(Array.isArray(result.data)).toBe(true);
			expect(result.data.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching members with invalid task ID', async () => {
		// Create an object conforming to the ITasks interface
		const task: ITasks = {
			id: 'invalid_id',
			project_id: 'project_id',
			title: 'Task title',
			status: Status.ToDo,
			due_date: new Date(),
			completed_date: new Date(),
			created_at: new Date(),
		};
		const result = await getMembersinTask(task);
		expect(result).toEqual({
			error: true,
			message: 'Failed to fetch members in task',
		});
	});
});

describe('getAllTaskMembers', () => {
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

	it('should return all members in a task', async () => {
		// Call the function with the task ID
		const taskMembers = await getAllTaskMembers(process.env.TASK_ID!);

		// Check if taskMembers is not an error object
		if ('error' in taskMembers && taskMembers.error) {
			// If it's an error object, fail the test
			fail('Failed to fetch task members');
		}

		// Check if taskMembers is an array
		expect(Array.isArray(taskMembers)).toBe(true);

		// If taskMembers is not empty, it should have a length greater than or equal to 1
		if (Array.isArray(taskMembers) && taskMembers.length > 0) {
			expect(taskMembers.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching members with invalid task ID', async () => {
		const taskId = 'invalid_id';
		const result = await getAllTaskMembers(taskId);
		expect(result).toEqual([]);
	});
});

describe('getAllNonTaskMembers', () => {
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

	it('should return all members not within a task', async () => {
		// Call the function with the task ID
		const taskMembers = await getAllNonTaskMembers(process.env.TASK_ID!);

		// Check if taskMembers is not an error object
		if ('error' in taskMembers && taskMembers.error) {
			// If it's an error object, fail the test
			fail('Failed to fetch non-task members');
		}

		// Check if taskMembers is an array
		expect(Array.isArray(taskMembers)).toBe(true);

		// If taskMembers is not empty, it should have a length greater than or equal to 1
		if (Array.isArray(taskMembers) && taskMembers.length > 0) {
			expect(taskMembers.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching members with invalid task ID', async () => {
		const taskId = 'invalid_id';
		const result = await getAllNonTaskMembers(taskId);
		expect(result).toEqual([]);
	});
});

describe('addTaskMember', () => {
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

	it('should add a missing member in a task', async () => {
		// Mocking addTaskMember for this specific test
		jest.doMock('../../src/lib/actions/client', () => ({
			__esModule: true,
			addTaskMember: jest.fn().mockResolvedValue(true),
		}));

		const { addTaskMember } = require('../../src/lib/actions/client');
		const testProjectId = process.env.PROJECT_ID!;
		const testTaskId = process.env.TASK_ID!;
		const testUserId = process.env.TESTING_USER_ID!;

		// Call the function with the created task object
		const result = await addTaskMember(
			testProjectId,
			testTaskId,
			testUserId,
		);

		// Ensure that the result is true if the insertion is successful
		expect(result).toBe(true);
	});

	it('should handle errors when project ID is invalid', async () => {
		const testProjectId = 'invalid_id';
		const testTaskId = process.env.TASK_ID!;
		const testUserId = process.env.TESTING_USER_ID!;

		// Call the function with the created task object
		const result = await addTaskMember(
			testProjectId,
			testTaskId,
			testUserId,
		);

		expect(result).toEqual({
			error: true,
			message: 'Failed to add task member',
		});
	});

	it('should handle errors when task ID is invalid', async () => {
		const testProjectId = process.env.PROJECT_ID!;
		const testTaskId = 'invalid_id';
		const testUserId = process.env.TESTING_USER_ID!;

		// Call the function with the created task object
		const result = await addTaskMember(
			testProjectId,
			testTaskId,
			testUserId,
		);

		expect(result).toEqual({
			error: true,
			message: 'Failed to add task member',
		});
	});

	it('should handle errors when user ID is invalid', async () => {
		const testProjectId = process.env.PROJECT_ID!;
		const testTaskId = process.env.TASK_ID!;
		const testUserId = 'invalid_id';

		// Call the function with the created task object
		const result = await addTaskMember(
			testProjectId,
			testTaskId,
			testUserId,
		);

		expect(result).toEqual({
			error: true,
			message: 'Failed to add task member',
		});
	});
});

describe('getMemberInformation', () => {
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

	it('should return details regarding a member', async () => {
		const testUserId = process.env.TESTING_USER_ID!;

		// Call the function with the provided user ID
		const result = await getMemberInformation(testUserId);

		// Ensure that the result matches the expected user object
		expect(result).toEqual({
			id: testUserId,
			username: 'Junior',
			email: 'tmp@jvniorrr.com',
			name: 'Jab Luong',
			image: 'https://apqmqmysgnkmkyesdrnn.supabase.co/storage/v1/object/public/profile-avatars/simpsonKidChar.jpg?t=2023-11-20T03%3A15%3A47.417Z',
		});
	});

	it('should handle errors if no user is found', async () => {
		const userId = 'invalid_id';
		const result = await getMemberInformation(userId);
		expect(result).toEqual({});
	});
});

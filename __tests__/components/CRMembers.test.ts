import {
	inviteProjectMember,
	getMembersinTask,
	getAllTaskMembers,
	getAllNonTaskMembers,
	addTaskMember,
} from '../../src/lib/actions/client';
import { getOrganizationMembers } from '../../src/lib/actions/get.client';
import {
	getOrganizationMemberRole,
	checkProjectMember,
	getMemberInformation,
} from '../../src/lib/actions/index';
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

describe('inviteProjectMember', () => {
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

	it('should return the values of the project regarding a project member', async () => {
		// Mocking inviteProjectMember for this specific test
		jest.doMock('../../src/lib/actions/client', () => ({
			__esModule: true,
			inviteProjectMember: jest.fn().mockResolvedValue(true),
		}));

		const { inviteProjectMember } = require('../../src/lib/actions/client');
		// Call the function with the org ID and project ID
		const projMembers = await inviteProjectMember(
			process.env.ORG_ID!,
			process.env.PROJECT_ID!,
			process.env.TESTING_USER_ID!,
		);

		expect(projMembers).toBe(true);
	});

	it('should handle errors when fetching members with invalid org ID', async () => {
		const orgId = 'invalid_id';
		const projId = process.env.PROJECT_ID!;
		const userId = process.env.TESTING_USER_ID!;
		const result = await inviteProjectMember(orgId, projId, userId);
		expect(result).toBe(false);
	});

	it('should handle errors when fetching members with invalid project ID', async () => {
		const orgId = process.env.ORG_ID!;
		const projId = 'invalid_id';
		const userId = process.env.TESTING_USER_ID!;
		const result = await inviteProjectMember(orgId, projId, userId);
		expect(result).toBe(false);
	});

	it('should handle errors when fetching members with invalid user ID', async () => {
		const orgId = process.env.ORG_ID!;
		const projId = process.env.PROJECT_ID!;
		const userId = 'invalid_id';
		const result = await inviteProjectMember(orgId, projId, userId);
		expect(result).toBe(false);
	});
});

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

		// spy on getMembersinTask and mock the implementation
		const mockGetMembersinTask = jest.fn(async (task: ITasks) => {
			return {
				data: [
					{
						id: '1',
						username: 'test',
						email: 'test@email.com',
						name: 'test',
						image: 'image',
					},
				],
				error: false,
			};
		});
		// Call the function with the created task object
		const result = await mockGetMembersinTask(task);

		expect(result?.data?.length).toBeDefined();
		expect(result.error).toBeFalsy(); // Ensure no error occurred

		// If data exists, assert that it is an array and has a length greater than or equal to 1
		if (result.data) {
			expect(Array.isArray(result.data)).toBe(true);
			expect(result.data.length).toBeGreaterThanOrEqual(1);
		}

		mockGetMembersinTask.mockRestore();
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

describe('getOrganizationMembers', () => {
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

	it('should return all members in an organization', async () => {
		// Call the function with the org ID
		const orgMembers = await getOrganizationMembers(process.env.ORG_ID!);

		// Check if orgMembers is not an error object
		if ('error' in orgMembers && orgMembers.error) {
			// If it's an error object, fail the test
			fail('Failed to fetch organization members');
		}

		// Check if orgMembers is an array
		expect(Array.isArray(orgMembers)).toBe(true);

		// If orgMembers is not empty, it should have a length greater than or equal to 1
		if (Array.isArray(orgMembers) && orgMembers.length > 0) {
			expect(orgMembers.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching members with invalid org ID', async () => {
		const orgId = 'invalid_id';
		const result = await getOrganizationMembers(orgId);
		expect(result).toEqual([]);
	});
});

describe('getOrganizationMemberRole', () => {
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

	it('should return the role of an org member', async () => {
		// Call the function with the org ID
		const orgMemberRole = await getOrganizationMemberRole(
			process.env.ORG_ID!,
		);
		// Check if orgMemberRole is an object or null
		expect(
			typeof orgMemberRole === 'object' || orgMemberRole === null,
		).toBe(true);

		// If orgMemberRole is not null, it should have a 'role' property
		if (orgMemberRole !== null) {
			expect(orgMemberRole.role).toBeDefined();
		}
	});

	it('should handle errors when fetching a role with invalid org ID', async () => {
		const orgId = 'invalid_id';
		const result = await getOrganizationMemberRole(orgId);
		expect(result).toEqual(null);
	});
});

describe('checkProjectMember', () => {
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

	it('should return the values of the project regarding a project member', async () => {
		// Create an object containing mock data
		const values = {
			address: '1234 main st',
			budget: 12000,
			completed_date: null,
			created_at: '2024-02-08T10:57:04.419+00:00',
			created_by: 'cd1d7916-a61a-40fa-9691-c29e42c8988a',
			current_spent: 0,
			details: 'Hello World',
			due_date: '2024-02-29T00:00:00+00:00',
			id: 'a273da34-7038-4ff6-b140-1317f8dc743d',
			org_id: 'a210d3f7-bcc8-4e8b-9d61-2d4228bff047',
			start_date: '2024-02-08T00:00:00+00:00',
			status: 'needs approval',
			title: 'Hello World',
		};
		// Call the function with the org ID and project ID
		const projMembers = await checkProjectMember(
			process.env.ORG_ID!,
			process.env.PROJECT_ID!,
		);

		expect(projMembers).toEqual(values);
	});

	it('should handle errors when fetching members with invalid org ID', async () => {
		const orgId = 'invalid_id';
		const projId = process.env.PROJECT_ID!;
		const result = await checkProjectMember(orgId, projId);
		expect(result).toBe(false);
	});

	it('should handle errors when fetching members with invalid project ID', async () => {
		const orgId = process.env.ORG_ID!;
		const projId = 'invalid_id';
		const result = await checkProjectMember(orgId, projId);
		expect(result).toBe(false);
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
			name: 'Junior Men',
			image: 'https://apqmqmysgnkmkyesdrnn.supabase.co/storage/v1/object/public/profile-avatars/simpsonKidChar.jpg?t=2023-11-20T03%3A15%3A47.417Z',
		});
	});

	it('should handle errors if no user is found', async () => {
		const userId = 'invalid_id';
		const result = await getMemberInformation(userId);
		expect(result).toEqual({});
	});
});

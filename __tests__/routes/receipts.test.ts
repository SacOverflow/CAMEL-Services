import {
	getAllReceiptsByProject,
	getAllReceiptsByOrganization,
	getAllReceiptsByUserAndProject,
	getAllReceiptsByUserAndOrganization,
} from '../../src/lib/actions/client';
import '@testing-library/jest-dom';

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

describe('getAllReceiptsByProject', () => {
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

	it('should return receipts for a given project ID', async () => {
		const result = await getAllReceiptsByProject(process.env.PROJECT_ID!);

		if ('error' in result && result.error) {
			// If it's an error object, fail the test
			fail('Failed to fetch receipts');
		}

		// Check if list-like
		expect(
			typeof result === 'object' &&
				result !== null &&
				!Array.isArray(result),
		).toBe(true);

		// If not empty, it should have a length greater than or equal to 1
		if (result && Object.keys(result).length > 0) {
			expect(Object.keys(result).length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching receipts with invalid project ID', async () => {
		const projectId = 'invalid_id';
		const result = await getAllReceiptsByProject(projectId);
		expect(result).toEqual({
			error: true,
			message: 'invalid input syntax for type uuid: "invalid_id"',
		});
	});
});

describe('getAllReceiptsByOrganization', () => {
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
	it('should return receipts for a given organization ID', async () => {
		const result = await getAllReceiptsByOrganization(process.env.ORG_ID!);
		if ('error' in result && result.error) {
			// If it's an error object, fail the test
			fail('Failed to fetch receipts');
		}

		// Check if list-like
		expect(
			typeof result === 'object' &&
				result !== null &&
				!Array.isArray(result),
		).toBe(true);

		// If not empty, it should have a length greater than or equal to 1
		if (result && Object.keys(result).length > 0) {
			expect(Object.keys(result).length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching receipts for invalid organization ID', async () => {
		const organizationId = 'invalid_id';
		const result = await getAllReceiptsByOrganization(organizationId);
		expect(result).toEqual({
			error: true,
			message: 'invalid input syntax for type uuid: "invalid_id"',
		});
	});
});

describe('getAllReceiptsByUserAndProject', () => {
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
	it('should return receipts for a given user ID and project ID', async () => {
		const userId = process.env.TESTING_USER_ID!;
		const projectId = process.env.PROJECT_ID!;
		const result = await getAllReceiptsByUserAndProject(userId, projectId);

		// Check if list-like
		expect(
			typeof result === 'object' &&
				result !== null &&
				!Array.isArray(result),
		).toBe(true);

		// If not empty, it should have a length greater than or equal to 1
		if (result && Object.keys(result).length > 0) {
			expect(Object.keys(result).length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching receipts using invalid uuid', async () => {
		const userId = 'invalid_id';
		const projectId = 'invalid_id';
		const result = await getAllReceiptsByUserAndProject(userId, projectId);
		expect(result).toEqual({
			error: true,
			message: 'column receipts.user_id does not exist',
		});
	});

	it('should handle missing user ID', async () => {
		const userId = ''; // No user ID provided
		const projectId = 'project_id';
		const result = await getAllReceiptsByUserAndProject(userId, projectId);
		expect(result).toEqual({ error: true, message: 'no user Id provided' });
	});

	it('should handle missing project ID', async () => {
		const userId = 'user_id';
		const projectId = ''; // No project ID provided
		const result = await getAllReceiptsByUserAndProject(userId, projectId);
		expect(result).toEqual({
			error: true,
			message: 'no project Id provided',
		});
	});
});

describe('getAllReceiptsByUserAndOrganization', () => {
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

	it('should return receipts for a given user ID and organization ID', async () => {
		const userId = process.env.TESTING_USER_ID!;
		const orgId = process.env.ORG_ID!;
		const result = await getAllReceiptsByUserAndOrganization(userId, orgId);

		// Check if list-like
		expect(
			typeof result === 'object' &&
				result !== null &&
				!Array.isArray(result),
		).toBe(true);

		// If not empty, it should have a length greater than or equal to 1
		if (result && Object.keys(result).length > 0) {
			expect(Object.keys(result).length).toBeGreaterThanOrEqual(1);
		}
	});

	it('should handle errors when fetching receipts using invalid uuid', async () => {
		const userId = 'invalid_id';
		const orgId = 'invalid_id';
		const result = await getAllReceiptsByUserAndOrganization(userId, orgId);
		expect(result).toEqual({
			error: true,
			message: 'column receipts.user_id does not exist',
		});
	});

	it('should handle missing user ID', async () => {
		const userId = ''; // No user ID provided
		const orgId = 'organization_id';
		const result = await getAllReceiptsByUserAndOrganization(userId, orgId);
		expect(result).toEqual({ error: true, message: 'no user Id provided' });
	});

	it('should handle missing organization ID', async () => {
		const userId = 'user_id';
		const orgId = ''; // No organization ID provided
		const result = await getAllReceiptsByUserAndOrganization(userId, orgId);
		expect(result).toEqual({
			error: true,
			message: 'no project Id provided',
		});
	});
});

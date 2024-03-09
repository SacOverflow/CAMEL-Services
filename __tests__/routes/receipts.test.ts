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
		expect(result?.data?.length).toBeDefined();
		expect(result.error).toBeFalsy(); // Ensure no error occurred
		if (!result.error && result.data) {
			expect(result.data.length).toBeGreaterThanOrEqual(1); // Check if the correct number of receipts is returned
		}
	});

	// it('should sort receipts in descending order based on creation date', async () => {
	// 	const projectId = 'project_id';
	// 	const result = await getAllReceiptsByProject(projectId);
	// 	if (!result.error && result.receipts) {
	// 		expect(result.receipts).toEqual([
	// 			{
	// 				id: '1',
	// 				proj_id: 'proj1',
	// 				created_at: '2024-03-07T12:00:00Z',
	// 			},
	// 			{
	// 				id: '2',
	// 				proj_id: 'proj2',
	// 				created_at: '2024-03-06T12:00:00Z',
	// 			},
	// 			// Ensure receipts are sorted correctly based on creation date
	// 		]);
	// 	}
	// });

	it('should handle errors when fetching receipts for non orgs', async () => {
		const projectId = 'invalid_id';
		const result = await getAllReceiptsByProject(projectId);
		expect(result).toEqual({
			error: true,
			message: 'Failed to fetch receipts',
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
		expect(result.data).toBeDefined();
		expect(result.error).toBeFalsy(); // Ensure no error occurred
		if (!result.error && result.data) {
			expect(result.data.length).toBeGreaterThanOrEqual(1); // Check if the correct number of receipts is returned
		}
	});

	it('should handle errors when fetching receipts for invalid organization ID', async () => {
		const organizationId = 'organization_id';
		const result = await getAllReceiptsByOrganization(organizationId);
		expect(result).toEqual({
			error: true,
			message: 'Failed to fetch receipts',
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
		expect(result).toBeDefined();
		expect(result.error).toBeFalsy(); // Ensure no error occurred
		if (!result.error && result.receipts) {
			expect(result.receipts).toHaveLength(2); // Check if the correct number of receipts is returned
		}
	});

	it('should handle errors when fetching receipts using invalid uuid', async () => {
		const userId = 'invalid_id';
		const projectId = 'invalid_id';
		const result = await getAllReceiptsByUserAndProject(userId, projectId);
		expect(result).toEqual({
			error: true,
			message: 'Failed to fetch receipts',
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
		// console.debug('result: ', result);
		expect(result).toBeDefined();
		expect(result.error).toBeFalsy(); // Ensure no error occurred
		if (!result.error && result.receipts) {
			expect(result.receipts.length).toBeGreaterThanOrEqual(1); // Check if the correct number of receipts is returned
		}
	});

	// it('should sort receipts in descending order based on creation date', async () => {
	// 	const userId = 'user_id';
	// 	const orgId = 'organization_id';
	// 	const result = await getAllReceiptsByUserAndOrganization(userId, orgId);
	// 	if (!result.error && result.receipts) {
	// 		expect(result.receipts).toEqual([
	// 			{
	// 				id: '1',
	// 				user_id: 'user_id',
	// 				org_id: 'org1',
	// 				created_at: '2024-03-07T12:00:00Z',
	// 			},
	// 			{
	// 				id: '2',
	// 				user_id: 'user_id',
	// 				org_id: 'org2',
	// 				created_at: '2024-03-06T12:00:00Z',
	// 			},
	// 			// Ensure receipts are sorted correctly based on creation date
	// 		]);
	// 	}
	// });

	it('should handle errors when fetching receipts', async () => {
		const userId = 'user_id';
		const orgId = 'organization_id';
		const result = await getAllReceiptsByUserAndOrganization(userId, orgId);
		expect(result).toEqual({
			error: true,
			message: 'Failed to fetch receipts',
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
			message: 'no organization Id provided',
		});
	});
});

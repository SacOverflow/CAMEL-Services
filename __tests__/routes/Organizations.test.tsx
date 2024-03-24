import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { getAllNonProjectMembers } from '@/lib/actions/get.client';

require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

// TEST; Idea for implementing tests for the Home component
describe('Retrieving members from organization or project', () => {
	// setup the env variables for testing

	beforeEach(() => {
		jest.resetModules(); // Most important - it clears the cache
		process.env = { ...OLD_ENV }; // Make a copy
	});

	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
		jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log
	});
	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment
	});

	// test getting all non project members
	it('should get all non project members', async () => {
		const org_id = OLD_ENV.ORG_ID!;
		const project_id = OLD_ENV.PROJECT_ID!;
		const members = await getAllNonProjectMembers(org_id, project_id);

		// Correct way to expect members array to have a length greater than 0
		expect(members.length).toBeGreaterThan(0);
	});

	it('should retrieve an empty array of members or error', async () => {
		const org_id = 'org_123';
		const project_id = 'project_123';
		const members = await getAllNonProjectMembers(org_id, project_id);

		// Check if members is an array and assert its length
		if (Array.isArray(members)) {
			expect(members.length).toBe(0);
		} else if (typeof members === 'object' && members.code === '22P02') {
			expect(members.message).toContain(
				'invalid input syntax for type uuid',
			);
		}
	});
});

// import testing function calls
import { getAllNonProjectMembers, getProjectMembers } from '@/lib/actions';
import '@testing-library/jest-dom';

// load in the environment variables specicifically those for testing...
require('dotenv').config({ path: 'test.env' });
// have to some reason save the old environment vars
const OLD_ENV = process.env;

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

interface NonProjectMembersResp {
	user_id: string;
	email: string;
	username: string;
	name: string;
	image: string;
}

describe('members retrieval testing', () => {
	// before each test reset the modules and set the environment variables
	beforeEach(() => {
		jest.resetModules(); // Most important - it clears the cache
		process.env = { ...OLD_ENV }; // Make a copy
	});

	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error

		// FIXME: supress console.warn for now
		jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console.warn
	});

	// after the tests are all done, restore the environment variables
	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment
	});
	const org_id = OLD_ENV.ORG_ID!;
	const project_id = OLD_ENV.PROJECT_ID!;

	test('retrieving all non project members', async () => {
		const resp: any = await getAllNonProjectMembers(org_id, project_id);

		// test response and assure matching the interface type
		expect(resp).toEqual(
			expect.arrayContaining([
				expect.objectContaining<NonProjectMembersResp>({
					user_id: expect.any(String),
					email: expect.any(String),
					username: expect.any(String),
					name: expect.any(String),
					image: expect.any(String),
				}),
			]),
		);
	});

	test('retrieving all project members', async () => {
		// test response and assure matching the interface type
		const resp: any = await getProjectMembers(org_id, project_id);

		// COMMENT: bare bones test for now
		expect(resp).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					email: expect.any(String),
					id: expect.any(String),
					image: expect.any(String),
					name: expect.any(String),
					role: expect.any(String),
					username: expect.any(String),
				}),
			]),
		);
	});
});

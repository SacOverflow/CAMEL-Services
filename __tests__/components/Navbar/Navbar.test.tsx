import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Navbar from '@/components/Navbar/Navbar';
import { act } from 'react-dom/test-utils';
import { faker } from '@faker-js/faker';
// import { getLangPrefOfUser } from '@/lib/actions';

require('dotenv').config({ path: 'test.env' });
// have to some reason save the old environment vars
const OLD_ENV = process.env;

jest.mock('@/lib/supabase/client', () => ({
	createSupbaseClient: jest.fn().mockResolvedValue({
		auth: {
			getSession: jest.fn().mockResolvedValue(true), // tbh this isnt needed
			getUser: jest.fn().mockResolvedValue({
				data: {
					user: {
						id: process.env.TESTING_USER_ID,
					},
				},
				error: null,
			}),
		},
		from: jest.fn(() => ({
			select: jest.fn(() => ({
				eq: jest.fn(() => ({
					single: jest.fn().mockResolvedValue({
						data: { id: process.env.TESTING_USER_ID },
						error: null,
					}),
				})),
			})),
		})),
	}),
}));
describe('Navbar authorized user tests', () => {
	jest.mock('next/router', () => ({
		useRouter() {
			return {
				route: '/',
				pathname: '/',
				query: '',
				asPath: '/',
			};
		},
	}));

	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'info').mockImplementation(() => {});
	});

	beforeEach(() => {
		jest.resetModules(); // Most important - it clears the cache
		process.env = { ...OLD_ENV }; // Make a copy
	});
	afterEach(() => {
		// Clear all mocks if any other tests depend on the real implementations
		jest.clearAllMocks();
	});

	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment
		jest.restoreAllMocks();
	});

	const user_id = process.env.TESTING_USER_ID!;

	it('navbar displays search input box', async () => {
		// mock supabase client & get user
		jest.mock('@/lib/supabase/client', () => {
			return {
				getLangPrefOfUser: jest.fn().mockResolvedValue('eng'),
				supabase: jest.fn().mockResolvedValue({
					auth: {
						getUser: jest.fn().mockResolvedValue({
							data: { user: { id: user_id } },
						}),
					},
				}),
			};
		});

		render(
			<Navbar
				session={{
					email: faker.internet.email(),
					username: faker.internet.userName(),
					name: faker.person.fullName(),
					id: user_id,
					image: '/images/hashemtmp.jpeg',
				}}
			/>,
		);
		// });

		// should render a noti bell

		const searchInput = screen.getByPlaceholderText(
			'Search something here...',
		);
		console.log('search input', searchInput);
		expect(searchInput).toBeInTheDocument();
	});
});
describe('Navbar tests: non-authorized users & content', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'info').mockImplementation(() => {});
	});

	afterAll(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('navbar displays the camel.svg image for logo', async () => {
		render(<Navbar session={undefined} />);

		// should render the logo image
		const logo = screen.getByAltText('CAMEL Logo');
		expect(logo).toBeInTheDocument();
	});
	it('navbar renders a login button that redirects', async () => {
		// mock our window implementation
		// https://stackoverflow.com/a/54021633/11217401
		window = Object.create(window);
		const url = 'http://localhost';
		Object.defineProperty(window, 'location', {
			value: {
				href: url,
			},
			writable: true, // possibility to override
		});

		await act(async () => {
			render(<Navbar session={undefined} />);
		});

		const loginButton = screen.getByRole('button', {
			name: /Login/i,
		});

		expect(loginButton).toContainHTML('Login');

		// utilizing the onClick functionality to redirect
		fireEvent.click(loginButton);
		await waitFor(() => {
			expect(window.location.href).toBe('/login');
		});
	});

	it('navbar renders a signup button that redirects', async () => {
		// mock our window implementation
		// https://stackoverflow.com/a/54021633/11217401
		window = Object.create(window);
		const url = 'http://localhost';
		Object.defineProperty(window, 'location', {
			value: {
				href: url,
			},
			writable: true, // possibility to override
		});

		await act(async () => {
			render(<Navbar session={undefined} />);
		});

		const signupButtons = screen.getAllByRole('button', {
			name: /Sign Up/i,
		});

		const signupButton = signupButtons[0];

		expect(signupButton).toContainHTML('Sign Up');

		// utilizing the onClick functionality to redirect
		fireEvent.click(signupButton);
		await waitFor(() => {
			expect(window.location.href).toBe('/signup');
		});
	});
});

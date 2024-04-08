import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Navbar from '@/components/Navbar/Navbar';
import { act } from 'react-dom/test-utils';

require('dotenv').config({ path: 'test.env' });
// have to some reason save the old environment vars
const OLD_ENV = process.env;

describe('Navbar tests: non-authorized users & content', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
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

describe('Navbar authorized user tests', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	beforeEach(() => {
		jest.resetModules(); // Most important - it clears the cache
		process.env = { ...OLD_ENV }; // Make a copy
	});

	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment
		jest.restoreAllMocks();
	});

	const user_id = process.env.TESTING_USER_ID;

	it('navbar displays search input box', async () => {
		// await act(async () => {
		render(
			<Navbar
				session={{
					user: {
						email: 'zenunur@ciere.by',
						username: 'zenunur',
						name: 'Zenunur',
						id: user_id,
						image: '/images/hashemtmp.jpeg',
					},
				}}
			/>,
		);
		// });

		// should render a noti bell

		const searchInput = screen.getByPlaceholderText(
			'Search something here...',
		);
		expect(searchInput).toBeInTheDocument();
	});

	it('navbar renders a notification bell', async () => {
		await act(async () => {
			render(
				<Navbar
					session={{
						user: {
							email: 'zenunur@ciere.by',
							username: 'zenunur',
							name: 'Zenunur',
							id: user_id,
							image: '/images/hashemtmp.jpeg',
						},
					}}
				/>,
			);
		});

		// should render a noti bell

		const notificationBell = screen.getByRole('button', {
			name: /company logo/i,
		});

		expect(notificationBell).toBeInTheDocument();
	});
});

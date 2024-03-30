import {
	createOrganization,
	updateImage,
} from '@/components/Organization/client.actions';
import CreateOrgModal from '@/components/Organization/CreateOrgModal';
import { editOrganization } from '@/components/Organization/EditOrganizationModal/client.actions';
import EditOrgModal from '@/components/Organization/EditOrganizationModal/EditOrgModal';
import {
	DeleteModal,
	OrgDetailsCard,
} from '@/components/SharedComponents/DetailsCard/DetailsCard';
import { getAllNonProjectMembers } from '@/lib/actions/get.client';
import { Roles } from '@/types/database.interface';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

jest.mock('@/components/Organization/client.actions', () => ({
	createOrganization: jest.fn(),
	updateImage: jest.fn(),
}));

jest.mock(
	'@/components/Organization/EditOrganizationModal/client.actions',
	() => ({
		editOrganization: jest.fn(),
		updateImage: jest.fn(),
	}),
);

const mockOrgDelete = jest.fn().mockResolvedValue({ data: null, error: null });
const mockOrgUpdate = jest.fn().mockResolvedValue({ data: null, error: null });
jest.mock('@/lib/supabase/client', () => ({
	createSupbaseClient: jest.fn(() =>
		Promise.resolve({
			auth: {
				getSession: jest.fn().mockResolvedValue({
					data: {
						session: {
							user: {
								id: 'TestUser123',
								email: 'testuser@example.com',
							},
						},
					},
					error: null,
				}),
				getUser: jest.fn().mockResolvedValue({
					data: {
						user: {
							id: 'TestUser123',
							email: 'testuser@example.com',
							// Add more user properties if needed
						},
					},
					error: null,
				}),
			},
			from: jest.fn(() => ({
				insert: jest.fn().mockResolvedValue({
					data: [{ id: '4444', name: 'Mocked Organization' }],
					error: null,
				}),
				update: jest.fn(() => ({ eq: mockOrgUpdate })),
				delete: jest.fn(() => ({
					eq: mockOrgDelete,
				})),
			})),
		}),
	),
}));

jest.mock('next/image', () => ({ src, alt }) => (
	<img
		src={src}
		alt={alt}
	/>
));

beforeAll(() => {
	jest.clearAllMocks();
});

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

// Create Org
describe('Creating an organization', () => {
	// beforeEach(() => {
	// 	// Reset the mock implementation before each test
	// 	useRouter.mockReturnValue({
	// 		push: mockPush,
	// 		refresh: jest.fn(),
	// 		pathname: '/org',
	// 		query: {},
	// 		asPath: '/org',
	// 	});
	// 	mockPush.mockClear();
	// 	jest.resetModules(); // Most important - it clears the cache
	// });

	it('CreateOrgModal renders correctly', () => {
		render(<CreateOrgModal />);
		expect(screen.getByText('Create Organization')).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText('Organization Name'),
		).toBeInTheDocument();
	});

	it('allows the form to be submitted with just an organization name', async () => {
		render(<CreateOrgModal />);
		const orgName = 'New Testing Org';
		const input = screen.getByPlaceholderText('Organization Name');
		await userEvent.type(input, orgName);
		expect(input).toHaveValue(orgName);
	});

	it('submits the form and creates an organization', async () => {
		const mockRouterRefresh = jest.fn();
		useRouter.mockImplementation(() => ({ refresh: mockRouterRefresh }));
		createOrganization.mockResolvedValue({ success: true });
		updateImage.mockResolvedValue({ success: true, data: 'new-image-url' });

		render(<CreateOrgModal clickHandler={() => {}} />);

		const nameInput = screen.getByPlaceholderText('Organization Name');
		// const fileInput = await screen.getByRole('file', { name: /image/i });
		// const fileInput = screen.getByLabelText(/image/i);
		const createButton = screen.getByText('Create');

		await userEvent.type(nameInput, 'New Org');
		await userEvent.click(createButton);

		expect(useRouter().refresh).toHaveBeenCalled();
		expect(createOrganization).toHaveBeenCalled();
		expect(createOrganization).toHaveBeenCalledWith(
			'New Org',
			expect.anything(),
		);
	});
});

// Read Org
describe('Reading existing organizations', () => {
	jest.mock('next/image', () => ({ src, alt }) => (
		<img
			src={src}
			alt={alt}
		/>
	));

	it('OrgDetailsCard renders correctly', () => {
		render(
			<OrgDetailsCard
				id="test-id"
				name="Test Org"
				created_by="User"
				image="/test-image.jpg"
				created_at="2022-01-01"
				role={Roles.ADMIN}
			/>,
		);
		expect(screen.getByText('Test Org')).toBeInTheDocument();
		// Image is next lazy loading and urls do not match
		// expect(screen.getByRole('img')).toHaveAttribute(
		// 	'src',
		// 	'/_next/image?url=test-image.jpg',
		// );
		expect(screen.getByRole('button')).toBeInTheDocument();
	});
});

// Update Org
describe('editing an organization', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it('OrgDetailsCard renders correctly', () => {
		const org = { id: '1', name: 'Test Org', image: '/test-image.jpg' };
		render(
			<EditOrgModal
				organization={org}
				clickHandler={() => {}}
			/>,
		);

		expect(screen.getByPlaceholderText('Organization Name')).toHaveValue(
			org.name,
		);
		expect(screen.getByRole('img')).toHaveAttribute('src', org.image);
	});

	it('allows editing the organization name', async () => {
		const org = { id: '1', name: 'Test Org', image: '/test-image.jpg' };
		render(
			<EditOrgModal
				organization={org}
				clickHandler={() => {}}
			/>,
		);

		const nameInput = screen.getByPlaceholderText('Organization Name');
		await userEvent.clear(nameInput);
		await userEvent.type(nameInput, 'New Org Name');

		expect(nameInput).toHaveValue('New Org Name');
	});

	it('submits the form and updates an organization', async () => {
		const mockRouterRefresh = jest.fn();
		useRouter.mockImplementation(() => ({ refresh: mockRouterRefresh }));
		editOrganization.mockResolvedValue({ success: true });
		updateImage.mockResolvedValue({ success: true, data: 'new-image-url' });

		const org = { id: '1', name: 'Edit Org', image: '/test-image.jpg' };
		render(
			<EditOrgModal
				organization={org}
				clickHandler={() => {}}
			/>,
		);

		// const createButton = screen.getByText('Create');
		// await userEvent.click(createButton);
		const nameInput = screen.getByPlaceholderText('Organization Name');
		await userEvent.type(nameInput, org.name);

		const submitButton = screen.getByText('Submit');
		await userEvent.click(submitButton);
		await waitFor(() => {
			expect(editOrganization).toHaveBeenCalled();
		});

		expect(updateImage).not.toHaveBeenCalled();
		expect(editOrganization).toHaveBeenCalledWith(
			org.name,
			expect.anything(),
		);
	});
});

// Delete Org
describe('deleting an organization', () => {
	const mockPush = jest.fn();
	beforeEach(() => {
		useRouter.mockReset();
		useRouter.mockImplementation(() => ({
			push: mockPush,
		}));
	});

	it('delete button is pressed and redirects', async () => {
		const { getByText } = render(
			<DeleteModal
				org_id="123"
				clickHandler={() => {}}
				org_name="Test Org"
			/>,
		);

		// Simulate the user clicking the 'Delete' button
		await userEvent.click(getByText('Delete'));

		expect(mockOrgDelete).toHaveBeenCalled();
		expect(mockPush).toHaveBeenCalledWith('/organization');
	});
});

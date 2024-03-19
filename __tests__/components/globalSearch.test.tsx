import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import SearchBar from '@/components/Navbar/Searchbar';
import { getGlobalSearchData } from '@/lib/actions/get.client';
import { IGlobalResults } from '@/types/database.interface.misc';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));
const mockPush = jest.fn();

// TEST; test the global search component
describe('Global Search component', () => {
	beforeEach(() => {
		// Reset the mock implementation before each test; needed for the last 2 tests
		useRouter.mockReturnValue({
			push: mockPush,
			refresh: jest.fn(),
			pathname: '/',
			query: {},
			asPath: '/',
		});
		mockPush.mockClear();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	it('global search renders an input element(s)', () => {
		render(<SearchBar />);

		// should render input element of type text
		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('type', 'text');
		expect(input).toHaveAttribute(
			'placeholder',
			'Search something here...',
		);
	});

	it('global search functionality; searching with placeholder values', async () => {
		const { data, error } = await getGlobalSearchData('a');

		// should return an array of objects
		expect(data).toEqual(
			expect.arrayContaining([
				expect.objectContaining<IGlobalResults>({
					result_id: expect.any(String),
					result_type: expect.any(String),
					result_name: expect.any(String),
					result_image: expect.any(null || String),
					matched_column: expect.any(String),
					organization_name: expect.any(String),
					project_id: expect.any(null || String),
					project_name: expect.any(null || String),
				}),
			]),
		);
	});

	it('global search functionality; searching with empty string', async () => {
		const randText = '#CE3375';
		const { data, error } = await getGlobalSearchData(randText);

		// should return an empty array
		expect(data).toEqual([]);
	});

	it('global search input renders search results container', async () => {
		render(<SearchBar />);

		// should render input element of type text
		const input = screen.getByRole('textbox');
		const inputText = 'a';
		fireEvent.change(input, { target: { value: inputText } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		await waitFor(() => {
			const buttons = document.getElementsByClassName('search-result');
			expect(buttons).toHaveLength(5); // top 5 results are always rendered
		});
	});

	it('global search input renders no results for a invalid input', async () => {
		render(<SearchBar />);

		// should render input element of type text
		const input = screen.getByRole('textbox');

		const inputText = '#CE3375';
		fireEvent.change(input, { target: { value: inputText } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		await waitFor(() => {
			const emptyResults = document.getElementsByClassName(
				'search-results-empty',
			);
			expect(document.body).toHaveTextContent('No results found');
		});
	});
});

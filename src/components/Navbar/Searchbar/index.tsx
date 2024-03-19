'use client';

import { setCookie } from '@/lib/actions/client';
// CSS imports
import './Searchbar.css';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getGlobalSearchData } from '@/lib/actions/get.client';
import { IGlobalResults } from '@/types/database.interface.misc';

const SearchBar = (props: { className?: string }) => {
	const [search, setSearch] = useState('');
	const [searchResults, setSearchResults] = useState<IGlobalResults[]>([]);
	const [hasSearched, setHasSearched] = useState(false); // added as a flag to check if search has been done; else show no results by default

	const [isResultsVisible, setIsResultsVisible] = useState(true);

	const ref: any = useRef(null);

	// ref is used to close the search results when clicked outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsResultsVisible(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleFocus = () => {
		setIsResultsVisible(true);
	};

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') {
			return;
		}

		const { data, error } = await getGlobalSearchData(search);

		const searchResponse: IGlobalResults[] = data;

		setIsResultsVisible(true);
		setHasSearched(true);

		if (error) {
			console.error(error);
		} else {
			// data will be of type IGlobalResults; top 5 results
			const TOP_RESULTS = 5;
			setSearchResults(searchResponse.slice(0, TOP_RESULTS));
		}
	};

	const { className } = props;
	return (
		<div
			className={`${className || ''} search-bar-container`}
			ref={ref}
		>
			{/* Search Bar*/}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="currentColor"
				className="search-icon"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
				/>
			</svg>

			<input
				type="text"
				placeholder="Search something here..."
				className="search-bar"
				value={search}
				onChange={handleChange}
				onKeyDown={handleSearch}
				onFocus={handleFocus}
			/>

			{/* use ref and search results lenght */}
			{hasSearched &&
				(searchResults.length > 0
					? isResultsVisible && (
							<SearchResultsContainer
								searchResults={searchResults}
								hideResults={() => setIsResultsVisible(false)}
							/>
					  )
					: isResultsVisible && (
							<div className="search-results-container">
								<span className="search-results-empty">
									No results found
								</span>
							</div>
					  ))}
		</div>
	);
};

export default SearchBar;

const SearchResultsContainer = (props: {
	searchResults: any[];
	hideResults?: () => void;
}) => {
	const { searchResults, hideResults } = props;

	return (
		<div className="search-results-container">
			{searchResults.map((result, index) => (
				<SearchResult
					key={index}
					{...result}
					hideResults={hideResults}
				/>
			))}
		</div>
	);
};

const SearchResult = ({
	result_type,
	result_id,
	result_name,
	result_image,
	matched_column,
	organization_name,
	project_id,
	project_name,
	hideResults,
}: {
	result_type: string;
	result_id: string;
	result_name: string;
	result_image: string | null;
	matched_column: string;
	organization_name: string;
	project_id: string | null;
	project_name: string | null;
	hideResults?: () => void;
}) => {
	const router = useRouter();

	const getImageFromType = (type: string): string => {
		switch (type.toLowerCase()) {
			case 'organization':
				return result_image as string;
			case 'project':
				return '/images/assets/projects.svg';
			case 'task':
				return '/images/assets/tasks.svg';
			default:
				return '';
		}
	};

	const ImageComponent = () => {
		return (
			<Image
				src={getImageFromType(result_type)}
				alt="search-result-img"
				width={50}
				height={50}
				className="search-result-img"
			/>
		);
	};

	const BadgesComponent = () => {
		const typeTooltip = `Result Type: ${result_type}`;
		const orgTooltip = organization_name
			? `Organization: ${organization_name}`
			: '';
		const projectTooltip = project_name ? `Project: ${project_name}` : '';

		const OrganizationBadge = () => {
			return (
				<div
					className="search-result-org-badge"
					title={orgTooltip}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
						/>
					</svg>
					<div className="text-wrapper">
						<span>{organization_name}</span>
					</div>
				</div>
			);
		};

		const ProjectBadge = () => {
			return (
				<div
					className="search-result-project-badge"
					title={projectTooltip}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>

					<div className="text-wrapper">
						<span>{project_name}</span>
					</div>
				</div>
			);
		};

		const TypeBadge = () => {
			return (
				<div
					className="search-result-type-badge"
					title={typeTooltip}
				>
					{result_type}
				</div>
			);
		};

		switch (result_type.toLowerCase()) {
			case 'task':
				return (
					<div className="search-result-badges anim">
						<TypeBadge />
						<OrganizationBadge />
						<ProjectBadge />
					</div>
				);
			case 'project':
				return (
					<div className="search-result-badges anim">
						<TypeBadge />
						{<OrganizationBadge />}
					</div>
				);
			case 'organization':
			default:
				return (
					<div className="search-result-badges">
						<TypeBadge />
					</div>
				);
		}
	};

	const generateLink = (type: string, id: string) => {
		switch (type.toLowerCase()) {
			case 'organization':
				// change organization assocation cookie
				setCookie('organization', id, 0);
				return '/dashboard';

			case 'project':
				return `/projects/${id}`;
			case 'task':
				return `/projects/${project_id}`;
			default:
				return '';
		}
	};
	return (
		<button
			className="search-result"
			onClick={() => {
				const url = generateLink(result_type, result_id);

				if (url) {
					hideResults && hideResults();
					router.push(url);
				}
			}}
		>
			{<ImageComponent />}
			<div className="search-result-text">
				<div className="search-result-name">{result_name}</div>
				{<BadgesComponent />}
			</div>
		</button>
	);
};

import { render, screen } from '@testing-library/react';

import { Footer } from '../../src/components/SharedComponents/Footer';
describe('Footer component', () => {
	it('Displays footer to has developers name rendered', () => {
		const href = 'http://localhost:3000/';
		render(<Footer></Footer>);

		expect(screen.getByText('Hashem Jaber')).toBeInTheDocument();
	});

	it('displays and redirects to the correct website when clicked', () => {
		const { container, getByText } = render(<Footer />);

		const developerNames = [
			'Fernando Mendoza',
			'Hashem Jaber',
			'Jacob Correa',
			'Joseph Doan',
			'Miguel Lopez',
			'Imren More',
			'Kiranjot Kaur',
			'Dakota Conn',
		];

		const developerLinks = [
			'https://github.com/jvniorrr',
			'https://github.com/hashemJaber',
			'https://github.com/RealHoltz',
			'https://github.com/JDoan03',
			'https://github.com/Miguel1357',
			'https://github.com/imrenmore',
			'https://github.com/KiranKaur3',
			'https://github.com/DGConn',
		];

		// check if the developer names are correct
		let developerEls = developerNames.map(name => getByText(name));
		developerEls.forEach(el => {
			expect(el).toBeInTheDocument();

			// check if the developer links are correct
			let link =
				developerLinks[
					developerNames.indexOf(el.textContent as string)
				];
			expect(el.closest('a')).toHaveAttribute('href', link);
		});
	});
});

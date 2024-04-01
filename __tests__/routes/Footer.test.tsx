import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

//import Footer from '@src/components/SharedComponents/Footer';

import {Footer} from '../../src/components/SharedComponents/Footer'
describe('Footer component', () => {
  it('Dispalys footer to the correct website when clicked', () => {
    const href = 'http://localhost:3000/';
    render(<Footer></Footer>);

    //const link = screen.getByText('https://github.com/jvniorrr');

    //expect(link).toBeInTheDocument();

    //userEvent.click(link);
    expect(screen.getByText("Hashem Jaber")).toBeInTheDocument();
    //expect(window.location.href).toBe(href);
  });
});
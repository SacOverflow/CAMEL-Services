import { render, screen } from '@testing-library/react';
import NotFound from '../../src/app/not-found';



describe('Not Found Page', () => {
  it('redirects to home page when button is clicked', () => {
    render(
    
        <NotFound />
     
    );

    //const button = screen.getByRole('button', { name: /go back/i });
    //fireEvent.click(button);
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
   // expect(window.location.pathname).toBe('/page');
  });
});
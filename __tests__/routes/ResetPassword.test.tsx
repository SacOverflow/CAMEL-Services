import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RecoverPasswordForm from '@/components/RecoverPassword/RecoverPasswordForm';
import { resetPasswordForEmail } from '@/lib/actions/auth.client';

// mocking resetPasswordForEmail function
jest.mock('@/lib/actions/auth.client', () => ({
  resetPasswordForEmail: jest.fn(),
}));

describe('RecoverPasswordForm', () => {
  beforeEach(() => {
    jest.doMock('@/lib/actions/index.ts', () => ({
        //since the email is in our database, it should mock the emails 
		resetPasswordForEmail: jest.fn().mockResolvedValueOnce({
            email: null,
            error:true
		})
	})); 
  });

  it('renders without crashing', () => {
    render(<RecoverPasswordForm />);
  });

  it('submits the form with email', async () => {
    resetPasswordForEmail.mockReturnValueOnce(Promise.resolve({ data: {} }));

    const { getByLabelText, getByText } = render(<RecoverPasswordForm />);

    const emailInput = getByLabelText('Email address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = getByText('Send Password Reset Link');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
      expect(getByText('Reset link sent! Please check your email.')).toBeInTheDocument();
    });
  });
});

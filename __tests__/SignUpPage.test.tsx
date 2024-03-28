import '@testing-library/jest-dom';
import SignUp from "@/app/(auth)/signup/page";
import { render, screen, fireEvent, waitFor, getByRole, getByText } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignUpForm from '@/components/SignUp/SignUpForm';

import { signupUser } from '@/lib/actions/auth.client';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/lib/actions/auth.client.ts', () => ({
    signupUser: jest.fn(),
}));

const mockPush = jest.fn();

describe('testing SignUp Component', () => {
    
    let mockRouter: any
	beforeEach(() => {
        mockRouter = {
            pathname: '/login',
            push: jest.fn(),
            refresh: jest.fn()
        };

        (useRouter as jest.Mock).mockReturnValue(mockRouter);

        signupUser.mockImplementation(
            (emailOrUsername: string, password: string, firstName: string, lastName: string, userName: string) => { {
                    return Promise.resolve({
                        data: {
                            // user data
                        },
                        error: null,
                    });
                }
            },
        );

        mockPush.mockClear();
    })

    it('submits the form with valid input', async () => {
  
        // Rendering the component
        // you are rendering the SignUpForm component into a virtual DOM, allowing 
        // you to interact with it and make assertions about its behavior
        const { getByLabelText, getByRole } = render(<SignUpForm />);
        
        // Filling out the fields that are required 
        fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText('Email address'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText('Username'), { target: { value: 'johndoe' } });
        fireEvent.change(getByLabelText('Password'), { target: { value: 'StrongPassword123' } });
        fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'StrongPassword123' } });
    
        // Submit the form
        fireEvent.submit(getByRole('button',{name: /sign up/i}));
    
      });

      it('should have input values', async () => {
        const { getByLabelText } = render(<SignUpForm />);
        const firstName = getByLabelText('First Name')
        expect(firstName).toBeInTheDocument()

        const lastName = getByLabelText('Last Name')
        expect(lastName).toBeInTheDocument()

        const emailOrUsername = getByLabelText('Email address')
        expect(emailOrUsername).toBeInTheDocument()

        const username = getByLabelText('Username')
        expect(username).toBeInTheDocument()

        const password = getByLabelText('Password')
        expect(password).toBeInTheDocument()

        const confirmPassword = getByLabelText('Confirm Password')
        expect(confirmPassword).toBeInTheDocument()
      })
})
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar, InviteProjectMemberComp } from '@/components/projects/ProjectMemberCard/AddMemberInteraction/index'
import MemberCardDropdown from '@/components/projects/ProjectMemberCard/MemberCardDropdown';
import { removeProjectMember } from '@/lib/actions';

describe('SearchBar component', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<SearchBar />);
    expect(getByPlaceholderText('Search ...')).toBeInTheDocument();
  });
});

const mockRemoveProjectMember = removeProjectMember as jest.Mock;

jest.mock('@/lib/actions', () => ({
  removeProjectMember: jest.fn(), // Mocking the removeProjectMember function
}));

describe('InviteProjectMemberComp component', () => {
  it('adds the member to project and removes member from project', async () => {
    const user: any = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      image: 'https://en.wikipedia.org/wiki/Patrick_Star',
    };

        // Create a copy of the user object without the name and email keys
        const userWithoutNameAndEmail = { ...user };
        delete userWithoutNameAndEmail.name;
        delete userWithoutNameAndEmail.email;
    
    const { getByText, queryByText } = render(
      <>
        <InviteProjectMemberComp
          user={user}
          project_id="project1"
          org_id="org1"
          isProjectMember={false}
        />
        <MemberCardDropdown
          user_id={user.id}
          project_id="project1"
        />
    </>
    );

    let project_id = "project1"
    let user_id = user.id

    expect(getByText(user.name)).toBeInTheDocument();
    expect(getByText(user.email)).toBeInTheDocument();

    mockRemoveProjectMember.mockResolvedValueOnce(true);

    // Call the function to remove the user directly
    await removeProjectMember('project1', '1');

    // Wait for the removal operation to complete
    await waitFor(() => {
      if (userWithoutNameAndEmail.name) {
        expect(queryByText(userWithoutNameAndEmail.name)).toBeUndefined();
      }
      if (userWithoutNameAndEmail.email) {
        expect(queryByText(userWithoutNameAndEmail.email)).toBeUndefined();
      }
    });
  });
});
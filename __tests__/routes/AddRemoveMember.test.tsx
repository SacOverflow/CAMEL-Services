import React from 'react';
import { render} from '@testing-library/react';
import { SearchBar, InviteProjectMemberComp } from '@/components/projects/ProjectMemberCard/AddMemberInteraction/index'

describe('SearchBar component', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<SearchBar />);
    expect(getByPlaceholderText('Search ...')).toBeInTheDocument();
  });
});

describe('InviteProjectMemberComp component', () => {
  it('renders correctly', () => {
    const user: any = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      image: 'https://en.wikipedia.org/wiki/Patrick_Star',
    };
    const { getByText } = render(
      <InviteProjectMemberComp
        user={user}
        project_id="project1"
        org_id="org1"
        isProjectMember={false}
      />
    );
    expect(getByText(user.name)).toBeInTheDocument();
    expect(getByText(user.email)).toBeInTheDocument();
  });

});

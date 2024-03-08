import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FilteredProjects from '@/components/projects/FilterStatusBars/FilteredProjects';
import { IProjects, Roles, Status } from '@/types/database.interface';
import { fireEvent } from '@testing-library/react';

// update
describe('FilteredProjects', () => {
    const projects = [
    //   { id: 1, status: Status.Complete },
    //   { id: 2, status: Status.InProgress },
    //   { id: 3, status: Status.NeedsApproval },
    //   { id: 4, status: Status.ActionNeeded },
      {id: 'string',
      org_id: 'string',
      title: 'string',
      address: 'string',
      status: Status.Complete,
      budget: 1,
      details: 'string',
      due_date: new Date(),
      start_date: new Date(),
      completed_date: new Date(),
      created_at: new Date(),
      current_spent: 1,
      created_by: 'string'}
    ];
  
    test('renders projects with default filters', () => {
      const { getByText } = render(
        <FilteredProjects 
            projects={projects as any} 
            role={Roles.ADMIN} 
            org="org_id" 
        />
      );
  
      expect(getByText('Projects')).toBeInTheDocument();
      expect(getByText('No projects found')).toBeInTheDocument();
    });
  
    test('renders projects based on selected filters', () => {
      const { getByText, queryByText } = render(
        <FilteredProjects 
            projects={projects as any} 
            role={Roles.ADMIN} 
            org="org_id" 
        />
      );
  
      fireEvent.click(getByText('Complete')); // Assuming you have status labels visible
      expect(queryByText('No projects found')).not.toBeInTheDocument();
      expect(getByText('Project with status Complete')).toBeInTheDocument();
      expect(queryByText('Project with status InProgress')).not.toBeInTheDocument();
    });
  
    test('adds a new project card if user has permission', () => {
      const { getByText } = render(
        <FilteredProjects 
            projects={projects as any} 
            role={Roles.SUPERVISOR} 
            org="org_id" 
        />
      );
  
      expect(getByText('Add New Project')).toBeInTheDocument();
    });
  });
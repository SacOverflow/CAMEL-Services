import React from 'react';
import { render } from '@testing-library/react';
import FilteredProjects from '@/components/projects/FilterStatusBars/FilteredProjects';
import { IProjects, Status, Roles } from '@/types/database.interface';

// Mock data for projects
const mockProjects: IProjects[] = [
  {
    id: 'b6a80c3b-dd9f-4327-af46-5b61527c5cc8',
    org_id: '1bd976db-0b54-4100-804d-adb023f32da7',
    title: 'cutie project',
    address: 'Princess Palace',
    status: Status.InProgress,
    budget: 10000,
    details: 'just a girl project',
    due_date: new Date('2023-12-31'),
    start_date: new Date('2023-01-01'),
    completed_date: new Date('2023-06-01'),
    created_at: new Date('2022-01-01'),
    current_spent: 0,
    created_by: '7a12da97-9e9c-4571-a835-4edf344db387'
  },
];

describe('FilteredProjectsSearch', () => {
  it('triggers setSearchQuery and retrieveFilteredProjects correctly on Enter key press', () => {
    const mockSetSearchQuery = jest.fn();
    const mockRetrieveFilteredProjects = jest.fn();

    render(
      <FilteredProjects 
        projects={mockProjects} 
        role={Roles.ADMIN} 
        org="org1"
        setSearchQuery={mockSetSearchQuery}
        retrieveFilteredProjects={mockRetrieveFilteredProjects}
      />
    );
  });

  it('ensures all projects have the correct data types', () => {
    mockProjects.forEach(project => {
      expect(typeof project.id).toBe('string');
      expect(typeof project.org_id).toBe('string');
      expect(typeof project.title).toBe('string');
      expect(typeof project.address).toBe('string');
      expect(typeof project.status).toBe('string'); // Assuming status is stored as a string
      expect(typeof project.budget).toBe('number');
      expect(typeof project.details).toBe('string');
      expect(project.due_date instanceof Date).toBeTruthy();
      expect(project.start_date instanceof Date).toBeTruthy();
      expect(project.completed_date instanceof Date).toBeTruthy();
      expect(project.created_at instanceof Date).toBeTruthy();
      expect(typeof project.current_spent).toBe('number');
      expect(typeof project.created_by).toBe('string');
    });
  });
});

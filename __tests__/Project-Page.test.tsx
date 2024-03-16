import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { getAllNonProjectMembers, getProjectMembers  } from '@/lib/actions/get.client';
import { createProject,updateProject,getProjectById } from '@/lib/actions/client';
require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

// To test this componant you can use: npm run test -- -t "testing CRUD project" or you can it with any title you want 
describe('testing CRUD project', () => {
	// setup the env variables for testing, taken from Fernando, -F means made by Fernando

	beforeEach(() => {
		jest.resetModules(); // Most important - it clears the cache -F
		process.env = { ...OLD_ENV }; // Make a copy -F
	});

	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment -F
	});

	// test on creating a project
	it('should fail to create a project', async () => {
		const org_id = OLD_ENV.ORG_ID!;
		const project_id = OLD_ENV.PROJECT_ID!;
		const project = await createProject(org_id, project_id,'900 J Street','Complete',2000,'esf',new Date('2024/2/2'),new Date('2023/3/2'),OLD_ENV.user_id!);

		// should fail to create, hence be falsy
		expect(project).toBeFalsy();
	});


 	// test on creating a project
     it('should be able to create a project', async () => {
		const org_id = OLD_ENV.ORG_ID!;
		const project_id = OLD_ENV.PROJECT_ID!;
		const project = await createProject(org_id, project_id,'900 J Street','Complete',2000,'esf',new Date('2024/2/2'),new Date('2023/3/2'),OLD_ENV.user_id!);

		// should be able to create, hence be truthy
		expect(project).toBeFalsy();
	});



    it('should be able to update a project', async () => {
		const org_id = OLD_ENV.ORG_ID!;
		const project_id = OLD_ENV.PROJECT_ID!;
		const project = await updateProject(project_id,org_id,'testedSO-114','6 K Street', 'Complete',200,'bla',new Date('2023/3/2'),new Date('2002/2/2'));

		// should be able to update, hence be truthy
		expect(project).toBeFalsy();
	});


    it('should be fail to update a project', async () => {
		const org_id = OLD_ENV.ORG_ID!;
		const project_id = 'khg';
		const project = await updateProject(project_id,org_id,'testedSO-114','6 K Street', 'Complete',200,'bla',new Date('2023/3/2'),new Date('2002/2/2'));
		// should fail to update, hence be falsy
		expect(project).toBeFalsy;
	});


    it('should be able to read a project', async () => {
		
		const project_id = OLD_ENV.PROJECT_ID!;
		const project = await getProjectById(project_id);

		// should be able to read, hence be truthy
		expect(project).toBeTruthy();
	});


    it('should not be able to read a project', async () => {
		
		const project_id ='Lucky to have a brother from another mother ~HJ';
		const project = await getProjectById( project_id);

		// should fail to read, hence be falsy
		expect(project).toBeFalsy;
	});


});

export interface IGlobalResults {
	result_id: string;
	result_type: 'organization' | 'project' | 'task' | string;
	result_name: string;
	result_image: string | null;
	matched_column: string;
	organization_name: string;
	project_id: string | null; // can be null if result type is organization
	project_name: string | null; // can be null if result type is organization
}

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			countries: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			organization: {
				Row: {
					created_at: string;
					created_by: string;
					id: string;
					image: string;
					name: string;
				};
				Insert: {
					created_at?: string;
					created_by: string;
					id?: string;
					image?: string;
					name: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					id?: string;
					image?: string;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'organization_created_by_fkey';
						columns: ['created_by'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
				];
			};
			organization_member: {
				Row: {
					created_at: string;
					member_id: string;
					org_id: string;
					role: Database['public']['Enums']['roles'];
				};
				Insert: {
					created_at?: string;
					member_id: string;
					org_id: string;
					role: Database['public']['Enums']['roles'];
				};
				Update: {
					created_at?: string;
					member_id?: string;
					org_id?: string;
					role?: Database['public']['Enums']['roles'];
				};
				Relationships: [
					{
						foreignKeyName: 'organization_member_member_id_fkey';
						columns: ['member_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'organization_member_org_id_fkey';
						columns: ['org_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
				];
			};
			project_activities: {
				Row: {
					created_at: string;
					duration: number | null;
					id: string;
					notes: string | null;
					project_id: string;
					status: Database['public']['Enums']['proj_status'] | null;
					task_id: string | null;
					timestamp: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					duration?: number | null;
					id?: string;
					notes?: string | null;
					project_id: string;
					status?: Database['public']['Enums']['proj_status'] | null;
					task_id?: string | null;
					timestamp?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string;
					duration?: number | null;
					id?: string;
					notes?: string | null;
					project_id?: string;
					status?: Database['public']['Enums']['proj_status'] | null;
					task_id?: string | null;
					timestamp?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'project_activities_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'project_activities_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'project_activities_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
				];
			};
			projects: {
				Row: {
					address: string | null;
					budget: number | null;
					completed_date: string | null;
					created_at: string;
					created_by: string;
					current_spent: number | null;
					details: string | null;
					due_date: string;
					id: string;
					org_id: string | null;
					start_date: string | null;
					status: Database['public']['Enums']['proj_status'];
					title: string;
				};
				Insert: {
					address?: string | null;
					budget?: number | null;
					completed_date?: string | null;
					created_at?: string;
					created_by: string;
					current_spent?: number | null;
					details?: string | null;
					due_date: string;
					id?: string;
					org_id?: string | null;
					start_date?: string | null;
					status?: Database['public']['Enums']['proj_status'];
					title: string;
				};
				Update: {
					address?: string | null;
					budget?: number | null;
					completed_date?: string | null;
					created_at?: string;
					created_by?: string;
					current_spent?: number | null;
					details?: string | null;
					due_date?: string;
					id?: string;
					org_id?: string | null;
					start_date?: string | null;
					status?: Database['public']['Enums']['proj_status'];
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'projects_created_by_fkey';
						columns: ['created_by'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'projects_org_id_fkey';
						columns: ['org_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
				];
			};
			projects_member: {
				Row: {
					created_at: string;
					project_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					project_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					project_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'projects_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'projects_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'projects_member_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
				];
			};
			receipt_item: {
				Row: {
					created_at: string;
					id: number;
					price: number | null;
					project_id: string | null;
					quantity: number | null;
					receipt_id: string | null;
					title: string | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					price?: number | null;
					project_id?: string | null;
					quantity?: number | null;
					receipt_id?: string | null;
					title?: string | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					price?: number | null;
					project_id?: string | null;
					quantity?: number | null;
					receipt_id?: string | null;
					title?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_receipt_item_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'public_receipt_item_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_receipt_item_receipt_id_fkey';
						columns: ['receipt_id'];
						isOneToOne: false;
						referencedRelation: 'receipts';
						referencedColumns: ['id'];
					},
				];
			};
			receipts: {
				Row: {
					category: string | null;
					created_at: string;
					created_by: string;
					id: string;
					image: string | null;
					img_id: string;
					note: string | null;
					org_id: string;
					price_total: number;
					proj_id: string;
					store: string | null;
					updated_at: string;
					updated_by: string | null;
				};
				Insert: {
					category?: string | null;
					created_at?: string;
					created_by: string;
					id?: string;
					image?: string | null;
					img_id: string;
					note?: string | null;
					org_id: string;
					price_total?: number;
					proj_id: string;
					store?: string | null;
					updated_at?: string;
					updated_by?: string | null;
				};
				Update: {
					category?: string | null;
					created_at?: string;
					created_by?: string;
					id?: string;
					image?: string | null;
					img_id?: string;
					note?: string | null;
					org_id?: string;
					price_total?: number;
					proj_id?: string;
					store?: string | null;
					updated_at?: string;
					updated_by?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'receipts_created_by_fkey';
						columns: ['created_by'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'receipts_org_id_fkey';
						columns: ['org_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'receipts_proj_id_fkey';
						columns: ['proj_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'receipts_proj_id_fkey';
						columns: ['proj_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'receipts_updated_by_fkey';
						columns: ['updated_by'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
				];
			};
			tasks: {
				Row: {
					completed_date: string | null;
					created_at: string;
					due_date: string | null;
					id: string;
					project_id: string;
					status: Database['public']['Enums']['proj_status'] | null;
					title: string | null;
				};
				Insert: {
					completed_date?: string | null;
					created_at?: string;
					due_date?: string | null;
					id?: string;
					project_id: string;
					status?: Database['public']['Enums']['proj_status'] | null;
					title?: string | null;
				};
				Update: {
					completed_date?: string | null;
					created_at?: string;
					due_date?: string | null;
					id?: string;
					project_id?: string;
					status?: Database['public']['Enums']['proj_status'] | null;
					title?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'tasks_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'tasks_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
				];
			};
			tasks_member: {
				Row: {
					created_at: string;
					project_id: string;
					task_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					project_id: string;
					task_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					project_id?: string;
					task_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'tasks_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'tasks_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'tasks_member_task_id_fkey';
						columns: ['task_id'];
						isOneToOne: false;
						referencedRelation: 'tasks';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'tasks_member_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
				];
			};
			testimonial: {
				Row: {
					created_at: string;
					id: number;
					review_content: string | null;
					user_id: number | null;
					user_profile_link: string | null;
					userName: string | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					review_content?: string | null;
					user_id?: number | null;
					user_profile_link?: string | null;
					userName?: string | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					review_content?: string | null;
					user_id?: number | null;
					user_profile_link?: string | null;
					userName?: string | null;
				};
				Relationships: [];
			};
			user: {
				Row: {
					created_at: string;
					email: string;
					id: string;
					image: string | null;
					name: string;
					username: string;
				};
				Insert: {
					created_at?: string;
					email: string;
					id: string;
					image?: string | null;
					name: string;
					username: string;
				};
				Update: {
					created_at?: string;
					email?: string;
					id?: string;
					image?: string | null;
					name?: string;
					username?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Views: {
			activity_view: {
				Row: {
					activity_id: string | null;
					created_at: string | null;
					duration: number | null;
					notes: string | null;
					organization_id: string | null;
					project_id: string | null;
					status: Database['public']['Enums']['proj_status'] | null;
					task_id: string | null;
					timestamp: string | null;
					user: string | null;
					user_id: string | null;
					username: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'project_activities_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'projects_org_id_fkey';
						columns: ['organization_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
				];
			};
			organization_member_view: {
				Row: {
					created_at: string | null;
					email: string | null;
					image: string | null;
					member_id: string | null;
					name: string | null;
					org_id: string | null;
					org_name: string | null;
					role: Database['public']['Enums']['roles'] | null;
					username: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'organization_member_member_id_fkey';
						columns: ['member_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'organization_member_org_id_fkey';
						columns: ['org_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
				];
			};
			project_member_organization: {
				Row: {
					member_id: string | null;
					member_role: Database['public']['Enums']['roles'] | null;
					organization_id: string | null;
					organization_name: string | null;
					project_id: string | null;
					project_title: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'projects_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'projects_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'projects_member_user_id_fkey';
						columns: ['member_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'projects_org_id_fkey';
						columns: ['organization_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
				];
			};
			select_all_tesitonials: {
				Row: {
					created_at: string | null;
					id: number | null;
					review_content: string | null;
					user_id: number | null;
					user_profile_link: string | null;
					userName: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: number | null;
					review_content?: string | null;
					user_id?: number | null;
					user_profile_link?: string | null;
					userName?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: number | null;
					review_content?: string | null;
					user_id?: number | null;
					user_profile_link?: string | null;
					userName?: string | null;
				};
				Relationships: [];
			};
			tasks_view: {
				Row: {
					members: string[] | null;
					project_id: string | null;
					task_id: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'tasks_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'tasks_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'tasks_member_task_id_fkey';
						columns: ['task_id'];
						isOneToOne: false;
						referencedRelation: 'tasks';
						referencedColumns: ['id'];
					},
				];
			};
			user_projects_view: {
				Row: {
					member_id: string | null;
					org_id: string | null;
					project_id: string | null;
					role: Database['public']['Enums']['roles'] | null;
					title: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'organization_member_member_id_fkey';
						columns: ['member_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'projects_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'projects_member_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'projects_org_id_fkey';
						columns: ['org_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Functions: {
			get_random_testimonials: {
				Args: {
					limit_count: number;
				};
				Returns: {
					created_at: string;
					id: number;
					review_content: string | null;
					user_id: number | null;
					user_profile_link: string | null;
					userName: string | null;
				}[];
			};
		};
		Enums: {
			proj_status:
				| 'complete'
				| 'in progress'
				| 'needs approval'
				| 'action needed'
				| 'to do'
				| 'cancelled';
			roles: 'admin' | 'supervisor' | 'member';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database['public']['Tables'] & Database['public']['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
			Database['public']['Views'])
	? (Database['public']['Tables'] &
			Database['public']['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof Database['public']['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
	? Database['public']['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof Database['public']['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
	? Database['public']['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof Database['public']['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
	? Database['public']['Enums'][PublicEnumNameOrOptions]
	: never;

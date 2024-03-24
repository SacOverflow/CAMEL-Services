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
			notification_alerts: {
				Row: {
					created_at: string;
					id: string;
					message: string | null;
					org_id: string | null;
					project_id: string | null;
					reference_type: Database['public']['Enums']['notification_reference'];
					title: string | null;
					type: Database['public']['Enums']['notification_type'];
				};
				Insert: {
					created_at?: string;
					id?: string;
					message?: string | null;
					org_id?: string | null;
					project_id?: string | null;
					reference_type: Database['public']['Enums']['notification_reference'];
					title?: string | null;
					type: Database['public']['Enums']['notification_type'];
				};
				Update: {
					created_at?: string;
					id?: string;
					message?: string | null;
					org_id?: string | null;
					project_id?: string | null;
					reference_type?: Database['public']['Enums']['notification_reference'];
					title?: string | null;
					type?: Database['public']['Enums']['notification_type'];
				};
				Relationships: [
					{
						foreignKeyName: 'public_notification_alerts_org_id_fkey';
						columns: ['org_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_notification_alerts_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'public_notification_alerts_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
				];
			};
			notifications: {
				Row: {
					action_desc: string | null;
					created_at: string | null;
					id: string;
					item_id: string;
					new_val: string | null;
					old_val: string | null;
					table_name: string | null;
				};
				Insert: {
					action_desc?: string | null;
					created_at?: string | null;
					id?: string;
					item_id: string;
					new_val?: string | null;
					old_val?: string | null;
					table_name?: string | null;
				};
				Update: {
					action_desc?: string | null;
					created_at?: string | null;
					id?: string;
					item_id?: string;
					new_val?: string | null;
					old_val?: string | null;
					table_name?: string | null;
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
			user_lang_pref: {
				Row: {
					lang: string | null;
					user_id: string;
				};
				Insert: {
					lang?: string | null;
					user_id?: string;
				};
				Update: {
					lang?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'public_user_lang_pref_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: true;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
				];
			};
			user_notifications: {
				Row: {
					created_at: string;
					id: string;
					notification_id: string;
					read_at: string | null;
					status:
						| Database['public']['Enums']['notification_status']
						| null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					notification_id: string;
					read_at?: string | null;
					status?:
						| Database['public']['Enums']['notification_status']
						| null;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					notification_id?: string;
					read_at?: string | null;
					status?:
						| Database['public']['Enums']['notification_status']
						| null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'public_user_notifications_notification_id_fkey';
						columns: ['notification_id'];
						isOneToOne: false;
						referencedRelation: 'notification_alerts';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_user_notifications_notification_id_fkey';
						columns: ['notification_id'];
						isOneToOne: false;
						referencedRelation: 'notification_user_view';
						referencedColumns: ['notification_id'];
					},
					{
						foreignKeyName: 'public_user_notifications_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
				];
			};
			user_subscribed_to_task: {
				Row: {
					id: number;
					task_id: string;
					user_id: string;
				};
				Insert: {
					id: number;
					task_id: string;
					user_id: string;
				};
				Update: {
					id?: number;
					task_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'public_user_subscribed_to_task_task_id_fkey';
						columns: ['task_id'];
						isOneToOne: false;
						referencedRelation: 'tasks';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_user_subscribed_to_task_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
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
			notification_user_view: {
				Row: {
					message: string | null;
					notification_created_at: string | null;
					notification_id: string | null;
					notification_read_at: string | null;
					notification_status:
						| Database['public']['Enums']['notification_status']
						| null;
					org_id: string | null;
					project_id: string | null;
					title: string | null;
					type:
						| Database['public']['Enums']['notification_type']
						| null;
					user_id: string | null;
					user_notification_created_at: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_notification_alerts_org_id_fkey';
						columns: ['org_id'];
						isOneToOne: false;
						referencedRelation: 'organization';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_notification_alerts_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'projects';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_notification_alerts_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'activity_view';
						referencedColumns: ['project_id'];
					},
					{
						foreignKeyName: 'public_user_notifications_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'user';
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
			check_user_notifications: {
				Args: {
					user_id: string;
				};
				Returns: {
					notification_id: string;
					table_name: string;
					action_desc: string;
					old_val: string;
					new_val: string;
					item_id: string;
				}[];
			};
			get_notifications_for_user: {
				Args: {
					user_id: string;
				};
				Returns: {
					notification_id: string;
					table_name: string;
					action_desc: string;
					old_val: string;
					new_val: string;
					item_id: string;
				}[];
			};
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
			get_unread_notifications: {
				Args: {
					user_id: string;
				};
				Returns: {
					notification_id: string;
					title: string;
					message: string;
					org_id: string;
					project_id: string;
					notification_created_at: string;
					notification_status: Database['public']['Enums']['notification_status'];
					notification_read_at: string;
					user_notification_created_at: string;
					reference_type: Database['public']['Enums']['notification_reference'];
				}[];
			};
			get_users_not_in_organization: {
				Args: {
					organization: string;
				};
				Returns: {
					user_id: string;
					email: string;
					username: string;
					name: string;
					image: string;
				}[];
			};
			get_users_not_in_project_and_in_organization: {
				Args: {
					project: string;
					org: string;
				};
				Returns: {
					user_id: string;
					email: string;
					username: string;
					name: string;
					image: string;
				}[];
			};
			global_search: {
				Args: {
					search_text: string;
				};
				Returns: {
					result_id: string;
					result_type: string;
					result_name: string;
					result_image: string;
					matched_column: string;
					organization_name: string;
					project_id: string;
					project_name: string;
				}[];
			};
		};
		Enums: {
			notification_reference: 'task' | 'organization' | 'project';
			notification_status: 'read' | 'unread';
			notification_type: 'created' | 'updated' | 'deleted';
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

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
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
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
			PublicSchema['Views'])
	? (PublicSchema['Tables'] &
			PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
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
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
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
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never;

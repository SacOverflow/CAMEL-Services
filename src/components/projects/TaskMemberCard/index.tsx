'use client';
import { removeMemberFromTask } from '@/lib/actions/client';

export default function TaskMemberCard(
	members: any,
	taskMembers: any,
	selectedTask: any,
	reFresh: any,
	editedTask: any,
	dismiss: any,
) {
	return (
		<div className="bg-white shadow rounded-lg p-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-4">
				Task Members
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{taskMembers?.map((member: any) => (
					<>
						<div
							key={member.id}
							className="flex items-center space-x-3"
						>
							<img
								src={member.image}
								alt={member.name}
								className="w-14 h-14 rounded-full border border-gray-300"
							/>
							<div className="flex flex-col">
								<span className="font-small text-gray-900">
									{member.name}
								</span>
								<span className="text-sm text-gray-500">
									{member?.role ? member.role : 'Team Member'}
								</span>

								<span
									onClick={() =>
										selectedTask
											? removeMemberFromTask(
													editedTask,
													member.id,
											  )
													.then(dismiss())
													.finally(() => {
														reFresh();
													})
											: () => {}
									}
									className="text-sm text-red-500 cursor-pointer"
								>
									Remove from task
								</span>
							</div>
						</div>
					</>
				))}
			</div>
		</div>
	);
}

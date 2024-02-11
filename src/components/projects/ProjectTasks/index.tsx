'use client'
import './ProjectTask.css';
import { ITasks, Status } from '@/types/database.interface';

import {getTasks, addMembertoTask, updateTask, removeMemberFromTask} from '@/lib/actions/client'



import { Poppins } from 'next/font/google';
import React from 'react';

const PoppinsLight = Poppins({
	subsets: ['latin-ext'],
	weight: ['300'],
});

const PoppinsSemiBold = Poppins({
	subsets: ['latin-ext'],
	weight: ['600'],
});

 function ProjectTask({ task, setTaskEdit

}: {task:ITasks,setTaskEdit:(task:ITasks)=>{}}) {

const id= task?.id
const project_id=task?.project_id
const title= task?.title
const due_date= task?.due_date
const complete_date= task?.completed_date
const status= task?.status

	const getStatus = (status: Status) => {
		switch (status) {
			case Status.ToDo:
				return 'todo';
			case Status.ActionNeeded:
				return 'actionneeded';
			case Status.InProgress:
				return 'inprogress';
			case Status.Complete:
				return 'complete';
			default:
				return 'todo';
		}
	};

	return (
		<div onClick={()=>{setTaskEdit(task)}} className={`project-task ${PoppinsSemiBold.className}`}>
			<span className={`status ${getStatus(status)}`}>{status}</span>

			<div
				className={`task-content ${getStatus(status)} ${
					PoppinsLight.className
				}`}
			>
				<div className="title">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						className="icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
						/>
					</svg>

					<span className="text">{title}</span>
				</div>

				<div className="date">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						className="icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
						/>
					</svg>

					<span className="text">
						{new Date(due_date).toLocaleDateString()}
					</span>
				</div>

				<div className="members">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						className="icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
						/>
					</svg>

					<span className="text">
						PLACEHOLDErer423, PLACEHOLDER 1, PLACEHOLDER 2, PLACEHOLDER
						3, PLACEHOLDER 4
					</span>
				</div>
			</div>
		</div>
	);
}


const EditTaskForm = ({ task, onSave, removeSelectedTask

}: {task:ITasks,removeSelectedTask:(task:ITasks|null|any)=>{},onSave:(Item:any|null)=>{}}) => {
    // Form state

    const [editedTask, setEditedTask] = React.useState<ITasks>( { 
    id:task.id,  
    title: task.title,
    created_at:task.created_at,
    status: task.status,
    completed_date:task.completed_date ,
due_date:new Date(),
project_id: task.project_id

  });
  
    // Update form state when the selected task changes
    React.useEffect(() => {
      setEditedTask(editedTask);
    }, [editedTask]);
  
    // Handle form submission
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      
      onSave(editedTask);


    };
  

    const handleChange = (event:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      if (name === "completedBy") {
        setEditedTask(prevTask => ({
          ...prevTask,
          [name]: value ? new Date(value) : null
        }));
      } else {
        setEditedTask(prevTask => ({
          ...prevTask,
          [name]: value
        }));
      }
    };
    
    if (!editedTask) {return <div>Select a task to edit</div>};
  
    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskName">
            Task Name: {editedTask.title}
        
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="createdAt">
            Created At:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="created_at"
            type="date"
            name="created_at"
    
            value={ JSON.stringify(editedTask.created_at)}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Status:
          </label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="status"
            name="status"
            value={editedTask.status}
            onChange={handleChange}
          >
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="completedBy">
            Completed By:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="completed_date"
            type="date"
            name="completed_date"
            value={editedTask.completed_date instanceof Date ? editedTask.completed_date.toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="members">
            Members:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="members"
            type="text"
            name="members"
            value={'Fernando'}
            onChange={e => setEditedTask(prevTask => ({
              ...prevTask,
              members: e.target.value.split(',').map(member => member.trim())
            }))}
          />
        </div>

       
          <button
            className=""
            type="submit" onClick={()=>{
             
              removeSelectedTask(null)
              
            }}
          >
            Save
          </button>
        
      </form>
    );
  };
  
export const ProjectsTasks = ({ tasks,  setTaskEdit }: { tasks: ITasks[],setTaskEdit:()=>{} }) => {
   tasks=[{id:'example2',
	project_id:'example',
	title:'example',
	status:Status.ToDo,
	due_date: new Date(),
	completed_date: new Date(),
	created_at: new Date(),}]
	return (
		<div className="all-tasks">
			{tasks.map((task: ITasks, key: number) => {
				return (
					<ProjectTask setTaskEdit={setTaskEdit}
						task={task}
						key={key}
					/>
				);
			})}
		</div>
	);
};


function ExampleColumn({ tasks, setTaskEdit }: { tasks: ITasks[], setTaskEdit:()=>{} }) {
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('Completed');

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width < 800); 
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const completedTasks: ITasks[] = [];
  const inProgressTasks: ITasks[] = [];
  const cancelledTasks: ITasks[] = [];

  tasks.forEach(task => {
    switch (task.status) {
      case Status.Complete:
        completedTasks.push(task);
        break;
      case Status.InProgress:
        inProgressTasks.push(task);
        break;
      case Status.NeedsApproval: 
        cancelledTasks.push(task);
        break;
      default:
        cancelledTasks.push(task);
    }
  });

  const scrollable = completedTasks.length > 3 ? 'overflow-auto h-64' : '';
  const scrollable1 = inProgressTasks.length > 3 ? 'overflow-auto h-64' : '';
  const scrollable2 = cancelledTasks.length > 3 ? 'overflow-auto h-64' : '';

  return (
    <div className={`shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-row`}>
      {isSmallScreen && (
        <div className="flex flex-col items-center justify-between mb-4">
          <h2 className="text-xl font-bold w-fit">Tasks</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-gray-300 p-2 min-w-fit text-sm font-medium"
          >
            <option value="Completed">Completed</option>
            <option value="InProgress">In Progress</option>
            <option value="NeedsApproval">ToDo</option>
          </select>

          {completedTasks.map((task, index) => (
             (selectedCategory ==='Completed') &&  <ProjectTask setTaskEdit={setTaskEdit} key={index} task={task}></ProjectTask>
              ))}


{inProgressTasks.map((task, index) => (
             (selectedCategory ==='InProgress') &&  <ProjectTask setTaskEdit={setTaskEdit} key={index} task={task}></ProjectTask>
              ))}


{cancelledTasks.map((task, index) => (
             (selectedCategory ==='NeedsApproval') &&  <ProjectTask setTaskEdit={setTaskEdit} key={index} task={task}></ProjectTask>
              ))}


        </div>
      )}

      {!isSmallScreen && (
        <>
          <div className='flex-row m-4'>
            <h2 className={`text-xl font-bold my-2`}>Completed Tasks</h2>
            <div className={`${scrollable}`}>
              {completedTasks.map((task, index) => (
                <ProjectTask   setTaskEdit={setTaskEdit} key={index} task={task}></ProjectTask>
              ))}
            </div>
          </div>
          <div className='flex-row m-4'>
            <h2 className={`text-xl font-bold my-2`}>In Progress Tasks</h2>
            <div className={`${scrollable1}`}>
              {inProgressTasks.map((task, index) => (
                <ProjectTask   setTaskEdit={setTaskEdit} key={index} task={task}></ProjectTask>
              ))}
            </div>
          </div>
          <div className='flex-row m-4'>
            <h2 className={`text-xl font-bold my-2`}>ToDo Tasks</h2>
            <div className={`${scrollable2}`}>
              {cancelledTasks.map((task, index) => (
                <ProjectTask   setTaskEdit={setTaskEdit} key={index} task= {task}></ProjectTask>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


async function TasksSection(project_id:string){
  
  
   

    const [taskSelected, setSelectedTask]=React.useState<ITasks|null|any>(null);
    const [tasks, setTasks]=React.useState<ITasks|null|any>(null);
    const doThis=(task:ITasks)=>{
      setSelectedTask(task)
    }

    const update=async(task:ITasks)=>{
    const result=await updateTask(task)
if(result){}
else {console.log('') }

    }

/*
    const getTasks= async(project_id:string)=>{
     const result:boolean| ITasks[] =await getTasks(project_id)
     return result ? result:null

    }
    setTasks(await getTasks(project_id))




        return taskSelected?<EditTaskForm task={taskSelected} onSave={update} removeSelectedTask={setSelectedTask}></EditTaskForm> : <ExampleColumn setTaskEdit={doThis}  tasks={tasks}></ExampleColumn>

*/
    }
    export default TasksSection

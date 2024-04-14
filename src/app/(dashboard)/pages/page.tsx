// pages/chat.js
'use client';
import React, { useState } from 'react';
import OptionList from './OptionList';
import './chat.css';
import Message from './message';
import {
	get_financial_state,
	get_tasks_with_members_for_CAMELAI,
	get_Information_About_Tasks_Projects_Members_For_CamelAI,
	createProject,
	createTask,
	addMembertoTaskForCamelAI,
	deleteTask,
	inviteProjectMemberForCamelAI,
	removeMemberFromTaskForCamelAI,
	removeProjectMemberForCamelAI,
	createReciept,
	updateTask,
} from '../../../lib/actions/client';
// Define a mapping from action and table name to the corresponding API function, got the idea from the way I did the translatons :nerd: ~Hashem
const apiActionMap: any = {
	project: {
		create: createProject,
		read: () => {},
		update: () => {},
		delete: () => {},
	},
	tasks: {
		create: createTask,
		read: () => {},
		update: updateTask,
		delete: deleteTask,
	},
	projects_member: {
		create: inviteProjectMemberForCamelAI,
		read: () => {},
		update: () => {},
		delete: removeProjectMemberForCamelAI,
	},
	tasks_member: {
		create: addMembertoTaskForCamelAI,
		read: () => {},
		update: () => {},
		delete: removeMemberFromTaskForCamelAI,
	},
	receipts: {
		creare: createReciept,
	},
};
/*
const executeAction= async (object:any){

}
const handleLLMResponse = async (llmResponse:string) => {
    try {
        const { tableName, actionKey, objectStr } = parseLLMResponse(llmResponse);
        const result = await executeAction({ tableName, actionKey, objectStr });
        console.log('Action result:', result);
        // Update UI accordingly
    } catch (error) {
        console.error('Handling error:', error);
        // Update UI to show error
    }
};
*/
export default function Chat() {
	const [summary, setSummary] = useState('No financial summary yet');
	const [error, setError]: any = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [messages, setMessages]: any = useState([
		{
			role: 'assistant',
			content:
				'Hey !, I am CAMELIA, your AI assistant, I can provide an over view of your oranziation across projects as well as give you different updates on tasks that may need your immediate attention',
		},
	]);
	const [textBox, setTextBox] = useState('');
	const handlLLMActionRequest = async (command: string) => {
		// Use a regular expression to extract the object part
		const objectRegex = /object ({.*?})\$/;
		const instruction = command;
		// format : `table name: project $, action: create$, object { "task_desk": "etc", "task_due_date": "2023-12-31", "task_title": "example" }$`; ~Hashem Jaber
		// Define a regular expression that captures the table name and action
		const regex = /table name: (\w+) \$, action: (\w+)\$/;

		// Use the regular expression to extract the components
		const matches = instruction.match(regex);

		if (matches) {
			const [, tableName, action] = matches;
			//For debugging
			console.log('Table Name:', tableName.toLowerCase());
			console.log('Action:', action.toLowerCase());
			const match = instruction.match(objectRegex);

			if (match) {
				const objectStr = match[1];
				//FIX ME WOHOOO- Hashem Jaber
				// Replace Date.now() with an actual timestamp
				//objectStr = objectStr.replace('Date.now()', `"${new Date().toISOString()}"`);

				try {
					const parsedObject = JSON.parse(objectStr);
					console.log('Parsed Object:', parsedObject);
					const res =
						await apiActionMap[tableName][action](parsedObject);
					if (res) {
						await sendToServerQuestion(
							'Given the following information, return the link to the item aka the link to the project while also saying completed succesfuly, check it out here *http://localhost:3000/projects/{project_id}* ' +
								parsedObject?.project_id,
						);
					} else {
						console.error('failed to create item');
					}
				} catch (e) {
					console.error('Failed to parse the object string:', e);
					console.info('object string was ', objectStr);
				}
			}
		} else {
			console.log('No matches found');
		}
	};

	const get_Information_About_Tasks_Projects_Members_For_CamelAI_Call =
		async () => {
			const summry =
				await get_Information_About_Tasks_Projects_Members_For_CamelAI();
			const sumry2 = JSON.stringify(summry);
			setSummary(sumry2);
		};

	const get_state_of_financiacial = async () => {
		const summry = await get_financial_state();
		const sumry2 = JSON.stringify(summry);
		setSummary(sumry2);
	};

	const get_state_of_tasks = async () => {
		const summry = await get_tasks_with_members_for_CAMELAI();
		const sumry2 = JSON.stringify(summry);
		setSummary(sumry2);
	};

	const backEndCall = (QuestionToAsk: string) => {
		fetch('http://localhost:3000/api/chatAI', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				messages,
				QuestionToAsk: QuestionToAsk,
				summary,
			}),
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				const res = data.responce;
				console.log(res);
				const lowerCaseQuestion = QuestionToAsk.toLowerCase();
				// Keywords that hint towards data manipulation
				const actionKeywords = [
					'create',
					'delete',
					'make',
					'produce',
					'search',
					'find',
					'look',
					'add',
					'remove',
				];
				const isActionRequest = actionKeywords.some(keyword =>
					lowerCaseQuestion.includes(keyword),
				);

				if (isActionRequest) {
					console.log('handling llm request');
					handlLLMActionRequest(res.content);
					sendToServerQuestion(
						"reply with 'done, check it out in http://localhost:3000/projects/{project_id} ' given the following " +
							res.content,
					);
				} else {
					setMessages([
						...messages,
						{ role: 'user', content: QuestionToAsk },
						res,
					]);
				}
			})
			.catch(e => {
				setError(true);
				setErrorMessage('Error occured');
				console.log('error occured', e);
			});
	};

	console.log('summary is ' + summary);
	const sendToServerQuestion = async (QuestionToAsk: string) => {
		const lowerCaseQuestion = QuestionToAsk.toLowerCase();
		// Keywords that hint towards data manipulation
		const actionKeywords = [
			'create',
			'delete',
			'make',
			'produce',
			'search',
			'find',
			'look',
			'add',
			'remove',
			'find',
			'get',
		];
		const isActionRequest = actionKeywords.some(keyword =>
			lowerCaseQuestion.includes(keyword),
		);

		if (isActionRequest) {
			console.info('Action item requested');
			await get_Information_About_Tasks_Projects_Members_For_CamelAI_Call().then(
				() => {
					backEndCall(QuestionToAsk);
				},
			);
		} else {
			// Determine which summary to get based on the question asked
			if (
				lowerCaseQuestion.includes('summary') ||
				lowerCaseQuestion.includes('business') ||
				lowerCaseQuestion.includes('budget')
			) {
				console.log('business summary was requested');
				await get_state_of_financiacial().then(() => {
					backEndCall(QuestionToAsk);
				});
			} else if (
				lowerCaseQuestion.includes('tasks') ||
				lowerCaseQuestion.includes('update')
			) {
				console.log('update on tasks was requested');
				await get_state_of_tasks().then(() => {
					backEndCall(QuestionToAsk);
				});
			} else {
				// Handle other cases or ask for clarification
				backEndCall(QuestionToAsk);
			}
			// Example POST request using fetch
		}
	};

	return (
		<div className="chat-container">
			<div className="chat-history flex flex-col scrollable">
				{messages.map((entry: any, index: string) => (
					<>
						<Message
							key={index}
							text={entry.content}
							isUser={entry.role === 'user'}
						/>
					</>
				))}

				{error && <p className="error-message">{errorMessage}</p>}
			</div>
			<OptionList action={sendToServerQuestion} />
			<textarea
				value={textBox}
				onChange={e => {
					setTextBox(e.target.value);
				}}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						// Call the function you want to execute when Enter is pressed(

						sendToServerQuestion(textBox);
						setMessages([
							...messages,
							{ role: 'user', content: textBox },
							{
								role: 'assistant',
								content:
									'hmmm this might take me a minute, hold on tight',
							},
						]);
						setTextBox('');
					}
				}}
				className="text-box"
			></textarea>
		</div>
	);
}

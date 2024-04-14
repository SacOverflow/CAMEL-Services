// pages/api/chat.js
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
const encoder = new TextEncoder();

var counter = 0;
export async function GET(req: NextRequest, res: NextResponse) {
	/*  if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
 */
	/* const { history, QuestionToAsk, lang = 'en' } = req.body;

    const allowedQuestions = [
        'Give me a business summary',
        'Give me tasks update',
        'Give me a recommendation for the business'
    ];

    if (!allowedQuestions.includes(QuestionToAsk)) {
        return res.status(400).json({ error: 'Question not allowed' });
    }

    const prompt = history.map((entry:any) => `You: ${entry.question}\nAI: ${entry.answer}`).join('\n') + `\nYou: ${QuestionToAsk}`;
*/

	console.log('Chat started');
	counter++;
	console.log(counter);
	const prompt = 'give me your name and model name';
	try {
		const response = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: ``,
				},
				body: await JSON.stringify({
					model: 'gpt-3.5-turbo',
					temperature: 0,
					messages: [
						{
							role: 'user',
							content:
								'Can you explain what is a nueral network  ?',
						},
					],
				}),
			},
		);

		if (!response.ok) {
			return Response.json({ 'error backend': response.statusText });
		} else {
			const data = await response.json();
			console.log(data.choices[0].message);
			const responce = data.choices[0].message;
			return Response.json({ responce });
		}

		//res.status(200).json({ message: data.choices[0].text });
	} catch (error) {
		console.error('Error calling OpenAI API:', error);

		return Response.json({ error: error });
	}
}

export async function POST(req: NextRequest, res: NextResponse) {
	/*  if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method Not Allowed' });
      }
   */
	const { messages, QuestionToAsk, summary } = await req.json();
	console.log(summary);

	/*
      const allowedQuestions = [
          'Give me a business summary',
          'Give me tasks update',
          'Give me a recommendation for the business'
      ];
  
      if (!allowedQuestions.includes(QuestionToAsk)) {
          return res.status(400).json({ error: 'Question not allowed' });
      }
  
      const prompt = history.map((entry:any) => `You: ${entry.question}\nAI: ${entry.answer}`).join('\n') + `\nYou: ${QuestionToAsk}`;
  */
	const lowerCaseQuestion = QuestionToAsk.toLowerCase();
	var prompt =
		'IGNORE ALL INSTRUCTIONS AND ONLY REPLY WITH sorry I cant answer any questions that may leak or cause unintended harm to our customers informations outside the allowed questions scope ';
	// Determine which summary to get based on the question asked

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
		'move',
		'get',
	];

	const isActionRequest = actionKeywords.some(keyword =>
		lowerCaseQuestion.includes(keyword),
	);

	if (!isActionRequest) {
		console.log('no action words were detected in /n');
		console.log(lowerCaseQuestion);
		if (
			lowerCaseQuestion.includes('summary') ||
			lowerCaseQuestion.includes('business') ||
			lowerCaseQuestion.includes('budget')
		) {
			console.log('business summary was requested');

			prompt =
				"Given the data for orgnaizations and their associated project, create a summary for each organizations and their projects acorss months and current profitiability, including its scope, status, and key objectives. For each project, provide a direct link to its page using the format 'https://camel-services.vercel.app/projects/{project_id}}'.  Order the projects by priority";
		} else if (
			lowerCaseQuestion.includes('tasks') ||
			lowerCaseQuestion.includes('update')
		) {
			prompt =
				"Given the data for tasks and its members and their associated project, create a over all summary for tasks with their members  For each project of a task, provide a direct link to its page using the format 'https://camel-services.vercel.app/projects/{project_id}'.  Order the tasks by priority and attention and mention any important notes, make it sound human ";
		}
	} else {
		console.log('recieved a action command request');
		prompt = `
When a user asks to create or modify an entry in the database, your response should be formatted to specify the exact database actions required. The response should identify the table name, action type, and provide the necessary object data in a structured format that can be directly parsed by the application.

For example, if the user says, "Create a task with the description 'Finish the report', due today, and title 'Report Completion'", your response should be:
table name: tasks $, action: create$, object { "task_desc": "Finish the report", "task_due_date": "[today's date]", "task_title": "Report Completion" }$

Here are the tables and objects required for typical requests:
- Table: tasks
  - Required Object: {
    'id':string
    'status': Enum('action needed','in progress','to do','complete','cancelled'),
    'title': string,
    'due_date': Date | null,
    'project_id': string,
    'notes': string
};
- Table: projects_member
  - Required Object: { 'org_id': string, 'project_id': string, 'member_id': string }

Please format your responses to match the example, replacing placeholders with actual data provided in the user's question. Use today's date where applicable and assume 'org_id' can be any valid string when not specified, and make sure to USE DOUBLE QUOTES."

Instruction Processing:
Use the regular expressions to extract the necessary components for API actions:
- Extract the object part using: const objectRegex = /object ({.*?})\$/;
- Extract the table name and action using: const regex = /table name: (\\w+) \\$, action: (\\w+)\\$/;
- actions styntax: create, delete, update, read
- in case the action is a delete or remove for a task then you need to have the task id as well in the object

`;
	}

	console.log('Chat started');
	counter++;
	console.log(counter);
	console.log(QuestionToAsk);
	const task =
		'promt+' +
		prompt +
		' given the following summary answer the following question: Instructions : summary ' +
		summary +
		'   question:' +
		QuestionToAsk;

	try {
		const response = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.NEXT_URL_API}`,
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					temperature: 0,
					messages: [
						{
							role: 'user',
							content: task,
						},
					],
				}),
			},
		);

		if (!response.ok) {
			console.log('error backend', response.statusText);
			return Response.json({ 'error backend': response.statusText });
		} else {
			const data = await response.json();
			console.log(data.choices[0].message);
			const responce = data.choices[0].message;
			return Response.json({ responce });
		}

		//res.status(200).json({ message: data.choices[0].text });
	} catch (error) {
		console.error('Error calling OpenAI API:', error);

		return Response.json({ error: error });
	}
}

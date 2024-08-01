<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import Button from './ui/button/button.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let policyDescription;
	export let policyId;

	let messageHistory: any[] = [
		{
			person: 'AI Assistant',
			message: `I am an AI assistant who can help brainstorm cases that illustrate the application of the policy, or cases that reveal the potential flaw of the policy. Please click the buttons below to see some examples.`
		}
	];
	let loading = false;
	let showGenerateCaseBtn = true;
	let showInstructionInput = false;
	let iterateInstruction = '';
	let suggestedCase = '';
	let showRestartBtn = false;

	const messageExample = `Cases that illustrate the policy`;
	const messageCounterExample = 'Cases that reveal the policy flaws';
	const promptStarter = `You are a helpful assistant focusing on supporting users' reflections on course policies. Here is an overview of the course.`;
	const courseInfo = `Course Title: Augmenting Intelligence. Course Overview: This course explores the design and evaluation of technologies that aim to augment and amplify human cognitive capabilities. We will examine historical visions of “augmented intelligence” across various fields, including human-computer interaction, artificial intelligence, cognitive science, collective intelligence, and computer-supported cooperative work. Through a series of case studies, students will learn how to design and evaluate systems intended to augment human decision-making, sensemaking, learning, perception, creative problem-solving, and more (in both individual and groups). The first half of the course will be primarily organized around readings and in-class discussions. In the second half of the course, students will iteratively design, prototype, and evaluate a new technology, intended to address an everyday challenge by augmenting human cognitive abilities. This course is strongly multi-disciplinary, and is appropriate for students from diverse backgrounds, including computer science, psychology, social and decision sciences, design, statistics and data science, art, engineering, and humanities. Weekly Readings and Responses: Readings and in-class discussions are a major component of this course. To support in-class discussions, assigned readings and responses should be completed before class on the day they are listed in the course schedule. The main goal of the reading responses is to start thinking about what you’d like to discuss with your classmates in class, and to begin getting a sense of what your classmates are thinking about. With this in mind: your responses do not need to be particularly long. Student Presentations and Class Discussions: From the third week of class onward, students will kick-off class discussions by giving a presentation on that week’s readings, in small groups (3 - 4 students). By the second week of class, students should sign up to give a presentation on a topic that interests them. These presentations should be a minimum of 20 minutes and a maximum of 40 minutes in total, leaving the rest of the time for a class discussion about the readings. As a general rule of thumb, you might aim to spend no more than 10 minutes of presentation time per reading. Your group should feel free to structure the presentation as you see fit. For example, you could divide your presentation into sections (one for each reading), and then have one group member take the lead on each section. Alternatively, you could take turns presenting different parts of each paper for a given week. When putting together your presentation, you should assume that not all students in the class have read that week’s readings as closely as your group has. This is your chance to not only remind your peers about the overall contents of the readings, but also to help your peers think about interesting aspects of these readings that they may have missed. Note that your group presentation must cover the required readings for a given week. In addition, however, you are free to talk about other related readings or media that you know about (e.g., based on your own research, your readings outside of class, “optional” readings you might have done, and so on). If your group is presenting on a given week, you can serve as “co-facilitators” of the discussion following your presentation, along with the instructor. That is, you should feel free to pose discussion and reflection questions for the class, based on topics your group is most interested in discussing. Course Project: This course involves a semester-long course project. In small groups (3 - 4 students), students will iteratively design, prototype, and evaluate a new technology, intended to address an everyday challenge by augmenting human cognitive abilities. We will take an iterative approach to developing your projects. There will be multiple project checkpoints throughout the semester, including (1) an initial class-wide brainstorming phase; (2) forming project teams; (3) writing a brief blurb to summarize your group’s project idea; (3) writing a project proposal; and (4) working on your project and then presenting in class at the end of the semester. For each of these checkpoints, the relevant deliverables will be due before class on the day they are listed in the course calendar. In the second half of the semester, we will have in-class studio sessions. These sessions will provide additional time for you to work with your group on your course project, and for the instructor to provide feedback and brainstorm with you about next steps. Note that you should not need to spend your own money to complete your projects for this course. If you need physical equipment, we’ll work to see whether we can find it for you. Similarly, if you need software or cloud computing in order to complete a project, please come talk to us and we can work with you to get what you need. Academic Honesty and Attribution: You are strongly encouraged to re-use or remix code and content from public GitHub repositories or Stack Overflow, open source tools, Creative Commons and public domain data sources, as helpful. The primary goal of the course project is not to demonstrate that you can build complex systems from scratch. However, when you use these outside resources, you must take care to credit the sources you are building upon. In addition, although re-use and re-mixing is generally encouraged in this course, outsourcing your work to others (e.g., by asking or paying someone else to complete your work for you) and then claiming it as your own work is considered plagiarism. Such behavior is not acceptable, and will result in a project grade of zero, at minimum.`;
	const promptIllustrativeAllowCase =
		promptStarter +
		' ' +
		courseInfo +
		' ' +
		`In a few sentences, provide an example scenario of a student in this course where the character uses AI and abides by the following policy: `;
	const promptIllustrativeDisallowCase =
		promptStarter +
		' ' +
		courseInfo +
		' ' +
		`In a few sentences, provide an example scenario of a student in this course where the character uses AI and violates the following policy: `;
	const promptFlawAllowCase =
		promptStarter +
		' ' +
		courseInfo +
		' ' +
		`In a few sentences, provide an example scenario of a student in this course where the student technically abides by the following policy but undermines the policy's intent: `;
	const promptFlawDisallowCase =
		promptStarter +
		' ' +
		courseInfo +
		' ' +
		`In a few sentences, provide an example scenario of a student in this course where the student technically violates the following policy despite genuinely trying to comply: `;
	const promptFlawUnclearCase =
		promptStarter +
		' ' +
		courseInfo +
		' ' +
		`In a few sentences, provide an example scenario of a student in this course where it is unclear whether the student violates the following policy or not: `;

	let aiLogsDocId = '';
	const updateMessageHistory = async (person: string, message: string) => {
		messageHistory = [...messageHistory, { person, message }];
		if (aiLogsDocId == '') {
			const res = await fetch(`/api/assistant/ailogs`, {
				method: 'POST',
				body: JSON.stringify({
					action: 'policyEditCaseAI',
					messageHistory: messageHistory,
					entity: 'policies',
					entityId: policyId
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await res.json();
			aiLogsDocId = data.id;
		} else {
			await fetch(`/api/assistant/ailogs`, {
				method: 'PATCH',
				body: JSON.stringify({
					aiLogsDocId,
					person,
					message
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	};

	const generateCase = async (message: string, category: string) => {
		await updateMessageHistory('You', message);
		loading = true;
		showGenerateCaseBtn = false;

		let prompt: string = '';
		let label: string = '';
		if (category == 'illustrative') {
			let i = Math.floor(Math.random() * 2); // i = 0 or 1
			if (i == 0) {
				prompt = promptIllustrativeAllowCase;
				label = `The policy may allow the following case: `;
			} else {
				prompt = promptIllustrativeDisallowCase;
				label = `The policy may disallow the following case: `;
			}
		} else if (category == 'flaw') {
			let i = Math.floor(Math.random() * 3); // i = 0, 1, 2
			if (i == 0) {
				prompt = promptFlawAllowCase;
				label = `The policy may allow the following case even though this case should probably be disallowed: `;
			} else if (i == 1) {
				prompt = promptFlawDisallowCase;
				label = `The policy may disallow the following case even though this case should probably be allowed: `;
			} else {
				prompt = promptFlawUnclearCase;
				label = `The policy may be unclear in the following case: `;
			}
		}

		const res = await fetch('/api/assistant/case', {
			method: 'POST',
			body: JSON.stringify({
				prompt: prompt + policyDescription
			})
		});
		if (res.ok) {
			const data = await res.json();
			suggestedCase = data.text;
			await updateMessageHistory('AI Assistant', label);
			await updateMessageHistory('AI Assistant', data.text);
			await updateMessageHistory(
				'AI Assistant',
				`Please provide instructions on how you would like to iterate on the suggested case. If this case looks good, consider creating a new case by clicking the "create new case" button. You may also restart the conversation.`
			);
			showInstructionInput = true;
			iterateInstruction = '';
			showRestartBtn = true;
		} else {
			await updateMessageHistory('AI Assistant', 'Sorry, something went wrong. Please try again.');
			showGenerateCaseBtn = true;
		}
		loading = false;
	};

	const iterateCase = async () => {
		loading = true;
		showRestartBtn = false;
		let prompt =
			`You are a helpful assistant focusing on supporting users in editing the following case: ` +
			suggestedCase +
			` In a few sentences, slightly revise the case without significant changes based on the following instructions: ` +
			iterateInstruction;
		const res = await fetch('/api/assistant/case', {
			method: 'POST',
			body: JSON.stringify({
				prompt: prompt
			})
		});
		if (res.ok) {
			const data = await res.json();
			suggestedCase = data.text;
			await updateMessageHistory('AI Assistant', `Here is the revised case:`);
			await updateMessageHistory('AI Assistant', data.text);
			await updateMessageHistory(
				'AI Assistant',
				`Please provide instructions on how you would like to iterate on the suggested case. If this case looks good, consider creating a new case by clicking the "create new case" button. You may also restart the conversation.`
			);
			showInstructionInput = true;
			iterateInstruction = '';
			showRestartBtn = true;
		} else {
			await updateMessageHistory(
				'AI Assistant',
				'Sorry, something went wrong. Please try again. Please choose whether you would like to create a policy or a case.'
			);
			showGenerateCaseBtn = true;
		}

		loading = false;
	};
</script>

<h3 class="font-semibold mt-2 mb-2">Brainstorm with AI</h3>
<ScrollArea class="h-[85vh] w-full rounded-md border">
	<div class="text-sm mx-3">
		{#each messageHistory as message}
			<p class="font-bold py-2">{message.person}</p>
			<p class=" rounded p-2 mb-2 {message.person == 'You' ? 'bg-sky-100' : 'bg-gray-100'}">
				{message.message}
			</p>
		{/each}
		<div hidden={!loading}>
			<p class="font-bold py-2">AI Assistant</p>
			<Skeleton class="w-full h-16" />
		</div>
	</div>
	<div class="flex flex-col space-y-2 my-2">
		{#if showGenerateCaseBtn}
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					await generateCase(messageExample, 'illustrative');
				}}
			>
				{messageExample}
			</Button>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					await generateCase(messageCounterExample, 'flaw');
				}}
			>
				{messageCounterExample}
			</Button>
		{/if}
		{#if showInstructionInput}
			<div class="mx-3 mt-1">
				<Input
					placeholder={'Please edit the case so that ...'}
					bind:value={iterateInstruction}
					on:keypress={async (e) => {
						if (e.key === 'Enter') {
							showInstructionInput = false;
							await updateMessageHistory('You', iterateInstruction);
							await iterateCase();
						}
					}}
				/>
			</div>
		{/if}
		{#if showRestartBtn}
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					await updateMessageHistory(
						'AI Assistant',
						`To restart, please click the buttons below to see some examples.`
					);
					showGenerateCaseBtn = true;
					showInstructionInput = false;
					showRestartBtn = false;
					iterateInstruction = '';
					suggestedCase = '';
				}}>Restart</Button
			>
		{/if}
	</div>
</ScrollArea>

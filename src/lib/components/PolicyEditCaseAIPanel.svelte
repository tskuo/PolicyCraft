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
			message: `I am an AI assistant who can help brainstorm cases that illustrate the application of the policy, or cases that reveal the potential flaw of the policy. Please click the buttons below to see some examples.
`
		}
	];
	let loading = false;
	let showGenerateCaseBtn = true;
	let showInstructionInput = false;
	let iterateInstruction = '';
	let suggestedCase = '';
	let showRestartBtn = false;

	const messageExample = `Cases illustrate the policy`;
	const messageCounterExample = 'Cases reveal the policy flaws';
	const promptIllustrativeAllowCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario of a student in a university computer science course where the character abides by the following policy: `;
	const promptIllustrativeDisallowCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario of a student in a university computer science course where the character violates the following policy: `;
	const promptFlawAllowCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario of a student in a university computer science course where the student technically abides by the following policy but undermines the policy's intent: `;
	const promptFlawDisallowCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario of a student in a university computer science course where the student technically violates the following policy despite genuinely trying to comply: `;
	const promptFlawUnclearCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario of a student in a university computer science course where it is unclear whether the character violates the following policy or not: `;

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

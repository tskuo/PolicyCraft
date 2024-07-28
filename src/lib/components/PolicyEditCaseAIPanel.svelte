<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import Button from './ui/button/button.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let policyDescription;

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

	const generateCase = async (message: string, category: string) => {
		messageHistory = [...messageHistory, { person: 'You', message: message }];
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

			messageHistory = [
				...messageHistory,
				{ person: 'AI Assistant', message: label },
				{ person: 'AI Assistant', message: data.text },
				{
					person: 'AI Assistant',
					message: `Please provide instructions on how you would like to iterate on the suggested case. If this case looks good, consider creating a new case by clicking the "create new case" button. You may also restart the conversation.`
				}
			];

			showInstructionInput = true;
			iterateInstruction = '';
			showRestartBtn = true;
		} else {
			messageHistory = [
				...messageHistory,
				{
					person: 'AI Assistant',
					message: 'Sorry, something went wrong. Please try again.'
				}
			];
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
			messageHistory = [
				...messageHistory,
				{ person: 'AI Assistant', message: `Here is the revised case:` },
				{ person: 'AI Assistant', message: data.text },
				{
					person: 'AI Assistant',
					message: `Please provide instructions on how you would like to iterate on the suggested case. If this case looks good, consider creating a new case by clicking the "create new case" button. You may also restart the conversation.`
				}
			];
			showInstructionInput = true;
			iterateInstruction = '';
			showRestartBtn = true;
		} else {
			messageHistory = [
				...messageHistory,
				{
					person: 'AI Assistant',
					message:
						'Sorry, something went wrong. Please try again. Please choose whether you would like to create a policy or a case.'
				}
			];
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
				on:click={() => generateCase(messageExample, 'illustrative')}
			>
				{messageExample}
			</Button>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={() => generateCase(messageCounterExample, 'flaw')}
			>
				{messageCounterExample}
			</Button>
		{/if}
		{#if showInstructionInput}
			<div class="mx-3 mt-1">
				<Input
					placeholder={'Please edit the case so that ...'}
					bind:value={iterateInstruction}
					on:keypress={(e) => {
						if (e.key === 'Enter') {
							showInstructionInput = false;
							messageHistory = [
								...messageHistory,
								{
									person: 'You',
									message: iterateInstruction
								}
							];
							iterateCase();
						}
					}}
				/>
			</div>
		{/if}
		{#if showRestartBtn}
			<Button
				variant="secondary"
				class="mx-3"
				on:click={() => {
					messageHistory = [
						...messageHistory,
						{
							person: 'AI Assistant',
							message: `To restart, please click the buttons below to see some examples.`
						}
					];
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

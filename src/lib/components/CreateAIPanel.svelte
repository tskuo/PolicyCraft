<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Button from './ui/button/button.svelte';

	export let cases;
	export let policies;

	let messageHistory: any[] = [
		{
			person: 'AI Assistant',
			message: `I am an AI assistant who can help brainstorm a new policy based on selected cases, or brainstorm a new case based on a given policy. To get started, please choose whether you would like to create a policy or a case.`
		}
	];

	let loading = false;
	let showPolicyOrCaseBtn = true;
	let showPolicySelector = false;
	let selectedPolicyId = '';
	let showPolicyEditLink = false;
	let showCaseSelector = false;
	let selectedCases: string[] = [];
	let selectedCaseLabels: string[] = [];
	let showLabelBtn = false;
	let showInstructionInput = false;
	let iterateInstruction = '';
	let suggestedPolicy = '';
	let showRestartBtn = false;

	let aiLogsDocId = '';

	const resetButtonAndData = () => {
		showRestartBtn = false;

		// reset buttons
		showPolicySelector = false;
		selectedPolicyId = '';
		showPolicyEditLink = false;
		showCaseSelector = false;
		selectedCases = [];
		selectedCaseLabels = [];
		showLabelBtn = false;
		showInstructionInput = false;
		iterateInstruction = '';
		suggestedPolicy = '';

		showPolicyOrCaseBtn = true;
	};

	const updateMessageHistory = async (person: string, message: string) => {
		messageHistory = [...messageHistory, { person, message }];
		if (aiLogsDocId == '') {
			const res = await fetch(`/api/assistant/ailogs`, {
				method: 'POST',
				body: JSON.stringify({
					action: 'createAI',
					messageHistory: messageHistory,
					entity: '',
					entityId: ''
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

	const generatePolicy = async () => {
		showCaseSelector = false;
		loading = true;
		await updateMessageHistory('You', `See the suggested new policy`);

		let prompt = `You are a helpful assistant focusing on supporting users in creating a new course policy. In a few sentences, propose a course policy that meets the following criteria.`;

		for (const [i, value] of selectedCases.entries()) {
			prompt =
				prompt +
				` ` +
				(i + 1).toString() +
				`. The policy should ` +
				selectedCaseLabels[i] +
				` the following scenario: ` +
				value;
		}
		const res = await fetch('/api/assistant/policy', {
			method: 'POST',
			body: JSON.stringify({
				prompt: prompt
			})
		});
		if (res.ok) {
			const data = await res.json();
			suggestedPolicy = data.text;
			await updateMessageHistory(
				'AI Assistant',
				`Here is the suggested policy based on the cases you selected:`
			);
			await updateMessageHistory('AI Assistant', data.text);
			await updateMessageHistory(
				'AI Assistant',
				`You may use the suggested content to create a new policy. Alternatively, you may provide instructions on how you would like to iterate on the suggested content or restart the conversation.`
			);
			showInstructionInput = true;
			loading = false;
		} else {
			await updateMessageHistory(
				'AI Assistant',
				'Sorry, something went wrong. Please restart and try again.'
			);
			loading = false;
		}
	};

	const iteratePolicy = async () => {
		let prompt =
			`You are a helpful assistant focusing on supporting users in editing the following course policy: ` +
			suggestedPolicy +
			` In a few sentences, slightly revise the policy without significant changes based on the following instructions: ` +
			iterateInstruction;
		const res = await fetch('/api/assistant/policy', {
			method: 'POST',
			body: JSON.stringify({
				prompt: prompt
			})
		});
		if (res.ok) {
			const data = await res.json();
			suggestedPolicy = data.text;
			await updateMessageHistory('AI Assistant', `Here is the revised policy:`);
			await updateMessageHistory('AI Assistant', data.text);
			await updateMessageHistory(
				'AI Assistant',
				`You may use the suggested content to create a new policy. Alternatively, you may provide instructions on how you would like to iterate on the suggested content or restart the conversation.`
			);
			showInstructionInput = true;
		} else {
			await updateMessageHistory(
				'AI Assistant',
				'Sorry, something went wrong. Please restart and try again.'
			);
		}
		iterateInstruction = '';
	};
</script>

<h3 class="font-semibold mt-2 mb-4">Brainstorm with AI</h3>
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
		{#if showPolicyOrCaseBtn}
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					showPolicyOrCaseBtn = false;
					loading = true;
					await updateMessageHistory('You', 'Create a policy.');
					await updateMessageHistory(
						'AI Assistant',
						`Select a case you'd like to build upon for creating the policy. You may select additional cases later if needed. You may view the details of individual cases in the case repository. If none of the cases are relevant to the policy you're about to create, feel free to create a new case first. This will allow me to assist you in creating a policy based on that case.`
					);
					selectedCases = []; // this is supposed to be empty
					selectedCaseLabels = []; // this is supposed to be empty
					showCaseSelector = true;
					loading = false;
					showRestartBtn = true;
				}}>Policy</Button
			>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					showPolicyOrCaseBtn = false;
					loading = true;
					await updateMessageHistory('You', 'Create a case.');
					await updateMessageHistory(
						'AI Assistant',
						`Select a policy for which you'd like to brainstorm related cases.`
					);
					showPolicySelector = true;
					loading = false;
					showRestartBtn = true;
				}}>Case</Button
			>
		{/if}
		{#if showPolicySelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={async (v) => {
						showPolicySelector = false;
						loading = true;
						await updateMessageHistory('You', v?.label);
						await updateMessageHistory(
							'AI Assistant',
							`Please click the link below to visit the policy page, where the AI assistant can help brainstorm related cases based on the selected policy.`
						);
						selectedPolicyId = v?.value;
						showPolicyEditLink = true;
						loading = false;
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Select a policy" />
					</Select.Trigger>
					<Select.Content>
						{#each policies as p (p.id)}
							<Select.Item value={p.id} label={p.title} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
		{#if showPolicyEditLink}
			<Button variant="secondary" class="mx-3" href="/policies/{selectedPolicyId}/editcase">
				Visit policy edit page
			</Button>
		{/if}
		{#if showCaseSelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={async (v) => {
						showCaseSelector = false;
						loading = true;
						selectedCases = [...selectedCases, v?.value];
						await updateMessageHistory('You', v?.label);
						await updateMessageHistory(
							'AI Assistant',
							`Should this case be allowed or disallowed by the policy you are about to create?`
						);
						showLabelBtn = true;
						loading = false;
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Select a case" />
					</Select.Trigger>
					<Select.Content>
						{#each cases as c (c.id)}
							<Select.Item value={c.description} label={c.title} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			{#if selectedCases.length > 0}
				<Button
					variant="secondary"
					class="mx-3"
					on:click={async () => {
						await generatePolicy();
					}}
				>
					See the suggested new policy
				</Button>
			{/if}
		{/if}
		{#if showLabelBtn}
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					showLabelBtn = false;
					loading = true;
					selectedCaseLabels = [...selectedCaseLabels, 'allow'];
					await updateMessageHistory('You', 'Allow');
					await updateMessageHistory(
						'AI Assistant',
						`Select additional cases to build upon, or see the suggested new policy based on the cases you have already selected.`
					);
					showCaseSelector = true;
					loading = false;
				}}>Allow</Button
			>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					showLabelBtn = false;
					loading = true;
					selectedCaseLabels = [...selectedCaseLabels, 'disallow'];
					await updateMessageHistory('You', 'Disallow');
					await updateMessageHistory(
						'AI Assistant',
						`Select additional cases to build upon, or see the suggested new policy based on the cases you have already selected.`
					);
					showCaseSelector = true;
					loading = false;
				}}>Disallow</Button
			>
		{/if}
		{#if showInstructionInput}
			<div class="mx-3 mt-1">
				<Input
					placeholder={'Please edit the policy so that ...'}
					bind:value={iterateInstruction}
					on:keypress={async (e) => {
						if (e.key === 'Enter') {
							showInstructionInput = false;
							loading = true;
							await updateMessageHistory('You', iterateInstruction);
							await iteratePolicy();
							loading = false;
						}
					}}
				/>
			</div>
		{/if}
		{#if showRestartBtn}
			<Button
				bind:disabled={loading}
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					resetButtonAndData();
					await updateMessageHistory(
						'AI Assistant',
						`To restart, please choose whether you would like to create a policy or a case.`
					);
				}}>Restart</Button
			>
		{/if}
	</div>
</ScrollArea>

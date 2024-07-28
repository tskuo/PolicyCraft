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
			message: `I am an AI assistant here to help you brainstorm a new policy based on selected cases, or brainstorm a new case based on a given policy. To get started, please choose whether you would like to create a policy or a case.`
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
		await updateMessageHistory('You', `See the suggested new policy`);
		showCaseSelector = false;
		loading = true;
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
			await updateMessageHistory('AI Assistant', `Here is the suggested policy:`);
			await updateMessageHistory('AI Assistant', data.text);
			await updateMessageHistory(
				'AI Assistant',
				`Please provide instructions on how you would like to iterate on the suggested policy. You may also create a policy based on the suggested content or restart the conversation.`
			);
			showInstructionInput = true;
			showRestartBtn = true;
		} else {
			await updateMessageHistory(
				'AI Assistant',
				'Sorry, something went wrong. Please try again. Please choose whether you would like to create a policy or a case.'
			);
			showPolicyOrCaseBtn = true;
		}
		loading = false;
	};

	const iteratePolicy = async () => {
		loading = true;
		showRestartBtn = false;
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
			await updateMessageHistory('AI Assistant', `Here is the suggested policy:`);
			await updateMessageHistory('AI Assistant', data.text);
			await updateMessageHistory(
				'AI Assistant',
				`Please provide instructions on how you would like to iterate on the suggested policy. You may also restart the conversation.`
			);
			showInstructionInput = true;
			showRestartBtn = true;
		} else {
			await updateMessageHistory(
				'AI Assistant',
				'Sorry, something went wrong. Please try again. Please choose whether you would like to create a policy or a case.'
			);
			showPolicyOrCaseBtn = true;
		}
		iterateInstruction = '';
		loading = false;
		showRestartBtn = true;
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
					await updateMessageHistory('You', 'Create a policy.');
					await updateMessageHistory(
						'AI Assistant',
						`Select a case you'd like to build upon for creating the policy. You may view the details of individual cases in the case repository. You may select additional cases later if needed.`
					);
					showCaseSelector = true;
					selectedCases = [];
					selectedCaseLabels = [];
				}}>Policy</Button
			>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					showPolicyOrCaseBtn = false;
					await updateMessageHistory('You', 'Create a case.');
					await updateMessageHistory(
						'AI Assistant',
						`Select a policy for which you'd like to brainstorm related cases.`
					);
					showPolicySelector = true;
				}}>Case</Button
			>
		{/if}
		{#if showPolicySelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={async (v) => {
						await updateMessageHistory('You', v?.label);
						await updateMessageHistory(
							'AI Assistant',
							`Please click the link below to visit the policy page, where the AI assistant can help brainstorm related cases based on the selected policy.`
						);
						selectedPolicyId = v?.value;
						showPolicySelector = false;
						showPolicyEditLink = true;
						showRestartBtn = true;
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
						await updateMessageHistory('You', v?.label);
						await updateMessageHistory(
							'AI Assistant',
							`Should this case be allowed or disallowed by the policy you are about to create?`
						);
						selectedCases = [...selectedCases, v?.value];
						showCaseSelector = false;
						showLabelBtn = true;
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
					selectedCaseLabels = [...selectedCaseLabels, 'allow'];
					await updateMessageHistory('You', 'Allow');
					await updateMessageHistory(
						'AI Assistant',
						`Select another case to build upon, or see the suggested new policy based on the cases you have already selected.`
					);
					showLabelBtn = false;
					showCaseSelector = true;
				}}>Allow</Button
			>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					selectedCaseLabels = [...selectedCaseLabels, 'disallow'];
					await updateMessageHistory('You', 'Disallow');
					await updateMessageHistory(
						'AI Assistant',
						`Select another case to build upon, or see the suggested new policy based on the cases you have already selected.`
					);
					showLabelBtn = false;
					showCaseSelector = true;
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
							await updateMessageHistory('You', iterateInstruction);
							await iteratePolicy();
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
						`To restart, please choose whether you would like to create a policy or a case.`
					);

					showPolicyEditLink = false;
					showPolicyOrCaseBtn = true;
					showInstructionInput = false;
					showRestartBtn = false;

					showPolicySelector = false;
					selectedPolicyId = '';
					showCaseSelector = false;
					selectedCases = [];
					selectedCaseLabels = [];
					showLabelBtn = false;
					iterateInstruction = '';
					suggestedPolicy = '';
				}}>Restart</Button
			>
		{/if}
	</div>
</ScrollArea>

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
	let showLinkAndRestartBtn = false;
	let showCaseSelector = false;
	let selectedCases: string[] = [];
	let selectedCaseLabels: string[] = [];
	let showLabelBtn = false;

	const generatePolicy = async () => {
		messageHistory = [
			...messageHistory,
			{ person: 'You', message: `See the suggested new policy` }
		];
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

			messageHistory = [
				...messageHistory,
				{ person: 'AI Assistant', message: `Here is the suggested policy:` },
				{ person: 'AI Assistant', message: data.text }
			];
		} else {
			messageHistory = [
				...messageHistory,
				{
					person: 'AI Assistant',
					message: 'Sorry, something went wrong. Please try again.'
				}
			];
		}
		messageHistory = [
			...messageHistory,
			{
				person: 'AI Assistant',
				message: `To restart, please choose whether you would like to create a policy or a case.`
			}
		];
		loading = false;
		showPolicyOrCaseBtn = true;
	};
</script>

<h3 class="font-bold text-lg mt-1 mb-4">Brainstorm with AI</h3>
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
				on:click={() => {
					showPolicyOrCaseBtn = false;
					messageHistory = [
						...messageHistory,
						{
							person: 'You',
							message: 'Create a policy.'
						},
						{
							person: 'AI Assistant',
							message: `Select a case you'd like to build upon for creating the policy. You can select additional cases later if needed.`
						}
					];
					showCaseSelector = true;
					selectedCases = [];
					selectedCaseLabels = [];
				}}>Policy</Button
			>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={() => {
					showPolicyOrCaseBtn = false;
					messageHistory = [
						...messageHistory,
						{
							person: 'You',
							message: 'Create a case.'
						},
						{
							person: 'AI Assistant',
							message: `Select a policy for which you'd like to brainstorm related cases.`
						}
					];
					showPolicySelector = true;
				}}>Case</Button
			>
		{/if}
		{#if showPolicySelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={(v) => {
						messageHistory = [
							...messageHistory,
							{
								person: 'You',
								message: v?.label
							},
							{
								person: 'AI Assistant',
								message: `Please click the link below to visit the policy page, where the AI assistant can help brainstorm related cases based on the selected policy.`
							}
						];
						selectedPolicyId = v?.value;
						showPolicySelector = false;
						showLinkAndRestartBtn = true;
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
		{#if showLinkAndRestartBtn}
			<Button variant="secondary" class="mx-3" href="/policies/{selectedPolicyId}/editcase"
				>Visit policy edit page</Button
			>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={() => {
					messageHistory = [
						...messageHistory,
						{
							person: 'AI Assistant',
							message: `To restart, please choose whether you would like to create a policy or a case.`
						}
					];
					showLinkAndRestartBtn = false;
					showPolicyOrCaseBtn = true;
				}}>Restart</Button
			>
		{/if}
		{#if showCaseSelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={(v) => {
						messageHistory = [
							...messageHistory,
							{
								person: 'You',
								message: v?.label
							},
							{
								person: 'AI Assistant',
								message: `Should this case be allowed or disallowed by the policy you are about to create?`
							}
						];
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
				<Button variant="secondary" class="mx-3" on:click={() => generatePolicy()}>
					See the suggested new policy
				</Button>
			{/if}
		{/if}
		{#if showLabelBtn}
			<Button
				variant="secondary"
				class="mx-3"
				on:click={() => {
					selectedCaseLabels = [...selectedCaseLabels, 'allow'];
					messageHistory = [
						...messageHistory,
						{
							person: 'You',
							message: 'Allow'
						},
						{
							person: 'AI Assistant',
							message: `Select another case to build upon, or see the suggested new policy based on the cases you have already selected.`
						}
					];
					showLabelBtn = false;
					showCaseSelector = true;
				}}>Allow</Button
			>
			<Button
				variant="secondary"
				class="mx-3"
				on:click={() => {
					selectedCaseLabels = [...selectedCaseLabels, 'disallow'];
					messageHistory = [
						...messageHistory,
						{
							person: 'You',
							message: 'Disallow'
						},
						{
							person: 'AI Assistant',
							message: `Select another case to build upon, or see the suggested new policy based on the cases you have already selected.`
						}
					];
					showLabelBtn = false;
					showCaseSelector = true;
				}}>Disallow</Button
			>
		{/if}
	</div>
</ScrollArea>

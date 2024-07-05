<script lang="ts">
	import Button from './ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { unknown } from 'zod';

	export let cases;
	export let policyDescription;

	let messageHistory: any[] = [
		{
			person: 'AI Assistant',
			message: `Hi, I am an AI assistant who can help brainstorm policy edits to cover specific related cases. Please select a related case below and specify whether it should be allowed by the policy.`
		}
	];
	const messageAskLabel = {
		person: 'AI Assistant',
		message: `Should this case be allowed or disallowed by the policy?`
	};
	let loading = false;
	let selectedCaseDescription = '';
	let showSelect = true;
	let showButtons = false;

	const generatePolicy = async (label: string) => {
		showButtons = false;
		loading = true;
		messageHistory = [
			...messageHistory,
			{
				person: 'You',
				message: label == 'allow' ? 'This should be allowed' : 'This should be disallowed'
			}
		];

		const res = await fetch('/api/assistant/policy', {
			method: 'POST',
			body: JSON.stringify({
				prompt:
					`You are a helpful assistant focusing on supporting users' revision of the following policy: ` +
					policyDescription +
					` In a few sentences, slightly revise the policy without significant changes so that the policy ` +
					label +
					` the following scenario: ` +
					selectedCaseDescription
			})
		});

		if (res.ok) {
			const data = await res.json();

			messageHistory = [
				...messageHistory,
				{ person: 'AI Assistant', message: `Here is the suggested policy edit: ` + data.text }
			];
			loading = false;
			showSelect = true;
		} else {
			messageHistory = [
				...messageHistory,
				{
					person: 'AI Assistant',
					message: 'Sorry, something went wrong. Please try again.'
				}
			];
			loading = false;
			showSelect = true;
		}
	};
</script>

<h3 class="font-bold text-lg my-2">Brainstorm with AI</h3>
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
		{#if showSelect}
			<div class="mx-3">
				<Select.Root
					onSelectedChange={(v) => {
						selectedCaseDescription = v.value;

						messageHistory = [
							...messageHistory,
							{
								person: 'You',
								message: v?.label
							},
							messageAskLabel
						];
						showSelect = false;
						showButtons = true;
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Select a related case" />
					</Select.Trigger>
					<Select.Content>
						{#each [...cases] as [_, c], i}
							<Select.Item value={c.description} label={c.title} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}

		{#if showButtons}
			<Button
				variant="secondary"
				class="mx-3"
				disabled={loading}
				on:click={() => generatePolicy('allow')}>This should be allowed</Button
			>
			<Button
				variant="secondary"
				class="mx-3"
				disabled={loading}
				on:click={() => generatePolicy('disallow')}>This should be disallowed</Button
			>
		{/if}
	</div>
</ScrollArea>

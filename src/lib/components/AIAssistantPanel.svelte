<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let policyDescription;

	let messageHistory: any[] = [];
	let loading = false;

	const messageExample = 'Generate an example case';
	const messageCounterExample = 'Generate a counterexample case';
	const promptExample =
		'In three sentence, provide a short example scenario that follows the following policy: ';
	const promptCounterExample =
		'In three sentences, provide a short example scenario that is unclear whether the following policy allows it or not: ';

	const generateCase = async (message: string, category: string) => {
		messageHistory = [...messageHistory, { person: 'You', message: message }];
		loading = true;

		const prompt = category == 'example' ? promptExample : promptCounterExample;
		const res = await fetch('/api/assistant/case', {
			method: 'POST',
			body: JSON.stringify({
				prompt: prompt + policyDescription
			})
		});
		if (res.ok) {
			const data = await res.json();
			messageHistory = [...messageHistory, { person: 'AI Assistant', message: data.text }];
			loading = false;
		} else {
			messageHistory = [
				...messageHistory,
				{
					person: 'AI Assistant',
					message: 'Sorry, something went wrong. Please try again.'
				}
			];
			loading = false;
		}
	};
</script>

<h3 class="font-bold text-lg mt-2">AI Assistant</h3>
<div class="text-sm">
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
<div class="flex flex-col space-y-2 mt-2">
	<Button
		variant="secondary"
		disabled={loading}
		on:click={() => generateCase(messageExample, 'example')}
	>
		{messageExample}
	</Button>
	<Button
		variant="secondary"
		disabled={loading}
		on:click={() => generateCase(messageCounterExample, 'counterexample')}
	>
		{messageCounterExample}
	</Button>
</div>

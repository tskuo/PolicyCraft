<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let policyDescription;

	let messageHistory: any[] = [
		{
			person: 'AI Assistant',
			message: `Hi, I am an AI assistant who can help brainstorm cases that illustrate the application of the policy, or cases that reveal the potential flaw of the policy. Please click the buttons below to see some examples.
`
		}
	];
	let loading = false;

	const messageExample = `Cases illustrate the policy`;
	const messageCounterExample = 'Cases reveal the policy flaws';
	const promptIllustrativeAllowCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario with a character in the context of a university classroom where the character abides by the following policy: `;
	const promptIllustrativeDisallowCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario with a character in the context of a university classroom where the character violates the following policy: `;
	const promptFlawAllowCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario with a character in the context of a university classroom where the character abides by the following policy, but most people might think it should not be allowed: `;
	const promptFlawDisallowCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario with a character in the context of a university classroom where the character violates the following policy, but most people might think it should be allowed: `;
	const promptFlawUnclearCase = `You are a helpful assistant focusing on supporting users' reflections on a given policy. In a few sentences, provide an example scenario with a character in the context of a university classroom where it is unclear whether the character violates the following policy: `;

	const generateCase = async (message: string, category: string) => {
		messageHistory = [...messageHistory, { person: 'You', message: message }];
		loading = true;

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
				label = `The policy may allow the following case but most people might think it should not be allowed: `;
			} else if (i == 1) {
				prompt = promptFlawDisallowCase;
				label = `The policy may disallow the following case but most people might think it should be allowed: `;
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

			messageHistory = [...messageHistory, { person: 'AI Assistant', message: label + data.text }];
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
		<Button
			variant="secondary"
			class="mx-3"
			disabled={loading}
			on:click={() => generateCase(messageExample, 'illustrative')}
		>
			{messageExample}
		</Button>
		<Button
			variant="secondary"
			class="mx-3"
			disabled={loading}
			on:click={() => generateCase(messageCounterExample, 'flaw')}
		>
			{messageCounterExample}
		</Button>
	</div>
</ScrollArea>

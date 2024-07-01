<script lang="ts">
	import Button from './ui/button/button.svelte';

	let messageHistory: any[] = [];
</script>

<h3 class="font-bold text-lg mt-2">AI Assistant</h3>
<div class="text-sm">
	{#each messageHistory as message}
		<p class="font-bold py-2">{message.person}</p>
		<p class="bg-gray-100 rounded p-2 mb-2">
			{message.message}
		</p>
	{/each}
</div>
<div class="flex flex-col space-y-1">
	<Button
		variant="secondary"
		on:click={() => {
			messageHistory = [
				{
					person: 'You',
					message: 'Please generate an example case.'
				},
				{
					person: 'AI Assistant',
					message: 'Sure, here is an example case ...'
				}
			];
		}}>Generate an example case</Button
	>
	<Button variant="secondary">Generate a countering case</Button>
</div>

<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.js';
	import { messageCreateFormSchema, type MessageCreateFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let discussions: any[] = [];

	export let data: SuperValidated<Infer<MessageCreateFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(messageCreateFormSchema)
	});

	const { form: formData, enhance } = form;

	$: openDiscussions = discussions.filter((discussion) => discussion.open == true);
	$: closedDiscussion = discussions.filter((discussion) => discussion.open == false);
</script>

<h3 class="font-bold text-lg mt-2">Discussions</h3>
<Tabs.Root value="open" class="w-full mt-4">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="open">Open</Tabs.Trigger>
		<Tabs.Trigger value="closed">Closed</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="open" class="mx-1">
		<Accordion.Root>
			{#if openDiscussions.length > 0}
				{#each openDiscussions as discussion}
					<Accordion.Item value={discussion.id} class="text-sm">
						<Accordion.Trigger>{discussion.title}</Accordion.Trigger>
						<Accordion.Content>
							{#each discussion.comments as comment}
								<p class="font-bold py-2">{comment.userId}</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									{comment.message}
								</p>
							{/each}
							<!-- <Textarea placeholder="Type your message here." class="mt-4 outline-none" /> -->
							<form method="POST" use:enhance action="?/createMessage">
								<Form.Field {form} name="message">
									<Form.Control let:attrs>
										<!-- <Form.Label>Description</Form.Label> -->
										<Textarea
											{...attrs}
											bind:value={$formData.message}
											placeholder="Type your message here."
											class="mt-4 outline-none"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="id">
									<Form.Control let:attrs>
										<Input type="hidden" {...attrs} value={discussion.id} />
									</Form.Control>
								</Form.Field>
								<Form.Button>Submit</Form.Button>
							</form>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			{:else}
				<p class="text-sm mt-4">There are no open discussions.</p>
			{/if}
		</Accordion.Root>
	</Tabs.Content>
	<Tabs.Content value="closed" class="mx-1">
		<Accordion.Root>
			{#if closedDiscussion.length > 0}
				{#each closedDiscussion as discussion}
					<Accordion.Item value={discussion.id} class="text-sm">
						<Accordion.Trigger>{discussion.title}</Accordion.Trigger>
						<Accordion.Content>
							{#each discussion.comments as comment}
								<p class="font-bold py-2">{comment.userId}</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									{comment.message}
								</p>
							{/each}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			{:else}
				<p class="text-sm mt-4">There are no closed discussions.</p>
			{/if}
		</Accordion.Root>
	</Tabs.Content>
</Tabs.Root>

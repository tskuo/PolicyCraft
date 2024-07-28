<script lang="ts">
	import { page } from '$app/stores';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		messageCreateFormSchema,
		discussionCreateFormSchema,
		type DiscussionCreateFormSchema,
		type MessageCreateFormSchema
	} from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import { LoaderCircle, Plus, Send } from 'lucide-svelte/icons';
	import { invalidateAll } from '$app/navigation';

	export let discussions: any[] = [];
	export let dataMessage: SuperValidated<Infer<MessageCreateFormSchema>>;
	export let dataDiscussion: SuperValidated<Infer<DiscussionCreateFormSchema>>;
	export let userId;
	export let userDisplayNames;

	let showNewDiscussionPanel = false;
	let disableMessageSubmitBtn = false;
	let disableDiscussionSubmitBtn = false;

	const formMessage = superForm(dataMessage, {
		validators: zodClient(messageCreateFormSchema),
		onSubmit() {
			disableMessageSubmitBtn = true;
		},
		onError() {
			disableMessageSubmitBtn = false;
		},
		onUpdated() {
			disableMessageSubmitBtn = false;
		}
	});

	const formDiscussion = superForm(dataDiscussion, {
		validators: zodClient(discussionCreateFormSchema),
		onSubmit() {
			disableDiscussionSubmitBtn = true;
		},
		onError() {
			disableDiscussionSubmitBtn = false;
		},
		onUpdated({ form }) {
			if (form.valid) {
				showNewDiscussionPanel = false;
			}
			disableDiscussionSubmitBtn = false;
		}
	});

	const { form: formDataMessage, enhance: enhance1 } = formMessage;
	const { form: formDataDiscussion, enhance: enhance2 } = formDiscussion;

	$: openDiscussions = discussions.filter((discussion) => discussion.open == true);
	$: closedDiscussion = discussions.filter((discussion) => discussion.open == false);
</script>

<div class="flex items-center mt-2">
	<h3 class="font-semibold">
		{$page.url.pathname == '/'
			? 'General'
			: $page.url.pathname.startsWith('/policies')
				? 'Policy'
				: 'Case'} Discussions
	</h3>
</div>
<Tabs.Root value="open" class="w-full mt-5">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="open">Open</Tabs.Trigger>
		<Tabs.Trigger value="closed">Closed</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="open" class="mx-1">
		<Accordion.Root>
			{#if openDiscussions.length > 0}
				{#each openDiscussions as discussion}
					<Accordion.Item value={discussion.id} class="text-sm">
						<Accordion.Trigger class="capitalize">{discussion.title}</Accordion.Trigger>
						<Accordion.Content>
							{#each discussion.comments as comment}
								<p class="font-bold py-2">{userDisplayNames.get(comment.userId)}</p>
								<p
									class="rounded p-2 mb-2 {comment.userId == userId ? 'bg-sky-100' : 'bg-gray-100'}"
								>
									{comment.message}
								</p>
							{/each}
							<!-- <Textarea placeholder="Type your message here." class="mt-4 outline-none" /> -->
							<form
								method="POST"
								use:enhance1
								action="?/createMessage"
								class="flex w-full items-center"
							>
								<Form.Field form={formMessage} name="id">
									<Form.Control let:attrs>
										<Input type="hidden" {...attrs} value={discussion.id} />
									</Form.Control>
								</Form.Field>
								<Form.Field form={formMessage} name="message" class="space-y-0 mr-1 grow">
									<Form.Control let:attrs>
										<Input
											{...attrs}
											bind:value={$formDataMessage.message}
											class="outline-none"
											placeholder="Type your message"
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Button size="icon" disabled={disableMessageSubmitBtn}>
									{#if disableMessageSubmitBtn}
										<LoaderCircle class="h-4 w-4 animate-spin" />
									{:else}
										<Send class="h-4 w-4" />
									{/if}
								</Form.Button>
							</form>
							{#if discussion.userId == userId}
								<Button
									variant="secondary"
									class="mt-6 w-full"
									disabled={!discussion.open}
									on:click={async () => {
										discussion.open = false;
										await fetch(`/api/discussions/${discussion.id}`, {
											method: 'PATCH',
											body: JSON.stringify({ action: 'closeDiscussion' })
										});
										invalidateAll();
									}}
								>
									Close discussion thread
								</Button>
							{/if}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			{/if}
		</Accordion.Root>
		<div class="mt-2"></div>
		{#if showNewDiscussionPanel}
			<form method="POST" use:enhance2 action="?/createDiscussion">
				<Form.Field form={formDiscussion} name="title">
					<Form.Control let:attrs>
						<Input
							{...attrs}
							bind:value={$formDataDiscussion.title}
							placeholder="New discussion title"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field form={formDiscussion} name="message">
					<Form.Control let:attrs>
						<Textarea
							{...attrs}
							bind:value={$formDataDiscussion.message}
							placeholder="New discussion message"
							class="mt-2 outline-none"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button disabled={disableDiscussionSubmitBtn}>
					{#if disableDiscussionSubmitBtn}
						<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
					{/if}
					Submit
				</Form.Button>
				{#if !disableDiscussionSubmitBtn}
					<Button
						variant="secondary"
						on:click={() => {
							showNewDiscussionPanel = false;
						}}>Cancel</Button
					>
				{/if}
			</form>
		{:else}
			<Button
				variant="ghost"
				class="w-full"
				on:click={() => (showNewDiscussionPanel = !showNewDiscussionPanel)}
				><Plus class="h-4 w-4 mr-2" />New discussion</Button
			>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="closed" class="mx-1">
		<Accordion.Root>
			{#if closedDiscussion.length > 0}
				{#each closedDiscussion as discussion}
					<Accordion.Item value={discussion.id} class="text-sm">
						<Accordion.Trigger class="capitalize">{discussion.title}</Accordion.Trigger>
						<Accordion.Content>
							{#each discussion.comments as comment}
								<p class="font-bold py-2">{userDisplayNames.get(comment.userId)}</p>
								<p
									class="rounded p-2 mb-2 {comment.userId == userId ? 'bg-sky-100' : 'bg-gray-100'}"
								>
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

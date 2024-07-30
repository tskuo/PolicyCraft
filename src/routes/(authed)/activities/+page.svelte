<script lang="ts">
	import type { PageData } from './$types.js';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';
	import { BookText, Folder, MessageCircle, MessageCircleMore, MessageSquare } from 'lucide-svelte';

	export let data: PageData;
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<Table.Root>
			{#if data.userActionLogs.length == 0}
				<Table.Caption>You don't have any activities</Table.Caption>
			{/if}
			<Table.Header>
				<Table.Row class="hover:bg-trasparent">
					<Table.Head>Time</Table.Head>
					<Table.Head>Action</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.userActionLogs as actionLogs}
					<Table.Row
						class="hover:cursor-pointer"
						on:click={() => {
							let gotoURL = `/${actionLogs.targetCollection}/${actionLogs.targetDocumentId}`;
							if (actionLogs.action == 'createReason') {
								gotoURL = `/${actionLogs.linkedEntity}/${actionLogs.linkedEntityId}`;
							} else if (
								actionLogs.action == 'createDiscussion' ||
								actionLogs.action == 'createComment'
							) {
								if (actionLogs.linkedEntity == 'meta') {
									gotoURL = '/';
								} else {
									gotoURL = `/${actionLogs.linkedEntity}/${actionLogs.linkedEntityId}`;
								}
							}
							goto(gotoURL);
						}}
					>
						<Table.Cell>
							{new Date(actionLogs.createAt).toLocaleString([], {
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								hour12: false
							})}
						</Table.Cell>
						<Table.Cell>
							{#if actionLogs.action == 'createPolicy'}
								<BookText class="w-4 h-4 mr-2 inline-block" />create policy
							{:else if actionLogs.action == 'createCase'}
								<Folder class="w-4 h-4 mr-2 inline-block" />create case
							{:else if actionLogs.action == 'editPolicy'}
								<BookText class="w-4 h-4 mr-2 inline-block" />edit policy
							{:else if actionLogs.action == 'editRelatedCaseLabelWhileEditingPolicy'}
								<Folder class="w-4 h-4 mr-2 inline-block" />edit related case label
							{:else if actionLogs.action == 'addRelatedCase'}
								<Folder class="w-4 h-4 mr-2 inline-block" />add related case to policy
							{:else if actionLogs.action == 'editRelatedCaseLabel'}
								<Folder class="w-4 h-4 mr-2 inline-block" />edit related case label
							{:else if actionLogs.action == 'removeRelatedCases'}
								<Folder class="w-4 h-4 mr-2 inline-block" />remove related case from policy
							{:else if actionLogs.action == 'createReason'}
								<MessageCircleMore class="w-4 h-4 mr-2 inline-block" />create reason
							{:else if actionLogs.action == 'createDiscussion'}
								<MessageSquare class="w-4 h-4 mr-2 inline-block" />create discussion
							{:else if actionLogs.action == 'createComment'}
								<MessageSquare class="w-4 h-4 mr-2 inline-block" />reply discussion
							{:else}
								{actionLogs.action}
							{/if}</Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>

		<!-- <h3 class="font-bold my-2">Discussions you started:</h3>
		<Table.Root>
			{#if data.discussionInit.length == 0}
				<Table.Caption>You haven't started any discussions</Table.Caption>
			{/if}
			<Table.Header>
				<Table.Row class="hover:bg-trasparent">
					<Table.Head>Title</Table.Head>
					<Table.Head class="text-right">Entity</Table.Head>
					<Table.Head class="text-right">Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.discussionInit as discussion}
					<Table.Row
						class="w-full hover:cursor-pointer"
						on:click={() => {
							goto(
								discussion.targetEntity == 'meta'
									? '/'
									: `/${discussion.targetEntity}/${discussion.targetEntityId}`
							);
						}}
					>
						<Table.Cell class="capitalize">{discussion.title}</Table.Cell>
						<Table.Cell class="text-right"
							>{discussion.targetEntity == 'meta' ? 'general' : discussion.targetEntity}</Table.Cell
						>
						<Table.Cell class="text-right {discussion.open ? 'text-green-500' : 'text-red-400'}"
							>{discussion.open ? 'open' : 'closed'}</Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<h3 class="font-bold mt-6 mb-2">Discussions you participated:</h3>
		<Table.Root>
			{#if data.discussionParticipate.length == 0}
				<Table.Caption>You haven't participated in any discussions</Table.Caption>
			{/if}
			<Table.Header>
				<Table.Row class="hover:bg-trasparent">
					<Table.Head>Title</Table.Head>
					<Table.Head class="text-right">Entity</Table.Head>
					<Table.Head class="text-right">Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.discussionParticipate as discussion}
					<Table.Row
						class="w-full hover:cursor-pointer"
						on:click={() => {
							goto(
								discussion.targetEntity == 'meta'
									? '/'
									: `/${discussion.targetEntity}/${discussion.targetEntityId}`
							);
						}}
					>
						<Table.Cell class="capitalize">{discussion.title}</Table.Cell>
						<Table.Cell class="text-right"
							>{discussion.targetEntity == 'meta' ? 'about' : discussion.targetEntity}</Table.Cell
						>
						<Table.Cell class="text-right {discussion.open ? 'text-green-500' : 'text-red-400'}"
							>{discussion.open ? 'open' : 'closed'}</Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root> -->
	</div>
</div>

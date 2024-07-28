<script lang="ts">
	import type { PageData } from './$types.js';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';

	export let data: PageData;
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<h3 class="font-bold my-2">Discussions you started:</h3>
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
		</Table.Root>
	</div>
</div>

<script lang="ts">
	import type { PageData } from './$types.js';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';
	import { BookText, Folder } from 'lucide-svelte';

	export let data: PageData;
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<h1 class="font-semibold my-2">My Notifications</h1>
		<Table.Root>
			{#if data.userNotifications.length == 0}
				<Table.Caption>You don't have any notifications</Table.Caption>
			{/if}
			<Table.Header>
				<Table.Row class="hover:bg-trasparent">
					<Table.Head>Time</Table.Head>
					<Table.Head>Action</Table.Head>
					<!-- <Table.Head>Status</Table.Head> -->
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.userNotifications as notification}
					<Table.Row
						class="hover:cursor-pointer"
						on:click={() => {
							goto(`/${notification.targetCollection}/${notification.targetDocumentId}`);
						}}
					>
						<Table.Cell>
							{new Date(notification.createAt).toLocaleString([], {
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								hour12: false
							})}
						</Table.Cell>
						<Table.Cell>
							{#if notification.action == 'editPolicy'}
								<BookText class="w-4 h-4 mr-2 inline-block" />
								The policy that you are watching has been edited.
							{:else if notification.action == 'editRelatedCase'}
								<Folder class="w-4 h-4 mr-2 inline-block" />
								The related case of a policy that you are watching has been edited.
							{:else}
								{notification.action}
							{/if}
						</Table.Cell>
						<!-- <Table.Cell>
							{notification.read ? 'read' : 'unread'}
						</Table.Cell> -->
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

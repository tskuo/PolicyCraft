<script lang="ts">
	import type { PageData } from './$types.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Table from '$lib/components/ui/table';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Folder, BookText } from 'lucide-svelte/icons';
	export let data: PageData;

	const actionDisplayName = new Map();
	actionDisplayName.set('createPolicy', 'create policy');
	actionDisplayName.set('editPolicy', 'edit policy');
	actionDisplayName.set('addRelatedCase', 'add case');
	actionDisplayName.set('editRelatedCaseLabel', 'edit case label');
	actionDisplayName.set('editRelatedCaseLabelWhileEditingPolicy', 'edit case label');
	actionDisplayName.set('removeRelatedCases', 'remove case');
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<h3 class="my-2 md:hidden font-bold">Edit History:</h3>
		<Breadcrumb.Root class="my-2 hidden md:block">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/policies">Policy Repository</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/policies/{data.policy.id}">Policy</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Edit History</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<Accordion.Root class="w-full mt-4">
			{#each data.edits as edit}
				<Accordion.Item value={edit.id}>
					<Accordion.Trigger>
						<div class="flex text-sm font-normal w-5/6 text-left">
							<p class="basis-1/4">
								{new Date(edit.createAt).toLocaleString([], {
									year: 'numeric',
									month: 'numeric',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: false
								})}
							</p>
							<p class="basis-1/4">{data.userDisplayNames.get(edit.userId)}</p>
							<p class="basis-1/2">
								{#if actionDisplayName.get(edit.action) == 'create policy' || actionDisplayName.get(edit.action) == 'edit policy'}
									<BookText class="w-4 h-4 mr-2 inline-block" />
								{:else}
									<Folder class="w-4 h-4 mr-2 inline-block" />
								{/if}
								{actionDisplayName.get(edit.action)}
							</p>
						</div>
					</Accordion.Trigger>
					<Accordion.Content>
						{#if actionDisplayName.get(edit.action) == 'create policy' || actionDisplayName.get(edit.action) == 'edit policy'}
							<p><span class="font-semibold">Policy title:</span> {edit.input.title}</p>
							<p><span class="font-semibold">Policy description:</span> {edit.input.description}</p>
						{:else if actionDisplayName.get(edit.action) == 'remove case'}
							<p>
								<span class="font-semibold">Related case:</span>
								<span><a class="underline" href="/cases/{edit.input.title}">link</a></span>
							</p>
						{:else}
							<p>
								<span class="font-semibold">Related case:</span>
								<span><a class="underline" href="/cases/{edit.input.title}">link</a></span>
							</p>
							<p>
								<span class="font-semibold">Related case label:</span>
								{edit.input.description == 'unsure'
									? 'currently unsure under this policy'
									: `currently ${edit.input.description}ed by this policy`}
							</p>
						{/if}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</div>

<script lang="ts">
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import DiscussionPanel from '$lib/components/DiscussionPanel.svelte';
	import { Eye, Pencil, TriangleAlert } from 'lucide-svelte/icons';

	export let data;

	let showAlert = false;
	let userId = 'user1';
</script>

<div class="grid grid-cols-4">
	<div class="col-span-3 p-2">
		<div class="flex justify-between items-center">
			<Breadcrumb.Root class="my-2">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/policies">Policy Repository</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page class="capitalize">{data.policy.title}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div>
				<Toggle
					aria-label="Toggle watch"
					class="data-[state=on]:bg-sky-100"
					pressed={data.policy.watchList.includes(userId)}
					onPressedChange={async (pressed) => {
						let newWatchList;
						if (data.policy.watchList.includes(userId)) {
							newWatchList = data.policy.watchList.filter((u) => u !== userId);
						} else {
							newWatchList = [...data.policy.watchList, 'user1'];
						}
						data.policy.watchList = newWatchList;
						await fetch(`/api/policies/${data.policy.id}`, {
							method: 'PATCH',
							body: JSON.stringify({ pressed, action: 'updateWatchList' }),
							headers: {
								'Content-Type': 'application/json'
							}
						});
					}}
				>
					<Eye class="h-4 w-4 mr-2" />{data.policy.watchList.length}
				</Toggle>
				<Button href="/policies/{data.policy.id}/editpolicy">
					<Pencil class="h-4 w-4 mr-2" />Edit policy
				</Button>
			</div>
		</div>
		{#if showAlert}
			<Alert.Root class="my-4">
				<TriangleAlert class="h-4 w-4" />
				<Alert.Title>Heads up!</Alert.Title>
				<Alert.Description>
					Two cases are flagged with warnings either because their majority votes conflict with this
					policy or are unclear under this policy. If there is no agreement on a case's vote,
					discuss it on the case page. If there is agreement on a case, discuss it on this policy
					page and edit the policy as needed.
				</Alert.Description>
			</Alert.Root>
		{/if}
		<h1 class="font-bold text-xl mt-4 capitalize">{data.policy.title}</h1>
		<p class="leading-relaxed my-2">
			{data.policy.description}
		</p>

		<h3 class="font-bold mt-6 text-lg">Related Cases</h3>
		<div class="flex justify-between items-center">
			<div class="flex my-2">
				<div>
					<Select.Root>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder="Theme" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="light">Light</Select.Item>
							<Select.Item value="dark">Dark</Select.Item>
							<Select.Item value="system">System</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="ml-2">
					<Select.Root>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder="Theme" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="light">Light</Select.Item>
							<Select.Item value="dark">Dark</Select.Item>
							<Select.Item value="system">System</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div class="flex">
				<Button href="/policies/{data.policy.id}/editcase">
					<Pencil class="h-4 w-4 mr-2" />Edit cases
				</Button>
			</div>
		</div>
		{#if data.cases.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
				{#each data.cases as c}
					<CaseCard {...c} />
				{/each}
			</div>
		{:else}
			<p class="mt-2">
				There are no related cases yet. Add related cases with the edit case button.
			</p>
		{/if}
	</div>
	<div class="col-span-1 p-2">
		<DiscussionPanel
			discussions={data.discussions}
			dataMessage={data.formMessage}
			dataDiscussion={data.formDiscussion}
		/>
	</div>
</div>

<script lang="ts">
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import DiscussionPanel from '$lib/components/DiscussionPanel.svelte';
	import ReasonPanel from '$lib/components/ReasonPanel.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { ArrowBigDown, ArrowBigUp, Eye, Pencil, TriangleAlert } from 'lucide-svelte/icons';

	export let data;

	let showAlert = false;
	let userVote: 'upvote' | 'downvote' | undefined;
	const userId = data.user?.userId;

	const handleVote = async (value: string | undefined) => {
		if (data.stage == 'vote') {
			let upvoteList, downvoteList;
			if (value == 'upvote') {
				upvoteList = [...data.policy.votes.upvote, userId];
				downvoteList = data.policy.votes.downvote.filter((u: string) => u !== userId);
			} else if (value == 'downvote') {
				upvoteList = data.policy.votes.upvote.filter((u: string) => u !== userId);
				downvoteList = [...data.policy.votes.downvote, userId];
			} else {
				upvoteList = data.policy.votes.upvote.filter((u: string) => u !== userId);
				downvoteList = data.policy.votes.downvote.filter((u: string) => u !== userId);
			}
			data.policy.votes.upvote = upvoteList;
			data.policy.votes.downvote = downvoteList;

			await fetch(`/api/policies/${data.policy.id}`, {
				method: 'PATCH',
				body: JSON.stringify({ action: 'votePolicy', vote: value }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	};

	$: if (data.policy.votes.upvote.includes(userId)) {
		userVote = 'upvote';
	} else if (data.policy.votes.downvote.includes(userId)) {
		userVote = 'downvote';
	} else {
		userVote = undefined;
	}
	$: totalUsers = data.policy.votes.upvote.length + data.policy.votes.downvote.length;
	$: percentUpvote = Math.floor((100 / totalUsers) * data.policy.votes.upvote.length);
	$: percentDownvote = Math.floor((100 / totalUsers) * data.policy.votes.downvote.length);
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
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
							newWatchList = [...data.policy.watchList, userId];
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
				{#if data.stage !== 'vote'}
					<Button href="/policies/{data.policy.id}/editpolicy">
						<Pencil class="h-4 w-4 mr-2" />Edit policy
					</Button>
				{/if}
			</div>
		</div>
		{#if showAlert}
			<Alert.Root class="my-4">
				<TriangleAlert class="h-4 w-4" />
				<Alert.Title>Heads up!</Alert.Title>
				<Alert.Description>
					Some cases are flagged with warnings either because their majority votes conflict with
					this policy or are unclear under this policy. If there is no agreement on a case's vote,
					discuss it on the case page. If there is agreement on a case, discuss it on this policy
					page and edit the policy as needed.
				</Alert.Description>
			</Alert.Root>
		{/if}
		<h1 class="font-bold text-xl mt-4 capitalize">{data.policy.title}</h1>
		<p class="leading-relaxed my-2">
			{data.policy.description}
		</p>

		{#if data.stage == 'vote'}
			<ToggleGroup.Root
				type="single"
				variant="outline"
				class="flex justify-start my-4"
				value={userVote}
				onValueChange={(value) => handleVote(value)}
			>
				<ToggleGroup.Item
					value="upvote"
					aria-label="Toggle upvote"
					class="data-[state=on]:bg-green-200"
				>
					<ArrowBigUp class="h-4 w-4 mr-2" />upvote
				</ToggleGroup.Item>
				<ToggleGroup.Item
					value="downvote"
					aria-label="Toggle downvote"
					class="data-[state=on]:bg-red-200"
				>
					<ArrowBigDown class="h-4 w-4 mr-2" />downvote
				</ToggleGroup.Item>
			</ToggleGroup.Root>

			<h3 class="font-bold mt-6 text-lg">
				Vote Distribution ({data.policy.votes.upvote.length + data.policy.votes.downvote.length})
			</h3>
			<div class="flex w-full h-4 my-4 rounded">
				{#if userVote !== undefined}
					{#if percentUpvote != 0}
						<div
							class="bg-green-200 flex justify-center items-center text-sm"
							style="width: {percentUpvote}%"
						>
							{percentUpvote}%
						</div>
					{/if}
					{#if percentDownvote != 0}
						<div
							class="bg-red-200 flex justify-center items-center text-sm"
							style="width: {percentDownvote}%"
						>
							{percentDownvote}%
						</div>
					{/if}
				{:else}
					<div class="w-full bg-gray-100 flex justify-center items-center text-sm text-gray-500">
						vote to see distribution
					</div>
				{/if}
			</div>

			<ReasonPanel
				reasons={data.reasons}
				dataReason={data.formReason}
				label1="upvote"
				label2="downvote"
				{userId}
				userDisplayNames={data.userDisplayNames}
			/>
		{/if}

		<div class="flex justify-between items-center mt-6">
			<h3 class="font-bold text-lg">Related Cases</h3>
			<!-- <div class="flex my-2">
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
			</div> -->
			<div class="flex">
				{#if data.stage !== 'vote'}
					<Button href="/policies/{data.policy.id}/editcase">
						<Pencil class="h-4 w-4 mr-2" />Edit cases
					</Button>
				{/if}
			</div>
		</div>
		{#if data.cases.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-1 mt-2">
				{#each data.cases as c}
					<CaseCard {...c} {userId} />
				{/each}
			</div>
		{:else}
			<p class="mt-2">
				There are no related cases yet. Add related cases with the edit case button.
			</p>
		{/if}
	</div>
	<div class="md:col-span-1 p-2">
		<DiscussionPanel
			discussions={data.discussions}
			dataMessage={data.formMessage}
			dataDiscussion={data.formDiscussion}
			{userId}
			userDisplayNames={data.userDisplayNames}
		/>
	</div>
</div>

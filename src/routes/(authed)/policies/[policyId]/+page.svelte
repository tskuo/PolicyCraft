<script lang="ts">
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Alert from '$lib/components/ui/alert';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import DiscussionPanel from '$lib/components/DiscussionPanel.svelte';
	import ReasonPanel from '$lib/components/ReasonPanel.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import {
		ArrowBigDown,
		ArrowBigUp,
		BookText,
		Bell,
		FileClock,
		Pencil,
		TriangleAlert
	} from 'lucide-svelte/icons';

	export let data;

	let showAlert = false;
	let userVote: 'upvote' | 'downvote' | undefined;
	const userId = data.user?.userId;
	const userRole = data.user?.role;

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
	$: totalVotes = data.policy.votes.upvote.length + data.policy.votes.downvote.length;
	$: percentUpvote = Math.floor((100 / totalVotes) * data.policy.votes.upvote.length);
	$: percentDownvote = Math.floor((100 / totalVotes) * data.policy.votes.downvote.length);
	$: barUpvote = Math.floor((100 / data.userCounts) * data.policy.votes.upvote.length);
	$: barDownvote = Math.floor((100 / data.userCounts) * data.policy.votes.downvote.length);
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<div class="flex justify-end md:justify-between items-center">
			<Breadcrumb.Root class="my-2 hidden md:block">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/policies">Policy Repository</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Policy</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" href="/policies/{data.policy.id}/edithistory">
							<FileClock class="w-4 h-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Edit history</p>
					</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger>
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
							<Bell class="h-4 w-4 mr-2" />{data.policy.watchList.length}
						</Toggle>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Get notifications for edits on this policy</p>
					</Tooltip.Content>
				</Tooltip.Root>

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
		<h1 class="font-bold text-xl mt-4 flex items-center">
			<BookText class="h-4 w-4 mr-2" />{data.policy.title}
		</h1>
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
					class="data-[state=on]:bg-green-200 flex-1 md:max-w-28"
				>
					<ArrowBigUp class="h-4 w-4 mr-2" />upvote
				</ToggleGroup.Item>
				<ToggleGroup.Item
					value="downvote"
					aria-label="Toggle downvote"
					class="data-[state=on]:bg-red-200 flex-1 md:max-w-28"
				>
					<ArrowBigDown class="h-4 w-4 mr-2" />downvote
				</ToggleGroup.Item>
			</ToggleGroup.Root>

			<h3 class="font-bold mt-6 text-lg">Vote Distribution</h3>
			<div class="mb-4">
				<Tooltip.Root>
					<Tooltip.Trigger class="w-full text-left">
						<div class="flex w-full h-4 my-4 rounded border">
							{#if userVote !== undefined || userRole == 'admin'}
								{#if percentUpvote != 0}
									<div
										class="bg-green-200 flex justify-center items-center text-sm"
										style="width: {barUpvote}%"
									></div>
								{/if}
								{#if percentDownvote != 0}
									<div
										class="bg-red-200 flex justify-center items-center text-sm"
										style="width: {barDownvote}%"
									></div>
								{/if}
							{:else}
								<div
									class="w-full bg-gray-100 flex justify-center items-center text-sm text-gray-500"
								>
									vote to see distribution
								</div>
							{/if}
						</div>
						<div>
							{#if userVote !== undefined || userRole == 'admin'}
								<p>
									<span class="text-muted-foreground">
										{totalVotes}
										{totalVotes > 1 ? 'votes' : 'vote'}:
									</span>
									<span class="text-green-500">{percentUpvote}%</span>
									<span class="text-red-400">{percentDownvote}%</span>
								</p>
							{:else}
								<p class="text-muted-foreground">
									{totalVotes}
									{totalVotes > 1 ? 'votes' : 'vote'}
								</p>
							{/if}
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{#if userVote !== undefined || userRole == 'admin'}
							<p>
								upvote: {data.policy.votes.upvote.length}
								{data.policy.votes.upvote.length > 1 ? 'votes' : 'vote'}
							</p>
							<p>
								downvote: {data.policy.votes.downvote.length}
								{data.policy.votes.downvote.length > 1 ? 'votes' : 'vote'}
							</p>
							<p class="mt-2">
								{totalVotes} of {data.userCounts} users have voted
							</p>
						{:else}
							<p>Vote to see distribution</p>
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
			<ReasonPanel
				reasons={data.reasons}
				dataReason={data.formReason}
				targetEntity="policy"
				label1="upvote"
				label2="downvote"
				{userId}
				userDisplayNames={data.userDisplayNames}
			/>
		{/if}

		<div class="flex justify-between items-center mt-6">
			<h3 class="font-bold text-lg">Related Cases</h3>
			<div class="flex">
				{#if data.stage !== 'vote'}
					<Button href="/policies/{data.policy.id}/editcase">
						<Pencil class="h-4 w-4 mr-2" />Edit cases
					</Button>
				{/if}
			</div>
		</div>
		{#if data.cases.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-1 mt-2 auto-rows-fr">
				{#each data.cases as c}
					<CaseCard {...c} {userId} {userRole} userCounts={data.userCounts} />
				{/each}
			</div>
		{:else}
			<p class="mt-2 text-muted-foreground text-sm">
				This policy currently has no related cases. Please consider adding related cases with the
				edit case button. Note that policies without any related cases will not be eligible for
				voting in the final stage.
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

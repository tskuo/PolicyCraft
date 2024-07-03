<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import PolicyCard from '$lib/components/PolicyCard.svelte';
	import { Check, Ban, CircleHelp } from 'lucide-svelte/icons';
	import DiscussionPanel from '$lib/components/DiscussionPanel.svelte';
	import ReasonPanel from '$lib/components/ReasonPanel.svelte';

	export let data;

	const userId = data.user?.userId;
	let userVote: 'allow' | 'disallow' | 'unsure' | undefined;

	const handleVote = async (value: string | undefined) => {
		let allowList, disallowList, unsureList;
		if (value == 'allow') {
			allowList = [...data.c.votes.allow, userId];
			disallowList = data.c.votes.disallow.filter((u: string) => u !== userId);
			unsureList = data.c.votes.unsure.filter((u: string) => u !== userId);
		} else if (value == 'disallow') {
			disallowList = [...data.c.votes.disallow, userId];
			allowList = data.c.votes.allow.filter((u: string) => u !== userId);
			unsureList = data.c.votes.unsure.filter((u: string) => u !== userId);
		} else if (value == 'unsure') {
			unsureList = [...data.c.votes.unsure, userId];
			disallowList = data.c.votes.disallow.filter((u: string) => u !== userId);
			allowList = data.c.votes.allow.filter((u: string) => u !== userId);
		} else {
			allowList = data.c.votes.allow.filter((u: string) => u !== userId);
			disallowList = data.c.votes.disallow.filter((u: string) => u !== userId);
			unsureList = data.c.votes.unsure.filter((u: string) => u !== userId);
		}
		data.c.votes.allow = allowList;
		data.c.votes.disallow = disallowList;
		data.c.votes.unsure = unsureList;

		await fetch(`/api/cases/${data.c.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ value }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};

	$: if (data.c.votes.allow.includes(userId)) {
		userVote = 'allow';
	} else if (data.c.votes.disallow.includes(userId)) {
		userVote = 'disallow';
	} else if (data.c.votes.unsure.includes(userId)) {
		userVote = 'unsure';
	} else {
		userVote = undefined;
	}

	$: totalUsers = data.userCounts;
	$: percentAllow = Math.floor((100 / totalUsers) * data.c.votes.allow.length);
	$: percentDisallow = Math.floor((100 / totalUsers) * data.c.votes.disallow.length);
	$: percentUnsure = Math.floor((100 / totalUsers) * data.c.votes.unsure.length);
</script>

<div>
	<div class="grid md:grid-cols-4">
		<div class="md:col-span-3 p-2">
			<div class="flex justify-between items-center">
				<Breadcrumb.Root class="my-2">
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link href="/cases">Case Repository</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Page>{data.c.title}</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
			<h1 class="font-bold text-xl mt-4">{data.c.title}</h1>
			<p class="leading-relaxed my-2">{data.c.description}</p>

			<ToggleGroup.Root
				type="single"
				variant="outline"
				class="flex justify-start my-4"
				value={userVote}
				onValueChange={(value) => handleVote(value)}
			>
				<ToggleGroup.Item
					value="allow"
					aria-label="Toggle allow"
					class="data-[state=on]:bg-green-200"
				>
					<Check class="h-4 w-4 mr-2" />allow
				</ToggleGroup.Item>
				<ToggleGroup.Item
					value="disallow"
					aria-label="Toggle disallow"
					class="data-[state=on]:bg-red-200"
				>
					<Ban class="h-4 w-4 mr-2" />disallow
				</ToggleGroup.Item>
				<ToggleGroup.Item
					value="unsure"
					aria-label="Toggle unsure"
					class="data-[state=on]:bg-gray-200"
				>
					<CircleHelp class="h-4 w-4 mr-2" />unsure
				</ToggleGroup.Item>
			</ToggleGroup.Root>

			<h3 class="font-bold mt-6 text-lg">
				Vote Distribution ({data.c.votes.allow.length +
					data.c.votes.disallow.length +
					data.c.votes.unsure.length})
			</h3>
			<div class="flex w-full h-4 my-4 rounded">
				{#if userVote !== undefined}
					{#if percentAllow != 0}
						<div
							class="bg-green-200 flex justify-center items-center text-sm"
							style="width: {percentAllow}%"
						>
							{percentAllow}%
						</div>
					{/if}
					{#if percentDisallow != 0}
						<div
							class="bg-red-200 flex justify-center items-center text-sm"
							style="width: {percentDisallow}%"
						>
							{percentDisallow}%
						</div>
					{/if}
					{#if percentUnsure != 0}
						<div
							class="bg-gray-200 flex justify-center items-center text-sm"
							style="width: {percentUnsure}%"
						>
							{percentUnsure}%
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
				label1="allow"
				label2="disallow"
				{userId}
				userDisplayNames={data.userDisplayNames}
			/>

			<h3 class="font-bold mt-6 text-lg">Related Policies</h3>
			<!-- <PolicyCard />
			<PolicyCard /> -->
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
</div>

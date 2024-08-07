<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Table from '$lib/components/ui/table';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import {
		Eye,
		MessageSquare,
		Folder,
		ArrowBigUp,
		ArrowBigDown,
		Maximize2,
		Minimize2
	} from 'lucide-svelte/icons';
	import CaseCard from './CaseCard.svelte';
	import type { Timestamp } from 'firebase/firestore';

	export let id = '';
	export let cases: any[] = [];
	export let createAt: Timestamp;
	export let description = '';
	export let discussions: any[];
	export let openDiscussions: any[] = [];
	export let reasons: string[];
	export let title = '';
	export let votes = {
		upvote: [] as string[],
		downvote: [] as string[]
	};
	export let watchList: string[] = [];

	export let userId: string;
	export let userRole: string;
	export let stage: string;
	export let userCounts: number;

	let compactView = true;
	let userVote: 'upvote' | 'downvote' | undefined;

	const handleVote = async (value: string | undefined) => {
		if (stage == 'vote') {
			let upvoteList, downvoteList;
			if (value == 'upvote') {
				upvoteList = [...votes.upvote, userId];
				downvoteList = votes.downvote.filter((u: string) => u !== userId);
			} else if (value == 'downvote') {
				upvoteList = votes.upvote.filter((u: string) => u !== userId);
				downvoteList = [...votes.downvote, userId];
			} else {
				upvoteList = votes.upvote.filter((u: string) => u !== userId);
				downvoteList = votes.downvote.filter((u: string) => u !== userId);
			}
			votes.upvote = upvoteList;
			votes.downvote = downvoteList;

			await fetch(`/api/policies/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ action: 'votePolicy', vote: value }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	};

	$: if (votes.upvote.includes(userId)) {
		userVote = 'upvote';
	} else if (votes.downvote.includes(userId)) {
		userVote = 'downvote';
	} else {
		userVote = undefined;
	}
</script>

<Card.Root class="my-2">
	<div class="relative h-full w-full">
		<a href="/policies/{id} ">
			<div class="hover:bg-gray-50 rounded-lg">
				<Card.Header>
					<Card.Title>{title}</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>
						{compactView && description.length > 300
							? description.substring(0, 300) + '...'
							: description}
					</p>
				</Card.Content>
				<Card.Footer class="pb-12"></Card.Footer>
			</div>
		</a>
		<div class="absolute flex items-center justify-between w-full bottom-4 px-6">
			<div class="flex items-center">
				<Toggle
					on:click={() => {
						compactView = !compactView;
					}}
				>
					{#if compactView === true}
						<Maximize2 class="h-4 w-4" />
					{:else}
						<Minimize2 class="h-4 w-4" />
					{/if}
				</Toggle>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Toggle
							aria-label="Toggle watch"
							class="ml-1 data-[state=on]:bg-sky-100"
							pressed={watchList.includes(userId)}
							onPressedChange={async (pressed) => {
								let newWatchList;
								if (watchList.includes(userId)) {
									newWatchList = watchList.filter((u) => u !== userId);
								} else {
									newWatchList = [...watchList, userId];
								}
								watchList = newWatchList;
								await fetch(`/api/policies/${id}`, {
									method: 'PATCH',
									body: JSON.stringify({ pressed, action: 'updateWatchList' }),
									headers: {
										'Content-Type': 'application/json'
									}
								});
							}}
						>
							<Eye class="h-4 w-4 mr-2" />{watchList.length}
						</Toggle>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Watch to get notifications for updates on this policy</p>
					</Tooltip.Content>
				</Tooltip.Root>
				{#if stage == 'vote'}
					<ToggleGroup.Root
						type="single"
						class="ml-1"
						value={userVote}
						onValueChange={(value) => handleVote(value)}
					>
						<ToggleGroup.Item
							value="upvote"
							aria-label="Toggle upvote"
							class="data-[state=on]:bg-green-200"
						>
							<ArrowBigUp class="h-4 w-4" />
							{#if userVote !== undefined || userRole == 'admin'}
								<div class="ml-2">{votes.upvote.length}</div>
							{/if}
						</ToggleGroup.Item>
						<ToggleGroup.Item
							value="downvote"
							aria-label="Toggle downvote"
							class="data-[state=on]:bg-red-200 "
						>
							<ArrowBigDown class="h-4 w-4" />
							{#if userVote !== undefined || userRole == 'admin'}
								<div class="ml-2">{votes.downvote.length}</div>
							{/if}
						</ToggleGroup.Item>
					</ToggleGroup.Root>
				{/if}
			</div>
			<div class="flex text-gray-400">
				<div class="flex mx-2 items-center">
					<Folder class="w-4 h-4 mr-2" />{cases.length}
				</div>
				<div class="flex mx-2 items-center">
					<MessageSquare class="w-4 h-4 mr-2" />{openDiscussions.length}
				</div>
			</div>
		</div>
	</div>
	{#if compactView === false}
		<Card.Content>
			<h3 class="font-bold mb-2">Related Cases</h3>
			{#if cases.length > 0}
				<!-- <div class="flex justify-center w-full">
					<Carousel.Root opts={{ align: 'start' }} class="w-11/12">
						<Carousel.Content>
							{#each cases as c}
								<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
									<CaseCard {...c} {userId} {userCounts}></CaseCard>
								</Carousel.Item>
							{/each}
						</Carousel.Content>
						<Carousel.Previous />
						<Carousel.Next />
					</Carousel.Root>
				</div> -->
				<ScrollArea orientation="horizontal" class="rounded-lg md:w-[57vw]">
					<div class="flex space-x-2 pb-4 w-[57vw]">
						{#each cases as c}
							<div class="basis-full md:basis-1/3 flex-none">
								<CaseCard {...c} {userId} {userRole} {userCounts}></CaseCard>
							</div>
						{/each}
					</div>
				</ScrollArea>
			{:else}
				<p class="text-sm">There are no related cases.</p>
			{/if}
			<h3 class="font-bold mt-4 mb-2">Open discussions</h3>
			<Table.Root>
				<Table.Body>
					{#if openDiscussions.length > 0}
						{#each openDiscussions as discussion}
							<Table.Row class="hover:bg-transparent">
								<Table.Cell class="font-medium capitalize">{discussion.title}</Table.Cell>
								<!-- <Table.Cell class="text-right">{discussion.comments.length} comments</Table.Cell> -->
							</Table.Row>
						{/each}
					{:else}
						<p>There are no open discussions.</p>
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	{/if}
</Card.Root>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Table from '$lib/components/ui/table';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import {
		ChevronsUpDown,
		Eye,
		TriangleAlert,
		MessageSquare,
		Folder,
		ChevronsDownUp
	} from 'lucide-svelte/icons';
	import CaseCard from './CaseCard.svelte';
	import type { Timestamp } from 'firebase/firestore';

	export let id = '';
	export let cases: any[] = [];
	export let createAt: Timestamp;
	export let description = '';
	export let discussions: any[];
	export let openDiscussions: any[] = [];
	export let title = '';
	export let watchList: string[] = [];

	let userId = 'user1';

	let compactView = true;
</script>

<!-- <a href="/policy/1"> -->
<Card.Root class="my-2">
	<a href="/policies/{id} ">
		<div class=" hover:bg-gray-100 rounded-lg">
			<Card.Header>
				<!-- <Card.Description>#{id}</Card.Description> -->
				<Card.Title>{title}</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>{description}</p>
			</Card.Content>

			<Card.Footer>
				<div class="flex items-center justify-between w-full">
					<div>
						<button on:click|preventDefault>
							<Toggle
								on:click={() => {
									compactView = !compactView;
								}}
							>
								{#if compactView === true}
									<ChevronsUpDown class="h-4 w-4" />
								{:else}
									<ChevronsDownUp class="h-4 w-4" />
								{/if}
							</Toggle>
						</button>
						<button on:click|preventDefault>
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
						</button>
					</div>

					<div class="flex text-gray-400">
						<div class="flex mx-2 items-center">
							<TriangleAlert class="w-4 h-4 mr-2" />3
						</div>
						<div class="flex mx-2 items-center">
							<Folder class="w-4 h-4 mr-2" />{cases.length}
						</div>
						<div class="flex mx-2 items-center">
							<MessageSquare class="w-4 h-4 mr-2" />{openDiscussions.length}
						</div>
					</div>
				</div>
			</Card.Footer>
		</div>
	</a>
	{#if compactView === false}
		<Card.Content>
			<h3 class="font-bold mb-2">Related Cases</h3>
			{#if cases.length > 0}
				<div class="flex justify-center w-full">
					<Carousel.Root opts={{ align: 'start' }} class="w-11/12">
						<Carousel.Content>
							{#each cases as c}
								<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
									<CaseCard {...c}></CaseCard>
								</Carousel.Item>
							{/each}
						</Carousel.Content>
						<Carousel.Previous />
						<Carousel.Next />
					</Carousel.Root>
				</div>
			{:else}
				<p class="text-sm">There are no related cases.</p>
			{/if}
			<h3 class="font-bold mt-4 mb-2">Open discussions</h3>
			<Table.Root>
				<Table.Body>
					{#if openDiscussions.length > 0}
						{#each openDiscussions as discussion}
							<Table.Row>
								<Table.Cell class="font-medium">{discussion.title}</Table.Cell>
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

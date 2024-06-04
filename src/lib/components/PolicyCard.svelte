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

	let compactView = true;
</script>

<!-- <a href="/policy/1"> -->
<div class="my-2">
	<Card.Root>
		<a href="/policy/EipWj5zV7gY8uD4wddP3">
			<div class="rounded hover:bg-gray-100">
				<Card.Header>
					<Card.Description>#ABC</Card.Description>
					<Card.Title>All ideas must be your own</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati ipsum molestiae
						adipisci neque officia dolore explicabo similique, vitae sunt dolores, ullam, hic
						aspernatur. Dignissimos, similique id non commodi magnam harum. Lorem ipsum dolor sit
						amet consectetur, adipisicing elit. Voluptatem odio illo reiciendis, repellendus culpa,
						ipsum corrupti aspernatur eligendi velit, quo consequatur ratione excepturi delectus
						incidunt nihil quas vel voluptate ad?
					</p>
				</Card.Content>
			</div>
		</a>
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
						<Toggle class="ml-1">
							<Eye class="h-4 w-4 mr-2" />32
						</Toggle>
					</button>
				</div>

				<div class="flex text-gray-400">
					<div class="flex mx-2 items-center">
						<TriangleAlert class="w-4 h-4 mr-2" />3
					</div>
					<div class="flex mx-2 items-center">
						<Folder class="w-4 h-4 mr-2" />3
					</div>
					<div class="flex mx-2 items-center">
						<MessageSquare class="w-4 h-4 mr-2" />3
					</div>
				</div>
			</div>
		</Card.Footer>
		{#if compactView === false}
			<Card.Content>
				<h3 class="font-bold mb-2">Related Cases</h3>
				<div class="flex justify-center w-full">
					<Carousel.Root opts={{ align: 'start' }} class="w-11/12">
						<Carousel.Content>
							{#each Array(5) as _, i (i)}
								<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
									<CaseCard></CaseCard>
								</Carousel.Item>
							{/each}
						</Carousel.Content>
						<Carousel.Previous />
						<Carousel.Next />
					</Carousel.Root>
				</div>
				<h3 class="font-bold mt-4 mb-2">Discussions</h3>
				<Table.Root>
					<Table.Body>
						<Table.Row>
							<Table.Cell class="font-medium"
								>Is information summarization part of brainstorming?</Table.Cell
							>
							<Table.Cell class="text-right">3 comments</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell class="font-medium">What counts as prototype?</Table.Cell>
							<Table.Cell class="text-right">5 comments</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell class="font-medium">The definition of idea ownership?</Table.Cell>
							<Table.Cell class="text-right">1 comments</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</Card.Content>
		{/if}
	</Card.Root>
</div>
<!-- </a> -->

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Check, Ban, CircleHelp, Maximize, TriangleAlert } from 'lucide-svelte/icons';

	export let showAlert = false;
	let voteAllow = ['user1', 'user2', 'user3', 'user4', 'user5'];
	let voteDisallow = ['user6', 'user7', 'user8'];
	let voteUnsure = ['user9'];
	let userId = 'user1';

	let totalUsers = 20;
	$: percentAllow = Math.floor((100 / totalUsers) * voteAllow.length);
	$: percentDisallow = Math.floor((100 / totalUsers) * voteDisallow.length);
	$: percentUnsure = Math.floor((100 / totalUsers) * voteUnsure.length);
</script>

<Card.Root>
	<Card.Header>
		<Card.Description>
			<div class="flex justify-between items-center">
				<div class="flex items-center">
					<button class="mr-2" on:click|preventDefault>
						<Dialog.Root>
							<Dialog.Trigger class="items-center flex">
								<Maximize class="w-4 h-4" />
							</Dialog.Trigger>
							<Dialog.Content class="sm:max-w-lg max-h-screen overflow-y-scroll">
								<Dialog.Header>
									<Dialog.Description>Case #123</Dialog.Description>
									<Dialog.Title class="leading-normal">
										Bob uses ChatGPT to generate ideas for reading reflection
									</Dialog.Title>
								</Dialog.Header>
								<p>
									Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum repellendus aperiam
									vero possimus sequi iste architecto nulla voluptatibus commodi iure, placeat natus
									doloribus obcaecati veniam ex deserunt voluptates molestiae eius.
								</p>
								<div class="w-full border h-3 bg-gray-200 mt-2 rounded"></div>
								<p>52 votes</p>
								<ToggleGroup.Root type="single" class="w-full grid grid-cols-3">
									<ToggleGroup.Item value="allow" aria-label="Toggle allow">
										<Check class="h-4 w-4" />
									</ToggleGroup.Item>
									<ToggleGroup.Item value="disallow" aria-label="Toggle disallow">
										<Ban class="h-4 w-4" />
									</ToggleGroup.Item>
									<ToggleGroup.Item value="unsure" aria-label="Toggle unsure">
										<CircleHelp class="h-4 w-4" />
									</ToggleGroup.Item>
								</ToggleGroup.Root>
								<h3 class="font-bold">Allow Reasons</h3>
								<Accordion.Root class="w-full">
									<Accordion.Item value="item-1">
										<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
										<Accordion.Content
											>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content
										>
									</Accordion.Item>
									<Accordion.Item value="item-2">
										<Accordion.Trigger>Is it styled?</Accordion.Trigger>
										<Accordion.Content>
											Yes. It comes with default styles that matches the other components'
											aesthetic.
										</Accordion.Content>
									</Accordion.Item>
									<Accordion.Item value="item-3">
										<Accordion.Trigger>Is it styled?</Accordion.Trigger>
										<Accordion.Content>
											Yes. It comes with default styles that matches the other components'
											aesthetic.
										</Accordion.Content>
									</Accordion.Item>
								</Accordion.Root>
								<h3 class="font-bold">Disallow Reasons</h3>
								<Accordion.Root class="w-full">
									<Accordion.Item value="item-1">
										<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
										<Accordion.Content
											>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content
										>
									</Accordion.Item>
								</Accordion.Root>
								<Dialog.Footer>
									<Button href="/case/1">Open case</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</button>
					<p>Case #123</p>
				</div>
				{#if showAlert === true}<TriangleAlert class="w-4 h-4" />{/if}
			</div>
		</Card.Description>
		<Card.Title class="leading-normal">
			Bob uses ChatGPT to generate ideas for reading reflection
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<p>
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error deserunt nam debitis cumque
			totam accusamus numquam officia ex magnam nesciunt. Doloremque quis magni consequuntur esse
			assumenda sunt tenetur rem commodi?
		</p>
		<!-- <div class="w-full border h-3 bg-gray-200 mt-4 mb-2 rounded"></div>-->
		<div class="flex w-full h-3 mt-4 mb-2">
			{#if voteAllow.includes(userId) || voteDisallow.includes(userId) || voteUnsure.includes(userId)}
				<div class="bg-green-200" style="width: {percentAllow}%"></div>
				<div class="bg-red-200" style="width: {percentDisallow}%"></div>
				<div class="bg-gray-200" style="width: {percentUnsure}%"></div>
			{:else}
				<div class="w-full bg-gray-100" />
			{/if}
		</div>
		<p>{voteAllow.length + voteDisallow.length + voteUnsure.length} votes</p>
	</Card.Content>
	<Card.Footer>
		<ToggleGroup.Root type="single" class="w-full grid grid-cols-3">
			{#if voteAllow.includes(userId)}
				<ToggleGroup.Item value="allow" aria-label="Toggle allow" class="bg-green-200">
					<Check class="h-4 w-4" />
				</ToggleGroup.Item>
			{:else}
				<ToggleGroup.Item value="allow" aria-label="Toggle allow">
					<Check class="h-4 w-4" />
				</ToggleGroup.Item>
			{/if}
			{#if voteDisallow.includes(userId)}
				<ToggleGroup.Item value="disallow" aria-label="Toggle disallow" class="bg-red-200">
					<Ban class="h-4 w-4" />
				</ToggleGroup.Item>
			{:else}
				<ToggleGroup.Item value="disallow" aria-label="Toggle disallow">
					<Ban class="h-4 w-4" />
				</ToggleGroup.Item>
			{/if}
			{#if voteUnsure.includes(userId)}
				<ToggleGroup.Item value="unsure" aria-label="Toggle unsure" class="bg-gray-200">
					<CircleHelp class="h-4 w-4" />
				</ToggleGroup.Item>
			{:else}
				<ToggleGroup.Item value="unsure" aria-label="Toggle unsure">
					<CircleHelp class="h-4 w-4" />
				</ToggleGroup.Item>
			{/if}
		</ToggleGroup.Root>
	</Card.Footer>
</Card.Root>

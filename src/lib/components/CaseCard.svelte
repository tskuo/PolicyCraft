<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Check, Ban, CircleHelp, Maximize, TriangleAlert } from 'lucide-svelte/icons';

	export let showAlert = false;
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
		<div class="w-full border h-3 bg-gray-200 mt-4 mb-2 rounded"></div>
		<p>52 votes</p>
	</Card.Content>
	<Card.Footer>
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
	</Card.Footer>
</Card.Root>

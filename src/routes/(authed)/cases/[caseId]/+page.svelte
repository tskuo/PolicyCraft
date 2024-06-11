<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import PolicyCard from '$lib/components/PolicyCard.svelte';
	import { ThumbsUp, Pencil, Ellipsis, Check, Ban, CircleHelp, EarIcon } from 'lucide-svelte/icons';
	import DiscussionPanel from '$lib/components/DiscussionPanel.svelte';

	export let data;

	let userId = 'user1';
	let userVote = '';
	$: {
		if (data.c.votes.allow.includes(userId)) {
			userVote = 'allow';
		} else if (data.c.votes.disallow.includes(userId)) {
			userVote = 'disallow';
		} else if (data.c.votes.unsure.includes(userId)) {
			userVote = 'unsure';
		} else {
			userVote = '';
		}
	}

	$: totalUsers =
		data.c.votes.allow.length + data.c.votes.disallow.length + data.c.votes.unsure.length;
	$: percentAllow = Math.floor((100 / totalUsers) * data.c.votes.allow.length);
	$: percentDisallow = Math.floor((100 / totalUsers) * data.c.votes.disallow.length);
	$: percentUnsure = Math.floor((100 / totalUsers) * data.c.votes.unsure.length);
</script>

<div>
	<div class="grid grid-cols-4">
		<div class="col-span-3 p-2">
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
				<DropdownMenu.Root>
					<DropdownMenu.Trigger><Ellipsis class="h-4 w-4" /></DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>More Actions</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>Action 1</DropdownMenu.Item>
							<DropdownMenu.Item>Action 2</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<h1 class="font-bold text-xl mt-4">{data.c.title}</h1>
			<p class="leading-relaxed my-2">{data.c.description}</p>

			<ToggleGroup.Root
				type="single"
				variant="outline"
				class="flex justify-start my-4"
				value={userVote}
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
			<div class="flex w-full h-3 my-4 rounded">
				{#if userVote !== ''}
					<div class="bg-green-200" style="width: {percentAllow}%"></div>
					<div class="bg-red-200" style="width: {percentDisallow}%"></div>
					<div class="bg-gray-200" style="width: {percentUnsure}%"></div>
				{:else}
					<div class="w-full bg-gray-100" />
				{/if}
			</div>
			<div class="flex justify-between items-center">
				<h3 class="font-bold mt-6 text-lg">Vote Reasons</h3>
				<Button>
					<Pencil class="h-4 w-4 mr-2" />Add reason
				</Button>
			</div>
			<div class="grid grid-cols-2 my-4 gap-2">
				<div>
					<h4 class="font-semibold text-center">Allow ({data.c.reasons.allow.length})</h4>
					{#each data.c.reasons.allow as reason (reason.id)}
						<Card.Root class="mt-2">
							<Card.Header>
								<Card.Title>{reason.title}</Card.Title>
								<Card.Description>{reason.author}</Card.Description>
							</Card.Header>
							<Card.Content>
								<p>{reason.description}</p>
							</Card.Content>
							<Card.Footer>
								<Toggle aria-label="Toggle italic">
									<ThumbsUp class="mr-2 h-4 w-4" />{reason.likes.length}
								</Toggle>
							</Card.Footer>
						</Card.Root>
					{/each}
				</div>
				<div>
					<h4 class="font-semibold text-center">Disallow ({data.c.reasons.disallow.length})</h4>
					{#each data.c.reasons.disallow as reason (reason.id)}
						<Card.Root class="mt-2">
							<Card.Header>
								<Card.Title>{reason.title}</Card.Title>
								<Card.Description>{reason.author}</Card.Description>
							</Card.Header>
							<Card.Content>
								<p>{reason.description}</p>
							</Card.Content>
							<Card.Footer>
								<Toggle aria-label="Toggle italic">
									<ThumbsUp class="mr-2 h-4 w-4" />{reason.likes.length}
								</Toggle>
							</Card.Footer>
						</Card.Root>
					{/each}
				</div>
			</div>

			<h3 class="font-bold mt-6 text-lg">Related Policies</h3>
			<!-- <PolicyCard />
			<PolicyCard /> -->
		</div>
		<div class="col-span-1 p-2">
			<DiscussionPanel discussions={data.discussions} />
		</div>
	</div>
</div>

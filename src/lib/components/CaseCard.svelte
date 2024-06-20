<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Check, Ban, CircleHelp, Maximize, TriangleAlert } from 'lucide-svelte/icons';
	import type { Timestamp } from 'firebase/firestore';

	export let id = '';
	export let createAt: Timestamp;
	export let description = '';
	export let discussions: string[];
	export let reasons: any[];
	export let title = '';
	export let votes = {
		allow: [] as string[],
		disallow: [] as string[],
		unsure: [] as string[]
	};

	export let label = '';
	let showAlert = false;

	let userId = 'user1';
	let userVote: 'allow' | 'disallow' | 'unsure' | undefined;

	const handleVote = async (value: string | undefined) => {
		let allowList, disallowList, unsureList;
		if (value == 'allow') {
			allowList = [...votes.allow, userId];
			disallowList = votes.disallow.filter((u: string) => u !== userId);
			unsureList = votes.unsure.filter((u: string) => u !== userId);
		} else if (value == 'disallow') {
			disallowList = [...votes.disallow, userId];
			allowList = votes.allow.filter((u: string) => u !== userId);
			unsureList = votes.unsure.filter((u: string) => u !== userId);
		} else if (value == 'unsure') {
			unsureList = [...votes.unsure, userId];
			disallowList = votes.disallow.filter((u: string) => u !== userId);
			allowList = votes.allow.filter((u: string) => u !== userId);
		} else {
			allowList = votes.allow.filter((u: string) => u !== userId);
			disallowList = votes.disallow.filter((u: string) => u !== userId);
			unsureList = votes.unsure.filter((u: string) => u !== userId);
		}
		votes.allow = allowList;
		votes.disallow = disallowList;
		votes.unsure = unsureList;

		await fetch(`/api/cases/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({ value }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};

	$: if (votes.allow.includes(userId)) {
		userVote = 'allow';
	} else if (votes.disallow.includes(userId)) {
		userVote = 'disallow';
	} else if (votes.unsure.includes(userId)) {
		userVote = 'unsure';
	} else {
		userVote = undefined;
	}

	$: totalUsers = votes.allow.length + votes.disallow.length + votes.unsure.length;
	$: percentAllow = Math.floor((100 / totalUsers) * votes.allow.length);
	$: percentDisallow = Math.floor((100 / totalUsers) * votes.disallow.length);
	$: percentUnsure = Math.floor((100 / totalUsers) * votes.unsure.length);

	$: reasonsAllow = reasons.filter((r) => r.label == 'allow');
	$: reasonsDisallow = reasons.filter((r) => r.label == 'disallow');
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
									<!-- <Dialog.Description>Case #{id}</Dialog.Description> -->
									<Dialog.Title class="leading-normal">
										{title}
									</Dialog.Title>
								</Dialog.Header>
								<p>
									{description}
								</p>
								<div class="flex w-full h-4 mt-2 mb-2 rounded">
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
										<div
											class="w-full bg-gray-100 flex justify-center items-center text-sm text-gray-500"
										>
											vote to see distribution
										</div>
									{/if}
								</div>
								<p>{votes.allow.length + votes.disallow.length + votes.unsure.length} votes</p>
								<ToggleGroup.Root
									type="single"
									class="w-full grid grid-cols-3"
									value={userVote}
									onValueChange={(value) => handleVote(value)}
								>
									<ToggleGroup.Item
										value="allow"
										aria-label="Toggle allow"
										class="data-[state=on]:bg-green-200"
									>
										<Check class="h-4 w-4" />
									</ToggleGroup.Item>
									<ToggleGroup.Item
										value="disallow"
										aria-label="Toggle disallow"
										class="data-[state=on]:bg-red-200"
									>
										<Ban class="h-4 w-4" />
									</ToggleGroup.Item>
									<ToggleGroup.Item
										value="unsure"
										aria-label="Toggle unsure"
										class="data-[state=on]:bg-gray-200"
									>
										<CircleHelp class="h-4 w-4" />
									</ToggleGroup.Item>
								</ToggleGroup.Root>
								<h3 class="font-bold mt-6">Allow Reasons ({reasonsAllow.length})</h3>
								<Accordion.Root class="w-full">
									{#each reasonsAllow as reason (reason.id)}
										<Accordion.Item value={reason.id}>
											<Accordion.Trigger>{reason.title}</Accordion.Trigger>
											<Accordion.Content>{reason.description}</Accordion.Content>
										</Accordion.Item>
									{/each}
								</Accordion.Root>
								<h3 class="font-bold">Disallow Reasons ({reasonsDisallow.length})</h3>
								<Accordion.Root class="w-full">
									{#each reasonsDisallow as reason (reason.id)}
										<Accordion.Item value={reason.id}>
											<Accordion.Trigger>{reason.title}</Accordion.Trigger>
											<Accordion.Content>{reason.description}</Accordion.Content>
										</Accordion.Item>
									{/each}
								</Accordion.Root>
								<Dialog.Footer>
									<Button href="/cases/{id}">Open case</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</button>
					{#if label == 'allow'}
						<p class="bg-green-200 px-1 rounded">allow by this policy</p>
					{:else if label == 'disallow'}
						<p class="bg-red-200 px-1 rounded">disallow by this policy</p>
					{:else if label == 'unsure'}
						<p class="bg-gray-200 px-1 rounded">unsure under this policy</p>
					{/if}
				</div>
				{#if showAlert}<TriangleAlert class="w-4 h-4" />{/if}
			</div>
		</Card.Description>
		<Card.Title class="leading-normal">{title}</Card.Title>
	</Card.Header>
	<Card.Content>
		<p>
			{#if description.length <= 200}
				{description}
			{:else}
				{description.substring(0, 200)}...
			{/if}
		</p>
		<div class="flex w-full h-3 mt-4 mb-2">
			{#if userVote !== undefined}
				<div class="bg-green-200" style="width: {percentAllow}%"></div>
				<div class="bg-red-200" style="width: {percentDisallow}%"></div>
				<div class="bg-gray-200" style="width: {percentUnsure}%"></div>
			{:else}
				<div class="w-full bg-gray-100" />
			{/if}
		</div>
		<p>{votes.allow.length + votes.disallow.length + votes.unsure.length} votes</p>
	</Card.Content>
	<Card.Footer>
		<ToggleGroup.Root
			type="single"
			class="w-full grid grid-cols-3"
			value={userVote}
			onValueChange={(value) => handleVote(value)}
		>
			<ToggleGroup.Item
				value="allow"
				aria-label="Toggle allow"
				class="data-[state=on]:bg-green-200"
			>
				<Check class="h-4 w-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="disallow"
				aria-label="Toggle disallow"
				class="data-[state=on]:bg-red-200"
			>
				<Ban class="h-4 w-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="unsure"
				aria-label="Toggle unsure"
				class="data-[state=on]:bg-gray-200"
			>
				<CircleHelp class="h-4 w-4" />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</Card.Footer>
</Card.Root>

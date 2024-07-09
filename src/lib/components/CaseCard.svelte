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
	export let userId: string;
	export let userCounts: number;
	export let hideAlert = false;

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

	$: totalVotes = votes.allow.length + votes.disallow.length + votes.unsure.length;
	$: percentAllow = Math.floor((100 / totalVotes) * votes.allow.length);
	$: percentDisallow = Math.floor((100 / totalVotes) * votes.disallow.length);
	$: percentUnsure = Math.floor((100 / totalVotes) * votes.unsure.length);
	$: barAllow = Math.floor((100 / userCounts) * votes.allow.length);
	$: barDisallow = Math.floor((100 / userCounts) * votes.disallow.length);
	$: barUnsure = Math.floor((100 / userCounts) * votes.unsure.length);

	$: reasonsAllow = reasons.filter((r) => r.label == 'allow');
	$: reasonsDisallow = reasons.filter((r) => r.label == 'disallow');

	let showAlert = false;
	$: if (label !== '') {
		if (label !== 'allow' && percentAllow > percentDisallow && percentAllow > percentUnsure) {
			showAlert = true;
		} else if (
			label !== 'disallow' &&
			percentDisallow > percentAllow &&
			percentDisallow > percentUnsure
		) {
			showAlert = true;
		} else if (
			label !== 'unsure' &&
			percentUnsure > percentAllow &&
			percentUnsure > percentDisallow
		) {
			showAlert = true;
		} else {
			showAlert = false;
		}
	}
</script>

<Card.Root class="hover:bg-gray-50 h-full">
	<a href="/cases/{id}">
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
										<Dialog.Title class="leading-normal">
											{title}
										</Dialog.Title>
									</Dialog.Header>
									<p>
										{description}
									</p>
									<div class="flex w-full h-4 mt-2 rounded border">
										{#if userVote !== undefined}
											<div class="bg-green-200" style="width: {barAllow}%"></div>
											<div class="bg-red-200" style="width: {barDisallow}%"></div>
											<div class="bg-gray-200" style="width: {barUnsure}%"></div>
										{:else}
											<div
												class="w-full bg-gray-100"
												style="width: {barAllow + barDisallow + barUnsure}%"
											/>
										{/if}
									</div>
									<div>
										{#if userVote !== undefined}
											<p>
												<span class="text-green-400">{percentAllow}%</span>
												<span class="text-red-400">{percentDisallow}%</span>
												<span class="text-gray-400">{percentUnsure}%</span>
												<span class="text-gray-500">({totalVotes})</span>
											</p>
										{:else}
											<p>{totalVotes} {totalVotes < 2 ? 'vote' : 'votes'}</p>
										{/if}
									</div>
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
					{#if showAlert && !hideAlert}<TriangleAlert class="w-4 h-4" />{/if}
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
		</Card.Content>
	</a>
	<Card.Footer>
		<div class="w-full">
			<div class="flex w-full h-3 mb-2 border">
				{#if userVote !== undefined}
					<div class="bg-green-200" style="width: {barAllow}%"></div>
					<div class="bg-red-200" style="width: {barDisallow}%"></div>
					<div class="bg-gray-200" style="width: {barUnsure}%"></div>
				{:else}
					<div class="w-full bg-gray-100" style="width: {barAllow + barDisallow + barUnsure}%" />
				{/if}
			</div>
			<div class="mb-2 text-sm">
				{#if userVote !== undefined}
					<p>
						<span class="text-green-400">{percentAllow}%</span>
						<span class="text-red-400">{percentDisallow}%</span>
						<span class="text-gray-400">{percentUnsure}%</span>
						<span class="text-gray-500">({totalVotes})</span>
					</p>
				{:else}
					<p>{totalVotes} {totalVotes < 2 ? 'vote' : 'votes'}</p>
				{/if}
			</div>
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
		</div>
	</Card.Footer>
</Card.Root>

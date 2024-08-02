<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Toggle } from '$lib/components/ui/toggle';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import {
		Check,
		Ban,
		TriangleAlert,
		Meh,
		Plus,
		LoaderCircle,
		ThumbsUp
	} from 'lucide-svelte/icons';
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

	let newReason = '';
	let creatingNewReason = false;
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
		if (label !== 'allow' && percentAllow > percentDisallow && percentAllow >= percentUnsure) {
			showAlert = true;
		} else if (
			label !== 'disallow' &&
			percentDisallow > percentAllow &&
			percentDisallow >= percentUnsure
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

<Dialog.Root>
	<div class="relative h-full w-full">
		<Dialog.Trigger class="items-center flex h-full w-full">
			<Card.Root class="hover:bg-gray-50 h-full w-full flex flex-col justify-between text-left">
				<div>
					<Card.Header>
						<Card.Description>
							<div class="flex justify-between items-center">
								<div class="flex items-center">
									{#if label == 'allow'}
										<p class="bg-green-200 text-foreground text-xs font-semibold px-1 py-1 rounded">
											currently allowed by this policy
										</p>
									{:else if label == 'disallow'}
										<p class="bg-red-200 text-foreground text-xs font-semibold px-1 py-1 rounded">
											currently disallowed by this policy
										</p>
									{:else if label == 'unsure'}
										<p class="bg-gray-200 text-foreground text-xs font-semibold px-1 py-1 rounded">
											currently unsure under this policy
										</p>
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
				</div>
				<!-- <Card.Footer class="mb-10"></Card.Footer> -->
				<Card.Footer>
					<div class="w-full">
						<div class="flex w-full h-3 mb-2 border">
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
						<div class="mb-2 text-sm">
							{#if userVote !== undefined}
								<p>
									<span class="text-green-500">{percentAllow}%</span>
									<span class="text-red-400">{percentDisallow}%</span>
									<span class="text-gray-400">{percentUnsure}%</span>
									<span class="text-gray-500">({totalVotes})</span>
								</p>
							{:else}
								<p class="text-gray-500">{totalVotes} {totalVotes < 2 ? 'vote' : 'votes'}</p>
							{/if}
						</div>
					</div>
				</Card.Footer>
			</Card.Root>
		</Dialog.Trigger>
		<!-- Remove voting buttons on case cards -->
		<!-- <div class="absolute w-full bottom-4 px-6">
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
					<Meh class="h-4 w-4" />
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div> -->
	</div>
	<Dialog.Content class="sm:max-w-lg max-h-[80%] overflow-y-scroll">
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
				<div class="w-full bg-gray-100" style="width: {barAllow + barDisallow + barUnsure}%" />
			{/if}
		</div>
		<div>
			{#if userVote !== undefined}
				<p>
					<span class="text-green-500">{percentAllow}%</span>
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
				<Meh class="h-4 w-4 mr-2" />unsure
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		{#if userVote == 'allow' || userVote == 'disallow'}
			<div class="flex w-full items-center space-x-1 mt-2">
				<Label><span class="capitalize">{userVote}</span> reason:</Label>
				<Input
					class="flex-1"
					bind:value={newReason}
					placeholder={`This case should be ${userVote}ed because ...`}
				/>
				<Button
					disabled={!(userVote == 'allow' || userVote == 'disallow') ||
						newReason == '' ||
						creatingNewReason}
					on:click={async () => {
						creatingNewReason = true;
						const formNewReason = {
							data: {
								label: userVote,
								description: newReason
							}
						};
						const res = await fetch(`/api/reasons`, {
							method: 'POST',
							body: JSON.stringify({ form: formNewReason, entity: 'cases', entityId: id }),
							headers: {
								'Content-Type': 'application/json'
							}
						});
						if (res.ok) {
							const rr = await res.json();
							reasons = [
								...reasons,
								{
									id: rr.id,
									description: newReason,
									label: userVote,
									likeList: [userId],
									targetEntity: 'cases',
									targetEntityId: id,
									userId: userId
								}
							];
							newReason = '';
							creatingNewReason = false;
						}
					}}
				>
					{#if creatingNewReason}
						<LoaderCircle class="h-4 w-4 animate-spin" />
					{:else}
						<Plus class="h-4 w-4" />
					{/if}
				</Button>
			</div>
		{/if}
		<h3 class="font-semibold mt-4">Allow reasons ({reasonsAllow.length})</h3>
		<Accordion.Root class="w-full">
			{#each reasonsAllow as reason (reason.id)}
				<Accordion.Item value={reason.id}>
					<div class="relative">
						<Accordion.Trigger class="font-normal text-sm text-left">
							{reason.description.length > 47
								? reason.description.substring(0, 47) + '...'
								: reason.description}
						</Accordion.Trigger>
						<div class="absolute top-2 right-0">
							<Toggle
								aria-label="Toggle like"
								class="data-[state=on]:bg-sky-100 bg-white"
								pressed={reason.likeList.includes(userId)}
								onPressedChange={async (pressed) => {
									let newLikeList;
									if (reason.likeList.includes(userId)) {
										newLikeList = reason.likeList.filter((u) => u !== userId);
									} else {
										newLikeList = [...reason.likeList, userId];
									}
									reason.likeList = newLikeList;
									await fetch(`/api/reasons/${reason.id}`, {
										method: 'PATCH',
										body: JSON.stringify({ pressed }),
										headers: {
											'Content-Type': 'application/json'
										}
									});
								}}
							>
								<ThumbsUp class="mr-2 h-4 w-4" />{reason.likeList.length}
							</Toggle>
						</div>
					</div>
					<Accordion.Content>
						<p>{reason.description}</p>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
		<h3 class="font-semibold">Disallow reasons ({reasonsDisallow.length})</h3>
		<Accordion.Root class="w-full">
			{#each reasonsDisallow as reason (reason.id)}
				<Accordion.Item value={reason.id}>
					<div class="relative">
						<Accordion.Trigger class="font-normal text-sm text-left">
							{reason.description.length > 47
								? reason.description.substring(0, 47) + '...'
								: reason.description}
						</Accordion.Trigger>
						<div class="absolute top-2 right-0">
							<Toggle
								aria-label="Toggle like"
								class="data-[state=on]:bg-sky-100 bg-white"
								pressed={reason.likeList.includes(userId)}
								onPressedChange={async (pressed) => {
									let newLikeList;
									if (reason.likeList.includes(userId)) {
										newLikeList = reason.likeList.filter((u) => u !== userId);
									} else {
										newLikeList = [...reason.likeList, userId];
									}
									reason.likeList = newLikeList;
									await fetch(`/api/reasons/${reason.id}`, {
										method: 'PATCH',
										body: JSON.stringify({ pressed }),
										headers: {
											'Content-Type': 'application/json'
										}
									});
								}}
							>
								<ThumbsUp class="mr-2 h-4 w-4" />{reason.likeList.length}
							</Toggle>
						</div>
					</div>
					<Accordion.Content>
						<p>{reason.description}</p>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
		<Dialog.Footer>
			<Button href="/cases/{id}">Open case</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

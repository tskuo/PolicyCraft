<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Toggle } from '$lib/components/ui/toggle';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import {
		Check,
		Ban,
		TriangleAlert,
		Meh,
		Plus,
		LoaderCircle,
		ThumbsUp,
		Sticker
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
	export let userRole: string;
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
		if (label !== 'allow' && percentAllow > percentDisallow && percentAllow > percentUnsure) {
			showAlert = true;
		} else if (
			label !== 'disallow' &&
			percentDisallow > percentAllow &&
			percentDisallow > percentUnsure
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
							<!-- <div class="flex justify-between items-center">
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
							</div> -->
							{#if showAlert && !hideAlert}
								<div
									class="flex items-center justify-between bg-yellow-200 rounded-md text-foreground px-2 py-1 mb-1"
								>
									<div>
										<TriangleAlert class="w-4 h-4 mr-2" />
									</div>
									<p>
										{#if label == 'unsure'}
											The policy may need editing to clarify whether this case is allowed or not.
										{:else}
											The policy may need editing to better align with the majority vote on this
											case.
										{/if}
									</p>
								</div>
							{/if}
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
						{#if label == 'allow' || label == 'disallow' || label == 'unsure'}
							<div class="flex items-center space-x-2 text-sm mb-3">
								<p class="text-muted-foreground">What current policy says:</p>
								<p>
									{#if label == 'allow'}
										<span class="bg-green-200 px-1 py-1 rounded"> allow </span>
									{:else if label == 'disallow'}
										<span class="bg-red-200 px-1 py-1 rounded"> disallow </span>
									{:else if label == 'unsure'}
										<span class="bg-gray-200 px-1 py-1 rounded"> ambiguous </span>
									{/if}
								</p>
							</div>
						{/if}
						<p class="text-sm mb-2 text-muted-foreground">What people say:</p>
						<div class="flex w-full h-3 mb-2 border">
							{#if userVote !== undefined || userRole == 'admin'}
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
							{#if userVote !== undefined || userRole == 'admin'}
								<p>
									<span class="text-muted-foreground">
										{totalVotes}
										{totalVotes > 1 ? 'votes' : 'vote'}:
									</span>
									<span class="text-green-500">{percentAllow}%</span>
									<span class="text-red-400">{percentDisallow}%</span>
									<span class="text-gray-400">{percentUnsure}%</span>
								</p>
							{:else}
								<p class="text-muted-foreground">
									{totalVotes}
									{totalVotes > 1 ? 'votes' : 'vote'}
								</p>
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
	<Dialog.Content class="sm:max-w-xl max-h-[80%] overflow-y-scroll">
		<Dialog.Header>
			<Dialog.Title class="leading-normal">
				{title}
			</Dialog.Title>
		</Dialog.Header>
		<p>
			{description}
		</p>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<div class="flex w-full h-4 mt-2 rounded border">
					{#if userVote !== undefined || userRole == 'admin'}
						<div class="bg-green-200" style="width: {barAllow}%"></div>
						<div class="bg-red-200" style="width: {barDisallow}%"></div>
						<div class="bg-gray-200" style="width: {barUnsure}%"></div>
					{:else}
						<div class="w-full bg-gray-100" style="width: {barAllow + barDisallow + barUnsure}%" />
					{/if}
				</div>
				<div class="text-left mt-2">
					{#if userVote !== undefined || userRole == 'admin'}
						<p>
							<span class="text-muted-foreground">
								{totalVotes}
								{totalVotes > 1 ? 'votes' : 'vote'}:
							</span>
							<span class="text-green-500">{percentAllow}%</span>
							<span class="text-red-400">{percentDisallow}%</span>
							<span class="text-gray-400">{percentUnsure}%</span>
						</p>
					{:else}
						<p class="text-muted-foreground">{totalVotes} {totalVotes < 2 ? 'vote' : 'votes'}</p>
					{/if}
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content>
				{#if userVote !== undefined || userRole == 'admin'}
					<p>
						allow: {votes.allow.length}
						{votes.allow.length > 1 ? 'votes' : 'vote'}
					</p>
					<p>
						disallow: {votes.disallow.length}
						{votes.disallow.length > 1 ? 'votes' : 'vote'}
					</p>
					<p>
						unsure: {votes.unsure.length}
						{votes.unsure.length > 1 ? 'votes' : 'vote'}
					</p>
					<p class="mt-2">
						{totalVotes} of {userCounts} users have voted
					</p>
				{:else}
					<p>Vote to see distribution</p>
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
		{#if userVote == undefined}
			<div class="flex w-full items-center space-x-1 mt-1">
				<Alert.Root>
					<Sticker class="h-4 w-4" />
					<Alert.Description>
						Reminder: Your vote and reasons should reflect what you think about this case,
						regardless of what current policies say.
					</Alert.Description>
				</Alert.Root>
			</div>
		{/if}
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
					placeholder={`I think this case should be ${userVote}ed because ...`}
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
		{:else if userVote == 'unsure'}
			<div class="flex w-full items-center space-x-1 mt-2">
				<Alert.Root>
					<Meh class="h-4 w-4" />
					<Alert.Description>
						If you vote "unsure," you can still explain your reasoning by opening the case page and
						adding <span class="italic">separate</span> allow and disallow reasons that together make
						you unsure.
					</Alert.Description>
				</Alert.Root>
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

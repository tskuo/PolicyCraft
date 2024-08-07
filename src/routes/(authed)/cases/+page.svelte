<script lang="ts">
	import CaseCard from '$lib/components/CaseCard.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select';
	import { invalidateAll } from '$app/navigation';
	import { LoaderCircle } from 'lucide-svelte';
	export let data;

	let displayCases = data.cases;
	let loading = false;
	let filterValue = 'all';

	const filterCases = async (filterBy: string) => {
		await invalidateAll();
		if (filterBy == 'all') {
			displayCases = data.cases;
		} else if (filterBy == 'voted') {
			displayCases = data.cases.filter(
				(c) =>
					c.votes.allow.includes(data.user?.userId) ||
					c.votes.disallow.includes(data.user?.userId) ||
					c.votes.unsure.includes(data.user?.userId)
			);
		} else if (filterBy == 'notvoted') {
			displayCases = data.cases.filter(
				(c) =>
					!c.votes.allow.includes(data.user?.userId) &&
					!c.votes.disallow.includes(data.user?.userId) &&
					!c.votes.unsure.includes(data.user?.userId)
			);
		}
	};

	const sortCases = async (sortBy: string) => {
		await filterCases(filterValue);
		if (sortBy == 'title') {
			displayCases = displayCases.sort((caseA, caseB) => {
				const a = caseA.title;
				const b = caseB.title;
				if (a < b) return -1;
				else if (a > b) return 1;
				return 0;
			});
		} else if (sortBy == 'new') {
			displayCases = data.cases; // default sort by new
		} else if (sortBy == 'votes') {
			displayCases = displayCases
				.sort((caseA, caseB) => {
					const a =
						caseA.votes.allow.length + caseA.votes.disallow.length + caseA.votes.unsure.length;
					const b =
						caseB.votes.allow.length + caseB.votes.disallow.length + caseB.votes.unsure.length;
					if (a < b) return -1;
					else if (a > b) return 1;
					return 0;
				})
				.reverse();
		} else if (sortBy == 'allow') {
			displayCases = displayCases
				.sort((caseA, caseB) => {
					const a = caseA.votes.allow.length;
					const b = caseB.votes.allow.length;
					if (a < b) return -1;
					else if (a > b) return 1;
					return 0;
				})
				.reverse();
		} else if (sortBy == 'disallow') {
			displayCases = displayCases
				.sort((caseA, caseB) => {
					const a = caseA.votes.disallow.length;
					const b = caseB.votes.disallow.length;
					if (a < b) return -1;
					else if (a > b) return 1;
					return 0;
				})
				.reverse();
		} else if (sortBy == 'unsure') {
			displayCases = displayCases
				.sort((caseA, caseB) => {
					const a = caseA.votes.unsure.length;
					const b = caseB.votes.unsure.length;
					if (a < b) return -1;
					else if (a > b) return 1;
					return 0;
				})
				.reverse();
		}
	};
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<div class="flex items-center">
			<p class="hidden md:inline mr-2">Filter by:</p>
			<div class="mr-2">
				<Select.Root
					onSelectedChange={async (v) => {
						loading = true;
						filterValue = v?.value;
						await filterCases(filterValue);
						loading = false;
					}}
				>
					<Select.Trigger class="w-[160px]">
						<Select.Value placeholder="all cases" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="all">all cases</Select.Item>
						<Select.Item value="voted">voted</Select.Item>
						<Select.Item value="notvoted">not voted</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<p class="hidden md:inline mx-2">Sort by:</p>
			<div class="mr-2">
				<Select.Root
					onSelectedChange={async (v) => {
						loading = true;
						await sortCases(v.value);
						loading = false;
					}}
				>
					<Select.Trigger class="w-[160px]">
						<Select.Value placeholder="new" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="new">new</Select.Item>
						<Select.Item value="title">title</Select.Item>
						<Select.Item value="votes">total votes</Select.Item>
						<Select.Item value="allow">allow votes</Select.Item>
						<Select.Item value="disallow">disallow votes</Select.Item>
						<Select.Item value="unsure">unsure votes</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<Separator class="my-4" />
		{#if loading}
			<div
				class="w-full h-full flex flex-col space-y-2 justify-center items-center text-muted-foreground"
			>
				<p>Loading ...</p>
				<LoaderCircle class="w-1/5 h-1/5 animate-spin" />
			</div>
		{:else if data.cases.length > 0}
			{#key displayCases}
				{#if displayCases.length > 0}
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-1 auto-rows-fr">
						{#each displayCases as c (c.id)}
							<CaseCard
								{...c}
								userId={data.user?.userId}
								userRole={data.user?.role}
								userCounts={data.userCounts}
							/>
						{/each}
					</div>
				{:else}
					<p>There are no cases that meet the filtering criteria.</p>
				{/if}
			{/key}
		{:else}
			<p>The case repository is empty.</p>
		{/if}
	</div>
</div>

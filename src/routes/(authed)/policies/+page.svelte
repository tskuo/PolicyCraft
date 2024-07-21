<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select';
	import PolicyCard from '$lib/components/PolicyCard.svelte';
	import { invalidateAll } from '$app/navigation';
	import { LoaderCircle } from 'lucide-svelte';

	export let data;

	let displayPolicies = data.policies;
	let loading = false;
	let filterValue = 'all';

	const filterPolicies = async (filterBy: string) => {
		await invalidateAll();
		if (filterBy == 'all') {
			displayPolicies = data.policies;
		} else if (filterBy == 'watching') {
			displayPolicies = data.policies.filter((p) => p.watchList.includes(data.user?.userId));
		} else if (filterBy == 'notwatching') {
			displayPolicies = data.policies.filter((p) => !p.watchList.includes(data.user?.userId));
		}
	};
	const sortPolicies = async (sortBy: string) => {
		await filterPolicies(filterValue);
		if (sortBy == 'new') {
			displayPolicies = displayPolicies
				.sort((policyA, policyB) => {
					const a = policyA.createAt;
					const b = policyB.createAt;
					if (a < b) return -1;
					else if (a > b) return 1;
					return 0;
				})
				.reverse();
		} else if (sortBy == 'title') {
			displayPolicies = displayPolicies.sort((policyA, policyB) => {
				const a = policyA.title;
				const b = policyB.title;
				if (a < b) return -1;
				else if (a > b) return 1;
				return 0;
			});
		} else if (sortBy == 'watch') {
			displayPolicies = displayPolicies
				.sort((policyA, policyB) => {
					const a = policyA.watchList.length;
					const b = policyB.watchList.length;
					if (a < b) return -1;
					else if (a > b) return 1;
					return 0;
				})
				.reverse();
		} else if (sortBy == 'discuss') {
			displayPolicies = displayPolicies
				.sort((policyA, policyB) => {
					const a = policyA.discussions.length;
					const b = policyB.discussions.length;
					if (a < b) return -1;
					else if (a > b) return 1;
					return 0;
				})
				.reverse();
		} else if (sortBy == 'case') {
			displayPolicies = displayPolicies.sort((policyA, policyB) => {
				const a = policyA.cases.length;
				const b = policyB.cases.length;
				if (a < b) return -1;
				else if (a > b) return 1;
				return 0;
			});
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
						await filterPolicies(filterValue);
						loading = false;
					}}
				>
					<Select.Trigger class="w-[160px]">
						<Select.Value placeholder="all policies" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="all">all policies</Select.Item>
						<Select.Item value="watching">watching</Select.Item>
						<Select.Item value="notwatching">not watching</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<p class="hidden md:inline mx-2">Sort by:</p>
			<div class="mr-2">
				<Select.Root
					onSelectedChange={async (v) => {
						loading = true;
						await sortPolicies(v.value);
						loading = false;
					}}
				>
					<Select.Trigger class="w-[160px]">
						<Select.Value placeholder="new" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="new">new</Select.Item>
						<Select.Item value="title">title</Select.Item>
						<Select.Item value="watch">most watching</Select.Item>
						<Select.Item value="discuss">most discussion</Select.Item>
						<Select.Item value="case">least cases</Select.Item>
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
		{:else if data.policies.length > 0}
			{#key displayPolicies}
				{#if displayPolicies.length > 0}
					{#each displayPolicies as policy (policy.id)}
						<PolicyCard
							{...policy}
							userId={data.user?.userId}
							stage={data.stage}
							userCounts={data.userCounts}
						/>
					{/each}
				{:else}
					<p>There are no policies that meet the filtering criteria.</p>
				{/if}
			{/key}
		{:else}
			<p>The policy repository is empty.</p>
		{/if}
	</div>
</div>

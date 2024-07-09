<script lang="ts">
	import CaseCard from '$lib/components/CaseCard.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select';
	export let data;
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<div class="flex items-center">
			<p class="hidden md:inline mr-2">Sort to find:</p>
			<div class="mr-2">
				<Select.Root>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="New cases" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="light">Light</Select.Item>
						<Select.Item value="dark">Dark</Select.Item>
						<Select.Item value="system">System</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<Separator class="my-4" />
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-1 auto-rows-fr">
			{#if data.cases.length > 0}
				{#each data.cases as c (c.id)}
					<CaseCard {...c} userId={data.user?.userId} userCounts={data.userCounts} />
				{/each}
			{:else}
				<p>The case repository is empty.</p>
			{/if}
		</div>
	</div>
</div>

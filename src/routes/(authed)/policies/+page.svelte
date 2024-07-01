<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select';
	import PolicyCard from '$lib/components/PolicyCard.svelte';

	export let data;
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<div class="flex items-center">
			<p>Sort to find:</p>
			<div class="ml-2">
				<Select.Root>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="New policy" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="light">Light</Select.Item>
						<Select.Item value="dark">Dark</Select.Item>
						<Select.Item value="system">System</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="ml-2">
				<Select.Root>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="Show all" />
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
		<div>
			{#if data.policies.length > 0}
				{#each data.policies as policy (policy.id)}
					<PolicyCard {...policy} userId={data.user?.userId} stage={data.stage} />
				{/each}
			{:else}
				<p>The policy repository is empty.</p>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import CaseCard from '$lib/components/CaseCard.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select';
</script>

<div class="grid grid-cols-4">
	<div class="col-span-3 p-2">
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
			<div class="mr-2">
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
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-1">
			<CaseCard></CaseCard>
			<CaseCard></CaseCard>
			<CaseCard></CaseCard>
			<CaseCard></CaseCard>
			<CaseCard></CaseCard>
			<CaseCard></CaseCard>
		</div>
	</div>
</div>

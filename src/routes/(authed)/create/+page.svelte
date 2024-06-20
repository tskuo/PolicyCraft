<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PageData } from './$types.js';
	import PolicyCreateForm from '$lib/components/PolicyCreateForm.svelte';
	import CaseCreateForm from '$lib/components/CaseCreateForm.svelte';
	export let data: PageData;
</script>

<div class="grid grid-cols-4">
	<div class="col-span-3 p-2">
		<Tabs.Root value="policy" class="w-full">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="policy">Policy</Tabs.Trigger>
				<Tabs.Trigger value="case">Case</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="policy">
				<Card.Root>
					<Card.Header>
						<Card.Title>Create a new policy</Card.Title>
						<Card.Description>Policy creation guidelines ...</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-2">
						<PolicyCreateForm data={data.form1} />
					</Card.Content>
					<!-- <Card.Footer></Card.Footer> -->
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="case">
				<Card.Root>
					<Card.Header>
						<Card.Title>Create a new case</Card.Title>
						<Card.Description>Case creation guidelines ...</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-2">
						<CaseCreateForm data={data.form2} />
					</Card.Content>
					<!-- <Card.Footer></Card.Footer> -->
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

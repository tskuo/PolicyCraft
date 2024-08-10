<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PageData } from './$types.js';
	import PolicyCreateForm from '$lib/components/PolicyCreateForm.svelte';
	import CaseCreateForm from '$lib/components/CaseCreateForm.svelte';
	import CreateAIPanel from '$lib/components/CreateAIPanel.svelte';
	export let data: PageData;
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<Tabs.Root value="policy" class="w-full">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="policy">Policy</Tabs.Trigger>
				<Tabs.Trigger value="case">Case</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="policy">
				<Card.Root>
					<Card.Header>
						<Card.Title>Create a new policy</Card.Title>
						<Card.Description>
							Please note that policies without any related cases will not be eligible for voting in
							the final stage. Consider adding related cases once you create the policy.
						</Card.Description>
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
						<Card.Description>
							Please avoid creating cases that duplicate existing ones so that people can focus
							votes and discussions in one place. Note that cases cannot be edited (unlike policies)
							once they are created.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-2">
						<CaseCreateForm data={data.form2} />
					</Card.Content>
					<!-- <Card.Footer></Card.Footer> -->
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
	<div class="md:col-span-1 p-2">
		<CreateAIPanel cases={data.cases} policies={data.policies} />
	</div>
</div>

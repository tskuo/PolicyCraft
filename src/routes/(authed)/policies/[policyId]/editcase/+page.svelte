<script lang="ts">
	import PolicyEditCaseForm from '$lib/components/PolicyEditCaseForm.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import PolicyEditCaseAIPanel from '$lib/components/PolicyEditCaseAIPanel.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { CircleAlert } from 'lucide-svelte';

	export let data;
</script>

<div class="grid md:grid-cols-4">
	<div class="md:col-span-3 p-2">
		<Breadcrumb.Root class="my-2 hidden md:block">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/policies">Policy Repository</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/policies/{data.policy.id}">Policy</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Editing Related Cases</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<Alert.Root class="my-4 border-primary text-primary">
			<CircleAlert class="h-4 w-4 stroke-primary" />
			<Alert.Title>Heads up!</Alert.Title>
			<Alert.Description>
				Your changes will only be saved once you click the "submit" button at the bottom of the
				page.
			</Alert.Description>
		</Alert.Root>
		<h1 class="font-bold text-xl mt-4">{data.policy.title}</h1>
		<p class="leading-relaxed my-2">{data.policy.description}</p>
		<div class="mt-6">
			<PolicyEditCaseForm
				data={data.form}
				policy={data.policy}
				allCases={data.allCases}
				dataNewCase={data.formNewCase}
				userId={data.user?.userId}
				userRole={data.user?.role}
				userCounts={data.userCounts}
			/>
		</div>
	</div>
	<div class="md:col-span-1 p-2">
		<PolicyEditCaseAIPanel
			policyDescription={data.policy.description}
			policyId={data.policy.id}
			caseContext={data.caseContext}
		/>
	</div>
</div>

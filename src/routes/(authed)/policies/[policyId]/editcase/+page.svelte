<script lang="ts">
	import PolicyEditCaseForm from '$lib/components/PolicyEditCaseForm.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	export let data;
</script>

<div class="grid grid-cols-4">
	<div class="col-span-3 p-2">
		<Breadcrumb.Root class="my-2">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/policies">Policy Repository</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link class="capitalize" href="/policies/{data.policy.id}"
						>{data.policy.title}</Breadcrumb.Link
					>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page class="capitalize">Editing Related Cases</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<h1 class="font-bold text-xl mt-4 capitalize">{data.policy.title}</h1>
		<p class="leading-relaxed my-2">
			{data.policy.description}
		</p>
		<div class="mt-6">
			<PolicyEditCaseForm
				data={data.form}
				allCases={data.allCases}
				dataNewCase={data.formNewCase}
				userId={data.user?.userId}
			/>
		</div>
	</div>
</div>

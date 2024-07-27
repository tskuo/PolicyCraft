<script lang="ts">
	import type { PageData } from './$types.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;
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
					<Breadcrumb.Link class="capitalize" href="/policies/{data.policy.id}">
						{data.policy.title}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page class="capitalize">Edit History</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</div>

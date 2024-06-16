<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
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
					<Breadcrumb.Link href="/policies/">xx</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page class="capitalize">Editing Related Cases</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</div>

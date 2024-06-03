<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte/icons';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { PencilRuler } from 'lucide-svelte/icons';
</script>

<div class="bg-sky-100 flex justify-between items-center py-2 px-6">
	<div class="flex items-center">
		<PencilRuler />
		<div class="text-3xl ml-2 font-semibold">PolicyCraft</div>
	</div>
	<div>
		<div class="flex items-center">
			<Button href="/create" class="mr-2">
				<Plus class="w-4 h-4" />
				<span class="ml-1">Create</span>
			</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root>
						<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
						<Avatar.Fallback>TK</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Profile</DropdownMenu.Item>
						<DropdownMenu.Item>Billing</DropdownMenu.Item>
						<DropdownMenu.Item>Team</DropdownMenu.Item>
						<DropdownMenu.Item>Subscription</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</div>

<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte/icons';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Menu, Home, Folders, BookText } from 'lucide-svelte/icons';
	import * as Sheet from '$lib/components/ui/sheet';
	import { navigating } from '$app/stores';
	import logo from '$lib/img/logo.webp';
	import { goto } from '$app/navigation';

	export let user;
	export let stage;

	let openSheet = false;
	$: if ($navigating) openSheet = false;
</script>

<div class="bg-sky-100 flex justify-between items-center py-2 pr-6">
	<div class="flex items-center">
		<div class="md:hidden pl-2 mr-2">
			<Sheet.Root bind:open={openSheet}>
				<Sheet.Trigger
					><Button variant="ghost" size="icon">
						<Menu class="h-6 w-6" />
					</Button></Sheet.Trigger
				>
				<Sheet.Content side="left">
					<Sheet.Header>
						<Sheet.Title>PolicyCraft</Sheet.Title>
						<Sheet.Description>
							<nav>
								<ui class="list-none">
									<li>
										<a href="/" class="p-2 flex items-center hover:bg-sky-100 rounded">
											<Home class="w-4 h-4" />
											<span class="ml-2">About</span>
										</a>
									</li>
									<li>
										<a href="/policies" class="p-2 flex items-center hover:bg-sky-100 rounded">
											<BookText class="w-4 h-4" />
											<span class="ml-2">Policy Repository</span>
										</a>
									</li>
									<li>
										<a href="/cases" class="p-2 flex items-center hover:bg-sky-100 rounded">
											<Folders class="w-4 h-4" />
											<span class="ml-2">Case Repository</span>
										</a>
									</li>
								</ui>
							</nav>
						</Sheet.Description>
					</Sheet.Header>
				</Sheet.Content>
			</Sheet.Root>
		</div>
		<Avatar.Root class="hidden md:block md:ml-4">
			<Avatar.Image src={logo} alt="PolicyCraft logo" />
		</Avatar.Root>
		<div class="text-2xl font-semibold md:pl-2">PolicyCraft</div>
	</div>
	<div>
		<div class="flex items-center">
			{#if stage !== 'vote'}
				<Button href="/create" class="mr-2">
					<Plus class="w-4 h-4" />
					<span class="ml-1 hidden md:block">Create</span>
				</Button>
			{/if}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root>
						<Avatar.Fallback>
							{user.displayName.charAt(0).toUpperCase()}
						</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>{user.displayName}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							class="hover:cursor-pointer"
							on:click={() => {
								goto('/notifications');
							}}>Notifications</DropdownMenu.Item
						>
						<DropdownMenu.Item
							class="hover:cursor-pointer"
							on:click={() => {
								goto('/activities');
							}}>Activities</DropdownMenu.Item
						>
						<DropdownMenu.Item class="w-full">
							<form action="/logout" method="POST" class="w-full">
								<button class="w-full flex justify-start">Logout</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</div>

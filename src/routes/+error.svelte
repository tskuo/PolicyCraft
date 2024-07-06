<script lang="ts">
	// import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import logo from '$lib/img/logo.webp';
</script>

<!-- <h1>{$page.status} {$page.error?.message}</h1> -->

<div class="p-8 max-w-lg mx-auto">
	<div class="w-full flex flex-col justify-center space-y-6">
		<div class="flex flex-col space-y-2 text-center">
			<img src={logo} class="object-scale-down h-[20vh]" alt="PolicyCraft logo" />
			<h1 class="text-2xl font-semibold tracking-tight">Oops, looks like something went wrong.</h1>
			<p>Please refresh the page or login again.</p>
			<p class="text-sm text-muted-foreground pt-4">
				If the problem persists, feel free to contact the developer of PolicyCraft:
				tzushenk@cs.cmu.edu
			</p>
		</div>

		<div class="mx-auto">
			<form action="/logout" method="POST" class="w-full">
				<Button type="submit" variant="secondary">Logout</Button>
			</form>
		</div>
	</div>
</div>

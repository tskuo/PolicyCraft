<script>
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { navigating } from '$app/stores';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	export let data;
</script>

<div class="sticky top-0 z-50">
	<Header user={data.user} stage={data.stage}></Header>
</div>
<div class="grid md:grid-cols-6">
	<aside class="md:col-span-1 p-4 self-start sticky top-14 hidden md:block">
		<Sidebar></Sidebar>
	</aside>
	<main class="md:col-span-5 m-2">
		{#if $navigating?.to}
			<div
				class="md:w-4/5 h-full flex flex-col space-y-2 justify-center items-center text-muted-foreground"
			>
				<p>Loading ...</p>
				<LoaderCircle class="w-1/5 h-1/4 animate-spin " />
			</div>
		{:else}
			<slot></slot>
		{/if}
	</main>
</div>

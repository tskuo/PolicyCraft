<script>
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div class="sticky top-0 z-50">
	<Header></Header>
</div>
<div class="grid grid-cols-6">
	<aside class="sm:col-span-1 p-4 self-start sticky top-14">
		<Sidebar></Sidebar>
	</aside>
	<main class="sm:col-span-5 m-2">
		<slot></slot>
	</main>
</div>

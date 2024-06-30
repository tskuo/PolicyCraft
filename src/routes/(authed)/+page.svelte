<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import DiscussionPanel from '$lib/components/DiscussionPanel.svelte';

	export let data;
	const userId = data.user?.userId;
</script>

<div class="grid grid-cols-4">
	<div class="col-span-3 p-2 mt-2">
		<h1 class="font-bold text-xl">{data.about.title}</h1>
		{#each data.about.announcements as announcement}
			<Alert.Root class="my-4">
				<Alert.Title>Announcement</Alert.Title>
				<Alert.Description>{announcement}</Alert.Description>
			</Alert.Root>
		{/each}
		<h3 class="font-bold mt-4 text-lg">Goal</h3>
		<p class="leading-relaxed my-2">{data.about.goal}</p>
		<h3 class="font-bold mt-4 text-lg">Timeline</h3>
		<p class="leading-relaxed my-2">{data.about.timeline}</p>
		<h3 class="font-bold mt-4 text-lg">Norms</h3>
		<ul class="list-disc pl-6">
			{#each data.about.norms as norm}
				<li class="leading-relaxed my-2">{norm}</li>
			{/each}
		</ul>
		<h3 class="font-bold mt-4 text-lg">Expectation</h3>
		<p class="leading-relaxed my-2">{data.about.expectation}</p>
	</div>
	<div class="col-span-1 p-2">
		<DiscussionPanel
			discussions={data.discussions}
			dataMessage={data.formMessage}
			dataDiscussion={data.formDiscussion}
			{userId}
			userDisplayNames={data.userDisplayNames}
		/>
	</div>
</div>

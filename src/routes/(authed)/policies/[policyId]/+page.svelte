<script lang="ts">
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import { Eye, Pencil, TriangleAlert, Send, Plus } from 'lucide-svelte/icons';

	export let data;

	let showAlert = false;
	let userId = 'user1';
</script>

<div>
	<div class="grid grid-cols-4">
		<div class="col-span-3 p-2">
			<div class="flex justify-between items-center">
				<Breadcrumb.Root class="my-2">
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link href="/policies">Policy Repository</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Page class="capitalize">{data.policy.title}</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
				<div>
					<Toggle
						class="mr-1 data-[state=on]:bg-sky-100"
						pressed={data.policy.watchList.includes(userId)}
					>
						<Eye class="h-4 w-4 mr-2" />{data.policy.watchList.length}
					</Toggle>
					<Button>
						<Pencil class="h-4 w-4 mr-2" />Edit policy
					</Button>
				</div>
			</div>
			{#if showAlert}
				<Alert.Root class="my-4">
					<TriangleAlert class="h-4 w-4" />
					<Alert.Title>Heads up!</Alert.Title>
					<Alert.Description>
						Two cases are flagged with warnings either because their majority votes conflict with
						this policy or are unclear under this policy. If there is no agreement on a case's vote,
						discuss it on the case page. If there is agreement on a case, discuss it on this policy
						page and edit the policy as needed.
					</Alert.Description>
				</Alert.Root>
			{/if}
			<h1 class="font-bold text-xl mt-4 capitalize">{data.policy.title}</h1>
			<p class="leading-relaxed my-2">
				{data.policy.description}
			</p>

			<h3 class="font-bold mt-6 text-lg">Related Cases</h3>
			<div class="flex justify-between items-center">
				<div class="flex my-2">
					<div>
						<Select.Root>
							<Select.Trigger class="w-[180px]">
								<Select.Value placeholder="Theme" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="light">Light</Select.Item>
								<Select.Item value="dark">Dark</Select.Item>
								<Select.Item value="system">System</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="ml-2">
						<Select.Root>
							<Select.Trigger class="w-[180px]">
								<Select.Value placeholder="Theme" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="light">Light</Select.Item>
								<Select.Item value="dark">Dark</Select.Item>
								<Select.Item value="system">System</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="flex">
					<Button>
						<Pencil class="h-4 w-4 mr-2" />Edit cases
					</Button>
				</div>
			</div>
			{#if data.cases.length > 0}
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
					{#each data.cases as c}
						<CaseCard {...c} />
					{/each}
				</div>
			{:else}
				<p class="mt-2">
					There are no related cases yet. Add related cases with the edit case button.
				</p>
			{/if}
		</div>
		<div class="col-span-1 p-2">
			<h3 class="font-bold text-lg mt-2">Discussions</h3>
			<Tabs.Root value="open" class="w-full mt-4">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="open">Open</Tabs.Trigger>
					<Tabs.Trigger value="closed">Closed</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="open" class="mx-1">
					<Accordion.Root>
						<!-- {#each data.policy.discussions as discussion}
							{#if discussion.open}
								<Accordion.Item value="item-{discussion.title}" class="text-sm">
									<Accordion.Trigger>{discussion.title}</Accordion.Trigger>
									<Accordion.Content>
										{#each discussion.comments as comment}
											<p class="font-bold py-2">{comment.userId}</p>
											<p class="bg-gray-100 rounded p-2 mb-2">
												{comment.text}
											</p>
										{/each}
										<form class="flex w-full mt-4 items-center space-x-2">
											<Input
												name="comment-{discussion.id}"
												type="text"
												placeholder="Type your message here."
											/>
											<Button type="submit">
												<Send class="h-4 w-4" />
											</Button>
										</form>
									</Accordion.Content>
								</Accordion.Item>
							{/if}
						{/each} -->
						<div class="flex justify-center mt-2">
							<Button variant="ghost"><Plus class="h-4 w-4 mr-2" />New discussion</Button>
						</div>
					</Accordion.Root>
				</Tabs.Content>
				<Tabs.Content value="closed" class="mx-1">
					<Accordion.Root>
						<!-- {#each data.policy.discussions as discussion}
							{#if !discussion.open}
								<Accordion.Item value="item-{discussion.title}" class="text-sm">
									<Accordion.Trigger>{discussion.title}</Accordion.Trigger>
									<Accordion.Content>
										{#each discussion.comments as comment}
											<p class="font-bold py-2">{comment.userId}</p>
											<p class="bg-gray-100 rounded p-2 mb-2">
												{comment.text}
											</p>
										{/each}
									</Accordion.Content>
								</Accordion.Item>
							{/if}
						{/each} -->
					</Accordion.Root>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>

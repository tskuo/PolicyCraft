<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card/index.js';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { policyEditCaseFormSchema, type PolicyEditCaseFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug from 'sveltekit-superforms';

	import { browser } from '$app/environment';
	import { X, Plus } from 'lucide-svelte';

	export let data: SuperValidated<Infer<PolicyEditCaseFormSchema>>;
	export let relatedCases;
	export let allCases;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(policyEditCaseFormSchema)
	});

	const { form: formData, enhance } = form;

	let searchText = '';
	let searchCases: any[] = [];
	let searchResultText = 'Search results will appear here.';
</script>

<form method="POST" use:enhance>
	<Form.Fieldset {form} name="cases" class="mt-4">
		<Form.Legend>Related cases</Form.Legend>
		<!-- <Form.Description></Form.Description> -->
		<div class="flex flex-wrap">
			{#each $formData.cases as _, i}
				<div
					class="w-1/4 flex items-center justify-between rounded-md pl-3 my-1 mr-2
                {relatedCases.get($formData.cases[i].caseId).label == 'allow'
						? 'bg-green-200'
						: relatedCases.get($formData.cases[i].caseId).label == 'disallow'
							? 'bg-red-200'
							: 'bg-gray-200'}"
				>
					<p class="text-sm truncate ...">{relatedCases.get($formData.cases[i].caseId).title}</p>
					<Button
						variant="ghost"
						size="sm"
						class="h-6 px-2 ml-1
                    {relatedCases.get($formData.cases[i].caseId).label == 'allow'
							? 'hover:bg-green-100'
							: relatedCases.get($formData.cases[i].caseId).label == 'disallow'
								? 'hover:bg-red-100'
								: 'hover:bg-gray-100'}"
						on:click={() => {
							$formData.cases = $formData.cases.filter(
								(c) => c.caseId !== $formData.cases[i].caseId
							);
						}}
					>
						<X class="h-4 w-4" />
					</Button>
				</div>
			{/each}
		</div>

		<div class="my-4">
			<h3 class="text-sm font-medium my-2">Add more cases</h3>
			<div class="flex items-center space-x-2">
				<Input
					placeholder="Search from the case repository by title or description"
					class="w-full"
					bind:value={searchText}
				/>
				<Button
					variant="secondary"
					on:click={() => {
						if (searchText) {
							searchCases = allCases.filter((c) => {
								let title = c.title.toLowerCase();
								let description = c.description.toLowerCase();
								return (
									title.includes(searchText.toLowerCase()) ||
									description.includes(searchText.toLowerCase())
								);
							});
						} else {
							searchCases = [];
							searchResultText = 'Your search did not match any cases.';
						}
					}}>Search</Button
				>

				<p>OR</p>
				<Button variant="secondary">Create new case</Button>
			</div>
			<div class="flex justify-center my-2 w-full">
				{#if searchCases.length !== 0}
					<Carousel.Root opts={{ align: 'start' }} class="w-11/12">
						<Carousel.Content>
							{#each searchCases as c (c.id)}
								<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
									<div class="relative">
										<CaseCard {...c} />
										<!-- <div class="absolute top-0 right-0 m-3">
											<DropdownMenu.Root>
												<DropdownMenu.Trigger asChild let:builder>
													<Button variant="ghost" builders={[builder]}
														><Plus class="h-4 w-4" /></Button
													>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content>
													<DropdownMenu.RadioGroup
														value="allow"
														onValueChange={(value) => {
															console.log(value);
															if (
																$formData.cases.some(
																	(formCase) => formCase.caseId == c.id && formCase.label == value
																)
															) {
																console.log(c.id, ' is already addded');
															} else {
																$formData.cases.filter((formCase) => formCase.caseId !== c.id);

																$formData.cases = [
																	...$formData.cases,
																	{ caseId: c.id, label: value }
																];
															}
														}}
													>
														<DropdownMenu.RadioItem value="allow"
															>Allow by this policy</DropdownMenu.RadioItem
														>
														<DropdownMenu.RadioItem value="disallow"
															>Disallow by this policy</DropdownMenu.RadioItem
														>
														<DropdownMenu.RadioItem value="unsure"
															>Unsure under this policy</DropdownMenu.RadioItem
														>
													</DropdownMenu.RadioGroup>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</div> -->
									</div>
								</Carousel.Item>
							{/each}
						</Carousel.Content>
						<Carousel.Previous />
						<Carousel.Next />
					</Carousel.Root>
				{:else}
					<Card.Root class="w-full h-80 flex  items-center justify-center">
						<p class="text-muted-foreground text-sm">{searchResultText}</p>
					</Card.Root>
				{/if}
			</div>
		</div>
	</Form.Fieldset>
	<Form.Button>Submit</Form.Button>
</form>

<!-- {#if browser}
	<SuperDebug data={$formData} />
{/if} -->

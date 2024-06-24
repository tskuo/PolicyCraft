<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		relatedCaseCreateFormSchema,
		policyEditCaseFormSchema,
		type RelatedCaseCreateFormSchema,
		type PolicyEditCaseFormSchema
	} from '$lib/schema';
	import {
		type SuperValidated,
		type Infer,
		superForm,
		type FormResult
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug from 'sveltekit-superforms';
	import { browser } from '$app/environment';
	import { X, Plus, Search } from 'lucide-svelte';
	import type { ActionData } from '../../routes/(authed)/policies/[policyId]/editcase/$types';

	export let data: SuperValidated<Infer<PolicyEditCaseFormSchema>>;
	export let allCases: any[];
	export let dataNewCase: SuperValidated<Infer<RelatedCaseCreateFormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(policyEditCaseFormSchema)
	});

	const { form: formData, enhance } = form;

	let dialogOpen = false;

	const formNewCase = superForm(dataNewCase, {
		validators: zodClient(relatedCaseCreateFormSchema),
		invalidateAll: false,
		async onUpdate({ form, result }) {
			const action = result.data as FormResult<ActionData>;
			if (form.valid && action.caseId && action.label) {
				dialogOpen = false;
				$formData.cases = [...$formData.cases, { caseId: action.caseId, label: action.label }];
				allCases = [...allCases, action.newCase];
			}
		}
	});

	const { form: formNewCaseData, enhance: enhance2 } = formNewCase;

	let searchText = '';
	let searchCases: any[] = [];
	let searchResultText = 'Search results will appear here.';
</script>

<form method="POST" use:enhance action="?/editRelatedCases">
	<Form.Fieldset {form} name="cases" class="mt-4">
		<Form.Legend>Related cases</Form.Legend>
		<div class="flex flex-wrap">
			{#each $formData.cases as _, i}
				<div
					class="w-1/4 flex items-center justify-between rounded-md pl-3 my-1 mr-2
                	{$formData.cases[i].label == 'allow'
						? 'bg-green-200'
						: $formData.cases[i].label == 'disallow'
							? 'bg-red-200'
							: 'bg-gray-200'}"
				>
					<p class="text-sm truncate ...">
						{allCases.find((c) => $formData.cases[i].caseId == c.id).title}
					</p>
					<Button
						variant="ghost"
						size="sm"
						class="h-6 px-2 ml-1
						{$formData.cases[i].label == 'allow'
							? 'hover:bg-green-100'
							: $formData.cases[i].label == 'disallow'
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
				<form
					class="grow"
					on:submit|preventDefault={() => {
						if (searchText) {
							searchCases = allCases.filter((c) => {
								let title = c.title.toLowerCase();
								let description = c.description.toLowerCase();
								return (
									title.includes(searchText.toLowerCase()) ||
									description.includes(searchText.toLowerCase())
								);
							});
						}
						if (searchCases.length == 0) {
							if (searchText) {
								searchResultText = `Your search - ${searchText} - did not match any cases.`;
							} else {
								searchResultText = 'Search results will appear here.';
							}
						}
					}}
				>
					<div class="relative">
						<Search
							class="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground"
						/>
						<Input
							placeholder="Search from the case repository by title or description"
							class="pl-8"
							bind:value={searchText}
						/>
					</div>
				</form>
				<p>OR</p>
				<Dialog.Root bind:open={dialogOpen}>
					<Dialog.Trigger class={buttonVariants({ variant: 'secondary' })}>
						Create new case
					</Dialog.Trigger>
					<Dialog.Content class="sm:max-w-lg max-h-screen">
						<Dialog.Header>
							<Dialog.Title>Create a new case</Dialog.Title>
							<Dialog.Description>Case creation guidelines ...</Dialog.Description>
						</Dialog.Header>
						<form method="POST" use:enhance2 action="?/createCase">
							<Form.Field form={formNewCase} name="title">
								<Form.Control let:attrs>
									<Form.Label>Title</Form.Label>
									<Input {...attrs} bind:value={$formNewCaseData.title} />
								</Form.Control>
								<!-- <Form.Description>This is your public display name.</Form.Description> -->
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field form={formNewCase} name="description">
								<Form.Control let:attrs>
									<Form.Label>Description</Form.Label>
									<Textarea {...attrs} bind:value={$formNewCaseData.description} />
								</Form.Control>
								<!-- <Form.Description>This is your public display name.</Form.Description> -->
								<Form.FieldErrors />
							</Form.Field>
							<Form.Fieldset form={formNewCase} name="userVote" class="space-y-5 mt-4">
								<Form.Legend>Your vote on the case</Form.Legend>
								<RadioGroup.Root
									bind:value={$formNewCaseData.userVote}
									class="flex flex-col space-y-1"
								>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="allow" {...attrs} />
											<Form.Label class="font-normal">This case should be allowed</Form.Label>
										</Form.Control>
									</div>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="disallow" {...attrs} />
											<Form.Label class="font-normal">This case should be disallowed</Form.Label>
										</Form.Control>
									</div>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="unsure" {...attrs} />
											<Form.Label class="font-normal">I am unsure about this case</Form.Label>
										</Form.Control>
									</div>
									<RadioGroup.Input name="userVote" />
								</RadioGroup.Root>
								<Form.FieldErrors />
							</Form.Fieldset>
							<Form.Fieldset form={formNewCase} name="label" class="space-y-5 mt-4">
								<Form.Legend>Label the case based on this policy</Form.Legend>
								<RadioGroup.Root
									bind:value={$formNewCaseData.label}
									class="flex flex-col space-y-1"
								>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="allow" {...attrs} />
											<Form.Label class="font-normal"
												>This case is allowed by this policy</Form.Label
											>
										</Form.Control>
									</div>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="disallow" {...attrs} />
											<Form.Label class="font-normal"
												>This case is disallowed by this policy</Form.Label
											>
										</Form.Control>
									</div>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="unsure" {...attrs} />
											<Form.Label class="font-normal"
												>This case is unsure under this policy</Form.Label
											>
										</Form.Control>
									</div>
									<RadioGroup.Input name="label" />
								</RadioGroup.Root>
								<Form.FieldErrors />
							</Form.Fieldset>
							<Form.Button class="mt-6">Submit</Form.Button>
						</form>

						<Dialog.Footer></Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
			<div class="flex justify-center my-2 w-full">
				{#if searchCases.length !== 0}
					<ScrollArea orientation="horizontal" class="w-full border rounded-lg">
						<div class="flex space-x-2 pb-4">
							{#each searchCases as searchCase (searchCase.id)}
								<div class="basis-1/3 flex-none">
									<div class="relative h-full">
										<CaseCard {...searchCase} />
										<div class="absolute top-0 right-0 m-3">
											<DropdownMenu.Root>
												<DropdownMenu.Trigger asChild let:builder>
													<Button variant="ghost" builders={[builder]}
														><Plus class="h-4 w-4" /></Button
													>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content>
													<DropdownMenu.RadioGroup
														onValueChange={(value) => {
															if (value !== undefined) {
																const existedCaseIndex = $formData.cases.findIndex(
																	(formCase) => formCase.caseId == searchCase.id
																);
																if (existedCaseIndex == -1) {
																	$formData.cases = [
																		...$formData.cases,
																		{ caseId: searchCase.id, label: value }
																	];
																} else {
																	let newFormData = $formData.cases;
																	newFormData[existedCaseIndex] = {
																		caseId: searchCase.id,
																		label: value
																	};
																	$formData.cases = newFormData;
																}
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
										</div>
									</div>
								</div>
							{/each}
						</div>
					</ScrollArea>
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
<!-- 
{#if browser}
	<SuperDebug data={$formData} />
{/if} -->

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
	import * as Alert from '$lib/components/ui/alert/index.js';
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
	import { Plus, Search, LoaderCircle, Ellipsis, Meh, Pencil } from 'lucide-svelte';
	import type { ActionData } from '../../routes/(authed)/policies/[policyId]/editcase/$types';

	export let data: SuperValidated<Infer<PolicyEditCaseFormSchema>>;
	export let policy;
	export let allCases: any[];
	export let dataNewCase: SuperValidated<Infer<RelatedCaseCreateFormSchema>>;
	export let userId;
	export let userRole;
	export let userCounts: number;

	const casesBeforeEdit = new Map();
	policy.cases.forEach((c: { caseId: string; label: string }) => {
		casesBeforeEdit.set(c.caseId, c.label);
	});

	let disalbeSubmitButton = false;
	let disalbeSubmitButton2 = false;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(policyEditCaseFormSchema),
		onSubmit({ formData }) {
			disalbeSubmitButton = true;
			const casesAfterEdit = $formData.cases.map((c) => c.caseId);
			const addedCaseId = casesAfterEdit.filter((c) => !casesBeforeEdit.has(c));
			const editedCaseId = $formData.cases
				.filter((c) => casesBeforeEdit.has(c.caseId) && casesBeforeEdit.get(c.caseId) !== c.label)
				.map((c) => c.caseId);
			const removedCaseId: string[] = [];
			casesBeforeEdit.forEach((values, keys) => {
				if (!casesAfterEdit.includes(keys)) {
					removedCaseId.push(keys);
				}
			});
			formData.set('addedCaseId', JSON.stringify(addedCaseId));
			formData.set('editedCaseId', JSON.stringify(editedCaseId));
			formData.set('removedCaseId', JSON.stringify(removedCaseId));
		},
		onError() {
			disalbeSubmitButton = false;
		},
		onUpdated() {
			disalbeSubmitButton = false;
		}
	});

	const { form: formData, enhance } = form;

	let dialogOpen = false;

	const formNewCase = superForm(dataNewCase, {
		validators: zodClient(relatedCaseCreateFormSchema),
		invalidateAll: false,
		onSubmit() {
			disalbeSubmitButton2 = true;
		},
		onError() {
			disalbeSubmitButton2 = false;
		},
		async onUpdate({ form, result }) {
			const action = result.data as FormResult<ActionData>;
			if (form.valid && action.caseId && action.label) {
				dialogOpen = false;
				$formData.cases = [...$formData.cases, { caseId: action.caseId, label: action.label }];
				allCases = [...allCases, action.newCase];
			}
		},
		onUpdated() {
			disalbeSubmitButton2 = false;
		}
	});

	const { form: formNewCaseData, enhance: enhance2 } = formNewCase;

	let searchText = '';
	let searchResultText = 'Search results will appear here.';
	$: formDataCaseId = $formData.cases.map((c) => c.caseId);
	let searchCases = allCases;

	const handleCase = async (caseId: string, label: 'allow' | 'disallow' | 'unsure' | 'remove') => {
		if (label == 'remove') {
			$formData.cases = $formData.cases.filter((formCase) => formCase.caseId !== caseId);
		} else {
			const existedCaseIndex = $formData.cases.findIndex((formCase) => formCase.caseId == caseId);
			if (existedCaseIndex == -1) {
				$formData.cases = [...$formData.cases, { caseId, label }];
			} else {
				let newFormData = $formData.cases;
				newFormData[existedCaseIndex] = { caseId, label };
				$formData.cases = newFormData;
			}
		}
	};
</script>

<form method="POST" use:enhance action="?/editRelatedCases">
	<Form.Fieldset {form} name="cases">
		<Form.Legend class="font-bold">Related cases</Form.Legend>
		<Form.Description>
			To edit the label of a related case or remove it from the policy, click the pencil icon.
		</Form.Description>
		{#if $formData.cases.length == 0}
			<Card.Root class="w-full h-80 flex items-center justify-center">
				<p class="text-muted-foreground text-sm">This policy currently has no related cases.</p>
			</Card.Root>
		{:else}
			<ScrollArea orientation="horizontal" class="rounded-lg md:w-[60vw]">
				<div class="flex space-x-2 pb-4 w-[60vw]">
					{#each $formData.cases as _, i}
						<div class="basis-full md:basis-1/3 flex-none">
							<div class="relative h-full">
								<CaseCard
									{...allCases.find((c) => $formData.cases[i].caseId == c.id)}
									label={$formData.cases[i].label}
									{userId}
									{userRole}
									{userCounts}
									hideAlert={true}
								/>
								<div class="absolute top-0 right-0 mt-4 mr-2">
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											<Button variant="ghost"><Pencil class="h-4 w-4" /></Button>
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Group>
												<DropdownMenu.Label>Edit label or remove case</DropdownMenu.Label>
												<DropdownMenu.Separator />
												<DropdownMenu.Item
													on:click={() => {
														handleCase($formData.cases[i].caseId, 'allow');
													}}
													>currently allowed by this policy
												</DropdownMenu.Item>
												<DropdownMenu.Item
													on:click={() => {
														handleCase($formData.cases[i].caseId, 'disallow');
													}}>currently disallowed by this policy</DropdownMenu.Item
												>
												<DropdownMenu.Item
													on:click={() => {
														handleCase($formData.cases[i].caseId, 'unsure');
													}}>currently ambiguous under this policy</DropdownMenu.Item
												>
												<DropdownMenu.Item
													class="text-red-500 data-[highlighted]:text-red-500"
													on:click={() => {
														handleCase($formData.cases[i].caseId, 'remove');
													}}>remove the case from this policy</DropdownMenu.Item
												>
											</DropdownMenu.Group>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</ScrollArea>
		{/if}
		<!-- deprecated -->
		<!-- <div class="flex flex-wrap">
			{#each $formData.cases as _, i}
				<div
					class="w-full md:w-2/5 flex items-center justify-between rounded-md pl-3 my-1 mr-2
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
		</div> -->
		<div>
			<h3 class="text-sm font-bold mt-4 mb-2">Add more cases</h3>
			<p class="text-sm text-muted-foreground mb-2">
				To add an existing case from the case repository as a related case, click the plus icon. To
				create and add a new case that is not in the case repository, click the "create new case"
				button.
			</p>
			<div class="flex items-center space-x-2">
				<form
					class="grow"
					on:submit|preventDefault={() => {
						if (searchText) {
							searchCases = allCases.filter((c) => {
								let title = c.title.toLowerCase();
								let description = c.description.toLowerCase();
								return (
									(title.includes(searchText.toLowerCase()) ||
										description.includes(searchText.toLowerCase())) &&
									!formDataCaseId.includes(c.id)
								);
							});
						} else {
							searchCases = allCases;
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
					<Dialog.Content class="sm:max-w-lg max-h-[80%] overflow-y-scroll">
						<Dialog.Header>
							<Dialog.Title>Create a new case</Dialog.Title>
							<Dialog.Description>
								A new case will be created as soon as you click the create button, but it will not
								be added to the policy as a related case until you click the submit button. Cases
								cannot be edited once created.
							</Dialog.Description>
						</Dialog.Header>
						<form method="POST" use:enhance2 action="?/createCase">
							<Form.Field form={formNewCase} name="title">
								<Form.Control let:attrs>
									<Form.Label>Case title</Form.Label>
									<Input {...attrs} bind:value={$formNewCaseData.title} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field form={formNewCase} name="description">
								<Form.Control let:attrs>
									<Form.Label>Case description</Form.Label>
									<Form.Description>
										The description of cases should not include judgments about whether the use of
										AI is allowed or not. You can specify your judgments through votes and reasons
										instead.
									</Form.Description>
									<Textarea {...attrs} bind:value={$formNewCaseData.description} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Fieldset form={formNewCase} name="userVote" class="mt-4 mb-2">
								<Form.Legend>Your vote on the case</Form.Legend>
								<Form.Description>
									Your vote should reflect what you think about this case, regardless of what
									current policies say.
								</Form.Description>
								<RadioGroup.Root
									bind:value={$formNewCaseData.userVote}
									class="flex flex-col space-y-1"
								>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="allow" {...attrs} />
											<Form.Label class="font-normal"
												>I think this case should be allowed</Form.Label
											>
										</Form.Control>
									</div>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="disallow" {...attrs} />
											<Form.Label class="font-normal"
												>I think this case should be disallowed</Form.Label
											>
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
							{#if $formNewCaseData.userVote !== 'unsure'}
								<Form.Field form={formNewCase} name="reason">
									<Form.Control let:attrs>
										<Form.Label>Reason for your vote</Form.Label>
										<Textarea {...attrs} bind:value={$formNewCaseData.reason} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							{:else}
								<Alert.Root>
									<Alert.Description>
										If you vote "unsure," you can still explain your reasoning on the case page
										after creating it by adding <span class="italic">separate</span> allow and disallow
										reasons that together make you unsure.
									</Alert.Description>
								</Alert.Root>
							{/if}
							<Form.Fieldset form={formNewCase} name="label" class="space-y-5 mt-4">
								<Form.Legend>Label the case based on this policy</Form.Legend>
								<RadioGroup.Root
									bind:value={$formNewCaseData.label}
									class="flex flex-col space-y-1"
								>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="allow" {...attrs} />
											<Form.Label class="font-normal">
												The case is currently allowed by this policy
											</Form.Label>
										</Form.Control>
									</div>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="disallow" {...attrs} />
											<Form.Label class="font-normal">
												The case is currently disallowed by this policy
											</Form.Label>
										</Form.Control>
									</div>
									<div class="flex items-center space-x-3 space-y-0">
										<Form.Control let:attrs>
											<RadioGroup.Item value="unsure" {...attrs} />
											<Form.Label class="font-normal">
												The case is currently ambiguous under this policy
											</Form.Label>
										</Form.Control>
									</div>
									<RadioGroup.Input name="label" />
								</RadioGroup.Root>
								<Form.FieldErrors />
							</Form.Fieldset>
							<Form.Button class="mt-6" disabled={disalbeSubmitButton2}>
								{#if disalbeSubmitButton2}
									<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
								{/if}
								Create
							</Form.Button>
						</form>

						<Dialog.Footer></Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
			<div class="my-2 w-full">
				{#if searchCases.length !== 0}
					<ScrollArea orientation="horizontal" class="rounded-lg md:w-[60vw]">
						<div class="flex space-x-2 pb-4 w-[60vw]">
							{#each searchCases as searchCase (searchCase.id)}
								<div class="basis-full md:basis-1/3 flex-none">
									<div class="relative h-full">
										<!-- <div class="w-1/3 shrink-0"> -->
										<CaseCard {...searchCase} {userId} {userRole} {userCounts} hideAlert={true} />
										<!-- </div> -->
										<div class="absolute top-0 right-0 mt-4 mr-2">
											<DropdownMenu.Root>
												<DropdownMenu.Trigger>
													<Button variant="ghost"><Plus class="h-4 w-4" /></Button>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content>
													<DropdownMenu.Group>
														<DropdownMenu.Label>Label and add case</DropdownMenu.Label>
														<DropdownMenu.Separator />
														<DropdownMenu.Item
															on:click={() => {
																handleCase(searchCase.id, 'allow');
															}}
															>currently allowed by this policy
														</DropdownMenu.Item>
														<DropdownMenu.Item
															on:click={() => {
																handleCase(searchCase.id, 'disallow');
															}}>currently disallowed by this policy</DropdownMenu.Item
														>
														<DropdownMenu.Item
															on:click={() => {
																handleCase(searchCase.id, 'unsure');
															}}>currently ambiguous under this policy</DropdownMenu.Item
														>
													</DropdownMenu.Group>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
											<!-- <DropdownMenu.Root>
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
											</DropdownMenu.Root> -->
										</div>
									</div>
								</div>
							{/each}
						</div>
					</ScrollArea>
				{:else}
					<Card.Root class="w-full h-80 flex items-center justify-center">
						<p class="text-muted-foreground text-sm">{searchResultText}</p>
					</Card.Root>
				{/if}
			</div>
		</div>
	</Form.Fieldset>
	<Form.Button disabled={disalbeSubmitButton}>
		{#if disalbeSubmitButton}
			<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
		{/if}
		Submit
	</Form.Button>
</form>

<!-- {#if browser}
	<SuperDebug data={$formData} />
{/if} -->

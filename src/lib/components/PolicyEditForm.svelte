<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { policyEditFormSchema, type PolicyEditFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { CircleAlert, LoaderCircle } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Button from './ui/button/button.svelte';
	import SuperDebug from 'sveltekit-superforms';
	import { browser } from '$app/environment';

	export let data: SuperValidated<Infer<PolicyEditFormSchema>>;
	export let cases;
	export let policy;
	export let userId;
	export let userRole;
	export let userCounts: number;

	let showNextStep = false;
	let disalbeSubmitButton = false;
	let policyTitleBeforeEdit = policy.title;
	let policyDescriptionBeforeEdit = policy.description;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(policyEditFormSchema),
		onSubmit({ formData }) {
			disalbeSubmitButton = true;
			formData.set('policyTitleBeforeEdit', policyTitleBeforeEdit);
			formData.set('policyDescriptionBeforeEdit', policyDescriptionBeforeEdit);
		},
		onError() {
			disalbeSubmitButton = false;
		},
		onUpdated({ form }) {
			disalbeSubmitButton = false;
			if (form.message) {
				policyTitleBeforeEdit = form.message.uptodateTitle;
				policyDescriptionBeforeEdit = form.message.uptodateDescription;
			}
		}
	});

	const { form: formData, enhance, message } = form;

	let api: CarouselAPI;
	let current = 0;
	let count = 0;
	let allowSubmit = false;

	$: if (api) {
		count = api.scrollSnapList().length;
		current = api.selectedScrollSnap() + 1;
		api.on('select', () => {
			current = api.selectedScrollSnap() + 1;
		});
		if (count == current) {
			allowSubmit = true;
		} else {
			allowSubmit = false;
		}
	}

	if ($formData.cases.length == 0) {
		allowSubmit = true;
	}

	let otherOption = '';
</script>

<form method="POST" use:enhance action="?/editPolicy">
	<h2 class="font-bold mt-4 mb-2">Step 1 of 2: Edit policy title and description</h2>
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Textarea {...attrs} bind:value={$formData.description} class="h-[15vh]" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<!-- survey for the study (should be removed later) -->
	<Form.Field {form} name="survey">
		<div class="mt-3 mb-3">
			<Form.Legend class="text-sm">
				What inspired you to edit this policy? Select at least one option.
			</Form.Legend>
			<Form.Description class="my-1">I am editing this policy to ...</Form.Description>
		</div>
		<div class="space-y-2">
			<div class="flex flex-row items-center space-x-3">
				<Form.Control let:attrs>
					<Checkbox
						{...attrs}
						checked={$formData.survey.includes('case_self')}
						onCheckedChange={(v) => {
							if (v) {
								$formData.survey = [...$formData.survey, 'case_self'];
							} else {
								$formData.survey = $formData.survey.filter((i) => i !== 'case_self');
							}
						}}
					/>
					<p class="text-sm">
						better address a <span class="font-semibold">specific case/scenario</span> that
						<span class="font-semibold">I thought of</span>
					</p>
					<input
						hidden
						type="checkbox"
						name={attrs.name}
						value="case_self"
						checked={$formData.survey.includes('case_self')}
					/>
				</Form.Control>
			</div>
			<div class="flex flex-row items-center space-x-3">
				<Form.Control let:attrs>
					<Checkbox
						{...attrs}
						checked={$formData.survey.includes('case_discuss')}
						onCheckedChange={(v) => {
							if (v) {
								$formData.survey = [...$formData.survey, 'case_discuss'];
							} else {
								$formData.survey = $formData.survey.filter((i) => i !== 'case_discuss');
							}
						}}
					/>
					<p class="text-sm">
						better address a <span class="font-semibold">specific case/scenario</span> that
						<span class="font-semibold">someone else shared</span>
					</p>
					<input
						hidden
						type="checkbox"
						name={attrs.name}
						value="case_discuss"
						checked={$formData.survey.includes('case_discuss')}
					/>
				</Form.Control>
			</div>
			<div class="flex flex-row items-center space-x-3">
				<Form.Control let:attrs>
					<Checkbox
						{...attrs}
						checked={$formData.survey.includes('general_self')}
						onCheckedChange={(v) => {
							if (v) {
								$formData.survey = [...$formData.survey, 'general_self'];
							} else {
								$formData.survey = $formData.survey.filter((i) => i !== 'general_self');
							}
						}}
					/>
					<p class="text-sm">
						better address a <span class="font-semibold">general issue</span> that
						<span class="font-semibold">I thought of</span>
					</p>
					<input
						hidden
						type="checkbox"
						name={attrs.name}
						value="general_self"
						checked={$formData.survey.includes('general_self')}
					/>
				</Form.Control>
			</div>
			<div class="flex flex-row items-center space-x-3">
				<Form.Control let:attrs>
					<Checkbox
						{...attrs}
						checked={$formData.survey.includes('general_discuss')}
						onCheckedChange={(v) => {
							if (v) {
								$formData.survey = [...$formData.survey, 'general_discuss'];
							} else {
								$formData.survey = $formData.survey.filter((i) => i !== 'general_discuss');
							}
						}}
					/>
					<p class="text-sm">
						better address a <span class="font-semibold">general issue</span> that
						<span class="font-semibold">someone else shared</span>
					</p>
					<input
						hidden
						type="checkbox"
						name={attrs.name}
						value="general_discuss"
						checked={$formData.survey.includes('general_discuss')}
					/>
				</Form.Control>
			</div>
			<div class="flex flex-row items-center space-x-3">
				<Form.Control let:attrs>
					<Checkbox
						{...attrs}
						checked={$formData.survey.some((s) => s.startsWith('other'))}
						onCheckedChange={(v) => {
							if (v) {
								$formData.survey = [...$formData.survey, `other: ${otherOption}`];
							} else {
								$formData.survey = $formData.survey.filter((i) => !i.startsWith('other'));
							}
						}}
					/>
					<p class="text-sm">other:</p>
					<input
						hidden
						type="checkbox"
						name={attrs.name}
						value={`other: ${otherOption}`}
						checked={$formData.survey.some((s) => s.startsWith('other'))}
					/>
					<Input
						bind:value={otherOption}
						class="font-normal w-full px-1 py-0 h-5 m-0"
						id="otherInput"
						on:input={() => {
							$formData.survey = $formData.survey.filter((i) => !i.startsWith('other:'));
							$formData.survey = [...$formData.survey, `other: ${otherOption}`];
						}}
					/>
				</Form.Control>
			</div>
			{#if $formData.survey.some((s) => s.startsWith('other')) && otherOption == ''}
				<p class="text-sm text-destructive">Please explain your selection for the other option</p>
			{/if}
		</div>
		<Form.FieldErrors />
	</Form.Field>
	{#if !showNextStep}
		<h3 class="text-sm font-medium my-3">
			Related Cases
			<span class="text-muted-foreground">(for reference)</span>
		</h3>
		{#if $formData.cases.length !== 0}
			<ScrollArea orientation="horizontal" class="rounded-lg md:w-[60vw]">
				<div class="flex space-x-2 pb-4 w-[60vw]">
					{#each $formData.cases as _, i}
						<div class="basis-full md:basis-1/3 flex-none">
							<div class="relative h-full">
								<CaseCard
									{...cases.get($formData.cases[i].caseId)}
									label={$formData.cases[i].label}
									{userId}
									{userRole}
									{userCounts}
								/>
							</div>
						</div>
					{/each}
				</div>
			</ScrollArea>
		{:else}
			<p class="text-sm">
				This policy currently has no related cases. Please note that policies without any related
				cases will not be eligible for voting in the final stage.
			</p>
		{/if}
		<Button
			class="mt-4"
			on:click={() => {
				showNextStep = true;
			}}
			>Next step
		</Button>
	{/if}
	{#if $formData.cases.length !== 0 && showNextStep}
		<h2 class="font-bold mt-4">Step 2 of 2: Check related case labels before submission</h2>
		<Form.Fieldset {form} name="cases" class="mt-4">
			<!-- <Form.Legend>Step 2 of 2: Review related case labels</Form.Legend> -->
			<Form.Description class="mb-4">
				Please check the labels of related cases to see if your policy edit will result in any
				labels that need to be updated (e.g., a case that was previously disallowed by the policy is
				now allowed after your edit).
			</Form.Description>
			<div class="flex justify-center">
				<Carousel.Root class="w-[70vw] md:w-[50vw]" bind:api>
					<Carousel.Content>
						{#each $formData.cases as _, i}
							<Carousel.Item>
								<Card.Root class="h-full">
									<Card.Content class="p-4 grid md:grid-cols-2">
										<CaseCard
											{...cases.get($formData.cases[i].caseId)}
											bind:label={$formData.cases[i].label}
											{userId}
											{userRole}
											{userCounts}
										/>
										<div class="pt-4 md:pt-0 md:px-6">
											<p class="pb-4 text-sm font-semibold">
												Related Case {i + 1} of {count}
											</p>
											<RadioGroup.Root
												bind:value={$formData.cases[i].label}
												class="flex flex-col space-y-1"
											>
												<div class="flex items-center space-x-3 space-y-0">
													<Form.Control let:attrs>
														<RadioGroup.Item value="allow" {...attrs} />
														<Form.Label class="font-normal"
															>currently allowed by this policy</Form.Label
														>
													</Form.Control>
												</div>
												<div class="flex items-center space-x-3 space-y-0">
													<Form.Control let:attrs>
														<RadioGroup.Item value="disallow" {...attrs} />
														<Form.Label class="font-normal"
															>currently disallowed by this policy</Form.Label
														>
													</Form.Control>
												</div>
												<div class="flex items-center space-x-3 space-y-0">
													<Form.Control let:attrs>
														<RadioGroup.Item value="unsure" {...attrs} />
														<Form.Label class="font-normal"
															>currently ambiguous under this policy</Form.Label
														>
													</Form.Control>
												</div>
												<RadioGroup.Input name="cases" />
											</RadioGroup.Root>
										</div>
									</Card.Content>
								</Card.Root>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
			</div>
		</Form.Fieldset>
	{/if}
	{#if $formData.cases.length == 0 && showNextStep}
		<h2 class="font-bold mt-4">Step 2 of 2: Check related case labels before submission</h2>
		<p class="text-sm mt-2">
			This policy currently has no related cases. Please directly submit the edit and consider
			adding related cases.
		</p>
	{/if}
	{#if $message}
		<Alert.Root class="my-4 border-primary text-primary">
			<CircleAlert class="h-4 w-4 stroke-primary" />
			<Alert.Title>Heads up!</Alert.Title>
			<Alert.Description>
				Other people edited the policy while you were working on it. Please review their changes
				below and consider incorporating them into your submission.
				<p class="mt-2 font-semibold">Edited title:</p>
				<p>{$message.uptodateTitle}</p>
				<p class="mt-2 font-semibold">Edited description:</p>
				<p>{$message.uptodateDescription}</p>
			</Alert.Description>
		</Alert.Root>
	{/if}
	{#if showNextStep}
		<Form.Button
			class="mt-6"
			disabled={!allowSubmit ||
				disalbeSubmitButton ||
				($formData.survey.some((s) => s.startsWith('other')) && otherOption == '') ||
				$formData.survey.length == 0}
		>
			{#if disalbeSubmitButton}
				<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
			{/if}
			Submit
		</Form.Button>
	{/if}
</form>
<!-- {#if browser}
	<SuperDebug data={$formData} />
{/if} -->

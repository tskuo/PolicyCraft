<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
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

	export let data: SuperValidated<Infer<PolicyEditFormSchema>>;
	export let cases;
	export let policy;
	export let userId;
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
</script>

{#if $message}
	<Alert.Root class="my-4 border-primary text-primary">
		<CircleAlert class="h-4 w-4 stroke-primary" />
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description>
			Other people edited the policy while you were working on it. Please review their changes below
			and consider incorporating them into your submission.
			<p class="mt-2 font-semibold">Edited title:</p>
			<p>{$message.uptodateTitle}</p>
			<p class="mt-2 font-semibold">Edited description:</p>
			<p>{$message.uptodateDescription}</p>
		</Alert.Description>
	</Alert.Root>
{/if}
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
	{#if !showNextStep}
		<h3 class="text-sm font-medium my-3">
			Related Cases
			<span class="text-muted-foreground">(for reference only, not editable here)</span>
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
															>currently unsure under this policy</Form.Label
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
	{#if showNextStep}
		<Form.Button class="mt-6" disabled={!allowSubmit || disalbeSubmitButton}>
			{#if disalbeSubmitButton}
				<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
			{/if}
			Submit
		</Form.Button>
	{/if}
</form>

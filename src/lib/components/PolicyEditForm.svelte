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

	export let data: SuperValidated<Infer<PolicyEditFormSchema>>;
	export let cases;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(policyEditFormSchema)
	});

	const { form: formData, enhance } = form;

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
</script>

<form method="POST" use:enhance action="?/editPolicy">
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
			<Textarea {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div>
		<Form.Fieldset {form} name="cases">
			<Form.Legend>Check related case labels</Form.Legend>
			<Form.Description>
				Please check the labels of related cases to see if your policy edit will result in any
				labels that need to be updated (e.g., a case that was previously disallowed by the policy is
				now allowed after your edit).
			</Form.Description>
			<div class="flex justify-center">
				<Carousel.Root class="w-10/12" bind:api>
					<Carousel.Content>
						{#each $formData.cases as _, i}
							<Carousel.Item>
								<Card.Root>
									<Card.Content class="p-4 grid grid-cols-2">
										<CaseCard
											{...cases.get($formData.cases[i].caseId)}
											bind:label={$formData.cases[i].label}
										/>
										<div class="px-6">
											<p class="pb-4 text-sm font-semibold">
												Related cases {i + 1} of {count}
											</p>
											<RadioGroup.Root
												bind:value={$formData.cases[i].label}
												class="flex flex-col space-y-1"
											>
												<div class="flex items-center space-x-3 space-y-0">
													<Form.Control let:attrs>
														<RadioGroup.Item value="allow" {...attrs} />
														<Form.Label class="font-normal">allowed by this policy</Form.Label>
													</Form.Control>
												</div>
												<div class="flex items-center space-x-3 space-y-0">
													<Form.Control let:attrs>
														<RadioGroup.Item value="disallow" {...attrs} />
														<Form.Label class="font-normal">disallowed by this policy</Form.Label>
													</Form.Control>
												</div>
												<div class="flex items-center space-x-3 space-y-0">
													<Form.Control let:attrs>
														<RadioGroup.Item value="unsure" {...attrs} />
														<Form.Label class="font-normal">unsure under this policy</Form.Label>
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
	</div>
	<Form.Button class="mt-6" disabled={!allowSubmit}>Submit</Form.Button>
</form>

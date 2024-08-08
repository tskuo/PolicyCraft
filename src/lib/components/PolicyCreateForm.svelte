<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { policyCreateFormSchema, type PolicyCreateFormSchema } from '$lib/schema';
	import { LoaderCircle } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug from 'sveltekit-superforms';
	import { browser } from '$app/environment';

	export let data: SuperValidated<Infer<PolicyCreateFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(policyCreateFormSchema),
		onSubmit() {
			disalbeSubmitButton = true;
		},
		onError() {
			disalbeSubmitButton = false;
		},
		onUpdated() {
			disalbeSubmitButton = false;
		}
	});

	const { form: formData, enhance } = form;

	let disalbeSubmitButton = false;
	let otherOption = '';
</script>

<form method="POST" use:enhance action="?/createPolicy">
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Policy title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Policy description</Form.Label>
			<Textarea {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<!-- survey for the study (should be removed later) -->
	<Form.Field {form} name="survey">
		<div class="mt-3 mb-3">
			<Form.Legend class="text-sm">What inspired you to create this policy?</Form.Legend>
			<Form.Description class="my-1">I am creating this policy to ...</Form.Description>
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
	<Form.Button
		class="mt-6"
		disabled={disalbeSubmitButton ||
			($formData.survey.some((s) => s.startsWith('other')) && otherOption == '')}
	>
		{#if disalbeSubmitButton}
			<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
		{/if}
		Create
	</Form.Button>
</form>

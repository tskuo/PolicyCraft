<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { caseCreateFormSchema, type CaseCreateFormSchema } from '$lib/schema';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { LoaderCircle } from 'lucide-svelte';

	export let data: SuperValidated<Infer<CaseCreateFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(caseCreateFormSchema),
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

	const { form: formData, enhance, message } = form;

	let disalbeSubmitButton = false;
</script>

<form method="POST" use:enhance action="?/createCase">
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<!-- <Form.Description>This is your public display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Textarea {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<!-- <Form.Description>This is your public display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<Form.Fieldset {form} name="userVote" class="space-y-5 mt-4">
		<Form.Legend>Your vote on the case</Form.Legend>
		<RadioGroup.Root bind:value={$formData.userVote} class="flex flex-col space-y-1">
			<div class="flex items-center space-x-3 space-y-0">
				<Form.Control let:attrs>
					<RadioGroup.Item value="allow" {...attrs} />
					<Form.Label class="font-normal">I think this case should be allowed</Form.Label>
				</Form.Control>
			</div>
			<div class="flex items-center space-x-3 space-y-0">
				<Form.Control let:attrs>
					<RadioGroup.Item value="disallow" {...attrs} />
					<Form.Label class="font-normal">I think this case should be disallowed</Form.Label>
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
	{#if $formData.userVote !== 'unsure'}
		<Form.Field {form} name="reason">
			<Form.Control let:attrs>
				<Form.Label>
					Reason for your vote
					<span class="text-muted-foreground">(required when your vote is allow or disallow)</span>
				</Form.Label>
				<Textarea {...attrs} bind:value={$formData.reason} />
			</Form.Control>
			<!-- <Form.Description>Reason required when your vote is allow or disallow</Form.Description> -->
			<Form.FieldErrors />
		</Form.Field>
	{/if}
	{#if $message}
		<div class="text-sm font-medium text-destructive">{$message}</div>
	{/if}
	<Form.Button class="mt-6" disabled={disalbeSubmitButton}>
		{#if disalbeSubmitButton}
			<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
		{/if}
		Submit
	</Form.Button>
</form>
<!-- <SuperDebug data={$formData} /> -->

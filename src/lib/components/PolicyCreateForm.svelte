<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { policyCreateFormSchema, type PolicyCreateFormSchema } from '$lib/schema';
	import { LoaderCircle } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

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
</script>

<form method="POST" use:enhance action="?/createPolicy">
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Policy title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<!-- <Form.Description>This is your public display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Policy description</Form.Label>
			<Textarea {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<!-- <Form.Description>This is your public display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<p class="text-muted-foreground text-sm">
		Please note that policies without any related cases will not be eligible for voting in the final
		stage. Consider adding related cases once you create the policy.
	</p>
	<Form.Button class="mt-6" disabled={disalbeSubmitButton}>
		{#if disalbeSubmitButton}
			<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
		{/if}
		Create
	</Form.Button>
</form>

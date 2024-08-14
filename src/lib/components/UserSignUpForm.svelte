<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { userSignUpFormSchema, type UserSignUpFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<UserSignUpFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(userSignUpFormSchema)
	});

	const { form: formData, enhance, message } = form;
</script>

<form method="POST" use:enhance action="?/userSignUp">
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} placeholder="AndrewID@andrew.cmu.edu" />
		</Form.Control>
		<Form.Description>Please use your Andrew email</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} type="password" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="displayName">
		<Form.Control let:attrs>
			<Form.Label>Display name</Form.Label>
			<Input {...attrs} bind:value={$formData.displayName} />
		</Form.Control>
		<Form.Description>Please enter your first and last name</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="code">
		<Form.Control let:attrs>
			<Form.Label>Code</Form.Label>
			<Input {...attrs} bind:value={$formData.code} />
		</Form.Control>
		<Form.Description>Enter the code shared by your course instructor</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full mt-2">Sign Up</Form.Button>
	{#if $message}
		<div class="text-sm text-red-500 mt-2">{$message}</div>
	{/if}
</form>

<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { userSignUpFormSchema, type UserSignUpFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<UserSignUpFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(userSignUpFormSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance action="?/userSignUp">
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} placeholder="name@example.com" />
		</Form.Control>
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
		<Form.Description>This will be your public display name.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="code">
		<Form.Control let:attrs>
			<Form.Label>Code</Form.Label>
			<Input {...attrs} bind:value={$formData.code} />
		</Form.Control>
		<Form.Description>Enter the code shared by your course instructor.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full mt-2">Sign Up</Form.Button>
</form>

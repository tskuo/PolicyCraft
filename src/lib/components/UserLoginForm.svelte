<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { userLoginFormSchema, type UserLoginFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<UserLoginFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(userLoginFormSchema)
	});

	const { form: formData, enhance, message } = form;
</script>

<form method="POST" use:enhance action="?/userLogin">
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
	<Form.Button class="w-full mt-2">Login</Form.Button>
</form>
{#if $message}
	<div class="text-sm text-red-500 mt-2 text-center">{$message}</div>
{/if}

<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { caseCreateFormSchema, type CaseCreateFormSchema } from '$lib/schema';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Check, Ban, CircleHelp } from 'lucide-svelte/icons';

	export let data: SuperValidated<Infer<CaseCreateFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(caseCreateFormSchema)
	});

	const { form: formData, enhance } = form;

	$: console.log($formData.userVote);
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
					<Form.Label class="font-normal">This case should be allowed</Form.Label>
				</Form.Control>
			</div>
			<div class="flex items-center space-x-3 space-y-0">
				<Form.Control let:attrs>
					<RadioGroup.Item value="disallow" {...attrs} />
					<Form.Label class="font-normal">This case should be disallowed</Form.Label>
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

	<!-- <Form.Fieldset {form} name="userVote">
		<Form.Legend>Toggle A, B, or C</Form.Legend>
		<ToggleGroup.Root bind:value={$formData.userVote} class="flex">
			<Form.Control let:attrs>
				<ToggleGroup.Item value="A" {...attrs}><Form.Label>A</Form.Label></ToggleGroup.Item>
			</Form.Control>
			<Form.Control let:attrs>
				<ToggleGroup.Item value="B" {...attrs}><Form.Label>B</Form.Label></ToggleGroup.Item>
			</Form.Control>
			<Form.Control let:attrs>
				<ToggleGroup.Item value="C" {...attrs}><Form.Label>C</Form.Label></ToggleGroup.Item>
			</Form.Control>
		</ToggleGroup.Root>
		<Form.FieldErrors />
	</Form.Fieldset> -->

	<Form.Button class="mt-6">Submit</Form.Button>
</form>
<!-- <SuperDebug data={$formData} /> -->

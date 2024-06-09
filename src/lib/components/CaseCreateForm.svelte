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
	<Form.Fieldset {form} name="userVote" class="space-y-3">
		<Form.Legend>Notify me about...</Form.Legend>
		<RadioGroup.Root bind:value={$formData.userVote} class="flex flex-col space-y-1">
			<div class="flex items-center space-x-3 space-y-0">
				<Form.Control let:attrs>
					<RadioGroup.Item value="allow" {...attrs} />
					<Form.Label class="font-normal">Allow</Form.Label>
				</Form.Control>
			</div>
			<div class="flex items-center space-x-3 space-y-0">
				<Form.Control let:attrs>
					<RadioGroup.Item value="disallow" {...attrs} />
					<Form.Label class="font-normal">Disallow</Form.Label>
				</Form.Control>
			</div>
			<div class="flex items-center space-x-3 space-y-0">
				<Form.Control let:attrs>
					<RadioGroup.Item value="unsure" {...attrs} />
					<Form.Label class="font-normal">Unsure</Form.Label>
				</Form.Control>
			</div>
			<RadioGroup.Input name="userVote" />
		</RadioGroup.Root>
		<Form.FieldErrors />
	</Form.Fieldset>
	<!-- <Form.Fieldset {form} name="userVote">
		<Form.Legend>Your vote</Form.Legend>
		<ToggleGroup.Root type="single" class="w-full grid grid-cols-3" bind:value={$formData.userVote}>
			<Form.Control let:attrs>
				<ToggleGroup.Item
					value="allow"
					{...attrs}
					aria-label="Toggle allow"
					class="data-[state=on]:bg-green-200"
				>
					<Check class="h-4 w-4" />
				</ToggleGroup.Item>
				<Form.Label></Form.Label>
			</Form.Control>
			<Form.Control let:attrs>
				<ToggleGroup.Item
					value="disallow"
					{...attrs}
					aria-label="Toggle disallow"
					class="data-[state=on]:bg-red-200"
				>
					<Ban class="h-4 w-4" />
				</ToggleGroup.Item>
				<Form.Label></Form.Label>
			</Form.Control>
			<Form.Control let:attrs>
				<ToggleGroup.Item
					value="unsure"
					{...attrs}
					aria-label="Toggle unsure"
					class="data-[state=on]:bg-gray-200"
				>
					<CircleHelp class="h-4 w-4" />
				</ToggleGroup.Item>
				<Form.Label></Form.Label>
			</Form.Control>
		</ToggleGroup.Root>
		<Form.FieldErrors />
	</Form.Fieldset> -->

	<Form.Button class="mt-6">Submit</Form.Button>
</form>
<SuperDebug data={$formData} />

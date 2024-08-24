<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { caseCreateFormSchema, type CaseCreateFormSchema } from '$lib/schema';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Alert from '$lib/components/ui/alert/index.js';
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

	const { form: formData, enhance } = form;

	let disalbeSubmitButton = false;
</script>

<form method="POST" use:enhance action="?/createCase">
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Case title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Case description</Form.Label>
			<Form.Description>
				The description of cases should not include judgments about whether the use of AI is allowed
				or not. You can specify your judgments through votes and reasons instead.
			</Form.Description>
			<Textarea {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Fieldset {form} name="userVote" class="mt-4 mb-2">
		<Form.Legend>Your vote on the case</Form.Legend>
		<Form.Description>
			Your vote should reflect what you think about this case, regardless of what current policies
			say.
		</Form.Description>
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
				<Form.Label>Reason for your vote</Form.Label>
				<Textarea {...attrs} bind:value={$formData.reason} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{:else}
		<Alert.Root>
			<Alert.Description>
				If you vote "unsure," you can still explain your reasoning on the case page after creating
				it by adding <span class="italic">separate</span> allow and disallow reasons that together make
				you unsure.
			</Alert.Description>
		</Alert.Root>
	{/if}
	<Form.Button class="mt-6" disabled={disalbeSubmitButton}>
		{#if disalbeSubmitButton}
			<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
		{/if}
		Create
	</Form.Button>
</form>
<!-- <SuperDebug data={$formData} /> -->

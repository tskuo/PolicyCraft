<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ThumbsUp, Pencil } from 'lucide-svelte/icons';
	import { reasonCreateFormSchema, type ReasonCreateFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let label1, label2;
	export let reasons: any[] = [];
	export let dataReason: SuperValidated<Infer<ReasonCreateFormSchema>>;

	const form = superForm(dataReason, {
		validators: zodClient(reasonCreateFormSchema)
	});

	const { form: formData, enhance } = form;

	$: reasons1 = reasons.filter((r) => r.label == label1);
	$: reasons2 = reasons.filter((r) => r.label == label2);

	let showCreateReasonForm = false;
</script>

<div class="flex justify-between items-center">
	<h3 class="font-bold mt-6 text-lg">Vote Reasons</h3>
	<Button
		on:click={() => {
			showCreateReasonForm = !showCreateReasonForm;
		}}
	>
		<Pencil class="h-4 w-4 mr-2" />Add reason
	</Button>
</div>
{#if showCreateReasonForm}
	<Card.Root class="mt-2">
		<Card.Header>
			<Card.Title>Create a new reason</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-2">
			<form method="POST" use:enhance action="?/createReason">
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
				<Form.Fieldset {form} name="label" class="space-y-5 mt-4">
					<Form.Legend>Reason to {label1} or {label2}</Form.Legend>
					<RadioGroup.Root bind:value={$formData.label} class="flex flex-col space-y-1">
						<div class="flex items-center space-x-3 space-y-0">
							<Form.Control let:attrs>
								<RadioGroup.Item value={label1} {...attrs} />
								<Form.Label class="font-normal">{label1}</Form.Label>
							</Form.Control>
						</div>
						<div class="flex items-center space-x-3 space-y-0">
							<Form.Control let:attrs>
								<RadioGroup.Item value={label2} {...attrs} />
								<Form.Label class="font-normal">{label2}</Form.Label>
							</Form.Control>
						</div>
						<RadioGroup.Input name="label" />
					</RadioGroup.Root>
					<Form.FieldErrors />
				</Form.Fieldset>
				<Form.Button class="mt-6">Submit</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
{/if}
<div class="grid grid-cols-2 my-4 gap-2">
	<div>
		<h4 class="font-semibold text-center capitalize">{label1} ({reasons1.length})</h4>
		{#each reasons1 as reason (reason.id)}
			<Card.Root class="mt-2">
				<Card.Header>
					<Card.Title>{reason.title}</Card.Title>
					<Card.Description>{reason.userId}</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>{reason.description}</p>
				</Card.Content>
				<Card.Footer>
					<Toggle aria-label="Toggle italic">
						<ThumbsUp class="mr-2 h-4 w-4" />{reason.likeList.length}
					</Toggle>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
	<div>
		<h4 class="font-semibold text-center capitalize">{label2} ({reasons2.length})</h4>
		{#each reasons2 as reason (reason.id)}
			<Card.Root class="mt-2">
				<Card.Header>
					<Card.Title>{reason.title}</Card.Title>
					<Card.Description>{reason.userId}</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>{reason.description}</p>
				</Card.Content>
				<Card.Footer>
					<Toggle aria-label="Toggle italic">
						<ThumbsUp class="mr-2 h-4 w-4" />{reason.likeList.length}
					</Toggle>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>

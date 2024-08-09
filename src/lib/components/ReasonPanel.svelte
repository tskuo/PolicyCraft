<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ThumbsUp, Pencil, LoaderCircle } from 'lucide-svelte/icons';
	import { reasonCreateFormSchema, type ReasonCreateFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let targetEntity;
	export let label1, label2;
	export let reasons: any[] = [];
	export let dataReason: SuperValidated<Infer<ReasonCreateFormSchema>>;
	export let userId;
	export let userDisplayNames;

	const form = superForm(dataReason, {
		validators: zodClient(reasonCreateFormSchema),
		onSubmit() {
			disalbeSubmitButton = true;
		},
		onError() {
			disalbeSubmitButton = false;
		},
		onUpdated({ form }) {
			if (form.valid) {
				showCreateReasonForm = false;
			}
			disalbeSubmitButton = false;
		}
	});

	const { form: formData, enhance } = form;

	$: reasons1 = reasons.filter((r) => r.label == label1);
	$: reasons2 = reasons.filter((r) => r.label == label2);

	let showCreateReasonForm = false;
	let disalbeSubmitButton = false;
</script>

<div class="flex justify-between items-center">
	<h3 class="font-bold text-lg">Vote Reasons</h3>
	{#if !showCreateReasonForm}
		<Button
			on:click={() => {
				showCreateReasonForm = true;
			}}
		>
			<Pencil class="h-4 w-4 mr-2" />Add reason
		</Button>
	{/if}
</div>
{#if showCreateReasonForm}
	<Card.Root class="mt-2">
		<Card.Header>
			<Card.Title>Create a new reason</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-2">
			<form method="POST" use:enhance action="?/createReason">
				<Form.Fieldset {form} name="label" class="space-y-5">
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
				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<Form.Label>Reason description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.description} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="mt-2" disabled={disalbeSubmitButton}>
					{#if disalbeSubmitButton}
						<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
					{/if}
					Submit
				</Form.Button>
				{#if !disalbeSubmitButton}
					<Button
						variant="secondary"
						on:click={() => {
							showCreateReasonForm = false;
						}}>Cancel</Button
					>
				{/if}
			</form>
		</Card.Content>
	</Card.Root>
{/if}
{#if reasons1.length + reasons2.length > 0}
	<div class="grid md:grid-cols-2 my-4 gap-2">
		<div>
			<h4 class="font-semibold md:text-center capitalize">{label1} ({reasons1.length})</h4>
			{#each reasons1 as reason (reason.id)}
				<Card.Root class="mt-2">
					<Card.Header>
						<Card.Description>{userDisplayNames.get(reason.userId)}</Card.Description>
					</Card.Header>
					<Card.Content>
						<p>{reason.description}</p>
					</Card.Content>
					<Card.Footer>
						<Toggle
							aria-label="Toggle like"
							class="data-[state=on]:bg-sky-100"
							pressed={reason.likeList.includes(userId)}
							onPressedChange={async (pressed) => {
								let newLikeList;
								if (reason.likeList.includes(userId)) {
									newLikeList = reason.likeList.filter((u) => u !== userId);
								} else {
									newLikeList = [...reason.likeList, userId];
								}
								reason.likeList = newLikeList;
								await fetch(`/api/reasons/${reason.id}`, {
									method: 'PATCH',
									body: JSON.stringify({ pressed }),
									headers: {
										'Content-Type': 'application/json'
									}
								});
							}}
						>
							<ThumbsUp class="mr-2 h-4 w-4" />{reason.likeList.length}
						</Toggle>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
		<div>
			<h4 class="font-semibold md:text-center capitalize">{label2} ({reasons2.length})</h4>
			{#each reasons2 as reason (reason.id)}
				<Card.Root class="mt-2">
					<Card.Header>
						<Card.Description>{userDisplayNames.get(reason.userId)}</Card.Description>
					</Card.Header>
					<Card.Content>
						<p>{reason.description}</p>
					</Card.Content>
					<Card.Footer>
						<Toggle
							aria-label="Toggle like"
							class="data-[state=on]:bg-sky-100"
							pressed={reason.likeList.includes(userId)}
							onPressedChange={async (pressed) => {
								let newLikeList;
								if (reason.likeList.includes(userId)) {
									newLikeList = reason.likeList.filter((u) => u !== userId);
								} else {
									newLikeList = [...reason.likeList, userId];
								}
								reason.likeList = newLikeList;
								await fetch(`/api/reasons/${reason.id}`, {
									method: 'PATCH',
									body: JSON.stringify({ pressed }),
									headers: {
										'Content-Type': 'application/json'
									}
								});
							}}
						>
							<ThumbsUp class="mr-2 h-4 w-4" />{reason.likeList.length}
						</Toggle>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</div>
{:else}
	<p class="mt-2">
		This {targetEntity} currently has no vote reasons. Click the "add reason" button to provide reasons.
	</p>
{/if}

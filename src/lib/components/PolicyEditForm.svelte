<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { policyEditFormSchema, type PolicyEditFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<PolicyEditFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(policyEditFormSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance action="?/editPolicy">
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
	<div class="flex justify-center">
		<Carousel.Root
			opts={{
				align: 'center'
			}}
			class="w-full max-w-[80%]"
		>
			<Carousel.Content>
				{#each Array(5) as _, i (i)}
					<Carousel.Item>
						<div class="p-1">
							<Card.Root>
								<Card.Content class="flex  items-center justify-center p-6">
									<span class="text-3xl font-semibold">{i + 1}</span>
								</Card.Content>
							</Card.Root>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
	<Form.Button class="mt-6">Submit</Form.Button>
</form>

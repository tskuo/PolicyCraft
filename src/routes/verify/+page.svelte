<script lang="ts">
	import logo from '$lib/img/logo.webp';
	import * as Form from '$lib/components/ui/form';
	export let data;
	export let form;
</script>

<div class="p-8 max-w-lg mx-auto">
	<div class="w-full flex flex-col justify-center">
		<div class="flex flex-col space-y-2 text-center">
			<img src={logo} class="object-scale-down h-[20vh]" alt="PolicyCraft logo" />
			<h1 class="text-2xl font-semibold tracking-tight">Welcome to PolicyCraft!</h1>
			<p class="text-sm text-muted-foreground">
				Before we get started, please verify your email address by clicking the link we sent to {data.currentEmail}.
			</p>
			<p class="text-sm text-muted-foreground">Refresh this page after your email is verified.</p>
		</div>
		{#if form?.emailSent}
			<p class="text-sm text-center mt-4 text-primary">The link has been sent again.</p>
		{/if}

		<div class="relative my-6">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t" />
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground"> OR </span>
			</div>
		</div>
		<div class="mx-auto">
			<form action="?/sendLink" method="POST">
				<Form.Button variant="outline" disabled={form?.emailSent}>
					Re-send verification link
				</Form.Button>
			</form>
		</div>
		<div class="mx-auto mt-3">
			<form action="/logout" method="POST">
				<Form.Button variant="outline">Login with another email</Form.Button>
			</form>
		</div>
	</div>
</div>

<script lang="ts">
	import UserSignUpForm from '$lib/components/UserSignUpForm.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import logo from '$lib/img/logo.webp';
	export let data;
</script>

<div class="p-8 max-w-lg mx-auto">
	<div class="w-full flex flex-col justify-center space-y-6">
		<div class="flex flex-col space-y-2 text-center">
			<img src={logo} class="object-scale-down h-[20vh]" alt="PolicyCraft logo" />
			<h1 class="text-2xl font-semibold tracking-tight">Create a new account</h1>
			<p class="text-sm text-muted-foreground">It's quick and easy.</p>
		</div>
		<UserSignUpForm data={data.form} />
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t" />
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground"> OR </span>
			</div>
		</div>
		<div class="mx-auto">
			<Button href="/login" variant="ghost">Already have an account?</Button>
		</div>
	</div>
</div>

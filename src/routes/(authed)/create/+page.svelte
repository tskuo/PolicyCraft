<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<div class="grid grid-cols-4">
	<div class="col-span-3 p-2">
		<Tabs.Root value="policy" class="w-full">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="policy">Policy</Tabs.Trigger>
				<Tabs.Trigger value="case">Case</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="policy">
				<Card.Root>
					<Card.Header>
						<Card.Title>Create a new policy</Card.Title>
						<Card.Description>
							Make changes to your account here. Click save when you're done.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-2">
						<div class="space-y-1">
							<Label for="name">Name</Label>
							<Input id="name" value="Pedro Duarte" />
						</div>
						<div class="space-y-1">
							<Label for="username">Username</Label>
							<Input id="username" value="@peduarte" />
						</div>
					</Card.Content>
					<Card.Footer>
						<Button>Submit</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="case">
				<Card.Root>
					<Card.Header>
						<Card.Title>Create a new case</Card.Title>
						<Card.Description>
							Change your password here. After saving, you'll be logged out.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-2">
						<div class="space-y-1">
							<Label for="current">Current password</Label>
							<Input id="current" type="password" />
						</div>
						<div class="space-y-1">
							<Label for="new">New password</Label>
							<Input id="new" type="password" />
						</div>
					</Card.Content>
					<Card.Footer>
						<Button>Submit</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

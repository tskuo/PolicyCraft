<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import CaseCard from '$lib/components/CaseCard.svelte';
	import PolicyCard from '$lib/components/PolicyCard.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ThumbsUp, Pencil, Ellipsis, Check, Ban, CircleHelp } from 'lucide-svelte/icons';
</script>

<div>
	<div class="grid grid-cols-4">
		<div class="col-span-3 p-2">
			<div class="flex justify-between items-center">
				<Breadcrumb.Root class="my-2">
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link href="/case">Case Repository</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Case #123</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger><Ellipsis class="h-4 w-4" /></DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>More Actions</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>Profile</DropdownMenu.Item>
							<DropdownMenu.Item>Billing</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<h1 class="font-bold text-xl mt-4">
				Bob uses ChatGPT to generate ideas for reading reflection
			</h1>
			<p class="leading-relaxed my-2">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus vero facere, distinctio
				quasi alias corporis? Iste quidem impedit alias at consequatur earum, et eius magni
				temporibus, ab, illum inventore ut! Lorem ipsum dolor, sit amet consectetur adipisicing
				elit. Quia quas eius inventore fugit blanditiis deserunt provident temporibus. Minus eius
				illum quam perferendis atque, magnam natus accusantium perspiciatis iure alias ipsum.
			</p>
			<ToggleGroup.Root variant="outline" type="single" class="flex justify-start my-4">
				<ToggleGroup.Item value="allow" aria-label="Toggle allow">
					<Check class="h-4 w-4 mr-2" />allow
				</ToggleGroup.Item>
				<ToggleGroup.Item value="disallow" aria-label="Toggle disallow">
					<Ban class="h-4 w-4 mr-2" />disallow
				</ToggleGroup.Item>
				<ToggleGroup.Item value="unsure" aria-label="Toggle unsure">
					<CircleHelp class="h-4 w-4 mr-2" />unsure
				</ToggleGroup.Item>
			</ToggleGroup.Root>

			<h3 class="font-bold mt-6 text-lg">Vote Distribution (53)</h3>
			<div class="w-full border h-3 bg-gray-200 my-4 rounded"></div>
			<div class="flex justify-between items-center">
				<h3 class="font-bold mt-6 text-lg">Vote Reasons (3)</h3>
				<Button>
					<Pencil class="h-4 w-4 mr-2" />Add reason
				</Button>
			</div>
			<div class="grid grid-cols-2 my-4 gap-2">
				<div>
					<h4 class="font-semibold text-center">Allow</h4>
					<Card.Root class="mt-2">
						<Card.Header>
							<Card.Title>Loren ipsum</Card.Title>
							<Card.Description>Purple Koala</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>
								Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque corporis unde
								magnam cumque quam error ad fugit quas amet, repellendus exercitationem nisi alias
								maxime ullam ut. Ea minima corporis porro?
							</p>
						</Card.Content>
						<Card.Footer>
							<Toggle aria-label="Toggle italic">
								<ThumbsUp class="mr-2 h-4 w-4" />13
							</Toggle>
						</Card.Footer>
					</Card.Root>
					<Card.Root class="mt-2">
						<Card.Header>
							<Card.Title>Loren ipsum</Card.Title>
							<Card.Description>Purple Koala</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>
								Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque corporis unde
								magnam cumque quam error ad fugit quas amet, repellendus exercitationem nisi alias
								maxime ullam ut. Ea minima corporis porro?
							</p>
						</Card.Content>
						<Card.Footer>
							<Toggle aria-label="Toggle italic">
								<ThumbsUp class="mr-2 h-4 w-4" />13
							</Toggle>
						</Card.Footer>
					</Card.Root>
				</div>
				<div>
					<h4 class="font-semibold text-center">Disallow</h4>
					<Card.Root class="mt-2">
						<Card.Header>
							<Card.Title>Loren ipsum</Card.Title>
							<Card.Description>Purple Koala</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>
								Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque corporis unde
								magnam cumque quam error ad fugit quas amet, repellendus exercitationem nisi alias
								maxime ullam ut. Ea minima corporis porro? Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Iure pariatur voluptas illo, et perferendis libero nisi odio
								nihil. Quos odio laborum aliquid est provident exercitationem, qui excepturi nam
								ullam iure?
							</p>
						</Card.Content>
						<Card.Footer>
							<Toggle aria-label="Toggle italic">
								<ThumbsUp class="mr-2 h-4 w-4" />13
							</Toggle>
						</Card.Footer>
					</Card.Root>
				</div>
			</div>

			<h3 class="font-bold mt-6 text-lg">Related Policies</h3>
			<PolicyCard />
			<PolicyCard />
		</div>
		<div class="col-span-1 p-2">
			<h3 class="font-bold text-lg mt-2">Discussions</h3>
			<Tabs.Root value="open" class="w-full mt-4">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="open">Open</Tabs.Trigger>
					<Tabs.Trigger value="closed">Closed</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="open" class="mx-1">
					<Accordion.Root>
						<Accordion.Item value="item-1" class="text-sm">
							<Accordion.Trigger>Is summarization brainstorming?</Accordion.Trigger>
							<Accordion.Content>
								<p class="font-bold py-2">Purple Koala</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora illum cumque eos
									placeat molestias tempore ducimus nihil lib
								</p>
								<p class="font-bold py-2">Yellow Cat</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora illum cumque eos
									placeat molestias tempore ducimus nihil lib
								</p>
								<p class="font-bold py-2">Blue Elephant</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora illum cumque eos
									placeat molestias tempore ducimus nihil lib
								</p>
								<Textarea placeholder="Type your message here." class="mt-4 outline-none" />
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="item-2" class="text-sm">
							<Accordion.Trigger>What counts as prototype?</Accordion.Trigger>
							<Accordion.Content>
								<p class="font-bold py-2">Blue Elephant</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora illum cumque eos
									placeat molestias tempore ducimus nihil lib
								</p>
								<Textarea placeholder="Type your message here." class="mt-4" />
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="item-3" class=" text-sm">
							<Accordion.Trigger>The definition of idea ownership?</Accordion.Trigger>
							<Accordion.Content>
								<p class="font-bold py-2">Blue Elephant</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora illum cumque eos
									placeat molestias tempore ducimus nihil lib
								</p>
								<Textarea placeholder="Type your message here." class="mt-4" />
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</Tabs.Content>
				<Tabs.Content value="closed" class="mx-1">
					<Accordion.Root>
						<Accordion.Item value="item-1" class="text-sm">
							<Accordion.Trigger>Is it ssdas?</Accordion.Trigger>
							<Accordion.Content>
								<p class="font-bold py-2">Blue Elephant</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora illum cumque eos
									placeat molestias tempore ducimus nihil lib
								</p>
								<p class="font-bold py-2">Blue Elephant</p>
								<p class="bg-gray-100 rounded p-2 mb-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora illum cumque eos
									placeat molestias tempore ducimus nihil lib
								</p>
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>

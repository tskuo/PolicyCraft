<script lang="ts">
	import { Home, Folders, BookText } from 'lucide-svelte/icons';
</script>

<nav>
	<ui class="list-none">
		<li>
			<a href="/" class="p-2 flex items-center hover:bg-sky-100 rounded">
				<Home class="w-5 h-5" />
				<span class="ml-2 hidden md:inline">About</span>
			</a>
		</li>
		<li>
			<a href="/policies" class="p-2 flex items-center hover:bg-sky-100 rounded">
				<BookText class="w-5 h-5" />
				<span class="ml-2 hidden md:inline">Policy Repository</span>
			</a>
		</li>
		<li>
			<a href="/cases" class="p-2 flex items-center hover:bg-sky-100 rounded">
				<Folders class="w-5 h-5" />
				<span class="ml-2 hidden md:inline">Case Repository</span>
			</a>
		</li>
	</ui>
</nav>

<script>
	import { PrismicLink } from '@prismicio/svelte';
	import WordMark from './WordMark.svelte';

	/** @type {import("@prismicio/client").Content.NavigationDocument} */
	export let navigation;
</script>

<footer>
	<nav
		class="flex flex-col items-center justify-between gap-6 border-t border-x-gray-600 px-8 py-7 md:flex-row"
		aria-label="Footer"
	>
		<a href="/">
			<WordMark />
			<span class="sr-only">{navigation.data.site_title} home page</span>
		</a>

		<ul class="flex gap-6">
			{#each navigation.data.nav as item (item.label)}
				<li>
					<PrismicLink class="inline-flex min-h-11 items-center" field={item.link}>
						{item.label}
					</PrismicLink>
				</li>
			{/each}
		</ul>
	</nav>
</footer>

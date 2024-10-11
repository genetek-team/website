<script>
	import { PrismicLink, PrismicImage } from '@prismicio/svelte';
	// import WordMark from './WordMark.svelte';

	/** @type {import("@prismicio/client").Content.NavigationDocument} */
	export let navigation;
</script>

<footer>
	<nav
		class="flex flex-col items-center justify-between gap-6 border-t border-x-gray-600 px-8 py-7 md:flex-row"
		aria-label="Footer"
	>
		<a href="/">
			<div class="h-[40px] w-[135px] mt-6 md:m-0 lg:m-0">
				<PrismicImage field={navigation.data.og_image} />
			</div>
			<span class="sr-only">{navigation.data.site_title} home page</span>
		</a>

		<ul class="invisible flex gap-6 md:visible lg:visible">
			{#each navigation.data.nav as item (item.label)}
				<li class="text-sm">
					<PrismicLink class="inline-flex min-h-11 items-center" field={item.link}>
						{item.label}
					</PrismicLink>
				</li>
			{/each}
		</ul>
	</nav>
</footer>

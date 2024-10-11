<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicRichText, PrismicLink, PrismicImage, PrismicText } from '@prismicio/svelte';

	import clsx from 'clsx';

	export let slice: Content.CategoriesSlice;

	/** @type {import("@prismicio/client").Content.CategoryDocument[]} */
	export let categories = [];
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<h2 class="max-w-2xl text-balance text-center text-5xl font-medium md:text-7xl">
		<PrismicRichText field={slice.primary.heading} />
	</h2>

	<div class="mx-auto mt-6 max-w-md text-balance text-center text-gray-300">
		<PrismicRichText field={slice.primary.body} />
	</div>

	<div class="mt-20 grid gap-16">
		{#each categories as category, index}
			<div
				class="group relative grid gap-4 opacity-85 transition-opacity duration-300 hover:cursor-pointer hover:opacity-100 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
			>
				<div class="col-span-1 flex flex-col justify-center gap-4">
					<h3 class="text-4xl">
						<PrismicText field={category.data.company} />
					</h3>
					<div class="max-w-md">
						<PrismicRichText field={category.data.description} />
					</div>

					<PrismicLink
						document={category}
						class="z-10 after:absolute after:inset-0 hover:underline"
					>
						<PrismicText field={category.data.company} />
					</PrismicLink>
				</div>
				<div class={clsx('relative lg:col-span-2', index % 2 && 'md:-order-1')}>
					<div class="image-glow -bottom-8 -left-4 bg-orange-500" />
					<div class="image-glow -right-4 -top-8 bg-violet-500" />
					<PrismicImage
						field={category.data.image}
						sizes="(max-width: 768px) 100vw, 50vw"
						class="z-20 scale-[.98] rounded-xl transition-transform duration-300 group-hover:scale-100"
					/>
				</div>
			</div>
		{/each}
	</div>
</Bounded>

<style>
	.image-glow {
		@apply absolute h-1/2 w-1/2 rounded-full opacity-0 mix-blend-screen blur-3xl transition-opacity duration-500 group-hover:opacity-30;
	}
</style>

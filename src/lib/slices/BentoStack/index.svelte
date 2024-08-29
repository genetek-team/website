<script lang="ts">
	import type { Content } from '@prismicio/client';

	import Bounded from '$lib/components/Bounded.svelte';

	import { PrismicImage, PrismicRichText, PrismicText } from '@prismicio/svelte';

	import clsx from 'clsx';

	import GoldText from './GoldText.svelte';

	import Heading2 from '$lib/components/Heading2.svelte';

	export let slice: Content.BentoStackSlice;
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<PrismicRichText
		field={slice.primary.heading}
		components={{ em: GoldText, heading2: Heading2 }}
	/>

	<!-- <div class="mx-auto mt-6 max-w-md text-balance text-center text-gray-300">
		<PrismicRichText field={slice.primary.body} />
	</div> -->

	<div class="mt-16 grid max-w-4xl grid-rows-[auto_auto_auto] gap-8 md:grid-cols-3 md:gap-10">
		{#each slice.primary.card as item}
			<div
				class={clsx(
					'glass-container row-span-3 grid grid-rows-subgrid gap-4 rounded-lg bg-gray-950/60 p-4 before:bg-gray-100/10',
					'md:col-span-1'
				)}
			>
				<!-- <div class="max-w-md text-balance text-gray-300">
					<PrismicRichText field={item.body} />
				</div> -->
				<PrismicImage class="max-h-36 w-auto" field={item.image} />

				<span>${item.price}</span>

				<h3 class="text-xl">
					<PrismicText field={item.title} />
				</h3>
			</div>
		{/each}
	</div>
</Bounded>

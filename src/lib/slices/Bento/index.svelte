<script lang="ts">
	import type { Content } from '@prismicio/client';

	import Bounded from '$lib/components/Bounded.svelte';

	import { PrismicImage, PrismicLink, PrismicRichText, PrismicText } from '@prismicio/svelte';

	import clsx from 'clsx';

	import GoldText from './GoldText.svelte';

	import Heading2 from '$lib/components/Heading2.svelte';

	export let slice: Content.BentoSlice;
</script>

<Bounded data-slice-type={slice.slice_type} class="mb-12" data-slice-variation={slice.variation}>
	<div class="mt-2 grid max-w-4xl grid-rows-[auto_auto_auto] gap-8 md:grid-cols-3 md:gap-10">
		{#each slice.primary.card as item}
			<div
				class={clsx(
					'glass-container relative row-span-1 grid grid-rows-subgrid gap-4 rounded-lg bg-gray-950/60 p-4 before:bg-gray-100/10',
					item.wide ? 'md:col-span-2' : 'md:col-span-1'
				)}
			>
				<div
					class="absolute left-1/3 top-0 -z-10 h-2/3 w-2/3 bg-blue-700/50 mix-blend-screen blur-[120px] filter"
				/>
				<PrismicImage class="h-full w-full rounded-lg object-cover" field={item.image} />
				<div class="absolute inset-0 flex flex-col items-center justify-center">
					<h3 class="text-center text-4xl font-bold text-white">
						<PrismicText field={item.title} />
					</h3>
					<PrismicLink field={item.category} class="group">
						<p class="flex flex-row font-semibold transition duration-200 group-hover:underline">
							<PrismicText field={item.body} />
							<span
								class="ml-1 mt-1 transform text-xl transition duration-200 group-hover:scale-110"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									viewBox="0 0 256 256"
									{...$$props}
								>
									<path
										fill="currentColor"
										d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m45.66-93.66a8 8 0 0 1 0 11.32l-32 32a8 8 0 0 1-11.32-11.32L148.69 136H88a8 8 0 0 1 0-16h60.69l-18.35-18.34a8 8 0 0 1 11.32-11.32Z"
									/>
								</svg>
							</span>
						</p>
					</PrismicLink>
				</div>
			</div>
		{/each}
	</div>
</Bounded>

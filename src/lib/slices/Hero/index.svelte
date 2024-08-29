<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicImage } from '@prismicio/svelte';

	export let slice: Content.HeroSlice;

	// all images:
	// slice.primary.image_1 / slice.primary.image_2 / slice.primary.image_3 / slice.primary.image_4 / slice.primary.image_5
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class="relative text-center">
		<div class="glass-container mt-2 w-fit">
			<div
				class="absolute left-1/3 top-0 -z-10 h-2/3 w-2/3 bg-indigo-700/50 mix-blend-screen blur-[120px] filter"
			/>
			<div
				class="absolute left-0 top-1/3 -z-10 h-2/3 w-2/3 bg-blue-600/50 mix-blend-screen blur-[120px] filter"
			/>
			<PrismicImage class="rounded-lg" field={slice.primary.image_1} />
		</div>
	</div>
	<!-- Placeholder component for {slice.slice_type} (variation: {slice.variation}) Slices -->
</Bounded>

<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicImage, PrismicLink, PrismicRichText } from '@prismicio/svelte';

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import { Button } from '$lib/components/ui/button/index.js';
	import clsx from 'clsx';

	import Heading2 from '$lib/components/Heading2.svelte';

	export let slice: Content.TermsAndConditionsSectionSlice;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Handle mobile responsiveness
		const isMobile = window.innerWidth < 300; // Adjust the breakpoint as needed
		const offset = isMobile ? 50 : 100; // Adjust based on mobile nav height or design

		// Animation for the Terms and Conditions heading
		gsap.fromTo(
			'.termsAndConditions__heading',
			{
				y: 100,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				ease: 'power2.inOut',
				duration: 0.8,
				scrollTrigger: {
					trigger: '.termsAndConditions__heading',
					start: `top bottom+=${offset}%`, // Adjust based on offset
					end: 'top top-=10%', // Optional: Define the end to keep the heading visible during scroll
					toggleActions: 'play pause resume reverse',
					markers: false // Enable markers for debugging
				}
			}
		);

		// Animation for the Terms and Conditions glow effect
		gsap.fromTo(
			'.termsAndConditions__glow',
			{
				scale: 0.7,
				opacity: 0.1
			},
			{
				scale: 1,
				opacity: 1,
				ease: 'power2.inOut',
				duration: 1,
				scrollTrigger: {
					trigger: '.termsAndConditions__heading',
					start: `top bottom+=${offset}%`, // Adjust based on offset
					toggleActions: 'play pause resume reverse'
				}
			}
		);
	});
</script>

<Bounded
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="flex flex-col items-start gap-8 md:flex-row"
>
	<div
		class="termsAndConditions__glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>

	<h2 class="termsAndConditions__heading mb-16">
		<PrismicRichText field={slice.primary.title} components={{ heading2: Heading2 }} />
	</h2>

	<div class="flex flex-row gap-6">
		<!-- <PrismicImage
			field={slice.primary.image}
			class="max-h-screen rounded-lg object-cover md:w-1/2"
		/> -->

		<div
			class="glass-container w-full gap-4 rounded-lg bg-gray-950/60 px-4 py-6 before:bg-gray-100/10"
		>
			<!-- <p class="mb-4 text-balance">
				<PrismicRichText field={slice.primary.description} />
			</p> -->

			{#each slice.primary.term as item}
				<div class="mb-6 flex flex-col items-start justify-start text-left">
					<h3 class="mb-2 text-lg font-semibold">
						<PrismicRichText field={item.term_title} />
					</h3>

					<p>
						<PrismicRichText field={item.term_description} />
					</p>
				</div>
			{/each}

			<div class="flex flex-row items-center justify-center">
				<PrismicLink field={slice.primary.button_link}>
					<Button
						class={clsx(
							'relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
						)}
						><span class="mr-2 text-2xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 256 256"
								{...$$props}
								><path
									fill="currentColor"
									d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-96 85.15L52.57 64h150.86ZM98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z"
								/></svg
							>
						</span>{slice.primary.button_label}</Button
					>
				</PrismicLink>
			</div>
		</div>
		<div
			class="absolute right-1/3 top-44 -z-10 h-2/3 w-2/3 bg-blue-700/25 mix-blend-screen blur-[120px] filter"
		/>
	</div>
</Bounded>

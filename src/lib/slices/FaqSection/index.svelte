<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';

	import * as Accordion from '$lib/components/ui/accordion/index.js';

	import Heading2 from '$lib/components/Heading2.svelte';

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	export let slice: Content.FaqSectionSlice;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Handle mobile responsiveness
		const isMobile = window.innerWidth < 300; // Adjust the breakpoint as needed
		const offset = isMobile ? 50 : 100; // Adjust based on mobile nav height or design

		// Animation for the FAQ heading
		gsap.fromTo(
			'.faq__heading',
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
					trigger: '.faq__heading',
					start: `top bottom+=${offset}%`, // Adjust based on offset
					end: 'top top-=10%', // Optional: Define the end to keep the heading visible during scroll
					toggleActions: 'play pause resume reverse',
					markers: false // Enable markers for debugging
				}
			}
		);

		// Animation for the FAQ glow effect
		gsap.fromTo(
			'.faq__glow',
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
					trigger: '.faq__heading',
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
		class="faq__glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>

	<h2
		class=" faq__heading mb-16 flex flex-row items-start justify-start justify-self-start text-left"
	>
		<PrismicRichText field={slice.primary.title} components={{ heading2: Heading2 }} />
	</h2>

	<div class="flex w-full flex-col gap-6">
		<!-- <PrismicImage field={slice.primary.image} class="max-h-screen rounded-lg object-cover" /> -->

		<div class="flex flex-col gap-4">
			<div
				class="glass-container w-full gap-4 rounded-lg bg-gray-950/60 px-4 py-6 before:bg-gray-100/10"
			>
				<h3 class="mb-4 text-xl font-semibold">
					<PrismicRichText field={slice.primary.description} />
				</h3>
				<!-- Accordion for FAQ -->
				<Accordion.Root class="">
					{#each slice.primary.questioncard as item, index}
						<Accordion.Item value={`item-${index}`}>
							<Accordion.Trigger>
								<PrismicRichText field={item.question_title} />
							</Accordion.Trigger>
							<Accordion.Content>
								<PrismicRichText field={item.question_text} />
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>
		</div>
		<div
			class="absolute right-0 top-1/3 -z-10 h-2/3 w-2/3 bg-blue-700/25 mix-blend-screen blur-[120px] filter"
		/>
	</div>
</Bounded>

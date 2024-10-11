<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import { PrismicImage, PrismicLink, PrismicRichText, PrismicText } from '@prismicio/svelte';
	import Bounded from './../../components/Bounded.svelte';
	import type { Content } from '@prismicio/client';

	import IconQuote from '~icons/ph/quotes';
	import IconChat from '~icons/ph/chat-circle-dots';

	import clsx from 'clsx';

	import GoldText from './GoldText.svelte';
	import Heading2 from '$lib/components/Heading2.svelte';

	export let slice: Content.ReviewsSlice;

	const icons = {
		quote: IconQuote,
		chat: IconChat
	};

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Handle mobile responsiveness
		const isMobile = window.innerWidth < 300; // Adjust the breakpoint as needed
		const offset = isMobile ? 50 : 100; // Adjust based on mobile nav height or design

		// Animation for the heading
		gsap.fromTo(
			'.reviews__heading',
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
					trigger: '.reviews__heading',
					start: `top bottom+=${offset}%`, // Adjust based on offset
					end: 'top top-=10%', // Optional: Define the end to keep the heading visible during scroll
					toggleActions: 'play pause resume reverse',
					markers: false // Enable markers for debugging
				}
			}
		);

		// Animation for the glow effect
		gsap.fromTo(
			'.reviews__glow',
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
					trigger: '.reviews__heading',
					start: `top bottom+=${offset}%`, // Adjust based on offset
					toggleActions: 'play pause resume reverse'
				}
			}
		);
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div
		class="reviews__glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>

	<h2 class="reviews__heading">
		<PrismicRichText
			field={slice.primary.heading}
			components={{ em: GoldText, heading2: Heading2 }}
		/>
	</h2>

	<div class="mt-16 grid max-w-4xl grid-rows-[auto_auto_auto] gap-8 md:grid-cols-3 md:gap-12">
		{#each slice.primary.card as item}
			<div
				class={clsx(
					'glass-container row-span-4 grid grid-rows-subgrid gap-4 rounded-lg bg-gray-950/60 p-4 before:bg-gray-100/10',
					'md:col-span-1'
				)}
			>
				<div class="text-3xl">
					<svelte:component this={icons[item.icon]} />
				</div>
				<div>
					<h3 class="mb-2 block w-full text-xl font-semibold">
						<PrismicText field={item.title} />
					</h3>
					<PrismicText field={item.body} />
				</div>

				<div>
					<PrismicText field={item.name} />
				</div>
				<div
					class="absolute left-1/3 top-0 -z-10 h-2/3 w-2/3 bg-blue-600/50 mix-blend-screen blur-[120px] filter"
				/>
			</div>
		{/each}
	</div>
</Bounded>

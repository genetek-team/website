<script lang="ts">
	import { onMount } from 'svelte';
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicRichText, PrismicText } from '@prismicio/svelte';

	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import clsx from 'clsx';

	import GoldText from './GoldText.svelte';

	import Heading2 from '$lib/components/Heading2.svelte';

	// import IconLabel from '~icons/ph/tag-bold';
	// import IconFast from '~icons/ph/speedometer';
	// import IconClick from '~icons/ph/cursor-click';
	// import IconStore from '~icons/ph/storefront';
	// import IconBox from '~icons/ph/dropbox-logo';
	// import IconMail from '~icons/ph/mailbox';

	export let slice: Content.PromoCardsSlice;

	// const icons = {
	// 	label: IconLabel,
	// 	fast: IconFast,
	// 	click: IconClick,
	// 	store: IconStore,
	// 	box: IconBox,
	// 	mail: IconMail
	// };

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.fromTo(
			'.promocards__heading',
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
					trigger: '.promocards__heading',
					start: 'top bottom-=40%',
					toggleActions: 'play pause resume reverse'
				}
			}
		);

		gsap.fromTo(
			'.promocards__glow',
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
					trigger: '.promocards__heading',
					start: 'top bottom-=40%',
					toggleActions: 'play pause resume reverse'
				}
			}
		);
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div
		class="promocards__glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>

	<h2 class="promocards__heading">
		<PrismicRichText
			field={slice.primary.heading}
			components={{ em: GoldText, heading2: Heading2 }}
		/>
	</h2>

	<div class="mt-16 grid max-w-4xl grid-rows-[auto_auto_auto] gap-8 md:grid-cols-3 md:gap-12">
		{#each slice.primary.card as item, index}
			<div
				class={clsx(
					'glass-container row-span-2 grid grid-rows-subgrid gap-6 rounded-lg bg-gray-950/60 p-4 before:bg-gray-100/10',
					'md:col-span-1'
				)}
			>
				<div class="flex flex-row items-start justify-start gap-4">
					<div class="mt-2 text-3xl">
						<!-- <svelte:component this={icons[item.icon]} /> -->
					</div>
					<h3 class="text-2xl">
						<PrismicRichText field={item.titel} components={{ em: GoldText }} />
					</h3>
				</div>

				<PrismicRichText field={item.body} />
			</div>
		{/each}
	</div>
</Bounded>

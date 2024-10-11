<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicImage, PrismicLink, PrismicRichText, PrismicText } from '@prismicio/svelte';
	import clsx from 'clsx';

	import { Button } from '$lib/components/ui/button/index.js';

	import GoldText from './GoldText.svelte';

	import Heading2 from '$lib/components/Heading2.svelte';

	export let slice: Content.CaseStudiesSlice;

	/** @type {import("@prismicio/client").Content.CaseStudyDocument[]} */
	export let caseStudies = [];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.fromTo(
			'.casestudies__heading',
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
					trigger: '.casestudies__heading',
					start: 'top bottom-=40%',
					toggleActions: 'play pause resume reverse'
				}
			}
		);

		gsap.fromTo(
			'.casestudies__glow',
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
					trigger: '.casestudies__heading',
					start: 'top bottom-=40%',
					toggleActions: 'play pause resume reverse'
				}
			}
		);
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div
		class="casestudies__glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>
	<h2
		class="casestudies__heading max-w-2xl text-balance text-center text-5xl font-medium md:text-7xl"
	>
		<PrismicRichText
			field={slice.primary.heading}
			components={{ em: GoldText, heading2: Heading2 }}
		/>
	</h2>

	<div class="casestudies__heading mx-auto mt-6 text-balance text-center text-gray-300">
		<PrismicRichText field={slice.primary.body} />
	</div>

	{#if slice.primary.secondary_info}
		<div class="mt-16 flex flex-col gap-12 md:flex-row lg:flex-row">
			{#each slice.primary.secondary_info as item}
				<div
					class="glass-container max-w-md rounded-lg bg-gray-950/60 px-4 py-6 before:bg-gray-100/10"
				>
					<h3 class="mb-2 text-balance text-center text-2xl font-semibold">
						<PrismicRichText field={item.title} />
					</h3>

					<p class="text-balance text-center font-medium">
						<PrismicRichText field={item.description} />
					</p>
				</div>
			{/each}
		</div>
	{/if}

	<div class="mt-20 grid gap-16">
		{#each caseStudies as caseStudy, index}
			<div
				class="group relative grid gap-4 opacity-85 transition-opacity duration-300 hover:cursor-pointer hover:opacity-100 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
			>
				<div class="col-span-1 flex flex-col justify-center gap-4">
					<h3 class="text-4xl">
						<PrismicText field={caseStudy.data.heading} />
					</h3>

					<div class="max-w-md">
						<PrismicRichText field={caseStudy.data.description} />
					</div>

					<PrismicLink
						document={caseStudy}
						class="z-10 after:absolute after:inset-0 hover:underline"
					>
						<Button
							class={clsx(
								'relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
							)}
						>
							<span class="mr-1 text-xl">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									viewBox="0 0 256 256"
									{...$$props}
									><path
										fill="currentColor"
										d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12"
									/></svg
								>
							</span>
							<!-- <PrismicText field={caseStudy.data.heading} /> -->Find out more
						</Button>
					</PrismicLink>
				</div>
				<div class={clsx('relative lg:col-span-2', index % 2 && 'md:-order-1')}>
					<div class="image-glow -bottom-8 -left-4 bg-orange-500" />
					<div class="image-glow -right-4 -top-8 bg-violet-500" />
					<PrismicImage
						field={caseStudy.data.image}
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

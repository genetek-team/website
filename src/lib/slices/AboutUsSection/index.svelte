<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicImage, PrismicLink, PrismicRichText } from '@prismicio/svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import clsx from 'clsx';

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	export let slice: Content.AboutUsSectionSlice;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const isMobile = window.innerWidth < 300; // Adjust the breakpoint as needed
		const offset = isMobile ? 50 : 100; // Adjust this based on your mobile nav height

		gsap.fromTo(
			'.about__heading',
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
					trigger: '.about__heading',
					start: `top bottom+=${offset}%`, // Adjust based on nav height
					end: 'top top-=10%', // Optional: define end to keep the element visible until fully scrolled
					toggleActions: 'play pause resume reverse',
					markers: false // Optional: enable markers to visually debug trigger positions
				}
			}
		);

		gsap.fromTo(
			'.about__glow',
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
					trigger: '.about__heading',
					start: `top bottom+=${offset}%`, // Adjust based on nav height
					toggleActions: 'play pause resume reverse'
				}
			}
		);
	});
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="flex flex-col items-center justify-center gap-8"
>
	<div
		class="about_glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>

	<h2
		class=" about__heading mt-16 flex flex-row items-center justify-center self-center text-center text-5xl font-bold md:text-7xl lg:text-7xl"
	>
		<PrismicRichText field={slice.primary.title} />
	</h2>

	<!-- <h1 class=" mb-8 text-7xl font-bold">
		<PrismicRichText field={slice.primary.title} />
	</h1> -->

	<div class="flex flex-col items-center justify-center md:hidden lg:hidden">
		<PrismicImage
			field={slice.primary.image}
			class="max-h-screen rounded-lg object-cover md:w-1/2"
		/>

		<p class="my-12 text-balance text-center text-sm">
			<PrismicRichText field={slice.primary.description} />
		</p>

		<PrismicLink field={slice.primary.button_link}
			><Button
				class={clsx(
					'relative mb-8 inline-flex h-fit w-fit rounded-full border border-violet-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
				)}
			>
				<span class="mr-2 text-2xl">
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
				</span>
				{slice.primary.button_label}
			</Button></PrismicLink
		>
	</div>

	<div class="hidden min-h-screen flex-col p-4 md:flex lg:flex">
		<div
			class="mx-auto h-max max-w-[400px] px-6 md:max-w-[950px] md:px-12 lg:max-w-[1600px] xl:px-6"
		>
			<div class="md:w-2/3 lg:w-1/2">
				<!-- <svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="h-6 w-6 text-gray-100"
				>
					<path
						fill-rule="evenodd"
						d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
						clip-rule="evenodd"
					></path>
				</svg> -->

				<p class="w-full text-gray-300 md:hidden lg:hidden">
					<PrismicRichText field={slice.primary.description} />
				</p>
			</div>
			<div
				class="mt-16 grid divide-x divide-y divide-gray-700 overflow-hidden rounded-3xl border border-gray-700 text-gray-600 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4"
			>
				<div
					class="group relative transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10"
				>
					<div class="relative space-y-8 p-8 py-12">
						<svg
							stroke="currentColor"
							fill="none"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke-linecap="round"
							stroke-linejoin="round"
							color="white"
							style="color:white"
							height="50"
							width="50"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path
								d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"
							>
							</path>
							<path d="M10 10l2 -2v8"></path>
						</svg>
						<div class="space-y-2">
							<h5 class="text-xl font-semibold text-white transition">
								<PrismicRichText field={slice.primary.card_title_1} />
							</h5>
							<p class="text-gray-300">
								<PrismicRichText field={slice.primary.cart_description_1} />
							</p>
						</div>
					</div>
				</div>
				<div
					class="group relative transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10"
				>
					<div class="relative space-y-8 p-8 py-12">
						<svg
							stroke="currentColor"
							fill="none"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke-linecap="round"
							stroke-linejoin="round"
							color="white"
							style="color:white"
							height="50"
							width="50"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path
								d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"
							>
							</path>
							<path d="M10 8h3a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h3"
							></path>
						</svg>
						<div class="space-y-2">
							<h5 class="text-xl font-semibold text-white transition group-hover:text-secondary">
								<PrismicRichText field={slice.primary.cart_title_2} />
							</h5>
							<p class="text-gray-300">
								<PrismicRichText field={slice.primary.card_description_2} />
							</p>
						</div>
					</div>
				</div>
				<div
					class="group relative transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10"
				>
					<div class="relative space-y-8 p-8 py-12">
						<svg
							stroke="currentColor"
							fill="none"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke-linecap="round"
							stroke-linejoin="round"
							color="white"
							style="color:white"
							height="50"
							width="50"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path
								d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"
							>
							</path>
							<path
								d="M10 9a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1"
							>
							</path>
						</svg>
						<div class="space-y-2">
							<h5 class="text-xl font-semibold text-white transition group-hover:text-secondary">
								<PrismicRichText field={slice.primary.card_title_3} />
							</h5>
							<p class="text-gray-300">
								<PrismicRichText field={slice.primary.card_description_3} />
							</p>
						</div>
					</div>
				</div>
				<div
					class="group relative transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10"
				>
					<div class="relative space-y-8 p-8 py-12">
						<svg
							stroke="currentColor"
							fill="none"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke-linecap="round"
							stroke-linejoin="round"
							color="white"
							style="color:white"
							height="50"
							width="50"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path
								d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"
							>
							</path>
							<path d="M10 8v3a1 1 0 0 0 1 1h3"></path>
							<path d="M14 8v8"></path>
						</svg>
						<div class="space-y-2">
							<h5 class="text-xl font-semibold text-white transition group-hover:text-secondary">
								<PrismicRichText field={slice.primary.card_title_4} />
							</h5>
							<p class="text-gray-300">
								<PrismicRichText field={slice.primary.card_description_4} />
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8 mt-16 flex flex-row items-center justify-center">
			<PrismicLink field={slice.primary.button_link}
				><Button
					class={clsx(
						'relative inline-flex h-fit w-fit rounded-full border border-violet-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
					)}
				>
					<span class="mr-2 text-2xl">
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
					</span>
					{slice.primary.button_label}
				</Button></PrismicLink
			>
		</div>
	</div>

	<div
		class="absolute right-0 top-2/3 -z-10 h-2/3 w-2/3 bg-blue-700/25 mix-blend-screen blur-[120px] filter"
	/>

	<div
		class="absolute left-0 top-1/3 -z-10 h-2/3 w-2/3 bg-blue-700/25 mix-blend-screen blur-[120px] filter"
	/>
</section>

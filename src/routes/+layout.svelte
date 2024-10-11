<script lang="ts">
	import '../app.css';

	// Supports weights 100-900
	import '@fontsource-variable/dm-sans';

	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { Separator } from '$lib/components/ui/separator';

	import PhTrophy from '~icons/ph/trophy';
	import { productStore } from '$lib/stores/ProductsStore';
	import { onMount } from 'svelte';
	import { PrismicRichText } from '@prismicio/svelte';

	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	export const banner = [];

	onMount(async () => {
		gsap.fromTo(
			'.banner__heading',
			{
				x: -1000,
				opacity: 0.85
			},
			{
				x: 1000,
				opacity: 1,
				ease: 'none',
				duration: 15,
				repeat: -1,

				smoothOrigin: true
				// delay: 0.5,
			}
		);
	});

	// banner__heading
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	{#if $page.data.meta_description}
		<meta name="description" content={$page.data.meta_description} />
	{/if}
	{#if $page.data.meta_title}
		<meta name="og:title" content={$page.data.meta_title} />
	{/if}
	{#if $page.data.meta_image}
		<meta name="og:image" content={$page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<!-- Only show this on larger screens -->

<div class="container mx-auto max-w-[350px] px-4 md:max-w-[768px] lg:max-w-[1200px]">
	<!-- Your existing website content -->
	<div
		class="absolute left-0 top-0 z-10 flex h-6 w-full flex-row flex-nowrap justify-center gap-6 bg-opacity-10 bg-gradient-to-br from-slate-900 via-[#4765e9a9] to-slate-950 bg-[length:500%_500%]"
	>
		{#each $page.data.banner.data.announcements as item}
			<div class="banner__heading flex flex-row gap-4 font-semibold text-white">
				<div
					class=" flex flex-row items-center justify-center gap-2 text-nowrap text-sm md:ml-0 md:text-base lg:ml-0 lg:text-base"
				>
					<!-- Set default smaller text size -->
					<span class="">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 256 256"
							{...$$props}
						>
							<path
								fill="currentColor"
								d="M232 64h-24V48a8 8 0 0 0-8-8H56a8 8 0 0 0-8 8v16H24A16 16 0 0 0 8 80v16a40 40 0 0 0 40 40h3.65A80.13 80.13 0 0 0 120 191.61V216H96a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16h-24v-24.42c31.94-3.23 58.44-25.64 68.08-55.58H208a40 40 0 0 0 40-40V80a16 16 0 0 0-16-16M48 120a24 24 0 0 1-24-24V80h24v32q0 4 .39 8Zm184-24a24 24 0 0 1-24 24h-.5a82 82 0 0 0 .5-8.9V80h24Z"
							/>
						</svg>
					</span>
					<p class=""><PrismicRichText field={item.info} /></p>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-8">
		<Header navigation={$page.data.navigation} cart={$page.data.cart} />
	</div>

	<main>
		<slot />
	</main>

	<Footer navigation={$page.data.navigation} />
</div>

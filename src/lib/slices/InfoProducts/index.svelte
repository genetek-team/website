<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicImage, PrismicLink, PrismicRichText, PrismicText } from '@prismicio/svelte';
	import clsx from 'clsx';

	import GoldText from './GoldText.svelte';

	import Heading2 from '$lib/components/Heading2.svelte';

	import { cartStore } from '$lib/stores/CartStore';

	import { Button } from '$lib/components/ui/button/index.js';

	import SuccessAlert from '$lib/components/Alerts/SuccessAlert.svelte';
	import ErrorAlert from '$lib/components/Alerts/ErrorAlert.svelte';

	export let slice: Content.InfoProductsSlice;
	export let info_products = [];

	// $: console.log(info_products, 'slice.primary.info_product_card');

	let showSuccess = false;
	let successMessage = '';

	let showError = false;
	let errorMessage = '';

	$: if (showSuccess && successMessage !== '') {
		setTimeout(() => {
			showSuccess = false;
			successMessage = '';
		}, 3000);
	}

	$: if (showError && errorMessage !== '') {
		setTimeout(() => {
			showError = false;
			errorMessage = '';
		}, 3000);
	}

	const addToCart = (item: any) => {
		const price = item.price; // Ensure this points to the correct property
		const title = item.title[0].text; // Adjust if title structure is different
		const body = item.body ? item.body : null; // Adjust if body structure is different

		const numericPrice = parseFloat(price);
		if (isNaN(numericPrice)) {
			console.error('Invalid price value:', price);
			return;
		}

		const product = {
			id: Date.now(), // Generate a unique ID for each product
			title: title,
			body: body,
			price: numericPrice,
			quantity: 1
		};

		cartStore.addProductToArr(product);
		console.log(product, 'product added');

		showSuccess = true;
		successMessage = 'Product added to cart 🎉';
	};

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Handle mobile responsiveness
		const isMobile = window.innerWidth < 300; // Adjust the breakpoint as needed
		const offset = isMobile ? 50 : 100; // Adjust based on mobile nav height or design

		// Animation for the Info Products heading
		gsap.fromTo(
			'.infoproducts__heading',
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
					trigger: '.infoproducts__heading',
					start: `top bottom+=${offset}%`, // Adjust based on offset
					end: 'top top-=10%', // Optional: define the end to keep it visible during scroll
					toggleActions: 'play pause resume reverse',
					markers: false // Enable markers for debugging
				}
			}
		);

		// Animation for the Info Products glow effect
		gsap.fromTo(
			'.infoproducts__glow',
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
					trigger: '.infoproducts__heading',
					start: `top bottom+=${offset}%`, // Adjust based on offset
					toggleActions: 'play pause resume reverse'
				}
			}
		);
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<SuccessAlert bind:showSuccess bind:successMessage />
	<ErrorAlert bind:showError bind:errorMessage />

	<div
		class="infoproducts__glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>

	<h2 class="infoproducts__heading">
		<PrismicRichText
			field={slice.primary.title}
			components={{ em: GoldText, heading2: Heading2 }}
		/>
	</h2>

	<div class="infoproducts__heading mx-auto mt-6 max-w-md text-balance text-center text-gray-300">
		<PrismicRichText field={slice.primary.description} />
	</div>

	<div class="mt-20 grid max-w-4xl grid-rows-[auto_auto_auto] gap-16 md:grid-cols-3 md:gap-12">
		{#each info_products as infoProduct, index}
			<div
				class={clsx(
					'glass-container row-span-5 grid grid-rows-subgrid gap-4 rounded-lg bg-gray-950/60 p-4 before:bg-gray-100/10',
					'md:col-span-1'
				)}
			>
				<!-- Card Image -->
				<PrismicImage
					field={infoProduct.data.image}
					sizes="(max-width: 768px) 100vw, 50vw"
					class="z-10 after:absolute after:inset-0 hover:underline"
				/>

				<!-- Card Title -->
				<PrismicLink document={infoProduct} class="group">
					<h3 class="text-xl font-semibold transition duration-200 group-hover:underline">
						<PrismicText field={infoProduct.data.heading} />
					</h3>
				</PrismicLink>

				<!-- Card Description -->
				{#if infoProduct.data.description}
					<p>
						<PrismicRichText field={infoProduct.data.description} />
					</p>
				{/if}

				<!-- Card Price -->
				<p class="transition duration-200 group-hover:underline">
					<span class="font-semibold">Price: $</span><PrismicText field={infoProduct.data.price} />
				</p>

				<!-- Add to Cart Button -->
				<div class="">
					<Button
						on:click={() => addToCart(infoProduct)}
						class={clsx(
							'relative mb-2 inline-flex h-fit w-fit rounded-full border border-violet-100/20 bg-violet-200/10 px-4 py-2 text-blue-200'
						)}
					>
						Add to cart
					</Button>

					<PrismicLink field={infoProduct.link}>
						<Button
							class="inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200"
						>
							Find out more
						</Button>
					</PrismicLink>
				</div>

				<!-- Glow Effect -->
			</div>
		{/each}
	</div>
</Bounded>

<style>
	.image-glow {
		@apply absolute h-1/2 w-1/2 rounded-full opacity-0 mix-blend-screen blur-3xl transition-opacity duration-500 group-hover:opacity-30;
	}
</style>

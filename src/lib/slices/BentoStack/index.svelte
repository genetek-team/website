<script lang="ts">
	import { asText, type Content } from '@prismicio/client';

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import Bounded from '$lib/components/Bounded.svelte';

	import { PrismicImage, PrismicLink, PrismicRichText, PrismicText } from '@prismicio/svelte';

	import clsx from 'clsx';

	import IconCart from '~icons/ph/basket';

	import GoldText from './GoldText.svelte';

	import Heading2 from '$lib/components/Heading2.svelte';

	import { Button } from '$lib/components/ui/button/index.js';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { cartStore } from '$lib/stores/CartStore';
	import SuccessAlert from '$lib/components/Alerts/SuccessAlert.svelte';
	import ErrorAlert from '$lib/components/Alerts/ErrorAlert.svelte';

	export let slice: Content.BentoStackSlice;

	const icons = {
		cart: IconCart
	};

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
		console.log(item, 'product info');
		const price = item.price;
		const title = item.title[0].text;
		const body = item.body ? item.body : null;
		const numericPrice = parseFloat(price); // Ensure price is converted to a number
		if (isNaN(numericPrice)) {
			console.error('Invalid price value:', price);
			return; // Exit the function if the price is invalid
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

		// Animation for the Bento Stack heading
		gsap.fromTo(
			'.bentoStack__heading',
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
					trigger: '.bentoStack__heading',
					start: `top bottom+=${offset}%`, // Adjust based on offset
					end: 'top top-=10%', // Optional: define the end to keep it visible during scroll
					toggleActions: 'play pause resume reverse',
					markers: false // Enable markers for debugging
				}
			}
		);

		// Animation for the Bento Stack glow effect
		gsap.fromTo(
			'.bentoStack__glow',
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
					trigger: '.bentoStack__heading',
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
		class="bentoStack__glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>

	<h2 class="bentoStack__heading">
		<PrismicRichText
			field={slice.primary.heading}
			components={{ em: GoldText, heading2: Heading2 }}
		/>
	</h2>

	<div class="mt-16 grid max-w-4xl grid-rows-[auto_auto_auto] gap-8 md:grid-cols-3 md:gap-12">
		{#each slice.primary.card as item}
			<div
				class={clsx(
					'glass-container row-span-6 grid grid-rows-subgrid gap-2 rounded-lg bg-gray-950/60 p-4 before:bg-gray-100/10',
					'md:col-span-1'
				)}
			>
				<!-- <div class="max-w-md text-balance text-gray-300">
				<PrismicRichText field={item.body} />
				</div> -->
				<PrismicImage class="max-h-50 w-full" field={item.image} />

				<PrismicLink field={item.link} class="group">
					<h3 class="mt-6 text-center text-xl transition duration-200 group-hover:underline">
						<PrismicText field={item.title} />
					</h3>
				</PrismicLink>
				{#if item.description}
					<p class="text-balance text-center">
						<PrismicText field={item.description} />
					</p>
				{/if}

				{#if item.short_description_1 && item.short_description_2 && item.short_description_3}
					<div class="mb-4 flex flex-col justify-start gap-2 text-start">
						{#if item.short_description_1}
							<p>
								<PrismicRichText field={item.short_description_1} />
							</p>
						{/if}

						{#if item.short_description_2}
							<p>
								<PrismicRichText field={item.short_description_2} />
							</p>
						{/if}

						{#if item.short_description_3}
							<p>
								<PrismicRichText field={item.short_description_3} />
							</p>
						{/if}
					</div>
				{/if}

				<p class="transition duration-200 group-hover:underline">
					<span class="font-semibold">Price: </span>${item.price}
				</p>

				<div class="">
					{#if item.title && item.description && item.price}
						<Button
							on:click={(() => console.log(item),
							addToCart(
								item // Convert price to string and handle asText
							))}
							class={clsx(
								'relative mb-2 inline-flex h-fit w-fit rounded-full border border-violet-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
							)}
							><span class="mr-2 text-xl"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									viewBox="0 0 256 256"
									{...$$props}
									><path
										fill="currentColor"
										d="M136 120v56a8 8 0 0 1-16 0v-56a8 8 0 0 1 16 0m36.84-.8l-5.6 56a8 8 0 0 0 7.16 8.8a7 7 0 0 0 .81 0a8 8 0 0 0 7.95-7.2l5.6-56a8 8 0 0 0-15.92-1.6m-89.68 0a8 8 0 0 0-15.92 1.6l5.6 56a8 8 0 0 0 8 7.2a7 7 0 0 0 .81 0a8 8 0 0 0 7.16-8.76Zm156.77-30.14l-15.07 113.06A16.06 16.06 0 0 1 209 216H47a16.06 16.06 0 0 1-15.86-13.88L16.07 89.06A8 8 0 0 1 24 80h44.37L122 18.73a8 8 0 0 1 12 0L187.63 80H232a8 8 0 0 1 7.93 9.06M89.63 80h76.74L128 36.15Zm133.23 16H33.14L47 200h162Z"
									/></svg
								></span
							> Add to cart</Button
						>
					{/if}
					<PrismicLink field={item.link}>
						<Button
							class={clsx(
								'relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
							)}
						>
							<span class="mr-1 text-2xl">
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
							</span> Find out more
						</Button></PrismicLink
					>
				</div>

				<div
					class="absolute left-1/3 top-0 -z-10 h-2/3 w-2/3 bg-blue-700/50 mix-blend-screen blur-[120px] filter"
				/>
			</div>
		{/each}
	</div>
</Bounded>

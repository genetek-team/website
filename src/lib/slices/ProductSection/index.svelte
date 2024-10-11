<script lang="ts">
	import { PrismicEmbed, PrismicImage, PrismicRichText, PrismicText } from '@prismicio/svelte';
	import Bounded from './../../components/Bounded.svelte';
	import { asText, type Content } from '@prismicio/client';

	import { cartStore } from '$lib/stores/CartStore';

	import { Button } from '$lib/components/ui/button/index.js';

	import clsx from 'clsx';
	import SuccessAlert from '$lib/components/Alerts/SuccessAlert.svelte';
	import ErrorAlert from '$lib/components/Alerts/ErrorAlert.svelte';

	export let slice: Content.ProductSectionSlice;

	type Product = {
		title: string;
		body: string;
		price: string;
	};

	// Function to add a product to the cart with dynamic details
	const addToCart = (title: string, body: string, price: string) => {
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
</script>

<Bounded
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="flex flex-col items-start gap-8 md:flex-row"
>
	<SuccessAlert bind:showSuccess bind:successMessage />
	<ErrorAlert bind:showError bind:errorMessage />

	<div class="flex flex-col gap-6 md:flex-row lg:flex-row">
		<PrismicImage
			field={slice.primary.image}
			class="max-h-screen rounded-lg object-cover md:w-1/2"
		/>

		<div class="flex w-full flex-col items-start justify-start gap-4 md:w-1/2">
			<h1 class="text-4xl font-bold">
				<PrismicRichText field={slice.primary.title} />
			</h1>
			<PrismicRichText field={slice.primary.body} />
			<p class="mt-8 text-xl font-semibold">
				Price: <span class="text-gray-400">
					$<PrismicText field={slice.primary.price} />
				</span>
			</p>

			<!-- Button to add the product to the cart -->
			<Button
				class={clsx(
					'relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
				)}
				on:click={() =>
					addToCart(
						asText(slice.primary.title), // Extract plain text from RichTextField
						asText(slice.primary.body), // Extract plain text from RichTextField
						asText(slice.primary.price) // Convert price to string and handle asText
					)}
				><span class="mr-2 text-xl">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 256 256"
						{...$$props}
						><path
							fill="currentColor"
							d="M136 120v56a8 8 0 0 1-16 0v-56a8 8 0 0 1 16 0m36.84-.8l-5.6 56a8 8 0 0 0 7.16 8.8a7 7 0 0 0 .81 0a8 8 0 0 0 7.95-7.2l5.6-56a8 8 0 0 0-15.92-1.6m-89.68 0a8 8 0 0 0-15.92 1.6l5.6 56a8 8 0 0 0 8 7.2a7 7 0 0 0 .81 0a8 8 0 0 0 7.16-8.76Zm156.77-30.14l-15.07 113.06A16.06 16.06 0 0 1 209 216H47a16.06 16.06 0 0 1-15.86-13.88L16.07 89.06A8 8 0 0 1 24 80h44.37L122 18.73a8 8 0 0 1 12 0L187.63 80H232a8 8 0 0 1 7.93 9.06M89.63 80h76.74L128 36.15Zm133.23 16H33.14L47 200h162Z"
						/></svg
					>
				</span> Add to cart</Button
			>
		</div>
	</div>
</Bounded>

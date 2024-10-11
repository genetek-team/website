<script lang="ts">
	import { PrismicLink, PrismicRichText, PrismicImage } from '@prismicio/svelte';
	import ButtonLink from './ButtonLink.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cartStore } from '$lib/stores/CartStore';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Sheet from '$lib/components/ui/sheet';
	import PhShoppingCartThin from '~icons/ph/shopping-cart-thin';
	import { page } from '$app/stores';
	import { asLink } from '@prismicio/client';
	import clsx from 'clsx';
	import { onDestroy, onMount } from 'svelte';
	import * as prismic from '@prismicio/client';

	/** @type {import("@prismicio/client").Content.NavigationDocument} */
	export let navigation;

	/** @type {import("@prismicio/client").Content.CartDocument} */
	export let cart;

	/** @param {import('@prismicio/client').LinkField} link*/
	const isActive = (link: any) => {
		const path = asLink(link);

		return path && $page.url.pathname.includes(path);
	};

	let isOpen = false;
	const toggleOpen = () => (isOpen = !isOpen);
	const close = () => (isOpen = false);

	const icons = {
		cart: PhShoppingCartThin
	};

	// MOBILE NAV
	let isMobileNavOpen = false;

	const toggleMobileMenu = () => {
		isMobileNavOpen = !isMobileNavOpen;
	};

	let allProductsArr: any = [];

	let searchTerm = '';
	let filteredResults: any = [];

	// $: if (filteredResults) console.log(filteredResults, 'filtered results');

	function debounce(func, delay) {
		let timeoutId;
		return function (...args) {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				func.apply(null, args);
			}, delay);
		};
	}

	function normalizeString(str: string) {
		return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
	}

	function searchProducts() {
		if (searchTerm && searchTerm !== '' && allProductsArr.length > 0) {
			// console.log(searchTerm, 'search term inside function');

			filteredResults = allProductsArr.filter((product: any) => {
				const { uid, url, data, href } = product;

				// console.log(product);

				const heading = data?.heading[0].text || [];
				const meta_title = data?.meta_title || '';

				// Normalize search term and product fields
				const normalizedSearchTerm = normalizeString(searchTerm);
				const normalizedUid = normalizeString(uid || '');
				const normalizedHeading = normalizeString(heading);
				const normalizedMetaTitle = normalizeString(meta_title);

				return (
					normalizedUid.includes(normalizedSearchTerm) ||
					(url && url.toLowerCase().includes(normalizedSearchTerm)) ||
					(href && href.toLowerCase().includes(normalizedSearchTerm)) ||
					normalizedHeading.includes(normalizedSearchTerm) ||
					normalizedMetaTitle.includes(normalizedSearchTerm)
				);
			});

			// console.log(filteredResults, 'filtered results');
		} else {
			// If the search term is empty, show all products
			filteredResults = allProductsArr;

			// console.log(filteredResults, 'filtered results');
		}
	}

	// Debounced search function to limit the number of calls to searchProducts
	const debouncedSearch = debounce(searchProducts, 300);

	$: if (searchTerm && searchTerm !== '') {
		// console.log('before debounce');
		debouncedSearch();
	}

	// END SEARCH SCRIPT

	// State to track which dropdown is active
	let activeDropdowns: any = {};

	let cartItems: any = [];

	let closedSearch = false;

	const handleClose = () => {
		closedSearch = !closedSearch;
	};

	$: if (closedSearch) console.log(closedSearch, 'closedSearch');
	onMount(async () => {
		const client = prismic.createClient('https://genetek-website.cdn.prismic.io/api/v2');

		const products = await client.getAllByType('info_product');

		if (products) {
			allProductsArr = products;
			// console.log(allProductsArr, 'allProductsArr');
		}
	});

	const unsubscribe = cartStore.subscribe((items) => {
		cartItems = items;
	});

	// Cleanup when component is destroyed
	onDestroy(() => unsubscribe());
</script>

<header class="p-4 md:p-6">
	<!-- navbar goes here -->
	<nav class="">
		<div class="mx-auto max-w-6xl px-4">
			<div class="flex justify-between">
				<div class="flex flex-row items-center justify-center">
					<a href="/" on:click={close} class="z-50">
						<div class=" h-[25px] w-[105px] md:h-[45px] md:w-[135px]">
							<PrismicImage field={navigation.data.og_image} />
						</div>
						<span class="sr-only">{navigation.data.site_title} home page</span>
					</a>
				</div>
				<div class="flex space-x-4">
					<!-- logo -->

					<!-- primary nav -->
					<div class="hidden items-center space-x-1 md:flex">
						<ul class="flex gap-4">
							{#each navigation.data.nav as item (item.label)}
								<li class="text-sm md:text-base lg:text-base">
									<PrismicLink
										field={item.link}
										aria-current={isActive(item.link) ? 'page' : undefined}
										class="inline-flex min-h-11 items-center"
									>
										{item.label}
									</PrismicLink>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- secondary nav -->
				<div class="hidden items-center space-x-4 md:flex">
					<AlertDialog.Root
						closeOnEscape
						closeOnOutsideClick
						onOpenChange={handleClose}
						open={closedSearch}
					>
						<AlertDialog.Trigger class="">
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.4em"
									height="1.4em"
									viewBox="0 0 256 256"
									{...$$props}
									><path
										fill="currentColor"
										d="m229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72"
									/></svg
								>
							</span></AlertDialog.Trigger
						>
						<AlertDialog.Content
							class="h-full  min-w-full bg-opacity-10 bg-gradient-to-br from-slate-900/20 via-[#4765e9] to-slate-900/20 bg-[length:500%_500%]  p-16"
						>
							<AlertDialog.Header>
								<!-- <AlertDialog.Title class="text-slate-800">Search here for a product</AlertDialog.Title
								> -->
								<div class="flex flex-row items-end justify-end">
									<div>
										<AlertDialog.Cancel class="text-slate-800 ">X</AlertDialog.Cancel>
									</div>
								</div>
								<AlertDialog.Description>
									<div class="my-12 flex flex-col items-center justify-center p-12">
										<div class="m-h-screen flex min-w-[800px] flex-col p-2 py-6">
											<div
												class="sticky mb-5 flex w-full items-center justify-between rounded-full bg-white p-2 shadow-lg"
												style="top: 5px"
											>
												<input
													class="focus:shadow-outline w-full rounded-full bg-gray-100 py-4 pl-4 text-xs font-bold uppercase leading-tight text-gray-700 focus:outline-none lg:text-sm"
													type="text"
													placeholder="Search"
													bind:value={searchTerm}
												/>
											</div>
										</div>

										{#if filteredResults && filteredResults.length > 0}
											<ul class=" pl-5">
												{#each filteredResults as product}
													<li class="my-2">
														<a
															on:click={() => (closedSearch = false)}
															href={`/info_product/${product.uid}`}
														>
															<!-- {product.data.heading[0].text || 'Unnamed Product'} -->

															<div
																class="max-w-sm overflow-hidden rounded bg-white shadow-lg transition-all hover:bg-slate-200"
															>
																<div class="px-6 py-4">
																	<div class="mb-2 text-xl font-bold text-black">
																		{product.data.heading[0].text || 'Unnamed Product'}
																	</div>
																	<!-- <p class="text-base text-gray-700">Navigate to product -></p> -->
																</div>
															</div>
														</a>
													</li>
												{/each}
											</ul>
										{:else}
											<p>No results found.</p>
										{/if}
									</div>
								</AlertDialog.Description>
							</AlertDialog.Header>
						</AlertDialog.Content>
					</AlertDialog.Root>
					<div>
						<span class="text-sm md:text-base lg:text-base">
							${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}.00
						</span>
					</div>
					<div>
						<Sheet.Root closeOnEscape closeOnOutsideClick>
							<Sheet.Trigger
								><span class="">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.4em"
										height="1.4em"
										viewBox="0 0 256 256"
										class="mt-2"
										{...$$props}
										><path
											fill="currentColor"
											d="M230.14 58.87A8 8 0 0 0 224 56H62.68L56.6 22.57A8 8 0 0 0 48.73 16H24a8 8 0 0 0 0 16h18l25.56 140.29a24 24 0 0 0 5.33 11.27a28 28 0 1 0 44.4 8.44h45.42a27.75 27.75 0 0 0-2.71 12a28 28 0 1 0 28-28H91.17a8 8 0 0 1-7.87-6.57L80.13 152h116a24 24 0 0 0 23.61-19.71l12.16-66.86a8 8 0 0 0-1.76-6.56M104 204a12 12 0 1 1-12-12a12 12 0 0 1 12 12m96 0a12 12 0 1 1-12-12a12 12 0 0 1 12 12m4-74.57a8 8 0 0 1-7.9 6.57H77.22L65.59 72h148.82Z"
										/></svg
									></span
								></Sheet.Trigger
							>
							<Sheet.Content
								class="bg-opacity-10 bg-gradient-to-br from-slate-900/20 via-[#4765e9] to-slate-900/20 bg-[length:500%_500%] shadow-sm"
							>
								<Sheet.Header>
									<Sheet.Title class="text-center text-3xl font-semibold text-black">
										<PrismicRichText field={cart.data.cart_title} />
									</Sheet.Title>
									<Sheet.Description>
										<div class="flex h-full flex-col">
											<div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
												<!-- Cart Items -->
												<div class="mt-8 flow-root">
													<ul role="list" class="-my-6 divide-y divide-gray-200">
														{#if cartItems.length > 0}
															{#each cartItems as item}
																<li class="flex py-6">
																	<div class="ml-4 flex flex-1 flex-col">
																		<div
																			class="flex flex-col justify-between text-start text-base font-medium text-gray-900"
																		>
																			<h3 class="truncate text-sm font-bold">{item.title}</h3>
																		</div>
																		<div class="flex items-center justify-between text-sm">
																			<div class="flex flex-row gap-2">
																				<p class="text-gray-500">
																					Quantity: <span class="text-black">{item.quantity}</span>
																				</p>
																				<p>${item.price}</p>
																			</div>
																			<div class="">
																				<Button
																					variant="ghost"
																					on:click={() => cartStore.removeProductById(item.id)}
																					class="text-lg hover:bg-inherit hover:text-red-600"
																				>
																					<svg
																						xmlns="http://www.w3.org/2000/svg"
																						width="1em"
																						height="1em"
																						viewBox="0 0 256 256"
																					>
																						<path
																							fill="currentColor"
																							d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"
																						/>
																					</svg>
																				</Button>
																			</div>
																		</div>
																	</div>
																</li>
															{/each}
														{:else}
															<p>Your cart is empty...</p>
														{/if}
													</ul>
												</div>

												<!-- Cart Footer -->
												<div class="mt-6 border-t border-gray-200 pt-6">
													<p class="mb-4 text-xl font-semibold text-black">
														Total: ${cartItems.reduce(
															(total, item) => total + item.price * item.quantity,
															0
														)}
													</p>
													<PrismicLink field={cart.data.button_link}>
														<Button
															class="w-full  bg-opacity-10 bg-gradient-to-br from-slate-900 via-[#4765e9] to-slate-900 bg-[length:500%_500%] text-white"
														>
															{cart.data.button_text}
														</Button>
													</PrismicLink>
												</div>
											</div>
										</div>
									</Sheet.Description>
								</Sheet.Header>
							</Sheet.Content>
						</Sheet.Root>
					</div>
				</div>

				<!-- mobile button goes here -->
				<div class="flex items-center md:hidden lg:hidden">
					<button class="mobile-menu-button" on:click={toggleMobileMenu}>
						<svg
							class="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- mobile menu -->
		<div class={`mobile-menu ${isMobileNavOpen ? 'block' : 'hidden'} md:hidden`}>
			<div class="flex space-x-2">
				<!-- logo -->
				<ul class="mb-2 ml-3 mt-4 flex flex-col gap-1">
					{#each navigation.data.nav as item (item.label)}
						<li class="text-sm">
							<PrismicLink
								field={item.link}
								aria-current={isActive(item.link) ? 'page' : undefined}
								class="inline-flex min-h-7 items-center rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
							>
								{item.label}
							</PrismicLink>
						</li>
					{/each}
				</ul>
			</div>

			<div class="ml-6 mt-1">
				<Sheet.Root>
					<Sheet.Trigger
						><span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.6em"
								height="1.6em"
								viewBox="0 0 256 256"
								{...$$props}
								><path
									fill="currentColor"
									d="M230.14 58.87A8 8 0 0 0 224 56H62.68L56.6 22.57A8 8 0 0 0 48.73 16H24a8 8 0 0 0 0 16h18l25.56 140.29a24 24 0 0 0 5.33 11.27a28 28 0 1 0 44.4 8.44h45.42a27.75 27.75 0 0 0-2.71 12a28 28 0 1 0 28-28H91.17a8 8 0 0 1-7.87-6.57L80.13 152h116a24 24 0 0 0 23.61-19.71l12.16-66.86a8 8 0 0 0-1.76-6.56M104 204a12 12 0 1 1-12-12a12 12 0 0 1 12 12m96 0a12 12 0 1 1-12-12a12 12 0 0 1 12 12m4-74.57a8 8 0 0 1-7.9 6.57H77.22L65.59 72h148.82Z"
								/></svg
							></span
						></Sheet.Trigger
					>
					<Sheet.Content
						class="bg-opacity-10 bg-gradient-to-br from-slate-900/20 via-[#4765e9] to-slate-900/20 bg-[length:500%_500%] shadow-sm"
					>
						<Sheet.Header>
							<Sheet.Title class="text-center text-3xl font-semibold text-black">
								<PrismicRichText field={cart.data.cart_title} />
							</Sheet.Title>
							<Sheet.Description>
								<div class="flex h-full w-full flex-col items-center justify-center">
									<div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
										<!-- Cart Items -->

										<div class="mt-8 flow-root">
											<ul role="list" class="-my-6 divide-y divide-gray-200">
												{#if cartItems.length > 0}
													{#each cartItems as item}
														<li class="flex py-6">
															<div class="ml-4 flex flex-1 flex-col">
																<div
																	class="flex flex-col justify-between text-base font-medium text-gray-900"
																>
																	<h3 class="truncate text-sm font-bold">{item.title}</h3>
																	<p>${item.price}</p>
																</div>
																<div class="flex justify-between text-sm">
																	<p class="text-gray-700">
																		Quantity: <span class="text-black">{item.quantity}</span>
																	</p>
																	<Button
																		variant="ghost"
																		on:click={() => cartStore.removeProductById(item.id)}
																		class="text-lg hover:bg-inherit hover:text-red-600"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			width="1em"
																			height="1em"
																			viewBox="0 0 256 256"
																		>
																			<path
																				fill="currentColor"
																				d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"
																			/>
																		</svg>
																	</Button>
																</div>
															</div>
														</li>
													{/each}
												{:else}
													<p>Your cart is empty...</p>
												{/if}
											</ul>
										</div>

										<!-- Cart Footer -->
										<div class="mt-6 border-t border-gray-200 pt-6">
											<p class="mb-4 text-xl font-semibold text-black">
												Total: ${cartItems.reduce(
													(total, item) => total + item.price * item.quantity,
													0
												)}
											</p>
											<PrismicLink field={cart.data.button_link}>
												<Button
													class="w-full  bg-opacity-10 bg-gradient-to-br from-slate-900 via-[#4765e9] to-slate-900 bg-[length:500%_500%] text-white"
												>
													{cart.data.button_text}
												</Button>
											</PrismicLink>
										</div>
									</div>
								</div>
							</Sheet.Description>
						</Sheet.Header>
					</Sheet.Content>
				</Sheet.Root>
			</div>
		</div>
	</nav>
</header>

<style>
	.spceial-hover {
		transition: opacity 1s ease-in-out;
	}
</style>

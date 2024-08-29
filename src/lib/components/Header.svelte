<script>
	import { PrismicLink } from '@prismicio/svelte';
	import WordMark from './WordMark.svelte';
	import ButtonLink from './ButtonLink.svelte';

	// import { Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';

	import PhShoppingCartThin from '~icons/ph/shopping-cart-thin';

	// import IconClose from '~icons/ph/x-bold';
	// import IconMenu from '~icons/ph/list-bold';

	import { page } from '$app/stores';

	import { asLink } from '@prismicio/client';

	import clsx from 'clsx';

	/** @type {import("@prismicio/client").Content.NavigationDocument} */
	export let navigation;

	let isOpen = false;
	const toggleOpen = () => (isOpen = !isOpen);
	const close = () => (isOpen = false);

	/** @param {import('@prismicio/client').LinkField} link*/
	const isActive = (link) => {
		const path = asLink(link);

		return path && $page.url.pathname.includes(path);
	};

	const icons = {
		cart: PhShoppingCartThin
	};
</script>

<header class="p-4 md:p-6">
	<nav
		class="mx-auto flex max-w-6xl flex-col justify-between py-2 font-medium text-white md:flex-row md:items-center"
		aria-label="Main"
	>
		<div class="flex items-center justify-between">
			<a href="/" on:click={close} class="z-50">
				<WordMark />
				<span class="sr-only">{navigation.data.site_title} home page</span>
			</a>

			<button
				type="button"
				class="block p-2 text-3xl text-white md:hidden"
				aria-expanded={isOpen}
				on:click={toggleOpen}
			>
				<!-- <IconMenu /> -->
			</button>
		</div>

		<!-- Mobile Nav -->
		<div
			class={clsx(
				'fixed inset-0 z-40 flex flex-col items-end bg-gray-950 pr-4 pt-6 transition-transform duration-300 ease-in-out md:hidden',
				isOpen ? 'translate-x-0' : 'translate-x-[100%]'
			)}
		>
			<button
				aria-expanded={isOpen}
				type="button"
				class="block p-2 text-3xl text-white md:hidden"
				on:click={toggleOpen}
			>
				<!-- <IconClose /> -->
			</button>
			<ul class="grid justify-items-end gap-8">
				{#each navigation.data.nav as item (item.label)}
					<li>
						{#if item.cart_button}
							<ButtonLink
								field={item.link}
								on:click={close}
								aria-current={isActive(item.link) ? 'page' : undefined}
							>
								{item.label}
							</ButtonLink>
						{:else}
							<PrismicLink
								on:click={close}
								field={item.link}
								class=" block min-h-11 px-3 text-3xl first:mt-8"
								aria-current={isActive(item.link) ? 'page' : undefined}
							>
								{item.label}
							</PrismicLink>
						{/if}
					</li>
				{/each}
			</ul>
		</div>

		<!-- Desktop Nav -->
		<ul class="hidden gap-6 md:flex">
			{#each navigation.data.nav as item (item.label)}
				<li>
					{#if item.cart_button}
						<ButtonLink
							field={item.link}
							on:click={close}
							aria-current={isActive(item.link) ? 'page' : undefined}
						>
							{item.label}
						</ButtonLink>
					{:else}
						<PrismicLink
							on:click={close}
							field={item.link}
							class="inline-flex min-h-11 items-center"
							aria-current={isActive(item.link) ? 'page' : undefined}
						>
							{item.label}
						</PrismicLink>
					{/if}
					<div class="flex flex-col">
						{#if item.sub_link_1 && item.sub_field_label_1}
							<div>
								<span class="h-24 w-full bg-red-600">{item.sub_field_label_1}</span>
							</div>
						{/if}
						{#if item.sub_link_2 && item.sub_field_label_2}
							<div>
								<span class="h-24 w-full bg-red-600">{item.sub_field_label_2}</span>
							</div>
						{/if}
						{#if item.sub_link_3 && item.sub_field_label_3}
							<div>
								<span class="h-24 w-full bg-red-600">{item.sub_field_label_3}</span>
							</div>
						{/if}
						{#if item.sub_link_4 && item.sub_field_label_4}
							<div>
								<span class="h-24 w-full bg-red-600">{item.sub_field_label_1}</span>
							</div>
						{/if}
						{#if item.sub_link_5 && item.sub_field_label_5}
							<div>
								<span class="h-24 w-full bg-red-600">{item.sub_field_label_1}</span>
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>

		<div class="hidden gap-6 md:flex">
			<div>
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.6em"
						height="1.6em"
						viewBox="0 0 256 256"
						{...$$props}
						><path
							fill="currentColor"
							d="m229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72"
						/></svg
					>
				</span>
			</div>
			<div><span>$0.00</span></div>
			<div>
				<span>
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
				>
			</div>
			<!-- <ul class="hidden gap-6 md:flex">
				{#each navigation.data.nav as item (item.label)}
					<li>
						{#if item.cart_button}
							<ButtonLink
								field={item.link}
								on:click={close}
								aria-current={isActive(item.link) ? 'page' : undefined}
							>
								{item.label}
							</ButtonLink>
						{:else}
							<PrismicLink
								on:click={close}
								field={item.link}
								class="inline-flex min-h-11 items-center"
								aria-current={isActive(item.link) ? 'page' : undefined}
							>
								{item.label}
							</PrismicLink>
						{/if}
					</li>
				{/each}
			</ul> -->
		</div>
	</nav>
</header>

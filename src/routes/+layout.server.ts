import { createClient } from '$lib/prismicio';

import * as prismic from '@prismicio/client';

// import { mappers } from '$lib/slices/mappers';
// import { productStore } from '../../src/stores/ProductsStore';

export const prerender = 'auto';

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const navigation = await client.getSingle('navigation');

	const cart = await client.getSingle('cart');

	// const testProducts = await client.getAllByType('info_product');

	const banner = await client.getSingle('banner');


	return {
		navigation,
		cart,
		banner
	};
}

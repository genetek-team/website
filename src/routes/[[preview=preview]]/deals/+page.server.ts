import { createClient } from '$lib/prismicio';

export async function load({ params, fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const page = await client.getSingle('deals');

	return {
		page
	};
}

export async function entries() {
	return [{}];
}

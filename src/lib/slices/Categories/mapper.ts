import * as prismic from '@prismicio/client';

export default async function mapper({ slice, context }) {
	const categories = (
		await Promise.all(
			slice.primary.categories_card.map(async (item) => {
				if (prismic.isFilled.contentRelationship(item.category)) {
					return await context.client.getByID(item.category.id);
				}
			})
		)
	).filter(Boolean);

	return {
		slice,
		categories
	};
}

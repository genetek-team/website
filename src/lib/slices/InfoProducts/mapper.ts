import * as prismic from '@prismicio/client';

/**
 * @param {Object} args
 * @param {prismic.Content.InfoProductsSlice} args.slice
 * @param {{client: prismic.Client<prismic.Content.AllDocumentTypes>}} args.context
 */
export default async function mapper({ slice, context }) {
	const info_products = (
		await Promise.all(
			slice.primary.info_product_card.map(async (item) => {
				// console.log(item, 'info product');
				if (prismic.isFilled.contentRelationship(item.infoproduct)) {
					return await context.client.getByID(item.infoproduct.id);
				}
			})
		)
	).filter(Boolean);

	const allProducts = await Promise.all(
		slice.primary.info_product_card.map(async (item) => {
			if (prismic.isFilled.contentRelationship(item.infoproduct)) {
				const product = await context.client.getByID(item.infoproduct.id);
				// Return only the required fields
				return {
					id: product.id,
					url: product.url,
					uid: product.uid
				};
			}
		})
	);

	return {
		slice,
		info_products,
		all_products: allProducts
	};
}

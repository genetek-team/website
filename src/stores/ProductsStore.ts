import { writable } from 'svelte/store';

type Product = {
	id: number;
	title: string; 
	body: string; 
	price: number;
	quantity: number;
};

function createCartStore() {
	const { subscribe, update, set } = writable([]);

	let newProducts = [];

	// Function to add a product to the cart
	const addProductToArr = (product: Product) => {
		update((items) => {
			const existingProduct = items.find((item) => item.id === product.id);

			if (existingProduct) {
				// If product is already in the cart, increase the quantity
				return items.map((item) =>
					item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
				);
			}

			// If it's a new product, add it to the cart with the default quantity
			console.log('Adding new product:', product);
			return [...items, { ...product, quantity: 1 }];
		});
	};

	// Reset or clear the cart
	const clearCart = () => set([]);

	const setProducts = (products) => {
		set(products); // Directly set the array of products

		console.log(products, 'products');
	};

	const addProductsArray = (productsArray) => {
		newProducts.push(...productsArray); // Add received products to the new array
		console.log('New products array:', newProducts);
	};

	return {
		subscribe,
		set,
		addProductToArr,
		clearCart,
		setProducts,
		addProductsArray,
		newProducts
	};
}

// Export the store
export const productStore = createCartStore();

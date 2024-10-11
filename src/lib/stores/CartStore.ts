import { writable } from 'svelte/store';

// Define the shape of a product
type Product = {
	id: number;
	title: string; // Keep this as 'title' to match the component
	body: string; // Keep this as 'body' to match the component
	price: number;
	quantity: number;
};

// Create the cart store
function createCartStore() {
	const { subscribe, update, set } = writable<Product[]>([]);

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

	const removeProductById = (id: number) => {
		update((items) => items.filter((item) => item.id !== id));
	};

	return {
		subscribe,
		set,
		addProductToArr,
		clearCart,
		removeProductById
	};
}

// Export the store
export const cartStore = createCartStore();

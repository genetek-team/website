<script lang="ts">
	import emailjs from '@emailjs/browser'; // Import emailjs
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicLink, PrismicRichText } from '@prismicio/svelte';

	import { Button } from '$lib/components/ui/button/index.js';

	import { Input } from '$lib/components/ui/input/index.js';

	import * as Table from '$lib/components/ui/table';

	import GoldText from './GoldText.svelte';

	import Heading2 from '$lib/components/Heading2.svelte';
	import clsx from 'clsx';
	import { cartStore } from '$lib/stores/CartStore';
	import { onDestroy, onMount } from 'svelte';

	import SuccessAlert from '$lib/components/Alerts/SuccessAlert.svelte';
	import ErrorAlert from '$lib/components/Alerts/ErrorAlert.svelte';

	export let slice: Content.OrderSummarySectionSlice;

	let loading = false;

	// BTC option on click fetch BTC price
	// BTC option -> on submit, grab txn id, fetch txn, fetch wallet, perform match
	// BTC option -> if match redirect to success order page

	// Success order page -> Form for address details
	// Success order page -> On submit send email to customer

	let isPaymentMethodChosen = false;

	let isBtcPaymentChosen = false;

	let isEtransferChosen = false;

	let successPayment = false;

	let errorProcessingPayment = false;

	let currentConvertedTotalToBtc = null;

	let isAddressSelected = false;
	let isValidAddressSubmitted = false;

	let totalUsd = null;

	let productsForEmail: any = null;

	$: if (cartItems) {
		totalUsd = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

		productsForEmail = cartItems
			.map((item) => `Product: ${item.title}, Quantity: ${item.quantity}, Price: $${item.price}`)
			.join('\n');

		console.log(productsForEmail, 'productsForEmail');
	}

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

	let productObjForEmail = {
		id: null,
		title: '',
		body: '',
		price: 0,
		quantity: 0
	};

	let newAddressObj = {
		fullName: '',
		email: '',
		streetName: '',
		streetNumber: null,
		floorNumber: '',
		postalCode: '',
		city: '',
		state: '',
		country: '',
		phoneNumber: ''
	};

	const sendEmail = async () => {
		isValidAddressSubmitted = true;
		try {
			const templateParams = {
				full_name: newAddressObj.fullName,
				user_email: newAddressObj.email,
				street_name: newAddressObj.streetName,
				street_number: newAddressObj.streetNumber,
				floor_number: newAddressObj.floorNumber,
				postal_code: newAddressObj.postalCode,
				user_city: newAddressObj.city,
				user_state: newAddressObj.state,
				user_country: newAddressObj.country,
				phone_number: newAddressObj.phoneNumber,
				products_list: productsForEmail
			};

			// Attempt to send the email
			const emailResponse = await emailjs.send(
				'service_1',
				'template_1kmp1qa',
				templateParams,
				'qqQ6JZKITL_7BA24Y'
			);

			console.log('EmailJS response:', emailResponse);

			showSuccess = true;
			successMessage = 'Email sent successfully 🎉';

			newAddressObj.fullName = '';
			newAddressObj.email = '';
			newAddressObj.streetName = '';
			newAddressObj.streetNumber = null;
			newAddressObj.floorNumber = '';
			newAddressObj.postalCode = '';
			newAddressObj.city = '';
			newAddressObj.state = '';
			newAddressObj.country = '';
			newAddressObj.phoneNumber = '';
		} catch (error) {
			console.error('Error sending email:', error);
			showError = true;
			errorMessage = 'Failed to send the email. Please try again.';
		}
	};

	let txnInput = '';

	$: if (txnInput) console.log(txnInput);

	const findCurrentBtcPrice = async () => {
		try {
			const response = await fetch(`https://api.coindesk.com/v1/bpi/currentprice.json`).then(
				(response) => response.json()
			);

			if (!response) return;

			console.log(response, 'bitcoin price details');

			const btcPrice = response.bpi.USD.rate;

			if (btcPrice) console.log(btcPrice, 'btcPrice');

			return btcPrice;
		} catch (err) {
			console.log(err);
		}
	};

	const toggleBtcOption = async () => {
		isBtcPaymentChosen = !isBtcPaymentChosen;

		const currentTotalUsd = totalUsd;

		const currentBtcPrice = await findCurrentBtcPrice();

		if (currentBtcPrice && currentTotalUsd) console.log(currentBtcPrice, currentTotalUsd, 'prices');

		// Remove commas from the BTC price string
		const btcPriceWithoutCommas = currentBtcPrice.replace(/,/g, '');
		const btcPriceFloat = parseFloat(btcPriceWithoutCommas);
		console.log('Parsed BTC Price as float:', btcPriceFloat);

		// Calculate the BTC amount
		const calculatedBtcPrice = currentTotalUsd / btcPriceFloat;
		console.log('Calculated BTC Price:', calculatedBtcPrice);

		if (calculatedBtcPrice) {
			console.log(calculatedBtcPrice, 'calculated price');

			currentConvertedTotalToBtc = calculatedBtcPrice;

			console.log(currentConvertedTotalToBtc, 'currentConvertedTotalToBtc');
		}
	};

	const toggleEtransferOption = () => {
		isEtransferChosen = !isEtransferChosen;
	};

	function toggleAddressForm() {
		isAddressSelected = !isAddressSelected;
	}

	function submitAddress() {
		isValidAddressSubmitted = true;
		console.log('Address Submitted:', newAddressObj);
	}

	const resetAndSucess = () => {
		txnInput = '';

		newAddressObj = {
			fullName: '',
			email: '',
			streetName: '',
			streetNumber: null,
			floorNumber: '',
			postalCode: '',
			city: '',
			state: '',
			country: '',
			phoneNumber: ''
		};

		isBtcPaymentChosen = false;

		isEtransferChosen = false;

		// successPayment = false;

		errorProcessingPayment = false;

		currentConvertedTotalToBtc = null;

		isAddressSelected = false;
		isValidAddressSubmitted = false;

		totalUsd = null;

		// $: if (cartItems) {
		// 	totalUsd = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
		// }

		cartStore.clearCart();
	};

	const btcToSatoshis = (btcValue) => Math.round(btcValue * 100000000);

	const compareTxnAmount = (expectedSatoshis, txnSatoshis, tolerance = 500) => {
		return Math.abs(expectedSatoshis - txnSatoshis) <= tolerance;
	};

	// FETCH FULL DATA ABOUT GENETEK WALLET + CONFIRM IF TXN EXISTS
	const fetchWalletData = async (txnHash) => {
		const btcAddress = 'bc1q7kvy0392dr4t07l98txvydwj0tpz55950y68fs'; // The company's Bitcoin address

		try {
			const response = await fetch(
				`https://api.blockcypher.com/v1/btc/main/addrs/${btcAddress}/full`
			).then((response) => response.json());

			if (!response || !response.txs) {
				console.log('No transactions found for this address.');
				return;
			}

			// Loop through all transactions related to the wallet
			for (let txn of response.txs) {
				if (txn.hash === txnHash) {
					console.log(`Found matching transaction hash: ${txn.hash}`);
					return true; // Transaction exists in the wallet
				}
			}

			// If no matching transaction was found
			console.log('Transaction hash not found in the wallet.');
			return false;
		} catch (err) {
			console.log('Error fetching wallet data:', err);
		}
	};

	// FETCH TXN DATA + PRICE PAID
	const fetchTxnData = async (txn: string) => {
		try {
			const response = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txn}`).then(
				(response) => response.json()
			);

			if (!response) return;

			console.log(response, 'txn hash details');

			return response;
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmitTxn = async () => {
		try {
			if (txnInput && txnInput !== '') {
				loading = true;

				const txnData = await fetchTxnData(txnInput);
				if (!txnData) return;

				// Convert the displayed price (BTC) to satoshis
				const expectedSatoshis = btcToSatoshis(currentConvertedTotalToBtc);

				console.log(expectedSatoshis, 'expected Satoshis');

				// Compare the total value sent in the transaction with the expected total
				const txnSatoshis = txnData.total; // Use total field directly
				if (compareTxnAmount(expectedSatoshis, txnSatoshis)) {
					console.log('Transaction amount matches!');

					// Fetch wallet data to confirm transaction exists
					const isTxnInWallet = await fetchWalletData(txnInput);
					if (isTxnInWallet) {
						console.log('Transaction confirmed and exists in the wallet!');

						successMessage = 'TXN Hash Found! Order submitted!';
						showSuccess = true;

						setTimeout(async () => {
							await sendEmail();

							successPayment = true;

							resetAndSucess();

							successMessage = '';
							showSuccess = false;
						}, 2000);

						loading = false;
					} else {
						console.log('Transaction not found in the wallet.');

						showError = true;
						errorMessage = 'TXN Hash not found ✋';

						loading = false;
					}
				} else {
					console.log('Transaction amount does not match ✋');
					showError = true;
					errorMessage = 'Invalid TXN Hash ✋';

					// setTimeout(async () => {
					// 	await sendEmail();

					// 	successPayment = true;

					// 	resetAndSucess();

					// 	successMessage = '';
					// 	showSuccess = false;

					// }, 2000);

					loading = false;
				}
			}
		} catch (err) {
			console.log(err);

			loading = false;
		}
	};

	const formatDate = (timestamp: number): string => {
		const date = new Date(timestamp);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	};

	let cartItems = [];

	const unsubscribe = cartStore.subscribe((items) => {
		cartItems = items;
	});

	// Cleanup when component is destroyed
	onDestroy(() => unsubscribe());

	onMount(() => {
		successPayment = false;
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<SuccessAlert bind:showSuccess bind:successMessage />
	<ErrorAlert bind:showError bind:errorMessage />

	<PrismicRichText field={slice.primary.title} components={{ em: GoldText, heading2: Heading2 }} />
	<div class=" mt-12 flex flex-col gap-12">
		<p class=" text-balance px-12 text-center text-sm md:px-0 md:text-base">
			<PrismicRichText field={slice.primary.description} />
		</p>

		<div
			class="flex max-w-[350px] flex-col items-center justify-center md:max-w-[950px] lg:max-w-[1600px]"
		>
			<Table.Root>
				<Table.Caption></Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">Date</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Quantity</Table.Head>
						<Table.Head class="">Price</Table.Head>
						<Table.Head class="">Action</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if cartItems && cartItems.length > 0}
						{#each cartItems as item, index}
							<Table.Row>
								<Table.Cell class="font-medium">{formatDate(item.id)}</Table.Cell>
								<Table.Cell>{item.title}</Table.Cell>
								<Table.Cell>{item.quantity}</Table.Cell>
								<Table.Cell class="">${item.price}</Table.Cell>
								<Table.Cell class="">
									<Button
										on:click={() => cartStore.removeProductById(item.id)}
										class="text-xl"
										variant="destructive"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1em"
											height="1em"
											viewBox="0 0 256 256"
											><path
												fill="currentColor"
												d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"
											/></svg
										>
									</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan="5" class="inline-block text-left font-medium"
								>No items...</Table.Cell
							>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</div>

		<div class="flex flex-col items-start justify-start text-start">
			<p class="flex flex-row text-lg font-semibold">
				Total: ${totalUsd || 0}
			</p>

			<!-- <p class="flex flex-row text-lg font-semibold">Total (BTC):</p> -->
		</div>

		<!-- TEST HERE -->

		<div class="flex flex-col items-start justify-start text-start">
			<h3 class="mb-4 text-xl font-semibold">Shipping Address:</h3>

			<!-- Button to show/hide the address form -->

			<!-- If the form is toggled on, display the input fields -->

			{#if isAddressSelected}
				<!-- <form class="" on:submit={sendEmail}> -->
				<div class="flex max-w-[300px] flex-col gap-4 md:max-w-[950px] md:flex-row lg:flex-row">
					<!-- Left Column -->
					<div class="mt-4 flex flex-grow flex-col gap-4">
						<input
							type="text"
							name="full_name"
							placeholder="Full Name"
							bind:value={newAddressObj.fullName}
							class=" text-black"
						/>
						<input
							type="text"
							name="street_name"
							placeholder="Street Name"
							bind:value={newAddressObj.streetName}
							class=" text-black"
						/>
						<input
							type="number"
							name="street_number"
							placeholder="Street Number"
							bind:value={newAddressObj.streetNumber}
							class=" text-black"
						/>
						<input
							type="text"
							name="floor_number"
							placeholder="Floor Number (optional)"
							bind:value={newAddressObj.floorNumber}
							class=" text-black"
						/>
						<input
							type="text"
							name="postal_code"
							placeholder="Postal Code"
							bind:value={newAddressObj.postalCode}
							class=" text-black"
						/>
					</div>

					<!-- Right Column -->
					<div class="mt-4 flex flex-grow flex-col gap-4">
						<input
							type="text"
							name="user_email"
							placeholder="Email"
							bind:value={newAddressObj.email}
							class=" text-black"
						/>
						<input
							type="text"
							name="user_city"
							placeholder="City"
							bind:value={newAddressObj.city}
							class=" text-black"
						/>
						<input
							type="text"
							name="user_state"
							placeholder="State"
							bind:value={newAddressObj.state}
							class=" text-black"
						/>
						<input
							type="text"
							name="user_country"
							placeholder="Country"
							bind:value={newAddressObj.country}
							class=" text-black"
						/>
						<input
							type="tel"
							name="phone_number"
							placeholder="Phone Number"
							bind:value={newAddressObj.phoneNumber}
							class=" text-black"
						/>

						<input type="hidden" name="products_list" bind:value={productsForEmail} />
					</div>
				</div>

				<!-- <Button
					class="relative mt-8 inline-flex h-fit w-fit rounded-full border border-violet-100/20 bg-violet-200/10 px-4 py-2 text-blue-200"
					type="submit"
					on:click={() => ((isAddressSelected = true), (isValidAddressSubmitted = true))}
				>
					Submit Address
				</Button> -->
				<!-- </form> -->
			{/if}

			<div class="mt-8 flex flex-row gap-4">
				<Button
					class="relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200"
					on:click={toggleAddressForm}
				>
					{isAddressSelected ? 'Cancel' : 'Add Address'}
				</Button>

				{#if isAddressSelected}
					<Button
						class="relative inline-flex h-fit w-fit rounded-full border border-violet-100/20 bg-violet-200/10 px-4 py-2 text-blue-200"
						on:click={async () => await sendEmail()}
					>
						Submit Address
					</Button>
				{/if}
			</div>
		</div>

		<!-- END TEST -->

		{#if isAddressSelected === true && isValidAddressSubmitted}
			<div class="flex flex-col items-start justify-start text-start">
				<h3 class="mb-4 text-xl font-semibold">Select payment method:</h3>

				<div class="flex flex-row items-start justify-start gap-2">
					<Button
						class={clsx(
							'relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
						)}
						on:click={toggleBtcOption}>BTC</Button
					>
					<Button
						class={clsx(
							'relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
						)}
						on:click={toggleEtransferOption}>E-transfer</Button
					>
				</div>
			</div>

			{#if isBtcPaymentChosen}
				<p class="flex flex-col text-sm md:flex-row md:text-lg lg:flex-row lg:text-lg">
					<span class="mr-2 font-semibold">BTC Address:</span>
					<PrismicRichText field={slice.primary.bitcoin_address} />
				</p>

				<p class="text-sm md:text-lg lg:text-lg">
					{#if slice.primary.bitcoin_payment_description}
						<PrismicRichText field={slice.primary.bitcoin_payment_description} />
					{/if}
				</p>

				<p class="text-sm md:text-lg lg:text-lg">
					Price (BTC): <span class="ml-2">{currentConvertedTotalToBtc || '-'}</span>
				</p>

				{#if !successPayment}
					<Input
						type="text"
						placeholder="9bdfd8dd53b625a19fe7852fcc7086165a6ea5241bafa5d1e78a0f0c0c4272d2"
						bind:value={txnInput}
						class="max-w-xs text-black"
					/>
				{:else}
					<Input
						disabled
						type="text"
						placeholder="9bdfd8dd53b625a19fe7852fcc7086165a6ea5241bafa5d1e78a0f0c0c4272d2"
						bind:value={txnInput}
						class="disabled max-w-xs text-black"
					/>
				{/if}

				{#if successPayment}
					<PrismicLink field={slice.primary.button_link}
						><Button
							class={clsx(
								'relative inline-flex h-fit w-fit rounded-full border border-violet-100/20 bg-violet-200/10 px-4 py-2 text-violet-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
							)}>{slice.primary.button_text}</Button
						></PrismicLink
					>
				{:else}
					<Button
						on:click={async () => await handleSubmitTxn()}
						class={clsx(
							'disabled relative inline-flex h-fit w-fit rounded-full border border-violet-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
						)}>Submit transaction</Button
					>
				{/if}
			{/if}

			{#if isEtransferChosen}
				<p>
					{#if slice.primary.e_transfer_payment_description}
						<PrismicRichText field={slice.primary.e_transfer_payment_description} />
					{/if}
				</p>

				<p>
					Email for transfer: <span>
						{#if slice.primary.email_for_e_transfer}
							<PrismicRichText field={slice.primary.email_for_e_transfer} />
						{/if}
					</span>
				</p>

				<p>
					Amount to transfer: <span>
						${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
					</span>
				</p>
			{/if}

			{#if errorProcessingPayment}
				<PrismicLink field={slice.primary.button_link_error}>Link</PrismicLink>
			{/if}
		{/if}
	</div>

	{#if loading}
		<div class="loading-overlay">
			<div class="loader"></div>
		</div>
	{/if}
</Bounded>

<style>
	input {
		border: 1px solid #ccc;
		border-radius: 0.375rem;
		padding: 0.5rem;
		width: 350px;
		max-width: 500px;
	}

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5); /* semi-transparent background */
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999; /* Ensure it's on top */
	}

	.loader {
		width: 50px;
		height: 50px;
		border: 5px solid rgba(255, 255, 255, 0.3);
		border-top: 5px solid #fff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>

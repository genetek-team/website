<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	import emailjs from '@emailjs/browser'; // Import emailjs
	import clsx from 'clsx';

	import Heading2 from '$lib/components/Heading2.svelte';

	import SuccessAlert from '$lib/components/Alerts/SuccessAlert.svelte';
	import ErrorAlert from '$lib/components/Alerts/ErrorAlert.svelte';

	export let slice: Content.ContactUsSectionSlice;

	let loading = false; // Preloader state

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

	// Form data and submission function
	let user_name = '';
	let user_email = '';
	let message = '';

	// Email submission handler using emailjs
	const sendEmail = (e: Event) => {
		// Prevent form default submission behavior
		e.preventDefault();
		loading = true; // Show preloader

		const form = e.target as HTMLFormElement;

		// Use emailjs to send the email
		emailjs.sendForm('service_1', 'template_2k9686e', form, 'qqQ6JZKITL_7BA24Y').then(
			() => {
				console.log('SUCCESS!');
				// alert('Message sent successfully!');

				showSuccess = true;
				successMessage = 'Email sent successfully 🎉';
				// Clear the form fields after successful submission
				user_name = '';
				user_email = '';
				message = '';
				loading = false;
			},
			(error) => {
				console.log('FAILED...', error.text);
				// alert('Failed to send the message.');
				showError = true;
				errorMessage = 'Failed to send the email. Please try again.';
				loading = false;
			}
		);
	};

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const isMobile = window.innerWidth < 300; // Adjust the breakpoint as needed
		const offset = isMobile ? 50 : 100; // Adjust this based on your mobile nav height

		gsap.fromTo(
			'.contact__heading',
			{
				y: 100,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				ease: 'power2.inOut',
				duration: 0.8,
				scrollTrigger: {
					trigger: '.contact__heading',
					start: `top bottom+=${offset}%`, // Adjust based on nav height
					end: 'top top-=10%', // Optional: define end to keep the element visible until fully scrolled
					toggleActions: 'play pause resume reverse',
					markers: false // Optional: enable markers to visually debug trigger positions
				}
			}
		);

		gsap.fromTo(
			'.contact__glow',
			{
				scale: 0.7,
				opacity: 0.1
			},
			{
				scale: 1,
				opacity: 1,
				ease: 'power2.inOut',
				duration: 1,
				scrollTrigger: {
					trigger: '.contact__heading',
					start: `top bottom+=${offset}%`, // Adjust based on nav height
					toggleActions: 'play pause resume reverse'
				}
			}
		);
	});
</script>

<Bounded
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="flex flex-col items-start gap-8 md:flex-row"
>
	<SuccessAlert bind:showSuccess bind:successMessage />
	<ErrorAlert bind:showError bind:errorMessage />

	<div
		class="contact__glow absolute -z-10 aspect-video w-full max-w-2xl rounded-full bg-blue-700/50 mix-blend-screen blur-[120px] filter"
	/>

	<h2 class="contact__heading mb-16 flex flex-row items-center justify-center text-center">
		<PrismicRichText field={slice.primary.title} components={{ heading2: Heading2 }} />
	</h2>

	<section class="body-font relative">
		<div class="container mx-auto px-5">
			<div class="mb-12 flex w-full flex-col text-center">
				<p class="mx-auto text-balance text-base leading-relaxed lg:w-2/3">
					<PrismicRichText field={slice.primary.description} />
				</p>
			</div>

			<div class="mx-auto md:w-2/3 lg:w-1/2">
				<div class="-m-2 flex flex-wrap">
					<form class="-m-2 flex flex-wrap" on:submit={sendEmail}>
						<!-- Form fields here -->

						<div class="w-1/2 p-2">
							<div class="relative">
								<input
									type="text"
									id="user_name"
									name="user_name"
									bind:value={user_name}
									class="peer w-full rounded border border-gray-700 bg-gray-800 bg-opacity-40 px-3 py-1 text-base leading-8 text-gray-100 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900"
									placeholder="Name"
								/>
								<label
									for="name"
									class="absolute -top-6 left-3 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-6 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-500"
									>Name</label
								>
							</div>
						</div>
						<div class="w-1/2 p-2">
							<div class="relative">
								<input
									type="email"
									id="user_email"
									name="user_email"
									bind:value={user_email}
									class="peer w-full rounded border border-gray-700 bg-gray-800 bg-opacity-40 px-3 py-1 text-base leading-8 text-gray-100 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900"
									placeholder="Email"
								/>
								<label
									for="email"
									class="absolute -top-6 left-3 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-6 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-500"
									>Email</label
								>
							</div>
						</div>
						<div class="mt-4 w-full p-2">
							<div class="relative">
								<textarea
									id="message"
									name="message"
									bind:value={message}
									class="peer h-32 w-full resize-none rounded border border-gray-700 bg-gray-800 bg-opacity-40 px-3 py-1 text-base leading-6 text-gray-100 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900"
									placeholder="Message"
								></textarea>
								<label
									for="message"
									class="absolute -top-6 left-3 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-6 peer-focus:left-3 peer-focus:text-sm peer-focus:text-indigo-500"
									>Message</label
								>
							</div>
						</div>
						<div class="mt-4 flex w-full flex-row items-center justify-center p-2">
							<Button
								class={clsx(
									'relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
								)}
								type="submit"
							>
								<span class="mr-2 text-2xl">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 256 256"
									>
										<path
											fill="currentColor"
											d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-96 85.15L52.57 64h150.86ZM98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z"
										/>
									</svg>
								</span>
								{slice.primary.button_text}
							</Button>
						</div>
					</form>

					<!-- footer -->
					<!-- <div class="mt-8 w-full border-t border-gray-800 p-2 pt-8 text-center">
						<a class="text-blue-400">genetek@protonmail.com</a>
					</div> -->
				</div>
			</div>
		</div>
	</section>

	<!-- <div
		class="glass-container flex w-full flex-row gap-6 rounded-lg bg-gray-950/60 px-4 py-6 before:bg-gray-100/10"
	>
		<PrismicImage
			field={slice.primary.image}
			class="max-h-screen rounded-lg object-cover md:w-1/2"
		/>

		<div class="flex w-full flex-col items-start justify-start gap-4 md:w-1/2">
			<h1 class="text-4xl font-bold">
				<PrismicRichText field={slice.primary.title} />
			</h1>

			<form
				on:submit={sendEmail}
				class="flex w-full flex-col items-start justify-start gap-4 text-black"
			>
				<Input
					type="text"
					placeholder="Name"
					bind:value={user_name}
					name="user_name"
					class="max-w-xs"
					required
				/>
				<Input
					type="email"
					placeholder="Email"
					bind:value={user_email}
					name="user_email"
					class="max-w-xs"
					required
				/>
				<Textarea
					placeholder="Type your message here."
					bind:value={message}
					name="message"
					class="max-w-xs"
					required
				/>

	
				<Button
					class={clsx(
						'relative inline-flex h-fit w-fit rounded-full border border-blue-100/20 bg-violet-200/10 px-4 py-2 text-blue-200 outline-none ring-orange-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-orange-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-orange-200/40 hover:text-orange-300 after:hover:bg-opacity-15 focus:ring-2'
					)}
					type="submit"
				>
					<span class="mr-2 text-2xl">
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
							<path
								fill="currentColor"
								d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-96 85.15L52.57 64h150.86ZM98.71 128L40 181.81V74.19Zm11.84 10.85l12 11.05a8 8 0 0 0 10.82 0l12-11.05l58 53.15H52.57ZM157.29 128L216 74.18v107.64Z"
							/>
						</svg>
					</span>
					{slice.primary.button_text}
				</Button>
			</form>
		</div>
		<div
			class="absolute left-0 top-1/3 -z-10 h-2/3 w-2/3 bg-blue-700/50 mix-blend-screen blur-[120px] filter"
		/>
	</div> -->

	{#if loading}
		<div class="loading-overlay">
			<div class="loader"></div>
		</div>
	{/if}
</Bounded>

<style>
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

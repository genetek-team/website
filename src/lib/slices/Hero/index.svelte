<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicImage } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import gsap from 'gsap';

	export let slice: Content.HeroSlice;

	// all images:
	// slice.primary.image_1 / slice.primary.image_2 / slice.primary.image_3 / slice.primary.image_4 / slice.primary.image_5

	// Array to hold all images
	const images = [
		slice.primary.image_1,
		slice.primary.image_2,
		slice.primary.image_3,
		slice.primary.image_4
		// slice.primary.image_5
	];

	// State to hold the current index of the image
	let currentIndex = 0;

	let hideQuickAnimation;

	// Duration in milliseconds (e.g., 5000ms = 5 seconds)
	const intervalDuration = 5000;

	// Function to rotate the image index
	const rotateImage = () => {
		hideQuickAnimation = false;
		currentIndex = (currentIndex + 1) % images.length; // Cycle through the images
		hideQuickAnimation = true;
	};

	// Automatically rotate images every `intervalDuration` milliseconds
	const startImageRotation = () => {
		setInterval(rotateImage, intervalDuration);
	};

	// Start the rotation when the component is mounted
	onMount(() => {
		startImageRotation();

		const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

		tl.fromTo('.hero__glow', { scale: 0.5 }, { scale: 1, opacity: 1, duration: 1.8 });

		gsap.to('.hero__glow--one', {
			ease: 'power2.inOut',
			repeat: -1,
			repeatDelay: 0,
			keyframes: [
				{ top: '0%', left: '33%', duration: 0 },
				{ top: '33%', left: '33%', duration: 2 },
				{ top: '33%', left: '0%', duration: 3 },
				{ top: '0%', left: '0%', duration: 2 },
				{ top: '0%', left: '33%', duration: 3 }
			]
		});

		gsap.to('.hero__glow--two', {
			ease: 'power2.inOut',
			repeat: -1,
			repeatDelay: 0,
			keyframes: [
				{ top: '33%', left: '0%', duration: 0 },
				{ top: '0%', left: '0%', duration: 2 },
				{ top: '0%', left: '33%', duration: 3 },
				{ top: '33%', left: '33%', duration: 2 },
				{ top: '33%', left: '0%', duration: 3 }
			]
		});
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class="relative text-center">
		<div class="glass-container mt-16 max-h-[700px] w-full">
			<div
				class="hero__glow hero__glow--one absolute left-1/3 top-0 -z-10 h-2/3 w-2/3 bg-blue-700/50 opacity-0 mix-blend-screen blur-3xl filter md:blur-[120px]"
			/>
			<div
				class="hero__glow hero__glow--two absolute left-0 top-1/3 -z-10 h-2/3 w-2/3 bg-orange-600/50 opacity-0 mix-blend-screen blur-3xl filter md:blur-[120px]"
			/>
			<div class="" transition:fade={{ duration: 2000 }}>
				{#if images[currentIndex]}
					<PrismicImage
						class="min-h-[150px] min-w-[300px]  rounded-lg object-cover"
						field={images[currentIndex]}
					/>
				{/if}
			</div>
		</div>
	</div>
</Bounded>

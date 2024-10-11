<script lang="ts">
	import Terminal from 'lucide-svelte/icons/terminal';
	import * as Alert from '$lib/components/ui/alert/index.js';

	export let showSuccess;
	export let successMessage;
</script>

{#if showSuccess}
	<div
		class="show-notification fixed bottom-16 right-4 z-50 mb-6 flex max-w-xl translate-y-10 transform flex-row items-center rounded-lg bg-opacity-80 bg-gradient-to-l from-slate-900 via-[#4765e9a9] to-slate-900 p-4 font-semibold text-white opacity-0 shadow-lg transition-all duration-500 ease-in-out"
	>
		<!-- <h3 class="mr-2">Success!</h3> -->
		<p>{successMessage}</p>
	</div>
{/if}

<style>
	.show-notification {
		opacity: 1;
		transform: translateY(0);
	}

	div {
		transition:
			opacity 0.5s ease-in-out,
			transform 0.5s ease-in-out;
	}
</style>

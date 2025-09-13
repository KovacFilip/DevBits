<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import ModeSwitcher from '$lib/components/theme/mode-switcher.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen flex-col">
	<ModeWatcher />
	<nav class="flex w-full items-end justify-end px-4 pt-4">
		<ModeSwitcher />
	</nav>
	<div class="flex-1">
		{@render children?.()}
	</div>
</div>

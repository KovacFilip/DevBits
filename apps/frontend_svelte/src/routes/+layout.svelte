<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen flex-col">
	<ModeWatcher />
	<!-- <div class="flex-1"> -->
	{@render children?.()}
	<!-- </div> -->
</div>

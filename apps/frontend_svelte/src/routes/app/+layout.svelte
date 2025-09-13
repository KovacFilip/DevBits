<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navbar, { type NavbarProps } from '$lib/components/navbar/navbar.svelte';

	let { children } = $props();
	const routes: NavbarProps = {
		paths: [
			{
				title: 'About',
				link: '/about'
			}
		]
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen flex-col">
	<div>
		<Navbar paths={routes.paths} />
	</div>
	<div class="flex flex-1 flex-col items-center justify-center overflow-y-auto">
		{@render children?.()}
	</div>
</div>

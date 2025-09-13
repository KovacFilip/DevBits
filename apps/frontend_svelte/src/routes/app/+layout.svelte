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

<div class="h-full w-full">
	<Navbar paths={routes.paths} />
	{@render children?.()}
</div>

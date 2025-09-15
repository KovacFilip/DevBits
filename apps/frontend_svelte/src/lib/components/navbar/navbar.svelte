<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname, RouteId } from '$app/types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import ModeSwitcher from '../theme/mode-switcher.svelte';

	export interface NavbarProps {
		paths: {
			link: RouteId | Pathname;
			title: string;
		}[];
	}

	const { paths }: NavbarProps = $props();
</script>

<NavigationMenu.Root
	class="flex w-full max-w-screen items-center justify-between border-b border-border bg-background px-6 py-3 shadow-sm"
>
	<a
		href={resolve('/')}
		class="tracking-light animate-gradient bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-[length:200%_200%] bg-clip-text text-3xl font-bold text-transparent transition-transform hover:scale-105"
	>
		DevBits
	</a>

	<NavigationMenu.List class="flex items-center gap-6">
		{#each paths as path (path.link)}
			<NavigationMenu.Item>
				<NavigationMenu.Link
					href={resolve(path.link)}
					class="text-md font-bold transition-colors hover:text-primary"
				>
					{path.title}
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		{/each}

		<ModeSwitcher />
	</NavigationMenu.List>
</NavigationMenu.Root>

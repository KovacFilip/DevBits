<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname, RouteId } from '$app/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		path: RouteId | Pathname;
		children: Snippet;
		className?: string;
	}

	const { children, path, className }: Props = $props();
</script>

<Button class={`hover:cursor-pointer ${className ?? ''}`} onclick={() => goto(resolve(path))}>
	{@render children?.()}
</Button>

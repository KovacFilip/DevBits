<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname, RouteId } from '$app/types';
	import type { Snippet } from 'svelte';

	interface Props {
		path: RouteId | Pathname;
		children: Snippet;
	}

	const { children, path }: Props = $props();
</script>

<a
	href={resolve(path)}
	class="border-0 bg-transparent p-0 text-primary hover:cursor-pointer hover:underline"
>
	{@render children?.()}
</a>

<script lang="ts">
	import Navbar from '$lib/components/navbar/navbar.svelte';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col">
	<div>
		<Navbar paths={[]} />
	</div>
	<div class="flex-1">
		{@render children?.()}
	</div>
</div>

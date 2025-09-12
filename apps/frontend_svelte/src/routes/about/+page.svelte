<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	let s = $state(false);
</script>

<div class="flex flex-col bg-red-500">
	<div>This is my about page</div>
	<Button
		onclick={() => {
			s = !s;
		}}>Click me</Button
	>
	{#if s}
		<div>s is true</div>
	{/if}
</div>

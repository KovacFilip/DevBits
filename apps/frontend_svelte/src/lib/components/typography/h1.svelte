<script lang="ts">
	let { children } = $props();
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
	{@render children?.()}
</h1>

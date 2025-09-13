<script lang="ts">
	let { children } = $props();
</script>

<p class="leading-7 [&:not(:first-child)]:mt-6">
	{@render children?.()}
</p>

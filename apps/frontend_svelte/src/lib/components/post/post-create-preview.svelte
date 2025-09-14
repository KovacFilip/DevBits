<script lang="ts">
	import { cn } from '$lib/utils';
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';

	marked.setOptions({
		async: false
	});

	let { content, className }: { content: string; className?: string } = $props();
</script>

<div
	class={cn(
		'prose h-full overflow-y-auto rounded-md border-1 border-input px-3 py-2 break-words prose-slate dark:prose-invert',
		className
	)}
>
	{#if content === ''}
		<span class="text-muted-foreground">Preview</span>
	{:else}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html DOMPurify.sanitize(marked(content) as string)}
	{/if}
</div>

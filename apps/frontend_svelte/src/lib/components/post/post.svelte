<script lang="ts">
	import { browser } from '$app/environment';
	import { marked } from '$lib/marked/marked';
	import type { PostWithContentDTO } from '@devbits/shared';
	import DOMPurify from 'dompurify';
	import P from '../typography/p.svelte';

	const { content, userId }: PostWithContentDTO = $props();

	const dirtyHtml = marked.parse(content);
	const pureHtml = browser ? DOMPurify.sanitize(dirtyHtml as string) : dirtyHtml;
</script>

<div class="w-xs sm:w-lg md:w-xl lg:w-2xl xl:w-4xl">
	<div class="prose max-w-none rounded-2xl border-1 p-4 prose-slate dark:prose-invert">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html pureHtml}
	</div>
	<div class="text-slate mt-6">
		<P>Author: {userId}</P>
	</div>
</div>

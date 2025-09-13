<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { PostWithContentDTO } from '@devbits/shared';
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';

	marked.setOptions({
		async: false
	});

	const { content, title, postId, userId }: PostWithContentDTO = $props();

	const dirtyHtml = marked(content);
	const pureHtml = DOMPurify.sanitize(dirtyHtml as string);
</script>

<Card class="w-xs sm:w-lg md:w-2xl lg:w-6xl">
	<CardHeader class="space-y-4 pb-6">
		<div class="space-y-2">
			<CardTitle class="text-3xl leading-tight font-bold text-primary">{title}</CardTitle>
			<CardDescription class="hidden text-base md:block">
				Author ID: {userId} • Post ID: {postId}
			</CardDescription>
		</div>
	</CardHeader>

	<CardContent class="pb-8">
		<div class="max-h-[60vh] overflow-y-auto pr-2 md:max-h-[70vh]">
			<div class="prose prose-lg max-w-none prose-slate dark:prose-invert">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html pureHtml}
			</div>
		</div>
	</CardContent>
</Card>

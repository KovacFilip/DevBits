<script lang="ts">
	import NavigationButton from '$lib/components/navigation/navigation-button.svelte';
	import H1 from '$lib/components/typography/h1.svelte';
	import P from '$lib/components/typography/p.svelte';
</script>

<div class="flex h-full flex-col items-center justify-center gap-8 bg-background text-foreground">
	<div class="flex flex-col items-center gap-4">
		<div
			class="animate-gradient bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-[length:200%_200%] bg-clip-text text-transparent transition-transform hover:scale-105"
		>
			<H1>DevBits</H1>
		</div>
		<div class="mx-8 max-w-6xl text-center">
			<P
				>Welcome to a place where ideas come alive! Share your voice through posts, spark
				conversations in the comments, and connect with people who love to engage. Whether you’re
				here to write, discuss, or discover — this is the platform to be part of something bigger.</P
			>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<NavigationButton path="/auth/sign-in">Sign in</NavigationButton>
	</div>
</div>

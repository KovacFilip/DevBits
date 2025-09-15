<script lang="ts">
	import { AuthApi } from '$lib/api/auth/auth';
	import GoogleIcon from '$lib/assets/icons/google-icon.svelte';
	import ModeSwitcher from '$lib/components/theme/mode-switcher.svelte';
	import H1 from '$lib/components/typography/h1.svelte';
	import P from '$lib/components/typography/p.svelte';
	import { Button } from '$lib/components/ui/button';

	const authApi = new AuthApi();

	async function handleGoogleLogin() {
		await authApi.handleGoogleLogin();
	}
</script>

<nav class="flex w-full items-end justify-end px-4 pt-4">
	<ModeSwitcher />
</nav>
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
				conversations in the comments, and connect with people who love to engage. Whether you're
				here to write, discuss, or discover — this is the platform to be part of something bigger.</P
			>
		</div>
	</div>
	<div class="flex flex-col gap-3">
		<Button
			onclick={handleGoogleLogin}
			variant="outline"
			size="lg"
			class="group flex h-12 w-72 items-center justify-center gap-3 border-2 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
		>
			<GoogleIcon />
			<span class="font-medium">Continue with Google</span>
		</Button>
		<p class="text-center text-xs text-muted-foreground">Sign in to start sharing your ideas</p>
	</div>
</div>

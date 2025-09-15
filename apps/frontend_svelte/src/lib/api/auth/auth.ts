export class AuthApi {
	async handleGoogleLogin() {
		window.location.href = `http://localhost:3000/v1/auth/google`;
	}
}

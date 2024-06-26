// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
type User = {
	userId: string;
	displayName: string;
	email: string;
	role: string;
};

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			stage: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

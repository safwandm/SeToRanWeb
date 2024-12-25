import { BaseApi } from '$lib/baseApi';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// init base api pertama kali untuk semua aplikasi sisi server (file .server.js/ts)
    // mungkin bukan best practice, kalau ada masalah bisa buat base api baru setiap file atau simpen instance base api di event.locals.baseApi
	BaseApi.initInstance(event.cookies)

	let currentUser = null;
	await BaseApi.ins.fetchAuth("/api/current-user")
		.then(async res => {
			let js = await res.json()

			if (res.ok) {
				currentUser = js.user
			}
		})
	
	let allowRoutes = [
		"/login",
		"/register"
	]

	const currentRoute = event.url.pathname; 
	if (!currentUser && (!allowRoutes.includes(currentRoute) || currentRoute == "/")) {
		redirect(301, '/login')
	} else if (currentUser && (allowRoutes.includes(currentRoute) || currentRoute == "/")) {
		redirect(301, '/dashboard')
	}

	const response = await resolve(event);
	return response;
};
<svelte:head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</svelte:head>

<script>
    import { page } from '$app/stores';
    import '../app.css';
    import { afterNavigate, goto } from '$app/navigation'
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/store';
    import { redirect } from '@sveltejs/kit';
	import { fetchAuth } from '$lib/utilities';
	import { Toaster } from '$lib/components/ui/sonner';

    let { children } = $props();

    async function verifyUser() {
        await fetchAuth("/api/current-user")
            .then(async res => {
                let js = await res.json()

                if (res.ok) {
                    currentUser.update((data) => {
                        data.username = js.user.nama
                        return data
                    })
                } else {
                    currentUser.set({}) // unauthorized
                }
            })
        
        let allowRoutes = [
            "/login",
            "/register"
        ]
        
        const currentRoute = $page.url.pathname; 
        if (!$currentUser.username && !allowRoutes.includes(currentRoute)) {
            goto('/login');
        } else if ($currentUser.username && allowRoutes.includes(currentRoute)) {
            goto('/dashboard');
        }
    }

    afterNavigate(() => {
        verifyUser()
    })

</script>

<Toaster theme="light"/>

{@render children()}

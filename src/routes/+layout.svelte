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
    import * as jqa from 'jquery'
	import { fetchAuth } from '$lib/utilities';
    const jq = jqa.default
    // kalau di layout harus begini gak tau kenapa
    let { children } = $props();
    
    // biar gak ada notif error vscode
    let dialogBoxes = ['.notification', '.messages']
    function toggleDialog(name) {
        dialogBoxes.forEach((box) => box != name?jq(box).hide():null) // kalau box == name do nothing
        jq(name).toggle()
    }

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
        
        if (!$currentUser.username && !$page.url.href.includes('/login'))
            goto('/login')
        else if ($currentUser.username && $page.url.href.includes('/login'))
            goto('/dashboard')
    }

    afterNavigate(() => {
        verifyUser()
    })

</script>


{@render children()}

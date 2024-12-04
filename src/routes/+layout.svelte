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

    // kalau di layout harus begini gak tau kenapa
    const jq = globalThis.$;

    let { children } = $props();
    
    // biar gak ada notif error vscode
    let dialogBoxes = ['.notification', '.messages']
    function toggleDialog(name) {
        dialogBoxes.forEach((box) => box != name?jq(box).hide():null) // kalau box == name do nothing
        jq(name).toggle()
    }

    function verifyUser() {
        currentUser.update((data) => {
            data.username = window.localStorage.getItem('username')??''
            return data
        })

        if ($currentUser.username == '' && !$page.url.href.includes('/login'))
            goto('/login')
        else if ($currentUser.username != '' && $page.url.href.includes('/login'))
            goto('/dashboard')
    }

    afterNavigate(() => {
        verifyUser()
    })

</script>


{@render children()}

<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    
</svelte:head>

<style>    
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    :root {
        --basic-shadow: 0px 0px 20px 1px rgba(0, 48, 120, 0.1);

        font-family: 'Poppins', sans-serif;
    }

    body, html {
        height: 100%;
    }

    .login-page {
        background-color: #F6FAFF;

        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .row {
        display: flex;
        flex-direction: column;
    }

    .login-container {
        margin-left: 70px;
        
        box-shadow: var(--basic-shadow);
        background-color: white;

        width: 360px;
        height: 344px;

        justify-content: start;

        padding: 20px;

        align-items: center;
    }

    .login-form {
        margin-top: 30px;

        /* height: 156px; */
        width: 100%;    
        justify-content: space-between;
    }

    input {
        height: 40px;
        width: 100%;

        border: 1px solid #DFDDDD;
        border-radius: 4px;
    }

    h1 {
        font-weight: 450;
    }

    label {
        font-weight: 450;

        margin-top: 4px;
        margin-bottom: 4px;
    }

    button {
        margin-top: 30px;

        font-weight: 450;
        color: white;
        font-size: 16px;
        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 8px 32px;
        gap: 10px;

        width: 100%;
        height: 40px;

        background-color: #007CFF;
        border-radius: 4px;

        /* Inside auto layout */
        flex: none;
        order: 2;
        align-self: stretch;
        flex-grow: 0;

        border: none;
    }

    img {
        height: 362px;
        width: 403px;
    }
    </style>
    </style>
    
</svelte:head>
</style>
    
</svelte:head>

<script>
	import { goto } from "$app/navigation";

    function handleSubmit(e) {
        e.preventDefault()

        window.localStorage.setItem('username', e.target.username.value)

        goto('/dashboard')
    }
</script>

<div class="login-page">
    <img src="src/lib/assets/login-image.svg"/>

    <div class="login-container row">
        <h1>Login</h1>
        <form onsubmit={handleSubmit} class="login-form row">
            <label>username</label>
            <input name="username" type="text" required>
            <label>password</label>
            <input name="password" type="password"  required>
            <button type="submit">Login</button>
        </form>
    </div>
</div>

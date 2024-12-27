<script>
	import { page } from '$app/stores';
	import '/src/app.css';
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/store';
	import { redirect } from '@sveltejs/kit';
	import * as Popover from '$lib/components/ui/popover';
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index";
	import { LogOut } from 'lucide-svelte';
	import Cookies from 'js-cookie';

	let { children } = $props();

	function logOut() {
		Cookies.remove("access_token")
		document.location.reload()
	}
</script>

<!-- render page dengan layout -->
<link rel="stylesheet" href="/src/lib/popbox/popbox.css" />
<link rel="stylesheet" href="/src/routes/(layout)/sharedStyle.css" />

<div class="main-grid">
	<header>
		<div class="logo flex-center">
			<p>Setoran</p>
			<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
				<path fill="currentColor" d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
			</svg>
			current user: {$currentUser.username}
			<!-- tes currentUser -->
		</div>
		<div class="header-right flex-center">
			<Popover.Root>
				<Popover.Trigger>
					<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M4 4h16v12H5.17L4 17.17zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm2 10h8v2H6zm0-3h12v2H6zm0-3h12v2H6z"
						/>
					</svg>
				</Popover.Trigger>
				<Popover.Content><h3>Messages</h3></Popover.Content>
			</Popover.Root>
			<Popover.Root>
				<Popover.Trigger>
					<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2m6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5z"
						/>
					</svg>
				</Popover.Trigger>
				<Popover.Content><h3>Notifications</h3></Popover.Content>
			</Popover.Root>
			<AlertDialog.Root>
				<AlertDialog.Trigger><LogOut /> 	</AlertDialog.Trigger>
				<AlertDialog.Content class="w-[300px]">
				  <AlertDialog.Header>
					<AlertDialog.Title>Konfirmasi Log Out</AlertDialog.Title>
					<AlertDialog.Description>
					  Anda yakin ingin log out dari aplikasi?
					</AlertDialog.Description>
				  </AlertDialog.Header>
				  <AlertDialog.Footer>
					<AlertDialog.Cancel>Batal</AlertDialog.Cancel>
					<AlertDialog.Action onclick={logOut}>Log Out</AlertDialog.Action>
				  </AlertDialog.Footer>
				</AlertDialog.Content>
			  </AlertDialog.Root>
		</div>
	</header>

	<aside>
		<nav>
			<a class="nav-button" href="/login">
				<div class="nav-icon flex-center">
					<img src="/src/lib/assets/icons/ic_outline-dashboard.png" />
				</div>
				Login
			</a>
			<a class="nav-button" href="/dashboard">
				<!-- kayaknya biar pas hover bisa berubah warna iconnya harus di input langsung disini untuk svg -->
				<svg
					class="nav-icon"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.6667 3.33333V4.66667H10V3.33333H12.6667ZM6 3.33333V7.33333H3.33333V3.33333H6ZM12.6667 8.66667V12.6667H10V8.66667H12.6667ZM6 11.3333V12.6667H3.33333V11.3333H6ZM14 2H8.66667V6H14V2ZM7.33333 2H2V8.66667H7.33333V2ZM14 7.33333H8.66667V14H14V7.33333ZM7.33333 10H2V14H7.33333V10Z"
						fill="currentColor"
					/>
				</svg>
				Dashboard
			</a>
			<a class="nav-button" href="/pelanggan">
				<svg
					class="nav-icon"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M14.64 7.48008C14.38 4.67341 11.84 2.66675 9.03998 2.66675C8.91331 2.66675 8.78665 2.67341 8.65998 2.68008C1.33331 3.16008 1.33331 11.4667 1.33331 11.4667V12.0001C1.33331 12.7334 1.93331 13.3334 2.66665 13.3334H9.33331C12.4466 13.3334 14.94 10.6601 14.64 7.48008ZM3.50665 7.70675C3.88665 6.84675 4.35998 6.14008 4.93331 5.58008L7.34665 6.60008C7.74665 6.76675 7.99998 7.15341 7.99998 7.58675C7.99998 8.18008 7.51998 8.66008 6.92665 8.66008H3.14665C3.24665 8.35341 3.35998 8.03342 3.50665 7.70675ZM12.2933 10.6934C11.9176 11.1047 11.4604 11.4333 10.9508 11.6583C10.4412 11.8832 9.89036 11.9996 9.33331 12.0001H2.66665V11.4667C2.66665 11.4534 2.67331 10.8534 2.82665 10.0001H6.92665C8.25331 10.0001 9.33331 8.92008 9.33331 7.59342C9.33331 6.62675 8.75331 5.75341 7.86665 5.38008L6.19998 4.67341C6.93331 4.29341 7.77998 4.07341 8.74665 4.01341C8.84665 4.00008 8.94665 4.00008 9.03998 4.00008C11.2466 4.00008 13.1266 5.58008 13.3133 7.60675C13.42 8.75341 13.06 9.84675 12.2933 10.6934Z"
						fill="currentColor"
					/>
				</svg>
				Pelanggan
			</a>
			<a class="nav-button" href="/motor">
				<svg
					class="nav-icon"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.48 7.33334L7.14667 8.66668H6.63333L6.46667 8.20668C6.34667 7.88668 6.18667 7.59334 5.98667 7.33334H8.48ZM10.2733 3.33334H7.33333V4.66668H9.72667L11.06 6.00001H3.33333C1.46667 6.00001 0 7.46668 0 9.33334C0 11.2 1.46667 12.6667 3.33333 12.6667C4.97333 12.6667 6.3 11.54 6.6 10H7.7L9.54667 8.15334C9.40667 8.51334 9.33333 8.91334 9.33333 9.33334C9.33333 11.2 10.8 12.6667 12.6667 12.6667C14.5333 12.6667 16 11.2 16 9.33334C16 7.56668 14.6867 6.15334 12.96 6.02001L10.2733 3.33334ZM12.6667 11.3333C11.56 11.3333 10.6667 10.44 10.6667 9.33334C10.6667 8.22668 11.56 7.33334 12.6667 7.33334C13.7733 7.33334 14.6667 8.22668 14.6667 9.33334C14.6667 10.44 13.7733 11.3333 12.6667 11.3333ZM3.33333 11.3333C2.24667 11.3333 1.33333 10.42 1.33333 9.33334C1.33333 8.24668 2.24667 7.33334 3.33333 7.33334C4.18667 7.33334 4.93333 7.90001 5.21333 8.66668H3.33333V10H5.21333C4.93333 10.7667 4.18667 11.3333 3.33333 11.3333Z"
						fill="currentColor"
					/>
				</svg>
				Motor
			</a>
			<a class="nav-button" href="/diskon">
				<svg
					class="nav-icon"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.52667 14L2 7.47333V8.80666C2 9.15999 2.14 9.49999 2.39333 9.74666L7.58667 14.94C8.10667 15.46 8.95333 15.46 9.47333 14.94L13.6133 10.8C14.1333 10.28 14.1333 9.43333 13.6133 8.91333L8.52667 14Z"
						fill="currentColor"
					/>
					<path
						d="M7.58667 11.6067C7.84667 11.8667 8.18667 12 8.52667 12C8.86667 12 9.20667 11.8667 9.46667 11.6067L13.6067 7.46667C14.1267 6.94667 14.1267 6.1 13.6067 5.58L8.41333 0.386667C8.16667 0.14 7.82667 0 7.47333 0H3.33333C2.6 0 2 0.6 2 1.33333V5.47333C2 5.82667 2.14 6.16667 2.39333 6.41333L7.58667 11.6067ZM3.33333 1.33333H7.47333L12.6667 6.52667L8.52667 10.6667L3.33333 5.47333V1.33333Z"
						fill="currentColor"
					/>
					<path
						d="M4.83333 3.66667C5.29357 3.66667 5.66667 3.29357 5.66667 2.83333C5.66667 2.3731 5.29357 2 4.83333 2C4.3731 2 4 2.3731 4 2.83333C4 3.29357 4.3731 3.66667 4.83333 3.66667Z"
						fill="currentColor"
					/>
				</svg>
				Diskon
			</a>
			<a class="nav-button" href="/mitra">
				<svg
					class="nav-icon"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M2.66667 8.66667C3.4 8.66667 4 8.06667 4 7.33333C4 6.6 3.4 6 2.66667 6C1.93333 6 1.33333 6.6 1.33333 7.33333C1.33333 8.06667 1.93333 8.66667 2.66667 8.66667ZM3.42 9.4C3.17333 9.36 2.92667 9.33333 2.66667 9.33333C2.00667 9.33333 1.38 9.47333 0.813334 9.72C0.571808 9.82324 0.365949 9.99518 0.221345 10.2145C0.0767418 10.4337 -0.000229124 10.6907 5.12329e-07 10.9533V12H3V10.9267C3 10.3733 3.15333 9.85333 3.42 9.4ZM13.3333 8.66667C14.0667 8.66667 14.6667 8.06667 14.6667 7.33333C14.6667 6.6 14.0667 6 13.3333 6C12.6 6 12 6.6 12 7.33333C12 8.06667 12.6 8.66667 13.3333 8.66667ZM16 10.9533C16 10.4133 15.68 9.93333 15.1867 9.72C14.6021 9.46492 13.9711 9.33329 13.3333 9.33333C13.0733 9.33333 12.8267 9.36 12.58 9.4C12.8467 9.85333 13 10.3733 13 10.9267V12H16V10.9533ZM10.8267 9.1C10.0467 8.75333 9.08667 8.5 8 8.5C6.91333 8.5 5.95333 8.76 5.17333 9.1C4.82214 9.2585 4.5244 9.51539 4.31616 9.83958C4.10792 10.1638 3.99811 10.5414 4 10.9267V12H12V10.9267C12 10.14 11.5467 9.42 10.8267 9.1ZM5.38 10.6667C5.44 10.5133 5.46667 10.4067 5.98667 10.2067C6.63333 9.95333 7.31333 9.83333 8 9.83333C8.68667 9.83333 9.36667 9.95333 10.0133 10.2067C10.5267 10.4067 10.5533 10.5133 10.62 10.6667H5.38ZM8 5.33333C8.36667 5.33333 8.66667 5.63333 8.66667 6C8.66667 6.36667 8.36667 6.66667 8 6.66667C7.63333 6.66667 7.33333 6.36667 7.33333 6C7.33333 5.63333 7.63333 5.33333 8 5.33333ZM8 4C6.89333 4 6 4.89333 6 6C6 7.10667 6.89333 8 8 8C9.10667 8 10 7.10667 10 6C10 4.89333 9.10667 4 8 4Z"
						fill="currentColor"
					/>
				</svg>
				Mitra
			</a>
			<a class="nav-button" href="/voucher">
				<svg
					class="nav-icon"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M9.86665 5.33341L10.6666 6.13341L6.13331 10.6667L5.33331 9.86675L9.86665 5.33341ZM2.66665 2.66675H13.3333C14.0733 2.66675 14.6666 3.26008 14.6666 4.00008V6.66675C14.313 6.66675 13.9739 6.80722 13.7238 7.05727C13.4738 7.30732 13.3333 7.64646 13.3333 8.00008C13.3333 8.3537 13.4738 8.69284 13.7238 8.94289C13.9739 9.19294 14.313 9.33342 14.6666 9.33342V12.0001C14.6666 12.7401 14.0733 13.3334 13.3333 13.3334H2.66665C2.31302 13.3334 1.97389 13.1929 1.72384 12.9429C1.47379 12.6928 1.33331 12.3537 1.33331 12.0001V9.33342C2.07331 9.33342 2.66665 8.74008 2.66665 8.00008C2.66665 7.64646 2.52617 7.30732 2.27612 7.05727C2.02607 6.80722 1.68694 6.66675 1.33331 6.66675V4.00008C1.33331 3.64646 1.47379 3.30732 1.72384 3.05727C1.97389 2.80722 2.31302 2.66675 2.66665 2.66675ZM2.66665 4.00008V5.69341C3.07177 5.92701 3.40822 6.26319 3.64215 6.66812C3.87608 7.07304 3.99924 7.53244 3.99924 8.00008C3.99924 8.46772 3.87608 8.92712 3.64215 9.33205C3.40822 9.73697 3.07177 10.0731 2.66665 10.3067V12.0001H13.3333V10.3067C12.9282 10.0731 12.5917 9.73697 12.3578 9.33205C12.1239 8.92712 12.0007 8.46772 12.0007 8.00008C12.0007 7.53244 12.1239 7.07304 12.3578 6.66812C12.5917 6.26319 12.9282 5.92701 13.3333 5.69341V4.00008H2.66665ZM6.33331 5.33341C6.88665 5.33341 7.33331 5.78008 7.33331 6.33341C7.33331 6.88675 6.88665 7.33342 6.33331 7.33342C5.77998 7.33342 5.33331 6.88675 5.33331 6.33341C5.33331 5.78008 5.77998 5.33341 6.33331 5.33341ZM9.66665 8.66675C10.22 8.66675 10.6666 9.11341 10.6666 9.66675C10.6666 10.2201 10.22 10.6667 9.66665 10.6667C9.11331 10.6667 8.66665 10.2201 8.66665 9.66675C8.66665 9.11341 9.11331 8.66675 9.66665 8.66675Z"
						fill="currentColor"
					/>
				</svg>
				Voucher
			</a>
		</nav>
	</aside>

	<div id="content">
		{@render children()}
	</div>
</div>

<style>
	header {
		color: white;
		background-color: #3c6dd7;

		display: flex;
		justify-content: space-between;
		align-items: center;

		height: 60px;
		/* width: 100vw; */
		padding: 8px 24px;
		grid-column: 1 / 3;
		box-shadow: var(--basic-shadow);
	}

	.header-right {
		width: 120px;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		display: flex;
		gap: 80px;
	}

	.logo p {
		font-size: 24px;
		font-weight: 600;
		line-height: 1;
	}

	aside {
		background-color: white;
		padding: 20px;
		display: flex;
		flex-direction: column;
		grid-column: 1 / 2;
		box-shadow: var(--basic-shadow);
		height: 100%;
	}

	nav {
		display: flex;
		flex-direction: column;
	}

	.nav-button {
		display: flex;
		align-items: center;
		justify-content: start;

		height: 44px;

		text-decoration: none;
		color: black;
	}

	.nav-button:hover {
		background-color: #f5f8ff;
		color: #2718ce;
	}

	.nav-icon {
		margin-right: 8px;
		margin-left: 8px;
	}

	.floating-box {
		display: none;
		position: fixed;
		right: inherit;
		transform: translateX(-100%) translateX(18px);

		width: 400px;
		height: 400px;

		background-color: white;
		box-shadow: var(--basic-shadow);

		padding: 20px;

		z-index: 1;
	}
</style>

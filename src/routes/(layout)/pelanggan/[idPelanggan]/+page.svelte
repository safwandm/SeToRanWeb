<script>
	import { BaseApi } from '$lib/baseApi';
	import { onMount } from 'svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';

	let { data } = $props();
	let nama = $state();
	let email = $state();
	let tanggalLahir = $state();
	let nomorKTP = $state();
	let nomorTelepon = $state();
	let alamat = $state();

	function loadData() {
		BaseApi.ins.fetchAuth(`/api/pelanggan/${data.idPelanggan}`).then(async (res) => {
			const resBody = await res.json();
			console.log(resBody[0]);
			nama = resBody[0].nama;
			email = resBody[0].email;
			tanggalLahir = resBody[0].tanggal_lahir;
			nomorKTP = resBody[0].nomor_KTP;
			nomorTelepon = resBody[0].nomor_telepon;
			alamat = resBody[0].alamat;
		});
	}

	onMount(() => {
		loadData();
	});
	// $inspect(data);
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Detail Pelanggan</title>
</svelte:head>
<h1 class="text-2xl font-medium">Detail Pelanggan</h1>
<Breadcrumb.Root class="mb-5">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link>Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/pelanggan">Pelanggan</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>Detail Pelanggan</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<div class="card">
	<p class="text-xl font-semibold">Informasi Pribadi</p>
	<div class="card-content">
		<form class="flex grow flex-col gap-y-4" action="">
			<div class="input-group">
				<label for="inputNama">Nama Lengkap</label>
				<input type="text" value={nama} name="nama" id="inputNama" />
			</div>
			<div class="input-group">
				<label for="inputEmail">Email</label>
				<input type="email" name="email" id="inputEmail" bind:value={email} readonly />
			</div>
			<div class="input-group">
				<label>Tanggal Lahir</label>
				<input type="date" bind:value={tanggalLahir} readonly />
			</div>
			<div class="input-group">
				<label for="inputNomorTelepon">Nomor Telepon</label>
				<input
					type="tel"
					id="inputNomorTelepon"
					name="nomor_telepon"
					bind:value={nomorTelepon}
					readonly
				/>
			</div>
			<div class="input-group">
				<label for="inputKTP">Nomor KTP</label>
				<input
					type="text"
					pattern="[0-9]{16}"
					id="inputKTP"
					name="nomor_KTP"
					bind:value={nomorKTP}
					readonly
				/>
			</div>
			<div class="input-group">
				<label>Alamat</label>
				<textarea bind:value={alamat} readonly></textarea>
			</div>
		</form>
		<div class="flex w-80 grow-0 justify-center">
			<div class="h-60 w-60 rounded-full bg-black"></div>
		</div>
	</div>
</div>

<style>
	.card {
		background-color: white;
		border-radius: 4px;
		box-shadow: 0px 0px 20px 1px rgba(0, 48, 120, 0.1);
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
	}

	.card-title {
		font-size: 20px;
		font-weight: 600;
	}

	.card-content {
		display: flex;
		gap: 16px;
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}

	select,
	input,
	textarea {
		margin-top: 5px;

		height: 40px;
		width: 100%;

		border: 1px solid #dfdddd;
		border-radius: 4px;

		padding-left: 10px;

		background-color: white;
		color: black;
	}
	select[disabled] {
		background-color: #e9e9ed;
	}
</style>

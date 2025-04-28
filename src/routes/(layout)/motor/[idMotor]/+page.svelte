<script>
	import { Popbox } from '$lib/popbox/popbox';
	import { BaseApi } from '$lib/baseApi';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import * as jqa from 'jquery';
	import { goto } from '$app/navigation';
	const jq = jqa.default;

	let { data } = $props();
	let nama = $state();
	let tahun = $state();
	let transmisi = $state();
	let status = $state();
	let hargaHarian = $state();
	let platNomor = $state();
	let nomorSTNK = $state();
	let nomorBPKB = $state();
	let brand = $state();
	let tipe = $state();

	let popbox;

	async function loadData() {
		await BaseApi.ins.fetchAuth(`/api/generic/motors/${data.idMotor}`).then(async (res) => {
			const resBody = await res.json();

			console.log(resBody);

			nama = resBody.model;
			tahun = resBody.tahun;
			transmisi = resBody.transmisi;
			status = resBody.status_motor;
			hargaHarian = resBody.harga_harian;
			platNomor = resBody.plat_nomor;
			nomorSTNK = resBody.nomor_STNK;
			nomorBPKB = resBody.nomor_BPKB;
			brand = resBody.brand;
			tipe = resBody.tipe;
		});
	}

	onMount(async () => {
		popbox = new Popbox({
			blur: true,
			overlay: true
		});

		await loadData();
	});

	function updateMotor() {
		let missingFields = [];

		if (!nama) missingFields.push('Nama motor.');
		if (!hargaHarian) missingFields.push('Harga harian.');
		if (!platNomor) missingFields.push('Plat nomor.');
		if (!nomorSTNK) missingFields.push('Nomor STNK.');
		if (!nomorBPKB) missingFields.push('Nomor BPKB.');
		if (!brand) missingFields.push('Brand motor.');
		if (!tipe) missingFields.push('Tipe motor.');

		if (missingFields.length > 0) {
			popbox.open('missing-data-popbox');

			jq('#missing-datas').empty();

			missingFields.forEach((message) => {
				jq('#missing-datas').append(`<p>${message}</p>`);
			});

			return;
		}

		BaseApi.ins.putAuth(`/api/generic/motors/${data.idMotor}`, {
			brand: brand,
			harga_harian: hargaHarian,
			model: nama,
			nomor_BPKB: nomorBPKB,
			nomor_STNK: nomorSTNK,
			plat_nomor: platNomor,
			status_motor: status,
			tahun: tahun,
			tipe: tipe,
			transmisi: transmisi
		});
		toast.success('Motor telah di-update');
		goto('/motor');
	}
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Detail Pelanggan</title>
</svelte:head>

<h1 class="text-2xl font-medium">Edit Motor</h1>

<Breadcrumb.Root class="mb-5">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link>Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/motor">Pelanggan</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>Detail Pelanggan</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<div data-popbox-id="missing-data-popbox" class="popbox">
	<div class="popbox_container">
		<div class="card-body">
			<h1>Data Berikut kosong/kurang</h1>
		</div>
		<div id="missing-datas" class="card-body"></div>
	</div>
</div>

<div class="card">
	<p class="text-xl font-semibold">Edit Form</p>
	<div class="card-content">
		<form class="flex grow flex-col gap-y-4">
			<div class="input-group">
				<label for="inputNama">Nama</label>
				<input type="text" name="nama" bind:value={nama} id="inputNama" required />
			</div>

			<div class="input-group">
				<label for="inputTahun">Tahun</label>
				<select bind:value={tahun} name="tahun" id="inputTahun" required>
					{#each Array(2024 - 2000 + 1)
						.fill(0)
						.map((_, i) => 2000 + i) as year}
						<option value={year} selected={year === tahun}>{year}</option>
					{/each}
				</select>
			</div>

			<div class="input-group">
				<label for="inputTransmisi">Transmisi</label>
				<select bind:value={transmisi} name="transmisi" id="inputTransmisi">
					<option value="matic" selected={transmisi === 'matic'}>Matic</option>
					<option value="manual" selected={transmisi === 'manual'}>Manual</option>
				</select>
			</div>

			<div class="input-group">
				<label for="inputStatus">Status</label>
				<select bind:value={status} name="status" id="inputStatus" required>
					<option value="Tersedia" selected={status === 'Tersedia'}>Tersedia</option>
					<option value="Disewa" selected={status === 'Disewa'}>Disewa</option>
					<option value="Dipesan" selected={status === 'Dipesan'}>Dipesan</option>
					<option value="Dalam Perbaikan" selected={status === 'Dalam Perbaikan'}
						>Dalam Perbaikan</option
					>
					<option value="Tidak Tersedia" selected={status === 'Tidak Tersedia'}
						>Tidak Tersedia</option
					>
				</select>
			</div>

			<div class="input-group">
				<label for="inputHargaHarian">Harga Harian</label>
				<input
					type="number"
					name="hargaHarian"
					bind:value={hargaHarian}
					id="inputHargaHarian"
					required
				/>
			</div>

			<div class="input-group">
				<label for="inputPlatNomor">Plat Nomor</label>
				<input type="text" name="platNomor" bind:value={platNomor} id="inputPlatNomor" required />
			</div>

			<div class="input-group">
				<label for="inputSTNK">STNK</label>
				<input type="text" name="stnk" bind:value={nomorSTNK} id="inputSTNK" required />
			</div>

			<div class="input-group">
				<label for="inputBPKB">BPKB</label>
				<input type="text" name="bpkb" bind:value={nomorBPKB} id="inputBPKB" required />
			</div>

			<div class="input-group">
				<label for="inputBrand">Brand</label>
				<input type="text" name="brand" bind:value={brand} id="inputBrand" required />
			</div>

			<div class="input-group">
				<label for="inputTipe">Tipe</label>
				<input type="text" name="tipe" bind:value={tipe} id="inputTipe" required />
			</div>

			<button
				type="button"
				class={buttonVariants({ variant: 'default' })}
				onclick={() => updateMotor()}>Submit</button
			>
		</form>
		<!-- <div class="flex w-80 grow-0 justify-center">
			<div class="h-60 w-60 rounded-full bg-black"></div>
		</div> -->
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

	.popbox_container {
		width: 387px;
		height: auto;

		top: 20%;
		left: 43%;

		padding: 25px 21px;

		border-radius: 4;
		box-shadow: 0px 0px 5px rgba(0, 48, 120, 0.1);

		background-color: white;
	}

	.card-body {
		margin-bottom: 15px;
	}

	.card-body p {
		margin-top: 15px;

		font-size: 16;
		font-weight: 600;
	}
</style>

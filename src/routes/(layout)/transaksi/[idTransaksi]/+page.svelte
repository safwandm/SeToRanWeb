<script>
	import { BaseApi } from '$lib/baseApi';
	import { onMount } from 'svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import { formatStringDate, formatDate, formatRupiah } from '$lib/utilities';

	let { data } = $props();
	let transaksiData = $state({});
	let pelangganData = $state({});
	let pembayaranData = $state({});
	let motorData = $state({});

	function loadTransaksiData() {
		BaseApi.ins.fetchAuth(`/api/transaksi/${data.idTransaksi}`).then(async (res) => {
			const resBody = await res.json();
			transaksiData = resBody.data;
			console.log(transaksiData);
			loadPelangganData();
			loadPembayaranData();
			loadMotorData();
		});
	}

	function loadPelangganData() {
		BaseApi.ins.fetchAuth(`/api/pengguna/${transaksiData.id_pelanggan}`).then(async (res) => {
			const resBody = await res.json();
			pelangganData = resBody;
			console.log(pelangganData);
		});
	}

	function loadPembayaranData() {
		BaseApi.ins
			.fetchAuth(`/api/pembayaran/transaksi/${transaksiData.id_pelanggan}`)
			.then(async (res) => {
				const resBody = await res.json();
				pembayaranData = resBody;
				console.log(pembayaranData);
			});
	}

	function loadMotorData() {
		BaseApi.ins.fetchAuth(`/api/generic/motors/${transaksiData.id_motor}`).then(async (res) => {
			const resBody = await res.json();
			motorData = resBody;
			console.log(motorData);
		});
	}

	onMount(async () => {
		await loadTransaksiData();
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Detail Transaksi</title>
</svelte:head>

<h1 class="text-2xl font-medium">Detail Transaksi</h1>
<Breadcrumb.Root class="mb-5">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link>Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/transaksi">Transaksi</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>Detail Transaksi</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<div class="card">
	<div class="mb-7 flex">
		<div class="w-[50%]">
			<p class="section-heading">Detail Transaksi</p>
			<div class="info">
				<p class="label">ID Transaksi</p>
				<p>{transaksiData.id_transaksi}</p>
			</div>
			<div class="info">
				<p class="label">Status</p>
				<p>
					{transaksiData.status_transaksi == undefined
						? ''
						: formatStringDate(transaksiData.status_transaksi)}
				</p>
			</div>
			<div class="info">
				<p class="label">Tanggal Transaksi</p>
				<p>{transaksiData.created_at}</p>
			</div>
			<div class="info">
				<p class="label">Tanggal Mulai</p>
				<p>
					{transaksiData.tanggal_mulai == undefined
						? ''
						: formatStringDate(transaksiData.tanggal_mulai)}
				</p>
			</div>
			<div class="info">
				<p class="label">Tanggal Selesai</p>
				<p>
					{transaksiData.tanggal_selesai == undefined
						? ''
						: formatStringDate(transaksiData.tanggal_selesai)}
				</p>
			</div>
		</div>
		<div>
			<p class="section-heading">Detail Motor</p>
			<div class="info">
				<p class="label">Model</p>
				<p>{`${motorData.brand} ${motorData.model}`}</p>
			</div>
			<div class="info">
				<p class="label">Harga Harian</p>
				<p>{motorData.harga_harian == undefined ? '' : formatRupiah(motorData.harga_harian)}</p>
			</div>
			<div class="info">
				<p class="label">Durasi</p>
				<p>{`${transaksiData.durasi} Hari`}</p>
			</div>
		</div>
	</div>
	<div class="flex">
		<div class="w-[50%]">
			<p class="section-heading">Detail Pembayaran</p>
			<div class="info">
				<p class="label">ID Pembayaran</p>
				<p>{pembayaranData.id_pembayaran}</p>
			</div>
			<div class="info">
				<p class="label">Status</p>
				<p>{pembayaranData.status_pembayaran}</p>
			</div>
			<div class="info">
				<p class="label">Metode</p>
				<p>{pembayaranData.metode}</p>
			</div>
			<div class="info">
				<p class="label">Nominal</p>
				<p>{pembayaranData.nominal == undefined ? '' : formatRupiah(pembayaranData.nominal)}</p>
			</div>
			<div class="info">
				<p class="label">Tanggal Bayar</p>
				<p>
					{pembayaranData.tanggal_bayar == undefined
						? ''
						: formatStringDate(pembayaranData.tanggal_bayar)}
				</p>
			</div>
		</div>
		<div>
			<p class="section-heading">Detail Pelanggan</p>
			<div class="info">
				<p class="label">ID Pelanggan</p>
				<p>{pelangganData.id_pengguna}</p>
			</div>
			<div class="info">
				<p class="label">Nama</p>
				<p>{pelangganData.nama}</p>
			</div>
			<div class="info">
				<p class="label">Email</p>
				<p>{pelangganData.email}</p>
			</div>
			<div class="info">
				<p class="label">No. Telp</p>
				<p>{pelangganData.nomor_telepon}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.info {
		margin-bottom: 0.5rem;
	}
	.label {
		font-weight: 500;
	}

	.section-heading {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}
</style>

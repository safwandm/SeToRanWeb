<script>
	import { BaseApi } from '$lib/baseApi';
	import { onMount } from 'svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';

	let { data } = $props();
	let transaksiData = $state({});
	let pelangganData = $state({});

	function loadTransaksiData() {
		BaseApi.ins.fetchAuth(`/api/transaksi/${data.idTransaksi}`).then(async (res) => {
			const resBody = await res.json();
			transaksiData = resBody.data;
			console.log(transaksiData);
			loadPelangganData();
		});
	}

	function loadPelangganData() {
		BaseApi.ins.fetchAuth(`/api/pelanggan/${transaksiData.id_pelanggan}`).then(async (res) => {
			const resBody = await res.json();
			console.log(resBody);
			pelangganData = resBody;
			console.log(pelangganData);
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

<div class="card"></div>

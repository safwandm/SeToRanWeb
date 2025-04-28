<script>
	import { Popbox } from '$lib/popbox/popbox';
	import { onMount } from 'svelte';
	import { BaseApi } from '$lib/baseApi';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import * as jqa from 'jquery';
	const jq = jqa.default;

	let popbox;

	var motors = $state([]);
	var motorDetail = $state({
		id: '',
		name: '',
		year: '',
		transmission: '',
		status: '',
		dailyRate: '',
		owner: '',
	});

	var filterObj = $state({
		pencarian: {
			nama: ''
		},
		tahun: '',
		transmisi: '',
		status: '',
		tipePemilik: ''
	});

	function reloadTable() {
		try {
			BaseApi.ins.fetchAuth('/api/generic/motors').then(async (res) => {
				let data = await res.json();
				if (!data) throw new Error('Invalid data structure from API');

				if (filterObj.tahun) {
					data = data.filter((motor) => motor.tahun == filterObj.tahun);
				}
				if (filterObj.transmisi) {
					data = data.filter((motor) => motor.transmisi == filterObj.transmisi);
				}
				if (filterObj.status) {
					data = data.filter((motor) => motor.status_motor == filterObj.status);
				}

				let mitras_res = await BaseApi.ins.fetchAuth('/api/mitras');

				let mitras = await mitras_res.json();

				data = data.map((motor) => {
					let ownerName = mitras.find((mitra) => mitra.id_mitra === motor.id_mitra).pengguna.nama;

					return { ...motor, nama_pemilik: ownerName };
				});

				if (filterObj.pencarian.nama) {
					const regex = new RegExp(filterObj.pencarian.nama, 'i');
					data = data.filter((motor) => regex.test(motor.model));
				}

				motors = data;
			});
		} catch (error) {
			console.error('Failed to fetch motor data:', error.message);
			motors = [];
		}
	}

	$effect(() => {
		filterObj.pencarian.nama, filterObj.tahun, filterObj.transmisi, filterObj.status;

		if (filterObj.pencarian.nama === '') {
			reloadTable();
		} else 		if (filterObj.tahun || filterObj.transmisi || filterObj.status) {
			reloadTable();
		}

		
	});

	onMount(() => {
		popbox = new Popbox({
			blur: true,
			overlay: true
		});

		jq('.filter').click(function (event) {
			if (jq('.filter-dropdown-box').css('display') == 'none') {
				jq('.filter-dropdown-box').toggle();
			}

			event.stopPropagation();
		});

		jq(document).click(function (event) {
			if (
				!jq(event.target).closest('.filter-dropdown-box').length &&
				!jq(event.target).closest('.filter').length
			) {
				jq('.filter-dropdown-box').hide();
			}

			if (!jq(event.target).closest('.popbox_container').length) {
				popbox.close('motor-detail-popbox');
			}
		});

		for (let i = 2000; i <= 2024; ++i) {
			jq('#filter-tahun').append(`
                <option value="${i}">${i}</option>
            `);
		}

		reloadTable();
	});

	function selectMotor(id) {
		for (let motor of motors) {
			if (motor.id_motor === id) motorDetail = motor;
		}

		popbox.open('motor-detail-popbox');
		event.stopPropagation();
	}

	async function deleteMotor(id) {
		try {
			await BaseApi.ins.deleteAuth(`/api/generic/motors/${id}`);
			location.reload();
			toast.success('Motor telah di-hapus');
		} catch (error) {
			console.error('Failed to delete motor:', error);
		}
	}

	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { nonpassive } from 'svelte/legacy';

	function navigateToDetail(motorId) {
		popbox.clear();
		goto(`/motor/${motorId}`);
	}
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Motor Page</title>

	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<!-- <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> -->
	<style>
		/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap'); */

		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			font-family: 'Poppins', sans-serif;
		}

		.filterNsearch-section {
			display: flex;
			position: relative;

			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;
		}

		.filter {
			display: flex;

			align-items: center;

			cursor: pointer;
		}

		.filter img {
			width: 34px;
			height: 33px;
		}

		.filter p {
			font-size: 16;
			font-weight: 500;

			display: inline;
		}

		.filter-dropdown-box {
			position: absolute;
			bottom: -180px;
			/* Position it below the button */
			background-color: white;
			border: 1px solid #ccc;
			border-radius: 4px;

			padding: 10px;
			width: 200px;
			box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
			z-index: 1;
		}

		.filter-dropdown-box select {
			width: 100%;

			margin-bottom: 5px;
		}

		.filterNsearch-section .search-bar {
			display: flex;

			width: 404px;
			height: 46px;

			display: flex;
			align-items: center;

			background-color: white;

			border: 1px solid #ccc;
			border-radius: 24px;

			justify-content: space-between;
		}

		/* Menghilangkan background biru saat mencari */
		input:focus,
		textarea:focus {
			background-color: inherit;
			box-shadow: none;
		}

		.search-bar .search-field {
			width: 100%;

			border: none;

			outline: none;

			margin-left: 10px;
			padding-left: 10px;
		}

		.search-field:focus {
			width: 100%;

			border: none;

			margin-left: 10px;
			padding-left: 10px;
		}

		.search-bar .search-button {
			width: 54px;
			height: 100%;

			background-color: #007cff;

			display: flex;

			justify-content: center;
			align-items: center;

			border: none;
			border-radius: 24px;

			cursor: pointer;
		}

		table {
			width: 100%;
			border-collapse: collapse;
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

		.label {
			display: inline-block;
			width: 120px;
			font-weight: bold;
		}

		input,
		select {
			background-color: white;
			color: black;
		}
	</style>
</svelte:head>

<div data-popbox-id="motor-detail-popbox" class="popbox">
	<div class="popbox_container">
		<div class="card-body">
			<p id="motor-detail-id"><span class="label">ID:</span> {motorDetail.id_motor}</p>
			<p id="motor-detail-nama"><span class="label">Nama:</span> {motorDetail.model}</p>
			<p id="motor-detail-tahun"><span class="label">Tahun:</span> {motorDetail.tahun}</p>
			<p id="motor-detail-transmisi">
				<span class="label">Transmisi:</span>
				{motorDetail.transmisi}
			</p>
			<p id="motor-detail-status"><span class="label">Status:</span> {motorDetail.status_motor}</p>
			<p id="motor-detail-harga">
				<span class="label">Harga Harian:</span>
				{motorDetail.harga_harian}
			</p>

			<p id="motor-detail-plat-nomor">
				<span class="label">Plat Nomor:</span>
				{motorDetail.plat_nomor}
			</p>
			<p id="motor-detail-stnk"><span class="label">Nomor STNK:</span> {motorDetail.nomor_STNK}</p>
			<p id="motor-detail-bpkb"><span class="label">Nomor BPKB:</span> {motorDetail.nomor_BPKB}</p>
			<p id="motor-detail-brand"><span class="label">Brand:</span> {motorDetail.brand}</p>
			<p id="motor-detail-tipe"><span class="label">Tipe:</span> {motorDetail.tipe}</p>
		</div>
		<div class="card-body">
			<button
				class={buttonVariants({ variant: 'default' })}
				style="background-color: #f44336;"
				onclick={() => deleteMotor(motorDetail.id_motor)}>Hapus</button
			>
			<button
				class={buttonVariants({ variant: 'default' })}
				style="background-color: #f4a62b;"
				onclick={() => navigateToDetail(motorDetail.id_motor)}>Edit</button
			>
		</div>
	</div>
</div>

<h1 class="text-2xl font-medium">Motor</h1>
<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link>Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>Motor</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<div class="content">
	<div class="filterNsearch-section">
		<div class="filter">
			<img src="src/lib/assets/icons/ic_outline-filter-alt.png" alt="" />
			<p id="filter-chosen">Filter</p>
		</div>

		<form class="filter-dropdown-box" style="display: none;">
			<label for="filter-tahun">Tahun</label>
			<select name="tahun" id="filter-tahun" class="filter-options" bind:value={filterObj.tahun}>
				<option value="" selected>None</option>
			</select>

			<label for="filter-tahun">Transmisi</label>
			<select
				name="transmisi"
				id="filter-transmisi"
				class="filter-options"
				bind:value={filterObj.transmisi}
			>
				<option value="" selected>None</option>
				<option value="automatic">Automatic</option>
				<option value="matic">Matic</option>
				<option value="manual">Manual</option>
			</select>

			<label for="filter-tahun">Status</label>
			<select name="status" id="filter-status" class="filter-options" bind:value={filterObj.status}>
				<option value="" selected>None</option>
				<option value="Tersedia">Tersedia</option>
				<option value="Disewa">Disewa</option>
				<option value="Dipesan">Dipesan</option>
				<option value="Dalam Perbaikan">Dalam Perbaikan</option>
				<option value="Tidak Tersedia">Tidak Tersedia</option>
			</select>

			<!-- <label for="filter-pemilik">Tipe Pemilik</label>
			<select
				name="status"
				id="filter-pemilik"
				class="filter-options"
				bind:value={filterObj.tipePemilik}
			>
				<option value="" selected>None</option>
				<option value="Perusahaan">Perusahaan</option>
				<option value="Mitra">Mitra</option>
			</select> -->
		</form>

		<form class="search-bar">
			<input
				bind:value={filterObj.pencarian.nama}
				type="text"
				placeholder="Cari nama motor..."
				name="nama"
				class="search-field"
			/>
			<button class="search-button" onclick={() => reloadTable()}>
				<img src="src/lib/assets/icons/material-symbols_search.png" alt="" class="search-img" />
			</button>
		</form>
	</div>

	<div class="card">
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Nama</th>
					<th>Tahun</th>
					<th>Transmisi</th>
					<th>Status</th>
					<th>Harga Harian</th>
					<th>Pemilik</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each motors as motor}
					<tr>
						<td>{motor.id_motor}</td>
						<td>{motor.model}</td>
						<td>{motor.tahun}</td>
						<td>{motor.transmisi}</td>
						<td>{motor.status_motor}</td>
						<td>{motor.harga_harian}</td>
						<td>{motor.nama_pemilik}</td>
						<td
							><button
								class={buttonVariants({ variant: 'default' })}
								onclick={() => selectMotor(motor.id_motor)}>Detail</button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

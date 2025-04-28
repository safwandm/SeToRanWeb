<script>
	import { backendHost, BaseApi } from '$lib/baseApi';
	import { onMount } from 'svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import * as Tabs from '$lib/components/ui/tabs/index.ts';
	import RangeDatePicker from '$lib/shared/rangeDatePicker.svelte';
	import { toast } from 'svelte-sonner';
	import { formatStringDate } from '$lib/utilities';

	let { data } = $props();
	let nama = $state();
	let email = $state();
	let tanggalLahir = $state();
	let nomorKTP = $state();
	let nomorSIM = $state();
	let nomorTelepon = $state();
	let alamat = $state();
	let avatarsrc = $state('');
	let canEdit = $state(false);

	let transaction = $state([]);

	function loadData() {
		BaseApi.ins.fetchAuth(`/api/pelanggan/${data.idPelanggan}/?expand=true`).then(async (res) => {
			const resBody = await res.json();
			console.log(resBody);
			nama = resBody.nama;
			email = resBody.email;
			tanggalLahir = resBody.tanggal_lahir;
			nomorKTP = resBody.nomor_KTP;
			nomorSIM = resBody.nomor_SIM;
			nomorTelepon = resBody.nomor_telepon;
			alamat = resBody.alamat;
			if (!resBody.id_gambar) {
				avatarsrc = `https://avatar.iran.liara.run/username?username=${nama.replaceAll(' ', '+')}`;
			} else {
				avatarsrc = backendHost + '/api/image/' + resBody.id_gambar;
			}
		});
	}

	function loadTransaksiData() {
		BaseApi.ins
			.fetchAuth(`/api/transaksi/pelanggan/${data.idPelanggan}/?expand=true`)
			.then(async (res) => {
				const resBody = await res.json();
				transaction = resBody;
				console.info(transaction);
			});
	}

	function formHandler(e) {
		e.preventDefault();

		let dataPengguna = {
			nama: nama,
			email: email,
			tanggal_lahir: tanggalLahir,
			nomor_telepon: nomorTelepon,
			nomor_KTP: nomorKTP,
			alamat: alamat
		};

		BaseApi.ins
			.putAuth(`/api/pengguna/${data.idPelanggan}`, dataPengguna)
			.then(async (res) => {
				if (res.ok) {
					loadData();
					canEdit = !canEdit;
					toast.success('Data pelanggan berhasil diubah');
				} else {
					toast.error('Data pelanggan gagal diubah');
				}
			})
			.catch((res) => {
				toast.error('Data pelanggan gagal diubah');
			});
	}

	onMount(() => {
		loadData();
		loadTransaksiData();
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

<Tabs.Root value="informasi-pribadi" class="w-full">
	<Tabs.List>
		<Tabs.Trigger value="informasi-pribadi">Informasi Pribadi</Tabs.Trigger>
		<Tabs.Trigger value="riwayat">Riwayat Transaksi</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="informasi-pribadi">
		<div class="card">
			<p class="text-xl font-semibold">Informasi Pribadi</p>
			<div class="card-content">
				<form class="flex grow flex-col gap-y-4" action="">
					<div class="input-group">
						<label for="inputNama">Nama Lengkap</label>
						<input
							type="text"
							bind:value={nama}
							name="nama"
							id="inputNama"
							{...!canEdit && { readonly: true }}
						/>
					</div>
					<div class="input-group">
						<label for="inputEmail">Email</label>
						<input
							type="email"
							name="email"
							id="inputEmail"
							bind:value={email}
							{...!canEdit && { readonly: true }}
						/>
					</div>
					<div class="input-group">
						<label>Tanggal Lahir</label>
						<input type="date" bind:value={tanggalLahir} {...!canEdit && { readonly: true }} />
					</div>
					<div class="input-group">
						<label for="inputNomorTelepon">Nomor Telepon</label>
						<input
							type="tel"
							id="inputNomorTelepon"
							name="nomor_telepon"
							bind:value={nomorTelepon}
							{...!canEdit && { readonly: true }}
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
							{...!canEdit && { readonly: true }}
						/>
					</div>
					<div class="input-group">
						<label for="inputKTP">Nomor SIM</label>
						<input
							type="text"
							pattern="[0-9]{10}"
							id="inputSIM"
							name="nomor_SIM"
							bind:value={nomorSIM}
							{...!canEdit && { readonly: true }}
						/>
					</div>
					<div class="input-group">
						<label>Alamat</label>
						<textarea bind:value={alamat} {...!canEdit && { readonly: true }}></textarea>
					</div>
					<div class="flex justify-end gap-4">
						<button
							class="btn-secondary"
							type="button"
							onclick={() => (canEdit = !canEdit)}
							{...canEdit && { hidden: true }}>Edit</button
						>
						<button
							class="btn-warning"
							type="button"
							onclick={() => {
								loadData();
								loadTransaksiData();
								canEdit = !canEdit;
							}}
							{...!canEdit && { hidden: true }}>Cancel</button
						>
						<button
							class="btn-action"
							type="submit"
							onclick={formHandler}
							{...!canEdit && { hidden: true }}>Save</button
						>
					</div>
				</form>
				<div class="flex w-80 grow-0 justify-center">
					<div class="h-60 w-60 rounded-full">
						<img src={avatarsrc} alt="avatar" />
					</div>
				</div>
			</div>
		</div>
	</Tabs.Content>
	<Tabs.Content value="riwayat">
		<div class="card">
			<p class="text-xl font-semibold">Riwayat Transaksi</p>
			<div class="card-content">
				<table class="w-full">
					<thead>
						<tr>
							<th>No</th>
							<th>Model</th>
							<th>Start Date</th>
							<th>End Date</th>
							<th>Status</th>
							<th>Nominal</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each transaction as trans, index}
							<tr>
								<td>{index + 1}</td>
								<td>{trans.model}</td>
								<td>{formatStringDate(trans.tanggal_mulai)}</td>
								<td>{formatStringDate(trans.tanggal_selesai)}</td>
								<td>{trans.status_transaksi}</td>
								<td>{trans.nominal}</td>
								<td>
									<a href="/transaksi/{trans.id_transaksi}" class="btn-action">Detail</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div></Tabs.Content
	>
</Tabs.Root>

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

	.btn-warning {
		border: none;
		border-radius: 4px;
		color: white;
		background-color: #f0ad4e;
		font-size: 12px;
		padding: 8px 16px;
	}

	.btn-secondary {
		border: none;
		border-radius: 4px;
		color: white;
		background-color: #6c757d;
		font-size: 12px;
		padding: 8px 16px;
	}

	.btn-action {
		border: none;
		border-radius: 4px;
		color: white;
		background-color: #007cff;
		font-size: 12px;
		padding: 8px 16px;
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

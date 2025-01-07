<script>
	import { onMount } from 'svelte';
	import { BaseApi } from '$lib/baseApi';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';

	let transaction = $state([]);

	function loadTable() {
		BaseApi.ins.fetchAuth('/api/transaksi/aktif').then(async (res) => {
			const data = await res.json();
			transaction = data.data;
			console.log(transaction);
		});
	}

	function formatStringDate(dateString) {
		// asumsi format dari db yyyy-mm-dd hh:mm:ss
		let [date, time] = dateString.split(' ');
		let [year, month, day] = date.split('-');
		return `${day}-${month}-${year}`;
	}

	onMount(() => {
		loadTable();
	});
</script>

<div id="transaksi">
	<div>
		<h1 class="text-2xl font-medium">Transaksi</h1>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link>Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Transaksi</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
	<div class="card" style="width: 100%;">
		<div class="flex flex-row justify-between">
			<p class="card-title">Transaksi Aktif</p>
			<a class="btn-action" href="/transaksi/all">Lihat Semua</a>
		</div>
		<div class="card-content">
			<table id="transaction-table">
				<thead>
					<tr>
						<th>No</th>
						<th>Nama</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{#if transaction.length === 0}
						<tr>
							<td colspan="5" class="text-center">Tidak ada transaksi aktif</td>
						</tr>
					{/if}
					{#each transaction as trans, index}
						<tr>
							<td>{index + 1}</td>
							<td>{trans.nama}</td>
							<td>{formatStringDate(trans.tanggal_mulai)}</td>
							<td>{formatStringDate(trans.tanggal_selesai)}</td>
							<td>
								<a href="/transaksi/{trans.id_transaksi}" class="btn-action">Detail</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	#transaksi {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.breadcrumb {
		display: flex;
		flex-direction: column;
	}

	.breadcrumb-title {
		font-size: 24px;
		color: #00236f;
		font-weight: 500;
	}

	.breadcrumb-path {
		color: #6c6c6c;
	}

	.breadcrumb-current-path {
		color: #4a4a4a;
	}

	.card {
		background-color: white;
		border-radius: 4px;
		box-shadow: 0px 0px 20px 1px rgba(0, 48, 120, 0.1);
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		/* width: 100%; */
	}

	.card-title {
		font-size: 20px;
		font-weight: 600;
	}

	table {
		width: 100%;
	}

	th {
		font-weight: 600;
		font-size: 16px;
		color: #2f2f30;
		text-align: left;
		border-top: 1px solid #dfdddd;
		border-bottom: 1px solid #dfdddd;
		padding: 8px;
	}

	td {
		padding: 12px 8px;
	}

	.btn-action {
		border: none;
		border-radius: 4px;
		color: white;
		background-color: #007cff;
		font-size: 12px;
		padding: 8px 16px;
	}

	.row {
		display: flex;
		gap: 20px;
	}

	#semua-pelanggan-card {
		flex-grow: 2;
	}

	#filter-sort-card {
		flex-grow: 1;
	}

	.input-select {
		display: flex;
		flex-direction: column;
	}

	select {
		padding: 5px;
	}

	select {
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

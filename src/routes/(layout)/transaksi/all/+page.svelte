<script>
	import { onMount } from 'svelte';
	import { BaseApi } from '$lib/baseApi';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import { formatRupiah, formatStringDate } from '$lib/utilities';

	let transaction = $state([]);
	let filteredData = $state([]);

	let filter = $state({
		status: 'all',
		sortBy: 'none',
		order: 'ascending'
	});

	function loadTable() {
		BaseApi.ins.fetchAuth('/api/transaksi').then(async (res) => {
			const data = await res.json();
			console.log(data);
			transaction = data.data;
		});
	}

	function filterData() {
		if (filter.status != 'all') {
			filteredData = transaction.filter((trans) => trans.status_transaksi === filter.status);
		} else {
			filteredData = transaction;
		}

		if (filter.sortBy != 'none') {
			if (filter.sortBy === 'tanggal_mulai') {
				filteredData.sort((a, b) => {
					let dateA = new Date(a.tanggal_mulai).getTime();
					let dateB = new Date(b.tanggal_mulai).getTime();
					return filter.order === 'ascending' ? dateA - dateB : dateB - dateA;
				});
			}

			if (filter.sortBy === 'tanggal_selesai') {
				filteredData.sort((a, b) => {
					let dateA = new Date(a.tanggal_selesai).getTime();
					let dateB = new Date(b.tanggal_selesai).getTime();
					return filter.order === 'ascending' ? dateA - dateB : dateB - dateA;
				});
			}
		}
	}

	$effect(() => {
		filter.status, filter.sortBy, filter.sortBy;

		filterData();
	});

	onMount(() => {
		loadTable();
		filterData();
	});
</script>

<div class="flex flex-col gap-5" id="transaksi">
	<div>
		<h1 class="text-2xl font-medium">Semua Transaksi</h1>
		<Breadcrumb.Root>
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
					<Breadcrumb.Page>All</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
	<div class="flex gap-4">
		<div class="card grow">
			<div class="card-content">
				<table class="w-full">
					<thead>
						<tr>
							<th>No</th>
							<th>Nama</th>
							<th>Model</th>
							<th>Start Date</th>
							<th>End Date</th>
							<th>Status</th>
							<th>Nominal</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredData as trans, index}
							<tr>
								<td>{index + 1}</td>
								<td>{trans.nama}</td>
								<td>{trans.model}</td>
								<td>{formatStringDate(trans.tanggal_mulai)}</td>
								<td>{formatStringDate(trans.tanggal_selesai)}</td>
								<td>{trans.status_transaksi}</td>
								<td>{formatRupiah(trans.nominal)}</td>
								<td>
									<a href="/transaksi/{trans.id_transaksi}" class="btn-action">Detail</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<div class="card h-min w-1/4">
			<div class="card-content">
				<div class="card-title">Filter & Sort</div>
				<div class="card-content">
					<div class="input-select">
						<label for="statusSelect">Status</label>
						<select name="status" id="statusSelect" bind:value={filter.status}>
							<option value="all">All</option>
							<option value="dibuat">Dibuat</option>
							<option value="berlangsung">Berlangsung</option>
							<option value="selesai">Selesai</option>
							<option value="batal">Batal</option>
						</select>
					</div>
					<div class="input-select">
						<label for="sortSelect">Sort By</label>
						<select name="sort" id="sortSelect" bind:value={filter.sortBy}>
							<option value="none">None</option>
							<option value="tanggal_mulai">Tanggal Mulai</option>
							<option value="tanggal_selesai">Tanggal Selesai</option>
							<option value="nominal">Nominal</option>
						</select>
					</div>
					<div class="input-select">
						<label for="orderSelect">Order By</label>
						<select name="order" id="orderSelect" bind:value={filter.order}>
							<option value="ascending">Ascending</option>
							<option value="descending">Descending</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.card-title {
		font-size: 20px;
		font-weight: 600;
	}

	.btn-action {
		border: none;
		border-radius: 4px;
		color: white;
		background-color: #007cff;
		font-size: 12px;
		padding: 8px 16px;
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
</style>

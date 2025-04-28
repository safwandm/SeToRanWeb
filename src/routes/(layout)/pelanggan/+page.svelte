<script>
	import { onMount } from 'svelte';
	import { BaseApi } from '$lib/baseApi';
	import * as jqa from 'jquery';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	const jq = jqa.default;

	let filter = $state({
		status: '',
		sortBy: '',
		order: 'ascending'
	});

	let pelanggan = $state([]);
	let transaction = $state([]);

	function loadTablePelanggan() {
		BaseApi.ins.fetchAuth('/api/pelanggan').then(async (res) => {
			const data = await res.json();
			console.log(data);

			pelanggan = data;
		});

		if (filter.sortBy) {
			if (filter.sortBy === 'username') {
				pelanggan.sort((a, b) => {
					let x = filter.order === 'ascending' ? a : b;
					let y = filter.order === 'ascending' ? b : a;
					return x.nama.localeCompare(y.nama);
				});
			}
		}

		// jq.getJSON('src/lib/json/pelanggan.json', (data) => {
		// 	pelanggan = [];
		// 	data.pelanggan.forEach((pel) => {
		// 		pelanggan.push(pel);
		// 		pelanggan[pelanggan.length - 1].lastActive = parseDate(pel.lastActive);
		// 	});

		// 	if (filter.status) {
		// 		pelanggan = pelanggan.filter((pel) => pel.status === filter.status);
		// 	}

		// 	if (filter.sortBy) {
		// 		if (filter.sortBy === 'lastActive') {
		// 			pelanggan.sort((a, b) => {
		// 				let dateA = a.lastActive;
		// 				let dateB = b.lastActive;
		// 				return filter.order === 'ascending' ? dateA - dateB : dateB - dateA;
		// 			});
		// 		}

		// 		if (filter.sortBy === 'username') {
		// 			pelanggan.sort((a, b) => {
		// 				let x = filter.order === 'ascending' ? a : b;
		// 				let y = filter.order === 'ascending' ? b : a;
		// 				return x.username.localeCompare(y.username);
		// 			});
		// 		}
		// 	}
		// });
	}

	function parseDate(dateString) {
		let [date, time] = dateString.split(' ');
		let [year, month, day] = date.split('-');
		return new Date(year, month - 1, day);
	}

	function formatDate(date) {
		let day = date.getDate().toString().padStart(2, '0');
		let month = (date.getMonth() + 1).toString().padStart(2, '0');
		let year = date.getFullYear();
		return `${day}-${month}-${year}`;
	}

	function formatStringDate(dateString) {
		// asumsi format dari db yyyy-mm-dd hh:mm:ss
		let [date, time] = dateString.split(' ');
		let [year, month, day] = date.split('-');
		return `${day}-${month}-${year}`;
	}

	$effect(() => {
		// ternyata harus di pake variable/prop nya e.g. saat filter.status, filter.sortBy, filter.sortBy berubah code di sini jalan
		filter.status, filter.sortBy, filter.sortBy;

		loadTablePelanggan();
	});

	onMount(() => {
		loadTablePelanggan();
		loadTableActiveTransaction();
	});
</script>

<div id="pelanggan">
	<div>
		<h1 class="text-2xl font-medium">Pelanggan</h1>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link>Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Pelanggan</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
	<div class="row">
		<div class="card" id="semua-pelanggan-card">
			<p class="card-title">Semua Pelanggan</p>
			<div class="card-content">
				<table id="pelanggan-table">
					<thead>
						<tr>
							<th>No</th>
							<th>Nama</th>
							<th>Email</th>
							<th>Nomor Telepon</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each pelanggan as pel, index}
							<tr>
								<td>{index + 1}</td>
								<td>{pel.nama}</td>
								<td>{pel.email}</td>
								<td>{pel.nomor_telepon}</td>
								<td>
									<a class="btn-action" href="/pelanggan/{pel.id_pelanggan}">Detail</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<div class="card" id="filter-sort-card">
			<p class="card-title">Sort</p>
			<div class="card-content">
				<div class="input-select">
					<label for="sortSelect">Sort By</label>
					<select bind:value={filter.sortBy} name="sort" id="sortSelect">
						<option value="">Select</option>
						<option value="lastActive">Last Active</option>
						<option value="username">username</option>
					</select>
				</div>
				<div class="input-select">
					<label for="">Order</label>
					<select bind:value={filter.order} name="Order" id="orderSelect">
						<option value="ascending">Ascending</option>
						<option value="descending">Descending</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	#pelanggan {
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
		height: min-content;
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

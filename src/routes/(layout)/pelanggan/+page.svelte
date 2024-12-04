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
        color: #00236F;
        font-weight: 500;
    }

    .breadcrumb-path {
        color: #6C6C6C;
    }

    .breadcrumb-current-path {
        color: #4A4A4A;
    }

    .card {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0px 0px 20px 1px rgba(0, 48, 120, 0.1);
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
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
        color: #2F2F30;
        text-align: left;
        border-top: 1px solid #DFDDDD;
        border-bottom: 1px solid #DFDDDD;
        padding: 8px;
    }

    td {
        padding: 12px 8px;
    }

    .btn-action {
        border: none;
        border-radius: 4px;
        color: white;
        background-color: #007CFF;
        font-size: 12px;
        padding: 8px 16px;
    }

    .row {
        display: flex;
        gap: 20px;
    }
</style>

<div id="pelanggan">
    <div class="breadcrumb">
        <p class="breadcrumb-title">Pelanggan</p>
        <p class="breadcrumb-path">Home / <span class="breadcrumb-current-path">Pelanggan</span></p>
    </div>
    <div class="row">
        <div class="card">
            <p class="card-title">
                Transaction Active
            </p>
            <div class="card-content">
                <table id="transaction-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Username</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each transaction as trans}
                            <tr>
                                <td>{trans.id}</td>
                                <td>{trans.username}</td>
                                <td>{formatDate(trans.startDate)}</td>
                                <td>{formatDate(trans.endDate)}</td>
                                <td>
                                    <button class="btn-action">Detail</button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="card">
            <p class="card-title">
                Semua Pelanggan
            </p>
            <div class="card-content">
                <table id="pelanggan-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Last Active</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each pelanggan as pel}
                            <tr>
                                <td>{pel.username}</td>
                                <td>{pel.email}</td>
                                <td>{pel.status === 'verified' ? 'Verified' : 'Not Verified'}</td>
                                <td>{formatDate(pel.lastActive)}</td>
                                <td>
                                    <button class="btn-action">Detail</button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card" style="width: 300px; height: fit-content;">
            <p class="card-title">Filter</p>
            <div class="card-content">
                <div class="input-select">
                    <label for="status">Status</label>
                    <select bind:value={filter.status} name="status" id="statusSelect">
                        <option value="">All</option>
                        <option value="verified">Verified</option>
                        <option value="not-verified">Not Verified</option>
                    </select>
                </div>
            </div>
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

<script>
	import { onMount } from 'svelte';
    const jq = globalThis.$
    
    let filter = $state({
        status: '',
        sortBy: '',
        order: 'ascending',
    })

    let pelanggan = $state([]);
    let transaction = $state([]);

    function loadTablePelanggan() {
        jq.getJSON('src/lib/json/pelanggan.json', (data) => {
            pelanggan = [];
            data.pelanggan.forEach(pel => {
                pelanggan.push(pel);
                pelanggan[pelanggan.length - 1].lastActive = parseDate(pel.lastActive);
            })

            if (filter.status) { pelanggan = pelanggan.filter(pel => pel.status === filter.status) };

            if (filter.sortBy) {
                if (filter.sortBy === 'lastActive') {
                    pelanggan.sort((a, b) => {
                        let dateA = a.lastActive;
                        let dateB = b.lastActive;
                        return (filter.order === 'ascending' ? dateA - dateB : dateB - dateA);
                    })
                }

                if (filter.sortBy === 'username') {
                    pelanggan.sort((a, b) => {
                        let x = (filter.order === 'ascending' ? a : b);
                        let y = (filter.order === 'ascending' ? b : a);
                        return x.username.localeCompare(y.username);
                    })
                }
            }
        })
    }

    function loadTableActiveTransaction() {
        jq.getJSON('src/lib/json/transaction.json', (data) => {
            data.transaction.forEach(trans => {
                transaction.push(
                    {
                        id: trans.id,
                        username: trans.username,
                        startDate: parseDate(trans.startDate),
                        endDate: parseDate(trans.endDate),
                    }
                )
            })
        })
    }

    function parseDate(dateString) {
        let [day, month, year] = dateString.split('-');
        return new Date(year, month - 1, day);
    }

    function formatDate(date) {
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    $effect(() => {
        // ternyata harus di pake variable/prop nya e.g. saat filter.status, filter.sortBy, filter.sortBy berubah code di sini jalan
        filter.status, filter.sortBy, filter.sortBy

        loadTablePelanggan()
    })

    onMount(() => {
        loadTablePelanggan()
        loadTableActiveTransaction()
    })
</script>
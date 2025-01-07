<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
  
    
    <style>
        .btn-action {
            height: 34px;
            width: 68px;
        }

        .cardSide, .filter-section {
            padding: 16px;
            margin-left: 16px;
            width: 250px;
        }

        .btn-filter {
            height: 34px;
            width: 218px;
        }

        .btn-vDetail{
            height: 34px;
            width: 80px;
            background-color: grey;
            border-radius: 4px;
            color: white;
        }

        .search-field{
            width: 100%;
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background-color: white;
        }
    </style>
    <title>Mitra Page</title>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import { BaseApi } from '$lib/baseApi';
    import * as jqa from 'jquery'
	import { get } from 'svelte/store';
	import { base } from '$app/paths';
    const jq = jqa.default

    let dataMitra = $state([]);
    let mitraList = $state([]);
    let selectedStatus = $state('');
    let selectedMitra = $state({});
    let motors = $state([]);
    let username = $state('');
    let transaction = $state([]);

    var filterObj = $state({
        "username": "",
        "status": "",
    })

    onMount(() => {
        BaseApi.ins.fetchAuth('/api/mitras-motor').then(async (res) => {
            let data = await res.json();
            dataMitra = data;
            mitraList = data;
            filterMitra();
        });
    });
 
    $effect(() => {
        if (filterObj.username === "") {
            filterMitra();
        }
    })

    async function selectMitra(mitraId) {
    selectedMitra = dataMitra.find(mitra => mitra.id_mitra === mitraId);

    const motorData = await BaseApi.ins.fetchAuth(`/api/generic/motors?mitraId=${mitraId}`).then(res => res.json());

    motors = await Promise.all(motorData.filter(motor => motor.id_mitra === mitraId).map(async (motor) => {
        let totalHarga = 0;

        const transaction = await BaseApi.ins.fetchAuth(`/api/transaksi/motor/${motor.id_motor}`).then(res => res.json());

        if (transaction && transaction.data) {
            for (let i = 0; i < transaction.data.length; i++) {
                totalHarga += parseFloat(transaction.data[i].nominal);  
            }
        }
        return {
            ...motor,
            total_harga: totalHarga
        };
    }));

    console.log(motors); 

    jq('.mitra-section').hide();
    jq('.filter-section').hide();
    jq('.motor-section').show();
    jq('.details-section').hide();
}


    function goBack() {
        jq('.mitra-section').show();
        jq('.filter-section').show();
        jq('.details-section').hide();
        jq('.motor-section').hide();
    }

    function selectMotor(mitraId) {
        selectedMitra = dataMitra.find(mitra => mitra.id_mitra === mitraId);

        jq('.mitra-section').hide();
        jq('.filter-section').hide();
        jq('.details-section').hide();
        jq('.motor-section').show();
    }

    function filterMitra() {
        let filtered = dataMitra;

        if (filterObj.status) {
            filtered = filtered.filter(item => item.status.toLowerCase() === filterObj.status.toLowerCase());
        }

        const regex = new RegExp(filterObj.username, 'i');
        filtered = filtered.filter(mitra => 
            regex.test(mitra.pengguna.nama) || regex.test(mitra.id_mitra.toString())
        );

        mitraList = filtered;
    }

    function handleFilterChange() {
        filterMitra(); 

    }

    function getTransaction(idMotor) {
        BaseApi.ins.fetchAuth(`/api/transaksi/motor/${idMotor}`).then(async (res) => {
            let transaction = await res.json();
            console.log(transaction);
        });
    }

</script>

<div>
    <h2>Mitra</h2>
    <div class="breadcrumb">
        <p>Home / <b>Mitra</b></p>
    </div>
    <div style="display: flex;">
        <div class="card mitra-section" style="width: 100%;">
            <h3>Mitra List</h3>
            <table style="width: 100%;">
                <thead>
                    <tr>
                        <th>Mitra ID</th>
                        <th>Username</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each mitraList as mitra}
                        <tr data-id="{mitra.id_mitra}">
                            <td>{mitra.id_mitra}</td>
                            <td>{mitra.pengguna.nama}</td>
                            <td>{mitra.jumlah_motor}</td>
                            <td>{mitra.status}</td>
                            <td style="text-align: center;"> <span>
                                <button onclick={() => selectMitra(mitra.id_mitra)} class="btn-action">More</button>
                            </span>
                            
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="card filter-section">
            <h3>Filter</h3>
            <label for="statusMitra" style="display: flex;">Status Mitra</label>
            <select bind:value={filterObj.status} id="statusMitra" style="width: 100%; padding: 5px; margin-top: 10px; margin-bottom: 20px; border-radius: 4px; border: 1px solid #ccc; background-color:#cccc;">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            <h3>Search</h3>
            <form class="search-bar">
                <input bind:value={filterObj.username} type="text" placeholder="Search..." name="nama" class="search-field">
                <div class="search-button">
                    <img src="src/lib/assets/icons/material-symbols_search.png" alt="" class="search-img">
                </div>
            </form>
            <button onclick={handleFilterChange} class="btn-action" style="margin-top: 10px; width: 100%;">Search</button>
        </div>
    </div>

    <div class="details-section card" style="display: none;">
        <h3>Mitra Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 8px;">Mitra</th>
                    <th style="text-align: left; padding: 8px;">Information</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Mitra ID</td>
                    <td style="padding: 8px;">{selectedMitra.id_mitra}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Username</td>
                    <td style="padding: 8px;">{selectedMitra.pengguna?.nama}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Alamat</td>
                    <td style="padding: 8px;">{selectedMitra.pengguna?.alamat}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Email</td>
                    <td style="padding: 8px;">{selectedMitra.pengguna?.email}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Phone Number</td>
                    <td style="padding: 8px;">{selectedMitra.pengguna?.nomor_telepon}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Vehicle</td>
                    <td style="padding: 8px;">
                        <span>{selectedMitra.jumlah_motor}</span>
                        <button onclick={() => selectMotor(selectedMitra.id_mitra)} class="btn-vDetail">View</button>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Status</td>
                    <td style="padding: 8px;">{selectedMitra.status}</td>
                </tr>
            </tbody>
        </table>
        <button onclick={goBack} class="btn-action btn-back" style="margin-top: 20px;">Back</button>
    </div>

    <div class="motor-section card" style="display: none;">
            <h3>Motors</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Motor ID</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Tahun</th>
                    <th>Tipe</th>
                    <th>Transmisi</th>
                    <th>Plat Nomor</th>
                    <th>Status</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {#each motors as motor}
                    <tr>
                        <td>{motor.id_motor}</td>
                        <td>{motor.brand}</td>
                        <td>{motor.model}</td>
                        <td>{motor.tahun}</td>
                        <td>{motor.tipe}</td>
                        <td>{motor.transmisi}</td>
                        <td>{motor.plat_nomor}</td>
                        <td>{motor.status_motor}</td>
                        <td>{motor.total_harga}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <button onclick={goBack} class="btn-action btn-back" style="margin-top: 20px;">Back</button>
        </div>
</div>
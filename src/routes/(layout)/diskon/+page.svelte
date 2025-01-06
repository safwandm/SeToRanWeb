<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <style>
        .btn-action {
            height: 34px;
            width: 68px;
        }

        .btn-tambah {
            height: 34px;
            width: 68px;
        }

        .content-container {
            display: flex;
            gap: 20px;
        }

        .main-content {
            flex-grow: 2;
        }

        .sidebar {
            width: 250px;
        }

        table {
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f8f9fa;
        }

        div[data-popbox-id="tambah-diskon"] div {
            width: fit-content;
            height: fit-content;
            padding: 30px;
            position: relative;
        }

        .diskon-form {
            display: flex;
            flex-direction: column;
            justify-content: start;
            margin-top: 20px;
        }

        .diskon-input {
            height: 40px;
            width: 360px;
            border: 1px solid #DFDDDD;
            border-radius: 4px;
            margin-top: 5px;
            margin-bottom: 5px;
        }

        .close-button {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            font-size: 20px;
            background: none;
            border: none;
            padding: 5px;
        }

        .close-button:hover {
            color: #666;
        }

        .select-status {
            height: 40px;
            width: 360px;
            border: 1px solid #DFDDDD;
            border-radius: 4px;
            margin-top: 5px;
            margin-bottom: 5px;
            padding: 0 10px;
        }
    </style>
    <title>Diskon</title>
</svelte:head>

<script>
    import { Popbox } from "$lib/popbox/popbox";
    import { onMount } from "svelte";
    import * as jqa from 'jquery';
    import { BaseApi } from "$lib/baseApi";
    
    const jq = jqa.default;
    let popboxInstance;

    let diskonData = $state([]);
    let diskonDataShow = $state([]);
    let statusFilter = $state('');
    let nextId = $state(11); // Starting from 11 since there are already 10 diskons

    function filterData(statusFilter) {
        if (statusFilter !== '') {
            diskonDataShow = diskonData.filter(item =>
                item.statusPromo === statusFilter
            );
        } else {
            diskonDataShow = diskonData;
        }
    }

    $effect(() => {
        filterData(statusFilter);
    });

    function openPopBox() {
        // Clear form
        jq('input#nama').val('');
        jq('select#status').val('Aktif');
        jq('input#tgl-mulai').val('');
        jq('input#tgl-akhir').val('');

        if (popboxInstance) {
            popboxInstance.open('tambah-diskon');
        }
    }

    function closePopBox() {
        if (popboxInstance) {
            popboxInstance.close('tambah-diskon');
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const newDiskon = {
            id: nextId,
            nama: jq('input#nama').val(),
            status_promo: jq('select#status').val(),
            tanggal_mulai: jq('input#tgl-mulai').val(),
            tanggal_akhir: jq('input#tgl-akhir').val()
        };

        BaseApi.ins.postAuth('/api/diskon', newDiskon).then(async res => {
            if (res.ok) {
                // Increment nextId for the next submission
                nextId++;
                // Refresh the data
                loadDiskonData();
                // Close the popbox
                closePopBox();
            } else {
                console.error('Gagal menambahkan diskon');
            }
        }).catch(res => {
            console.error('Error menambahkan Diskon:', res);
        });
        // try {
        //     const response = await BaseApi.ins.fetchAuth('/api/diskon', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(newDiskon)
        //     });

        //     if (response.ok) {
        //         // Increment nextId for the next submission
        //         nextId++;
        //         // Refresh the data
        //         loadDiskonData();
        //         // Close the popbox
        //         closePopBox();
        //     } else {
        //         console.error('Failed to add diskon');
        //     }
        // } catch (error) {
        //     console.error('Error adding diskon:', error);
        // }
    }

    async function loadDiskonData() {
        try {
            const response = await BaseApi.ins.fetchAuth('/api/diskon');
            const data = await response.json();
            diskonData = data.data;
            diskonDataShow = diskonData;
        } catch (error) {
            console.error('Error loading diskon data:', error);
        }
    }

    onMount(() => {
        loadDiskonData();
        popboxInstance = new Popbox();
    });

    function formatStringDate(dateString) {
        const [datePart] = dateString.split('T');
        if (datePart) {
            const [year, month, day] = datePart.split('-');
            return `${day}-${month}-${year}`;
        }
        return "Invalid input format";
    }
</script>

<div class="breadcrumb">
    <h2>Diskon</h2>
    <p>Home / <b>Diskon</b></p>
</div>

<div class="content-container">
    <div class="main-content card">
        <h3>Daftar Diskon</h3>
        <table style="width: 100%;">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama Promo</th>
                    <th>Status Promo</th>
                    <th>Tgl Mulai</th>
                    <th>Tgl Akhir</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody id="diskonTableBody">
                {#each diskonData as item}
                    <tr>
                        <td>{item.id}</td>
                        <td>{item.nama}</td>
                        <td>{item.status_promo}</td>
                        <td>{formatStringDate(item.tanggal_mulai)}</td>
                        <td>{formatStringDate(item.tanggal_akhir)}</td>
                        <td style="text-align: center;">
                            <button class="btn-action">Detail</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="sidebar card">
        <h3>Filter</h3>
        <label for="statusPromo">Status Promo</label>
        <select bind:value={statusFilter} id="statusPromo"
            style="width: 100%; padding: 5px; margin-top: 10px; margin-bottom: 20px; border-radius: 4px; border: 1px solid #ccc;">
            <option value="">Select</option>
            <option value="Aktif">Aktif</option>
            <option value="Non Aktif">Non Aktif</option>
        </select>
        <button onclick={openPopBox} class="btn-action btn-tambah" style="width: 100%;">Tambah Diskon</button>
    </div>

    <div data-popbox-id="tambah-diskon" class="popbox">
        <div class="popbox_container">
            <button class="close-button" onclick={closePopBox}>&times;</button>
            <h3>Tambah diskon</h3>
            <form class="diskon-form">
                <label for="nama">Nama promo</label>
                <input class="diskon-input" type="text" id="nama" required>
                
                <label for="status">Status promo</label>
                <select class="select-status" id="status" required>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non Aktif</option>
                </select>
                
                <label for="tgl-mulai">Tanggal mulai</label>
                <input class="diskon-input" type="date" id="tgl-mulai" required>
                
                <label for="tgl-akhir">Tanggal akhir</label>
                <input class="diskon-input" type="date" id="tgl-akhir" required>
                
                <div class="flex-center" style="width: 100%;">
                    <button type="submit" class="btn-action" onclick={handleSubmit}>Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>
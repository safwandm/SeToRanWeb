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
    </style>
    <title>Diskon</title>
</svelte:head>

<script>
	import { Popbox } from "$lib/popbox/popbox";
	import { onMount } from "svelte";
    import * as jqa from 'jquery'
	import { BaseApi } from "$lib/baseApi";
    const jq = jqa.default

    let diskonData = $state([]) // Store the data globally
    let diskonDataShow = $state([]); 

    let statusFilter = $state('')

    // Function to filter data
    function filterData(statusFilter) {
        if (statusFilter !== '') {
            diskonDataShow = diskonData.filter(item =>
                item.statusPromo === statusFilter
            );
        } else {
            diskonDataShow = diskonData
        }
    }

    $effect(() => {
        console.log(statusFilter)
        filterData(statusFilter)
    })

    function openPopBox() {
        jq('input#id').val('')
        jq('input#nama').val('')
        jq('input#status').val('')
        jq('input#tgl-mulai').val('')
        jq('input#tgl-akhir').val('')

        popbox.open('tambah-diskon')
    }

    function handleSubmit(event) {
        event.preventDefault()
        popbox.close('tambah-diskon')

        diskonData.push({
            id: jq('input#id').val(),
            namaPromo: jq('input#nama').val(),
            statusPromo: jq('input#status').val(),
            tglMulai: jq('input#tgl-mulai').val(),
            tglAkhir: jq('input#tgl-akhir').val()
        })
        diskonDataShow = diskonData

        popbox.close('tambah-diskon')
    }

    function loadDiskonData(){
        BaseApi.ins.fetchAuth('/api/diskon').then(async (res) => {
            const data = await res.json();
            console.log(data);
            diskonData = data.data;
        });
    }
    onMount(() => {
		loadDiskonData();
	});

    function formatStringDate(dateString) {
		const [datePart] = dateString.split('T');
        if (datePart) {
        const [year, month, day] = datePart.split('-');
        return `${day}-${month}-${year}`;
        }
        return "Invalid input format";
	}
    // let popbox
    // onMount(function () {
    //     popbox = new Popbox({
    //         blur:true,
    //         overlay:true,
    //     });

    //     // Load the JSON data
    //     jq.getJSON('src/lib/json/diskon.json', function (data) {
    //         diskonData = data.diskon; // Store the data for later use
    //         diskonDataShow = diskonData
    //     });

    //     // Add event listener for filter
    //     document.getElementById('statusPromo').addEventListener('change', filterData);

    //     // Add event listener for detail buttons
    //     document.addEventListener('click', function (e) {
    //         if (e.target.classList.contains('btn-action')) {
    //             const row = e.target.closest('tr');
    //             if (row) {
    //                 const id = row.cells[0].textContent;
    //                 console.log('Detail clicked for ID:', id);
    //                 // Add detail view logic here
    //             }
    //         }
    //     });

    //     // Add event listener for Tambah Diskon button
    //     const tambahDiskonButton = document.querySelector('.btn-tambah');
    //     if (tambahDiskonButton) {
    //         tambahDiskonButton.addEventListener('click', function () {
    //             console.log('Tambah Diskon clicked');
    //             // New discount logic here
    //         });
    //     }
    // });
</script>

<div class="breadcrumb">
    <h2>Diskon</h2>
    <p>Home / <b>Diskon</b></p>
</div>

<div class="content-container">
    <!-- Main Content for Diskon Page -->
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
                <!-- Table content will be populated by JavaScript -->
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

    <!-- Sidebar Filter -->
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
            <h3>Tambah diskon</h3>
            <form class="diskon-form">
                <label for="id">ID diskon</label>
                <input class="diskon-input" type="text" value="" id="id" required>
                <label for="id">Nama promo</label>
                <input class="diskon-input" type="text" value="" id="nama">
                <label for="id">Status promo</label>
                <input class="diskon-input" type="text" value="" id="status">
                <label for="id">Tanggal mulai</label>
                <input class="diskon-input" type="text" value="" id="tgl-mulai">
                <label for="id">Tanggal akhir</label>
                <input class="diskon-input" type="text" value="" id="tgl-akhir">
                <div class="flex-center" style="width: 100%;">
                    <button class="btn-action" onclick={handleSubmit}>Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>


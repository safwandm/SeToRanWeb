<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Motor Page</title>

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> -->
    <style>
        /* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap'); */

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        header {
            grid-column: 1 / 3;
            background-color: #3C6DD7;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0px 0px 20px rgba(0, 48, 120, 0.1);
        }

        .logo {
            display: flex;
            gap: 80px;
        }

        .logo p {
            font-size: 24px;
            font-weight: 600;
            line-height: 1;
        }

        .selected {
            background-color: #E3F2FD;
            color: #3C6DD7;
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

        .search-bar .search-button {
            width: 54px;
            height: 100%;

            background-color: #007CFF;

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

        .action-button {
            /* background-color: #3C6DD7;
            color: white;
            border: none;
            border-radius: 4px; */
            padding: 6px 12px;
            cursor: pointer;
        }

        .popbox_container {
            width: 387px;
            height: 600px;

            top: 20%;
            left: 43%;

            padding: 25px 21px;

            border-radius: 4;
            box-shadow: 0px 0px 5px rgba(0, 48, 120, 0.1);

            background-color: white;
        }

        .card-head {
            display: flex;

            justify-content: center;
            align-items: center;
        }

        .card-head .arrow {
            font-size: 30px;
        }

        .card-head .img-container {
            width: 277px;
            height: 157px;
            margin-right: 5px;
            margin-left: 5px;
            position: relative;
            border: none;
            border-radius: 4px;
            box-shadow: 0px 0px 5px rgba(0, 48, 120, 0.1);
            background-color: white;
            overflow: hidden;
        }

        .card-body {
            margin-top: 42px;
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

        .img-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    </style>
</svelte:head>

<!-- <script>
    import { Popbox } from '$lib/popbox/popbox';
    import { onMount } from 'svelte';
    import { BaseApi } from '$lib/baseApi';
    import * as jqa from 'jquery'
    const jq = jqa.default

    let popbox;

    // States
    var motorImages = $state([])
    var motors = $state([])
    var motorDetail = $state({
        id: "",
        name: "",
        year: "",
        transmission: "",
        status: "",
        dailyRate: "",
        owner: "",
        motorImg: ""
    })

    var filterObj = $state({
        "pencarian": {
            "nama": ""
        },
        "tahun": "2019",
        "transmisi": "",
        "status": "",
        "tipePemilik": ""
    })

    var test = fetchMotors();

    // Fetch motors from API
    async function fetchMotors() {
        try {
            // var data;
            BaseApi.ins.fetchAuth('/api/motors').then(async (res) => {
                const data = await res.json();
                if (!data) throw new Error("Invalid data structure from API");
                motors = data
                motorImages = data.map((motor) => motor.motorImg || "");
                return data

            });


        } catch (error) {
            console.error("Failed to fetch motor data:", error.message);
            motors = [];
        }
    }

    function reloadTable() {
        let filteredMotors = [...motors];

        if (filterObj.tahun) {
            filteredMotors = filteredMotors.filter(motor => motor.tahun == filterObj.tahun);
        }
        if (filterObj.transmisi) {
            filteredMotors = filteredMotors.filter(motor => motor.transmisi == filterObj.transmisi);
        }
        if (filterObj.status) {
            filteredMotors = filteredMotors.filter(motor => motor.status_motor == filterObj.status);
        }
        // if (filterObj.tipePemilik) {
        //     filteredMotors = filteredMotors.filter(motor => 
        //         filterObj.tipePemilik === "Perusahaan" ? motor.owner === "Perusahaan" : motor.owner !== "Perusahaan"
        //     );
        // }
        if (filterObj.pencarian.nama) {
            const regex = new RegExp(filterObj.pencarian.nama, "i");
            filteredMotors = filteredMotors.filter(motor => regex.test(motor.model));
        }

        motors = filteredMotors;
    }

    $effect(() => {
        // dependency harus ditulis/dipake biar setiap value berubah fungsi ini jalan
        filterObj.pencarian.nama, filterObj.tahun, filterObj.transmisi, filterObj.status, filterObj.tipePemilik;
        
        // reloadTable();
    })

    onMount(async () => {
        popbox = new Popbox({
            blur:true,
            overlay:true,
        });
        await fetchMotors();

        jq('.filter').click(function (event) {
            if (jq('.filter-dropdown-box').css('display') == 'none') {
                jq('.filter-dropdown-box').toggle();
            }

            event.stopPropagation();
        })

        jq(document).click(function (event) {
            if (!jq(event.target).closest('.filter-dropdown-box').length && !jq(event.target).closest('.filter').length) {
                jq('.filter-dropdown-box').hide()
            }

            if (!jq(event.target).closest('.popbox_container').length) {
                popbox.close('motor-detail-popbox')
            }
        })

        for (let i = 2000; i <= 2024; ++i) {
            jq('#filter-tahun').append(`
                <option value="${i}">${i}</option>
            `)
        }

        reloadTable();
    });

    function selectMotor(id) {
        // motorDetail = motors.find(motor => motor.id_motor === id) || {};
        popbox.open('motor-detail-popbox');

        // for (let motor of motors) {
        //     if (motor.id === id)
        //         motorDetail = motor
        // }

        popbox.open('motor-detail-popbox')

        event.stopPropagation()
    }
</script> -->

<script>
    import { Popbox } from '$lib/popbox/popbox';
    import { onMount } from 'svelte';
    import { BaseApi } from '$lib/baseApi';
    import * as jqa from 'jquery'
    const jq = jqa.default

    let popbox
    
    var motorImages = $state([])
    var motors = $state([])
    var motorDetail = $state({
        id: "",
        name: "",
        year: "",
        transmission: "",
        status: "",
        dailyRate: "",
        owner: "",
        motorImg: ""
    })

    var filterObj = $state({
        "pencarian": {
            "nama": ""
        },
        "tahun": "",
        "transmisi": "",
        "status": "",
        "tipePemilik": ""
    })

    function reloadTable() {

        try {
            // var data;
            BaseApi.ins.fetchAuth('/api/motors').then(async (res) => {
                let data = await res.json();
                if (!data) throw new Error("Invalid data structure from API");

                if (filterObj.tahun) {
                    data = data.filter(motor => motor.tahun == filterObj.tahun);
                }
                if (filterObj.transmisi) {
                    data = data.filter(motor => motor.transmisi == filterObj.transmisi);
                }
                if (filterObj.status) {
                    data = data.filter(motor => motor.status_motor == filterObj.status);
                }
                if (filterObj.tipePemilik) {
                    data = data.filter(motor => 
                        filterObj.tipePemilik === "Perusahaan" ? motor.nama_pemilik === "SeToRan" : motor.owner !== "SeToRan"
                    );
                }


                let mitras_res = await BaseApi.ins.fetchAuth('/api/mitras');

                let mitras = await mitras_res.json()

                data = data.map(motor => {

                    let ownerName = mitras.find(mitra => mitra.id_mitra === motor.id_mitra).pengguna.nama;

                    return {...motor, 'nama_pemilik': ownerName}

                })

                if (filterObj.pencarian.nama) {
                    const regex = new RegExp(filterObj.pencarian.nama, "i");
                    data = data.filter(motor => regex.test(motor.model));
                }

                motors = data;

            });

        } catch (error) {
            console.error("Failed to fetch motor data:", error.message);
            motors = [];
        }
    }

    $effect(() => {
        // dependency harus ditulis/dipake biar setiap value berubah fungsi ini jalan
        filterObj.pencarian.nama, filterObj.tahun, filterObj.transmisi, filterObj.status, filterObj.tipePemilik;
        
        reloadTable()
    })

    onMount(() => {
        popbox = new Popbox({
            blur:true,
            overlay:true,
        });

        jq('.filter').click(function (event) {
            if (jq('.filter-dropdown-box').css('display') == 'none') {
                jq('.filter-dropdown-box').toggle();
            }

            event.stopPropagation()
        })

        jq(document).click(function (event) {
            if (!jq(event.target).closest('.filter-dropdown-box').length && !jq(event.target).closest('.filter').length) {
                jq('.filter-dropdown-box').hide()
            }

            if (!jq(event.target).closest('.popbox_container').length) {
                popbox.close('motor-detail-popbox')
            }
        })

        for (let i = 2000; i <= 2024; ++i) {
            jq('#filter-tahun').append(`
                <option value="${i}">${i}</option>
            `)
        }

        reloadTable();
    })

    // Karena btn-action ditambahkan secara dinamis. Click event listener harus ditambah ken element yang ada
    function selectMotor (id) {

        for (let motor of motors) {
            if (motor.id === id)
                motorDetail = motor
        }

        popbox.open('motor-detail-popbox')

        event.stopPropagation()
    };

    async function deleteMotor(id) {
        try {
            await BaseApi.ins.deleteAuth(`/api/motors/${id}`);
            location.reload()
        } catch (error) {
            console.error("Failed to delete motor:", error);
        }
    }

</script>


<div data-popbox-id="motor-detail-popbox" class="popbox">
    <div class="popbox_container">
        <div class="card-head">
            <button class="btn-action action-button" style="background-color: #f44336;" onclick={() => deleteMotor(motorDetail.id_motor)}>Hapus Motor</button>
        </div>

        <div class="card-body">
            <p id="motor-detail-id"><span class="label">ID:</span>  {motorDetail.id_motor}</p>
            <p id="motor-detail-nama"><span class="label">Nama:</span> {motorDetail.model}</p>
            <p id="motor-detail-tahun"><span class="label">Tahun:</span> {motorDetail.tahun}</p>
            <p id="motor-detail-transmisi"><span class="label">Transmisi:</span> {motorDetail.transmisi}</p>
            <p id="motor-detail-status"><span class="label">Status:</span> {motorDetail.status_motor}</p>
            <p id="motor-detail-harga"><span class="label">Harga Harian:</span> {motorDetail.harga_harian}</p>
            <p id="motor-detail-pemilik"><span class="label">Pemilik:</span> {motorDetail.nama_pemilik}</p>

            <p id="motor-detail-plat-nomor"><span class="label">Plat Nomor:</span> {motorDetail.plat_nomor}</p>
            <p id="motor-detail-stnk"><span class="label">Nomor STNK:</span> {motorDetail.nomor_STNK}</p>
            <p id="motor-detail-bpkb"><span class="label">Nomor BPKB:</span> {motorDetail.nomor_BPKB}</p>
            <p id="motor-detail-brand"><span class="label">Brand:</span> {motorDetail.brand}</p>
            <p id="motor-detail-tipe"><span class="label">Tipe:</span> {motorDetail.tipe}</p>
        </div>

    </div>
</div>


<div class="content">

    <div class="breadcrumb">
        <h2>Motor</h2>
        <p>Home / <b>Motor</b></p>
    </div>

    <div class="filterNsearch-section">

        <div class="filter">
            <img src="src/lib/assets/icons/ic_outline-filter-alt.png" alt="">
            <p id="filter-chosen">Filter</p>
        </div>

        <form class="filter-dropdown-box" style="display: none;">

            <label for="filter-tahun">Tahun</label>
            <select name="tahun" id="filter-tahun" class="filter-options" bind:value={filterObj.tahun}>
                <option value="" selected>None</option>
            </select>

            <label for="filter-tahun">Transmisi</label>
            <select name="transmisi" id="filter-transmisi" class="filter-options" bind:value={filterObj.transmisi}>
                <option value="" selected>None</option>
                <option value="Automatic">Automatic</option>
                <option value="Matic">Matic</option>
                <option value="Manual">Manual</option>
            </select>

            <label for="filter-tahun">Status</label>
            <select name="status" id="filter-status" class="filter-options" bind:value={filterObj.status}>
                <option value="" selected>None</option>
                <option value="Available">Available</option>
                <option value="Unavailableu">Unavailable</option>
            </select>

            <label for="filter-tahun">Tipe Pemilik</label>
            <select name="status" id="filter-tahun" class="filter-options" bind:value={filterObj.tipePemilik}>
                <option value="" selected>None</option>
                <option value="Perusahaan">Perusahaan</option>
                <option value="Mitra">Mitra</option>
            </select>

        </form>

        <form class="search-bar">
            <input bind:value={filterObj.pencarian.nama} type="text" placeholder="Search..." name="nama" class="search-field">
            <div class="search-button">
                <img src="src/lib/assets/icons/material-symbols_search.png" alt="" class="search-img">
            </div>
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
                        <td><button class="btn-action action-button" onclick={() => selectMotor(motor.id)}>Detail</button></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

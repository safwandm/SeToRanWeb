<script>
    import * as Dialog from "$lib/components/ui/dialog";
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { json } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import Button from "$lib/components/ui/button/button.svelte";
	import RangeDatePicker from "$lib/shared/rangeDatePicker.svelte";
	import { backendHost, fetchAuth, postAuth } from "$lib/utilities";
    
    let voucher = $state([])
    let voucherShown = $state([])
    
    let sortBy = $state($page.url.searchParams.get('sortBy')??'')
    let sortDir = $state($page.url.searchParams.get('sortDir')??'')
    let filterStatus = $state($page.url.searchParams.get('filterStatus')??'')
    let search = $state($page.url.searchParams.get('search')??'')

    let dialogOpen = $state(false)
    let dateRangeValue = $state({})

    // simple dulu aja
    // $effect(() => {
    //     let param = new URLSearchParams(window.location.search)
    //     param.set('sortBy', sortBy)
    //     if (!sortBy)
    //         param.delete('sortBy')
    //     param.set('sortDir', sortDir)
    //     if (!sortDir)
    //         param.delete('sortDir')
    //     param.set('search', search)
    //     if (!search)
    //         param.delete('search')
    //     param.set('filterStatus', filterStatus)
    //     if (!filterStatus)
    //         param.delete('filterStatus')

    //     window.history.pushState(null, "", $page.url.href + '?' + param.toString())
    // })

    let statusMap = {
        nonAktif: "Non Aktif",
        aktif: "Aktif"
    }
    let labelMap = { 
        "ID": 'id',
        "Nama Voucher": "namaVoucher",
        "Status Voucher": "statusVoucher",
        "Tgl Mulai": "tglMulai",
        "Tgl Akhir": "tglAkhir"
    }

    $effect(() => {
        // nanti jadi panggilan query ulang dengan param
        let tmp = voucher
        if (sortBy == "")
            sortDir = ""
        else if (sortBy != "" && sortDir != "") {
            
        }

        if (filterStatus != '') {
            tmp = tmp.filter((item) => item.status_voucher == filterStatus)
        }
        
        tmp = tmp.filter((item) => {
            for (const [key, val] of Object.entries(item)) {
                if (val.toString().toLowerCase().includes(search.toLowerCase())) {
                    return true
                }
            }
        })

        voucherShown = tmp

        console.log(voucher)
    })

    function addVoucher(e) {
        e.preventDefault()

        let data = {
            "id": e.target.id.value,
            "nama_voucher": e.target.namaVoucher.value,
            "status_voucher": e.target.statusVoucher.value,
            "tanggal_mulai": dateRangeValue.start?.toString()??'',
            "tanggal_akhir": dateRangeValue.end?.toString()??''
        }
        
        postAuth("http://127.0.0.1:8000/api/vouchers", data).then(async res => {
            if (res.ok) {
                getVoucher()
                dialogOpen = false
            } else {
                console.log(await res.text())
            }
            console.log(res.ok)
        })
    }

    function getVoucher() {
        // Function to convert snake_case to camelCase
        function toCamelCase(str) {
            return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        }

        // Function to recursively convert object keys
        function convertKeysToCamelCase(obj) {
            if (Array.isArray(obj)) {
                return obj.map(item => convertKeysToCamelCase(item)); // Handle arrays
            } else if (obj !== null && typeof obj === 'object') {
                return Object.keys(obj).reduce((acc, key) => {
                    const camelCaseKey = toCamelCase(key);
                    acc[camelCaseKey] = convertKeysToCamelCase(obj[key]); // Recurse for nested objects/arrays
                    return acc;
                }, {});
            }
            return obj; // Return values unchanged
        }

        fetchAuth(backendHost + "/api/vouchers").then(async res => {
            if (res.ok) {
                let js = await res.json()
                voucher = js
                // voucher=convertKeysToCamelCase(js)
            } else {
                console.log(await res.text())
            }
        })
    }

    getVoucher()
    // onMount(() => {
    // })
</script>

<style>
    table {
        padding-top: 16px;
    }
    
    .btn-action {
        text-decoration: none;

        height: 34px;
        width: 68px;
    }

    .content-container {
        /* display: flex; */
        justify-content: center;
        align-items: start;

        display: grid;

        position: relative;


        grid-template-columns: 5fr 1fr;
    }

    .table-wrapper {
        /* flex-grow: 3; */
    }

    .filter-wrapper {
        margin-left: 20px;
        /* flex-grow: 1; */
        height: 100%;
        width: 300px;

        display: flex;
        flex-direction: column;
    }

    .filter-item {
        width: 100%;
        margin-top: 10px;
    }

    select, input {
        margin-top: 10px;

        height: 40px;
        width: 100%;

        border: 1px solid #DFDDDD;
        border-radius: 4px;

        padding-left: 10px;

        background-color: white;
        color: black;
    }
    select[disabled] {
        background-color: #e9e9ed;
    }

    /* ganti jadi wrapper div+class */
    h4 {
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        font-style: normal;
        color: #00236F;
    }
</style>

<div class="breadcrumb">
    <h2>Voucher</h2>
    <p>Home / <b>Voucher</b></p>
</div>

<div class="content-container row">
    <div class="card table-wrapper">
        <h3>Daftar Voucher</h3>
        <table style="width: 100%;">
            <thead>
                <tr>
                    <th class="w-[77px]">ID</th>
                    <th class="w-[308px]">Nama Voucher</th>
                    <th class="w-[145px]">Status Voucher</th>
                    <th class="w-[145px]">Tgl Mulai</th>
                    <th class="w-[145px]">Tgl Akhir</th>
                    <th class="w-[112px]">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {#each voucherShown as item}
                    <tr>
                        <td>{item.id_voucher}</td>
                        <td>{item.nama_voucher}</td>
                        <td>{statusMap[item.status_voucher]}</td>
                        <td>{item.tanggal_mulai}</td>
                        <td>{item.tanggal_akhir}</td>
                        <td style="text-align: center;">
                            <a class="flex-center btn-action" href={"/voucher/" + item.id_voucher}>Detail</a>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="card filter-wrapper">
        <h3>Filter</h3>
        <!-- <h4>Sorting</h4>
        <select bind:value={sortBy}>
            <option value="">All</option>
            {#each Object.entries(labelMap) as [key, val]}
                {#if val != "statusVoucher"}
                    <option value={val}>{key}</option>
                {/if}
            {/each}
        </select>
        <h4>Sort Direction</h4>
        <select bind:value={sortDir} disabled={sortBy == ""}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
        </select> -->
        <div class="filter-item">
            <h4>Filter Status</h4>
            <select bind:value={filterStatus}>
                <option value="">All</option>
                {#each Object.entries(statusMap) as [key, val]}
                    <option value={key}>{val}</option>
                {/each}
            </select>
        </div>
        <div class="filter-item">
            <h4>Search</h4>
            <input bind:value={search}/>
        </div>
        <div class="filter-item">
            <button class="btn-action" style="width: 100%;" onclick={() => dialogOpen = true}>Tambah Voucher</button>
        </div>
    </div>
</div>

<Dialog.Root bind:open={dialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Tambah Voucher</Dialog.Title>
        <Dialog.Description>
            <form onsubmit={addVoucher}>
                <label for="id">ID</label>
                <input id="id" name="id" />
                <label for="namaVoucher">Nama Voucher</label>
                <input id="namaVoucher" name="namaVoucher" />
                <label for="statusVoucher">Status Voucher</label>
                <select id="statusVoucher" name="statusVoucher">
                    {#each Object.entries(statusMap) as [key, val]}
                        <option value={key}>{val}</option>
                    {/each}
                </select>
                <RangeDatePicker bind:value={dateRangeValue} />
                <div class="flex-center">
                    <button type="submit" class="btn-action">
                        Simpan
                    </button>
                </div>
            </form>
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>
<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
    import voucher from '$lib/json/voucher.json'
	import { json } from '@sveltejs/kit';
	import { onMount } from 'svelte';
    
    let voucherShown = $state([])
    
    let sortBy = $state($page.url.searchParams.get('sortBy')??'')
    let sortDir = $state($page.url.searchParams.get('sortDir')??'')
    let filterStatus = $state($page.url.searchParams.get('filterStatus')??'')
    let search = $state($page.url.searchParams.get('search')??'')

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

    onMount(() => {
        // voucherShown = voucher;
        // console.log($page.url.searchParams.get('test'))
        // $page.url.searchParams.set('nest', 12)
        // window.history.pushState($page.url.href + JSON.stringify({
        //     sortBy: sortBy,
        //     sortDir: sortDir,
        //     filterStatus: filterStatus,
        //     search: search
        // }))
        // sortBy
        
        console.log($page.url)
    })
    $effect(() => {
        // nanti jadi panggilan query ulang dengan param
        let tmp = voucher
        if (sortBy == "")
            sortDir = ""
        else if (sortBy != "" && sortDir != "") {
            
        }

        if (filterStatus != '') {
            tmp = tmp.filter((item) => item.statusVoucher == filterStatus)
        }
        
        tmp = tmp.filter((item) => {
            for (const [key, val] of Object.entries(item)) {
                if (val.toLowerCase().includes(search.toLowerCase())) {
                    return true
                }
            }
        })

        voucherShown = tmp

        console.log(voucher)
    })

    const jq = globalThis.$
    onMount(() => {
        console.log(jq)
        jq('.breadcrumb').toggle
    })


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

    select, input {
        margin-top: 10px;

        height: 40px;
        /* width: 360px; */

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
        margin-top: 10px;
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
                        <td>{item.id}</td>
                        <td>{item.namaVoucher}</td>
                        <td>{statusMap[item.statusVoucher]}</td>
                        <td>{item.tglMulai}</td>
                        <td>{item.tglAkhir}</td>
                        <td style="text-align: center;">
                            <a class="flex-center btn-action" href={"/voucher/" + item.id}>Detail</a>
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
        <h4>Filter Status</h4>
        <select bind:value={filterStatus}>  
            <option value="">All</option>   
            {#each Object.entries(statusMap) as [key, val]}
                <option value={key}>{val}</option>
            {/each}
        </select>
        <h4>Search</h4>
        <input bind:value={search}/>
    </div>
</div>
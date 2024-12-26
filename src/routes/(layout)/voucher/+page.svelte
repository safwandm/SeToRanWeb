<script>
    import * as Dialog from "$lib/components/ui/dialog";
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { json } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import Button from "$lib/components/ui/button/button.svelte";
	import RangeDatePicker from "$lib/shared/rangeDatePicker.svelte";
	import { toast } from "svelte-sonner";
	import { validate } from "./voucherValidation";
	import { BaseApi } from "$lib/baseApi";
    
    let vouchers = $state([])
    
    let sortBy = $state($page.url.searchParams.get('sortBy')??'')
    let sortDir = $state($page.url.searchParams.get('sortDir')??'')
    let filterStatus = $state($page.url.searchParams.get('filterStatus')??'')
    let search = $state($page.url.searchParams.get('search')??'')

    let dialogOpen = $state(false)
    let dateRangeValue = $state({})
    let errors = $state({})

    let statusMap = {
        nonAktif: "Non Aktif",
        aktif: "Aktif"
    }

    let formData = $state({})

    async function addVoucher(e) {
        e.preventDefault()

        let data = {
            ...formData,
            "tanggal_mulai": dateRangeValue.start?.toString()??'',
            "tanggal_akhir": dateRangeValue.end?.toString()??''
        }
        
        errors = await validate(data)
        if (Object.keys(errors).length !== 0)
            return

        BaseApi.ins.postAuth("/api/vouchers", data).then(async res => {
            if (res.ok) {
                getVoucher()
                dialogOpen = false
                toast.success("Voucher berhasil di buat!")
            } else {
                console.log(await res.text())
                toast.error("Voucher gagal di buat")
            }
        }).catch(res => {
            toast.error("Voucher gagal di buat")
        })
    }

    let controller
    let queryUrl = "/api/voucher/filtered?search"
    
    $effect(() => {
        
        if (controller)
            controller.abort()

        controller = new AbortController()
        let signal = controller.signal

        queryUrl = `/api/voucher/filtered?search=${search}`
        if (filterStatus !== "")
            queryUrl+= `&status=${filterStatus}`
        BaseApi.ins.fetchAuth(queryUrl, { signal }).then(res => res.json()).then(res => vouchers = res)
    })

    function getVoucher() {

        BaseApi.ins.fetchAuth(queryUrl).then(async res => {
            if (res.ok) {
                let js = await res.json()
                vouchers = js
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

        height: fit-content;
    }

    .filter-item {
        width: 100%;
        margin-top: 10px;
    }

    .input-row {
        margin-top: 10px;
    }

    select, input {
        margin-top: 5px;

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
                    <th class="w-[130px]">Kode</th>
                    <th class="w-[308px]">Nama Voucher</th>
                    <th class="w-[77px]">Persentase</th>
                    <th class="w-[145px]">Status Voucher</th>
                    <th class="w-[145px]">Tgl Mulai</th>
                    <th class="w-[145px]">Tgl Akhir</th>
                    <th class="w-[112px]">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {#each vouchers as item}
                    <tr>
                        <td>{item.nama_voucher}</td>
                        <td>{item.kode_voucher}</td>
                        <td>{item.persen_voucher}%</td>
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

{#snippet input(key, label, type="text")}
    <div class="input-row">
        <label for={key}>{label}</label>
        <input bind:value={formData[key]} type={type} id={key} name="id" />
        {#if errors[key]}
            <p class="text-red-600">{errors[key]}</p>
        {/if}
    </div>
{/snippet}

<Dialog.Root bind:open={dialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Tambah Voucher</Dialog.Title>
        <Dialog.Description>
            <form onsubmit={addVoucher}>
                {@render input("kode_voucher", "Kode Voucher")}
                {@render input("nama_voucher", "Nama Voucher")}
                {@render input('persen_voucher','Persen Voucher', "number")}  
                <div class="input-row">
                    <label for="status_voucher">Status Voucher</label>
                    <select bind:value={formData.status_voucher} id="status_voucher" name="status_voucher">
                        {#each Object.entries(statusMap) as [key, val]}
                            <option value={key}>{val}</option>
                        {/each}
                    </select>
                </div>
                <div class="input-row">
                    <label>Tanggal Aktif Voucher</label>
                    <RangeDatePicker bind:value={dateRangeValue} />
                    {#if errors.tanggal}
                        <p class="text-red-600">{errors.tanggal}</p>
                    {/if}
                </div>
                <div class="flex-center mt-3">
                    <button type="submit" class="btn-action">
                        Submit
                    </button>
                </div>
            </form>
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>
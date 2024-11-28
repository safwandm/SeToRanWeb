<script>
    import voucher from '$lib/json/voucher.json'
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { json } from '@sveltejs/kit';
    
    let selectedVoucherId = $page.params['voucherId']
    let selectedVoucher = $state({
        statusVoucher: "aktif"
    })
    let originalVoucher;
    // $derived(
    //     voucher.find((item) => {
    //         if (item.id == selectedVoucherId)
    //             return item
    //     })??{}
    // )

    let editing = $state(false);
    let original = {}

    onMount(() => {
        selectedVoucher = voucher.find((item) => {
            if (item.id == selectedVoucherId)
                return item
        })??{}
        
        originalVoucher = $state.snapshot(selectedVoucher)
    })

    $effect(() => {
        // selectedVoucher.namaVoucher;selectedVoucher.statusVoucher;selectedVoucher.tglMulai;selectedVoucher.tglAkhir

        editing = JSON.stringify($state.snapshot(selectedVoucher)) != JSON.stringify(originalVoucher)
        console.log(originalVoucher, $state.snapshot(selectedVoucher))
        console.log(editing)
    })

    function onSubmit(e) {
        e.preventDefault()
        originalVoucher = $state.snapshot(selectedVoucher)
    }

    function onCancel(e) {
        selectedVoucher = originalVoucher;
    }
</script>

<style>
    form {
        padding-top: 16px;
    }
    
    .input-row {
        display: flex;
        flex-direction: row;

        justify-content: start;
        align-items: center;

        padding-top: 16px;
    }
        
    label {
        width: 200px;
    }

    input, select {
        height: 40px;
        width: 360px;

        border: 1px solid #DFDDDD;
        border-radius: 4px;

        padding-left: 10px;

        background-color: white;
        color: black;
    }

    .input-edit {
        border: 1px solid black;
    }

    .control {
        padding-top: 16px;
    }

    .btn-action {
        height: 36px;
        width: 68px;

        margin-right: 16px;
    }

    .disabled {
        background-color: gray;
    }

    .a-unstyle {
        text-decoration: none;
    }
</style>

<div class="breadcrumb">
    <h2>Voucher</h2>
    <p>Home / Voucher / <b>{selectedVoucherId}</b></p>
</div>

{#snippet input(name, label, voucherKey, readonly)}
    <div class="input-row">
        <label for={name}>{label}</label>
        <input id={name} class={editing&&!readonly?'input-edit':''} bind:value={selectedVoucher[voucherKey]} readonly={readonly}/>
    </div>
{/snippet}

<div class="card">
    <h3>Detail Voucher</h3>
    <form onsubmit={onSubmit}>
        {@render input('id', 'Id', 'id', true)}
        {@render input('nama', 'Nama', 'namaVoucher', false)}        
        <div class="input-row">
            <label for='status'>Status</label>
            <!-- <input id="status" type="" bind:value={selectedVoucher.statusVoucher} readonly={!editing}/> -->
            <select bind:value={selectedVoucher.statusVoucher} id="status" class={!editing?'':'input-edit'} disabled={false}>
                <option id="aktif" value="aktif">Aktif</option>
                <option id="nonAktif" value="nonAktif">Non Aktif</option>
            </select>
        </div>
        {@render input('tgl-mulai', 'Tanggal Mulai', 'tglMulai', false)}
        {@render input('tgl-akhir', 'Tanggal Akhir', 'tglAkhir', false)}

        <!-- <div class="input-row">
            <label for='nama'>Nama</label>
            <input id="nama" bind:value={selectedVoucher.namaVoucher} readonly=
        console.log(selectedVoucher){!editing}/>
        </div>
        <div class="input-row">
            <label for='status'>Status</label>
            <input id="status" bind:value={selectedVoucher.statusVoucher} readonly={!editing}/>
        </div>
        <div class="input-row">
            <label for='tgl-mulai'>Tanggal Mulai</label>
            <input id="tgl-mulai" bind:value={selectedVoucher.tglMulai} readonly={!editing}/>
        </div>
        <div class="input-row">
            <label for='tgl-akhir'>Tanggal Akhir</label>
            <input id="tgl-akhir" bind:value={selectedVoucher.tglAkhir} readonly={!editing}/>
        </div> -->
        <div class="input-row">
            <a class="flex-center a-unstyle btn-action" href="/voucher">Back</a>
            <!-- <button class={"btn-action " + (editing?"disabled":"")} disabled={editing} onclick={onEdit}>
                edit
            </button>
            <button type="submit" class={"btn-action " + (!editing?"disabled":"")} disabled={!editing} onclick={onSubmit}>
                save
            </button>
            <button class={"btn-action " + (!editing?"disabled":"")} disabled={!editing} onclick={onCancel}>
                cancel
            </button> -->
            {#if editing}
                <button type="submit" class={"btn-action " + (!editing?"disabled":"")} onclick={onSubmit}>
                    save
                </button>
                <button class={"btn-action " + (!editing?"disabled":"")} onclick={onCancel}>
                    cancel
                </button>
            {:else if (!selectedVoucher.id)}
                <!-- <button class={"btn-action " + (editing?"disabled":"")}  onclick={onEdit}>
                    edit
                </button>
            {:else} -->
                Data not found
            {/if}
        </div>
    </form>
    <div class="control">

    </div>
</div>
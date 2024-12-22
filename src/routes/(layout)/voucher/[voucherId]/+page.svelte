<script>
    import voucher from '$lib/json/voucher.json'
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { json } from '@sveltejs/kit';
    import { toast } from "svelte-sonner";

    import RangeDatePicker from '$lib/shared/rangeDatePicker.svelte';
    import {
     CalendarDate,
     parseDate
    } from "@internationalized/date";
	import { validate } from '../voucherValidation';
	import { BaseApi } from '$lib/baseApi.js';
    
    let { data } = $props()

    let selectedVoucherId = $page.params['voucherId']
    let selectedVoucher = $state({
        status_voucher: "aktif"
    })
    let originalVoucher;
    
    let daterangevalue = $state({
     start: null,
     end: null
    });

    let errors = $state({})

    let editing = $state(false);

    onMount(() => {
        selectedVoucher = data.voucher
        setInitialValue(selectedVoucher)
    })

    $effect(() => {
        // selectedVoucher.namaVoucher;selectedVoucher.statusVoucher;selectedVoucher.tglMulai;selectedVoucher.tglAkhir
        editing = JSON.stringify($state.snapshot(selectedVoucher)) != JSON.stringify(originalVoucher)
    })

    function onSubmit(e) {
        e.preventDefault()

        errors = validate(selectedVoucher)

        if (Object.keys(errors).length !== 0)
            return

        BaseApi.ins.postAuth("/api/vouchers/" + selectedVoucherId, selectedVoucher, {
            "method": "PUT"
        }).then(res => {
            if (res.ok) {
                originalVoucher = $state.snapshot(selectedVoucher)
                editing = false;
                toast.success("Voucher berhasil di update!")
            } else {
                toast.error("Voucher gagal di update")
            }
        }).catch(res => {
            toast.error("Voucher gagal di update")
        })
    }

    function onCancel(e) {
        selectedVoucher = originalVoucher;
        setInitialValue(originalVoucher)
        errors = {}
    }

    function setInitialValue(js) {
        if (js.tanggal_mulai && js.tanggal_akhir) {
            daterangevalue.start = parseDate(js.tanggal_mulai)
            daterangevalue.end = parseDate(js.tanggal_akhir)
        }

        originalVoucher = $state.snapshot(js)
    }

    $effect(() => {
        selectedVoucher.tanggal_mulai = daterangevalue.start?.toString()??''
        selectedVoucher.tanggal_akhir = daterangevalue.end?.toString()??''
    })
    

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
        /* border: 1px solid black; */
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

    .error-container {

    }
</style>

<div class="breadcrumb">
    <h2>Voucher</h2>
    <p>Home / Voucher / <b>{selectedVoucherId}</b></p>
</div>

{#snippet input(name, label, voucherKey, readonly)}
    <div class="input-row">
        <label for={name}>{label}</label>
        <input id={name} class={editing&&!readonly?'input-edit':''} bind:value={selectedVoucher[voucherKey]} readonly={readonly} />
        {#if errors[voucherKey]}
                <div class="pl-5 text-red-600">{errors[voucherKey]}</div>
        {/if}
    </div>
{/snippet}

<div class="card">
    <h3>Detail Voucher</h3>
    <form onsubmit={onSubmit}>
        {@render input('id', 'Id', 'id_voucher', true)}
        {@render input('nama', 'Nama', 'nama_voucher', false)}        
        <div class="input-row">
            <label for='status'>Status</label>
            <select bind:value={selectedVoucher.status_voucher} id="status" class={!editing?'':'input-edit'} disabled={false}>
                <option id="aktif" value="aktif">Aktif</option>
                <option id="nonAktif" value="nonAktif">Non Aktif</option>
            </select>
        </div>
        <div class="input-row">
            <label for='date'>Tanggal Aktif Voucher</label>
            <RangeDatePicker bind:value={daterangevalue} width="360px"/>
            {#if errors.tanggal}
                <div class="pl-5 text-red-600">{errors.tanggal}</div>
            {/if}
        </div>
        <div class="input-row">
            <a class="flex-center a-unstyle btn-action" href="/voucher">Back</a>
            {#if editing && selectedVoucher.id_voucher}
                <button type="submit" class={"btn-action " + (!editing?"disabled":"")}>
                    save
                </button>
                <button class={"btn-action" + (!editing?"disabled":"")} style="background-color: red;" onclick={onCancel}>
                    cancel
                </button>
            {:else if (!selectedVoucher.id_voucher)}
                Data not found
            {/if}
        </div>
    </form>
    <div class="control">

    </div>
</div>
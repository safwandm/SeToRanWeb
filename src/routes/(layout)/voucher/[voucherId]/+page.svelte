<svelte:head>
    <title>Detail Voucher</title>
</svelte:head>

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
	import { BaseApi } from '$lib/baseApi';
	import { Trash, Trash2 } from 'lucide-svelte';
    import * as Dialog from "$lib/components/ui/dialog/index";
	import { buttonVariants } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
    
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

    let confirmDialogOpen = $state(false)

    onMount(() => {
        selectedVoucher = data.voucher
        setInitialValue(selectedVoucher)
    })

    $effect(() => {
        // selectedVoucher.namaVoucher;selectedVoucher.statusVoucher;selectedVoucher.tglMulai;selectedVoucher.tglAkhir
        editing = JSON.stringify($state.snapshot(selectedVoucher)) != JSON.stringify(originalVoucher)
    })

    async function onSubmit(e) {
        e.preventDefault()

        errors = await validate(selectedVoucher)

        if (Object.keys(errors).length !== 0)
            return

        BaseApi.ins.postAuth("/api/voucher/" + selectedVoucherId, selectedVoucher, {
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

    async function onDelete() {

        let res = await BaseApi.ins.fetchAuth("/api/generic/vouchers/" + selectedVoucherId, { method: "DELETE" })

        if (res.ok) {
            toast.success("Voucher berhasil di hapus!")
            goto("/voucher")
        } else {
            toast.error("Voucher gagal di hapus")
        }
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

{#snippet input(label, voucherKey, readonly, type="text")}
    <div class="input-row">
        <label for={voucherKey}>{label}</label>
        <input type={type} id={voucherKey} class={editing&&!readonly?'input-edit':''} bind:value={selectedVoucher[voucherKey]} readonly={readonly} />
        {#if errors[voucherKey]}
                <div class="pl-5 text-red-600">{errors[voucherKey]}</div>
        {/if}
    </div>
{/snippet}

<div class="card">
    <h3>Detail Voucher</h3>
    <form onsubmit={onSubmit} class="w-fit">
        {@render input('Id', 'id_voucher', true)}
        {@render input('Nama', 'nama_voucher', false)}
        {@render input('Kode', 'kode_voucher', false)}     
        {@render input('Persen Voucher', 'persen_voucher', false, "number")}           
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
            <div class="flex justify-between w-full items-center">
                <div class="flex-center flex-row">
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
                <div class="flex-center">
                    <Dialog.Root bind:open={confirmDialogOpen}>
                        <Dialog.Trigger type="button"><Trash2 /></Dialog.Trigger>
                        <Dialog.Content class="w-[300px]">
                          <Dialog.Header>
                            <Dialog.Title>Are you sure sure?</Dialog.Title>
                            <Dialog.Description>
                            </Dialog.Description>
                          </Dialog.Header>
                          <Dialog.Footer>
                            <button type="submit" class={buttonVariants({ variant: "outline" })} onclick={() => confirmDialogOpen = false}>
                                cancel
                            </button>
                            <button type="submit" class={buttonVariants({ variant: "destructive" })} onclick={onDelete}>
                                confirm
                            </button>
                          </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Root>
                </div>
            </div>
        </div>
    </form>
    <div class="control">

    </div>
</div>
	
<script>
    import * as Dialog from "$lib/components/ui/dialog/index";
    import * as Command from "$lib/components/ui/command/index";
    import * as Popover from "$lib/components/ui/popover/index";

	import { BaseApi } from "$lib/baseApi";
	import { buttonVariants } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import { toast } from "svelte-sonner";

    let { open=$bindable() } = $props()

    let formData = $state({})
    let errors = $state({})

    function sendNotif() {

    }

    let targetPengguna = $state(null)
    let opsiPengguna = $state([])
    let loadingPengguna = $state(false)
    let commandOpen = $state(false)

    async function getPengguna() {
        console.log("here")
        loadingPengguna = true
        opsiPengguna = []
        let res = await BaseApi.ins.fetchAuth('/api/generic/penggunas')
        
        if (res.ok) {
            let js = await res.json()
            opsiPengguna = js
            loadingPengguna = false
        }
    }

    let opsiNavigasi = [
        ['', '-'],
        ['transaksi', "Ke Page Transaksi"],
        ['editProfile', "Ke Page Edit Profile"]
    ]
    let acceptDataNavigasi = $state(false)
    $effect(() => {
        acceptDataNavigasi = formData.navigasi !== ''
    })

    $effect(() => {
        if (open) {
            getPengguna()
            targetPengguna = null
            errors = {}
        }
    })

    function batal() {
        formData = {}
        open = false
    }

    async function kirim() {

        errors = {}
        if (targetPengguna === null)
            errors.id_pengguna = "Required!"
        if (!formData.judul)
            errors.judul = "Required!"
        if (!formData.deskripsi)
            errors.deskripsi = "Required!"
        console.log(errors, formData)
        if (Object.keys(errors).length !== 0) {
            toast.error(`Form kirim notifikasi tidak valid`)
            return
        }

        let res = await BaseApi.ins.postAuth('/api/notif/send', {
            id_pengguna: targetPengguna.id_pengguna,
            ...formData
        })

        if (res.ok)
            toast.success(`Notifikasi terkirim ke ${targetPengguna.nama}`)
        else
            toast.error(`Notifikasi gagal terkirim!`)
    }
</script>

<style>
    .input-row {
        /* margin-top: 10px; */
    }

    select, input, textarea {
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

    textarea {
        height: 80px;
    }

    label {
        border-bottom-color: rgb(226, 232, 240);
        color: rgb(100, 116, 139);
        font-family: "Poppins", sans-serif;
        font-size: 14px;
    }
</style>

{#snippet input(key, label, type="text")}
    <div class="input-row">
        <label for={key}>{label}</label>
        <input bind:value={formData[key]} type={type} id={key} name={key} />
        {#if errors[key]}
            <p class="text-red-600">{errors[key]}</p>
        {/if}
    </div>
{/snippet}

<Dialog.Root bind:open>
    <Dialog.Content>
        <Dialog.Header>
        <Dialog.Title>Kirim Notifikasi</Dialog.Title>
        </Dialog.Header>

        <div class="input-row">
            <label for="target-pengguna">Pengguna</label>
            <Popover.Root bind:open={commandOpen}>
                <Popover.Trigger id="target-pengguna" class={cn(buttonVariants({ variant: "outline"}), "flex justify-start w-full")}>
                    {targetPengguna !== null ? `(${targetPengguna.id_pengguna}) ${targetPengguna.nama}` : "Pilih Pengguna"}
                </Popover.Trigger>
                <Popover.Content>
                    <Command.Root>
                        <Command.Input placeholder="Cari pengguna..." />
                        <Command.List>
                            {#if loadingPengguna}
                                Loading...
                            {:else}
                                {#each opsiPengguna as pengguna}
                                    <Command.Item onclick={() => {targetPengguna = pengguna; commandOpen=false}}>({pengguna.id_pengguna}) {pengguna.nama}</Command.Item>
                                {/each}
                            {/if}
                        </Command.List>
                    </Command.Root>
                </Popover.Content>
              </Popover.Root>
              {#if errors.id_pengguna}
                <p class="text-red-600">{errors.id_pengguna}</p>
              {/if}
        </div>
          
        {@render input("judul", "Judul")}
        {@render input("deskripsi", "Deskripsi")}

        <div class="input-row">
            <label for="navigasi">Navigasi</label>
            <select bind:value={formData.navigasi} id="navigasi" name="navigasi">
                {#each opsiNavigasi as [key, val]}
                    <option value={key}>{val}</option>
                {/each}
            </select>
        </div>

        <div class="input-row">
            <label for={"dataNavigasi"}>Data Navigasi (json)</label>
            <textarea readonly={!acceptDataNavigasi} bind:value={formData.dataNavigasi} id={"dataNavigasi"} name={"dataNavigasi"} class="pt-2"></textarea>
            {#if errors["dataNavigasi"]}
                <p class="text-red-600">{errors["dataNavigasi"]}</p>
            {/if}
        </div>
    <Dialog.Footer>
        <button class={buttonVariants({ variant: 'outline'})} onclick={batal}>
            Batal
        </button>
        <button class={buttonVariants({ variant: 'default'})} onclick={kirim}>
            Kirim
        </button>
    </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>



  
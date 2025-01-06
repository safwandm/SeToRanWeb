<svelte:head>
    <title>Diskon</title>
</svelte:head>

<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
    import RangeDatePicker from "$lib/shared/rangeDatePicker.svelte";
    import { toast } from "svelte-sonner";
    import { BaseApi } from "$lib/baseApi";
    import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date";
    
    let diskonData = $state([]);
    let diskonDataShow = $state([]);
    let loading = $state(false);
    
    let sortBy = $state($page.url.searchParams.get('sortBy')??'');
    let sortDir = $state($page.url.searchParams.get('sortDir')??'');
    let filterStatus = $state($page.url.searchParams.get('filterStatus')??'');
    let search = $state($page.url.searchParams.get('search')??'');

    let dialogOpen = $state(false);
    let detailDialogOpen = $state(false);
    let selectedDiskon = $state(null);
    let dateRangeValue = $state({});
    let errors = $state({});

    const statusMap = {
        aktif: "Aktif",
        nonaktif: "Non Aktif"
    };

    let formData = $state({
        nama: '',
        status_promo: 'aktif'
    });

    function validateForm(data) {
        let newErrors = {};
        
        if (!data.nama?.trim()) {
            newErrors.nama = 'Nama diskon harus diisi';
        }
        
        if (!dateRangeValue.start || !dateRangeValue.end) {
            newErrors.tanggal = 'Tanggal mulai dan akhir harus diisi';
        }
        
        errors = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    async function addDiskon(e) {
        e.preventDefault();

        let data = {
            ...formData,
            "tanggal_mulai": dateRangeValue.start?.toString() ?? '',
            "tanggal_akhir": dateRangeValue.end?.toString() ?? ''
        };
        
        if (!validateForm(data)) return;

        try {
            loading = true;
            const response = await BaseApi.ins.postAuth("/api/diskon", data);
            
            if (response.ok) {
                await loadDiskonData();
                dialogOpen = false;
                resetForm();
                toast.success("Diskon berhasil dibuat!");
            } else {
                const errorText = await response.text();
                console.error('Error creating diskon:', errorText);
                toast.error("Diskon gagal dibuat: " + errorText);
            }
        } catch (error) {
            console.error('Error creating diskon:', error);
            toast.error("Terjadi kesalahan saat membuat diskon");
        } finally {
            loading = false;
        }
    }

    function resetForm() {
        formData = {
            nama: '',
            status_promo: 'aktif'
        };
        dateRangeValue = {};
        errors = {};
    }

    function filterData(status) {
        if (status !== '') {
            diskonDataShow = diskonData.filter(item =>
                item.status_promo.toLowerCase() === status.toLowerCase()
            );
        } else {
            diskonDataShow = diskonData;
        }
    }

    $effect(() => {
        filterData(filterStatus);
    });

    async function loadDiskonData() {
        try {
            loading = true;
            const response = await BaseApi.ins.fetchAuth('/api/diskon');
            if (!response.ok) throw new Error('Failed to fetch data');
            const responseData = await response.json();
            diskonData = responseData.data || [];
            diskonDataShow = diskonData;
        } catch (error) {
            toast.error("Gagal memuat data diskon");
        } finally {
            loading = false;
        }
    }
    
    function formatDate(dateString) {
        if (!dateString) return '';
        const [datePart] = dateString.split('T');
        if (datePart) {
            const [year, month, day] = datePart.split('-');
            return `${day}-${month}-${year}`;
        }
        return dateString;
    }
    async function updateDiskon() {
        // Logika untuk update diskon
        try {
            loading = true;
            const response = await BaseApi.ins.putAuth(`/api/diskon/${selectedDiskon.id}`, selectedDiskon,)
            if (!response.ok) throw new Error(await response.text());
            toast.success("Diskon berhasil diperbarui!");
            await loadDiskonData();
            dialogOpen = false;
        } catch (error) {
            toast.error("Gagal memperbarui diskon");
            throw error;
        } finally {
            loading = false;
        }
    }
    async function deleteDiskon() {
        // Logika untuk delete diskon
        if (!confirm(`Yakin ingin menghapus diskon "${selectedDiskon.nama}"?`)) return;
        try {
            loading = true;
            const response = await BaseApi.ins.deleteAuth(`/api/diskon/${selectedDiskon.id}`);
            if (!response.ok) throw new Error(await response.text());
            toast.success("Diskon berhasil dihapus!");
            await loadDiskonData();
            dialogOpen = false;
        } catch (error) {
            toast.error("Gagal menghapus diskon");
        } finally {
            loading = false;
        }
    }

    function clearFilter() {
        filterStatus = "";
        search = "";
    }

    onMount(() => {
        loadDiskonData();
    });
</script>

<style>
    table {
        width: 100%;
        max-width: 966px;
        margin: auto; 
        border-collapse: collapse;
    }

    th, td {
        word-wrap: break-word;
        word-break: break-word; 
        white-space: normal; 
        padding: 12px;
        text-align: left;
        border: 1px solid #e2e8f0;
    }

    th {
        white-space: nowrap;
        background-color: #f8fafc;
    }

    .btn-action {
        text-decoration: none;
        height: 34px;
        width: 68px;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content-container {
        display: flex;
        gap: 20px;
        padding: 20px;
    }

    .main-content {
        flex-grow: 2;
    }

    .sidebar {
        width: 250px;
    }

    .filter-item {
        margin-top: 15px;
    }

    .input-row {
        margin-top: 15px;
    }

    select, input {
        height: 40px;
        width: 100%;
        border: 1px solid #DFDDDD;
        border-radius: 4px;
        padding: 0 10px;
        margin-top: 5px;
    }

    .error-text {
        color: #dc2626;
        font-size: 0.875rem;
        margin-top: 4px;
    }

    .loading {
        text-align: center;
        padding: 20px;
        color: #6b7280;
    }

    .empty-state {
        text-align: center;
        padding: 40px;
        color: #6b7280;
    }
</style>

<div class="breadcrumb">
    <h2>Diskon</h2>
    <p>Home / <b>Diskon</b></p>
</div>

<div class="content-container">
    <div class="main-content card">
        <div class="flex justify-between items-center mb-4">
            <h3>Daftar Diskon</h3>
            <button 
                class="btn-action" 
                style="width: auto; padding: 0 16px;" 
                onclick={() => dialogOpen = true}
            >
                Tambah Diskon
            </button>
        </div>

        {#if loading}
            <div class="loading">
                Loading...
            </div>
        {:else if diskonDataShow.length === 0}
            <div class="empty-state">
                Tidak ada data diskon
            </div>
        {:else}
            <table>
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
                <tbody>
                    {#each diskonDataShow as item (item.id)}
                <tr>
                    <td>{item.id}</td>
                    <td>{item.nama}</td>
                    <td>{statusMap[item.status_promo]}</td>
                    <td>{formatDate(item.tanggal_mulai)}</td>
                    <td>{formatDate(item.tanggal_akhir)}</td>
                    <td style="text-align: center;">
                        <button
                            class="btn-action"
                            onclick={() => {
                                selectedDiskon = { ...item };
                                detailDialogOpen = true;
                            }}
                        >
                            Detail
                        </button>
                    </td>
                </tr>
                {/each}

                </tbody>
            </table>
        {/if}
    </div>

    <div class="sidebar card">
        <div class="flex justify-between items-center">
            <h3>Filter</h3>
            <button 
                class={buttonVariants({ variant: "ghost" })} 
                onclick={clearFilter}
                disabled={loading}
            >
                Clear
            </button>
        </div>
        <div class="filter-item">
            <label for="statusPromo">Status Promo</label>
            <select 
                bind:value={filterStatus} 
                id="statusPromo"
                disabled={loading}
            >
                <option value="">Semua</option>
                {#each Object.entries(statusMap) as [key, val]}
                    <option value={key}>{val}</option>
                {/each}
            </select>
        </div>
        <div class="filter-item">
            <label for="search">Search</label>
            <input 
                bind:value={search}
                id="search"
                placeholder="Cari nama diskon..."
                disabled={loading}
            />
        </div>
    </div>
</div>

<Dialog.Root bind:open={dialogOpen}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Tambah Diskon</Dialog.Title>
            <Dialog.Description>
                <form onsubmit={addDiskon}>
                    <div class="input-row">
                        <label for="nama">Nama Diskon</label>
                        <input 
                            bind:value={formData.nama}
                            type="text" 
                            id="nama"
                            disabled={loading}
                        />
                        {#if errors.nama}
                            <p class="error-text">{errors.nama}</p>
                        {/if}
                    </div>

                    <div class="input-row">
                        <label for="status_promo">Status Diskon</label>
                        <select 
                            bind:value={formData.status_promo} 
                            id="status_promo"
                            disabled={loading}
                        >
                            {#each Object.entries(statusMap) as [key, val]}
                                <option value={key}>{val}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="input-row">
                        <label>Tanggal Aktif Diskon</label>
                        <RangeDatePicker bind:value={dateRangeValue} />
                        {#if errors.tanggal}
                            <p class="error-text">{errors.tanggal}</p>
                        {/if}
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <button 
                            type="button" 
                            class={buttonVariants({ variant: "outline" })}
                            onclick={() => dialogOpen = false}
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            class="btn-action"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </Dialog.Description>
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={detailDialogOpen}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Detail Diskon</Dialog.Title>
            </Dialog.Header>
            {#if selectedDiskon}
                <p><b>ID:</b> {selectedDiskon.id}</p>
                <p><b>Nama Promo:</b></p>
                <input 
                    type="text" 
                    bind:value={selectedDiskon.nama} 
                    disabled={loading} 
                />
                <p><b>Status Promo:</b></p>
                <select 
                    bind:value={selectedDiskon.status_promo}
                    disabled={loading}
                >
                    {#each Object.entries(statusMap) as [key, val]}
                        <option value={key}>{val}</option>
                    {/each}
                </select>
                <p><b>Tanggal Mulai:</b> {formatDate(selectedDiskon.tanggal_mulai)}</p>
                <p><b>Tanggal Akhir:</b> {formatDate(selectedDiskon.tanggal_akhir)}</p>
                <div class="flex justify-end gap-2 mt-6">
                    <button
                        class="btn-action"
                        onclick={updateDiskon}
                        disabled={loading}
                    >
                        {loading ? "Memperbarui..." : "Update"}
                    </button>
                    <button
                        class="btn-action"
                        onclick={deleteDiskon}
                        disabled={loading}
                    >
                        {loading ? "Menghapus..." : "Hapus"}
                    </button>
                </div>
            {:else}
                <p>Data tidak tersedia</p>
            {/if}
            <Dialog.Footer>
            <button
                class="btn-action"
                onclick={() => detailDialogOpen = false}
            >
                Tutup
            </button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>



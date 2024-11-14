

<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
  
    
    <style>
        .btn-action {
            height: 34px;
            width: 68px;
        }

        .cardSide, .filter-section {
            padding: 16px;
            margin-left: 16px;
            width: 250px;
        }

        .btn-filter {
            height: 34px;
            width: 218px;
        }
    </style>
    <title>Mitra Page</title>
</svelte:head>

<script>
    import { onMount } from "svelte";
    const jq = globalThis.$

    let dataMitra = $state({})
    let mitraList = $state([])
    let selectedStatus = $state('')

    let selectedMitra = $state({})
    // let selectedMitra = $derived(dataMitra.mitra ? dataMitra.mitra.find(m => m.mitraId == selectedMitraId) : {})

    onMount(() => {
        jq.getJSON('src/lib/json/mitra.json', function (data) {
            dataMitra = data;
            const mitraList = data.mitra;
        });
    })

    $effect(() => {
        mitraList = selectedStatus ?
            dataMitra.mitra.filter(item => item.status.toLowerCase() === selectedStatus.toLowerCase()) :  dataMitra.mitra;
    })

    function selectMitra(mitraId) {
        jq('.mitra-section').hide();
        jq('.filter-section').hide();

        jq('.details-section').show();

        selectedMitra = dataMitra.mitra ? dataMitra.mitra.find(m => m.mitraId == mitraId) : {}
        
    }

    function selectMitraBack() {    
        jq('.mitra-section').show();
        jq('.filter-section').show();

        jq('.details-section').hide();
    }

</script>

<div>
    <h2>Mitra</h2>
    <div class="breadcrumb">
        <p>Home / <b>Mitra</b></p>
    </div>
    <div style="display: flex;">
        <div class="card mitra-section" style="width: 100%;">
            <h3>Mitra</h3>
            <table style="width: 100%;">
                <thead>
                    <tr>
                        <th>Mitra ID</th>
                        <th>Username</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each mitraList as mitra}
                        <tr data-id="${mitra.mitraId}">
                            <td>{mitra.mitraId}</td>
                            <td>{mitra.username}</td>
                            <td>{mitra.vehicle}</td>
                            <td>{mitra.status}</td>
                            <td style="text-align: center;">
                                <button onclick={() => selectMitra(mitra.mitraId)} class="btn-action">Details</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="card filter-section">
            <h3>Filter</h3>
            <label for="statusMitra" style="display: flex;">Status Promo</label>
            <select bind:value={selectedStatus} id="statusMitra" style="width: 100%; padding: 5px; margin-top: 10px; margin-bottom: 20px; border-radius: 4px; border: 1px solid #ccc">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
        </div>
    </div>
</div>

<div class="details-section card" style="display: none;">
    <h3>Mitra Details</h3>
    <p><strong>Mitra ID:</strong> {selectedMitra.mitraId}</p>
    <p><strong>Username:</strong> {selectedMitra.username}</p>
    <p><strong>Vehicle:</strong> {selectedMitra.vehicle}</p>
    <p><strong>Status:</strong> {selectedMitra.status}</p>
    <button onclick={selectMitraBack} class="btn-action btn-back">Back</button>
</div>

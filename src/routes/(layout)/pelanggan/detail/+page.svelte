
<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Pelanggan</title>
    <style>
        #pelanggan {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .breadcrumb {
            display: flex;
            flex-direction: column;
        }

        .breadcrumb-title {
            font-size: 24px;
            color: #00236F;
            font-weight: 500;
        }

        .breadcrumb-path {
            color: #6C6C6C;
        }

        .breadcrumb-current-path {
            color: #4A4A4A;
        }

        .card {
            background-color: white;
            border-radius: 4px;
            box-shadow: 0px 0px 20px 1px rgba(0, 48, 120, 0.1);
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
        }

        .card-title {
            font-size: 20px;
            font-weight: 600;
        }

        .input-group {
            display: flex;
            flex-direction: column;
        }

        input, textarea {
            border: 1px solid #8f8f9d
        }
    </style>
</svelte:head>

<div class="breadcrumb">
    <p class="breadcrumb-title">Detail Pelanggan</p>
    <p class="breadcrumb-path">Home / Pelanggan /<span class="breadcrumb-current-path">Detail Pelanggan</span></p>
</div>
<div class="card">
    <div class="input-group">
        <div class="input-group">
            <label>Nama Lengkap</label>
            <input type="text" readonly>
        </div>

        <div class="input-group">
            <label>Email</label>
            <input type="email" readonly>
        </div>

        <div class="input-group">
            <label>Username</label>
            <input type="text" readonly>
        </div>

        <div class="input-group">
            <label>Password</label>
            <input type="password" readonly>
        </div>

        <div class="input-group">
            <label>Tanggal Lahir</label>
            <input type="date" readonly>
        </div>

        <div class="input-group">
            <label>Nomor Telepon</label>
            <input type="tel" readonly>
        </div>

        <div class="input-group">
            <label>Nomor KTP</label>
            <input type="text" pattern="[0-9]{16}" readonly>
        </div>

        <div class="input-group">
            <label>Alamat</label>
            <textarea readonly></textarea>
        </div>
    </div>
</div>

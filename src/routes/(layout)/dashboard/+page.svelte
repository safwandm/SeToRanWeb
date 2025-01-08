<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</svelte:head>

<style>
    .wide-card {
        width: 347px;
        height: 92px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .card-title {
        color: #00236F;
    }

    .wide-card p {
        font-weight: 600;
        margin-bottom: 16px;
    }

    .tall {
        height: fit-content;
        display: block;
        margin-right: 4vw;
    }
</style>

<script>
	import { Popbox } from '$lib/popbox/popbox';
	import { onMount } from 'svelte';
	import { BaseApi } from '$lib/baseApi';
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import * as jqa from 'jquery';
	const jq = jqa.default;

	let popbox;

	function reloadData() {
	}

    let dashboardData = $state({
        "motors": {},
        "diskons": {},
        "mitras": {},
        "vouchers": {}
    });

    async function getMotorsData() {
        let motorsRequest = await BaseApi.ins.fetchAuth('/api/generic/motors');

        let motors = await motorsRequest.json();

        dashboardData.motors.total = motors.length
        dashboardData.motors.totalTersedia = motors.filter((motor) => motor.status_motor == "Tersedia").length;
        dashboardData.motors.totalDisewa = motors.filter((motor) => motor.status_motor == "Disewa").length;
        dashboardData.motors.totalDipesan = motors.filter((motor) => motor.status_motor == "Dipesan").length;
        dashboardData.motors.totalDalamPerbaikan = motors.filter((motor) => motor.status_motor == "Dalam Perbaikan").length;
        dashboardData.motors.totalTidakTersedia = motors.filter((motor) => motor.status_motor == "Tidak Tersedia").length;
    }

    async function getDiskonsData() {
        let diskonsRequest = await BaseApi.ins.fetchAuth('/api/diskon');

        let diskons = (await diskonsRequest.json()).data;

        console.log(diskons);

        dashboardData.diskons.total = diskons.length;
        dashboardData.diskons.totalAktif = diskons.filter((voucher) => voucher.status_promo == "aktif").length;
        dashboardData.diskons.totalNonAktif = diskons.filter((voucher) => voucher.status_promo == "nonaktif").length;


    }

    async function getMitrasData() {
        let mitrasRequest = await BaseApi.ins.fetchAuth('/api/mitras');

        let mitras = await mitrasRequest.json();

        dashboardData.mitras.total = mitras.length;
        dashboardData.mitras.totalAktif = mitras.filter((mitra) => mitra.status == "active").length;
        dashboardData.mitras.totalNonAktif = mitras.filter((mitra) => mitra.status == "inactive").length;

    }

    async function getVouchersData() {
        let vouchersRequest = await BaseApi.ins.fetchAuth('/api/generic/vouchers');

        let vouchers = await vouchersRequest.json();

        dashboardData.vouchers.total = vouchers.length;
        dashboardData.vouchers.totalAktif = vouchers.filter((voucher) => voucher.status_voucher == "aktif").length;
        dashboardData.vouchers.totalNonAktif = vouchers.filter((voucher) => voucher.status_voucher == "nonAktif").length;


    }

	onMount(async () => {
		popbox = new Popbox({
			blur: true,
			overlay: true
		});

        await getMotorsData();
        await getDiskonsData();
        await getMitrasData();
        await getVouchersData();

	});

</script>

<h2>Dashboard</h2>
<Breadcrumb.Root>
    <Breadcrumb.List>
        <Breadcrumb.Item>
            <Breadcrumb.Link>Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
            <Breadcrumb.Page>Dashboard</Breadcrumb.Page>
        </Breadcrumb.Item>
    </Breadcrumb.List>
</Breadcrumb.Root>

<div style="display: flex; justify-content:center; width: 100%; height: fit-content; margin-top: 16px;">

    <div class="card wide-card tall">
        <h3 class="card-title">Motor</h3>
        <p>Jumlah: <span>{dashboardData.motors.total}</span></p>
        <p>Tersedia: <span>{dashboardData.motors.totalTersedia}</span></p>
        <p>Disewa: <span>{dashboardData.motors.totalDisewa}</span></p>
        <p>Dipesan: <span>{dashboardData.motors.totalDipesan}</span></p>
        <p>Dalam Perbaikan: <span>{dashboardData.motors.totalDalamPerbaikan}</span></p>
        <p>Tidak Tersedia: <span>{dashboardData.motors.totalTidakTersedia}</span></p>
    </div>
    <div class="card wide-card tall">
        <p class="card-title">Mitra</p>
        <p>Jumlah: <span>{dashboardData.mitras.total}</span></p>
        <p>Aktif: <span>{dashboardData.mitras.totalAktif}</span></p>
        <p>Non-aktif: <span>{dashboardData.mitras.totalNonAktif}</span></p>
    </div>
    <div class="card wide-card tall">
        <p class="card-title">Diskons</p>
        <p>Jumlah: <span>{dashboardData.diskons.total}</span></p>
        <p>Aktif: <span>{dashboardData.diskons.totalAktif}</span></p>
        <p>Non-aktif: <span>{dashboardData.diskons.totalNonAktif}</span></p>
    </div>

</div>

<div style="display: flex; justify-content:center; width: 100%; height: fit-content; margin-top: 16px;">
    <div class="card wide-card tall">
        <p class="card-title">Voucher</p>
        <p>Jumlah: <span>{dashboardData.vouchers.total}</span></p>
        <p>Aktif: <span>{dashboardData.vouchers.totalAktif}</span></p>
        <p>Non-aktif: <span>{dashboardData.vouchers.totalNonAktif}</span></p>
    </div>
</div>



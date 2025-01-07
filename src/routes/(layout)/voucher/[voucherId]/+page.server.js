import { BaseApi } from '$lib/baseApi'

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    async function fetchVoucher() {
        // return BaseApi.ins.fetchAuth("/api/generic/vouchers/" + params['voucherId']).then(async res => {
        //     if (res.ok) {
        //         let js = await res.json()

        //         // biar gak ke update di server nya
        //         delete js.created_at
        //         delete js.updated_at

        //         return js
        //     } else {
        //         console.log(await res.text())
        //     }
        // })

        return fetch("http://localhost:3000/api/voucher/" + params['voucherId']).then(async res => {
            if (res.ok) {
                let js = await res.json()

                // biar gak ke update di server nya
                delete js.created_at
                delete js.updated_at

                return js
            } else {
                console.log(await res.text())
            }
        })
    }

    async function fetchUsed() {
        return BaseApi.ins.fetchAuth("/api/voucher/used/"  + params['voucherId']).then(res => res.json())
    }
    
	return {
		voucher: await fetchVoucher(),
        voucherUsed: await fetchUsed()
	};
}
// @ts-nocheck
import { BaseApi } from '$lib/baseApi'

/** @param {Parameters<import('./$types').PageLoad>[0]} event */
export async function load({ params }) {

    async function fetchVoucher() {
        return BaseApi.ins.fetchAuth("/api/vouchers/" + params['voucherId']).then(async res => {
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

	return {
		voucher: await fetchVoucher()
	};
}
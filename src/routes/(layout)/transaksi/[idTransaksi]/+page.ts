import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    return {
        idTransaksi: params.idTransaksi
    };
}) satisfies PageLoad;
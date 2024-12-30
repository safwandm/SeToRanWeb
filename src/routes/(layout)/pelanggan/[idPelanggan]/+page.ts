import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    return {
        idPelanggan: params.idPelanggan
    };
}) satisfies PageLoad;
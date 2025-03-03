import { BaseApi } from "$lib/baseApi"

export async function validate(formData) {
    let errors = {}

    if (!formData.kode_voucher) {
        errors.kode_voucher = "Required!"
    } else {
        var res = await BaseApi.ins.fetchAuth("/api/voucher/kode/" + formData.kode_voucher)
        // var res = await fetch("http://localhost:3000/api/voucher/kode/" + formData.kode_voucher)
        if (res.ok) {
            var js = await res.json()
            if (js.id_voucher != formData.id_voucher)
                errors.kode_voucher = "Kode voucher sudah digunakan"
        }
    }
    
    if (!formData.tanggal_mulai) {
        errors.tanggal = "Required!"
    }
    if (!formData.nama_voucher) {
        errors.nama_voucher = "Required!"
    }

    if (!formData.persen_voucher) {
        errors.persen_voucher = "Required!"
    }
    if (formData.persen_voucher <= 0 || formData.persen_voucher>100) {
        errors.persen_voucher = "Persen voucher harus di antara 1 dan 100 persen"
    }

    return errors
}
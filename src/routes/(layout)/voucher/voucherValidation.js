
export function validate(formData) {
    let errors = {}
    // TODO: cek kode voucher udah kepake apa belum ke backend
    if (!formData.kode_voucher) {
        errors.kode_voucher = "Required!"
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
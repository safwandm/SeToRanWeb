
export function validate(formData) {
    let errors = {}
    if (!formData.kode_voucher) {
        errors.kode_voucher = "Required!"
    }
    if (!formData.tanggal_mulai) {
        errors.tanggal = "Required!"
    }
    if (!formData.nama_voucher) {
        errors.nama_voucher = "Required!"
    }

    return errors
}
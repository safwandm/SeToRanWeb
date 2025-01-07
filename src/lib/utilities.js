export function formatStringDate(dateString) {
    if (dateString.includes('T')) {
        // asumsi format dari db yyyy-mm-ddThh:mm:ss
        let [date, time] = dateString.split('T');
        let [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    } else {
        // asumsi format dari db yyyy-mm-dd hh:mm:ss
        let [date, time] = dateString.split(' ');
        let [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    }
}

export function formatRupiah(price) {
    return 'Rp' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatDate(dateStr) {
    // Array of month abbreviations
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    try {
        // Create a Date object from the input string
        const date = new Date(dateStr);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        // Get day, month, and year
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        // Return formatted date string
        return `${day}-${month}-${year}`;
    } catch (error) {
        throw new Error(`Failed to parse date string: ${dateStr}. ${error.message}`);
    }
}
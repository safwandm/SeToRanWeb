export function formatStringDate(dateString) {
    // asumsi format dari db yyyy-mm-dd hh:mm:ss
    let [date, time] = dateString.split(' ');
    let [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}
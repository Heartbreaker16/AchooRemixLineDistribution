const convertTime = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    const m = parseInt(parts[0], 10);
    const sParts = parts[1].split('.');
    const s = parseInt(sParts[0], 10);
    const msStr = (sParts[1] || '0').padEnd(3, '0');
    const ms = parseInt(msStr, 10);
    return (m * 60 + s) * 1000 + ms;
}
module.exports = { convertTime };

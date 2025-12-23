export default function ormatTanggal(timestamp: string) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

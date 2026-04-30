// URL Web App Google Apps Script Anda (kosongkan dulu)
const GAS_URL = '';

// Simulasi Database Master (Akan diganti fetch dari GAS nanti)
let referensi = {
    // Kategori dibuat bersarang (Cascading)
    kategori: {
        "Kebutuhan Rumah Tangga": ["Belanja Dapur", "Listrik & Air", "Iuran Lingkungan"],
        "Konsumsi & Gaya Hidup": ["Makan Harian", "Jajan / Kopi", "Makan di Luar"],
        "Transportasi & Kendaraan": ["Bensin", "Servis Kendaraan", "Tol & Parkir", "Tiket Perjalanan"],
        "Olahraga & Rekreasi": ["Sewa Lapangan (Padel/Bola)", "Peralatan Olahraga"],
        "Masa Depan & Komitmen": ["Beli Emas 1g", "Tabungan"],
        "Bisnis Operasional": ["Talangan Bukuku", "Bahan Baku Pawonan"]
    },
    pelaku: ["Nudistian", "Alfiyah"],
    metodeBayar: ["Tunai", "QRIS", "Transfer", "Debit"],
    rekening: ["Kantong Bersama (Jago)", "BCA Pribadi", "BRImo", "Mandiri"]
};
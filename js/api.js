// URL Web App Google Apps Script Anda (kosongkan dulu)
const GAS_URL = '';

// Simulasi Database Master
let referensi = {
    // Kategori khusus Pengeluaran
    kategoriKeluar: {
        "Kebutuhan Rumah Tangga": ["Belanja Dapur", "Listrik & Air", "Iuran Lingkungan"],
        "Konsumsi & Gaya Hidup": ["Makan Harian", "Jajan / Kopi", "Makan di Luar"],
        "Transportasi & Kendaraan": ["Bensin", "Servis Kendaraan", "Tol & Parkir", "Tiket Perjalanan"],
        "Olahraga & Rekreasi": ["Sewa Lapangan (Padel/Bola)", "Peralatan Olahraga"],
        "Masa Depan & Komitmen": ["Beli Emas 1g", "Tabungan"],
        "Bisnis Operasional": ["Talangan Bukuku", "Bahan Baku Pawonan"]
    },
    // Kategori khusus Pemasukan
    kategoriMasuk: {
        "Gaji & Pekerjaan": ["Gaji Nudistian", "Gaji Alfiyah", "Bonus / THR"],
        "Pendapatan Bisnis": ["Profit Bukuku", "Profit Pawonan", "Penjualan Aset Bisnis"],
        "Pendapatan Lainnya": ["Bunga/Return Investasi", "Cashback", "Pemberian/Hadiah"]
    },
    pelaku: ["Nudistian", "Alfiyah"],
    metodeBayar: ["Tunai", "QRIS", "Transfer", "Debit"],
    rekening: ["Kantong Bersama (Jago)", "BCA Pribadi", "BRImo", "Mandiri"]
};
// File: js/api.js

// 1. URL Web App Google Apps Script Anda (Ganti dengan URL milik Anda)
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw2D4Fn7U692_dSF-7hSbOBXXSvT9FOaQiBRFO909CLjgEfqFg5jGdHCAznENaEfpHl/exec'; 

// 2. Database Master (Referensi Dropdown)
let referensi = {
    kategoriKeluar: {
        "Kebutuhan Rumah Tangga": ["Belanja Dapur", "Listrik & Air", "Iuran Lingkungan"],
        "Konsumsi & Gaya Hidup": ["Makan Harian", "Jajan / Kopi", "Makan di Luar"],
        "Transportasi & Kendaraan": ["Bensin", "Servis Kendaraan", "Tol & Parkir", "Tiket Perjalanan"],
        "Olahraga & Rekreasi": ["Sewa Lapangan (Padel/Bola)", "Peralatan Olahraga"],
        "Masa Depan & Komitmen": ["Beli Emas 1g", "Tabungan"],
        "Bisnis Operasional": ["Talangan Bukuku", "Bahan Baku Pawonan"]
    },
    kategoriMasuk: {
        "Gaji & Pekerjaan": ["Gaji Nudistian", "Gaji Alfiyah", "Bonus / THR"],
        "Pendapatan Bisnis": ["Profit Bukuku", "Profit Pawonan", "Penjualan Aset Bisnis"],
        "Pendapatan Lainnya": ["Bunga/Return Investasi", "Cashback", "Pemberian/Hadiah"]
    },
    pelaku: ["Nudistian", "Alfiyah"],
    metodeBayar: ["Tunai", "QRIS", "Transfer", "Debit"],
    rekening: ["Kantong Bersama (Jago)", "BCA Pribadi", "BRImo", "Mandiri"]
};

// 3. Wadah untuk menyimpan semua transaksi dari Sheet
let databaseTransaksi = []; 

// 4. Fungsi menyedot data dari Google Sheets
async function tarikDataDariSheet() {
    try {
        const respon = await fetch(GAS_URL);
        const hasil = await respon.json();
        
        if (hasil.status === "sukses") {
            databaseTransaksi = hasil.data;
            console.log("Berhasil menarik " + databaseTransaksi.length + " data transaksi.");
            return true;
        } else {
            console.error("Gagal tarik data:", hasil.pesan);
            return false;
        }
    } catch (error) {
        console.error("Error jaringan saat tarik data:", error);
        return false;
    }
}
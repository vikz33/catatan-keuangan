// File: js/api.js

const GAS_URL = 'https://script.google.com/macros/s/AKfycbw2D4Fn7U692_dSF-7hSbOBXXSvT9FOaQiBRFO909CLjgEfqFg5jGdHCAznENaEfpHl/exec'; 

// Data Global yang menaungi seluruh profil
// Data Global yang menaungi seluruh profil
const defaultReferensi = {
    daftarBisnis: ["Bukuku", "Pawonan"], 
    
    dataProfil: {
        "Pribadi": {
            kategoriKeluar: {
                "Kebutuhan Rumah Tangga": ["Belanja Dapur", "Listrik & Air", "Iuran Lingkungan"],
                "Konsumsi & Gaya Hidup": ["Makan Harian", "Jajan / Kopi", "Makan di Luar"],
                "Transportasi & Kendaraan": ["Bensin", "Servis Kendaraan", "Tol & Parkir"],
                "Masa Depan & Komitmen": ["Beli Emas 1g", "Tabungan"],
                "Bisnis Operasional": ["Suntik Modal Bisnis"]
            },
            kategoriMasuk: {
                "Gaji & Pekerjaan": ["Gaji Nudistian", "Gaji Alfiyah", "Bonus / THR"],
                "Pendapatan Lainnya": ["Bunga/Return", "Hadiah"]
            },
            rekening: ["Kantong Bersama (Jago)", "BCA Pribadi", "BRImo", "Mandiri"],
            kontak: ["Keluarga", "Teman"]
        },
        "Bukuku": {
            kategoriKeluar: {
                "Operasional Web": ["Hosting/Domain", "Software/Tools"],
                "Produksi": ["Cetak", "Packing"]
            },
            kategoriMasuk: {
                "Penjualan": ["Penjualan Buku"],
                "Pendanaan": ["Suntikan Modal Pribadi"]
            },
            rekening: ["Kas Bukuku (Jago)"],
            kontak: ["Vendor Cetak", "Supplier Dus"]
        },
        "Pawonan": {
            kategoriKeluar: {
                "Bahan Baku": ["Belanja Pasar", "Gas", "Kemasan"],
                "Operasional": ["Listrik/Air Outlet", "Sewa"]
            },
            kategoriMasuk: {
                "Penjualan": ["Penjualan Harian", "Katering Pesanan"],
                "Pendanaan": ["Suntikan Modal Pribadi"]
            },
            rekening: ["Laci Pawonan"],
            kontak: ["Supplier Ayam", "Toko Sayur"]
        }
    },

    pelaku: ["Nudistian", "Alfiyah"],
    metodeBayar: ["Tunai", "QRIS", "Transfer", "Debit"]
};

// Logika LocalStorage
let referensi;
const dataTersimpan = localStorage.getItem('dataMasterKeuanganMulti'); // Nama key dibedakan agar tidak bentrok dengan versi lama

if (dataTersimpan) {
    referensi = JSON.parse(dataTersimpan);
} else {
    referensi = JSON.parse(JSON.stringify(defaultReferensi));
    localStorage.setItem('dataMasterKeuanganMulti', JSON.stringify(referensi));
}

let databaseTransaksi = []; 

// Variabel Global untuk melacak aplikasi sedang di mode/profil apa
let profilAktif = "Pribadi"; // Default selalu pribadi

async function tarikDataDariSheet() {
    try {
        const respon = await fetch(GAS_URL);
        const hasil = await respon.json();
        if (hasil.status === "sukses") {
            databaseTransaksi = hasil.data;
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error tarik data:", error);
        return false;
    }
}
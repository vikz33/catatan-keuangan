let chartInstance = null;

// Dipanggil saat aplikasi pertama kali dibuka (di app.js)
async function initDashboard() { 
    // Tampilkan tulisan loading di kartu
    document.querySelector('.card-in h3').innerText = "Memuat...";
    document.querySelector('.card-out h3').innerText = "Memuat...";
    
    // Tarik data dari Google Sheets
    await tarikDataDariSheet();
    
    // Default: Tampilkan data "Bulan Ini"
    prosesDashboard('Bulan Ini');
}

// Format Angka ke Rupiah (misal: 1500000 -> Rp 1.500.000)
function formatRupiah(angka) {
    return "Rp " + parseInt(angka).toLocaleString('id-ID');
}

function setFilter(btnElement) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');

    let customContainer = document.getElementById('customDateContainer');
    let rentangWaktu = btnElement.innerText;
    
    if (rentangWaktu === 'Custom') {
        customContainer.style.display = 'flex';
    } else {
        customContainer.style.display = 'none';
        prosesDashboard(rentangWaktu);
    }
}

function applyCustomFilter() {
    let start = document.getElementById('startDate').value;
    let end = document.getElementById('endDate').value;
    
    if(!start || !end) {
        alert('Pilih Tanggal Awal dan Akhir!');
        return;
    }
    prosesDashboard('Custom', start, end);
}

// Fungsi Utama: Memfilter, Menghitung, dan Menggambar
function prosesDashboard(filterMode, customStart = null, customEnd = null) {
    let dataTersaring = databaseTransaksi.filter(trx => {
        // Abaikan Mutasi agar tidak merusak perhitungan Pemasukan/Pengeluaran riil
        if (trx.jenis === "Mutasi") return false; 
        
        let tglTrx = new Date(trx.tanggal);
        let hariIni = new Date();
        tglTrx.setHours(0,0,0,0);
        hariIni.setHours(0,0,0,0);
        
        if (filterMode === 'Hari Ini') {
            return tglTrx.getTime() === hariIni.getTime();
        } else if (filterMode === 'Minggu Ini') {
            let awalMinggu = new Date(hariIni);
            awalMinggu.setDate(hariIni.getDate() - hariIni.getDay() + 1); // Senin
            return tglTrx >= awalMinggu && tglTrx <= hariIni;
        } else if (filterMode === 'Bulan Ini') {
            return tglTrx.getMonth() === hariIni.getMonth() && tglTrx.getFullYear() === hariIni.getFullYear();
        } else if (filterMode === 'Tahun Ini') {
            return tglTrx.getFullYear() === hariIni.getFullYear();
        } else if (filterMode === 'Custom') {
            let start = new Date(customStart);
            let end = new Date(customEnd);
            start.setHours(0,0,0,0); end.setHours(23,59,59,999);
            return tglTrx >= start && tglTrx <= end;
        }
        return true;
    });

    hitungSummary(dataTersaring);
    gambarGrafik(dataTersaring);
}

function hitungSummary(data) {
    let totalMasuk = 0;
    let totalKeluar = 0;

    data.forEach(trx => {
        if (trx.jenis === "Masuk") {
            totalMasuk += Number(trx.nominal);
        } else if (trx.jenis === "Keluar") {
            totalKeluar += Number(trx.nominal);
        }
    });

    document.querySelector('.card-in h3').innerText = formatRupiah(totalMasuk);
    document.querySelector('.card-out h3').innerText = formatRupiah(totalKeluar);
}

function gambarGrafik(data) {
    // Kelompokkan pengeluaran berdasarkan Kategori Utama
    let dataGrafik = {};
    data.forEach(trx => {
        if (trx.jenis === "Keluar") {
            if (!dataGrafik[trx.kategoriUtama]) dataGrafik[trx.kategoriUtama] = 0;
            dataGrafik[trx.kategoriUtama] += Number(trx.nominal);
        }
    });

    let labelKategori = Object.keys(dataGrafik);
    let nominalKategori = Object.values(dataGrafik);

    const ctx = document.getElementById('kategoriChart').getContext('2d');
    if(chartInstance) chartInstance.destroy(); // Hapus grafik lama
    
    // Jika tidak ada pengeluaran, tampilkan grafik abu-abu kosong
    if (labelKategori.length === 0) {
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: ['Belum ada data'], datasets: [{ data: [1], backgroundColor: ['#333333'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { tooltip: {enabled: false} } }
        });
        return;
    }

    // Warna-warni Neon Artline
    let paletWarna = ['#ff3366', '#00ff66', '#ffcc00', '#00ccff', '#cc33ff', '#ff9900'];

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labelKategori,
            datasets: [{
                data: nominalKategori,
                backgroundColor: paletWarna,
                borderColor: '#0a0a0a',
                borderWidth: 2
            }]
        },
        options: { 
            responsive: true, maintainAspectRatio: false, cutout: '75%', 
            plugins: { 
                legend: { position: 'bottom', labels: { color: '#f0f0f0', usePointStyle: true, boxWidth: 10, font: { family: 'Inter', size: 12 } } },
                tooltip: { callbacks: { label: function(context) { return " " + formatRupiah(context.raw); } } }
            } 
        }
    });
}
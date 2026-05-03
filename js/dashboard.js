let chartInstance = null;

// Dipanggil saat aplikasi pertama kali dibuka (di app.js)
async function initDashboard() { 
    document.querySelector('.card-in h3').innerText = "Memuat...";
    document.querySelector('.card-out h3').innerText = "Memuat...";
    document.getElementById('totalUtangMurni').innerText = "...";
    document.getElementById('totalPiutangMurni').innerText = "...";
    
    // Tarik kedua data secara bersamaan dari Google Sheets
    await Promise.all([
        tarikDataDariSheet(),
        tarikDataUtangDariSheet()
    ]);
    
    prosesDashboard('Bulan Ini');
    renderBukuUtang(); // Panggil fungsi render utang
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
// ==========================================
// STATE GRAFIK DASHBOARD
// ==========================================
let chartDisplayMode = 'Semua'; // Pilihan: 'Semua', 'Masuk', 'Keluar'

window.toggleChartMode = function(mode) {
    // Jika kartu yang sama diklik lagi, kembalikan ke mode 'Semua'
    if (chartDisplayMode === mode) {
        chartDisplayMode = 'Semua';
    } else {
        chartDisplayMode = mode;
    }
    
    // Beri efek redup pada kartu yang tidak aktif
    document.querySelector('.card-in').style.opacity = (chartDisplayMode === 'Semua' || chartDisplayMode === 'Masuk') ? '1' : '0.4';
    document.querySelector('.card-out').style.opacity = (chartDisplayMode === 'Semua' || chartDisplayMode === 'Keluar') ? '1' : '0.4';
    
    // Render ulang grafik
    let filterAktif = document.querySelector('.filter-btn.active').innerText;
    prosesDashboard(filterAktif);
}

// Fungsi Utama: Memfilter, Menghitung, dan Menggambar
window.prosesDashboard = function(filterMode, customStart = null, customEnd = null) {
    let dataTersaring = databaseTransaksi.filter(trx => {
        // 🚨 FIX UTAMA: Pastikan data HANYA milik profil yang sedang terbuka!
        if (trx.profil !== profilAktif) return false; 
        
        // Abaikan Mutasi
        if (trx.jenis === "Mutasi") return false; 
        
        let tglTrx = new Date(trx.tanggal);
        let hariIni = new Date();
        tglTrx.setHours(0,0,0,0);
        hariIni.setHours(0,0,0,0);
        
        if (filterMode === 'Hari Ini') {
            return tglTrx.getTime() === hariIni.getTime();
        } else if (filterMode === 'Minggu Ini') {
            let awalMinggu = new Date(hariIni);
            awalMinggu.setDate(hariIni.getDate() - hariIni.getDay() + 1);
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
    renderRiwayatTransaksi(dataTersaring);
}

function renderRiwayatTransaksi(data) {
    let container = document.getElementById('daftarRiwayatDash');
    let html = '';

    // Jika sedang klik kartu Pemasukan, hanya tampilkan list pemasukan. Jika Semua, tampilkan semua.
    let dataList = data;
    if (chartDisplayMode !== 'Semua') {
        dataList = data.filter(t => t.jenis === chartDisplayMode);
    }

    if (dataList.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 12px; margin-top: 20px;">Tidak ada transaksi pada periode ini.</p>`;
        return;
    }

    dataList.slice().reverse().forEach(trx => { // Reverse agar yang terbaru di atas
        let isMasuk = trx.jenis === "Masuk";
        let color = isMasuk ? "var(--success)" : (trx.jenis === "Mutasi" ? "var(--warning)" : "var(--danger)");
        
        html += `
        <div style="background: var(--input-bg); border-radius: 10px; padding: 12px; border-left: 4px solid ${color}; display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <strong style="font-size: 13px; color: var(--text-main);">${trx.kategoriUtama}</strong>
                    <span style="font-size: 11px; color: var(--text-muted);">${trx.tanggal}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">${trx.subKategori} • via ${trx.rekening}</div>
                <div style="font-size: 14px; font-weight: bold; color: ${color};">${isMasuk ? '+' : '-'} Rp ${Number(trx.nominal).toLocaleString('id-ID')}</div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 5px; margin-left: 15px;">
                <button onclick="editTrx(${trx.rowId})" style="background: var(--primary); color: #fff; border: none; border-radius: 6px; padding: 4px 8px; font-size: 10px; cursor: pointer;">Edit</button>
                <button onclick="hapusTrx(${trx.rowId})" style="background: var(--danger); color: #fff; border: none; border-radius: 6px; padding: 4px 8px; font-size: 10px; cursor: pointer;">Hapus</button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function hitungSummary(data) {
    let totalMasuk = 0;
    let totalKeluar = 0;

    data.forEach(trx => {
        if (trx.jenis === "Masuk") totalMasuk += Number(trx.nominal);
        else if (trx.jenis === "Keluar") totalKeluar += Number(trx.nominal);
    });

    document.getElementById('txtMasukDash').innerText = formatRupiah(totalMasuk);
    document.getElementById('txtKeluarDash').innerText = formatRupiah(totalKeluar);
}

function gambarGrafik(data) {
    let dataGrafik = {};
    let judulChart = "Pemasukan vs Pengeluaran";
    let warnaChart = [];

    // Palet warna khusus agar Masuk=Hijau/Biru, Keluar=Merah/Oren
    const warnaPemasukan = ['#4ade80', '#2dd4bf', '#3b82f6', '#60a5fa', '#34d399'];
    const warnaPengeluaran = ['#f43f5e', '#fb923c', '#fbbf24', '#f87171', '#a855f7'];

    if (chartDisplayMode === 'Semua') {
        judulChart = "Pemasukan vs Pengeluaran (Total)";
        let totMasuk = 0, totKeluar = 0;
        
        data.forEach(trx => {
            if(trx.jenis === 'Masuk') totMasuk += Number(trx.nominal);
            if(trx.jenis === 'Keluar') totKeluar += Number(trx.nominal);
        });
        
        if(totMasuk > 0) dataGrafik['Total Pemasukan'] = totMasuk;
        if(totKeluar > 0) dataGrafik['Total Pengeluaran'] = totKeluar;
        
        warnaChart = ['#4ade80', '#D68C73']; // Hijau & Terracotta
        
    } else {
        judulChart = chartDisplayMode === 'Masuk' ? "Distribusi Pemasukan" : "Distribusi Pengeluaran";
        
        data.forEach(trx => {
            if (trx.jenis === chartDisplayMode) {
                if (!dataGrafik[trx.kategoriUtama]) dataGrafik[trx.kategoriUtama] = 0;
                dataGrafik[trx.kategoriUtama] += Number(trx.nominal);
            }
        });
        
        // Gunakan palet sesuai jenis yang diklik!
        warnaChart = chartDisplayMode === 'Masuk' ? warnaPemasukan : warnaPengeluaran;
    }

    document.getElementById('judulChartDash').innerText = judulChart;

    let labelKategori = Object.keys(dataGrafik);
    let nominalKategori = Object.values(dataGrafik);

    const ctx = document.getElementById('kategoriChart').getContext('2d');
    if(chartInstance) chartInstance.destroy(); 
    
    if (labelKategori.length === 0) {
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: ['Belum ada data'], datasets: [{ data: [1], backgroundColor: ['#333333'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { tooltip: {enabled: false} } }
        });
        return;
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labelKategori,
            datasets: [{
                data: nominalKategori,
                backgroundColor: warnaChart,
                borderColor: '#1a1a1a',
                borderWidth: 2
            }]
        },
        options: { 
            responsive: true, maintainAspectRatio: false, cutout: '70%', 
            plugins: { 
                legend: { position: 'bottom', labels: { color: '#a0a0a0', usePointStyle: true, boxWidth: 10, font: { family: 'Inter', size: 12 } } },
                tooltip: { callbacks: { label: function(context) { return " " + formatRupiah(context.raw); } } }
            } 
        }
    });
}


// STATE & FILTER BUKU UTANG

let tipeUtangAktif = "Semua"; 
let statusUtangAktif = "Semua"; 

window.setTipeUtang = function(tipe) {
    // Jika tombol yang sama diklik lagi, kembalikan ke Semua
    if (tipeUtangAktif === tipe) {
        tipeUtangAktif = "Semua";
    } else {
        tipeUtangAktif = tipe;
    }
    
    // Ubah opasitas kartu yang diklik
    document.getElementById('cardUtang').style.opacity = (tipeUtangAktif === 'Semua' || tipeUtangAktif === 'Utang') ? '1' : '0.4';
    document.getElementById('cardPiutang').style.opacity = (tipeUtangAktif === 'Semua' || tipeUtangAktif === 'Piutang') ? '1' : '0.4';
    
    if (tipeUtangAktif === "Semua") document.getElementById('judulDaftarUtang').innerText = "Semua Catatan (Utang & Piutang)";
    else if (tipeUtangAktif === "Utang") document.getElementById('judulDaftarUtang').innerText = "Daftar Utang Saya";
    else document.getElementById('judulDaftarUtang').innerText = "Daftar Piutang (Uang di Luar)";
    
    renderBukuUtang();
}

window.setFilterStatusUtang = function(status, btnEl) {
    statusUtangAktif = status;
    
    // Ubah warna tombol filter kecil
    let container = btnEl.parentElement;
    container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    
    renderBukuUtang();
}

window.renderBukuUtang = function() {
    let container = document.getElementById('daftarBukuUtang');
    let totUtangEl = document.getElementById('totalUtangMurni');
    let totPiutangEl = document.getElementById('totalPiutangMurni');

    let totalSisaUtang = 0;
    let totalSisaPiutang = 0;
    let html = '';

    // 1. Ambil data HANYA untuk profil bisnis yang aktif
    let dataUtangProfilIni = databaseUtang.filter(u => u.profil === profilAktif);

    // 2. Kalkulasi "Summary Box" Atas (Hitung total keseluruhan tanpa terpengaruh filter)
    dataUtangProfilIni.forEach((item) => {
        let nominalAsli = Number(item.nominal) || 0;
        let terbayar = Number(item.terbayar) || 0;
        let sisa = nominalAsli - terbayar;
        let isLunas = sisa <= 0 || item.status === "Lunas";

        if (item.jenis === "Utang" && !isLunas) totalSisaUtang += sisa;
        if (item.jenis === "Piutang" && !isLunas) totalSisaPiutang += sisa;
    });

    totUtangEl.innerText = formatRupiah(totalSisaUtang);
    totPiutangEl.innerText = formatRupiah(totalSisaPiutang);

    // 3. Terapkan Filter Tipe (Utang vs Piutang vs Semua)
    let dataTersaring = dataUtangProfilIni;
    if (tipeUtangAktif !== "Semua") {
        dataTersaring = dataTersaring.filter(u => u.jenis === tipeUtangAktif);
    }

    // 4. Terapkan Filter Status (Belum Lunas / Lunas / Semua)
    dataTersaring = dataTersaring.filter(u => {
        let sisa = (Number(u.nominal) || 0) - (Number(u.terbayar) || 0);
        let isLunas = sisa <= 0 || u.status === "Lunas";
        
        if (statusUtangAktif === "Belum Lunas") return !isLunas;
        if (statusUtangAktif === "Lunas") return isLunas;
        return true; // Jika "Semua"
    });

    // 5. Render ke Layar
    if(dataTersaring.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 13px; margin-top: 50px;">Tidak ada data (${tipeUtangAktif} - ${statusUtangAktif}).</p>`;
        return;
    }

    dataTersaring.slice().reverse().forEach((item) => {
        let isUtang = item.jenis === "Utang";
        let nominalAsli = Number(item.nominal) || 0;
        let terbayar = Number(item.terbayar) || 0;
        let sisa = nominalAsli - terbayar;
        let isLunas = sisa <= 0 || item.status === "Lunas";

        let color = isUtang ? 'var(--warning)' : 'var(--primary)';
        let txtWarna = isUtang ? '#a05e03' : '#1e40af'; 
        let persen = isLunas ? 100 : (terbayar / nominalAsli) * 100;

        html += `
        <div style="background: var(--bg-surface); padding: 15px; border-radius: 12px; margin-bottom: 10px; border-left: 5px solid ${isLunas ? 'var(--success)' : color}; box-shadow: 0 4px 10px rgba(0,0,0,0.03); opacity: ${isLunas ? '0.7' : '1'};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong style="color: var(--text-main); font-size: 14px; display: flex; align-items: center; gap: 6px;">
                    ${item.kontak} 
                    ${isLunas ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
                    <span style="font-size: 10px; background: ${color}; color: #1a1a1a; padding: 2px 6px; border-radius: 4px; opacity: 0.8; font-weight: normal;">${item.jenis}</span>
                </strong>
                <span style="font-size: 11px; color: var(--text-muted);">${item.tanggal}</span>
            </div>
            
            <div style="margin-bottom: 10px;">
                <h4 style="margin: 0 0 5px 0; font-size: 16px; color: ${isLunas ? 'var(--success)' : txtWarna};">Sisa: Rp ${sisa.toLocaleString('id-ID')}</h4>
                <div style="width: 100%; background: var(--border-color); height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${persen}%; background: ${isLunas ? 'var(--success)' : color}; height: 100%;"></div>
                </div>
                <p style="margin: 4px 0 0 0; font-size: 10px; color: var(--text-muted);">Terbayar: Rp ${terbayar.toLocaleString('id-ID')} dari Rp ${nominalAsli.toLocaleString('id-ID')}</p>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 10px; background: var(--input-bg); padding: 4px 8px; border-radius: 6px;">Tempo: ${item.jatuhTempo}</span>
                ${!isLunas ? `<button style="background: ${color}; color: #1a202c; border: none; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: bold; cursor:pointer;" onclick="bukaModalCicilan(${item.rowId}, '${item.jenis}', '${item.kontak}', ${sisa})">Bayar / Cicil</button>` : `<span style="font-size: 11px; font-weight: bold; color: var(--success);">LUNAS</span>`}
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

// Logika Membuka Modal & Mengirim Cicilan //
window.bukaModalCicilan = function(rowId, jenis, kontak, sisa) {
    document.getElementById('modalCicilan').style.display = 'flex';
    document.getElementById('cicilanRowId').value = rowId;
    document.getElementById('cicilanJenisAsli').value = jenis;
    document.getElementById('cicilanKontak').value = kontak;
    
    let infoTxt = jenis === "Utang" ? `Anda akan membayar utang kepada <b>${kontak}</b>.` : `Anda menerima pembayaran dari <b>${kontak}</b>.`;
    document.getElementById('infoSisaUtang').innerHTML = `${infoTxt}<br>Sisa Tagihan: <b>Rp ${sisa.toLocaleString('id-ID')}</b>`;
    
    document.getElementById('tanggalCicilan').valueAsDate = new Date();
    document.getElementById('nominalCicilan').value = '';
    
    // Auto-format angka
    const nomCicil = document.getElementById('nominalCicilan');
    let clone = nomCicil.cloneNode(true);
    nomCicil.parentNode.replaceChild(clone, nomCicil);
    clone.addEventListener('input', function(e) {
        let angka = this.value.replace(/[^0-9]/g, '');
        this.value = angka ? parseInt(angka, 10).toLocaleString('id-ID') : '';
    });

    // Isi dropdown rekening sesuai profil
    let selectRek = document.getElementById('rekeningCicilan');
    selectRek.innerHTML = '';
    referensi.dataProfil[profilAktif].rekening.forEach(r => selectRek.add(new Option(r, r)));
}

window.prosesCicilan = async function() {
    let nominal = document.getElementById('nominalCicilan').value.replace(/\./g, '');
    let rekening = document.getElementById('rekeningCicilan').value;
    
    if(!nominal || !rekening) return alert("Isi nominal dan rekening!");

    let btn = document.querySelector('#modalCicilan .submit-btn');
    btn.innerText = "⏳ Memproses..."; btn.disabled = true;

    const dataKirim = {
        action: "cicilUtang",
        profil: profilAktif,
        rowId: document.getElementById('cicilanRowId').value,
        jenisUtangAsli: document.getElementById('cicilanJenisAsli').value,
        kontak: document.getElementById('cicilanKontak').value,
        nominalCicilan: parseInt(nominal),
        rekening: rekening,
        tanggal: document.getElementById('tanggalCicilan').value,
        catatan: document.getElementById('catatanCicilan').value || "-"
    };

    try {
        const respon = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dataKirim)
        });
        const hasil = await respon.json();

        if (hasil.status === "sukses") {
            alert("✅ Pembayaran berhasil dicatat!");
            document.getElementById('modalCicilan').style.display = 'none';
            // Tarik ulang data untuk me-refresh layar
            await Promise.all([ tarikDataDariSheet(), tarikDataUtangDariSheet() ]);
            prosesDashboard(document.querySelector('.filter-btn.active').innerText);
            renderBukuUtang();
        } else { alert("❌ Gagal: " + hasil.pesan); }
    } catch (err) { alert("🚨 Error: " + err.message); } 
    finally { btn.innerText = "Konfirmasi Pembayaran"; btn.disabled = false; }
}
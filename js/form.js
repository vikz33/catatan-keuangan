// File: js/form.js

let jenisTransaksiAktif = "Keluar";

function initForm() {
    document.getElementById('tanggal').valueAsDate = new Date();
    
    // Auto-Format Nominal (Rupiah)
    const nominalInput = document.getElementById('nominal');
    if (nominalInput) {
        nominalInput.addEventListener('input', function(e) {
            let angka = this.value.replace(/[^0-9]/g, '');
            if(angka) {
                this.value = parseInt(angka, 10).toLocaleString('id-ID');
            } else {
                this.value = '';
            }
        });
    }

    // Logika Tombol Masuk/Keluar/Mutasi
    document.querySelectorAll('.seg-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if(jenisTransaksiAktif !== this.getAttribute('data-val')) {
                document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                jenisTransaksiAktif = this.getAttribute('data-val');
                
                renderSemuaDropdown(); 
                aturLogikaForm();
            }
        });
    });

    document.getElementById('metodeBayar').addEventListener('change', aturLogikaForm);
    
    // PENTING: Event Listener agar sub-kategori berubah saat kategori utama diubah
    document.getElementById('kategoriUtama').addEventListener('change', function() {
        renderSubKategori(this.value);
    });

    renderSemuaDropdown();
    aturLogikaForm();
}

function aturLogikaForm() {
    const wTanggal = document.getElementById('wrap-tanggal');
    const wKatUtama = document.getElementById('wrap-kategoriUtama');
    const wSubKat = document.getElementById('wrap-subKategori');
    const wPelaku = document.getElementById('wrap-pelaku');
    const wMetode = document.getElementById('wrap-metodeBayar');
    const wRekening = document.getElementById('wrap-rekening');
    const wAsal = document.getElementById('wrap-rekAsal');
    const wTujuan = document.getElementById('wrap-rekTujuan');
    const wNominal = document.getElementById('wrap-nominal');
    const wCatatan = document.getElementById('wrap-catatan');

    let metode = document.getElementById('metodeBayar').value;

    // Sembunyikan semuanya terlebih dahulu
    [wKatUtama, wSubKat, wPelaku, wMetode, wRekening, wAsal, wTujuan].forEach(el => {
        if(el) el.style.display = 'none';
    });

    if (jenisTransaksiAktif === "Mutasi") {
        if(wAsal) wAsal.style.display = 'block';
        if(wTujuan) wTujuan.style.display = 'block';

        if(wTanggal) wTanggal.style.order = 1;
        if(wAsal) wAsal.style.order = 2;
        if(wTujuan) wTujuan.style.order = 3;
        if(wNominal) wNominal.style.order = 4;
        if(wCatatan) wCatatan.style.order = 5;
    } else {
        if(wKatUtama) wKatUtama.style.display = 'block';
        if(wSubKat) wSubKat.style.display = 'block';
        if(wPelaku) wPelaku.style.display = 'block';
        if(wMetode) wMetode.style.display = 'block';

        if (metode !== "Tunai" && referensi.metodeBayar.length > 0) {
            if(wRekening) wRekening.style.display = 'block';
        }

        if(wTanggal) wTanggal.style.order = 1;
        if(wNominal) wNominal.style.order = 2;
        if(wKatUtama) wKatUtama.style.order = 3;
        if(wSubKat) wSubKat.style.order = 4;
        if(wPelaku) wPelaku.style.order = 5;
        if(wMetode) wMetode.style.order = 6;
        if(wRekening) wRekening.style.order = 7;
        if(wCatatan) wCatatan.style.order = 8;
    }
}

// Fungsi Utama Perenderan Kategori
function renderSemuaDropdown() {
    // Ambil data khusus dari profil yang sedang aktif
    let dataProfilKita = referensi.dataProfil[profilAktif];
    let sourceKategori = (jenisTransaksiAktif === "Masuk") ? dataProfilKita.kategoriMasuk : dataProfilKita.kategoriKeluar;
    
    let selectKatUtama = document.getElementById('kategoriUtama');
    selectKatUtama.innerHTML = ''; // Kosongkan dulu

    if (sourceKategori) {
        let katKeys = Object.keys(sourceKategori);
        
        if (katKeys.length > 0) {
            katKeys.forEach(item => selectKatUtama.add(new Option(item, item)));
            // Otomatis render sub-kategori untuk pilihan paling atas
            renderSubKategori(katKeys[0]);
        } else {
            selectKatUtama.add(new Option("- Belum ada Kategori Utama -", ""));
            renderSubKategori(""); // Paksa kosongkan sub-kategori
        }
    }

    isiDropdown('pelaku', referensi.pelaku);
    isiDropdown('metodeBayar', referensi.metodeBayar);
    
    isiDropdown('rekening', dataProfilKita.rekening);
    isiDropdown('rekeningAsal', dataProfilKita.rekening);
    isiDropdown('rekeningTujuan', dataProfilKita.rekening);
}

// Fungsi Spesifik Perenderan Sub-Kategori
function renderSubKategori(kategoriTerpilih) {
    let selectSub = document.getElementById('subKategori');
    selectSub.innerHTML = ''; // Kosongkan dulu

    if (!kategoriTerpilih) {
        selectSub.add(new Option("- Kosong -", ""));
        return;
    }

    let dataProfilKita = referensi.dataProfil[profilAktif];
    let sourceKategori = (jenisTransaksiAktif === "Masuk") ? dataProfilKita.kategoriMasuk : dataProfilKita.kategoriKeluar;
    
    // Cek apakah kategori utamanya valid dan memiliki array sub-kategori
    if (sourceKategori && sourceKategori[kategoriTerpilih]) {
        let subKategoriList = sourceKategori[kategoriTerpilih];
        if (subKategoriList.length > 0) {
            subKategoriList.forEach(item => selectSub.add(new Option(item, item)));
        } else {
            selectSub.add(new Option("- Belum ada Sub-Kategori -", ""));
        }
    } else {
        selectSub.add(new Option("- Kosong -", ""));
    }
}

function isiDropdown(idSelect, arrayData) {
    let select = document.getElementById(idSelect);
    if(select) {
        select.innerHTML = '';
        if (arrayData && arrayData.length > 0) {
            arrayData.forEach(item => select.add(new Option(item, item)));
        } else {
            select.add(new Option("- Kosong -", ""));
        }
    }
}

async function simpanTransaksi() {
    let nominalInput = document.getElementById('nominal');
    let nominalKotor = nominalInput.value;
    let nominalBersih = nominalKotor.replace(/\./g, ''); 

    if(!nominalBersih) { 
        alert("Nominal belum diisi."); 
        return; 
    }

    // Pastikan kita mengunci tombol di Form Input (bukan form utang)
    const submitBtn = document.querySelector('#formInput .submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.classList.add('btn-loading');
    submitBtn.innerText = "Memproses...";
    submitBtn.disabled = true;

    // 🚨 CEK APAKAH SEDANG EDIT ATAU INPUT BARU
    let idEdit = document.getElementById('editRowId').value;

    // Siapkan bungkusan data
    const dataKirim = {
        action: idEdit ? "editTransaksi" : "", // Jika ada ID, suruh Backend lakukan Edit
        rowId: idEdit ? parseInt(idEdit) : null,
        profil: profilAktif, 
        tanggal: document.getElementById('tanggal').value,
        jenis: jenisTransaksiAktif,
        nominal: parseInt(nominalBersih),
        kategoriUtama: document.getElementById('kategoriUtama').value || "-",
        subKategori: document.getElementById('subKategori').value || "-",
        pelaku: document.getElementById('pelaku').value || "-",
        metodeBayar: document.getElementById('metodeBayar').value || "-",
        rekening: document.getElementById('rekening').value || "-",
        rekeningAsal: document.getElementById('rekeningAsal').value || "-",
        rekeningTujuan: document.getElementById('rekeningTujuan').value || "-",
        catatan: document.getElementById('catatan').value || "-"
    };

    try {
        const respon = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dataKirim)
        });

        const hasil = await respon.json();

        if (hasil.status === "sukses") {
            if (idEdit) {
                alert(`✅ Transaksi berhasil diperbarui!`);
                batalEdit(); // Kembalikan form ke wujud semula (Input Baru)
            } else {
                alert(`✅ Transaksi berhasil dicatat ke Profil: ${profilAktif}`);
                nominalInput.value = '';
                document.getElementById('catatan').value = '';
            }

            // WAJIB: Tarik ulang data dari Google Sheets agar riwayat di Dashboard ikut berubah!
            await tarikDataDariSheet();
            prosesDashboard(document.querySelector('.filter-btn.active').innerText);

        } else {
            alert("❌ Gagal menyimpan: " + hasil.pesan);
        }
    } catch (error) {
        alert("🚨 Terjadi kesalahan jaringan. \nError: " + error.message);
    } finally {
        submitBtn.classList.remove('btn-loading');
        // Kembalikan teks tombol sesuai state terakhirnya
        submitBtn.innerText = document.getElementById('editRowId').value ? "Simpan Perubahan" : "Simpan Transaksi";
        submitBtn.disabled = false;
    }
}

// ==========================================
// LOGIKA KHUSUS FORM UTANG PIUTANG
// ==========================================

window.bukaModalFormUtang = function() {
    // 1. Tampilkan Pop-up
    document.getElementById('modalFormUtang').style.display = 'flex';
    
    // 2. Ambil data Kontak & Rekening sesuai Profil (Bisnis/Pribadi) yang sedang aktif
    let dataProfilKita = referensi.dataProfil[profilAktif];
    
    isiDropdown('kontakUtang', dataProfilKita.kontak);
    isiDropdown('rekeningUtang', dataProfilKita.rekening);
    
    // 3. Set logika label
    ubahLabelUtang();
    
    // 4. Format otomatis angka ke Rupiah saat diketik
    const nomUtang = document.getElementById('nominalUtang');
    // Hapus event listener lama agar tidak dobel, lalu pasang baru
    let clone = nomUtang.cloneNode(true);
    nomUtang.parentNode.replaceChild(clone, nomUtang);
    
    clone.addEventListener('input', function(e) {
        let angka = this.value.replace(/[^0-9]/g, '');
        this.value = angka ? parseInt(angka, 10).toLocaleString('id-ID') : '';
    });
}

window.tutupModalFormUtang = function() {
    document.getElementById('modalFormUtang').style.display = 'none';
}

window.ubahLabelUtang = function() {
    let jenis = document.getElementById('jenisUtangInput').value;
    let labelRek = document.getElementById('labelRekeningUtang');
    
    if(jenis === 'Utang') {
        // Kalau kita utang, berarti kita menerima uang dari orang tersebut ke kas kita
        labelRek.innerText = 'Uang Masuk ke Rekening / Kas';
        labelRek.style.color = 'var(--success)';
    } else {
        // Kalau kita beri piutang, berarti uang kita keluar dari kas ke orang tersebut
        labelRek.innerText = 'Uang Keluar dari Rekening / Kas';
        labelRek.style.color = 'var(--danger)';
    }
}

// Fungsi untuk mengisi opsi pada <datalist>
function isiDatalist(idDatalist, arrayData) {
    let datalist = document.getElementById(idDatalist);
    if(datalist) {
        datalist.innerHTML = ''; // Kosongkan dulu
        if (arrayData && arrayData.length > 0) {
            arrayData.forEach(item => {
                let option = document.createElement('option');
                option.value = item;
                datalist.appendChild(option);
            });
        }
    }
}

// Update fungsi buka modal yang sebelumnya
window.bukaModalFormUtang = function() {
    document.getElementById('modalFormUtang').style.display = 'flex';
    
    // Ambil data dari profil yang sedang aktif (Pribadi / Bisnis tertentu)
    let dataProfilKita = referensi.dataProfil[profilAktif];
    
    // Gunakan fungsi datalist untuk kontak
    isiDatalist('listKontakUtang', dataProfilKita.kontak);
    
    // Gunakan dropdown biasa untuk rekening
    isiDropdown('rekeningUtang', dataProfilKita.rekening);
    
    ubahLabelUtang();
    
    // Reset nilai input agar kosong saat dibuka ulang
    document.getElementById('kontakUtang').value = '';
    document.getElementById('nominalUtang').value = '';
    document.getElementById('jatuhTempoUtang').value = '';
    document.getElementById('catatanUtang').value = '';
    
    const nomUtang = document.getElementById('nominalUtang');
    let clone = nomUtang.cloneNode(true);
    nomUtang.parentNode.replaceChild(clone, nomUtang);
    
    clone.addEventListener('input', function(e) {
        let angka = this.value.replace(/[^0-9]/g, '');
        this.value = angka ? parseInt(angka, 10).toLocaleString('id-ID') : '';
    });
}

// Fungsi eksekusi simpan utang/piutang
// Ganti fungsi ini di js/form.js
window.simpanDataUtang = async function() {
    let kontakInput = document.getElementById('kontakUtang').value.trim();
    let nominalInput = document.getElementById('nominalUtang').value.replace(/\./g, '');
    let rekeningInput = document.getElementById('rekeningUtang').value;
    
    if(!kontakInput || !nominalInput || !rekeningInput) {
        alert("Mohon lengkapi Pihak Lain, Nominal, dan Rekening!");
        return;
    }

    // Auto-save kontak baru ke profil aktif
    let daftarKontakProfilIni = referensi.dataProfil[profilAktif].kontak;
    if(!daftarKontakProfilIni.includes(kontakInput)) {
        daftarKontakProfilIni.push(kontakInput);
        localStorage.setItem('dataMasterKeuanganMulti', JSON.stringify(referensi));
        if(typeof renderMasterUI === 'function') renderMasterUI();
    }

    // Ubah tombol jadi loading
    const submitBtn = document.querySelector('#modalFormUtang .submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Memproses...";
    submitBtn.disabled = true;

    // Persiapkan Data Kirim (Ada penanda 'action: simpanUtang')
    const dataKirimUtang = {
        action: "simpanUtang", // <-- PENTING: Penanda agar Google Sheet tahu ini utang, bukan transaksi biasa
        profil: profilAktif,
        tanggal: document.getElementById('jatuhTempoUtang').value ? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        jenis: document.getElementById('jenisUtangInput').value,
        kontak: kontakInput,
        nominal: parseInt(nominalInput),
        rekening: rekeningInput,
        jatuhTempo: document.getElementById('jatuhTempoUtang').value || "-",
        catatan: document.getElementById('catatanUtang').value || "-"
    };

    try {
        const respon = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dataKirimUtang)
        });

        const hasil = await respon.json();

        if (hasil.status === "sukses") {
            alert(`✅ Data ${dataKirimUtang.jenis} dengan ${kontakInput} berhasil dicatat!`);
            tutupModalFormUtang();
            
            // Tarik ulang data dari sheet agar list utang langsung update
            await tarikDataUtangDariSheet();
            renderBukuUtang();
        } else {
            alert("❌ Gagal menyimpan: " + hasil.pesan);
        }
    } catch (error) {
        alert("🚨 Terjadi kesalahan jaringan. \nError: " + error.message);
    } finally {
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

// Tambahkan di baris paling bawah js/api.js

let databaseUtang = []; // Wadah untuk menyimpan data utang piutang

// Fungsi untuk menyedot khusus data Utang Piutang dari Sheet
async function tarikDataUtangDariSheet() {
    try {
        // Kita tambahkan parameter ?action=getUtang di URL URL Google Script
        const respon = await fetch(GAS_URL + "?action=getUtang");
        const hasil = await respon.json();
        
        if (hasil.status === "sukses") {
            databaseUtang = hasil.data;
            console.log("Berhasil menarik " + databaseUtang.length + " data utang/piutang.");
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error jaringan saat tarik data utang:", error);
        return false;
    }
}

// ==========================================
// FITUR EDIT & HAPUS TRANSAKSI NORMAL
// ==========================================
window.editTrx = function(rowId) {
    let trx = databaseTransaksi.find(t => t.rowId === rowId);
    if(!trx) return alert("Data tidak ditemukan!");

    // 1. Pindah Tab ke Input
    switchTab('input', document.querySelectorAll('.tab-btn')[1]);

    // 2. Set Jenis Transaksi
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
    let btnJenis = Array.from(document.querySelectorAll('.seg-btn')).find(b => b.getAttribute('data-val') === trx.jenis);
    if(btnJenis) {
        btnJenis.classList.add('active');
        jenisTransaksiAktif = trx.jenis;
        renderSemuaDropdown();
        aturLogikaForm();
    }

    // 3. Isi nilai ke form
    document.getElementById('editRowId').value = rowId;
    document.getElementById('badgeEditMode').style.display = 'block';
    document.querySelector('#formInput .submit-btn').innerText = "Simpan Perubahan";
    document.querySelector('#formInput .submit-btn').style.background = "var(--warning)";
    document.querySelector('#formInput .submit-btn').style.color = "#1a1a1a";

    // Format Tanggal (Dari YYYY-MM-DDTHH:MM... ke YYYY-MM-DD)
    try { document.getElementById('tanggal').value = new Date(trx.tanggal).toISOString().split('T')[0]; } catch(e){}
    
    document.getElementById('nominal').value = Number(trx.nominal).toLocaleString('id-ID');
    document.getElementById('kategoriUtama').value = trx.kategoriUtama;
    renderSubKategori(trx.kategoriUtama); // Update dropdown sub
    setTimeout(() => { document.getElementById('subKategori').value = trx.subKategori; }, 50);
    
    document.getElementById('pelaku').value = trx.pelaku;
    document.getElementById('metodeBayar').value = trx.metodeBayar;
    document.getElementById('rekening').value = trx.rekening;
    document.getElementById('rekeningAsal').value = trx.rekeningAsal;
    document.getElementById('rekeningTujuan').value = trx.rekeningTujuan;
    document.getElementById('catatan').value = trx.catatan;
    
    aturLogikaForm(); // Reflek Tampilan
}

window.batalEdit = function() {
    document.getElementById('editRowId').value = "";
    document.getElementById('badgeEditMode').style.display = 'none';
    document.querySelector('#formInput .submit-btn').innerText = "Simpan Transaksi";
    document.querySelector('#formInput .submit-btn').style.background = "var(--primary)";
    document.querySelector('#formInput .submit-btn').style.color = "#fff";
    document.getElementById('formInput').reset();
    document.getElementById('tanggal').valueAsDate = new Date();
}

window.hapusTrx = async function(rowId) {
    if(!confirm("Yakin ingin MENGHAPUS permanen transaksi ini?")) return;

    try {
        const respon = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: "hapusTransaksi", rowId: rowId })
        });
        const hasil = await respon.json();
        
        if (hasil.status === "sukses") {
            alert("🗑️ Transaksi berhasil dihapus!");
            await tarikDataDariSheet(); // REFRESH DATA WAJIB
            prosesDashboard(document.querySelector('.filter-btn.active').innerText);
        } else alert("❌ Gagal hapus: " + hasil.pesan);
    } catch (err) { alert("🚨 Error: " + err.message); }
}

// UBAH FUNGSI simpanTransaksi AGAR MENDUKUNG EDIT
// Cari fungsi simpanTransaksi(), lalu sisipkan pengecekan edit ini:
// (Timpa deklarasi dataKirim dengan ini):
/*
    let idEdit = document.getElementById('editRowId').value;
    const dataKirim = {
        action: idEdit ? "editTransaksi" : "",
        rowId: idEdit ? parseInt(idEdit) : null,
        profil: profilAktif, 
        // ... (sisa data kirim sama persis)
*/
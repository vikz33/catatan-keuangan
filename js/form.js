// File: js/form.js

let jenisTransaksiAktif = "Keluar";

function initForm() {
    // Set tanggal hari ini
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

    // Sembunyikan semuanya terlebih dahulu (dengan pelindung error)
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

        // Urutan Form Keluar dan Masuk (Nominal di urutan ke-2)
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

function renderSemuaDropdown() {
    let sourceKategori = (jenisTransaksiAktif === "Masuk") ? referensi.kategoriMasuk : referensi.kategoriKeluar;
    
    if (sourceKategori) {
        let katKeys = Object.keys(sourceKategori);
        isiDropdown('kategoriUtama', katKeys);
        if(katKeys.length > 0) renderSubKategori(katKeys[0]);
    }

    isiDropdown('pelaku', referensi.pelaku);
    isiDropdown('metodeBayar', referensi.metodeBayar);
    isiDropdown('rekening', referensi.rekening);
    isiDropdown('rekeningAsal', referensi.rekening);
    isiDropdown('rekeningTujuan', referensi.rekening);
}

function renderSubKategori(kategoriTerpilih) {
    let sourceKategori = (jenisTransaksiAktif === "Masuk") ? referensi.kategoriMasuk : referensi.kategoriKeluar;
    if (sourceKategori) {
        let subKategoriList = sourceKategori[kategoriTerpilih] || [];
        isiDropdown('subKategori', subKategoriList);
    }
}

function isiDropdown(idSelect, arrayData) {
    let select = document.getElementById(idSelect);
    if(select) {
        select.innerHTML = '';
        if (arrayData && arrayData.length > 0) {
            arrayData.forEach(item => select.add(new Option(item, item)));
        }
    }
}

// Mengubah fungsi simpan untuk ngobrol dengan Google Sheets
async function simpanTransaksi() {
    let nominalInput = document.getElementById('nominal');
    let nominalKotor = nominalInput.value;
    let nominalBersih = nominalKotor.replace(/\./g, ''); // Buang titik

    if(!nominalBersih) { 
        alert("Nominal belum diisi."); 
        return; 
    }

    // Ubah teks tombol jadi loading
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "⏳ Sedang Menyimpan...";
    submitBtn.disabled = true;

    // Bungkus semua isian form ke dalam satu objek
    const dataKirim = {
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
        // Proses mengirim data ke Google Apps Script
        const respon = await fetch(GAS_URL, {
            method: 'POST',
            // Gunakan text/plain untuk menghindari pemblokiran keamanan browser (CORS)
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dataKirim)
        });

        const hasil = await respon.json();

        if (hasil.status === "sukses") {
            alert(`✅ Transaksi berhasil dicatat ke Google Sheets!`);
            // Kosongkan form setelah sukses
            nominalInput.value = '';
            document.getElementById('catatan').value = '';
        } else {
            alert("❌ Gagal menyimpan: " + hasil.pesan);
        }
    } catch (error) {
        alert("🚨 Terjadi kesalahan jaringan. Pastikan internet Anda aktif.\nError: " + error.message);
    } finally {
        // Kembalikan tombol seperti semula
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}
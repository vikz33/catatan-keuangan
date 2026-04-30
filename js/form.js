let jenisTransaksiAktif = "Keluar";

function initForm() {
    document.getElementById('tanggal').valueAsDate = new Date();
    
    document.querySelectorAll('.seg-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if(jenisTransaksiAktif !== this.getAttribute('data-val')) {
                document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                jenisTransaksiAktif = this.getAttribute('data-val');
                
                // Render ulang dropdown kategori setiap kali ganti tab (Masuk/Keluar)
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

    [wKatUtama, wSubKat, wPelaku, wMetode, wRekening, wAsal, wTujuan].forEach(el => el.style.display = 'none');

    if (jenisTransaksiAktif === "Mutasi") {
        wAsal.style.display = 'block';
        wTujuan.style.display = 'block';

        wTanggal.style.order = 1;
        wAsal.style.order = 2;
        wTujuan.style.order = 3;
        wNominal.style.order = 4;
        wCatatan.style.order = 5;
    } else {
        wKatUtama.style.display = 'block';
        wSubKat.style.display = 'block';
        wPelaku.style.display = 'block';
        wMetode.style.display = 'block';

        if (metode !== "Tunai" && referensi.metodeBayar.length > 0) {
            wRekening.style.display = 'block';
        }

        if (jenisTransaksiAktif === "Keluar") {
            wTanggal.style.order = 1;
            wKatUtama.style.order = 2;
            wSubKat.style.order = 3;
            wPelaku.style.order = 4;
            wMetode.style.order = 5;
            wRekening.style.order = 6;
            wNominal.style.order = 7;
            wCatatan.style.order = 8;
        } else if (jenisTransaksiAktif === "Masuk") {
            wTanggal.style.order = 1;
            wNominal.style.order = 2;
            wKatUtama.style.order = 3;
            wSubKat.style.order = 4;
            wPelaku.style.order = 5;
            wMetode.style.order = 6;
            wRekening.style.order = 7;
            wCatatan.style.order = 8;
        }
    }
}

function renderSemuaDropdown() {
    // Tentukan sumber kategori berdasarkan jenis transaksi
    let sourceKategori = (jenisTransaksiAktif === "Masuk") ? referensi.kategoriMasuk : referensi.kategoriKeluar;
    
    let katKeys = Object.keys(sourceKategori);
    isiDropdown('kategoriUtama', katKeys);
    if(katKeys.length > 0) renderSubKategori(katKeys[0]);

    isiDropdown('pelaku', referensi.pelaku);
    isiDropdown('metodeBayar', referensi.metodeBayar);
    isiDropdown('rekening', referensi.rekening);
    isiDropdown('rekeningAsal', referensi.rekening);
    isiDropdown('rekeningTujuan', referensi.rekening);
}

function renderSubKategori(kategoriTerpilih) {
    let sourceKategori = (jenisTransaksiAktif === "Masuk") ? referensi.kategoriMasuk : referensi.kategoriKeluar;
    let subKategoriList = sourceKategori[kategoriTerpilih] || [];
    isiDropdown('subKategori', subKategoriList);
}

function isiDropdown(idSelect, arrayData) {
    let select = document.getElementById(idSelect);
    select.innerHTML = '';
    arrayData.forEach(item => select.add(new Option(item, item)));
}

function simpanTransaksi() {
    let nominal = document.getElementById('nominal').value;
    if(!nominal) { alert("Nominal belum diisi."); return; }
    alert(`Transaksi ${jenisTransaksiAktif} berhasil disimpan!`);
    document.getElementById('nominal').value = '';
    document.getElementById('catatan').value = '';
}
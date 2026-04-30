let jenisTransaksiAktif = "Keluar";

function initForm() {
    document.getElementById('tanggal').valueAsDate = new Date();
    
    // Pasang Event Listener Segmented Control
    document.querySelectorAll('.seg-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            jenisTransaksiAktif = this.getAttribute('data-val');
            aturLogikaForm();
        });
    });

    // Pasang Event Listener Metode Bayar
    document.getElementById('metodeBayar').addEventListener('change', aturLogikaForm);

    // Event Listener untuk Cascading Dropdown
    document.getElementById('kategoriUtama').addEventListener('change', function() {
        renderSubKategori(this.value);
    });

    renderSemuaDropdown();
    aturLogikaForm();
}

function aturLogikaForm() {
    let grpNormal = document.getElementById('group-normal');
    let grpMutasi = document.getElementById('group-mutasi');
    let grpRekening = document.getElementById('group-rekening');
    let metode = document.getElementById('metodeBayar').value;

    if (jenisTransaksiAktif === "Mutasi") {
        grpNormal.style.display = "none";
        grpMutasi.style.display = "block";
    } else {
        grpNormal.style.display = "block";
        grpMutasi.style.display = "none";
        grpRekening.style.display = (metode !== "Tunai") ? "block" : "none";
    }
}

function renderSemuaDropdown() {
    // 1. Render Kategori Utama dari Object Keys
    let katKeys = Object.keys(referensi.kategori);
    isiDropdown('kategoriUtama', katKeys);
    
    // 2. Render Sub-kategori berdasarkan pilihan pertama (Cascading)
    if(katKeys.length > 0) renderSubKategori(katKeys[0]);

    // 3. Render sisanya
    isiDropdown('pelaku', referensi.pelaku);
    isiDropdown('metodeBayar', referensi.metodeBayar);
    isiDropdown('rekening', referensi.rekening);
    isiDropdown('rekeningAsal', referensi.rekening);
    isiDropdown('rekeningTujuan', referensi.rekening);
}

function renderSubKategori(kategoriTerpilih) {
    let subKategoriList = referensi.kategori[kategoriTerpilih] || [];
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
    
    alert(`Transaksi ${jenisTransaksiAktif} berhasil disimpan (Mode Offline)!`);
    
    document.getElementById('nominal').value = '';
    document.getElementById('catatan').value = '';
}
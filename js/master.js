// File: js/master.js

function initMaster() {
    renderMasterUI();
}

function renderMasterUI() {
    let container = document.getElementById('masterDataContainer');
    container.innerHTML = ''; 

    // ==========================================
    // 1. RENDER KATEGORI (Struktur Objek Bersarang)
    // ==========================================
    let configKategori = [
        { key: 'kategoriKeluar', judul: 'Kategori Pengeluaran' },
        { key: 'kategoriMasuk', judul: 'Kategori Pemasukan' }
    ];

    configKategori.forEach(cfg => {
        // Karena ini objek, kita ambil 'keys'-nya (nama kategori utamanya)
        let listKategori = Object.keys(referensi[cfg.key]);
        
        let cardHTML = `
            <div class="master-card">
                <h3>${cfg.judul}</h3>
                <ul class="list-group">
                    ${listKategori.map(namaKategori => `
                        <li class="list-item">
                            <span>${namaKategori}</span> 
                            <button class="delete-btn" onclick="hapusKategori('${cfg.key}', '${namaKategori}')">Hapus</button>
                        </li>
                    `).join('')}
                </ul>
                <div class="add-row">
                    <input type="text" id="input-${cfg.key}" placeholder="Tambah kategori baru...">
                    <button onclick="tambahKategori('${cfg.key}')">Tambah</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    // ==========================================
    // 2. RENDER DATA UMUM (Struktur Array Biasa)
    // ==========================================
    let configUmum = [
        { key: 'pelaku', judul: 'Pelaku Transaksi (Anggota)' },
        { key: 'rekening', judul: 'Daftar Rekening & Dompet' },
        { key: 'metodeBayar', judul: 'Metode Pembayaran' }
    ];

    configUmum.forEach(cfg => {
        let cardHTML = `
            <div class="master-card">
                <h3>${cfg.judul}</h3>
                <ul class="list-group">
                    ${referensi[cfg.key].map((item, index) => `
                        <li class="list-item">
                            <span>${item}</span> 
                            <button class="delete-btn" onclick="hapusDataUmum('${cfg.key}', ${index})">Hapus</button>
                        </li>
                    `).join('')}
                </ul>
                <div class="add-row">
                    <input type="text" id="input-${cfg.key}" placeholder="Tambah baru...">
                    <button onclick="tambahDataUmum('${cfg.key}')">Tambah</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// ==========================================
// FUNGSI UNTUK DATA UMUM (Array)
// ==========================================
function tambahDataUmum(key) {
    let inputVal = document.getElementById(`input-${key}`).value;
    if (inputVal.trim() !== "") {
        referensi[key].push(inputVal.trim());
        refreshAllViews();
    }
}

function hapusDataUmum(key, index) {
    if(confirm(`Hapus "${referensi[key][index]}" dari daftar?`)) {
        referensi[key].splice(index, 1);
        refreshAllViews();
    }
}

// ==========================================
// FUNGSI UNTUK KATEGORI (Object)
// ==========================================
function tambahKategori(keyObj) {
    let inputVal = document.getElementById(`input-${keyObj}`).value;
    if (inputVal.trim() !== "") {
        let kategoriBaru = inputVal.trim();
        
        // Cek apakah kategori sudah ada
        if (!referensi[keyObj][kategoriBaru]) {
            // Buat kategori baru dengan array kosong untuk sub-kategorinya
            referensi[keyObj][kategoriBaru] = []; 
            refreshAllViews();
        } else {
            alert("Kategori tersebut sudah ada!");
        }
    }
}

function hapusKategori(keyObj, namaKategori) {
    if(confirm(`Hapus kategori utama "${namaKategori}"? (Semua sub-kategori di dalamnya juga akan terhapus)`)) {
        delete referensi[keyObj][namaKategori];
        refreshAllViews();
    }
}

// ==========================================
// SINKRONISASI VIEW
// ==========================================
function refreshAllViews() {
    renderMasterUI();       // Update tampilan tab pengaturan
    renderSemuaDropdown();  // Update opsi dropdown di tab input
    aturLogikaForm();       // Pastikan form tidak berantakan
}
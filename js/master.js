function initMaster() {
    renderMasterUI();
}

function renderMasterUI() {
    let container = document.getElementById('masterDataContainer');
    container.innerHTML = ''; 

    // 1. RENDER KATEGORI & SUB-KATEGORI
    let configKategori = [
        { key: 'kategoriKeluar', judul: 'Kategori Pengeluaran' },
        { key: 'kategoriMasuk', judul: 'Kategori Pemasukan' }
    ];

    configKategori.forEach(cfg => {
        let listKategoriUtama = Object.keys(referensi[cfg.key]);
        
        let cardHTML = `<div class="master-card">
            <h3>${cfg.judul}</h3>
            <div style="margin-bottom: 20px;">`;
        
        listKategoriUtama.forEach(katUtama => {
            let subKats = referensi[cfg.key][katUtama];
            
            // Render setiap Kategori Utama menjadi sebuah blok abu-abu
            cardHTML += `
                <div style="background: var(--bg-body); border-radius: 12px; padding: 12px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 8px; margin-bottom: 8px;">
                        <strong style="color: var(--text-main); font-size: 14px;">📂 ${katUtama}</strong>
                        <button onclick="hapusKategori('${cfg.key}', '${katUtama}')" style="background: var(--danger); color: white; border: none; border-radius: 6px; padding: 4px 8px; font-size: 11px; cursor: pointer;">Hapus Utama</button>
                    </div>
                    
                    <ul style="list-style: none; padding: 0; margin: 0 0 10px 0;">
                        ${subKats.map((sub, idx) => `
                            <li style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; padding-left: 10px;">
                                <span>- ${sub}</span>
                                <button onclick="hapusSubKategori('${cfg.key}', '${katUtama}', ${idx})" style="background: none; border: none; color: var(--danger); font-weight: bold; cursor: pointer;">✕</button>
                            </li>
                        `).join('')}
                    </ul>
                    
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="input-sub-${cfg.key}-${katUtama.replace(/\s/g, '')}" placeholder="Tambah sub-kategori..." style="padding: 6px 10px; font-size: 12px; border-radius: 8px;">
                        <button onclick="tambahSubKategori('${cfg.key}', '${katUtama}')" style="background: var(--success); color: #2d3748; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer;">Tambah</button>
                    </div>
                </div>`;
        });
        
        cardHTML += `</div>
            <div class="add-row">
                <input type="text" id="input-${cfg.key}" placeholder="Bikin Kategori Utama baru...">
                <button onclick="tambahKategori('${cfg.key}')">Buat Utama</button>
            </div>
        </div>`;
        container.innerHTML += cardHTML;
    });

    // 2. RENDER DATA UMUM (Anggota & Rekening)
    let configUmum = [
        { key: 'pelaku', judul: 'Pelaku Transaksi' },
        { key: 'rekening', judul: 'Daftar Rekening & Dompet' },
        { key: 'metodeBayar', judul: 'Metode Pembayaran' }
    ];

    configUmum.forEach(cfg => {
        let cardHTML = `<div class="master-card">
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
        </div>`;
        container.innerHTML += cardHTML;
    });
}

// === FUNGSI KATEGORI (BERSARANG) ===
window.tambahKategori = function(keyObj) {
    let inputVal = document.getElementById(`input-${keyObj}`).value.trim();
    if (inputVal && !referensi[keyObj][inputVal]) {
        referensi[keyObj][inputVal] = []; // Buat wadah sub-kategori kosong
        refreshAllViews();
    } else if (inputVal) {
        alert("Kategori tersebut sudah ada!");
    }
}

window.hapusKategori = function(keyObj, katUtama) {
    if(confirm(`Yakin hapus "${katUtama}"? SEMUA sub-kategori di dalamnya akan ikut terhapus!`)) {
        delete referensi[keyObj][katUtama];
        refreshAllViews();
    }
}

window.tambahSubKategori = function(keyObj, katUtama) {
    let inputId = `input-sub-${keyObj}-${katUtama.replace(/\s/g, '')}`;
    let inputVal = document.getElementById(inputId).value.trim();
    if (inputVal) {
        referensi[keyObj][katUtama].push(inputVal);
        refreshAllViews();
    }
}

window.hapusSubKategori = function(keyObj, katUtama, idx) {
    if(confirm(`Hapus sub-kategori "${referensi[keyObj][katUtama][idx]}"?`)) {
        referensi[keyObj][katUtama].splice(idx, 1);
        refreshAllViews();
    }
}

// === FUNGSI DATA UMUM ===
window.tambahDataUmum = function(key) {
    let inputVal = document.getElementById(`input-${key}`).value.trim();
    if (inputVal) {
        referensi[key].push(inputVal);
        refreshAllViews();
    }
}

window.hapusDataUmum = function(key, index) {
    if(confirm(`Hapus "${referensi[key][index]}"?`)) {
        referensi[key].splice(index, 1);
        refreshAllViews();
    }
}

function refreshAllViews() {
    // SIMPAN KE MEMORI SETIAP KALI ADA PERUBAHAN
    localStorage.setItem('dataMasterKeuangan', JSON.stringify(referensi));
    
    renderMasterUI();       
    renderSemuaDropdown();  
    aturLogikaForm();       
}
// File: js/master.js

function initMaster() {
    renderMasterUI();
}

function renderMasterUI() {
    let container = document.getElementById('masterDataContainer');
    container.innerHTML = ''; 

    // Ambil data milik profil yang sedang dipilih (Pribadi / Bukuku / Pawonan)
    let dataProfilKita = referensi.dataProfil[profilAktif];

    // Tambahkan header indikator di Tab Pengaturan agar user tahu dia sedang mengedit profil apa
    // ==========================================
    // BARU: PANEL SINKRONISASI CLOUD & HEADER
    // ==========================================
    container.innerHTML += `<div style="background: var(--primary); color: #ffffff; padding: 12px; border-radius: 12px; margin-bottom: 20px; font-weight: bold; text-align: center; box-shadow: var(--shadow-soft); display: flex; align-items: center; justify-content: center; gap: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        Mengedit Pengaturan: ${profilAktif}
    </div>`;

    let cardCloud = `
        <div class="master-card" style="border: 1px solid var(--border-color); background: var(--input-bg); box-shadow: var(--shadow-soft);">
            <h3 style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                Sinkronisasi Cloud
            </h3>
            <p style="font-size: 11px; margin-top: 0; margin-bottom: 15px; color: var(--text-muted);">Simpan pengaturan Kategori, Rekening, dan Profil ke Google Sheets agar aman saat ganti HP.</p>
            <div style="display: flex; gap: 10px;">
                <button onclick="backupKeCloud(this)" style="flex: 1; padding: 10px; background: var(--primary); color: #ffffff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Simpan (Backup)
                </button>
                <button onclick="tarikDariCloud(this)" style="flex: 1; padding: 10px; background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 16 12 21 17 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line></svg>
                    Tarik (Restore)
                </button>
            </div>
        </div>
    `;
    container.innerHTML += cardCloud;

    // ==========================================
    // 1. RENDER KATEGORI & SUB-KATEGORI (PER PROFIL)
    // ==========================================
    let configKategori = [
        { key: 'kategoriKeluar', judul: 'Kategori Pengeluaran' },
        { key: 'kategoriMasuk', judul: 'Kategori Pemasukan' }
    ];

    configKategori.forEach(cfg => {
        let listKategoriUtama = Object.keys(dataProfilKita[cfg.key]);
        
        let cardHTML = `<div class="master-card">
            <h3>${cfg.judul}</h3>
            <div style="margin-bottom: 20px;">`;
        
        listKategoriUtama.forEach(katUtama => {
            let subKats = dataProfilKita[cfg.key][katUtama];
            
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

    // ==========================================
    // 2. RENDER REKENING (PER PROFIL)
    // ==========================================
    let cardRekening = `<div class="master-card">
        <h3>Daftar Rekening / Kas</h3>
        <ul class="list-group">
            ${dataProfilKita.rekening.map((item, index) => `
                <li class="list-item">
                    <span>${item}</span> 
                    <button class="delete-btn" onclick="hapusDataProfilUmum('rekening', ${index})">Hapus</button>
                </li>
            `).join('')}
        </ul>
        <div class="add-row">
            <input type="text" id="input-rekening" placeholder="Tambah Rekening/Kas...">
            <button onclick="tambahDataProfilUmum('rekening')">Tambah</button>
        </div>
    </div>`;
    container.innerHTML += cardRekening;

    // ==========================================
    // 2.5 RENDER KONTAK/RELASI (PER PROFIL)
    // ==========================================
    // Jika profil lama belum punya array kontak, kita buatkan otomatis
    if(!dataProfilKita.kontak) dataProfilKita.kontak = []; 

    let cardKontak = `<div class="master-card" style="border: 2px solid var(--primary); background: var(--bg-surface);">
        <h3>👥 Daftar Kontak / Pihak Lain</h3>
        <p style="font-size: 11px; margin-top: -10px; margin-bottom: 10px; color: var(--text-muted);">Vendor, supplier, atau orang untuk pencatatan utang-piutang.</p>
        <ul class="list-group">
            ${dataProfilKita.kontak.map((item, index) => `
                <li class="list-item">
                    <span>${item}</span> 
                    <button class="delete-btn" onclick="hapusDataProfilUmum('kontak', ${index})">Hapus</button>
                </li>
            `).join('')}
        </ul>
        <div class="add-row">
            <input type="text" id="input-kontak" placeholder="Tambah Kontak Baru...">
            <button onclick="tambahDataProfilUmum('kontak')" style="background: var(--primary); color: #1a202c;">Tambah</button>
        </div>
    </div>`;
    container.innerHTML += cardKontak;

    // ==========================================
    // 3. RENDER DATA GLOBAL (Pelaku & Metode Bayar)
    // ==========================================
    let configUmum = [
        { key: 'pelaku', judul: 'Pelaku Transaksi (Global)' },
        { key: 'metodeBayar', judul: 'Metode Pembayaran (Global)' }
    ];

    configUmum.forEach(cfg => {
        let cardHTML = `<div class="master-card" style="border: 2px dashed var(--warning);">
            <h3 style="color: var(--warning); filter: brightness(0.8);">🌐 ${cfg.judul}</h3>
            <p style="font-size: 11px; margin-top: -10px; margin-bottom: 10px; color: var(--text-muted);">Data ini akan muncul di semua profil bisnis/pribadi.</p>
            <ul class="list-group">
                ${referensi[cfg.key].map((item, index) => `
                    <li class="list-item">
                        <span>${item}</span> 
                        <button class="delete-btn" onclick="hapusDataGlobal('${cfg.key}', ${index})">Hapus</button>
                    </li>
                `).join('')}
            </ul>
            <div class="add-row">
                <input type="text" id="input-${cfg.key}" placeholder="Tambah baru...">
                <button onclick="tambahDataGlobal('${cfg.key}')">Tambah</button>
            </div>
        </div>`;
        container.innerHTML += cardHTML;
    });
}

// === FUNGSI KATEGORI (BERDASARKAN PROFIL AKTIF) ===
window.tambahKategori = function(keyObj) {
    let inputVal = document.getElementById(`input-${keyObj}`).value.trim();
    if (inputVal && !referensi.dataProfil[profilAktif][keyObj][inputVal]) {
        referensi.dataProfil[profilAktif][keyObj][inputVal] = []; 
        refreshAllViews();
    } else if (inputVal) {
        alert("Kategori tersebut sudah ada di profil ini!");
    }
}

window.hapusKategori = function(keyObj, katUtama) {
    if(confirm(`Yakin hapus "${katUtama}" dari profil ${profilAktif}?`)) {
        delete referensi.dataProfil[profilAktif][keyObj][katUtama];
        refreshAllViews();
    }
}

window.tambahSubKategori = function(keyObj, katUtama) {
    let inputId = `input-sub-${keyObj}-${katUtama.replace(/\s/g, '')}`;
    let inputVal = document.getElementById(inputId).value.trim();
    if (inputVal) {
        referensi.dataProfil[profilAktif][keyObj][katUtama].push(inputVal);
        refreshAllViews();
    }
}

window.hapusSubKategori = function(keyObj, katUtama, idx) {
    if(confirm(`Hapus sub-kategori "${referensi.dataProfil[profilAktif][keyObj][katUtama][idx]}"?`)) {
        referensi.dataProfil[profilAktif][keyObj][katUtama].splice(idx, 1);
        refreshAllViews();
    }
}

// === FUNGSI REKENING (BERDASARKAN PROFIL AKTIF) ===
window.tambahDataProfilUmum = function(key) {
    let inputVal = document.getElementById(`input-${key}`).value.trim();
    if (inputVal) {
        referensi.dataProfil[profilAktif][key].push(inputVal);
        refreshAllViews();
    }
}

window.hapusDataProfilUmum = function(key, index) {
    if(confirm(`Hapus "${referensi.dataProfil[profilAktif][key][index]}" dari profil ${profilAktif}?`)) {
        referensi.dataProfil[profilAktif][key].splice(index, 1);
        refreshAllViews();
    }
}

// === FUNGSI DATA GLOBAL (PELAKU & METODE BAYAR) ===
window.tambahDataGlobal = function(key) {
    let inputVal = document.getElementById(`input-${key}`).value.trim();
    if (inputVal) {
        referensi[key].push(inputVal);
        refreshAllViews();
    }
}

window.hapusDataGlobal = function(key, index) {
    if(confirm(`Hapus "${referensi[key][index]}" secara global?`)) {
        referensi[key].splice(index, 1);
        refreshAllViews();
    }
}

// === FUNGSI REFRESH & SIMPAN ===
function refreshAllViews() {
    // Simpan ke localStorage dengan nama key baru yang kita buat di api.js
    localStorage.setItem('dataMasterKeuanganMulti', JSON.stringify(referensi));
    
    renderMasterUI();       
    if(typeof renderSemuaDropdown === 'function') renderSemuaDropdown();  
    if(typeof aturLogikaForm === 'function') aturLogikaForm();       
}

// ==========================================
// FUNGSI MANAJEMEN BISNIS (TAMBAH/HAPUS PROFIL)
// ==========================================
window.tambahBisnis = function() {
    let inputVal = document.getElementById('input-bisnis-baru').value.trim();
    if(!inputVal) return;
    
    // Validasi agar nama tidak bentrok
    if(referensi.daftarBisnis.includes(inputVal) || inputVal.toLowerCase() === "pribadi") {
        alert("Nama bisnis sudah digunakan atau tidak valid!");
        return;
    }

    // 1. Daftarkan nama bisnisnya
    referensi.daftarBisnis.push(inputVal);

    // 2. Buat "Ruangan Kosong" (Template Struktur Data) untuk bisnis baru
    referensi.dataProfil[inputVal] = {
        kategoriKeluar: {},
        kategoriMasuk: {},
        rekening: []
    };

    // 3. Update dropdown di atas jika mode bisnis sedang menyala
    if(typeof renderDropdownDaftarBisnis === 'function') {
        renderDropdownDaftarBisnis();
    }

    refreshAllViews();
    alert(`🎉 Bisnis "${inputVal}" berhasil dibuat!\n\nSilakan pilih "${inputVal}" di dropdown menu atas (Mode Bisnis) untuk mulai menambahkan rekening dan kategori.`);
}

window.hapusBisnis = function(namaBisnis, index) {
    let konfirmasi = confirm(`🚨 PERINGATAN!\nYakin ingin menghapus profil bisnis "${namaBisnis}"?\n\nSemua pengaturan Kategori & Rekening untuk bisnis ini akan ikut terhapus dari aplikasi.`);
    
    if(konfirmasi) {
        // 1. Hapus dari daftar
        referensi.daftarBisnis.splice(index, 1);
        
        // 2. Hapus seluruh data pengaturannya
        delete referensi.dataProfil[namaBisnis];

        // 3. Jika bisnis yang dihapus sedang dalam posisi AKTIF DIBUKA, paksa kembali ke Pribadi
        if(profilAktif === namaBisnis) {
            let toggle = document.getElementById('modeBisnisToggle');
            if (toggle) {
                toggle.checked = false; // Matikan saklar
                if(typeof toggleModeBisnis === 'function') toggleModeBisnis(toggle);
            }
        } else {
            // Jika yang dihapus profil lain, cukup refresh dropdown
            if(typeof renderDropdownDaftarBisnis === 'function') {
                renderDropdownDaftarBisnis();
            }
            refreshAllViews();
        }
    }
}

// ==========================================
// LOGIKA MODAL MANAJEMEN BISNIS
// ==========================================
window.bukaModalBisnis = function() {
    document.getElementById('modalBisnis').style.display = 'flex';
    renderIsiModalBisnis();
}

window.tutupModalBisnis = function() {
    document.getElementById('modalBisnis').style.display = 'none';
}

function renderIsiModalBisnis() {
    let bodyModal = document.getElementById('modalBisnisBody');
    
    // Gunakan variabel CSS agar teks tidak nyaru di Dark Mode
    let html = `
        <ul class="list-group" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px;">
            ${referensi.daftarBisnis.map((bisnis, index) => `
                <li class="list-item" style="border-color: var(--border-color);">
                    <span style="color: var(--text-main); font-weight: bold;">${bisnis}</span> 
                    <button class="delete-btn" onclick="hapusBisnis('${bisnis}', ${index})">Hapus</button>
                </li>
            `).join('')}
        </ul>
        <div class="add-row">
            <input type="text" id="input-bisnis-baru" placeholder="Nama Usaha Baru..." style="background: var(--input-bg); color: var(--text-main); border: 2px solid var(--border-color);">
            <button onclick="tambahBisnis()" style="background: var(--primary); color: #1a202c;">Tambah</button>
        </div>
    `;
    bodyModal.innerHTML = html;
}

// Update sedikit fungsi tambah & hapus agar merender ulang isi modal
window.tambahBisnis = function() {
    let inputVal = document.getElementById('input-bisnis-baru').value.trim();
    if(!inputVal) return;
    
    if(referensi.daftarBisnis.includes(inputVal) || inputVal.toLowerCase() === "pribadi") {
        alert("Nama bisnis sudah digunakan atau tidak valid!");
        return;
    }

    referensi.daftarBisnis.push(inputVal);
    referensi.dataProfil[inputVal] = {
        kategoriKeluar: {}, kategoriMasuk: {}, rekening: []
    };

    if(typeof renderDropdownDaftarBisnis === 'function') renderDropdownDaftarBisnis();
    refreshAllViews();
    renderIsiModalBisnis(); // Refresh layar modal
    
    // Pindahkan fokus langsung ke bisnis baru
    let selectBisnis = document.getElementById('pilihBisnis');
    if(selectBisnis) {
        selectBisnis.value = inputVal;
        gantiEntitasBisnis(inputVal);
    }
}

window.hapusBisnis = function(namaBisnis, index) {
    let konfirmasi = confirm(`🚨 PERINGATAN!\nYakin ingin menghapus profil bisnis "${namaBisnis}"?\n\nSemua pengaturan Kategori & Rekening untuk bisnis ini akan ikut terhapus.`);
    
    if(konfirmasi) {
        referensi.daftarBisnis.splice(index, 1);
        delete referensi.dataProfil[namaBisnis];

        if(profilAktif === namaBisnis) {
            let toggle = document.getElementById('modeBisnisToggle');
            if (toggle) {
                toggle.checked = false;
                if(typeof toggleModeBisnis === 'function') toggleModeBisnis(toggle);
            }
            tutupModalBisnis(); // Tutup modal jika bisnis yang aktif dihapus
        } else {
            if(typeof renderDropdownDaftarBisnis === 'function') renderDropdownDaftarBisnis();
            refreshAllViews();
            renderIsiModalBisnis(); // Refresh layar modal
        }
    }
}

// ==========================================
// LOGIKA SINKRONISASI CLOUD (BACKUP & RESTORE)
// ==========================================

window.backupKeCloud = async function(btnElement) {
    let konfirmasi = confirm("Yakin ingin mem-backup pengaturan saat ini ke Cloud?\nIni akan menimpa (overwrite) backup sebelumnya di Google Sheets.");
    if(!konfirmasi) return;

    let originalText = btnElement.innerText;
    btnElement.innerText = "⏳ Menyimpan..."; btnElement.disabled = true;

    try {
        const dataKirim = { action: "backupMaster", referensi: referensi };
        const respon = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dataKirim)
        });
        const hasil = await respon.json();

        if (hasil.status === "sukses") alert("☁️✅ Berhasil! Pengaturan Master Data Anda sudah aman di Google Sheets.");
        else alert("❌ Gagal backup: " + hasil.pesan);
    } catch (err) {
        alert("🚨 Error jaringan: " + err.message);
    } finally {
        btnElement.innerText = originalText; btnElement.disabled = false;
    }
}

window.tarikDariCloud = async function(btnElement) {
    let konfirmasi = confirm("PERINGATAN!\nMenarik data dari Cloud akan MENGHAPUS pengaturan di HP ini dan menggantinya dengan data dari Cloud.\n\nLanjutkan?");
    if(!konfirmasi) return;

    let originalText = btnElement.innerText;
    btnElement.innerText = "⏳ Menarik Data..."; btnElement.disabled = true;

    try {
        const respon = await fetch(GAS_URL + "?action=restoreMaster");
        const hasil = await respon.json();

        if (hasil.status === "sukses") {
            // Trik Ajaib: Timpa variabel referensi dengan data dari cloud
            referensi = JSON.parse(hasil.data);
            
            // Simpan ke memori HP (localStorage) agar permanen
            localStorage.setItem('dataMasterKeuanganMulti', JSON.stringify(referensi));
            
            alert("☁️⬇️ Berhasil! Master Data sukses ditarik dari Cloud.");
            
            // Render ulang seluruh UI agar menyesuaikan data baru
            if(typeof renderDropdownDaftarBisnis === 'function') renderDropdownDaftarBisnis();
            refreshAllViews();
        } 
        else if (hasil.status === "kosong") {
            alert("⚠️ Cloud kosong. Anda belum pernah melakukan Backup sebelumnya.");
        }
        else alert("❌ Gagal tarik data: " + hasil.pesan);
    } catch (err) {
        alert("🚨 Error jaringan: " + err.message);
    } finally {
        btnElement.innerText = originalText; btnElement.disabled = false;
    }
}
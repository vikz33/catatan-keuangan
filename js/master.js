function initMaster() {
    renderMasterUI();
}

function renderMasterUI() {
    let container = document.getElementById('masterDataContainer');
    container.innerHTML = ''; 

    // Render Pelaku, Rekening, Metode Bayar
    let config = [
        { key: 'pelaku', judul: 'Pelaku Transaksi (Anggota)' },
        { key: 'rekening', judul: 'Daftar Rekening & Dompet' },
        { key: 'metodeBayar', judul: 'Metode Pembayaran' }
    ];

    config.forEach(cfg => {
        let cardHTML = `
            <div class="master-card">
                <h3>${cfg.judul}</h3>
                <ul class="list-group">
                    ${referensi[cfg.key].map((item, index) => `
                        <li class="list-item">
                            <span>${item}</span> 
                            <button class="delete-btn" onclick="hapusMasterData('${cfg.key}', ${index})">Hapus</button>
                        </li>
                    `).join('')}
                </ul>
                <div class="add-row">
                    <input type="text" id="input-${cfg.key}" placeholder="Tambah baru...">
                    <button onclick="tambahMasterData('${cfg.key}')">Tambah</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    // Catatan: Kategori Cascading dikelola di backend atau disederhanakan 
    // agar UI Settings tidak terlalu membingungkan.
}

function tambahMasterData(key) {
    let inputVal = document.getElementById(`input-${key}`).value;
    if (inputVal.trim() !== "") {
        referensi[key].push(inputVal.trim());
        refreshAllViews();
    }
}

function hapusMasterData(key, index) {
    if(confirm(`Hapus "${referensi[key][index]}" dari daftar?`)) {
        referensi[key].splice(index, 1);
        refreshAllViews();
    }
}

// Sinkronisasi data ke semua tab setelah ada perubahan
function refreshAllViews() {
    renderMasterUI();
    renderSemuaDropdown();
    aturLogikaForm();
}
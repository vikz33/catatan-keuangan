window.onload = function() {
    initTheme();
    initForm();
    initDashboard();
    initMaster();
    
    // Baca profil terakhir yang dibuka dari memori (jika ada), kalau tidak, default ke Pribadi
    let profilTersimpan = localStorage.getItem('profilAktifTerakhir');
    if (profilTersimpan && referensi.daftarBisnis.includes(profilTersimpan)) {
        // Jika profil yang tersimpan adalah bisnis yang valid
        modeSedangBisnis = true;
        bisnisTerakhir = profilTersimpan;
        setProfilAktif(profilTersimpan);
    } else {
        // Default ke Pribadi
        modeSedangBisnis = false;
        setProfilAktif("Pribadi");
    }

    // Default Home adalah Dashboard
    switchTab('dashboard', document.querySelector('.tab-btn.active')); 
};

// ... (Fungsi switchTab dan initTheme biarkan seperti sebelumnya) ...
function switchTab(tabId, btnElement) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    if(btnElement) btnElement.classList.add('active');
}

function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });
}

// State untuk melacak mode dan mengingat bisnis terakhir
let modeSedangBisnis = false; 
let bisnisTerakhir = ""; 

// LOGIKA TOMBOL PENGATURAN (GEAR)
window.klikPengaturan = function() {
    let menu = document.getElementById('pengaturanDropdownMenu');
    if(modeSedangBisnis) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    } else {
        bukaMasterData();
    }
}

window.bukaMasterData = function() {
    document.getElementById('pengaturanDropdownMenu').style.display = 'none';
    switchTab('master', null); 
}

document.addEventListener('click', function(e) {
    let menuBtn = document.getElementById('btnPengaturan');
    let menu = document.getElementById('pengaturanDropdownMenu');
    if (menu && menu.style.display === 'block' && !menuBtn.contains(e.target)) {
        menu.style.display = 'none';
    }
});

// FUNGSI DIPANGGIL SAAT ICON RUMAH/KOPER DITEKAN
window.toggleModePribadiBisnis = function() {
    if (!modeSedangBisnis) {
        // Pindah dari Pribadi -> Bisnis
        if (referensi.daftarBisnis.length === 0) {
            alert("Anda belum memiliki profil bisnis. Silakan buat di Pengaturan!");
            return;
        }
        let targetBisnis = bisnisTerakhir ? bisnisTerakhir : referensi.daftarBisnis[0];
        setProfilAktif(targetBisnis); 
    } else {
        // Pindah dari Bisnis -> Pribadi
        setProfilAktif("Pribadi");
    }
}

// Menampilkan / Menyembunyikan Dropdown Custom
window.toggleCustomDropdown = function() {
    if (!modeSedangBisnis) return;
    let menu = document.getElementById('customDropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Tutup dropdown jika klik di luar area
document.addEventListener('click', function(e) {
    let menu = document.getElementById('customDropdownMenu');
    let headerGroup = document.getElementById('headerTitleGroup');
    if (menu && menu.style.display === 'block' && !headerGroup.contains(e.target)) {
        menu.style.display = 'none';
    }
});

// Render isi dropdown bisnis
window.renderDropdownDaftarBisnis = function() {
    let menu = document.getElementById('customDropdownMenu');
    if(!menu) return;
    
    menu.innerHTML = '';
    referensi.daftarBisnis.forEach(bisnis => {
        let item = document.createElement('div');
        item.className = 'custom-dropdown-item';
        item.innerText = bisnis;
        item.onclick = function(e) {
            e.stopPropagation(); 
            gantiEntitasBisnis(bisnis);
            menu.style.display = 'none';
        };
        menu.appendChild(item);
    });
}

window.gantiEntitasBisnis = function(namaBisnis) {
    if(!namaBisnis) return;
    setProfilAktif(namaBisnis);
}

// FUNGSI UTAMA MENGUBAH PROFIL
function setProfilAktif(namaProfil) {
    profilAktif = namaProfil;
    // SIMPAN KE LOCALSTORAGE AGAR TIDAK HILANG SAAT REFRESH
    localStorage.setItem('profilAktifTerakhir', profilAktif);
    
    let headerTitle = document.getElementById('appHeaderTitle');
    let headerChevron = document.getElementById('headerChevron');
    let iconHome = document.getElementById('icon-home');
    let iconBriefcase = document.getElementById('icon-briefcase');
    
    if(namaProfil === "Pribadi") {
        modeSedangBisnis = false;
        headerTitle.innerHTML = "Keuangan Pribadi"; 
        headerChevron.style.display = 'none'; 
        iconHome.style.display = 'block';
        iconBriefcase.style.display = 'none';
        // Pastikan kursor panah tidak muncul saat hover di mode pribadi
        document.getElementById('headerTitleGroup').style.cursor = 'default';
    } else {
        modeSedangBisnis = true;
        bisnisTerakhir = namaProfil;
        headerTitle.innerHTML = namaProfil; 
        headerChevron.style.display = 'block'; 
        iconHome.style.display = 'none';
        iconBriefcase.style.display = 'block';
        document.getElementById('headerTitleGroup').style.cursor = 'pointer';
        renderDropdownDaftarBisnis(); 
    }

    // Eksekusi pembaruan UI lainnya
    if(typeof renderSemuaDropdown === 'function') { renderSemuaDropdown(); aturLogikaForm(); }
    if(typeof prosesDashboard === 'function') { 
        let btnFilterAktif = document.querySelector('.filter-btn.active');
        let filterAktif = btnFilterAktif ? btnFilterAktif.innerText : 'Bulan Ini';
        prosesDashboard(filterAktif); 
    }
    if(typeof renderMasterUI === 'function') { renderMasterUI(); }
    if(typeof renderBukuUtang === 'function') { renderBukuUtang(); }
}
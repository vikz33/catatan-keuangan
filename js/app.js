window.onload = function() {
    initTheme();
    initForm();
    initDashboard();
    initMaster();
};

function switchTab(tabId, btnElement) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    btnElement.classList.add('active');
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

// Fungsi dipanggil saat ICON Rumah/Koper ditekan
window.toggleModePribadiBisnis = function() {
    if (!modeSedangBisnis) {
        // Pindah dari Pribadi -> Bisnis
        if (referensi.daftarBisnis.length === 0) {
            alert("Anda belum memiliki profil bisnis. Silakan buat di Pengaturan!");
            return;
        }
        let targetBisnis = bisnisTerakhir ? bisnisTerakhir : referensi.daftarBisnis[0];
        setProfilAktif(targetBisnis); // Ini akan otomatis mengubah modeSedangBisnis menjadi true
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
    
    let headerTitle = document.getElementById('appHeaderTitle');
    let headerChevron = document.getElementById('headerChevron');
    let iconHome = document.getElementById('icon-home');
    let iconBriefcase = document.getElementById('icon-briefcase');
    let btnManage = document.getElementById('btnManageBisnis');
    
    if(namaProfil === "Pribadi") {
        modeSedangBisnis = false;
        headerTitle.innerHTML = "Keuangan Pribadi"; 
        headerChevron.style.display = 'none'; 
        
        iconHome.style.display = 'block';
        iconBriefcase.style.display = 'none';
        btnManage.style.display = 'none';
    } else {
        modeSedangBisnis = true;
        bisnisTerakhir = namaProfil;
        
        headerTitle.innerHTML = namaProfil; // Set langsung nama bisnis
        headerChevron.style.display = 'block'; 
        
        iconHome.style.display = 'none';
        iconBriefcase.style.display = 'block';
        btnManage.style.display = 'flex'; 
        
        renderDropdownDaftarBisnis(); // Render ulang menu setiap kali pindah agar update
    }

    if(typeof renderSemuaDropdown === 'function') { renderSemuaDropdown(); aturLogikaForm(); }
    if(typeof prosesDashboard === 'function') { prosesDashboard(document.querySelector('.filter-btn.active').innerText); }
    if(typeof renderMasterUI === 'function') { renderMasterUI(); }
    if(typeof renderBukuUtang === 'function') { renderBukuUtang(); }
}
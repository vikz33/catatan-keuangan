// Dijalankan saat seluruh elemen web selesai dimuat
window.onload = function() {
    initForm();
    initDashboard();
    initMaster();
};

// Fungsi Navigasi Tab Utama
function switchTab(tabId, btnElement) {
    // Sembunyikan semua section
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    // Hapus status active dari semua tombol tab
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Tampilkan section yang dipilih
    document.getElementById('tab-' + tabId).classList.add('active');
    btnElement.classList.add('active');
}
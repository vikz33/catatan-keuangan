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

// ==========================================
// LOGIKA DARK MODE
// ==========================================
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    
    // Cek apakah user sebelumnya sudah menyimpan preferensi dark mode
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        themeToggleBtn.innerText = '☀️';
    }

    // Pasang Event Listener ke Tombol
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'true');
            themeToggleBtn.innerText = '☀️';
        } else {
            localStorage.setItem('darkMode', 'false');
            themeToggleBtn.innerText = '🌙';
        }
    });
}
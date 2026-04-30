let chartInstance = null;

function initDashboard() {
    renderChart();
}

function setFilter(btnElement) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    // Nanti ditambahkan logika tarik data berdasar filter waktu
}

function renderChart() {
    const ctx = document.getElementById('kategoriChart').getContext('2d');
    
    if(chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Rumah Tangga', 'Gaya Hidup', 'Transportasi', 'Bisnis'],
            datasets: [{
                data: [3000, 1500, 2500, 1500],
                backgroundColor: ['#60a5fa', '#34d399', '#fbbf24', '#f87171'],
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: '75%', 
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { family: 'Inter', size: 12 } } } } 
        }
    });
}
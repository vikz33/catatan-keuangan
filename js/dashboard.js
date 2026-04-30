let chartInstance = null;

function initDashboard() { renderChart(); }

function setFilter(btnElement) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
}

function renderChart() {
    const ctx = document.getElementById('kategoriChart').getContext('2d');
    if(chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Rumah Tangga', 'Gaya Hidup', 'Transportasi', 'Bisnis', 'Olahraga'],
            datasets: [{
                data: [3000, 1500, 2500, 1000, 1200],
                // Palet Pastel (Baby Blue, Mint, Peach, Soft Pink, Lavender)
                backgroundColor: ['#aecbf0', '#b5ead7', '#ffdac1', '#ffb7b2', '#c7ceea'],
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true, maintainAspectRatio: false, cutout: '75%', 
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10, font: { family: 'Inter', size: 12 } } } } 
        }
    });
}
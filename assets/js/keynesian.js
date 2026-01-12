const ctx = document.getElementById('keynesianChart').getContext('2d');

let c0 = 100;
let mpc = 0.5;
let investment = 50;

// Helper to calculate AE at a given Y
function calculateAE(y) {
    return c0 + (mpc * y) + investment;
}

// Generate data points
function generateData() {
    const data45 = [];
    const dataAE = [];
    const maxIncome = 1500; // Fixed x-axis scale

    for (let y = 0; y <= maxIncome; y += 100) {
        data45.push({ x: y, y: y });
        dataAE.push({ x: y, y: calculateAE(y) });
    }

    // Find intersection explicitly for a point
    const equilibriumY = (c0 + investment) / (1 - mpc);

    return { data45, dataAE, equilibriumY };
}

const initialData = generateData();

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            {
                label: '45° Line (Y = AE)',
                data: initialData.data45,
                borderColor: '#94a3b8',
                borderDash: [5, 5],
                pointRadius: 0,
                borderWidth: 2
            },
            {
                label: 'Aggregate Expenditure (AE)',
                data: initialData.dataAE,
                borderColor: '#38bdf8', // Accent color
                borderWidth: 3,
                pointRadius: 0
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                title: { display: true, text: 'Income (Y)', color: '#1e293b' },
                ticks: { color: '#475569' },
                grid: { color: 'rgba(0,0,0,0.1)' },
                min: 0,
                max: 1500
            },
            y: {
                title: { display: true, text: 'Expenditure (AE)', color: '#1e293b' },
                ticks: { color: '#475569' },
                grid: { color: 'rgba(0,0,0,0.1)' },
                min: 0,
                max: 1500
            }
        },
        plugins: {
            legend: {
                labels: { color: '#0f172a' }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        }
    }
});

// Update Function
function updateChart() {
    const data = generateData();
    chart.data.datasets[1].data = data.dataAE;
    chart.update();

    // Update Text Stats
    document.getElementById('calc_y').textContent = data.equilibriumY.toFixed(1);
    document.getElementById('calc_k').textContent = (1 / (1 - mpc)).toFixed(2);
}

// Event Listeners
document.getElementById('slider_c0').addEventListener('input', (e) => {
    c0 = parseFloat(e.target.value);
    document.getElementById('val_c0').textContent = c0;
    updateChart();
});

document.getElementById('slider_mpc').addEventListener('input', (e) => {
    mpc = parseFloat(e.target.value);
    document.getElementById('val_mpc').textContent = mpc;
    updateChart();
});

document.getElementById('slider_i').addEventListener('input', (e) => {
    investment = parseFloat(e.target.value);
    document.getElementById('val_i').textContent = investment;
    updateChart();
});

// Initial Calc
updateChart();

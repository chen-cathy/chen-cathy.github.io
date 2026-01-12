// Convergence Analysis for Solow-Swan Model
// Data from Convergence_4_countries.csv (2005-2024)

// ============================================================================
// DATA SECTION
// ============================================================================

const convergenceData = {
    years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],

    countries: ['Korea', 'Singapore', 'Czech Republic', 'Taiwan'],

    // GDP per capita (columns C-F from CSV)
    gdp: {
        'Korea': [21197.20, 22196.21, 23365.14, 23887.06, 23952.81, 25455.62, 26191.64, 26680.28, 27399.62, 28100.01, 28737.44, 29467.12, 30312.89, 31059.27, 31645.95, 31378.16, 32771.07, 33690.38, 34121.02, 34871.68],
        'Singapore': [41798.49, 44159.41, 46178.81, 44601.58, 43331.87, 48752.05, 50713.53, 51679.35, 53298.97, 54681.93, 55645.61, 56986.79, 59485.30, 61250.35, 61345.53, 59189.70, 67731.26, 68218.81, 66167.36, 67706.83],
        'Czech Republic': [15147.72, 16107.30, 16892.54, 17190.65, 16272.81, 16665.93, 16926.28, 16772.35, 16759.78, 17118.04, 17931.60, 18359.10, 19257.69, 19736.63, 20360.06, 19233.15, 20373.88, 20627.35, 20251.75, 20444.54],
        'Taiwan': [16600.12, 17485.93, 18607.11, 18690.28, 18324.38, 20147.16, 20839.84, 21232.32, 21690.29, 22656.57, 22930.45, 23374.06, 24189.24, 24866.13, 25608.55, 26499.99, 28418.13, 29366.31, 29656.23, 31127.85]
    },

    // ln(GDP per capita) (columns L-O from CSV)
    lnGdp: {
        'Korea': [9.9616, 10.0077, 10.0590, 10.0811, 10.0838, 10.1447, 10.1732, 10.1917, 10.2183, 10.2435, 10.2660, 10.2910, 10.3193, 10.3437, 10.3624, 10.3539, 10.3973, 10.4250, 10.4377, 10.4594],
        'Singapore': [10.6406, 10.6956, 10.7403, 10.7055, 10.6766, 10.7945, 10.8339, 10.8528, 10.8837, 10.9093, 10.9268, 10.9506, 10.9935, 11.0227, 11.0243, 10.9885, 11.1233, 11.1305, 11.0999, 11.1229],
        'Czech Republic': [9.6256, 9.6870, 9.7346, 9.7521, 9.6973, 9.7211, 9.7366, 9.7275, 9.7267, 9.7479, 9.7943, 9.8179, 9.8657, 9.8902, 9.9213, 9.8644, 9.9220, 9.9344, 9.9160, 9.9255],
        'Taiwan': [9.7172, 9.7692, 9.8313, 9.8358, 9.8160, 9.9108, 9.9446, 9.9633, 9.9846, 10.0282, 10.0402, 10.0594, 10.0937, 10.1213, 10.1507, 10.1849, 10.2548, 10.2876, 10.2974, 10.3459]
    },

    // Standard Deviation - GDP per capita (column G)
    sdGdp: [12347.31, 13044.60, 13557.97, 12668.67, 12342.29, 14456.95, 15179.88, 15594.37, 16266.30, 16643.76, 16813.07, 17235.88, 18025.76, 18600.11, 18326.60, 17470.76, 20912.13, 20881.38, 19935.33, 20384.20],

    // Coefficient of Variation - GDP per capita (column H, as percentage)
    cvGdp: [52, 52, 52, 49, 48, 52, 53, 54, 55, 54, 54, 54, 54, 54, 53, 51, 56, 55, 53, 53],

    // Standard Deviation - ln(GDP per capita) (column O)
    sdLnGdp: [0.4587, 0.4578, 0.4535, 0.4312, 0.4365, 0.4677, 0.4759, 0.4846, 0.4960, 0.4949, 0.4864, 0.4872, 0.4869, 0.4886, 0.4752, 0.4728, 0.5067, 0.5019, 0.4934, 0.4960],

    // Coefficient of Variation - ln(GDP per capita) (column P, as percentage)
    cvLnGdp: [4.59, 4.56, 4.49, 4.27, 4.34, 4.61, 4.68, 4.76, 4.86, 4.84, 4.74, 4.74, 4.72, 4.72, 4.58, 4.57, 4.86, 4.81, 4.73, 4.74],

    // Beta convergence data (rows 23-24)
    beta: {
        lnY0: { 'Korea': 9.9616, 'Singapore': 10.6406, 'Czech Republic': 9.6256, 'Taiwan': 9.7172 },
        growthRate: { 'Korea': 0.0262, 'Singapore': 0.0254, 'Czech Republic': 0.0158, 'Taiwan': 0.0331 }
    }
};

// ============================================================================
// STATE & HELPER FUNCTIONS
// ============================================================================

let currentMode = 'beta';

// Linear regression helper
function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R²
    const meanY = sumY / n;
    const predictedY = x.map(xi => slope * xi + intercept);
    const ssTot = y.reduce((a, b) => a + Math.pow(b - meanY, 2), 0);
    const ssRes = y.reduce((a, b, i) => a + Math.pow(b - predictedY[i], 2), 0);
    const r2 = 1 - (ssRes / ssTot);

    return { slope, intercept, r2, predictedY };
}

// ============================================================================
// CHART RENDERING FUNCTIONS
// ============================================================================

function renderBetaConvergence() {
    const countries = convergenceData.countries;
    const lnY0 = countries.map(c => convergenceData.beta.lnY0[c]);
    const growthRate = countries.map(c => convergenceData.beta.growthRate[c]);

    // Perform regression: g = α - β * ln(y0)
    const regression = linearRegression(lnY0, growthRate);
    const alpha = regression.intercept;
    const beta = -regression.slope; // Note: we negate to match Δy = α - β ln(y₀)
    const r2 = regression.r2;

    // Create regression line
    const minX = Math.min(...lnY0);
    const maxX = Math.max(...lnY0);
    const xRange = [minX - 0.1, maxX + 0.1];
    const yRegression = xRange.map(x => alpha - beta * x);

    // Scatter plot data
    const scatterTrace = {
        x: lnY0,
        y: growthRate,
        mode: 'markers+text',
        type: 'scatter',
        name: 'Countries',
        text: countries,
        textposition: 'top center',
        marker: {
            size: 12,
            color: '#3b82f6',
            line: { width: 2, color: '#1e40af' }
        }
    };

    // Regression line
    const regressionTrace = {
        x: xRange,
        y: yRegression,
        mode: 'lines',
        type: 'scatter',
        name: 'Regression',
        line: {
            color: '#ef4444',
            width: 2,
            dash: 'dash'
        }
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#1e293b', family: 'Inter, sans-serif' },
        xaxis: {
            title: 'ln(GDP per capita) in 2005',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#cbd5e1'
        },
        yaxis: {
            title: 'Average Growth Rate (2005-2024)',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#cbd5e1',
            tickformat: '.2%'
        },
        showlegend: true,
        legend: { x: 0.02, y: 0.02 },
        annotations: [{
            x: 0.02,
            y: 0.98,
            xref: 'paper',
            yref: 'paper',
            text: `Δy = ${alpha.toFixed(4)} - ${beta.toFixed(4)} ln(y₀)<br>R² = ${r2.toFixed(4)}`,
            showarrow: false,
            font: { size: 12, color: '#475569', family: 'monospace' },
            bgcolor: 'rgba(255,255,255,0.9)',
            bordercolor: '#cbd5e1',
            borderwidth: 1,
            borderpad: 8,
            xanchor: 'left',
            yanchor: 'top'
        }]
    };

    Plotly.newPlot('conv-chart', [scatterTrace, regressionTrace], layout, { responsive: true });

    // Update analysis card
    updateAnalysisCard({
        'R²': r2.toFixed(4),
        'α (intercept)': alpha.toFixed(4),
        'β (slope)': beta.toFixed(4),
        'Interpretation': beta > 0 ? 'Convergence ✓' : 'Divergence ✗'
    });
}

function renderSigmaConvergence(type, metric) {
    let yData, yLabel, equation;

    if (type === 'gdp') {
        if (metric === 'sd') {
            yData = convergenceData.sdGdp;
            yLabel = 'Standard Deviation (USD)';
            equation = 'σₜ = SD(GDP₁ₜ, GDP₂ₜ, GDP₃ₜ, GDP₄ₜ)';
        } else { // cv
            yData = convergenceData.cvGdp;
            yLabel = 'Coefficient of Variation (%)';
            equation = 'CVₜ = (σₜ / μₜ) × 100';
        }
    } else { // ln
        if (metric === 'sd') {
            yData = convergenceData.sdLnGdp;
            yLabel = 'Standard Deviation';
            equation = 'σₜ = SD(ln(GDP₁ₜ), ln(GDP₂ₜ), ln(GDP₃ₜ), ln(GDP₄ₜ))';
        } else { // cv
            yData = convergenceData.cvLnGdp;
            yLabel = 'Coefficient of Variation (%)';
            equation = 'CVₜ = (σₜ / μₜ) × 100';
        }
    }

    const trace = {
        x: convergenceData.years,
        y: yData,
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Dispersion',
        line: {
            color: '#3b82f6',
            width: 3
        },
        marker: {
            size: 6,
            color: '#1e40af'
        }
    };

    // Calculate trend
    const yearIndices = convergenceData.years.map((_, i) => i);
    const trend = linearRegression(yearIndices, yData);
    const trendY = convergenceData.years.map((_, i) => trend.slope * i + trend.intercept);

    const trendTrace = {
        x: convergenceData.years,
        y: trendY,
        mode: 'lines',
        type: 'scatter',
        name: 'Trend',
        line: {
            color: '#ef4444',
            width: 2,
            dash: 'dash'
        }
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#1e293b', family: 'Inter, sans-serif' },
        xaxis: {
            title: 'Year',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#cbd5e1'
        },
        yaxis: {
            title: yLabel,
            gridcolor: '#e2e8f0',
            zerolinecolor: '#cbd5e1'
        },
        showlegend: true,
        legend: { x: 0.02, y: 0.98 },
        annotations: [{
            x: 0.98,
            y: 0.98,
            xref: 'paper',
            yref: 'paper',
            text: equation,
            showarrow: false,
            font: { size: 12, color: '#475569', family: 'monospace' },
            bgcolor: 'rgba(255,255,255,0.9)',
            bordercolor: '#cbd5e1',
            borderwidth: 1,
            borderpad: 8,
            xanchor: 'right',
            yanchor: 'top'
        }]
    };

    Plotly.newPlot('conv-chart', [trace, trendTrace], layout, { responsive: true });

    // Update analysis card
    const initialValue = yData[0];
    const finalValue = yData[yData.length - 1];
    const change = finalValue - initialValue;
    const changePercent = (change / initialValue) * 100;

    updateAnalysisCard({
        'Initial (2005)': initialValue.toFixed(2),
        'Final (2024)': finalValue.toFixed(2),
        'Change': change.toFixed(2),
        'Change (%)': changePercent.toFixed(2) + '%',
        'Trend': trend.slope < 0 ? 'Converging ✓' : 'Diverging ✗'
    });
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

function updateAnalysisCard(stats) {
    const container = document.getElementById('conv-model-details');
    if (!container) {
        console.error('Model Analysis container not found');
        return;
    }

    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr auto';
    container.style.gap = '0.5rem';
    container.style.fontSize = '0.85rem';

    for (const [label, value] of Object.entries(stats)) {
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.color = '#64748b';
        labelSpan.style.fontWeight = '400';

        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        valueSpan.style.fontWeight = '600';
        valueSpan.style.textAlign = 'right';
        valueSpan.style.color = '#0f172a';

        container.appendChild(labelSpan);
        container.appendChild(valueSpan);
    }
}

function updateChartTitleAndDescription(mode) {
    const titleEl = document.getElementById('conv-chart-title');
    const descEl = document.getElementById('conv-chart-description');

    const configs = {
        'beta': {
            title: 'Beta Convergence: Catch-up Effect',
            description: 'Regression of Average Growth Rate on Initial GDP Level. A negative slope indicates convergence.'
        },
        'sigma-gdp-sd': {
            title: 'Sigma Convergence: Standard Deviation of GDP per capita',
            description: 'Evolution of absolute dispersion (standard deviation) of GDP per capita over time.'
        },
        'sigma-gdp-cv': {
            title: 'Sigma Convergence: Coefficient of Variation of GDP per capita',
            description: 'Evolution of relative dispersion (coefficient of variation) of GDP per capita over time.'
        },
        'sigma-ln-sd': {
            title: 'Sigma Convergence: Standard Deviation of ln(GDP per capita)',
            description: 'Evolution of absolute dispersion (standard deviation) of log GDP per capita over time.'
        },
        'sigma-ln-cv': {
            title: 'Sigma Convergence: Coefficient of Variation of ln(GDP per capita)',
            description: 'Evolution of relative dispersion (coefficient of variation) of log GDP per capita over time.'
        }
    };

    titleEl.textContent = configs[mode].title;
    descEl.textContent = configs[mode].description;
}

// ============================================================================
// MODE SWITCHING
// ============================================================================

function switchConvMode(mode) {
    currentMode = mode;
    updateChartTitleAndDescription(mode);

    if (mode === 'beta') {
        renderBetaConvergence();
    } else if (mode === 'sigma-gdp-sd') {
        renderSigmaConvergence('gdp', 'sd');
    } else if (mode === 'sigma-gdp-cv') {
        renderSigmaConvergence('gdp', 'cv');
    } else if (mode === 'sigma-ln-sd') {
        renderSigmaConvergence('ln', 'sd');
    } else if (mode === 'sigma-ln-cv') {
        renderSigmaConvergence('ln', 'cv');
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    switchConvMode('beta');
});

// Also initialize immediately if DOM already loaded
if (document.readyState === 'loading') {
    // DOM still loading, event listener will handle it
} else {
    // DOM already loaded
    switchConvMode('beta');
}

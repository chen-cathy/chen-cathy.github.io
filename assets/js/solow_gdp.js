
// Solow-Swan GDP Trends Logic (Part I)
// Re-implemented with Raw Data Injection and Dynamic Regression

// --- Raw Data Embedding (Source: 2025/SP2_*.csv) ---

const csvSingapore = `
,GDP per capita (constant 2015 US$,population,ln(basic indices),S-S model GDP per capita
2005,41798.49,"14,913,564",ln(Lt/L0)=y,l = L0·egt
2006,44159.41,"15,220,495",0.0549459,42963.73
2007,46178.81,"15,505,121",0.099661,44161.46 
2008,44601.58,"15,784,817",0.0649091,45392.58
2009,43331.87,"16,075,128",0.0360283,46658.02
2010,48752.05,"16,401,413",0.1538871,47958.74
2011,50713.53,"16,730,895",0.1933326,49295.72
2012,51679.35,"17,042,272",0.2121982,50669.97
2013,53298.97,"17,372,779",0.2430569,52082.53
2014,54681.93,"17,704,538",0.2686732,53534.47
2015,55645.61,"18,029,982",0.286143,55026.89 
2016,56986.79,"18,354,855",0.3099592,56560.92
2017,59485.3,"18,653,146",0.3528691,58137.7  
2018,61250.35,"18,929,866",0.3821094,59758.45
2019,61345.53,"19,191,510",0.3836621,61424.38
2020,59189.7,"19,411,454",0.3478874,63136.75 
2021,67731.26,"19,617,046",0.4826877,64896.85
2022,68218.81,"19,839,704",0.4898601,66706.03
2023,66167.36,"20,055,492",0.4593271,68565.64
2024,67706.83,"20,278,946",0.4823269,70477.09
`;

const csvTaiwan = `
,GDP per capita (constant 2015 US$,population,ln(basic indices),S-S model GDP per capita
2005,16600.12,"14,913,564",ln(Lt/L0)=y,l = L0·egt
2006,17485.93,"15,220,495",0.0519869,17150.51
2007,18607.11,"15,505,121",0.1141338,17719.15
2008,18690.28,"15,784,817",0.1185937,18306.64
2009,18324.38,"16,075,128",0.0988225,18913.62
2010,20147.16,"16,401,413",0.1936537,19540.72
2011,20839.84,"16,730,895",0.2274568,20188.61
2012,21232.32,"17,042,272",0.246115,20857.98
2013,21690.29,"17,372,779",0.2674548,21549.55
2014,22656.57,"17,704,538",0.3110401,22264.04
2015,22930.45,"18,029,982",0.323056,23002.23
2016,23374.06,"18,354,855",0.3422174,23764.89
2017,24189.24,"18,653,146",0.3764984,24552.84
2018,24866.13,"18,929,866",0.4040971,25366.91
2019,25608.55,"19,191,510",0.4335167,26207.97
2020,26499.99,"19,411,454",0.4677345,27076.92
2021,28418.13,"19,617,046",0.5376177,27974.68
2022,29366.31,"19,839,704",0.5704384,28902.21
2023,29656.23,"20,055,492",0.5802625,29860.49
2024,31127.85,"20,278,946",0.6286932,30850.55
`;

const csvCzechia = `
,GDP per capita (constant 2015 US$,population,ln(basic indices),S-S model GDP per capita
2005,15147.72,"14,913,564",ln(Lt/L0)=y,l = L0·egt
2006,16107.3,"15,220,495",0.0614227,15416.69
2007,16892.54,"15,505,121",0.1090222,15690.43
2008,17190.65,"15,784,817",0.1265153,15969.03
2009,16272.81,"16,075,128",0.0716454,16252.58
2010,16665.93,"16,401,413",0.0955165,16541.17
2011,16926.28,"16,730,895",0.1110176,16834.87
2012,16772.35,"17,042,272",0.1018818,17133.8
2013,16759.78,"17,372,779",0.1011319,17438.03
2014,17118.04,"17,704,538",0.1222829,17747.66
2015,17931.6,"18,029,982",0.1687143,18062.79
2016,18359.1,"18,354,855",0.1922751,18383.52
2017,19257.69,"18,653,146",0.2400605,18709.94
2018,19736.63,"18,929,866",0.2646262,19042.16
2019,20360.06,"19,191,510",0.295725,19380.28
2020,19233.15,"19,411,454",0.2387851,19724.4
2021,20373.88,"19,617,046",0.2964035,20074.63
2022,20627.35,"19,839,704",0.3087677,20431.08
2023,20251.75,"20,055,492",0.290391,20793.86
2024,20444.54,"20,278,946",0.2998659,21163.08
`;

// --- Parsing Logic ---

function parseCSV(csvContent, countryName) {
    const lines = csvContent.trim().split('\n');
    const data = [];

    // Skip header (starts at line 2 usually, 0-indexed line 1 is header if line 0 is empty?)
    // Based on output: Line 0: empty+headers. Line 1: 2005.
    // Ensure we filter valid lines starting with a year.

    lines.forEach((line, index) => {
        const parts = line.split(',');
        if (parts.length < 2) return;

        const year = parseInt(parts[0].trim());
        const gdpStr = parts[1].trim(); // Assuming format 41798.49 (no commas in number itself? wait, output was 41798.49)
        // Note: Population had quotes "14,913,564". GDP col seems clean without quotes.

        if (!isNaN(year) && year >= 2005 && year <= 2024) {
            const gdp = parseFloat(gdpStr);
            if (!isNaN(gdp)) {
                data.push({ year, gdp, country: countryName });
            }
        }
    });

    // Validation
    const missingYears = [];
    for (let y = 2005; y <= 2024; y++) {
        if (!data.find(d => d.year === y)) missingYears.push(y);
    }

    if (missingYears.length > 0) {
        console.warn(`[Data Warning] ${countryName} missing years: ${missingYears.join(', ')}`);
    } else {
        console.log(`[Data Success] ${countryName}: Loaded ${data.length} rows (2005-2024).`);
    }

    return data;
}

const fullData = [
    ...parseCSV(csvSingapore, 'Singapore'),
    ...parseCSV(csvTaiwan, 'Taiwan'),
    ...parseCSV(csvCzechia, 'Czechia') // Mapped to 'Czechia' directly
];

// Benchmarks for Logging
const benchmarks = {
    'Singapore': 0.0275,
    'Taiwan': 0.0326,
    'Czechia': 0.0176
};

// State
const stateGDP = {
    selectedCountries: ['Singapore'],
    focusCountry: 'Singapore',
    minYear: 2005,
    maxYear: 2024
};

// --- Regression Logic ---

function getMatrixInverse3x3(m) {
    const det = m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    if (Math.abs(det) < 1e-9) return null;

    const invdet = 1 / det;
    const minv = [];
    minv[0] = [
        (m[1][1] * m[2][2] - m[2][1] * m[1][2]) * invdet,
        (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invdet,
        (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invdet
    ];
    minv[1] = [
        (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invdet,
        (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invdet,
        (m[1][0] * m[0][2] - m[0][0] * m[1][2]) * invdet
    ];
    minv[2] = [
        (m[1][0] * m[2][1] - m[2][0] * m[1][1]) * invdet,
        (m[2][0] * m[0][1] - m[0][0] * m[2][1]) * invdet,
        (m[0][0] * m[1][1] - m[1][0] * m[0][1]) * invdet
    ];
    return minv;
}

function solveQuadratic(x, y) {
    const n = x.length;
    let s_x0 = n, s_x1 = 0, s_x2 = 0, s_x3 = 0, s_x4 = 0;
    let s_y = 0, s_xy = 0, s_x2y = 0;

    for (let i = 0; i < n; i++) {
        const xi = x[i];
        const yi = y[i];
        const xi2 = xi * xi;
        const xi3 = xi2 * xi;
        const xi4 = xi3 * xi;

        s_x1 += xi; s_x2 += xi2; s_x3 += xi3; s_x4 += xi4;
        s_y += yi; s_xy += xi * yi; s_x2y += xi2 * yi;
    }

    const M = [[s_x4, s_x3, s_x2], [s_x3, s_x2, s_x1], [s_x2, s_x1, s_x0]];
    const Yvec = [s_x2y, s_xy, s_y];
    const Minv = getMatrixInverse3x3(M);

    if (!Minv) return { a: 0, b: 0, c: 0 };

    const a = Minv[0][0] * Yvec[0] + Minv[0][1] * Yvec[1] + Minv[0][2] * Yvec[2];
    const b = Minv[1][0] * Yvec[0] + Minv[1][1] * Yvec[1] + Minv[1][2] * Yvec[2];
    const c = Minv[2][0] * Yvec[0] + Minv[2][1] * Yvec[1] + Minv[2][2] * Yvec[2];

    return { a, b, c };
}

function calculateR2(actualY, predictedY) {
    const n = actualY.length;
    const meanY = actualY.reduce((a, b) => a + b, 0) / n;
    const ssTot = actualY.reduce((a, b) => a + Math.pow(b - meanY, 2), 0);
    const ssRes = actualY.reduce((a, b, i) => a + Math.pow(b - predictedY[i], 2), 0);
    return 1 - (ssRes / ssTot);
}

function getExponentialModel(country, xVals, yVals) {
    // Model: y = A * e^(g * x) -> ln(y) = ln(A) + g*x
    const lnY = yVals.map(y => Math.log(y));
    const n = xVals.length;

    // Linear Regression
    const sumX = xVals.reduce((a, b) => a + b, 0);
    const sumY = lnY.reduce((a, b) => a + b, 0);
    const sumXY = xVals.reduce((a, b, i) => a + b * lnY[i], 0);
    const sumXX = xVals.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const g = slope;
    const A = Math.exp(intercept);

    // Benchmark Check
    const benchmark = benchmarks[country];
    if (benchmark) {
        const diff = Math.abs(g - benchmark);
        if (diff > 0.005) { // 0.5% point tolerance
            console.warn(`[Model Warning] ${country}: Calc g=${(g * 100).toFixed(3)}% deviates >0.5% from benchmark ${(benchmark * 100).toFixed(3)}%`);
        } else {
            console.log(`[Model Valid] ${country}: Calc g=${(g * 100).toFixed(3)}% within tolerance.`);
        }
    }

    const predictedY = xVals.map(x => A * Math.exp(g * x));
    return { A, g, predictedY, r2: calculateR2(yVals, predictedY) };
}

function getPolynomialModel(xVals, yVals) {
    const { a, b, c } = solveQuadratic(xVals, yVals);
    const predictedY = xVals.map(x => a * x * x + b * x + c);
    return { a, b, c, predictedY, r2: calculateR2(yVals, predictedY) };
}


// --- Chart Render ---

function updateCharts() {
    const traces = [];
    const colors = { 'Singapore': '#0ea5e9', 'Taiwan': '#8b5cf6', 'Czechia': '#f59e0b' };

    stateGDP.selectedCountries.forEach(country => {
        const cData = fullData
            .filter(d => d.country === country && d.year >= stateGDP.minYear && d.year <= stateGDP.maxYear)
            .sort((a, b) => a.year - b.year);

        if (cData.length === 0) return;

        const xVals = cData.map(d => d.year - stateGDP.minYear); // 0-based index for regression x
        const years = cData.map(d => d.year);
        const yVals = cData.map(d => d.gdp);

        // 1. Actual
        traces.push({
            x: years,
            y: yVals,
            mode: 'markers',
            name: `${country} (Actual)`,
            marker: { color: colors[country], size: 8, opacity: 0.7 }
        });

        // 2. Trends (Focus Only)
        if (country === stateGDP.focusCountry) {
            const expModel = getExponentialModel(country, xVals, yVals);
            const polyModel = getPolynomialModel(xVals, yVals);

            traces.push({
                x: years,
                y: expModel.predictedY,
                mode: 'lines',
                name: `${country} (S-S Exp)`,
                line: { color: colors[country], width: 3 }
            });

            traces.push({
                x: years,
                y: polyModel.predictedY,
                mode: 'lines',
                name: `${country} (Poly)`,
                line: { color: colors[country], width: 3, dash: 'dot' }
            });

            updateAnalysisCard(country, expModel, polyModel);
        }
    });

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Inter, sans-serif', color: '#1e293b' },
        xaxis: { title: 'Year', gridcolor: '#e2e8f0', zerolinecolor: '#e2e8f0' },
        yaxis: { title: 'GDP per Capita (Constant)', gridcolor: '#e2e8f0', zerolinecolor: '#e2e8f0' },
        margin: { t: 30, r: 20, b: 40, l: 60 },
        legend: { orientation: 'h', y: -0.2 }
    };

    Plotly.newPlot('gdp-trendChart', traces, layout, { responsive: true, displayModeBar: false });
}

function updateAnalysisCard(country, expModel, polyModel) {
    const container = document.getElementById('model-details');
    if (!container) return;
    container.innerHTML = '';

    const ssDiv = document.createElement('div');
    ssDiv.style.borderBottom = '1px solid #e2e8f0';
    ssDiv.style.paddingBottom = '0.5rem';

    ssDiv.innerHTML = `
        <strong style="color:var(--accent-color);">Solow-Swan (First Order)</strong><br>
        <span style="color:#64748b;">y = ${expModel.A.toFixed(0)}e<sup>${expModel.g.toFixed(4)}x</sup></span><br>
        R² = <strong>${expModel.r2.toFixed(4)}</strong>
    `;

    const polyDiv = document.createElement('div');
    polyDiv.innerHTML = `
        <strong style="color:var(--accent-color);">Polynomial (Order 2)</strong><br>
        <span style="color:#64748b;">y = ${polyModel.a.toFixed(2)}x² + ${polyModel.b.toFixed(2)}x + ${polyModel.c.toFixed(0)}</span><br>
        R² = <strong>${polyModel.r2.toFixed(4)}</strong>
    `;

    container.appendChild(ssDiv);
    container.appendChild(polyDiv);
}

// UI Setup
const countriesGDP = ['Singapore', 'Taiwan', 'Czechia'];
const checkboxContainerGDP = document.getElementById('gdp-country-checkboxes');
const focusSelectGDP = document.getElementById('gdp-focus-country-select');

// Clear
if (checkboxContainerGDP) checkboxContainerGDP.innerHTML = '';
if (focusSelectGDP) focusSelectGDP.innerHTML = '';

if (checkboxContainerGDP && focusSelectGDP) {
    countriesGDP.forEach(c => {
        const label = document.createElement('label');
        label.style.marginRight = '1rem';
        label.style.cursor = 'pointer';
        label.style.display = 'block';

        let displayName = (c === 'Czechia') ? 'Czech Republic' : c;

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.value = c;
        check.checked = stateGDP.selectedCountries.includes(c);

        check.onchange = () => {
            if (check.checked) {
                stateGDP.selectedCountries.push(c);
                if (stateGDP.selectedCountries.length === 1) {
                    stateGDP.focusCountry = c;
                    focusSelectGDP.value = c;
                }
            } else {
                stateGDP.selectedCountries = stateGDP.selectedCountries.filter(x => x !== c);
                if (stateGDP.focusCountry === c && stateGDP.selectedCountries.length > 0) {
                    stateGDP.focusCountry = stateGDP.selectedCountries[0];
                    focusSelectGDP.value = stateGDP.focusCountry;
                }
            }
            updateCharts();
        };

        label.appendChild(check);
        label.appendChild(document.createTextNode(' ' + displayName));
        checkboxContainerGDP.appendChild(label);

        const opt = document.createElement('option');
        opt.value = c;
        opt.innerText = displayName;
        focusSelectGDP.appendChild(opt);
    });

    focusSelectGDP.value = stateGDP.focusCountry;
    focusSelectGDP.onchange = (e) => {
        stateGDP.focusCountry = e.target.value;
        if (!stateGDP.selectedCountries.includes(stateGDP.focusCountry)) {
            stateGDP.selectedCountries.push(stateGDP.focusCountry);
            const checks = checkboxContainerGDP.querySelectorAll('input');
            for (let ck of checks) {
                if (ck.value === stateGDP.focusCountry) ck.checked = true;
            }
        }
        updateCharts();
    };
}

// Kickoff
updateCharts();

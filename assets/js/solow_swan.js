// 1. Data Source (Hardcoded as per user provided Python snippet)
const taiwanData = [
    { year: 2000, gdp: 14908, country: 'Taiwan' }, { year: 2001, gdp: 13397, country: 'Taiwan' },
    { year: 2002, gdp: 13686, country: 'Taiwan' }, { year: 2003, gdp: 14066, country: 'Taiwan' },
    { year: 2004, gdp: 15317, country: 'Taiwan' }, { year: 2005, gdp: 16456, country: 'Taiwan' },
    { year: 2006, gdp: 16934, country: 'Taiwan' }, { year: 2007, gdp: 17757, country: 'Taiwan' },
    { year: 2008, gdp: 18081, country: 'Taiwan' }, { year: 2009, gdp: 16933, country: 'Taiwan' },
    { year: 2010, gdp: 19197, country: 'Taiwan' }, { year: 2011, gdp: 20866, country: 'Taiwan' },
    { year: 2012, gdp: 21295, country: 'Taiwan' }, { year: 2013, gdp: 21973, country: 'Taiwan' },
    { year: 2014, gdp: 22874, country: 'Taiwan' }, { year: 2015, gdp: 22780, country: 'Taiwan' },
    { year: 2016, gdp: 23091, country: 'Taiwan' }, { year: 2017, gdp: 25080, country: 'Taiwan' },
    { year: 2018, gdp: 25838, country: 'Taiwan' }, { year: 2019, gdp: 25909, country: 'Taiwan' },
    { year: 2020, gdp: 28383, country: 'Taiwan' }, { year: 2021, gdp: 33004, country: 'Taiwan' },
    { year: 2022, gdp: 32756, country: 'Taiwan' }, { year: 2023, gdp: 32339, country: 'Taiwan' },
    { year: 2024, gdp: 34430, country: 'Taiwan' }
];

const worldDataRaw = {
    'Czechia': [6032, 5753, 5768, 5982, 6333, 6631, 6792, 6983, 7127, 7450, 7730, 8057, 8405, 8923, 9387, 10036, 10712, 11177, 10792, 10998, 11421, 11544, 11662, 12076, 12596],
    'Korea, Rep.': [12257, 11561, 12792, 14039, 15438, 16870, 18356, 19876, 18340, 16632, 20540, 22489, 22807, 23842, 25052, 25082, 25906, 27608, 29242, 28675, 28422, 31296, 29433, 30058, 31000],
    'Singapore': [23793, 21577, 22016, 23573, 27405, 29870, 33390, 39224, 39722, 38578, 46570, 53094, 54452, 55618, 56007, 53630, 53880, 57714, 62837, 62422, 58063, 67855, 72794, 74609, 76000]
};

// Process Data
let fullData = [...taiwanData];
const years = Array.from({ length: 25 }, (_, i) => 2000 + i);

for (const [country, vals] of Object.entries(worldDataRaw)) {
    vals.forEach((val, i) => {
        fullData.push({ year: years[i], gdp: val, country: country });
    });
}

// State
const state = {
    selectedCountries: ['Taiwan', 'Czechia'],
    focusCountry: 'Taiwan',
    minYear: 2000,
    maxYear: 2024
};

// UI Initialization
const countries = [...new Set(fullData.map(d => d.country))];
const checkboxContainer = document.getElementById('country-checkboxes');
const focusSelect = document.getElementById('focus-country-select');

countries.forEach(c => {
    // Checkbox
    const label = document.createElement('label');
    label.style.marginRight = '1rem';
    label.style.cursor = 'pointer';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.value = c;
    check.checked = state.selectedCountries.includes(c);
    check.onchange = () => {
        if (check.checked) state.selectedCountries.push(c);
        else state.selectedCountries = state.selectedCountries.filter(x => x !== c);
        updateCharts();
    };
    label.appendChild(check);
    label.appendChild(document.createTextNode(' ' + c));
    checkboxContainer.appendChild(label);

    // Dropdown
    const opt = document.createElement('option');
    opt.value = c;
    opt.text = c;
    focusSelect.appendChild(opt);
});

focusSelect.value = state.focusCountry;
focusSelect.onchange = (e) => {
    state.focusCountry = e.target.value;
    updateCharts();
};

document.getElementById('slider-min').oninput = (e) => {
    const val = parseInt(e.target.value);
    if (val >= state.maxYear) e.target.value = state.maxYear - 1;
    state.minYear = parseInt(e.target.value);
    document.getElementById('year-display').innerText = `${state.minYear} - ${state.maxYear}`;
    updateCharts();
};

document.getElementById('slider-max').oninput = (e) => {
    const val = parseInt(e.target.value);
    if (val <= state.minYear) e.target.value = state.minYear + 1;
    state.maxYear = parseInt(e.target.value);
    document.getElementById('year-display').innerText = `${state.minYear} - ${state.maxYear}`;
    updateCharts();
};

// Math Helpers
function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R2 calc
    const yMean = sumY / n;
    const ssTot = y.reduce((a, b) => a + Math.pow(b - yMean, 2), 0);
    const ssRes = x.reduce((a, b, i) => a + Math.pow(y[i] - (slope * b + intercept), 2), 0);
    const r2 = 1 - (ssRes / ssTot);

    return { slope, intercept, r2 };
}

// Chart Render Logic
function updateCharts() {
    // Filter Data
    const filtered = fullData.filter(d =>
        state.selectedCountries.includes(d.country) &&
        d.year >= state.minYear &&
        d.year <= state.maxYear
    );

    // 1. Trend Chart
    const traces = [];
    state.selectedCountries.forEach(c => {
        const cData = filtered.filter(d => d.country === c).sort((a, b) => a.year - b.year);
        if (cData.length === 0) return;

        traces.push({
            x: cData.map(d => d.year),
            y: cData.map(d => d.gdp),
            mode: 'lines+markers',
            name: c
        });

        // Add regression if focused
        if (c === state.focusCountry && cData.length > 2) {
            const x = cData.map(d => d.year);
            const y = cData.map(d => d.gdp);
            const reg = linearRegression(x, y);

            const xMin = Math.min(...x);
            const xMax = Math.max(...x);

            traces.push({
                x: [xMin, xMax],
                y: [reg.slope * xMin + reg.intercept, reg.slope * xMax + reg.intercept],
                mode: 'lines',
                name: `${c} Trend`,
                line: { dash: 'dot' }
            });

            document.getElementById('regression-output').innerText =
                `${c} Regression: y = ${reg.slope.toFixed(2)}x + ${reg.intercept.toFixed(2)} (R²=${reg.r2.toFixed(3)})`;
        }
    });

    const layoutCommon = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#1e293b' },
        xaxis: { gridcolor: '#cbd5e1', zerolinecolor: '#cbd5e1' },
        yaxis: { gridcolor: '#cbd5e1', zerolinecolor: '#cbd5e1' }
    };

    Plotly.newPlot('trendChart', traces, {
        ...layoutCommon,
        title: 'GDP Over Time',
    });

    // 2. Convergence Chart
    const convData = [];
    state.selectedCountries.forEach(c => {
        const cData = fullData.filter(d => d.country === c).sort((a, b) => a.year - b.year);
        // Find start and end within range
        const start = cData.find(d => d.year === state.minYear);
        const end = cData.find(d => d.year === state.maxYear);

        if (start && end) {
            const lnInit = Math.log(start.gdp);
            const growth = (Math.log(end.gdp) - lnInit) / (state.maxYear - state.minYear);
            convData.push({ country: c, x: lnInit, y: growth });
        }
    });

    if (convData.length > 0) {
        const traceConv = {
            x: convData.map(d => d.x),
            y: convData.map(d => d.y),
            mode: 'markers+text',
            text: convData.map(d => d.country),
            textposition: 'top center',
            name: 'Countries',
            marker: { size: 12, color: '#38bdf8' }
        };

        // Simple regression line for convergence
        let regLine = {};
        if (convData.length > 1) {
            const reg = linearRegression(convData.map(d => d.x), convData.map(d => d.y));
            const xMin = Math.min(...convData.map(d => d.x));
            const xMax = Math.max(...convData.map(d => d.x));
            regLine = {
                x: [xMin, xMax],
                y: [reg.slope * xMin + reg.intercept, reg.slope * xMax + reg.intercept],
                mode: 'lines',
                name: 'Trend',
                line: { color: 'red' }
            };
        }

        Plotly.newPlot('convergenceChart', [traceConv, regLine], {
            ...layoutCommon,
            title: 'Beta Convergence',
            xaxis: { title: 'Log Initial GDP', gridcolor: '#cbd5e1' },
            yaxis: { title: 'Avg Growth Rate', gridcolor: '#cbd5e1' }
        });
    }
}

// Tab Switching
window.switchTab = function (tabName) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (tabName === 'trend') {
        document.getElementById('trend-view').style.display = 'block';
        document.getElementById('convergence-view').style.display = 'none';
        Plotly.relayout('trendChart', { autosize: true });
    } else {
        document.getElementById('trend-view').style.display = 'none';
        document.getElementById('convergence-view').style.display = 'block';
        Plotly.relayout('convergenceChart', { autosize: true });
    }
}

// Init
updateCharts();

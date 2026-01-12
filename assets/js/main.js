document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('report-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Data is loaded via script tag in index.html
    const data = window.filesData || (typeof filesData !== 'undefined' ? filesData : null);

    if (data) {
        renderReports(data);
        setupFilters(data);
    } else {
        console.error('filesData is missing');
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 2rem; border: 1px solid #ef4444; border-radius: 0.5rem; background: rgba(239,68,68,0.1);">
                <h3><i class="fa-solid fa-triangle-exclamation"></i> Configuration Error</h3>
                <p>Failed to load report data (data.js).</p>
                <p style="font-size: 0.8rem; opacity: 0.8;">Check the browser console (F12) for details.</p>
            </div>
        `;
    }

    function renderReports(reports) {
        grid.innerHTML = '';

        if (reports.length === 0) {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--text-secondary);">No reports found for this category.</p>';
            return;
        }

        reports.forEach(report => {
            const card = document.createElement('div');
            card.className = 'report-card';

            // Determine Card Content based on Category/Type
            let buttonHTML = '';
            let icon = 'fa-file-lines'; // Default

            // Identify Type
            const isAILab = report.category === 'AI Lab / Workflow';
            const isStandard = ['Economic Models', 'Legal Analysis', 'Management'].includes(report.category);

            // Get target attribute
            const targetAttr = report.target ? `target="${report.target}"` : '';

            if (isAILab) {
                // TYPE B: AI Lab / Workflow Cards (Single Button)
                icon = 'fa-microchip';
                buttonHTML = `
                    <a href="${report.file}" class="btn-workflow" ${targetAttr}>
                        <i class="fa-solid fa-magnifying-glass"></i> View Workflow Record
                    </a>
                `;
            } else if (isStandard) {
                // TYPE A: Standard Research Cards (Dual Buttons)
                if (report.category === 'Economic Models') icon = 'fa-chart-line';
                if (report.category === 'Legal Analysis') icon = 'fa-scale-balanced';
                if (report.category === 'Management') icon = 'fa-briefcase';

                buttonHTML = `
                    <div class="dual-btn-container">
                        <a href="${report.pdf_link || '#'}" class="btn-original" ${targetAttr}>
                            <i class="fa-regular fa-file-pdf"></i> Original Research
                        </a>
                        <a href="${report.file || '#'}" class="btn-interactive" ${targetAttr}>
                            <i class="fa-solid fa-robot"></i> Research v.s. AI Synergy
                        </a>
                    </div>
                `;
            } else {
                // Fallback (e.g. About Me)
                icon = 'fa-user';
                buttonHTML = `
                    <a href="${report.file || '#'}" class="btn-primary" style="width:100%; justify-content:center;" ${targetAttr}>
                        View Profile
                    </a>
                `;
            }

            card.innerHTML = `
                <div class="report-meta">
                    <span class="category-tag">${report.category}</span>
                    <i class="fa-solid ${icon} card-icon"></i>
                </div>
                <h3 class="report-title">${report.title}</h3>
                <p class="report-desc">${report.description}</p>
                <div class="card-actions">
                    ${buttonHTML}
                </div>
            `;

            grid.appendChild(card);
        });
    }

    function setupFilters(allReports) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // UI Toggle
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                if (filter === 'all') {
                    renderReports(allReports);
                } else {
                    // Filter by matching the Category property
                    const filtered = allReports.filter(r => r.category === filter);
                    renderReports(filtered);
                }
            });
        });
    }
});
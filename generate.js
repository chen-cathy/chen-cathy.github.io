const fs = require('fs');

// 讀取資料與模板
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const template = fs.readFileSync('report_template.html', 'utf8');

data.forEach(item => {
    if (item.lock) return;

    // 處理嵌入內容 (支援 1 或 2 個檔案)
    let embedHtml = `
        <h2>Report</h2>
        <iframe class="document-frame" src="https://drive.google.com/file/d/${item.driveId}/preview" 
        allowfullscreen style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 8px;"></iframe>
    `;

    if (item.driveId2) {
        embedHtml += `
            <hr style="border-color: var(--glass-border); margin: 2rem 0;">
            <h2>Data Analysis (XLSX)</h2>
            <iframe class="document-frame" src="https://drive.google.com/file/d/${item.driveId2}/preview" 
            allowfullscreen style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 8px;"></iframe>
        `;
    }

    // 替換模板中的變數
    let html = template
        .replace(/{{title}}/g, item.title)
        .replace(/{{intro}}/g, item.content.intro || "No introduction provided.")
        .replace(/{{summary}}/g, item.content.summary || "No conclusion provided.")
        .replace(/{{EMBED_SECTION}}/g, embedHtml);

    // 寫入檔案
    fs.writeFileSync(`${item.slug}.html`, html);
});

console.log("✔ 批次生成成功：已產出/更新 8 個報告頁面。");
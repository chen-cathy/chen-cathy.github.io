const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dataFile = path.join(rootDir, 'data', 'reports.json');

// Configuration: Directories to ignore
const ignoreDirs = ['assets', 'data', 'node_modules', '.git'];

function scanReports(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                scanReports(filePath, fileList);
            }
        } else {
            // Check for HTML files that are NOT index.html or the template
            if (path.extname(file) === '.html' &&
                file !== 'index.html' &&
                file !== 'report_template.html') {

                // Try to extract title/meta from HTML content (simple regex)
                const content = fs.readFileSync(filePath, 'utf8');
                const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
                const title = titleMatch ? titleMatch[1] : file;
                const yearMatch = filePath.match(/20\d{2}/) || ['2025']; // Default to 2025 if no year folder found

                fileList.push({
                    title: title,
                    file: path.relative(rootDir, filePath).replace(/\\/g, '/'),
                    description: "Auto-generated description.",
                    year: parseInt(yearMatch[0]),
                    type: "Report",
                    tags: ["auto-generated"]
                });
            }
        }
    });

    return fileList;
}

console.log("Scanning for reports...");
const reports = scanReports(rootDir);
console.log(`Found ${reports.length} reports.`);

// Preserve manual entries if they exist (optional logic, simplifed here to just overwrite or merge)
// For now, let's just write what we found.
// NOTE: Ideally, you'd merge this with existing metadata. This is a basic scanner.

const jsonContent = JSON.stringify(reports, null, 4);
fs.writeFileSync(dataFile, jsonContent);
console.log(`Updated ${dataFile}`);

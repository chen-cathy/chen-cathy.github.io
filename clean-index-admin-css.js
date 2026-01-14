/**
 * 只移除 index.html 的 Admin Trigger Styles（不碰卡片、不碰其他 script）
 * 用法：node clean-index-admin-css.js
 */

const fs = require("fs");

const file = "index.html";
if (!fs.existsSync(file)) {
  console.error("❌ 找不到 index.html，請在專案根目錄執行");
  process.exit(1);
}

let html = fs.readFileSync(file, "utf8");

// 只刪 <style> 內「/* Admin Trigger Styles */」到 </style> 之前那段
// 這樣不會動到任何 body 內容（你的 cards 完全不會被碰）
const re = /(\/\*\s*Admin Trigger Styles\s*\*\/)[\s\S]*?(?=<\/style>)/m;

if (!re.test(html)) {
  console.log("⏭️  index.html 沒找到 Admin Trigger Styles 區塊，未修改");
  process.exit(0);
}

html = html.replace(re, "");

// 順便把可能存在的 admin HTML 元素刪掉（如果你別的版本 index 有插入）
// 這段很保守：只刪明確 class/id 的元素
html = html.replace(/<button[^>]*class=["'][^"']*admin-trigger[^"']*["'][\s\S]*?<\/button>\s*/gi, "");
html = html.replace(/<div[^>]*class=["'][^"']*overlay[^"']*["'][\s\S]*?<\/div>\s*/gi, "");
html = html.replace(/<div[^>]*class=["'][^"']*admin-panel[^"']*["'][\s\S]*?<\/div>\s*/gi, "");

fs.writeFileSync(file, html, "utf8");
console.log("✅ 已清除 index.html 的 Admin Trigger Styles（不影響 cards）");

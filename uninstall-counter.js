/**
 * HTML 閱讀計數器批次移除工具 (Node.js)
 * 使用方法: node uninstall-counter.js
 */

const fs = require("fs");
const path = require("path");

// 依照你安裝腳本中的「唯一標記」來刪整段：從註解開始一直到該段 </script> 結束
const REMOVE_REGEX = /<!--\s*閱讀計數器\s*V2[\s\S]*?<\/script>\s*/gi;

function hasCounter(content) {
  return /閱讀計數器\s*V2/i.test(content) || /admin-trigger/i.test(content);
}

function removeCounter(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  if (!hasCounter(content)) {
    return { status: "skipped", message: "未發現計數器" };
  }

  const newContent = content.replace(REMOVE_REGEX, "");

  if (newContent === content) {
    return { status: "error", message: "偵測到計數器，但正規式未匹配到可移除區塊（可能版本不同）" };
  }

  fs.writeFileSync(filePath, newContent, "utf8");
  return { status: "success", message: "移除成功" };
}

function main() {
  console.log("=".repeat(60));
  console.log("HTML 閱讀計數器批次移除工具 (Node.js)");
  console.log("=".repeat(60));

  const currentDir = process.cwd();
  console.log(`當前目錄: ${currentDir}\n`);

  const files = fs.readdirSync(currentDir);
  const htmlFiles = files.filter((f) => f.toLowerCase().endsWith(".html"));

  if (htmlFiles.length === 0) {
    console.log("❌ 沒有找到 .html 檔案，請確認你在正確資料夾執行");
    return;
  }

  console.log(`找到 ${htmlFiles.length} 個 HTML 檔案：`);
  htmlFiles.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  console.log("\n開始移除...\n" + "-".repeat(60));

  const results = { success: [], skipped: [], error: [] };

  for (const file of htmlFiles) {
    const filePath = path.join(currentDir, file);
    const r = removeCounter(filePath);

    process.stdout.write(`處理 ${file}... `);
    if (r.status === "success") {
      results.success.push(file);
      console.log("✅ 已移除");
    } else if (r.status === "skipped") {
      results.skipped.push(file);
      console.log("⏭️  跳過（沒有計數器）");
    } else {
      results.error.push({ file, message: r.message });
      console.log(`❌ 錯誤：${r.message}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("處理完成！");
  console.log("=".repeat(60));
  console.log(`✅ 成功移除: ${results.success.length} 個檔案`);
  console.log(`⏭️  已跳過: ${results.skipped.length} 個檔案`);
  console.log(`❌ 失敗: ${results.error.length} 個檔案`);

  if (results.error.length) {
    console.log("\n⚠️  失敗清單：");
    results.error.forEach((e) => console.log(`  • ${e.file}: ${e.message}`));
  }

  console.log("\n提醒：移除後請重新開頁面確認右下角已沒有觸發區。");
}

main();

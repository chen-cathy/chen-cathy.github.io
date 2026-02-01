/**
 * Decision Model Report - Interactive Application
 * 認知負荷最小化設計的互動邏輯
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSectionNavigation();
  initAlternativesMatrix();
  initFactorFilter();
  initRiskQuadrant();
  initDetailPanel();
});

/**
 * 主導覽 - 章節切換
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const chapters = document.querySelectorAll('.chapter');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetChapter = link.dataset.chapter;

      // 更新導覽狀態
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // 顯示對應章節
      chapters.forEach(chapter => {
        if (chapter.dataset.chapter === targetChapter) {
          chapter.hidden = false;
          chapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          chapter.hidden = true;
        }
      });
    });
  });
}

/**
 * 子節導覽 - 章節內部切換
 */
function initSectionNavigation() {
  const sectionLinks = document.querySelectorAll('.section-link');

  sectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const sectionNav = link.closest('.section-nav');
      const allLinks = sectionNav.querySelectorAll('.section-link');
      
      allLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // 滾動時更新 active 狀態
  const sections = document.querySelectorAll('.section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        const correspondingLink = document.querySelector(`.section-link[href="#${sectionId}"]`);
        
        if (correspondingLink) {
          const sectionNav = correspondingLink.closest('.section-nav');
          if (sectionNav) {
            sectionNav.querySelectorAll('.section-link').forEach(l => l.classList.remove('active'));
            correspondingLink.classList.add('active');
          }
        }
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));
}

/**
 * 替代方案矩陣 - 點擊互動
 */
function initAlternativesMatrix() {
  const altCells = document.querySelectorAll('.alt-cell');

  altCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const altCode = cell.dataset.alt;
      showAlternativeDetail(altCode);
      
      // 同步高亮象限中的對應點
      highlightQuadrantPoint(altCode);
    });
  });
}

/**
 * 因素篩選器
 */
function initFactorFilter() {
  const filterRadios = document.querySelectorAll('.factor-filter input[type="radio"]');
  const resetBtn = document.querySelector('.btn-reset-filter');

  filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      applyFilters();
    });
  });

  resetBtn?.addEventListener('click', () => {
    filterRadios.forEach(radio => {
      if (radio.value === 'all') {
        radio.checked = true;
      }
    });
    applyFilters();
  });
}

/**
 * 套用篩選條件
 */
function applyFilters() {
  const pValue = document.querySelector('input[name="filter-p"]:checked')?.value || 'all';
  const iValue = document.querySelector('input[name="filter-i"]:checked')?.value || 'all';
  const lValue = document.querySelector('input[name="filter-l"]:checked')?.value || 'all';

  const altPoints = document.querySelectorAll('.alt-point');

  altPoints.forEach(point => {
    const altCode = point.dataset.alt;
    const [p, i, l] = parseAltCode(altCode);

    const matchP = pValue === 'all' || p === pValue;
    const matchI = iValue === 'all' || i === iValue;
    const matchL = lValue === 'all' || l === lValue;

    if (matchP && matchI && matchL) {
      point.classList.remove('filtered-out');
    } else {
      point.classList.add('filtered-out');
    }
  });
}

/**
 * 解析方案代碼
 */
function parseAltCode(code) {
  const parts = code.split('-');
  return parts; // ['P1', 'I2', 'L1']
}

/**
 * 風險象限互動
 */
function initRiskQuadrant() {
  const altPoints = document.querySelectorAll('.alt-point');

  altPoints.forEach(point => {
    point.addEventListener('click', () => {
      const altCode = point.dataset.alt;
      showAlternativeDetail(altCode);
      highlightQuadrantPoint(altCode);
    });

    // Hover 效果 - 顯示提示
    point.addEventListener('mouseenter', (e) => {
      showTooltip(e, point.dataset.alt);
    });

    point.addEventListener('mouseleave', () => {
      hideTooltip();
    });
  });
}

/**
 * 高亮象限中的點
 */
function highlightQuadrantPoint(altCode) {
  const altPoints = document.querySelectorAll('.alt-point');
  
  altPoints.forEach(point => {
    point.classList.remove('selected');
    if (point.dataset.alt === altCode) {
      point.classList.add('selected');
    }
  });
}

/**
 * 顯示提示框
 */
let tooltipEl = null;

function showTooltip(event, text) {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'quadrant-tooltip';
    tooltipEl.style.cssText = `
      position: fixed;
      padding: 6px 12px;
      background: #1e293b;
      color: #fff;
      font-size: 12px;
      font-family: monospace;
      border-radius: 4px;
      pointer-events: none;
      z-index: 1000;
      transform: translate(-50%, -100%);
      margin-top: -8px;
    `;
    document.body.appendChild(tooltipEl);
  }

  tooltipEl.textContent = text;
  tooltipEl.style.left = event.clientX + 'px';
  tooltipEl.style.top = event.clientY + 'px';
  tooltipEl.style.display = 'block';
}

function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.style.display = 'none';
  }
}

/**
 * 詳情面板
 */
function initDetailPanel() {
  const closeBtn = document.querySelector('.btn-close-panel');
  const panel = document.querySelector('.alternative-detail-panel');

  closeBtn?.addEventListener('click', () => {
    panel.hidden = true;
    
    // 清除象限中的選中狀態
    document.querySelectorAll('.alt-point').forEach(p => p.classList.remove('selected'));
  });

  // ESC 鍵關閉
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      panel.hidden = true;
      document.querySelectorAll('.alt-point').forEach(p => p.classList.remove('selected'));
    }
  });
}

/**
 * 顯示方案詳情
 */
function showAlternativeDetail(altCode) {
  const panel = document.querySelector('.alternative-detail-panel');
  const codeEl = panel.querySelector('.alt-code');
  const tagsEl = panel.querySelector('.factor-tags');
  const positionEl = panel.querySelector('.alt-position');
  const descEl = panel.querySelector('.alt-description');

  const [p, i, l] = parseAltCode(altCode);
  
  // 方案描述資料
  const factorDescriptions = {
    P1: { label: 'P1：價值導向友臺', class: 'tag-p' },
    P2: { label: 'P2：經貿導向友中', class: 'tag-p' },
    I1: { label: 'I1：意見表達', class: 'tag-i' },
    I2: { label: 'I2：後勤支持', class: 'tag-i' },
    I3: { label: 'I3：直接參與', class: 'tag-i' },
    L1: { label: 'L1：De facto 國家', class: 'tag-l' },
    L2: { label: 'L2：非國家行為主體', class: 'tag-l' }
  };

  // 根據因素組合判斷象限位置（示意邏輯）
  const quadrantInfo = getQuadrantInfo(p, i, l);

  // 更新面板內容
  codeEl.textContent = altCode;
  
  tagsEl.innerHTML = `
    <span class="tag ${factorDescriptions[p].class}">${factorDescriptions[p].label}</span>
    <span class="tag ${factorDescriptions[i].class}">${factorDescriptions[i].label}</span>
    <span class="tag ${factorDescriptions[l].class}">${factorDescriptions[l].label}</span>
  `;

  positionEl.innerHTML = `<p><strong>象限位置：</strong>${quadrantInfo.position}</p>`;
  positionEl.style.background = quadrantInfo.color;

  descEl.innerHTML = `
    <h4>情境說明</h4>
    <p>此替代方案代表以下情境組合：捷克採取${p === 'P1' ? '價值導向且較友臺' : '經貿導向且較友中'}之政治取向（${p}），行為者${getInvolvementDesc(i)}（${i}），且臺灣被定位為${l === 'L1' ? 'de facto 國家' : '非國家武裝行為主體'}（${l}）。</p>
    <p>${quadrantInfo.analysis}</p>
  `;

  panel.hidden = false;
}

/**
 * 取得參與強度描述
 */
function getInvolvementDesc(i) {
  const descs = {
    I1: '進行意見表達與輕微支持',
    I2: '提供後勤與組織性支持',
    I3: '直接參與戰鬥或軍事訓練'
  };
  return descs[i] || '';
}

/**
 * 取得象限資訊（示意邏輯，研究完成後調整）
 */
function getQuadrantInfo(p, i, l) {
  // 基於因素組合的示意分析邏輯
  // I3（直接參與）→ 高嚴重性
  // L2（非國家行為主體）→ 較高不確定性
  // P2（友中）→ 可能增加不確定性
  
  let severity = 1; // 1-3
  let uncertainty = 1; // 1-3
  
  // 參與強度對嚴重性的影響
  if (i === 'I1') severity = 1;
  else if (i === 'I2') severity = 2;
  else if (i === 'I3') severity = 3;
  
  // 法律定位對不確定性的影響
  if (l === 'L1') uncertainty = Math.max(1, severity - 1);
  else if (l === 'L2') uncertainty = Math.min(3, severity);
  
  // 政治路線的微調
  if (p === 'P2' && l === 'L1') uncertainty = Math.min(3, uncertainty + 1);
  
  const quadrantMap = {
    '1-1': { position: '低S / 低U（相對安全）', color: 'var(--color-quadrant-bl)' },
    '1-2': { position: '低S / 中U', color: 'var(--color-quadrant-tl)' },
    '1-3': { position: '低S / 高U（需持續監控）', color: 'var(--color-quadrant-tl)' },
    '2-1': { position: '中S / 低U', color: 'var(--color-quadrant-br)' },
    '2-2': { position: '中S / 中U', color: 'var(--color-quadrant-tr)' },
    '2-3': { position: '中S / 高U', color: 'var(--color-quadrant-tr)' },
    '3-1': { position: '高S / 低U（可預測風險）', color: 'var(--color-quadrant-br)' },
    '3-2': { position: '高S / 中U', color: 'var(--color-quadrant-tr)' },
    '3-3': { position: '高S / 高U（深灰色地帶）', color: 'var(--color-quadrant-tr)' }
  };
  
  const key = `${severity}-${uncertainty}`;
  const info = quadrantMap[key] || quadrantMap['2-2'];
  
  // 分析說明
  let analysis = '';
  if (severity >= 3 && uncertainty >= 2) {
    analysis = '在此情境下，由於直接軍事參與之性質，預期刑事法律後果嚴重性處於較高水平；同時，法律與制度性不確定性亦處於較高區間。此類情境落入風險象限之「深灰色地帶」，需特別審慎評估。';
  } else if (severity <= 1 && uncertainty <= 1) {
    analysis = '在此情境下，行為者之參與程度較輕，且臺灣之法律定位相對明確，預期刑事法律風險與不確定性均處於較低水平，屬相對安全之情境。';
  } else {
    analysis = '在此情境下，刑事法律風險與不確定性需依具體因素組合進行評估。研究完成後，將依據 AHP/MCDA 分析結果提供更精確之定位。';
  }
  
  return { ...info, analysis };
}

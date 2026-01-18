document.addEventListener('DOMContentLoaded', () => {
    // 渲染 KaTeX 方程式
    const equations = document.querySelectorAll('.equation');
    equations.forEach(el => {
        const tex = el.getAttribute('data-tex');
        if (tex) katex.render(tex, el, { throwOnError: false });
    });

    // 影片控制：如果需要特定跳轉
    const video = document.getElementById('auditVideo');
    if(video) {
        // 您可以根據需要手動將影片跳至 1分18秒 (78秒)
        // video.currentTime = 78;
    }
});
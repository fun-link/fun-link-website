document.addEventListener('DOMContentLoaded', () => {
    // セクションにIDを設定
    const sections = document.querySelectorAll('section');
    const sectionIds = ['about', 'values', 'manifest', 'download', 'supporters'];
    
    sections.forEach((section, index) => {
        if (index < sectionIds.length && !section.id) {
            section.id = sectionIds[index];
        }
    });

    // メニューリンクの修正
    const menuLinks = document.querySelectorAll('.main-nav a');
    const linkMap = {
        'FunLinkとは': '#about',
        '3つの価値観': '#values', 
        'クリエイター宣言': '#manifest',
        'ロゴダウンロード': '#download',
        '賛同者': '#supporters'
    };

    menuLinks.forEach(link => {
        const text = link.textContent;
        if (linkMap[text]) {
            link.href = linkMap[text];
        }
    });

    // スムーズスクロールの実装
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

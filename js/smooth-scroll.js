document.addEventListener('DOMContentLoaded', function() {
  // 全てのアンカーリンクを取得
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  // 各リンクにイベントリスナーを追加
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // デフォルト動作を防止
      e.preventDefault();
      
      // リンク先のID取得
      const targetId = this.getAttribute('href');
      
      // IDが"#"のみの場合はトップへスクロール
      if (targetId === '#') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      // 対象要素を取得
      const targetElement = document.querySelector(targetId);
      
      // 対象要素が存在する場合はスクロール
      if (targetElement) {
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});

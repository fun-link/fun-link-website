document.addEventListener('DOMContentLoaded', function() {
  console.log('スムーズスクロールスクリプトが読み込まれました');
  
  // 全てのアンカーリンクを取得
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  // 各リンクにイベントリスナーを追加
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // デフォルト動作を防止
      e.preventDefault();
      
      // リンク先のID取得
      const targetId = this.getAttribute('href');
      console.log('クリックされたリンク先:', targetId);
      
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
          top: offsetTop - 80, // ヘッダーの高さ分調整
          behavior: 'smooth'
        });
        
        console.log(`${targetId}へスクロールしました`);
        
        // モバイル表示時はメニューを閉じる
        if (window.innerWidth < 769) {
          const mainNav = document.querySelector('.main-nav');
          const menuToggle = document.querySelector('.menu-toggle');
          if (mainNav && menuToggle) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
          }
        }
      } else {
        console.warn(`対象要素が見つかりません: ${targetId}`);
      }
    });
  });
});

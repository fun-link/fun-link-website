document.addEventListener('DOMContentLoaded', function() {
  console.log('スムーズスクロールスクリプトが読み込まれました');
  
  // デバッグ：すべてのセクションIDを確認
  const sections = document.querySelectorAll('section[id]');
  console.log('ページ上のセクションID:');
  sections.forEach(section => {
    console.log(`- ${section.id}: ${section.className}`);
  });
  
  // デバッグ：すべてのメニューリンクを確認
  const menuLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  console.log('メニューリンク:');
  menuLinks.forEach(link => {
    console.log(`- ${link.textContent.trim()}: ${link.getAttribute('href')}`);
  });
  
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
        console.log(`対象要素が見つかりました: ${targetId}, クラス: ${targetElement.className}`);
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
        console.error(`対象要素が見つかりません: ${targetId}`);
      }
    });
  });
});

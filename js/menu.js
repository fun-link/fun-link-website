document.addEventListener('DOMContentLoaded', function() {
  // メニュー要素の取得
  const menuToggle = document.querySelector('.menu-toggle') || document.getElementById('menu-toggle');
  const mainNav = document.querySelector('.main-nav') || document.getElementById('main-nav');
  
  if (menuToggle && mainNav) {
    // メニュートグルクリックイベント
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault(); // トグルボタンのみpreventDefault
      console.log('メニューがクリックされました');
      
      // クラス切り替え
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // メニュー項目クリック時の処理（モバイル時）
    const menuItems = mainNav.querySelectorAll('a');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        // ここではpreventDefaultを呼び出さない
        if (window.innerWidth < 769) {
          mainNav.classList.remove('active');
          menuToggle.classList.remove('active');
        }
        // リンクは通常通り動作させる
      });
    });
    
    console.log('メニュースクリプト初期化完了');
  } else {
    console.error('メニュー要素が見つかりません', {menuToggle, mainNav});
  }
});

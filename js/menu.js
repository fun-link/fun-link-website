document.addEventListener('DOMContentLoaded', function() {
  // ハンバーガーメニューの動作
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // メニュー項目をクリックしたらメニューを閉じる
    const menuItems = mainNav.querySelectorAll('a');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
  
  // スムーズスクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});

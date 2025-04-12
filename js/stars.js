document.addEventListener('DOMContentLoaded', function() {
  // 点滅アニメーションの削除
  const allAnimatedElements = document.querySelectorAll('*');
  allAnimatedElements.forEach(el => {
    if (el.style.animation) {
      el.style.animation = 'none';
    }
  });
  
  // 星空背景を作成
  const sections = document.querySelectorAll('section, header, .hero');
  
  sections.forEach(section => {
    // 星空背景コンテナを作成
    const starBg = document.createElement('div');
    starBg.classList.add('star-bg');
    section.appendChild(starBg);
    
    // 星を追加
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.width = '2px';
      star.style.height = '2px';
      star.style.backgroundColor = 'white';
      star.style.borderRadius = '50%';
      star.style.opacity = '0.5';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      starBg.appendChild(star);
    }
  });
});

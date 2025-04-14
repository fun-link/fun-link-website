// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  // 点滅するアニメーションだけを探して停止（すべての要素ではなく）
  const animatedElements = document.querySelectorAll('[class*="animate"], [class*="pulse"], [class*="fade"], [class*="blink"], [class*="glow"]');
  
  animatedElements.forEach(function(element) {
    // アニメーションを無効化
    element.style.animation = 'none';
    element.style.transition = 'none';
    element.style.opacity = '1';
  });
  
  // メインのコンテンツエリアを確保（下のコンテンツが見えるように）
  const mainContent = document.querySelector('main') || document.querySelector('.content') || document.body;
  if (mainContent) {
    mainContent.style.position = 'relative';
    mainContent.style.zIndex = '1';
    mainContent.style.display = 'block';
    mainContent.style.visibility = 'visible';
    mainContent.style.opacity = '1';
  }
  
  // 惑星を追加する関数
  function addPlanets() {
    // キャラクター要素を探す
    const images = document.querySelectorAll('img');
    let character = null;
    
    images.forEach(img => {
      // キャラクターらしき画像を探す
      if (img.width > 100 && img.height > 100) {
        character = img;
      }
    });
    
    if (character) {
      // キャラクター周りに惑星を追加
      const parent = character.parentElement;
      parent.style.position = 'relative';
      
      // 惑星の色
      const colors = ['#ff6600', '#00ccff', '#ffcc00'];
      
      // 惑星を追加
      for (let i = 0; i < 3; i++) {
        const planet = document.createElement('div');
        planet.className = `planet-${i+1}`;
        planet.style.position = 'absolute';
        planet.style.width = '15px';
        planet.style.height = '15px';
        planet.style.borderRadius = '50%';
        planet.style.backgroundColor = colors[i];
        planet.style.boxShadow = `0 0 10px ${colors[i]}`;
        planet.style.top = '50%';
        planet.style.left = '50%';
        planet.style.transform = `rotate(${i*120}deg) translateX(150px)`;
        planet.style.animation = `orbit${i+1} ${20 + i*10}s linear infinite`;
        planet.style.zIndex = '2';
        
        parent.appendChild(planet);
      }
      
      // アニメーションスタイルを追加
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes orbit1 {
          0% { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          0% { transform: rotate(120deg) translateX(150px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateX(150px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          0% { transform: rotate(240deg) translateX(150px) rotate(-240deg); }
          100% { transform: rotate(600deg) translateX(150px) rotate(-600deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // DOM完全ロード後に惑星を追加
  setTimeout(addPlanets, 500);
});

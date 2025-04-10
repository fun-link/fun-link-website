// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  // すべての要素のアニメーションとトランジションを停止
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(function(element) {
    // インラインスタイルでアニメーションを無効化
    element.style.animation = 'none';
    element.style.webkitAnimation = 'none';
    element.style.transition = 'none';
    element.style.webkitTransition = 'none';
    element.style.animationPlayState = 'paused';
    element.style.webkitAnimationPlayState = 'paused';
    
    // opacity を 1 に固定
    if (window.getComputedStyle(element).opacity < 1) {
      element.style.opacity = '1';
    }
  });
  
  // 惑星を追加する関数
  function addPlanets() {
    // キャラクター要素を探す（画像または特定のクラス名で）
    const characterElements = document.querySelectorAll('img');
    
    // キャラクター画像らしきものを探す
    let characterElement = null;
    characterElements.forEach(img => {
      if (img.src.includes('character') || img.alt.includes('character') || 
          img.width > 100) { // サイズで推測
        characterElement = img;
      }
    });
    
    if (characterElement) {
      // 親要素をラッパーにする
      const parent = characterElement.parentElement;
      
      // 惑星要素を作成
      for (let i = 1; i <= 3; i++) {
        const planet = document.createElement('div');
        planet.className = `orbit-planet planet-${i}`;
        planet.style.position = 'absolute';
        planet.style.width = '15px';
        planet.style.height = '15px';
        planet.style.borderRadius = '50%';
        planet.style.zIndex = '1';
        
        // 惑星の色と軌道時間を設定
        const colors = ['#ff6600', '#00ccff', '#ffcc00'];
        planet.style.backgroundColor = colors[i-1];
        planet.style.boxShadow = `0 0 10px ${colors[i-1]}`;
        
        // 惑星の軌道アニメーション（これだけは許可）
        const duration = 15 + (i * 10);
        planet.style.animation = `orbit ${duration}s linear infinite`;
        
        // 惑星を親要素に追加
        parent.appendChild(planet);
      }
      
      // 公転アニメーションのスタイルを追加
      const style = document.createElement('style');
      style.textContent = `
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // 少し遅延させて惑星を追加（DOM完全ロード後）
  setTimeout(addPlanets, 1000);
});

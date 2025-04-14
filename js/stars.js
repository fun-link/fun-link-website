document.addEventListener('DOMContentLoaded', function() {
  console.log('星空エフェクトスクリプトが読み込まれました');
  
  // 背景に星を追加
  createStarryBackground();
  
  function createStarryBackground() {
    // 星空背景を追加する要素
    const body = document.body;
    const starBg = document.createElement('div');
    starBg.className = 'starry-background';
    starBg.style.position = 'fixed';
    starBg.style.top = '0';
    starBg.style.left = '0';
    starBg.style.width = '100%';
    starBg.style.height = '100%';
    starBg.style.pointerEvents = 'none';
    starBg.style.zIndex = '-1';
    body.appendChild(starBg);
    
    // 星の数（多めに設定）
    const starCount = 200;
    
    // 星の配列を3種類の大きさに分けて作成（遠・中・近）
    const smallStars = [];
    const mediumStars = [];
    const largeStars = [];
    
    // 星を追加
    for (let i = 0; i < starCount; i++) {
      // サイズによって3グループに分類
      if (i < starCount * 0.6) { // 60%は小さな星
        smallStars.push(createStar(starBg, 0.5, 1.0));
      } else if (i < starCount * 0.9) { // 30%は中くらいの星
        mediumStars.push(createStar(starBg, 1.0, 1.5));
      } else { // 10%は大きな星
        largeStars.push(createStar(starBg, 1.5, 2.5));
      }
    }
    
    // それぞれのグループに異なるアニメーションを適用
    setTimeout(() => {
      // 小さな星は遅くきらめく
      smallStars.forEach((star, index) => {
        setTimeout(() => {
          star.style.animation = `twinkle-slow ${3 + Math.random() * 2}s infinite ${Math.random() * 5}s`;
        }, index * 10);
      });
      
      // 中くらいの星は中速できらめく
      mediumStars.forEach((star, index) => {
        setTimeout(() => {
          star.style.animation = `twinkle-medium ${2 + Math.random() * 2}s infinite ${Math.random() * 3}s`;
        }, index * 15);
      });
      
      // 大きな星は速くきらめく
      largeStars.forEach((star, index) => {
        setTimeout(() => {
          star.style.animation = `twinkle-fast ${1 + Math.random() * 1.5}s infinite ${Math.random() * 2}s`;
        }, index * 20);
      });
    }, 100);
    
    // 流れ星を定期的に生成
    setInterval(() => createShootingStar(starBg), 8000);
  }
  
  // 星を作成する関数
  function createStar(container, minSize, maxSize) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // 星の位置
    star.style.position = 'absolute';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // サイズ
    const size = minSize + Math.random() * (maxSize - minSize);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // 見た目
    star.style.backgroundColor = 'white';
    star.style.borderRadius = '50%';
    star.style.opacity = `${0.3 + Math.random() * 0.7}`; // 明るさもランダム
    
    // ぼかし効果（大きな星ほどぼかす）
    if (size > 1.5) {
      star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`;
    } else if (size > 1.0) {
      star.style.boxShadow = `0 0 ${size}px rgba(255, 255, 255, 0.6)`;
    }
    
    container.appendChild(star);
    return star;
  }
  
  // 流れ星を作成する関数
  function createShootingStar(container) {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // 流れ星の開始位置（画面上部の左側1/3）
    const startLeft = Math.random() * (window.innerWidth / 3);
    const startTop = Math.random() * (window.innerHeight / 3);
    
    // 流れ星のスタイル
    shootingStar.style.position = 'absolute';
    shootingStar.style.left = `${startLeft}px`;
    shootingStar.style.top = `${startTop}px`;
    shootingStar.style.width = '100px';
    shootingStar.style.height = '1px';
    shootingStar.style.backgroundColor = 'transparent';
    shootingStar.style.borderRadius = '0';
    shootingStar.style.zIndex = '1';
    
    // 流れ星の軌跡
    shootingStar.style.backgroundImage = 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)';
    
    // 角度（右下に向かう）
    const angle = 30 + Math.random() * 20; // 30〜50度
    shootingStar.style.transform = `rotate(${angle}deg)`;
    
    container.appendChild(shootingStar);
    
    // アニメーション
    shootingStar.animate([
      { 
        opacity: 1, 
        width: '0px', 
        transform: `rotate(${angle}deg) translateX(0) translateY(0)` 
      },
      { 
        opacity: 1, 
        width: '100px', 
        transform: `rotate(${angle}deg) translateX(${window.innerWidth / 3}px) translateY(${window.innerHeight / 3}px)` 
      },
      { 
        opacity: 0, 
        width: '0px', 
        transform: `rotate(${angle}deg) translateX(${window.innerWidth / 2}px) translateY(${window.innerHeight / 2}px)` 
      }
    ], {
      duration: 1000,
      easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
    });
    
    // アニメーション終了後に要素を削除
    setTimeout(() => {
      container.removeChild(shootingStar);
    }, 1000);
  }
  
  // アニメーションのスタイルシートを追加
  if (!document.querySelector('#star-animations')) {
    const style = document.createElement('style');
    style.id = 'star-animations';
    style.textContent = `
      @keyframes twinkle-slow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
      
      @keyframes twinkle-medium {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1.0; }
      }
      
      @keyframes twinkle-fast {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1.0; }
      }
    `;
    document.head.appendChild(style);
  }
});

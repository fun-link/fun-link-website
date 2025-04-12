document.addEventListener('DOMContentLoaded', function() {
  console.log('浮遊アニメーションスクリプトが読み込まれました');
  
  // 対象となる要素を選択
  const characters = document.querySelectorAll('.mascot-character, .hero-character, img[src*="character"]');
  const logos = document.querySelectorAll('.logo-funlink, .hero-logo, img[src*="planet"]');
  
  // キャラクターのアニメーション
  characters.forEach(char => {
    if (!char.style.position || char.style.position === 'static') {
      char.style.position = 'relative';
    }
    
    // 浮遊アニメーション
    char.style.animation = 'float 4s ease-in-out infinite';
  });
  
  // ロゴのアニメーション
  logos.forEach(logo => {
    if (!logo.style.position || logo.style.position === 'static') {
      logo.style.position = 'relative';
    }
    
    // 少し異なる浮遊アニメーション（遅め）
    logo.style.animation = 'float 5s ease-in-out infinite 0.5s';
  });
  
  // アニメーション用のスタイルを追加
  if (!document.getElementById('float-animation-style')) {
    const style = document.createElement('style');
    style.id = 'float-animation-style';
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
  }
});

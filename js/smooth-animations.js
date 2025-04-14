// すべてのアニメーションをスムーズで控えめにする
document.addEventListener('DOMContentLoaded', function() {
  // 宇宙をテーマにした穏やかなアニメーション
  // 点滅させずに、ゆっくりと動くエフェクト
  const starElements = document.querySelectorAll('.star');
  
  starElements.forEach(function(element) {
    element.style.transition = 'all 3s ease-in-out';
    element.style.animationDuration = '5s';
    element.style.animationTimingFunction = 'ease-in-out';
  });
  
  // アクセシビリティのためのリデューサー
  const reducer = document.createElement('div');
  reducer.id = 'animation-reducer';
  reducer.innerHTML = '<button aria-label="アニメーションを減らす">アニメーション調整</button>';
  reducer.style.position = 'fixed';
  reducer.style.bottom = '20px';
  reducer.style.right = '20px';
  reducer.style.zIndex = '1000';
  document.body.appendChild(reducer);
  
  reducer.addEventListener('click', function() {
    document.body.classList.toggle('reduced-motion');
  });
});

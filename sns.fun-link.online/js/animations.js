/**
 * FunLink アニメーション処理スクリプト
 * サイト全体のアニメーション効果を管理します
 */

// DOMが完全に読み込まれたときに実行
document.addEventListener('DOMContentLoaded', function() {
  // スクロールアニメーションの設定
  setupScrollAnimations();
  
  // ホバーアニメーションの設定
  setupHoverAnimations();
  
  // タイムラインアニメーションの初期化
  initTimelineAnimations();
  
  // カウントアップアニメーションの設定
  setupCountUpAnimations();
  
  // パーティクルアニメーションの初期化
  if (document.querySelector('#particles-container')) {
    initParticleAnimations();
  }
  
  // ヒーローセクションのアニメーション
  animateHeroSection();
});

/**
 * スクロールアニメーションの設定
 */
function setupScrollAnimations() {
  // アニメーション対象要素
  const animElements = document.querySelectorAll('[data-animation]');
  
  // IntersectionObserverが利用可能な場合
  if ('IntersectionObserver' in window) {
    const animObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.getAttribute('data-animation');
          const delay = element.getAttribute('data-delay') || 0;
          
          // 遅延を設定
          setTimeout(() => {
            element.classList.add('animated', animation);
          }, delay * 1000);
          
          // アニメーションが一度だけの場合は監視を解除
          if (element.getAttribute('data-animation-once') !== 'false') {
            observer.unobserve(element);
          }
        } else if (element.getAttribute('data-animation-once') === 'false') {
          // 画面外に出た時にアニメーションをリセット
          element.classList.remove('animated', element.getAttribute('data-animation'));
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    // 各要素を監視対象に追加
    animElements.forEach(element => {
      animObserver.observe(element);
    });
  } else {
    // フォールバック: すべての要素に直接アニメーションクラスを追加
    animElements.forEach(element => {
      element.classList.add('animated', element.getAttribute('data-animation'));
    });
  }
}

/**
 * ホバーアニメーションの設定
 */
function setupHoverAnimations() {
  // ホバーアニメーション対象要素
  const hoverElements = document.querySelectorAll('[data-hover-animation]');
  
  hoverElements.forEach(element => {
    const animation = element.getAttribute('data-hover-animation');
    
    // マウスイベントリスナーを設定
    element.addEventListener('mouseenter', () => {
      element.classList.add(animation);
    });
    
    element.addEventListener('mouseleave', () => {
      // アニメーション終了時にクラスを削除するための処理
      const handleAnimationEnd = () => {
        element.classList.remove(animation);
        element.removeEventListener('animationend', handleAnimationEnd);
      };
      
      element.addEventListener('animationend', handleAnimationEnd);
    });
  });
}

/**
 * タイムラインアニメーションの初期化
 */
function initTimelineAnimations() {
  // タイムラインアイテム
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length === 0) return;
  
  // タイムラインアイテムを順番にアニメーション
  const observeTimeline = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const delay = Array.from(timelineItems).indexOf(item) * 0.2;
        
        setTimeout(() => {
          item.classList.add('animated', 'fadeInUp');
        }, delay * 1000);
        
        observer.unobserve(item);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });
  
  // 各タイムラインアイテムを監視
  timelineItems.forEach(item => {
    observeTimeline.observe(item);
  });
}

/**
 * カウントアップアニメーションの設定
 */
function setupCountUpAnimations() {
  // カウントアップ対象要素
  const countElements = document.querySelectorAll('[data-count-to]');
  
  // 数値をカウントアップする関数
  function animateCount(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      
      element.textContent = currentCount.toLocaleString();
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end.toLocaleString();
      }
    };
    
    window.requestAnimationFrame(step);
  }
  
  // IntersectionObserverでビューポート内に入ったらカウントアップ開始
  if ('IntersectionObserver' in window && countElements.length > 0) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const countTo = parseInt(element.getAttribute('data-count-to'), 10);
          const countFrom = parseInt(element.getAttribute('data-count-from') || '0', 10);
          const duration = parseInt(element.getAttribute('data-count-duration') || '2000', 10);
          
          animateCount(element, countFrom, countTo, duration);
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1
    });
    
    // 各カウントアップ要素を監視
    countElements.forEach(element => {
      countObserver.observe(element);
    });
  }
}

/**
 * パーティクルアニメーションの初期化
 */
function initParticleAnimations() {
  const container = document.getElementById('particles-container');
  const particleCount = 50;
  
  // パーティクルを生成
  for (let i = 0; i < particleCount; i++) {
    createParticle(container);
  }
}

/**
 * パーティクルを生成
 */
function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // ランダムなスタイル
  const size = Math.random() * 5 + 2;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * 10;
  
  // スタイルを適用
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;
  
  // 透明度をランダムに設定
  particle.style.opacity = Math.random() * 0.5 + 0.1;
  
  // コンテナに追加
  container.appendChild(particle);
}

/**
 * ヒーローセクションのアニメーション
 */
function animateHeroSection() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;
  
  // ヒーローセクション内の要素
  const heroTitle = heroSection.querySelector('h1');
  const heroText = heroSection.querySelector('p');
  const heroCta = heroSection.querySelector('.btn');
  
  // 順番にアニメーション
  if (heroTitle) {
    heroTitle.classList.add('animated', 'fadeInDown');
  }
  
  if (heroText) {
    setTimeout(() => {
      heroText.classList.add('animated', 'fadeInUp');
    }, 300);
  }
  
  if (heroCta) {
    setTimeout(() => {
      heroCta.classList.add('animated', 'pulse');
    }, 600);
  }
}

// グローバル関数としてエクスポート
window.FunLinkAnimations = {
  triggerAnimation: function(element, animation, duration = 1000) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (!element) return;
    
    element.classList.add(animation);
    
    setTimeout(() => {
      element.classList.remove(animation);
    }, duration);
  },
  
  fadeIn: function(element, delay = 0) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (!element) return;
    
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.display = 'block';
      
      setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease';
        element.style.opacity = '1';
      }, 10);
    }, delay);
  },
  
  fadeOut: function(element, delay = 0) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (!element) return;
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease';
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.style.display = 'none';
      }, 500);
    }, delay);
  }
};

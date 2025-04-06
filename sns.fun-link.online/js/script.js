/**
 * FunLink メインスクリプトファイル
 * サイト全体の機能を管理します
 */

// DOMが完全に読み込まれたときに実行
document.addEventListener('DOMContentLoaded', function() {
  // 初期化関数
  initializeApp();
  
  // モバイルメニューの設定
  setupMobileMenu();
  
  // アニメーションの初期化
  initAnimations();
  
  // スクロールイベントの設定
  setupScrollEvents();
  
  // フォームの検証設定
  setupFormValidation();
  
  // キャラクター表示の初期化
  initCharacterDisplay();
});

/**
 * アプリケーション初期化
 */
function initializeApp() {
  console.log('FunLink アプリケーションを初期化しています...');
  
  // ページの読み込み時間を測定
  const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
  console.log(`ページ読み込み時間: ${loadTime}ms`);
  
  // デバイスタイプの検出
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
  const isDesktop = window.innerWidth > 992;
  
  // デバイスに基づいて最適化
  if (isMobile) {
    optimizeForMobile();
  } else if (isTablet) {
    optimizeForTablet();
  } else {
    optimizeForDesktop();
  }
  
  // パフォーマンス最適化
  setTimeout(() => {
    loadDeferredImages();
    loadExternalScripts();
  }, 100);
}

/**
 * モバイルデバイス向けの最適化
 */
function optimizeForMobile() {
  // 画像を低解像度に変更
  const images = document.querySelectorAll('img[data-mobile-src]');
  images.forEach(img => {
    if (img.getAttribute('data-mobile-src')) {
      img.src = img.getAttribute('data-mobile-src');
    }
  });
  
  // 不要な要素を非表示
  const desktopOnlyElements = document.querySelectorAll('.desktop-only');
  desktopOnlyElements.forEach(el => {
    el.style.display = 'none';
  });
  
  // タッチイベントの最適化
  optimizeTouchEvents();
}

/**
 * タブレット向けの最適化
 */
function optimizeForTablet() {
  // タブレット向けのレイアウト調整
  const tabletLayoutElements = document.querySelectorAll('[data-tablet-layout]');
  tabletLayoutElements.forEach(el => {
    const layout = el.getAttribute('data-tablet-layout');
    if (layout) {
      el.classList.add(layout);
    }
  });
}

/**
 * デスクトップ向けの最適化
 */
function optimizeForDesktop() {
  // 高解像度画像の読み込み
  const images = document.querySelectorAll('img[data-desktop-src]');
  images.forEach(img => {
    if (img.getAttribute('data-desktop-src')) {
      img.src = img.getAttribute('data-desktop-src');
    }
  });
  
  // 追加の機能を有効化
  enableDesktopFeatures();
}

/**
 * デスクトップ向け追加機能
 */
function enableDesktopFeatures() {
  // ホバーエフェクト
  const hoverElements = document.querySelectorAll('.hover-effect');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });
  });
}

/**
 * タッチイベントの最適化
 */
function optimizeTouchEvents() {
  // タッチターゲットサイズの拡大
  const touchElements = document.querySelectorAll('button, .btn, nav a, input[type="checkbox"], input[type="radio"]');
  touchElements.forEach(el => {
    // 最小サイズを確保
    if (el.offsetWidth < 44 || el.offsetHeight < 44) {
      el.style.minWidth = '44px';
      el.style.minHeight = '44px';
    }
  });
  
  // クリックの遅延を削減
  document.documentElement.style.touchAction = 'manipulation';
}

/**
 * モバイルメニューの設定
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('nav ul');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      
      // メニューアイコンを切り替え
      this.innerHTML = isExpanded ? '&#9776;' : '&#10005;';
    });
    
    // メニュー項目がクリックされたらメニューを閉じる
    const menuItems = mobileMenu.querySelectorAll('a');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '&#9776;';
      });
    });
  }
}

/**
 * アニメーションの初期化
 */
function initAnimations() {
  // ページロードアニメーション
  const animatedElements = document.querySelectorAll('.animated');
  
  animatedElements.forEach((element, index) => {
    const delay = index * 0.1;
    element.style.animationDelay = `${delay}s`;
    element.classList.add('fade-in');
  });
}

/**
 * スクロールイベントの設定
 */
function setupScrollEvents() {
  // スクロールアニメーション用の要素
  const scrollAnimElements = document.querySelectorAll('.animate-on-scroll');
  
  // スクロール位置に基づいてヘッダーのスタイルを変更
  const header = document.querySelector('header');
  
  // スクロールイベントリスナー
  window.addEventListener('scroll', throttle(function() {
    // ヘッダースタイルの変更
    if (header && window.scrollY > 50) {
      header.classList.add('scrolled');
    } else if (header) {
      header.classList.remove('scrolled');
    }
    
    // スクロールアニメーションの処理
    scrollAnimElements.forEach(element => {
      if (isElementInViewport(element)) {
        const animation = element.getAttribute('data-animation') || 'fade';
        element.classList.add('visible', animation);
      }
    });
  }, 100));
  
  // 初期表示時のチェック
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
}

/**
 * フォームバリデーションの設定
 */
function setupFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          
          // エラーメッセージを表示
          let errorMessage = field.getAttribute('data-error-message') || '入力してください';
          let errorElement = field.nextElementSibling;
          
          if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
          }
          
          errorElement.textContent = errorMessage;
        } else {
          field.classList.remove('error');
          const errorElement = field.nextElementSibling;
          if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = '';
          }
        }
      });
      
      if (!isValid) {
        event.preventDefault();
      }
    });
    
    // フィールドの入力時にエラーを消す
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.addEventListener('input', function() {
        field.classList.remove('error');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
          errorElement.textContent = '';
        }
      });
    });
  });
}

/**
 * キャラクター表示の初期化
 */
function initCharacterDisplay() {
  const characterElements = document.querySelectorAll('.character');
  
  characterElements.forEach(character => {
    // キャラクターの位置をランダムに設定
    if (character.classList.contains('random-position')) {
      const randomX = Math.floor(Math.random() * 80);
      const randomY = Math.floor(Math.random() * 80);
      character.style.left = `${randomX}%`;
      character.style.top = `${randomY}%`;
    }
    
    // アニメーションをランダムに選択
    const animations = ['bounce', 'pulse', 'shake', 'flip'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    
    // アニメーション間隔をランダムに設定
    const playAnimation = () => {
      character.classList.add(randomAnimation);
      
      setTimeout(() => {
        character.classList.remove(randomAnimation);
      }, 1000);
      
      const nextTimeout = 5000 + Math.random() * 5000;
      setTimeout(playAnimation, nextTimeout);
    };
    
    // 初期アニメーションを開始
    setTimeout(playAnimation, 1000 + Math.random() * 3000);
  });
}

/**
 * 遅延読み込み画像の処理
 */
function loadDeferredImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // IntersectionObserver非対応ブラウザ向けのフォールバック
    lazyImages.forEach(img => {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }
}

/**
 * 外部スクリプトの読み込み
 */
function loadExternalScripts() {
  const scripts = [
    { src: 'js/animations.js', async: true, defer: true },
    { src: 'js/interactions.js', async: true, defer: true }
  ];
  
  scripts.forEach(script => {
    const scriptElement = document.createElement('script');
    scriptElement.src = script.src;
    
    if (script.async) scriptElement.async = true;
    if (script.defer) scriptElement.defer = true;
    
    document.body.appendChild(scriptElement);
  });
}

/**
 * 要素が表示領域内にあるかチェック
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}

/**
 * スロットル関数 - パフォーマンス向上のため
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

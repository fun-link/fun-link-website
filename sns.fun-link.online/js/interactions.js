/**
 * FunLink ユーザーインタラクション処理スクリプト
 * サイト全体のインタラクティブな機能を管理します
 */

// DOMが完全に読み込まれたときに実行
document.addEventListener('DOMContentLoaded', function() {
  // モーダルの設定
  setupModals();
  
  // タブの設定
  setupTabs();
  
  // アコーディオンの設定
  setupAccordions();
  
  // ドロップダウンの設定
  setupDropdowns();
  
  // スムーススクロールの設定
  setupSmoothScroll();
  
  // フィルターの設定
  setupFilters();
  
  // スライダーの設定
  setupSliders();
  
  // フォーム送信の設定
  setupFormSubmission();
  
  // タッチイベントの最適化
  optimizeTouchInteractions();
});

/**
 * モーダルの設定
 */
function setupModals() {
  // モーダルトリガー
  const modalTriggers = document.querySelectorAll('[data-modal]');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      
      // ターゲットモーダル
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        // モーダルを表示
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // モーダル内の閉じるボタン
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
          });
        }
        
        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
          }
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
          }
        });
      }
    });
  });
}

/**
 * タブの設定
 */
function setupTabs() {
  // タブコンテナ
  const tabContainers = document.querySelectorAll('.tabs-container');
  
  tabContainers.forEach(container => {
    // タブボタン
    const tabButtons = container.querySelectorAll('.tab-button');
    // タブコンテンツ
    const tabContents = container.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // アクティブなタブをリセット
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // クリックされたタブをアクティブに
        button.classList.add('active');
        
        // 対応するコンテンツをアクティブに
        const tabId = button.getAttribute('data-tab');
        const content = container.querySelector(`.tab-content[data-tab="${tabId}"]`);
        
        if (content) {
          content.classList.add('active');
          
          // カスタムイベントを発火
          const event = new CustomEvent('tabActivated', {
            detail: { tabId: tabId }
          });
          container.dispatchEvent(event);
        }
      });
    });
    
    // 初期タブをアクティブに
    if (tabButtons.length > 0 && tabContents.length > 0) {
      // URLパラメータでタブ指定がある場合
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      
      if (tabParam && container.querySelector(`.tab-button[data-tab="${tabParam}"]`)) {
        container.querySelector(`.tab-button[data-tab="${tabParam}"]`).click();
      } else {
        // デフォルトは最初のタブ
        tabButtons[0].click();
      }
    }
  });
}

/**
 * アコーディオンの設定
 */
function setupAccordions() {
  // アコーディオンアイテム
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    if (header && content) {
      header.addEventListener('click', () => {
        // アクティブ状態を切り替え
        const isActive = item.classList.contains('active');
        
        // 単一アコーディオンモードの場合、他を閉じる
        if (item.closest('.accordion')?.getAttribute('data-single') === 'true') {
          const siblings = item.closest('.accordion').querySelectorAll('.accordion-item');
          siblings.forEach(sibling => {
            if (sibling !== item) {
              sibling.classList.remove('active');
              const siblingContent = sibling.querySelector('.accordion-content');
              siblingContent.style.maxHeight = '0';
            }
          });
        }
        
        // 現在のアイテムの状態を切り替え
        item.classList.toggle('active');
        
        if (!isActive) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0';
        }
      });
      
      // 初期状態の設定
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    }
  });
}

/**
 * ドロップダウンの設定
 */
function setupDropdowns() {
  // ドロップダウントリガー
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  
  dropdownTriggers.forEach(trigger => {
    const dropdown = trigger.nextElementSibling;
    
    if (dropdown && dropdown.classList.contains('dropdown-menu')) {
      // クリックでドロップダウン表示切替
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        dropdown.classList.toggle('active');
        trigger.setAttribute('aria-expanded', dropdown.classList.contains('active'));
      });
      
      // 外部クリックで閉じる
      document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
      
      // ESCキーで閉じる
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown.classList.contains('active')) {
          dropdown.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
}

/**
 * スムーススクロールの設定
 */
function setupSmoothScroll() {
  // スムーススクロールリンク
  const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // ターゲット要素のIDを取得
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // オフセットを計算（ヘッダー高さ等）
        const offset = parseInt(link.getAttribute('data-offset') || '0', 10);
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const totalOffset = offset + headerHeight;
        
        // 要素の位置を取得
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - totalOffset;
        
        // スムーススクロール
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // URLにハッシュを追加
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * フィルターの設定
 */
function setupFilters() {
  // フィルターコンテナ
  const filterContainers = document.querySelectorAll('.filter-container');
  
  filterContainers.forEach(container => {
    // フィルターボタン
    const filterButtons = container.querySelectorAll('.filter-button');
    // フィルターアイテム
    const filterItems = container.querySelectorAll('.filter-item');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // アクティブなフィルターをリセット
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // クリックされたフィルターをアクティブに
        button.classList.add('active');
        
        // フィルターカテゴリを取得
        const filterCategory = button.getAttribute('data-filter');
        
        // アイテムをフィルタリング
        filterItems.forEach(item => {
          if (filterCategory === 'all') {
            item.classList.remove('hidden');
          } else {
            const itemCategories = item.getAttribute('data-categories')?.split(' ') || [];
            if (itemCategories.includes(filterCategory)) {
              item.classList.remove('hidden');
            } else {
              item.classList.add('hidden');
            }
          }
        });
        
        // カスタムイベントを発火
        const event = new CustomEvent('filterApplied', {
          detail: { category: filterCategory }
        });
        container.dispatchEvent(event);
      });
    });
    
    // 初期フィルターを適用
    const initialFilter = container.querySelector('.filter-button.active') || filterButtons[0];
    if (initialFilter) {
      initialFilter.click();
    }
  });
}

/**
 * スライダーの設定
 */
function setupSliders() {
  // スライダーコンテナ
  const sliders = document.querySelectorAll('.slider-container');
  
  sliders.forEach(slider => {
    // スライダー要素
    const sliderTrack = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    
    // ナビゲーションボタン
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    // スライドインジケーター
    const indicators = slider.querySelectorAll('.slider-indicator');
    
    if (sliderTrack && slides.length > 0) {
      let currentIndex = 0;
      const slideCount = slides.length;
      
      // 前へボタン
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + slideCount) % slideCount;
          updateSlider();
        });
      }
      
      // 次へボタン
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % slideCount;
          updateSlider();
        });
      }
      
      // インジケータークリック
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          currentIndex = index;
          updateSlider();
        });
      });
      
      // タッチスワイプ対応
      let touchStartX = 0;
      let touchEndX = 0;
      
      sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
      
      function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX - touchStartX > swipeThreshold) {
          // 右スワイプ（前へ）
          currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        } else if (touchStartX - touchEndX > swipeThreshold) {
          // 左スワイプ（次へ）
          currentIndex = (currentIndex + 1) % slideCount;
        }
        updateSlider();
      }
      
      // スライダー更新
      function updateSlider() {
        // スライド位置更新
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // インジケーター更新
        indicators.forEach((indicator, index) => {
          if (index === currentIndex) {
            indicator.classList.add('active');
          } else {
            indicator.classList.remove('active');
          }
        });
        
        // 前後ボタンの状態更新
        if (prevBtn && nextBtn) {
          prevBtn.classList.toggle('disabled', currentIndex === 0 && !slider.hasAttribute('data-loop'));
          nextBtn.classList.toggle('disabled', currentIndex === slideCount - 1 && !slider.hasAttribute('data-loop'));
        }
        
        // カスタムイベントを発火
        const event = new CustomEvent('slideChanged', {
          detail: { currentIndex: currentIndex }
        });
        slider.dispatchEvent(event);
      }
      
      // 自動再生
      if (slider.hasAttribute('data-autoplay')) {
        const interval = parseInt(slider.getAttribute('data-interval') || '5000', 10);
        
        let autoplayInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % slideCount;
          updateSlider();
        }, interval);
        
        // ホバーで一時停止
        slider.addEventListener('mouseenter', () => {
          clearInterval(autoplayInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
          autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateSlider();
          }, interval);
        });
      }
      
      // 初期状態を設定
      updateSlider();
    }
  });
}

/**
 * フォーム送信の設定
 */
function setupFormSubmission() {
  // Ajax送信フォーム
  const ajaxForms = document.querySelectorAll('form[data-ajax]');
  
  ajaxForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // フォームデータ作成
      const formData = new FormData(form);
      const formAction = form.getAttribute('action') || window.location.href;
      const formMethod = form.getAttribute('method') || 'POST';
      
      // 送信状態表示
      const submitBtn = form.querySelector('[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '送信中...';
      }
      
      // 結果表示エリア
      const resultArea = form.querySelector('.form-result') || document.createElement('div');
      if (!form.querySelector('.form-result')) {
        resultArea.className = 'form-result';
        form.appendChild(resultArea);
      }
      
      // AJAX送信
      fetch(formAction, {
        method: formMethod,
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('ネットワークエラー');
        }
        return response.json();
      })
      .then(data => {
        // 成功時の処理
        if (data.success) {
          resultArea.innerHTML = `<div class="success-message">${data.message || '送信に成功しました！'}</div>`;
          form.reset();
        } else {
          resultArea.innerHTML = `<div class="error-message">${data.message || 'エラーが発生しました'}</div>`;
        }
      })
      .catch(error => {
        // エラー時の処理
        resultArea.innerHTML = `<div class="error-message">送信エラー: ${error.message}</div>`;
      })
      .finally(() => {
        // 送信ボタンを元に戻す
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        
        // スクロールして結果表示
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  });
}

/**
 * タッチインタラクションの最適化
 */
function optimizeTouchInteractions() {
  // タッチデバイス検出
  const isTouchDevice = ('ontouchstart' in window) || 
                       (navigator.maxTouchPoints > 0) || 
                       (navigator.msMaxTouchPoints > 0);
  
  if (isTouchDevice) {
    // タッチデバイスフラグをセット
    document.documentElement.classList.add('touch-device');
    
    // タッチターゲットサイズ最適化
    const touchTargets = document.querySelectorAll(
      'button, .btn, nav a, input[type="checkbox"], input[type="radio"], select, .card, .feature-card'
    );
    
    touchTargets.forEach(element => {
      // 最小サイズを確保
      if (element.offsetWidth < 44 || element.offsetHeight < 44) {
        element.style.minWidth = '44px';
        element.style.minHeight = '44px';
        element.classList.add('touch-optimized');
      }
    });
    
    // クリック遅延削減
    document.documentElement.style.touchAction = 'manipulation';
    
    // ホバーメニューをタップに変更
    const hoverMenus = document.querySelectorAll('.has-dropdown');
    
    hoverMenus.forEach(menu => {
      // ホバーイベントを無効化し、タップイベントに置き換え
      menu.addEventListener('touchstart', (e) => {
        if (!menu.classList.contains('active')) {
          e.preventDefault();
          
          // 他のアクティブドロップダウンを閉じる
          document.querySelectorAll('.has-dropdown.active').forEach(item => {
            if (item !== menu) {
              item.classList.remove('active');
            }
          });
          
          menu.classList.add('active');
        }
      }, { passive: false });
      
      // ドロップダウン外のタップで閉じる
      document.addEventListener('touchstart', (e) => {
        if (!menu.contains(e.target)) {
          menu.classList.remove('active');
        }
      }, { passive: true });
    });
  }
}

// グローバル関数としてエクスポート
window.FunLinkInteractions = {
  openModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  },
  
  closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  },
  
  scrollToElement: function(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const totalOffset = offset + headerHeight;
      
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - totalOffset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
};

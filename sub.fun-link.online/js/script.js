/**
 * FunLink - script.js
 * メインスクリプトファイル - 全体の初期化と制御
 * @version 1.2.0
 */

/**
 * 背景の星空を生成する
 * 画面サイズに応じて適切な数の星を動的に生成し、一部にきらめきアニメーションを追加する
 */
function createStars() {
	// 星を表示するコンテナ要素を取得
	const starsContainer = document.getElementById('stars-container');
	if (!starsContainer) return;

	// コンテナをクリア（重複防止）
	starsContainer.innerHTML = '';

	// 画面幅に応じて星の数を決定（パフォーマンス最適化）
	const numberOfStars = Math.min(window.innerWidth / 2, 250);

	// 指定された数の星を生成
	for (let i = 0; i < numberOfStars; i++) {
			const star = document.createElement('div');
			star.classList.add('star');

			// ランダムなサイズを設定（小さな星がより多くなるよう調整）
			const size = Math.random() * 3;
			star.style.width = `${size}px`;
			star.style.height = `${size}px`;

			// 画面内にランダムに配置
			const posX = Math.random() * 100;
			const posY = Math.random() * 100;
			star.style.left = `${posX}%`;
			star.style.top = `${posY}%`;

			// 一部の星にきらめきアニメーションを追加
			if (Math.random() > 0.7) {
					star.classList.add('twinkle');
					// ランダムな持続時間と遅延でより自然な効果に
					star.style.setProperty('--twinkle-duration', `${2 + Math.random() * 4}s`);
					star.style.setProperty('--twinkle-delay', `${Math.random() * 3}s`);
			}

			// コンテナに星を追加
			starsContainer.appendChild(star);
	}
}

/**
* スクロールに連動したアニメーションを処理
* 要素が画面内に入ったときにアニメーションを実行
*/
function handleScrollAnimations() {
	// アニメーション対象要素を取得
	const animatedElements = [
			...document.querySelectorAll('.value-card'),
			...document.querySelectorAll('.declaration-card')
	];

	// CTA（行動喚起）セクションを取得
	const ctaSection = document.querySelector('.cta-section');

	/**
	 * 要素がビューポート内に入ったかチェックしてアニメーション実行
	 */
	function checkScroll() {
			const windowHeight = window.innerHeight;
			// 画面の80%位置をトリガーポイントに設定
			const triggerPoint = windowHeight * 0.8;

			// 各アニメーション要素をチェック
			animatedElements.forEach(element => {
					const elementTop = element.getBoundingClientRect().top;
					const delay = element.getAttribute('data-delay') || 0;

					// 要素が表示領域に入ったらアニメーション開始
					if (elementTop < triggerPoint) {
							setTimeout(() => {
									element.classList.add('animated');
							}, delay);
					}
			});

			// CTA領域もチェック
			if (ctaSection && ctaSection.getBoundingClientRect().top < triggerPoint) {
					ctaSection.classList.add('animated');
			}
	}

	// ページ読み込み時にも初期チェック実行
	checkScroll();

	// スクロール時にチェック実行（パフォーマンス向上のためpassiveオプション使用）
	window.addEventListener('scroll', checkScroll, { passive: true });
}

/**
* ナビゲーションバーのスクロール時の表示変更を処理
* スクロール位置に応じてナビゲーションバーの外観を変更
*/
function handleNavbarScroll() {
	// ナビゲーションバー要素を取得
	const navbar = document.getElementById('navbar');
	if (!navbar) return;

	// スクロールイベントのリスナーを追加
	window.addEventListener('scroll', function() {
			// スクロール位置が50px以上になると背景色を変更
			if (window.scrollY > 50) {
					navbar.classList.add('scrolled');
			} else {
					navbar.classList.remove('scrolled');
			}
	}, { passive: true }); // パフォーマンス向上のためpassiveオプションを使用
}

/**
* スムーズスクロールを設定
* アンカーリンクがクリックされたときに、対象セクションへ滑らかにスクロール
*/
function setupSmoothScroll() {
	// スクロールダウンボタンとアンカーリンクを取得
	const scrollDownBtn = document.getElementById('scroll-down');
	const scrollLinks = document.querySelectorAll('a[href^="#"]');

	// スクロールダウンボタンの処理
	if (scrollDownBtn) {
			scrollDownBtn.addEventListener('click', function(e) {
					e.preventDefault();
					const aboutSection = document.getElementById('about');
					if (aboutSection) {
							aboutSection.scrollIntoView({behavior: 'smooth'});
					}
			});
	}

	// すべてのアンカーリンクの処理
	scrollLinks.forEach(link => {
			link.addEventListener('click', function(e) {
					e.preventDefault();

					// モバイルメニューが開いている場合は閉じる
					if (typeof closeMenu === 'function') {
						closeMenu();
					}

					// ターゲットセクションへスクロール
					const targetId = this.getAttribute('href');
					if (targetId === '#') return;

					const targetElement = document.querySelector(targetId);
					if (targetElement) {
							targetElement.scrollIntoView({behavior: 'smooth'});
					}
			});
	});
}

/**
* モバイルメニューの機能を設定
* ハンバーガーメニューの開閉処理
*/
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (!mobileMenuBtn || !navMenu) return;

  mobileMenuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    console.log('メニュートグル', navMenu.classList.contains('active'));
  });
}

	// グローバルに公開する閉じる関数
	window.closeMenu = function() {
		if (!navMenu) return;
		navMenu.classList.remove('active');
		overlay.classList.remove('active');
		if (mobileMenuBtn) {
			mobileMenuBtn.textContent = '☰';
		}
		body.style.overflow = '';
	};

	if (mobileMenuBtn && navMenu) {
		// メニューボタンのクリックイベント
		mobileMenuBtn.addEventListener('click', function(e) {
			e.stopPropagation(); // イベント伝播を防止
			navMenu.classList.toggle('active');
			overlay.classList.toggle('active');
			this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
			body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
		});

		// オーバーレイクリックでメニューを閉じる
		overlay.addEventListener('click', closeMenu);

		// ESCキーでメニューを閉じる
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && navMenu.classList.contains('active')) {
				closeMenu();
			}
		});

		// メニュー内リンクをクリックしたときにメニューを閉じる
		const menuLinks = navMenu.querySelectorAll('a');
		menuLinks.forEach(link => {
			link.addEventListener('click', closeMenu);
		});
	}
}

/**
* ロゴにキラキラエフェクトを追加
* ロゴの周りにランダムな位置でキラキラした星を表示
*/
function addSparkleEffect() {
	const logoContainer = document.querySelector('.logo-container');
	if (!logoContainer) return;

	// 既存のキラキラを一旦削除（再実行時のため）
	const existingSparkles = document.querySelectorAll('.logo-sparkle');
	existingSparkles.forEach(sparkle => sparkle.remove());

	// 端末性能に応じてキラキラの数を調整（モバイルデバイスは少なめに）
	const isMobile = window.innerWidth < 768;
	const numberOfSparkles = isMobile ? 8 : 15;

	// パフォーマンス向上のため遅延実行
	setTimeout(() => {
		// キラキラを生成して追加
		for (let i = 0; i < numberOfSparkles; i++) {
			const sparkle = document.createElement('div');
			sparkle.classList.add('logo-sparkle');

			// ランダムな位置を計算
			const angle = Math.random() * Math.PI * 2; // 0-360度のランダム角度
			const distance = 40 + Math.random() * 100; // ロゴの中央からの距離
			const logoWidth = logoContainer.offsetWidth || 200;
			const logoHeight = logoContainer.offsetHeight || 200;

			// 中心からの座標計算
			const centerX = logoWidth / 2;
			const centerY = logoHeight / 2;
			const x = centerX + Math.cos(angle) * distance;
			const y = centerY + Math.sin(angle) * distance;

			// スタイル設定
			sparkle.style.left = `${x}px`;
			sparkle.style.top = `${y}px`;
			sparkle.style.width = `${2 + Math.random() * 3}px`;
			sparkle.style.height = sparkle.style.width;

			// アニメーション設定
			const duration = 1 + Math.random() * 2;
			const delay = Math.random() * 3;
			sparkle.style.animation = `sparkle ${duration}s infinite ${delay}s`;

			// コンテナに追加
			logoContainer.appendChild(sparkle);
		}
	}, 500); // メイン読み込み後に遅延実行
}

/**
* キャラクターとロゴの表示を最適化
* 画像の読み込みとサイズ調整を行う
*/
function optimizeCharacterDisplay() {
	// 要素の取得
	const character = document.querySelector('.character');
	const logo = document.querySelector('.logo');
	const scrollDown = document.querySelector('.scroll-down');

	// 要素が見つからない場合は処理を中止
	if (!character || !logo) return;

	/**
	 * 画像の読み込みを最適化する内部関数
	 * @param {HTMLImageElement} img - 対象の画像要素
	 * @param {number} fadeDuration - フェードイン効果の持続時間（ミリ秒）
	 */
	function setupImage(img, fadeDuration = 500) {
			// 既に読み込み済みの場合は即時表示
			if (img.complete) {
					img.style.opacity = '1';
			} else {
					// 読み込み中は非表示にして待機
					img.style.opacity = '0';
					img.addEventListener('load', () => {
							// 読み込み完了後にフェードイン
							img.style.transition = `opacity ${fadeDuration}ms ease`;
							img.style.opacity = '1';
					});
			}
	}

	/**
	 * キャラクターとロゴのサイズを画面サイズに合わせて動的に調整
	 */
	function adjustCharacterSize() {
			const windowHeight = window.innerHeight;
			const windowWidth = window.innerWidth;

			// 画面サイズに応じた最適なサイズ調整
			if (windowHeight < 600 || windowWidth < 360) {
					// 非常に小さい画面向け設定
					character.style.maxHeight = '65%';
					logo.style.marginTop = '-4rem';
			} else if (windowWidth < 480) {
					// スマートフォン向け設定
					character.style.maxHeight = '70%';
					character.style.width = '85%';
					logo.style.marginTop = '-5rem';
			} else if (windowWidth < 768) {
					// タブレット向け設定
					character.style.maxHeight = '75%';
					character.style.width = '85%';
					logo.style.marginTop = '-6rem';
			} else {
					// デスクトップ向け設定
					character.style.maxHeight = '80%';
					character.style.width = '80%';
					logo.style.marginTop = '-8rem';
			}
	}

	// 画像表示の初期化
	setupImage(character, 800);
	setupImage(logo, 1000);

	// スクロールダウン表示
	if (scrollDown) {
			setTimeout(() => {
					scrollDown.style.opacity = '0.7';
			}, 1500);
	}

	// サイズ調整を実行
	adjustCharacterSize();

	// 画面サイズ変更時に再調整（パフォーマンス最適化のためpassiveオプション使用）
	window.addEventListener('resize', adjustCharacterSize, { passive: true });
}

/**
* タッチイベントを最適化
* モバイルデバイスでのタップ操作を安定化
*/
function optimizeTouchEvents() {
	// タッチデバイスかどうかを判定
	const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

	// タッチデバイスでない場合は処理を終了
	if (!isTouchDevice) return;

	// タップ対象の要素を選択
	const touchElements = document.querySelectorAll(
			'a, button, .nav-link, .value-card, .declaration-card, ' +
			'.creator-item, .company-item, .cta-button, .creator-type'
	);

	// 各要素にタッチイベントリスナーを追加
	touchElements.forEach(element => {
			// タッチ開始時の処理
			element.addEventListener('touchstart', function(e) {
					// スクロール中のタップを防止（誤操作防止）
					if (window.scrolling) return;

					// 視覚的フィードバック用のクラス追加
					this.classList.add('tap-active');
			}, { passive: true }); // パフォーマンス向上のためpassiveオプション使用

			// タッチ終了時の処理
			element.addEventListener('touchend', function(e) {
					// アクティブクラスを削除
					this.classList.remove('tap-active');

					// 300ms後に完全にリセット（遅延タップの問題対策）
					setTimeout(() => {
							this.style.transform = '';
					}, 300);
			}, { passive: true });

			// タッチキャンセル時の処理
			element.addEventListener('touchcancel', function(e) {
					this.classList.remove('tap-active');
					this.style.transform = '';
			}, { passive: true });
	});

	// スクロール検出
	let scrollTimeout;
	window.scrolling = false;

	window.addEventListener('scroll', function() {
			window.scrolling = true;

			// すべてのタップアクティブ状態をクリア
			document.querySelectorAll('.tap-active').forEach(el => {
					el.classList.remove('tap-active');
					el.style.transform = '';
			});

			// スクロール停止の検出
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
					window.scrolling = false;
			}, 100);
	}, { passive: true });

	// グリッドアイテムの安定化
	stabilizeGridItems();
}

/**
* グリッドアイテムを安定化
* リスト表示のレイアウト崩れを防止
*/
function stabilizeGridItems() {
	// グリッド要素を取得
	const grids = document.querySelectorAll('.creators-grid, .companies-grid');

	// 各グリッドにイベント対策を追加
	grids.forEach(grid => {
			// グリッド全体のタッチムーブイベントを最適化
			grid.addEventListener('touchmove', function(e) {
					// グリッドのスクロールを許可するが、タップ状態をリセット
					document.querySelectorAll('.tap-active').forEach(el => {
							el.classList.remove('tap-active');
					});
			}, { passive: true });

			// 子要素のサイズを固定化してレイアウトシフトを防止
			const items = grid.querySelectorAll('.creator-item, .company-item');
			items.forEach(item => {
					// 高さを固定して安定させる
					const height = item.offsetHeight;
					if (height > 0) {
							item.style.height = `${height}px`;
					}

					// 画像の読み込み完了時にもレイアウト安定化
					const img = item.querySelector('img');
					if (img) {
							if (img.complete) {
									// 既に読み込み済みの場合
									ensureImageSize(img, item);
							} else {
									// 読み込み中の場合
									img.onload = () => ensureImageSize(img, item);
							}
					}
			});
	});
}

/**
* 画像サイズの確実な設定
* レイアウトシフトを防止するため画像サイズを適切に設定
* @param {HTMLImageElement} img - 対象の画像要素
* @param {HTMLElement} container - 画像の親コンテナ
*/
function ensureImageSize(img, container) {
	if (img.naturalWidth > 0) {
			img.style.width = "auto";
			img.style.maxWidth = "100%";
			img.style.maxHeight = container.classList.contains('company-item') ? "40px" : "70px";
			img.style.objectFit = "contain";
	}
}

/**
* 流れ星エフェクトを生成する
* マウスフォローする流れ星の実装
*/
function createShootingStar() {
    // 既存の流れ星を削除
    const existingStars = document.querySelectorAll('.shooting-star');
    existingStars.forEach(star => star.remove());

    // 新しい流れ星を作成
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');

    // 初期位置設定
    shootingStar.style.cssText = `
        position: fixed;
        left: 10%;
        top: 10%;
        width: 4px;
        height: 120px;
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
        transform: rotate(45deg);
        z-index: 9999;
        pointer-events: none;
    `;

    // DOMに追加
    document.body.appendChild(shootingStar);

    // マウスに追従
    document.addEventListener('mousemove', function(e) {
        if (shootingStar) {
            shootingStar.style.left = (e.clientX - 50) + 'px';
            shootingStar.style.top = (e.clientY - 50) + 'px';
        }
    });

    return shootingStar;
}

/**
* 流れ星エフェクトを開始
*/
function startShootingStarEffect() {
    // モバイルデバイス判定（モバイルでは表示しない）
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) return;

    // 即時実行で流れ星を作成
    createShootingStar();
}

/**
* ビジョンステートメントを強調するアニメーション
*/
function animateVisionStatement() {
	const visionElement = document.querySelector('.vision-statement');
	if (!visionElement) return;

	// パルスアニメーション効果 - 5秒ごとに実行
	setInterval(() => {
			visionElement.classList.add('pulse');
			setTimeout(() => {
					visionElement.classList.remove('pulse');
			}, 700);
	}, 5000);
}

/**
* スマホのスクロールとタッチ操作を最適化
*/
function optimizeMobilePerformance() {
	// 画像読み込み完了時のレイアウトシフト防止
	const images = document.querySelectorAll('img');
	images.forEach(img => {
			if (img.complete) {
					img.style.opacity = 1;
			} else {
					img.style.opacity = 0;
					img.addEventListener('load', function() {
							// フェードインで表示してレイアウトシフトを視覚的に軽減
							setTimeout(() => {
									img.style.transition = 'opacity 0.3s ease';
									img.style.opacity = 1;
							}, 100);
					});
			}
	});
}

// DOMコンテンツロード時に実行
document.addEventListener('DOMContentLoaded', function() {
	// 初期化処理の順序を出力（デバッグ用）
	console.log('FunLink アプリケーションを初期化しています...');

	// 1. 星空背景を生成
	createStars();

	// 2. スクロールアニメーションの設定
	handleScrollAnimations();

	// 3. ナビゲーションバースクロール効果の設定
	handleNavbarScroll();

	// 4. スムーズスクロールの設定
	setupSmoothScroll();

	// 5. モバイルメニューの設定
	setupMobileMenu();

	// 6. タッチイベント最適化
	optimizeTouchEvents();

	// 7. キャラクター表示の最適化
	optimizeCharacterDisplay();

	// 8. キラキラエフェクト追加
	addSparkleEffect();

	// 9. ビジョンステートメントアニメーション
	animateVisionStatement();

	// 10. 流れ星エフェクト開始
	startShootingStarEffect();

	// 11. ページ全体の安定性向上のための設定
	document.body.classList.add('fixed-container');

	// 12. 画面リサイズ時の処理
	window.addEventListener('resize', () => {
			// 画面サイズ変更時にスパークル再生成
			addSparkleEffect();

			// 画面サイズ変更時に星を再生成（画面回転など大きな変更時のみ）
			if (window.innerWidth !== window.lastWidth) {
					createStars();
					window.lastWidth = window.innerWidth;
			}
	}, { passive: true });
});

/**
* ウィンドウ読み込み完了時に実行
* 読み込み後の最終調整やパフォーマンス最適化を行う
*/
window.addEventListener('load', function() {
	// モバイルデバイスのパフォーマンス最適化
	optimizeMobilePerformance();

	// 初期状態を記録（リサイズ検出用）
	window.lastWidth = window.innerWidth;

	console.log('FunLink読み込み完了');
});
/**
 * FunLink - interactions.js
 * ユーザーインタラクション関連の処理を管理するスクリプト
 * @version 1.0.0
 */

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
					const navMenu = document.getElementById('nav-menu');
					if (navMenu && navMenu.classList.contains('active')) {
							navMenu.classList.remove('active');
							const menuBtn = document.getElementById('mobile-menu-btn');
							if (menuBtn) {
									menuBtn.textContent = '☰';
							}
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
	// 必要な要素を取得
	const mobileMenuBtn = document.getElementById('mobile-menu-btn');
	const navMenu = document.getElementById('nav-menu');

	if (!mobileMenuBtn || !navMenu) return; // 要素が見つからない場合は終了

	// メニューを閉じる関数（複数箇所で使用するため関数化）
	function closeMenu() {
			navMenu.classList.remove('active');
			mobileMenuBtn.textContent = '☰';

			// メニュー閉じる時のアニメーション
			navMenu.style.transition = 'right 0.3s ease';

			// オーバーレイ要素があれば削除
			const overlay = document.querySelector('.menu-overlay');
			if (overlay) {
					overlay.style.opacity = '0';
					setTimeout(() => overlay.remove(), 300);
			}
	}

	// グローバルに公開（他のJSからも使用可能に）
	window.closeMenu = closeMenu;

	// メニューボタンのクリックイベント
	mobileMenuBtn.addEventListener('click', function(e) {
			e.stopPropagation(); // イベント伝播を防止

			// メニュー表示状態の切り替え
			navMenu.classList.toggle('active');

			// ボタンのテキスト切り替え
			this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';

			// メニュー表示時にオーバーレイを追加
			if (navMenu.classList.contains('active')) {
					const overlay = document.createElement('div');
					overlay.classList.add('menu-overlay');
					overlay.style.cssText = `
							position: fixed;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							background: rgba(0, 0, 0, 0.5);
							z-index: 90;
							opacity: 0;
							transition: opacity 0.3s ease;
					`;
					document.body.appendChild(overlay);
					setTimeout(() => overlay.style.opacity = '1', 10);

					// オーバーレイクリックでメニューを閉じる
					overlay.addEventListener('click', closeMenu);
			} else {
					closeMenu();
			}
	});

	// ESCキーでメニューを閉じる
	document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && navMenu.classList.contains('active')) {
					closeMenu();
			}
	});

	// メニュー内のリンクをクリックしたときにメニューを閉じる
	const menuLinks = navMenu.querySelectorAll('a');
	menuLinks.forEach(link => {
			link.addEventListener('click', closeMenu);
	});
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
* スマホのスクロールとタッチ操作を最適化
*/
function optimizeMobilePerformance() {
	// iOS Safariのバウンススクロール対策
	document.body.addEventListener('touchstart', function(e) {
			if (e.touches.length > 1) {
					e.preventDefault(); // ピンチズーム防止
			}
	}, { passive: false });

	// スムーズスクロール最適化
	const links = document.querySelectorAll('a[href^="#"]');
	links.forEach(link => {
			link.addEventListener('click', function(e) {
					// スクロール中フラグを設定
					window.scrolling = true;

					// スクロール終了検出
					setTimeout(() => {
							window.scrolling = false;
					}, 1000);
			});
	});

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

// モジュールとしてエクスポート
export {
	handleNavbarScroll,
	setupSmoothScroll,
	setupMobileMenu,
	optimizeTouchEvents,
	optimizeMobilePerformance
};
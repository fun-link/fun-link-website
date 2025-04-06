/**
 * FunLink - main script file
 * キャラクターサイズを大きくする修正を含む完全版
 */
/**
 * ビジョンステートメントを強調するアニメーション
 */
function animateVisionStatement() {
	const visionElement = document.querySelector('.vision-statement');
	if (!visionElement) return;

	// 星エフェクトをビジョンステートメント周りにも追加
	setTimeout(() => {
			addStarsAround(visionElement, 4);

			// パルスアニメーション効果 - 5秒ごとに実行
			setInterval(() => {
					visionElement.classList.add('pulse');
					setTimeout(() => {
							visionElement.classList.remove('pulse');
					}, 700);
			}, 5000);
	}, 2000); // 2秒後に実行（他の要素のアニメーション後）
}

// 既存の関数を修正 - addStarsAround関数がある場合は変更不要

// DOMContentLoaded内に関数呼び出しを追加
document.addEventListener('DOMContentLoaded', function() {
	// 既存の関数呼び出し...

	// ビジョンステートメントアニメーション
	animateVisionStatement();

	// 残りの既存コード...
});
// キャラクターとロゴの読み込み・表示処理の最適化
function optimizeCharacterDisplay() {
	const character = document.querySelector('.character');
	const logo = document.querySelector('.logo');
	const scrollDown = document.querySelector('.scroll-down');

	if (!character || !logo) return;

	// 画像の読み込みを最適化
	function setupImage(img, fadeDuration = 500) {
			// すでに読み込み済みの場合は即時表示
			if (img.complete) {
					img.style.opacity = '1';
			} else {
					// 読み込み中は表示を待機
					img.style.opacity = '0';
					img.addEventListener('load', () => {
							// フェードイン効果で表示
							img.style.transition = `opacity ${fadeDuration}ms ease`;
							img.style.opacity = '1';
					});
			}
	}

	// キャラクターとロゴのサイズを動的に調整
	function adjustCharacterSize() {
			const headerHeight = document.querySelector('.header').offsetHeight;
			const windowHeight = window.innerHeight;
			const windowWidth = window.innerWidth;

			// 画面サイズに応じた調整
			if (windowHeight < 600 || windowWidth < 360) {
					// 非常に小さい画面向け
					character.style.maxHeight = '65%';
					logo.style.marginTop = '-4rem';
			} else if (windowWidth < 480) {
					// スマホ向け調整
					character.style.maxHeight = '70%';
					character.style.width = '85%';
					logo.style.marginTop = '-5rem';
			} else if (windowWidth < 768) {
					// タブレット向け調整
					character.style.maxHeight = '75%';
					character.style.width = '85%';
					logo.style.marginTop = '-6rem';
			} else {
					// デスクトップ向け
					character.style.maxHeight = '80%';
					character.style.width = '90%';
					logo.style.marginTop = '-8rem';
			}
	}

	// 初期化と最適化
	setupImage(character, 800);
	setupImage(logo, 1000);

	// スクロールダウン表示
	if (scrollDown) {
			setTimeout(() => {
					scrollDown.style.opacity = '0.7';
			}, 1500);
	}

	// サイズ調整を実施
	adjustCharacterSize();

	// リサイズ時の再調整
	window.addEventListener('resize', adjustCharacterSize, { passive: true });
}

/**
* タッチイベント最適化のための関数
* スマホでのタップ操作時のレイアウト崩れを防止する
*/
function optimizeTouchEvents() {
	// タッチイベントをサポートしているか確認
	const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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

					// バブリングを停止しない（必要なイベントは伝播させる）
			}, { passive: true }); // パフォーマンスのためにpassiveオプションを使用

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
* グリッドアイテム（クリエイターリスト・企業リスト）を安定化する関数
*/
function stabilizeGridItems() {
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
* 画像サイズを確実に設定し、レイアウトシフトを防止する
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
* Creates the star background effect
*/
function createStars() {
const starsContainer = document.getElementById('stars-container');
if (!starsContainer) return;

// クリア - 重複防止
starsContainer.innerHTML = '';

// Responsive star count based on viewport width
const numberOfStars = Math.min(window.innerWidth / 3, 200);

for (let i = 0; i < numberOfStars; i++) {
		const star = document.createElement('div');
		star.classList.add('star');

		// Random size for stars (smaller stars are more common)
		const size = Math.random() * 3;
		star.style.width = `${size}px`;
		star.style.height = `${size}px`;

		// Random position across the viewport
		const posX = Math.random() * 100;
		const posY = Math.random() * 100;
		star.style.left = `${posX}%`;
		star.style.top = `${posY}%`;

		// Random twinkle animation for some stars
		if (Math.random() > 0.7) {
				star.classList.add('twinkle');
				// Randomize twinkle duration and delay for more natural effect
				star.style.setProperty('--twinkle-duration', `${2 + Math.random() * 4}s`);
				star.style.setProperty('--twinkle-delay', `${Math.random() * 3}s`);
		}

		starsContainer.appendChild(star);
}
}

/**
* マウスに追従する流れ星エフェクト
*/
function setupMouseTrailStars() {
    // 流れ星のコンテナを作成
    const trailContainer = document.createElement('div');
    trailContainer.className = 'mouse-trail-container';
    trailContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;
    document.body.appendChild(trailContainer);

    // 流れ星用のスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        .mouse-star {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
        }

        .mouse-trail {
            position: absolute;
            height: 3px;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
            transform-origin: left center;
            pointer-events: none;
            opacity: 0;
            animation: fadeTrail 0.8s ease-out forwards;
        }

        @keyframes fadeTrail {
            0% { opacity: 0.9; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // マウス位置の追跡
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let trailTimeout = null;
    let isMoving = false;

    // マウス移動イベントの監視
    document.addEventListener('mousemove', function(e) {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;

        // 流れ星生成の間隔を制御
        if (!trailTimeout) {
            trailTimeout = setTimeout(() => {
                if (isMoving) {
                    createMouseTrail(mouseX, mouseY, prevMouseX, prevMouseY);
                }
                trailTimeout = null;
            }, 50); // 生成間隔をここで調整（ミリ秒）
        }
    });

    // マウスが動いていない状態を検出
    document.addEventListener('mouseleave', () => {
        isMoving = false;
    });

    // 流れ星の生成
    function createMouseTrail(x, y, prevX, prevY) {
        // 動きが小さすぎる場合は生成しない
        const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
        if (distance < 5) return;

        // 流れ星の方向と長さを計算
        const angle = Math.atan2(y - prevY, x - prevX);
        const length = Math.min(distance * 2, 80); // 長さ制限

        // 星を生成（マウスの位置）
        const star = document.createElement('div');
        star.className = 'mouse-star';
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${8 + Math.random() * 4}px`;
        star.style.height = star.style.width;
        star.style.opacity = '0.8';
        trailContainer.appendChild(star);

        // 尾を生成（流れ星の軌跡）
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.width = `${length}px`;
        trail.style.left = `${prevX}px`;
        trail.style.top = `${prevY}px`;
        trail.style.transform = `rotate(${angle}rad)`;

        // ランダムな色合いを追加
        const hue = Math.random() > 0.7 ? '210' : '60'; // 青または黄色系
        trail.style.background = `linear-gradient(90deg,
            rgba(255,255,255,0) 0%,
            hsla(${hue}, 100%, 80%, 0.8) 50%,
            rgba(255,255,255,0) 100%)`;

        trailContainer.appendChild(trail);

        // アニメーション終了後に要素を削除
        setTimeout(() => {
            star.remove();
            trail.remove();
        }, 800); // アニメーション時間と同じか少し長く

        // 星も徐々にフェードアウト
        setTimeout(() => {
            star.style.transition = 'opacity 0.4s ease-out';
            star.style.opacity = '0';
        }, 100);
    }
}

/**
* Handles scroll-based animations
*/
function handleScrollAnimations() {
// Get all elements that should be animated on scroll
const animatedElements = [
		...document.querySelectorAll('.value-card'),
		...document.querySelectorAll('.declaration-card')
];

const ctaSection = document.querySelector('.cta-section');

/**
 * Checks if elements are in viewport and triggers animations
 */
function checkScroll() {
		const windowHeight = window.innerHeight;
		// Trigger point at 80% of viewport height from the top
		const triggerPoint = windowHeight * 0.8;

		// Check each element
		animatedElements.forEach(element => {
				const elementTop = element.getBoundingClientRect().top;
				const delay = element.getAttribute('data-delay') || 0;

				if (elementTop < triggerPoint) {
						setTimeout(() => {
								element.classList.add('animated');
						}, delay);
				}
		});

		// Check CTA section separately
		if (ctaSection && ctaSection.getBoundingClientRect().top < triggerPoint) {
				ctaSection.classList.add('animated');
		}
}

// Initial check when page loads
checkScroll();

// Check on scroll - スクロールパフォーマンス向上のためpassiveオプション追加
window.addEventListener('scroll', checkScroll, { passive: true });
}

/**
* Handles navbar appearance changes on scroll
*/
function handleNavbarScroll() {
const navbar = document.getElementById('navbar');
	if (!navbar) return;

window.addEventListener('scroll', function() {
		if (window.scrollY > 50) {
				navbar.classList.add('scrolled');
		} else {
				navbar.classList.remove('scrolled');
		}
}, { passive: true }); // パフォーマンス向上のためにpassiveを追加
}

/**
* Sets up smooth scrolling for anchor links
*/
function setupSmoothScroll() {
const scrollDownBtn = document.getElementById('scroll-down');
const scrollLinks = document.querySelectorAll('a[href^="#"]');

// Handle scroll down arrow in hero section
if (scrollDownBtn) {
		scrollDownBtn.addEventListener('click', function(e) {
				e.preventDefault();
				const aboutSection = document.getElementById('about');
				if (aboutSection) {
					aboutSection.scrollIntoView({behavior: 'smooth'});
				}
		});
}

// Handle all anchor links
scrollLinks.forEach(link => {
		link.addEventListener('click', function(e) {
				e.preventDefault();

				// Close mobile menu if open
				const navMenu = document.getElementById('nav-menu');
				if (navMenu && navMenu.classList.contains('active')) {
						navMenu.classList.remove('active');
						const menuBtn = document.getElementById('mobile-menu-btn');
						if (menuBtn) {
							menuBtn.textContent = '☰';
						}
				}

				// Get target section and scroll to it
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
* Sets up mobile menu functionality - 改良版
*/
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;

    // オーバーレイを作成
    const overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    body.appendChild(overlay);

    if (mobileMenuBtn && navMenu) {
        // メニューボタンクリックイベント
        mobileMenuBtn.addEventListener('click', function(e) {
            // メニュー開閉時のイベント伝播を防止（タップ操作安定化）
            e.stopPropagation();

            // Toggle menu active state
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');

            // Change icon based on menu state
            this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';

            // メニュー表示時は背景スクロール無効化
            if (navMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // オーバーレイクリックでメニューを閉じる
        overlay.addEventListener('click', function() {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
            mobileMenuBtn.textContent = '☰';
        });

        // ESCキーでメニューを閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
                mobileMenuBtn.textContent = '☰';
            }
        });

        // 画面タップでメニューを閉じる
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                e.target !== mobileMenuBtn) {
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
                mobileMenuBtn.textContent = '☰';
            }
        });

        // ナビゲーションリンククリック時にメニューを閉じる
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
                mobileMenuBtn.textContent = '☰';
            });
        });
    }

    // 画面リサイズ時にモバイルメニューを閉じる
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
            if (mobileMenuBtn) {
                mobileMenuBtn.textContent = '☰';
            }
        }
    });
}

/**
* Adds sparkle effect to the logo
*/
function addSparkleEffect() {
const logoContainer = document.querySelector('.logo-container');
if (!logoContainer) return;

// 既存のキラキラを削除（再実行時のため）
const existingSparkles = document.querySelectorAll('.logo-sparkle');
existingSparkles.forEach(sparkle => sparkle.remove());

// キラキラの数を端末性能に合わせて調整（モバイルは少なく）
const isMobile = window.innerWidth < 768;
const numberOfSparkles = isMobile ? 8 : 15;

// 遅延処理でパフォーマンス向上
setTimeout(() => {
	// キラキラを作成し追加
	for (let i = 0; i < numberOfSparkles; i++) {
			const sparkle = document.createElement('div');
			sparkle.classList.add('logo-sparkle');

			// ランダムな位置
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
* Creates a shooting star effect (can be called from console for demos)
*/
function createShootingStar() {
const starsContainer = document.getElementById('stars-container');
if (!starsContainer) return;

const shootingStar = document.createElement('div');

// Random start position (top of screen, random horizontal)
const startX = Math.random() * 100;

// Style the shooting star
shootingStar.style.cssText = `
	position: absolute;
	left: ${startX}%;
	top: 0;
	width: 2px;
	height: 80px;
	background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
	transform: rotate(45deg);
	z-index: -1;
	pointer-events: none;
`;

// アニメーションクラスを使用（スタイルタグ生成を避ける）
shootingStar.classList.add('shooting-star');

// Add to container
starsContainer.appendChild(shootingStar);

// Remove after animation
setTimeout(() => {
		shootingStar.remove();
}, 1000);
}

/**
* スマホのスクロールパフォーマンス向上とグラつき対策
* - パッシブイベントリスナーを追加
* - タッチ操作時のバウンスを防止
*/
window.addEventListener('load', function() {
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
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // 1. Create stars for background
    createStars();

    // 2. Handle animations on scroll
    handleScrollAnimations();

    // 3. Handle navbar scroll effect
    handleNavbarScroll();

    // 4. Setup smooth scrolling
    setupSmoothScroll();

    // 5. Setup mobile menu
    setupMobileMenu();

    // 6. タッチイベント最適化の追加
    optimizeTouchEvents();

    // 7. キャラクター表示の最適化（既存のコードを置き換え）
    optimizeCharacterDisplay();

    // 8. キラキラエフェクト追加
    addSparkleEffect();

    // 9. マウス追従流れ星エフェクトの追加
    setupMouseTrailStars();

    // 10. ページ全体の安定性向上のための設定
    document.body.classList.add('fixed-container');

    // 11. リサイズ時の処理
    window.addEventListener('resize', () => {
        // 画面サイズ変更時にスパークル再生成
        addSparkleEffect();
    }, { passive: true });

    // 12. 自動流れ星エフェクト - 不定期に流れ星を表示
    setInterval(() => {
        // 50%の確率で表示
        if (Math.random() > 0.5) {
            createShootingStar();
        }
    }, 8000); // 8秒ごとに判定
});

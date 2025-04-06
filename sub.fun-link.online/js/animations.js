/**
 * FunLink - animations.js
 * アニメーション関連の処理を管理するスクリプト
 * @version 1.0.0
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
					character.style.width = '90%';
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
* 流れ星エフェクトを生成する
* デスクトップ環境でのみ表示される流れ星アニメーション
*/
function createShootingStar() {
	// デスクトップデバイス判定（モバイルでは表示しない）
	const isMobile = window.innerWidth < 768;
	if (isMobile) return;

	const starsContainer = document.getElementById('stars-container');
	if (!starsContainer) return;

	// 既存の流れ星を削除（重複防止）
	const existingStars = document.querySelectorAll('.shooting-star');
	existingStars.forEach(star => star.remove());

	// 新しい流れ星を作成
	const shootingStar = document.createElement('div');

	// ランダムな開始位置を設定
	const startX = Math.random() * 80; // 画面幅の80%以内でランダム

	// 流れ星のスタイル設定
	shootingStar.style.cssText = `
			position: absolute;
			left: ${startX}%;
			top: 0;
			width: 3px;
			height: 80px;
			background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
			transform: rotate(45deg);
			z-index: 1;
			pointer-events: none;
			opacity: 1;
			box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
	`;

	// アニメーション設定
	shootingStar.animate(
			[
					{ transform: 'translateX(0) translateY(0) rotate(45deg)', opacity: 0 },
					{ opacity: 1, offset: 0.1 },
					{ opacity: 1, offset: 0.8 },
					{ transform: 'translateX(100vw) translateY(100vh) rotate(45deg)', opacity: 0 }
			],
			{
					duration: 2000,
					easing: 'linear',
					fill: 'forwards'
			}
	);

	// DOMに追加
	shootingStar.classList.add('shooting-star');
	starsContainer.appendChild(shootingStar);

	// 一定時間後に削除
	setTimeout(() => {
			shootingStar.remove();
	}, 2000);
}

// モジュールとしてエクスポート
export {
	createStars,
	handleScrollAnimations,
	addSparkleEffect,
	optimizeCharacterDisplay,
	createShootingStar
};
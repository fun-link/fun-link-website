document.addEventListener('DOMContentLoaded', function() {
    // 現在の日付と時刻を表示
    updateDateTime();
    // 1分ごとに時刻を更新
    setInterval(updateDateTime, 60000);

    // フォーム要素のイベントリスナーを設定
    setupFormListeners();

    // 計算ボタンのイベントリスナーを設定
    document.getElementById('calculate-button').addEventListener('click', function() {
        if (document.getElementById('agree_terms').checked) {
            calculateTotal();
            showConfirmationModal(); // 確認モーダルを表示
        } else {
            alert('利用規約に同意してください。見積りを計算するには利用規約への同意が必要です。');
        }
    });

    // Excelエクスポートボタンのイベントリスナーを設定
    document.getElementById('export-excel').addEventListener('click', function() {
        if (document.getElementById('agree_terms').checked) {
            exportToExcel();
        } else {
            alert('利用規約に同意してください。Excel出力するには利用規約への同意が必要です。');
        }
    });

    // 利用規約同意チェックボックスのイベントリスナーを設定
    document.getElementById('agree_terms').addEventListener('change', toggleSubmitButton);

    // サイト容量入力欄の変更時に内訳を表示
    document.getElementById('site_size').addEventListener('input', function() {
        if (document.getElementById('agree_terms').checked) {
            calculateTotal();
        }
        updateSiteSizePrice();
    });

    // サイト容量の料金内訳表示/非表示の切り替え
    document.getElementById('site-size-price-text').addEventListener('click', function() {
        const details = document.getElementById('site-size-price-details');
        details.classList.toggle('hidden');
    });

    // 初期表示時に基本料金を表示
    document.getElementById('basic-price').textContent = formatCurrency(12000);
    document.getElementById('subtotal').textContent = formatCurrency(12000);
    document.getElementById('tax').textContent = formatCurrency(1200);
    document.getElementById('grand-total').textContent = formatCurrency(13200);

    // メールアカウント数の変更時にアカウント入力欄を生成
    document.getElementById('email_account_count').addEventListener('change', function() {
        // メールアカウント入力欄を更新
        updateEmailAccounts();
        // 見積もり計算実行
        if (document.getElementById('agree_terms').checked) {
            calculateTotal();
        }
    });

    // メールアカウント追加ボタンのイベントリスナーを設定
    document.getElementById('add-email-account').addEventListener('click', function() {
        // 現在のアカウント数を取得して1増やす
        const currentCount = parseInt(document.getElementById('email_account_count').value) || 0;
        if (currentCount < 10) { // 最大10アカウントまで
            document.getElementById('email_account_count').value = currentCount + 1;
            // メールアカウント入力欄を更新
            updateEmailAccounts();
            // 見積もり計算実行
            if (document.getElementById('agree_terms').checked) {
                calculateTotal();
            }
        } else {
            alert('最大10アカウントまで設定できます');
        }
    });

    // カテゴリー別の詳細表示をクリックで表示/非表示
    setupDetailsToggle('server');
    setupDetailsToggle('domain');
    setupDetailsToggle('email');
    setupDetailsToggle('options');

    // 入力内容の自動保存（5秒ごと）
    setInterval(saveProgress, 5000);

    // ページロード時に保存されていた内容を復元
    loadSavedData();

    // フォームの検証機能
    document.getElementById('estimate-form').addEventListener('submit', function(e) {
        // フォームの検証
        if (!validateForm()) {
            e.preventDefault();
            alert('入力内容に不備があります。必須項目を入力し、エラーを修正してください。');
        } else if (!validateEmailForwarding()) {
            e.preventDefault();
            alert('メール転送設定に不備があります。メールアドレスを正しく入力してください。');
        }
    });

    // モーダル関連の要素を取得
    const modal = document.getElementById('confirmation-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const copyTextButton = document.getElementById('copy-text-button');
    const exportExcelModal = document.getElementById('export-excel-modal');
    const exportPdfModal = document.getElementById('export-pdf-modal');

    // スクロール位置を保存する変数
    let scrollPosition = 0;

    // モーダルを表示する関数
    function showConfirmationModal() {
        // 見積もり内容のテキストを生成
        const estimateText = generateEstimateText();

        // モーダル内のコンテンツ領域に表示（整形されたテキストとして）
        document.getElementById('confirmation-content').innerHTML = estimateText.replace(/\n/g, '<br>');

        // スクロール位置を保存
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // モーダルを表示
        const modal = document.getElementById('confirmation-modal');
        modal.style.display = 'block';

        // モーダル内の要素を確実に表示
        document.getElementById('copy-text-button').style.display = 'block';
        document.querySelector('.export-options').style.display = 'flex';
        document.getElementById('close-modal-button').style.display = 'block';

        // モーダル表示時の画面固定処理
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
        document.body.classList.add('modal-open');
    }

    // モーダルを閉じる関数
    function closeModal() {
        // モーダルを非表示
        modal.style.display = 'none';

        // モーダル表示時の画面固定解除
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('modal-open');

        // スクロール位置を復元
        window.scrollTo(0, scrollPosition);
    }

    // モーダルを閉じる処理
    closeModalBtn.addEventListener('click', closeModal);
    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // テキストコピー機能
    copyTextButton.addEventListener('click', copyEstimateText);

    // Excel出力ボタン
    exportExcelModal.addEventListener('click', function() {
        exportToExcel(); // 既存のExcel出力関数を使用
        closeModal();
    });

    // PDF出力ボタン (現段階では機能せず、メッセージのみ)
    exportPdfModal.addEventListener('click', function() {
        alert('PDF出力機能は近日実装予定です。現在はExcelでの出力をご利用ください。');
    });

    // 見積もりテキストをコピーする関数
    function copyEstimateText() {
        const textToCopy = document.getElementById('confirmation-content').textContent;

        // クリップボードにコピー
        navigator.clipboard.writeText(textToCopy).then(function() {
            // コピー成功メッセージ
            const successMsg = document.createElement('div');
            successMsg.className = 'copy-success';
            successMsg.textContent = 'テキストをコピーしました！';
            document.body.appendChild(successMsg);

            // 数秒後にメッセージを削除
            setTimeout(function() {
                document.body.removeChild(successMsg);
            }, 3000);
        }).catch(function(err) {
            alert('テキストのコピーに失敗しました。ブラウザの設定を確認してください。');
            console.error('コピーに失敗しました:', err);
        });
    }

    // 見積もり内容のテキストを生成する関数
    function generateEstimateText() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const formattedDateTime = now.toLocaleDateString('ja-JP', options);

        // 顧客情報
        const customerName = document.getElementById('customer_name').value || '未入力';
        const companyName = document.getElementById('company_name').value || '未入力';
        const email = document.getElementById('email').value || '未入力';
        const phone = document.getElementById('phone').value || '未入力';

        // 基本情報
        const currentUrl = document.getElementById('current_url').value || '未入力';
        const wpVersion = document.getElementById('wp_version').value || '未入力';
        const phpVersion = document.getElementById('php_version').value || '未入力';
        const siteSize = document.getElementById('site_size').value || '0';

        // 料金情報
        const basicPrice = document.getElementById('basic-price').textContent;
        const siteSizePrice = document.getElementById('site-size-price').textContent;
        const serverPrice = document.getElementById('server-price').textContent;
        const domainPrice = document.getElementById('domain-price').textContent;
        const emailPrice = document.getElementById('email-price').textContent;
        const optionsPrice = document.getElementById('options-price').textContent;
        const subtotal = document.getElementById('subtotal').textContent;
        const tax = document.getElementById('tax').textContent;
        const grandTotal = document.getElementById('grand-total').textContent;

        // プラットフォーム選択
        let platform = '';
        const platformRadios = document.getElementsByName('platform');
        for (const radio of platformRadios) {
            if (radio.checked) {
                platform = radio.value === 'coconala' ? 'ココナラ' :
                          radio.value === 'lancers' ? 'ランサーズ' : '直接依頼';
                break;
            }
        }

        // 選択されたオプションの取得
        let selectedOptions = [];

        // サーバー関連オプション
        if (document.getElementById('wp_installation').checked)
            selectedOptions.push('ワードプレスを新しいサーバーに設置 (+¥3,000)');
        if (document.getElementById('plugin_migration').checked)
            selectedOptions.push('プラグインの移行・設定 (+¥5,000)');
        if (document.getElementById('php_update').checked)
            selectedOptions.push('PHPのバージョンアップ (+¥6,000)');
        if (document.getElementById('wp_update').checked)
            selectedOptions.push('ワードプレスのバージョンアップ (+¥6,000)');
        if (document.getElementById('multisite').checked)
            selectedOptions.push('マルチサイト対応 (+¥4,000)');
        if (document.getElementById('ssh_migration').checked)
            selectedOptions.push('SSHでの移行が必要 (+¥34,000)');
        if (document.getElementById('test_server').checked)
            selectedOptions.push('テストサーバー構築・検証 (+¥10,000)');
        if (document.getElementById('info_support_server').checked)
            selectedOptions.push('情報開示がない場合のサポート (+¥10,000)');

        // メール関連オプション
        if (document.getElementById('spf_settings').checked)
            selectedOptions.push('SPF設定 (+¥3,000)');
        if (document.getElementById('dkim_settings').checked)
            selectedOptions.push('DKIM設定 (+¥3,000)');
        if (document.getElementById('dmarc_settings').checked)
            selectedOptions.push('DMARC設定 (+¥3,000)');

        // ドメイン関連オプション
        if (document.getElementById('domain_transfer').checked)
            selectedOptions.push('ドメインの移管 (+¥10,000)');
        if (document.getElementById('domain_dns').checked)
            selectedOptions.push('ドメイン移管後のDNS設定 (+¥12,000)');
        if (document.getElementById('domain_change').checked)
            selectedOptions.push('ドメイン変更 (+¥4,000)');
        if (document.getElementById('domain_redirect').checked)
            selectedOptions.push('旧サイトから新サイトへの転送設定 (+¥5,000)');
        if (document.getElementById('ssl_setup').checked)
            selectedOptions.push('http→https設定 (+¥5,000)');
        if (document.getElementById('ssl_fix').checked)
            selectedOptions.push('SSLの設定で不具合が出た場合の修正 (+¥10,000)');
        if (document.getElementById('www_unification').checked)
            selectedOptions.push('wwwあり/なし統一 (+¥3,000)');
        if (document.getElementById('dns_settings').checked)
            selectedOptions.push('移管後のDNS設定 (+¥12,000)');

        // その他オプション
        if (document.getElementById('google_analytics').checked)
            selectedOptions.push('Googleアナリティクス設定 (+¥5,000)');
        if (document.getElementById('google_search_console').checked)
            selectedOptions.push('Googleサーチコンソール設定 (+¥3,000)');
        if (document.getElementById('recaptcha').checked)
            selectedOptions.push('reCAPTCHA設定 (+¥3,000)');
        if (document.getElementById('sitemap').checked)
            selectedOptions.push('サイトマップ設定 (+¥3,000)');
        if (document.getElementById('backup_storage').checked)
            selectedOptions.push('バックアップ保管 (+¥5,000)');
        // 他のオプションも同様に追加...

        // 区切り線の改善
        const separator = "=".repeat(53);

        let text = '';
        text += `${separator}\n`;
        text += `  WordPressサーバー移転・ドメイン移管サービス 見積書\n`;
        text += `${separator}\n\n`;

        text += `■ 見積り作成日時: ${formattedDateTime}\n\n`;
        text += `■ お客様情報\n`;
        text += `  お名前: ${customerName}\n`;
        text += `  会社名: ${companyName}\n`;
        text += `  メールアドレス: ${email}\n`;
        text += `  電話番号: ${phone}\n\n`;
        text += `■ サイト基本情報\n`;
        text += `  サイトURL: ${currentUrl}\n`;
        text += `  WordPressバージョン: ${wpVersion}\n`;
        text += `  PHPバージョン: ${phpVersion}\n`;
        text += `  サイト容量: ${siteSize}GB\n\n`;

        if (selectedOptions.length > 0) {
            text += `■ 選択されたオプション\n`;
            selectedOptions.forEach(option => {
                text += `  ・${option}\n`;
            });
            text += `\n`;
        }

        text += `■ 料金内訳\n`;
        text += `  基本料金: ${basicPrice}\n`;
        text += `  サイト容量追加料金: ${siteSizePrice}\n`;
        text += `  サーバー移転料金: ${serverPrice}\n`;
        text += `  ドメイン関連料金: ${domainPrice}\n`;
        text += `  メール設定料金: ${emailPrice}\n`;
        text += `  オプションサービス料金: ${optionsPrice}\n`;

        if (document.getElementById('sns_discount').checked) {
            text += `  SNS拡散割引 (5%): ${document.getElementById('discount-value').textContent}\n`;
        }

        text += `  小計: ${subtotal}\n`;
        text += `  消費税 (10%): ${tax}\n`;
        text += `  合計金額: ${grandTotal}\n\n`;
        text += `■ 依頼プラットフォーム: ${platform}\n\n`;
        text += `=====================================================\n`;
        text += `WordPressサーバー移転サービス\n`;
        text += `※本見積りの有効期限は発行日より30日間です。\n`;

        return text;
    }
});

// 詳細表示のトグル機能をセットアップする関数
function setupDetailsToggle(category) {
    const detailsContainer = document.getElementById(`${category}-details`);
    if (!detailsContainer) return;

    // クリックイベントを追加
    detailsContainer.addEventListener('click', function() {
        this.classList.toggle('hidden');
    });

    // 料金表示にもクリックイベントを追加
    const priceElement = document.getElementById(`${category}-price`);
    if (priceElement) {
        priceElement.addEventListener('click', function() {
            detailsContainer.classList.toggle('hidden');
        });
        priceElement.style.cursor = 'pointer';
        priceElement.title = 'クリックで詳細表示';
    }
}

// 現在の日付と時刻を更新する関数
function updateDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const formattedDateTime = now.toLocaleDateString('ja-JP', options);
    document.getElementById('current-date-time').textContent = formattedDateTime;
}

// サイト容量に基づく料金を計算し表示する関数
function updateSiteSizePrice() {
    const sizeField = document.getElementById('site_size');
    const size = parseFloat(sizeField.value) || 0;
    let price = 0;
    let priceText = 'サイト容量追加料金: ';

    // サイズに応じた料金を計算
    if (size < 2) {
        price = 0;
        priceText += formatCurrency(price);
    } else if (size >= 2 && size < 10) {
        price = 8000;
        priceText += formatCurrency(price) + ' (2GB以上10GB未満)';
    } else if (size >= 10 && size < 20) {
        price = 13000;
        priceText += formatCurrency(price) + ' (10GB以上20GB未満)';
    } else if (size >= 20 && size < 30) {
        price = 23000;
        priceText += formatCurrency(price) + ' (20GB以上30GB未満)';
    } else {
        price = 30000;
        priceText += formatCurrency(price) + ' (30GB以上)';
    }

    // 料金文字列を更新
    document.getElementById('site-size-price-text').textContent = priceText;
    document.getElementById('site-size-price').textContent = formatCurrency(price);

    return price;
}

// フォーム要素のイベントリスナーを設定する関数
function setupFormListeners() {
    // オプションの詳細表示/非表示の切り替え
    const optionCheckboxes = document.querySelectorAll('.option-checkbox');
    optionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const details = this.closest('.option-item').querySelector('.details');
            if (details) {
                if (this.checked) {
                    details.classList.remove('hidden');
                } else {
                    details.classList.add('hidden');
                }
            }
        });
    });

    // 「その他」オプションの場合、テキストフィールドの表示/非表示
    const otherOptions = document.querySelectorAll('input[value="other"]');
    otherOptions.forEach(option => {
        option.addEventListener('change', function() {
            const name = this.getAttribute('name');
            const otherField = document.querySelector(`input[name="${name}_other"]`);
            if (otherField) {
                if (this.checked) {
                    otherField.classList.remove('hidden');
                } else {
                    otherField.classList.add('hidden');
                }
            }
        });
    });

    // SNS拡散割引チェックボックスの状態変更
    document.getElementById('sns_discount').addEventListener('change', function() {
        const discountRow = document.getElementById('discount-row');
        if (this.checked) {
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }

        // 利用規約に同意している場合のみ計算を実行
        if (document.getElementById('agree_terms').checked) {
            calculateTotal();
        }
    });

    // すべてのチェックボックスとラジオボタンに変更イベントを設定
    const allInputs = document.querySelectorAll('input[type="checkbox"], input[type="radio"], select, input[type="number"]');
    allInputs.forEach(input => {
        input.addEventListener('change', function() {
            // 利用規約に同意している場合のみ計算を実行
            if (document.getElementById('agree_terms').checked) {
                calculateTotal();
            }
        });
    });

    // 転送メールのために、全てのメールアドレス入力欄の変更を監視するリスナー登録
    document.addEventListener('input', function(e) {
        // 入力があったら見積もり計算実行
        if (document.getElementById('agree_terms').checked) {
            calculateTotal();
        }
    });

    // メールアカウント削除ボタンのイベントリスナー
    document.addEventListener('click', function(e) {
        // メールアカウント削除ボタン
        if (e.target && e.target.classList.contains('remove-account')) {
            // 親要素（メールアカウント）を削除
            const accountContainer = e.target.closest('.email-account');
            if (accountContainer) {
                accountContainer.remove();
                updateEmailAccountNumbers();

                // 見積もりを再計算
                if (document.getElementById('agree_terms').checked) {
                    calculateTotal();
                }
            }
        }

        // 転送先追加ボタン
        if (e.target && e.target.classList.contains('add-forward-btn')) {
            const accountContainer = e.target.closest('.email-account');
            if (accountContainer) {
                const accountIndex = accountContainer.dataset.index;
                const forwardContainer = accountContainer.querySelector('.forward-destinations');

                // 転送先の数を確認（最大5個まで）
                const currentForwards = forwardContainer.querySelectorAll('.forward-destination');
                if (currentForwards.length < 5) {
                    // 新しい転送先入力欄を追加
                    const forwardIndex = currentForwards.length + 1;
                    addForwardDestination(forwardContainer, accountIndex, forwardIndex);

                    // 見積もりを再計算
                    if (document.getElementById('agree_terms').checked) {
                        calculateTotal();
                    }
                } else {
                    alert('転送先は最大5個まで設定できます');
                }
            }
        }

        // 転送先削除ボタン
        if (e.target && e.target.classList.contains('remove-forward')) {
            // 親要素（転送先）を削除
            const forwardContainer = e.target.closest('.forward-destination');
            if (forwardContainer) {
                forwardContainer.remove();

                // 見積もりを再計算
                if (document.getElementById('agree_terms').checked) {
                    calculateTotal();
                }
            }
        }
    });

    // セクション見出しをクリックすると内容を折りたたむ
    document.querySelectorAll('.form-section h2').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.parentElement.querySelector('.form-row, .option-item, .wp-info-note');
            if (content) {
                content.classList.toggle('collapsed');
                this.classList.toggle('collapsed-header');
            }
        });
    });
}

// メールアカウント入力欄を更新する関数
function updateEmailAccounts() {
    const container = document.getElementById('email-accounts-container');
    const count = parseInt(document.getElementById('email_account_count').value) || 0;

    // 現在のアカウントを確認し、必要に応じて追加または削除
    const currentAccounts = container.querySelectorAll('.email-account');

    // アカウント数が減った場合、余分なアカウントを削除
    if (currentAccounts.length > count) {
        for (let i = count; i < currentAccounts.length; i++) {
            currentAccounts[i].remove();
        }
    }
    // アカウント数が増えた場合、新しいアカウントを追加
    else if (currentAccounts.length < count) {
        for (let i = currentAccounts.length + 1; i <= count; i++) {
            const accountDiv = createEmailAccountElement(i);
            container.appendChild(accountDiv);
        }
    }

    // アカウント番号を更新
    updateEmailAccountNumbers();
}

// メールアカウント要素を作成する関数
function createEmailAccountElement(index) {
    const accountDiv = document.createElement('div');
    accountDiv.className = 'email-account';
    accountDiv.dataset.index = index;
    accountDiv.innerHTML = `
        <button type="button" class="remove-account" title="このアカウントを削除">×</button>
        <h3>メールアカウント ${index}</h3>
        <div class="form-row">
            <div class="form-group">
                <label for="email_address_${index}">メールアドレス ${index}</label>
                <input type="email" id="email_address_${index}" name="email_address_${index}" placeholder="例: info@example.com">
            </div>
            <div class="form-group">
                <label for="email_password_${index}">設定するパスワード ${index}</label>
                <input type="password" id="email_password_${index}" name="email_password_${index}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group full-width">
                <label>転送設定 (+¥1,000/転送先)</label>
                <div class="forward-destinations">
                    <div class="forward-destination">
                        <input type="email" id="email_forward_${index}_1" name="email_forward_${index}_1" placeholder="例: forwarding@gmail.com">
                    </div>
                </div>
                <button type="button" class="add-forward-btn">+ 転送先を追加</button>
                <p class="help-text">※転送先を入力すると、1転送先につき1,000円が追加されます</p>
            </div>
        </div>
    `;
    return accountDiv;
}

// 転送先要素を追加する関数
function addForwardDestination(container, accountIndex, forwardIndex) {
    const forwardDiv = document.createElement('div');
    forwardDiv.className = 'forward-destination';
    forwardDiv.innerHTML = `
        <input type="email" id="email_forward_${accountIndex}_${forwardIndex}" name="email_forward_${accountIndex}_${forwardIndex}" placeholder="例: forwarding${forwardIndex}@gmail.com">
        <button type="button" class="remove-forward" title="この転送先を削除">×</button>
    `;
    container.appendChild(forwardDiv);
}

// メールアカウント番号を更新する関数
function updateEmailAccountNumbers() {
    const container = document.getElementById('email-accounts-container');
    const accounts = container.querySelectorAll('.email-account');

    // カウンターを更新
    document.getElementById('email_account_count').value = accounts.length;

    // 各アカウントのインデックスと表示テキストを更新
    accounts.forEach((account, i) => {
        const index = i + 1;
        account.dataset.index = index;

        // ヘッダーテキストを更新
        const header = account.querySelector('h3');
        if (header) {
            header.textContent = `メールアカウント ${index}`;
        }

        // 各ラベルとIDを更新
        const labels = account.querySelectorAll('label');
        labels.forEach(label => {
            const forAttr = label.getAttribute('for');
            if (forAttr) {
                const baseName = forAttr.split('_').slice(0, -1).join('_');
                label.setAttribute('for', `${baseName}_${index}`);

                // ラベルテキストも更新
                if (label.textContent.includes('メールアドレス')) {
                    label.textContent = `メールアドレス ${index}`;
                } else if (label.textContent.includes('設定するパスワード')) {
                    label.textContent = `設定するパスワード ${index}`;
                }
            }
        });

        // メールアドレスと設定するパスワードのIDと名前を更新
        const emailAddress = account.querySelector(`input[id^="email_address_"]`);
        if (emailAddress) {
            emailAddress.id = `email_address_${index}`;
            emailAddress.name = `email_address_${index}`;
        }

        const emailPassword = account.querySelector(`input[id^="email_password_"]`);
        if (emailPassword) {
            emailPassword.id = `email_password_${index}`;
            emailPassword.name = `email_password_${index}`;
        }

        // 転送先入力欄のIDと名前を更新
        const forwardInputs = account.querySelectorAll(`input[id^="email_forward_"]`);
        forwardInputs.forEach((input, j) => {
            const forwardIndex = j + 1;
            input.id = `email_forward_${index}_${forwardIndex}`;
            input.name = `email_forward_${index}_${forwardIndex}`;
        });
    });
}

// メール転送設定の料金を計算する関数
function calculateEmailForwardingFee() {
    const container = document.getElementById('email-accounts-container');
    const accounts = container.querySelectorAll('.email-account');
    let forwardingFee = 0;
    let forwardingDetails = [];

    // 各メールアカウントの転送設定を確認
    accounts.forEach((account, i) => {
        const accountIndex = i + 1;
        const emailAddress = account.querySelector(`#email_address_${accountIndex}`).value.trim();
        const accountName = emailAddress ? emailAddress : `メールアカウント${accountIndex}`;

        // すべての転送先を取得
        const forwardInputs = account.querySelectorAll(`input[id^="email_forward_${accountIndex}_"]`);
        let accountForwards = [];

        forwardInputs.forEach((input, j) => {
            const forwardValue = input.value.trim();
            if (forwardValue !== '') {
                forwardingFee += 1000;
                accountForwards.push(forwardValue);
            }
        });

        // 転送先があれば詳細に追加
        if (accountForwards.length > 0) {
            forwardingDetails.push({
                name: `${accountName}の転送設定`,
                count: accountForwards.length,
                price: accountForwards.length * 1000,
                emailAddress: accountName,
                forwards: accountForwards
            });
        }
    });

    return { fee: forwardingFee, details: forwardingDetails };
}

// 合計金額を計算する関数
function calculateTotal() {
    const basicPrice = 12000; // 基本料金
    const siteSizePrice = updateSiteSizePrice(); // サイト容量追加料金

    // 各カテゴリーの選択項目と金額を格納するオブジェクトを作成
    const serverOptions = [];
    const domainOptions = [];
    const emailOptions = [];
    const otherOptions = [];

    let serverPrice = 0;    // サーバー移転料金
    let domainPrice = 0;    // ドメイン関連料金
    let emailPrice = 0;     // メール設定料金
    let optionsPrice = 0;   // オプションサービス料金

    // 日時指定の追加料金
    if (document.getElementById('date_specification').checked) {
        optionsPrice += 10000;
        otherOptions.push({name: '日時指定あり', price: 10000});
    }

    // サーバー関連のオプション
    if (document.getElementById('wp_installation').checked) {
        serverPrice += 3000;
        serverOptions.push({name: 'ワードプレスを新しいサーバーに設置', price: 3000});
    }
    if (document.getElementById('php_update').checked) {
        serverPrice += 6000;
        serverOptions.push({name: 'PHPのバージョンアップ', price: 6000});
    }
    if (document.getElementById('wp_update').checked) {
        serverPrice += 6000;
        serverOptions.push({name: 'ワードプレスのバージョンアップ', price: 6000});
    }
    if (document.getElementById('plugin_migration').checked) {
        serverPrice += 5000;
        serverOptions.push({name: 'プラグインの移行・設定', price: 5000});
    }
    if (document.getElementById('multisite').checked) {
        serverPrice += 4000;
        serverOptions.push({name: 'マルチサイト対応', price: 4000});
    }
    if (document.getElementById('ssh_migration').checked) {
        serverPrice += 34000;
        serverOptions.push({name: 'SSHでの移行が必要', price: 34000});
    }
    if (document.getElementById('test_server').checked) {
        serverPrice += 10000;
        serverOptions.push({name: 'テストサーバー構築・検証', price: 10000});
    }
    if (document.getElementById('info_support_server').checked) {
        serverPrice += 10000;
        serverOptions.push({name: '情報開示がない場合のサポート', price: 10000});
    }

    // ドメイン関連のオプション
    if (document.getElementById('domain_transfer').checked) {
        domainPrice += 10000;
        domainOptions.push({name: 'ドメインの移管', price: 10000});
    }
    if (document.getElementById('domain_dns').checked) {
        domainPrice += 12000;
        domainOptions.push({name: 'ドメイン移管後のDNS設定', price: 12000});
    }
    if (document.getElementById('domain_change').checked) {
        domainPrice += 4000;
        domainOptions.push({name: 'ドメイン変更', price: 4000});
    }
    if (document.getElementById('domain_redirect').checked) {
        domainPrice += 5000;
        domainOptions.push({name: '旧サイトから新サイトへの転送設定', price: 5000});
    }
    if (document.getElementById('ssl_setup').checked) {
        domainPrice += 5000;
        domainOptions.push({name: 'http→https設定', price: 5000});
    }
    if (document.getElementById('ssl_fix').checked) {
        domainPrice += 10000;
        domainOptions.push({name: 'SSLの設定で不具合が出た場合の修正', price: 10000});
    }
    if (document.getElementById('www_unification').checked) {
        domainPrice += 3000;
        domainOptions.push({name: 'wwwあり/なし統一', price: 3000});
    }
    if (document.getElementById('dns_settings').checked) {
        domainPrice += 12000;
        domainOptions.push({name: '移管後のDNS設定', price: 12000});
    }

    // メール設定料金の計算
    const emailAccountCount = parseInt(document.getElementById('email_account_count').value) || 0;
    if (emailAccountCount > 0) {
        emailPrice += 3000;  // 基本料金 3,000円

        // 各メールアカウントの情報を収集
        const container = document.getElementById('email-accounts-container');
        const accounts = container.querySelectorAll('.email-account');
        let accountDetails = [];

        accounts.forEach((account, i) => {
            const index = i + 1;
            const emailAddress = account.querySelector(`#email_address_${index}`).value.trim();

            if (emailAddress) {
                accountDetails.push(emailAddress);
            } else {
                accountDetails.push(`アカウント${index}`);
            }
        });

        // 全てのメールアドレスを結合して表示
        const emailAddressesText = accountDetails.join(', ');

        emailOptions.push({
            name: `メールアカウント設定 (${emailAccountCount}アカウント)`,
            price: 3000,
            emailAddresses: accountDetails,
            detailDisplay: true
        });

        // メール転送設定料金の計算
        const forwardingInfo = calculateEmailForwardingFee();
        if (forwardingInfo.fee > 0) {
            emailPrice += forwardingInfo.fee;
            forwardingInfo.details.forEach(detail => {
                emailOptions.push({
                    name: `${detail.emailAddress}の転送設定`,
                    count: detail.count,
                    price: detail.price,
                    emailAddress: detail.emailAddress,
                    forwards: detail.forwards,
                    detailDisplay: true
                });
            });
        }
    }

    // メール関連のオプション (メール転送設定を削除)
    if (document.getElementById('spf_settings').checked) {
        optionsPrice += 3000;
        otherOptions.push({name: 'SPF設定', price: 3000});
    }
    if (document.getElementById('dkim_settings').checked) {
        optionsPrice += 3000;
        otherOptions.push({name: 'DKIM設定', price: 3000});
    }
    if (document.getElementById('dmarc_settings').checked) {
        optionsPrice += 3000;
        otherOptions.push({name: 'DMARC設定', price: 3000});
    }

    // その他のオプションサービス
    if (document.getElementById('google_analytics').checked) {
        optionsPrice += 5000;
        otherOptions.push({name: 'Googleアナリティクス設定', price: 5000});
    }
    if (document.getElementById('google_search_console').checked) {
        optionsPrice += 3000;
        otherOptions.push({name: 'Googleサーチコンソール設定', price: 3000});
    }
    if (document.getElementById('recaptcha').checked) {
        optionsPrice += 3000;
        otherOptions.push({name: 'reCAPTCHA設定', price: 3000});
    }
    if (document.getElementById('sitemap').checked) {
        optionsPrice += 3000;
        otherOptions.push({name: 'サイトマップ設定', price: 3000});
    }
    if (document.getElementById('ahrefs_analysis').checked) {
        optionsPrice += 6000;
        otherOptions.push({name: 'a hrefs 流入ワード・被リンク分析レポート', price: 6000});
    }
    if (document.getElementById('seo_advice').checked) {
        optionsPrice += 40000;
        otherOptions.push({name: '移転の際のSEO効果引き渡しアドバイス', price: 40000});
    }
    if (document.getElementById('domain_lecture').checked) {
        optionsPrice += 30000;
        otherOptions.push({name: 'ドメイン移管やサーバー移転に関するレクチャー', price: 30000});
    }
    if (document.getElementById('screen_sharing').checked) {
        optionsPrice += 30000;
        otherOptions.push({name: '画面共有での説明', price: 30000});
    }
    if (document.getElementById('troubleshooting').checked) {
        optionsPrice += 10000;
        otherOptions.push({name: '不具合の調査作業', price: 10000});
    }
    if (document.getElementById('issue_fixing').checked) {
        optionsPrice += 15000;
        otherOptions.push({name: '不具合の修正作業', price: 15000});
    }
    if (document.getElementById('backup_storage').checked) {
        optionsPrice += 5000;
        otherOptions.push({name: 'バックアップ保管', price: 5000});
    }
    if (document.getElementById('php_wp_upgrade_investigation').checked) {
        optionsPrice += 10000;
        otherOptions.push({name: 'phpバージョンアップ、WPバージョンアップ時の不具合調査', price: 10000});
    }
    if (document.getElementById('issue_fix').checked) {
        optionsPrice += 20000;
        otherOptions.push({name: '不具合の修正', price: 20000});
    }

    // 小計の計算
    let subtotal = basicPrice + siteSizePrice + serverPrice + domainPrice + emailPrice + optionsPrice;

    // SNS拡散割引の計算
    let discountAmount = 0;
    if (document.getElementById('sns_discount').checked) {
        discountAmount = Math.round(subtotal * 0.05);
        document.getElementById('discount-value').textContent = '-' + formatCurrency(discountAmount);
        subtotal -= discountAmount;
    }

    // 消費税の計算（10%）
    const tax = Math.round(subtotal * 0.1);

    // 合計金額
    const grandTotal = subtotal + tax;

    // 金額を表示
    document.getElementById('basic-price').textContent = formatCurrency(basicPrice);
    document.getElementById('site-size-price').textContent = formatCurrency(siteSizePrice);
    document.getElementById('server-price').textContent = formatCurrency(serverPrice);
    document.getElementById('domain-price').textContent = formatCurrency(domainPrice);
    document.getElementById('email-price').textContent = formatCurrency(emailPrice);
    document.getElementById('options-price').textContent = formatCurrency(optionsPrice);
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('grand-total').textContent = formatCurrency(grandTotal);

    // 選択したオプションの詳細をHTMLとして構築
    updateDetailsDisplay('server', serverOptions);
    updateDetailsDisplay('domain', domainOptions);
    updateDetailsDisplay('email', emailOptions);
    updateDetailsDisplay('options', otherOptions);
}

// 選択したオプションの詳細表示を更新する関数
function updateDetailsDisplay(category, options) {
    const detailsContainer = document.getElementById(`${category}-details`);
    if (!detailsContainer) return;

    // 詳細表示コンテナをクリア
    detailsContainer.innerHTML = '';

    // 選択したオプションがない場合は非表示にする
    if (options.length === 0) {
        detailsContainer.classList.add('hidden');
        return;
    }

    // 詳細表示コンテナに選択したオプションを追加
    for (const option of options) {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';

        // メールアカウント情報の特別表示
        if (option.name.includes('メールアカウント設定') && option.emailAddresses) {
            let emailAddressesHtml = '';
            if (option.emailAddresses && option.emailAddresses.length > 0) {
                emailAddressesHtml = option.emailAddresses[0];
            }

            detailItem.innerHTML = `
                <span class="detail-name">${option.name}
                    <span class="detail-account-name">${emailAddressesHtml}</span>
                </span>
                <span class="detail-price">${formatCurrency(option.price)}</span>
            `;

            // 複数アカウントがある場合は詳細情報に追加
            if (option.emailAddresses && option.emailAddresses.length > 1) {
                const detailInfo = document.createElement('div');
                detailInfo.className = 'detail-info';
                let addressesHtml = '';
                for (let i = 1; i < option.emailAddresses.length; i++) {
                    addressesHtml += `<div class="forward-list-item" style="padding-left: 0;">${option.emailAddresses[i]}</div>`;
                }
                if (addressesHtml) {
                    detailInfo.innerHTML = `
                        <div class="forward-list">
                            ${addressesHtml}
                        </div>
                    `;
                    detailItem.appendChild(detailInfo);
                }
            }
        }
        // 転送先情報の表示改善
        else if (option.name.includes('転送設定') && option.forwards) {
            detailItem.innerHTML = `
                <span class="detail-name">${option.name} (${option.count}件)</span>
                <span class="detail-price">${formatCurrency(option.price)}</span>
            `;

            // 転送先リストを追加
            if (option.forwards && option.forwards.length > 0) {
                const detailInfo = document.createElement('div');
                detailInfo.className = 'detail-info';
                let forwardsHtml = '';
                option.forwards.forEach(forward => {
                    forwardsHtml += `<div class="forward-list-item">${forward}</div>`;
                });

                detailInfo.innerHTML = `
                    <div class="forward-list">
                        ${forwardsHtml}
                    </div>
                `;
                detailItem.appendChild(detailInfo);
            }
        }
        // 特別な詳細情報がある場合は表示
        else if (option.details) {
            detailItem.innerHTML = `
                <span class="detail-name">${option.name}</span>
                <span class="detail-price">${formatCurrency(option.price)}</span>
                <div class="detail-info">${option.details}</div>
            `;
        }
        // 通常の表示
        else {
            detailItem.innerHTML = `
                <span class="detail-name">${option.name}</span>
                <span class="detail-price">${formatCurrency(option.price)}</span>
            `;
        }

        detailsContainer.appendChild(detailItem);
    }

    // 詳細表示コンテナを表示
    detailsContainer.classList.remove('hidden');
}

// 通貨フォーマットの関数
function formatCurrency(amount) {
    return '¥' + amount.toLocaleString();
}

// 送信ボタンの有効/無効を切り替える関数
function toggleSubmitButton() {
    const agreeTerms = document.getElementById('agree_terms');
    const submitButton = document.getElementById('submit-button');

    if (agreeTerms && submitButton) {
        submitButton.disabled = !agreeTerms.checked;
    }

    // 利用規約に同意した場合、計算を実行
    if (agreeTerms && agreeTerms.checked) {
        calculateTotal();
    }
}

// Excelエクスポート関数
function exportToExcel() {
    // SheetJSライブラリがなければCDNからロード
    if (typeof XLSX === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.onload = function() {
            generateExcel();
        };
        document.head.appendChild(script);
    } else {
        generateExcel();
    }
}

// Excel生成関数
function generateExcel() {
    // 顧客情報の取得
    const customerName = document.getElementById('customer_name').value;
    const companyName = document.getElementById('company_name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const currentUrl = document.getElementById('current_url').value;
    const desiredDate = document.getElementById('desired_date').value;

    // WordPress関連情報
    const wpAdminUrl = document.getElementById('wp_admin_url').value;
    const wpLoginId = document.getElementById('wp_login_id').value;
    const wpLoginPassword = document.getElementById('wp_login_password').value;
    const wpVersion = document.getElementById('wp_version').value;
    const phpVersion = document.getElementById('php_version').value;
    const siteSize = document.getElementById('site_size').value;

    // サーバーログイン情報
    const sourceServerLoginUrl = document.getElementById('source_server_login_url').value;
    const sourceServerLoginId = document.getElementById('source_server_login_id').value;
    const targetServerLoginUrl = document.getElementById('target_server_login_url').value;
    const targetServerLoginId = document.getElementById('target_server_login_id').value;

    // ドメイン管理情報
    const sourceDomainLoginUrl = document.getElementById('source_domain_login_url').value;
    const sourceDomainLoginId = document.getElementById('source_domain_login_id').value;
    const targetDomainLoginUrl = document.getElementById('target_domain_login_url').value;
    const targetDomainLoginId = document.getElementById('target_domain_login_id').value;

    // FTP情報
    const sourceFtpHost = document.getElementById('source_ftp_host').value;
    const sourceFtpId = document.getElementById('source_ftp_id').value;
    const targetFtpHost = document.getElementById('target_ftp_host').value;
    const targetFtpId = document.getElementById('target_ftp_id').value;

    // 見積り金額の取得
    const basicPrice = document.getElementById('basic-price').textContent;
    const siteSizePrice = document.getElementById('site-size-price').textContent;
    const serverPrice = document.getElementById('server-price').textContent;
    const domainPrice = document.getElementById('domain-price').textContent;
    const emailPrice = document.getElementById('email-price').textContent;
    const optionsPrice = document.getElementById('options-price').textContent;
    const subtotal = document.getElementById('subtotal').textContent;
    const tax = document.getElementById('tax').textContent;
    const grandTotal = document.getElementById('grand-total').textContent;

    // 現在の日時
    const now = new Date();
    const dateString = now.toLocaleDateString('ja-JP');

    // ワークブックとワークシートの作成
    const wb = XLSX.utils.book_new();

    // 顧客情報シート
    const customerData = [
        ['WordPress移転・移管サービス 見積書'],
        ['作成日', dateString],
        [''],
        ['顧客情報'],
        ['お名前', customerName],
        ['会社名', companyName],
        ['メールアドレス', email],
        ['電話番号', phone],
        [''],
        ['WordPress サイト情報'],
        ['現在のサイトURL', currentUrl],
        ['WordPress管理画面URL', wpAdminUrl],
        ['WordPress ログインID', wpLoginId],
        ['WordPress ログインパスワード', wpLoginPassword],
        ['WordPressバージョン', wpVersion],
        ['PHPバージョン', phpVersion],
        ['サイト容量 (GB)', siteSize],
        ['希望作業日', desiredDate],
        [''],
        ['サーバーログイン情報'],
        ['移転元サーバーログインURL', sourceServerLoginUrl],
        ['移転元サーバーID', sourceServerLoginId],
        ['移転先サーバーログインURL', targetServerLoginUrl],
        ['移転先サーバーID', targetServerLoginId],
        [''],
        ['ドメイン管理情報'],
        ['移管前ドメイン管理会社URL', sourceDomainLoginUrl],
        ['移管前ドメイン管理ID', sourceDomainLoginId],
        ['移管先ドメイン管理会社URL', targetDomainLoginUrl],
        ['移管先ドメイン管理ID', targetDomainLoginId],
        [''],
        ['FTP情報'],
        ['移転元FTPホスト', sourceFtpHost],
        ['移転元FTPID', sourceFtpId],
        ['移転先FTPホスト', targetFtpHost],
        ['移転先FTPID', targetFtpId],
        [''],
        ['見積り金額'],
        ['基本料金', basicPrice],
        ['サイト容量追加料金', siteSizePrice],
        ['サーバー移転料金', serverPrice],
        ['ドメイン関連料金', domainPrice],
        ['メール設定料金', emailPrice],
        ['オプションサービス料金', optionsPrice],
    ];

    // サイト容量の料金内訳
    const sizeFee = parseFloat(siteSize) || 0;
    if (sizeFee >= 2) {
        customerData.push(['']);
        customerData.push(['サイト容量追加料金の内訳:']);
        if (sizeFee >= 2 && sizeFee < 10) {
            customerData.push(['2GB以上10GB未満', '¥8,000']);
        } else if (sizeFee >= 10 && sizeFee < 20) {
            customerData.push(['10GB以上20GB未満', '¥13,000']);
        } else if (sizeFee >= 20 && sizeFee < 30) {
            customerData.push(['20GB以上30GB未満', '¥23,000']);
        } else {
            customerData.push(['30GB以上', '¥30,000']);
        }
    }

    // 選択したオプションの詳細をExcelに追加
    addOptionsToExcel(customerData, 'server', 'サーバー移転オプション');
    addOptionsToExcel(customerData, 'domain', 'ドメイン関連オプション');
    addOptionsToExcel(customerData, 'email', 'メール設定オプション');
    addOptionsToExcel(customerData, 'options', 'その他オプション');

    // メールアカウント情報を追加
    if (document.getElementById('email_account_count').value > 0) {
        customerData.push(['']);
        customerData.push(['メールアカウント情報:']);

        const accounts = document.querySelectorAll('.email-account');

        accounts.forEach((account, i) => {
            const index = i + 1;
            const emailAddress = account.querySelector(`#email_address_${index}`).value.trim() || `メールアカウント${index}`;

            customerData.push([`メールアドレス${index}`, emailAddress]);

            // 転送先情報を取得
            const forwardInputs = account.querySelectorAll(`input[id^="email_forward_${index}_"]`);
            let forwardCount = 0;

            forwardInputs.forEach((input, j) => {
                const forwardValue = input.value.trim();
                if (forwardValue !== '') {
                    forwardCount++;
                    customerData.push([`  転送先${forwardCount}`, forwardValue, '¥1,000']);
                }
            });
        });
    }

    // SNS拡散割引が適用されている場合
    if (document.getElementById('sns_discount').checked) {
        customerData.push(['SNS拡散割引 (5%)', document.getElementById('discount-value').textContent]);
    }

    customerData.push(
        ['小計', subtotal],
        ['消費税 (10%)', tax],
        ['合計金額', grandTotal]
    );

    const ws = XLSX.utils.aoa_to_sheet(customerData);

    // いくつかのセルのスタイル調整（列幅など）
    const wscols = [
        {wch: 30}, // A列の幅
        {wch: 40}  // B列の幅
    ];
    ws['!cols'] = wscols;

    // ワークブックに追加
    XLSX.utils.book_append_sheet(wb, ws, '見積書');

    // ファイルとして保存
    const fileName = `WordPress移転サービス見積書_${companyName || customerName}_${dateString.replace(/\//g, '')}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// 選択したオプションの詳細をExcelデータに追加する関数
function addOptionsToExcel(customerData, category, title) {
    const detailsContainer = document.getElementById(`${category}-details`);
    if (!detailsContainer) return;

    // 非表示またはオプションがない場合はスキップ
    if (detailsContainer.classList.contains('hidden') || detailsContainer.childElementCount === 0) {
        return;
    }

    // セクションタイトルを追加
    customerData.push(['']);
    customerData.push([title + ':']);

    // 各オプションを追加
    const detailItems = detailsContainer.querySelectorAll('.detail-item');
    detailItems.forEach(item => {
        const name = item.querySelector('.detail-name').textContent;
        const price = item.querySelector('.detail-price').textContent;

        // 通常のオプションを追加
        customerData.push([name, price]);

        // 転送先情報がある場合は追加
        const forwardList = item.querySelector('.forward-list');
        if (forwardList) {
            const forwardItems = forwardList.querySelectorAll('.forward-list-item');
            forwardItems.forEach(forwardItem => {
                customerData.push([`  ${forwardItem.textContent}`]);
            });
        }
    });
}

// フォームのバリデーション関数
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (field.value.trim() === '') {
            field.classList.add('invalid-input');
            isValid = false;

            // 最初の無効なフィールドを保存
            if (!firstInvalidField) {
                firstInvalidField = field;
            }

            // バリデーションメッセージを追加または表示
            let validationMessage = field.nextElementSibling;
            if (!validationMessage || !validationMessage.classList.contains('validation-message')) {
                validationMessage = document.createElement('div');
                validationMessage.className = 'validation-message';
                validationMessage.textContent = '入力必須項目です';
                field.parentNode.insertBefore(validationMessage, field.nextSibling);
            } else {
                validationMessage.classList.remove('hidden');
            }
        } else {
            field.classList.remove('invalid-input');

            // バリデーションメッセージを非表示
            const validationMessage = field.nextElementSibling;
            if (validationMessage && validationMessage.classList.contains('validation-message')) {
                validationMessage.classList.add('hidden');
            }
        }
    });

    // メールアドレス形式の検証
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value.trim() !== '' && !isValidEmail(field.value.trim())) {
            field.classList.add('invalid-input');
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = field;
            }

            // バリデーションメッセージを追加または表示
            let validationMessage = field.nextElementSibling;
            if (!validationMessage || !validationMessage.classList.contains('validation-message')) {
                validationMessage = document.createElement('div');
                validationMessage.className = 'validation-message';
                validationMessage.textContent = '有効なメールアドレスを入力してください';
                field.parentNode.insertBefore(validationMessage, field.nextSibling);
            } else {
                validationMessage.textContent = '有効なメールアドレスを入力してください';
                validationMessage.classList.remove('hidden');
            }
        }
    });

    // 最初の無効なフィールドにスクロール
    if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField.focus();
    }

    return isValid;
}

// メールアドレスの検証関数
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// メール転送設定の検証
function validateEmailForwarding() {
    const container = document.getElementById('email-accounts-container');
    const accounts = container.querySelectorAll('.email-account');
    let isValid = true;

    accounts.forEach((account, i) => {
        const index = i + 1;
        const emailAddress = account.querySelector(`#email_address_${index}`);

        // メインメールアドレスの検証
        if (emailAddress.value.trim() !== '' && !isValidEmail(emailAddress.value.trim())) {
            emailAddress.classList.add('invalid-input');
            isValid = false;
        } else {
            emailAddress.classList.remove('invalid-input');
        }

        // 転送先メールアドレスの検証
        const forwardInputs = account.querySelectorAll(`input[id^="email_forward_${index}_"]`);
        forwardInputs.forEach(input => {
            if (input.value.trim() !== '' && !isValidEmail(input.value.trim())) {
                input.classList.add('invalid-input');
                isValid = false;
            } else {
                input.classList.remove('invalid-input');
            }
        });
    });

    return isValid;
}

// 入力内容をローカルストレージに保存する関数
function saveProgress() {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            formData[input.id || input.name] = input.checked;
        } else {
            // パスワードフィールド以外の値を保存
            if (input.type !== 'password') {
                formData[input.id || input.name] = input.value;
            }
        }
    });

    localStorage.setItem('wpEstimateFormData', JSON.stringify(formData));
}

// 保存されたデータを読み込む関数
function loadSavedData() {
    const savedData = localStorage.getItem('wpEstimateFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);

        for (const key in formData) {
            const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (element && element.type !== 'password') {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = formData[key];

                    // ラジオボタンの「その他」が選択されている場合は関連フィールドを表示
                    if (element.value === 'other' && element.checked) {
                        const name = element.getAttribute('name');
                        const otherField = document.querySelector(`input[name="${name}_other"]`);
                        if (otherField) {
                            otherField.classList.remove('hidden');
                        }
                    }
                } else {
                    element.value = formData[key];
                }
            }
        }

        // メールアカウント入力欄を更新
        updateEmailAccounts();

        // サイト容量の料金を更新
        updateSiteSizePrice();

        // SNS拡散割引の表示/非表示を更新
        if (document.getElementById('sns_discount').checked) {
            document.getElementById('discount-row').style.display = 'flex';
        }
    }
}

// ツールチップの追加
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.dataset.tooltip;
        element.appendChild(tooltip);

        element.addEventListener('mouseenter', () => {
            tooltip.classList.add('visible');
        });

        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// ページ読み込み時にツールチップを追加
window.addEventListener('DOMContentLoaded', addTooltips);

// タッチイベント制御を追加
document.addEventListener('touchmove', function(e) {
    if (document.body.classList.contains('modal-open')) {
        e.preventDefault();
    }
}, { passive: false });
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
            showConfirmationPage(); // モーダルの代わりに確認ページを表示
        } else {
            alert('利用規約に同意してください');
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
    function copyEstimateText() {
        const textToCopy = document.getElementById('confirmation-content').innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('テキストをコピーしました');
        }).catch(err => {
            console.error('テキストのコピーに失敗しました:', err);
        });
    }

    // PDF出力機能
    function exportToPDF() {
        const element = document.getElementById('confirmation-content');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save('estimate.pdf');
        });
    }

    // イベントリスナーの設定
    document.getElementById('copy-text-button').addEventListener('click', copyEstimateText);
    document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
    document.getElementById('back-to-form-button').addEventListener('click', () => {
        document.getElementById('confirmation-page').style.display = 'none';
        document.getElementById('estimate-form').style.display = 'block';
    });

    // 見積もりテキストをコピーする関数
    function copyEstimateText() {
        const textToCopy = document.getElementById('confirmation-content').innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('テキストをコピーしました');
        }).catch(err => {
            console.error('テキストのコピーに失敗しました:', err);
        });
    }

    // PDF出力機能
    function exportToPDF() {
        const element = document.getElementById('confirmation-content');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save('estimate.pdf');
        });
    }

    // イベントリスナーの設定
    document.getElementById('copy-text-button').addEventListener('click', copyEstimateText);
    document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
    document.getElementById('back-to-form-button').addEventListener('click', () => {
        document.getElementById('confirmation-page').style.display = 'none';
        document.getElementById('estimate-form').style.display = 'block';
    });

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
    document.getElementById('confirmation-date-time').textContent = formattedDateTime;
    document.getElementById('estimate-number').textContent = Math.floor(Math.random() * 100000);
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
    const emailAccountElement = document.createElement('div');
    emailAccountElement.classList.add('email-account');

    emailAccountElement.innerHTML = `
        <h3>メールアカウント ${index}</h3>
        <label for="email_address_${index}">メールアドレス</label>
        <input type="email" id="email_address_${index}" name="email_address_${index}" placeholder="メールアドレスを入力してください">

        <label for="email_password_${index}">設定するパスワード</label>
        <input type="text" id="email_password_${index}" name="email_password_${index}" placeholder="パスワードを入力してください">

        <button type="button" class="remove-account" onclick="removeEmailAccount(${index})">×</button>
    `;

    return emailAccountElement;
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

        // 各入力フィールドのIDと名前を更新
        const inputs = account.querySelectorAll('input');
        inputs.forEach(input => {
            const idAttr = input.getAttribute('id');
            const nameAttr = input.getAttribute('name');
            if (idAttr) {
                const baseId = idAttr.split('_').slice(0, -1).join('_');
                input.setAttribute('id', `${baseId}_${index}`);
            }
            if (nameAttr) {
                const baseName = nameAttr.split('_').slice(0, -1).join('_');
                input.setAttribute('name', `${baseName}_${index}`);
            }
        });
    });
}

// 合計金額を計算する関数
function calculateTotal() {
    let total = 12000; // 基本料金
    let siteSizePrice = updateSiteSizePrice(); // サイト容量追加料金

    // サーバー関連オプション
    if (document.getElementById('wp_installation').checked) total += 3000;
    if (document.getElementById('plugin_migration').checked) total += 5000;
    if (document.getElementById('php_update').checked) total += 6000;
    if (document.getElementById('wp_update').checked) total += 6000;
    if (document.getElementById('multisite').checked) total += 4000;
    if (document.getElementById('ssh_migration').checked) total += 34000;
    if (document.getElementById('test_server').checked) total += 10000;
    if (document.getElementById('info_support_server').checked) total += 10000;

    // メール関連オプション
    if (document.getElementById('spf_settings').checked) total += 3000;
    if (document.getElementById('dkim_settings').checked) total += 3000;
    if (document.getElementById('dmarc_settings').checked) total += 3000;

    // ドメイン関連オプション
    if (document.getElementById('domain_transfer').checked) total += 10000;
    if (document.getElementById('domain_dns').checked) total += 12000;
    if (document.getElementById('domain_change').checked) total += 4000;
    if (document.getElementById('domain_redirect').checked) total += 5000;
    if (document.getElementById('ssl_setup').checked) total += 5000;
    if (document.getElementById('ssl_fix').checked) total += 10000;
    if (document.getElementById('www_unification').checked) total += 3000;
    if (document.getElementById('dns_settings').checked) total += 12000;

    // その他オプション
    if (document.getElementById('google_analytics').checked) total += 5000;
    if (document.getElementById('google_search_console').checked) total += 3000;
    if (document.getElementById('recaptcha').checked) total += 3000;
    if (document.getElementById('sitemap').checked) total += 3000;
    if (document.getElementById('backup_storage').checked) total += 5000;

    // メールアカウント関連
    const emailAccountCount = parseInt(document.getElementById('email_account_count').value) || 0;
    total += emailAccountCount * 1000;

    // 転送先関連
    const forwardDestinations = document.querySelectorAll('.forward-destination');
    total += forwardDestinations.length * 1000;

    // サイト容量追加料金を加算
    total += siteSizePrice;

    // SNS拡散割引
    if (document.getElementById('sns_discount').checked) {
        const discount = total * 0.05;
        total -= discount;
        document.getElementById('discount-value').textContent = formatCurrency(discount);
    }

    // 小計、消費税、合計金額を表示
    const subtotal = total;
    const tax = subtotal * 0.1;
    const grandTotal = subtotal + tax;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('grand-total').textContent = formatCurrency(grandTotal);
}

// 通貨形式にフォーマットする関数
function formatCurrency(amount) {
    return '¥' + amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }).replace('¥', '');
}

// フォームの検証を行う関数
function validateForm() {
    let isValid = true;

    // 必須項目の検証
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// メール転送設定の検証を行う関数
function validateEmailForwarding() {
    let isValid = true;

    // メールアカウントごとに転送先を検証
    const emailAccounts = document.querySelectorAll('.email-account');
    emailAccounts.forEach(account => {
        const forwardDestinations = account.querySelectorAll('.forward-destination input');
        forwardDestinations.forEach(destination => {
            if (destination.value.trim() && !validateEmail(destination.value)) {
                isValid = false;
                destination.classList.add('error');
            } else {
                destination.classList.remove('error');
            }
        });
    });

    return isValid;
}

// メールアドレスの形式を検証する関数
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// showConfirmationPage関数の修正
function showConfirmationPage() {
    // フォームを非表示にし、確認ページを表示
    document.getElementById('estimate-form').style.display = 'none';
    document.getElementById('confirmation-page').style.display = 'block';

    // 見積もりテキストを生成して表示
    const estimateText = generateEstimateText();
    document.getElementById('confirmation-content').innerHTML = estimateText.replace(/\n/g, '<br>');

    // 日付と見積番号を設定
    updateDateTime();

    // スクロールトップに
    window.scrollTo(0, 0);
}

// テキストコピー機能の修正
document.getElementById('copy-text-button').addEventListener('click', function() {
    const textToCopy = document.getElementById('confirmation-content').innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('テキストをコピーしました');
    }).catch(err => {
        console.error('テキストのコピーに失敗しました:', err);
    });
});

// 日付と見積番号を設定する関数
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
    document.getElementById('confirmation-date-time').textContent = formattedDateTime;
    document.getElementById('estimate-number').textContent = Math.floor(Math.random() * 100000);
}
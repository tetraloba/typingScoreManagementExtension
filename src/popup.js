/* データベースに記録されたタイピング結果をCSVファイルにしてダウンロードする */
function getCSV() {
    /* chrome.storage.localの内容を取得 */
    chrome.storage.local.get(null, function (data) {
        let str_blob = '';
        const allValues = Object.values(data);
        for (const v of allValues) {
            str_blob += v + "\n";
        }
        /* BlobとそのURLを作成してダウンロードを実行 */
        const bom  = new Uint8Array([0xEF, 0xBB, 0xBF]); // utf-8 BOM
        const str_url = URL.createObjectURL(new Blob([bom, str_blob], {type: "text/csv"})); // URLの生成
        chrome.downloads.download({
            url: str_url,
            filename: 'result.csv',
            // saveAs: true // 名前をつけて保存
        });
    });
}
/* textAreaに入力されたCSV形式の結果をデータベースに登録する */
function pushCSV() {
    // 文字列の形式が不正だった場合などの例外処理を一切していない #todo
    let csv_text = document.getElementById('result_csv').value;
    for (let line of csv_text.split('\n')) { // \r(キャリッジリターン)の対策は必要？ #todo
        if (line.length < 8) {
            continue; // 空行など、文字数が少なすぎる場合は処理しない
        }
        let date_text = line.substr(0, line.indexOf(',')).replaceAll('"', ''); // 日時を表す文字列"yyyy/mm/dd HH:MM:SS"を取得
        const year = parseInt(date_text.substr(0, 4));
        const month = parseInt(date_text.substr(5, 7)) - 1;
        const day = parseInt(date_text.substr(8, 10));
        const hours = parseInt(date_text.substr(11, 13));
        const minutes = parseInt(date_text.substr(14, 16));
        const seconds = parseInt(date_text.substr(17, 19));
        // console.log(year, month, day, hours, minutes, seconds); // debug
        const dd = new Date(year, month, day, hours, minutes, seconds);
        // console.log(dd.getTime()); // debug
        // console.log(line); // debug
        /* chrome.storage.localに記録する */
        chrome.storage.local.set({[dd.getTime()] : line}).then(() => {
            console.log("Value is set to " + line);
        });
    }
}
/* データベースに保存された内容をconsoleに表示する */
function showDB() {
    chrome.storage.local.get(null, ((data) => {console.log(data)}));
}
/* データベースに保存された記録を全て削除(リセット)する */
function clearDB() {
    /* clearDB_button を隠す */
    const clearDB_button = document.getElementById('clearDB_button');
    clearDB_button.hidden = true;
    /* 確認メッセージを表示 */
    const message_text = document.getElementById('message_text');
    message_text.textContent = "All typing records in the database are deleted and cannot be recovered.\n Are you sure you want to delete them? (Y/n)";
    /* ユーザのプロンプト入力用textAreaの表示 */
    const prompt = document.getElementById('prompt');
    prompt.hidden = false;
    /* confirm_button の表示 */
    const confirm_button = document.getElementById('confirm_button');
    confirm_button.hidden = false;
    /* cancel_button の表示 */
    const cancel_button = document.getElementById('cancel_button');
    cancel_button.hidden = false;
    /* confirm_button を押した時の処理 */
    confirm_button.addEventListener('click', function () {
        let confirmation = prompt.value.trim();
        if (confirmation && confirmation == 'Y') {
            console.log('Database has been cleared.'); // debug
            message_text.textContent = 'Database has been cleared.';
            /* 実際にデータベースをクリアする処理 */
            chrome.storage.local.clear();
        } else {
            console.log('Database is not cleared. (cancelled)'); // debug
            message_text.textContent = 'Database is not cleared. (cancelled)';
        }
        prompt.hidden = true;
        confirm_button.hidden = true;
        cancel_button.hidden = true;
        /* clearDB_button を再表示 */
        clearDB_button.hidden = false;
    })
    /* cancel_button を押した時の処理 */
    cancel_button.addEventListener('click', function () {
        document.getElementById('message_text').textContent = "cancelled.";
        prompt.hidden = true;
        confirm_button.hidden = true;
        cancel_button.hidden = true;
        /* clearDB_button を再表示 */
        clearDB_button.hidden = false;
    })

}

/* main */
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM contents loaded!"); // debug
    /* ダウンロード(エクスポート)ボタンの動作を登録 */
    document.getElementById('dl_button').addEventListener('click', function () {
        console.log('download button clicked!'); // debug
        getCSV();
    })
    /* インポートボタンの動作を登録 */
    document.getElementById('push_button').addEventListener('click', function () {
        console.log('import button clicked!'); //debug
        pushCSV();
    })
    /* データベース表示ボタンの動作を登録 */
    document.getElementById('showDB_button').addEventListener('click', function () {
        console.log('show DB button clicked!'); //debug
        showDB();
    })
    /* データベース削除(リセット)ボタンの動作を登録 */
    document.getElementById('clearDB_button').addEventListener('click', function () {
        console.log('clear DB button clicked!'); //debug
        clearDB();
    })
})

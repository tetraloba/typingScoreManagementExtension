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

/* main */
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM contents loaded!"); // debug
    /* ダウンロード(エクスポート)ボタンの動作を登録 */
    document.getElementById('dl_button').addEventListener('click', function () {
        console.log('download button clicked!'); // debug
        getCSV();
    })
})

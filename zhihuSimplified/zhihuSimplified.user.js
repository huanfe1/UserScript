// ==UserScript==
// @name         知乎宽屏
// @namespace    https://ixory.com
// @version      1.0.2
// @description  将网页主体部分变宽，去除杂冗部分
// @author       huanfei
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// ==/UserScript==

(function () {
    var url = window.location.href;
    var style = '';

    switch (url.split('.')[0].split('/')[2]) {
        case 'www':
            switch (url.split('/')[3].split('?')[0]) {
                case 'follow':
                case 'hot':
                case 'zvideo':
                case '':
                    console.log('首页');
                    homePage();
                    break;
                case 'question':
                    console.log('问题页');
                    questionPage();
                    break;
                case 'people':
                    console.log('个人主页');
                    peoplePage();
                    break;
                case 'collection':
                    console.log('收藏夹');
                    collectionPage();
                    break;
                case 'search':
                    console.log('搜索页');
                    searchPage();
                    break;
                case 'topic':
                    console.log('话题页');
                    topicPage();
                    break;
                case 'notifications':
                    console.log('通知页');
                    notice();
                    break;
            }
            break;
        case 'zhuanlan':
            console.log('专栏页');
            columnPage();
            break;
        case 'link':
            console.log('第三方跳转页面');
            linkPage();
            break;
    }

    console.log(style);
    GM_addStyle(style);

    function homePage() {
        style += '.Topstory-mainColumn{width:inherit}';
        style += '.Topstory>div:not([class]){display:none}';
        style += '.Topstory-container > div:nth-child(2){display:none}';
        style += '.css-yhjwoe{justify-content:space-between;}';
        style += '.css-yhjwoe > div{margin: 0}';
    }

    function searchPage() {
        style += '.SearchMain{width:inherit;}';
        style += '.css-knqde{display:none}';
    }

    function questionPage() {
        style += '.Question-sideColumn{display:none;}';
        style += '.Question-mainColumn, .ListShortcut{width:inherit;}';
        style += 'button.FollowButton{display:none;}';
        style += '.QuestionWaiting > div:nth-child(1){width:inherit;}';
        style += '.QuestionWaiting > div:nth-child(2){display:none}';
    }

    function collectionPage() {
        style += `.CollectionsDetailPage-mainColumn{width:inherit;}`;
        style += '.CollectionsDetailPage > div:nth-child(2){min-width:20%}';
    }

    function peoplePage() {
        style += '.Profile-mainColumn{width:inherit;}';
        style += '.Profile-sideColumn{display:none;}';
        style += '.AuthorInfo-Widget{display:none;}';
    }

    function topicPage() {
        style += '.App-main > div > div:nth-child(1){width:inherit;}';
        style += '.App-main > div > div:nth-child(2){display:none;}';
    }

    function columnPage() {
        style += '.css-1f6hmyt{width:100%;}';
    }

    function notice() {
        style += 'main > div > div:nth-child(1){width:inherit;}';
        style += 'main > div > div:nth-child(2){display:none}';
    }

    function linkPage() {
        let trueURL = new URL(window.location.href).searchParams.get('target');
        window.location.href = trueURL;
    }

    // 去除外链限制
    document.addEventListener('click', () => {
        document.querySelectorAll("a.external:not([class~='modify'])").forEach(e => {
            let trueURL = new URL(e.href).searchParams.get('target');
            e.href = trueURL;
            e.classList.add('modify');
        });
    });
})();

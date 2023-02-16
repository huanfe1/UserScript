// ==UserScript==
// @name         知乎宽屏
// @namespace    https://ixory.com
// @version      1.0.3
// @description  将网页主体部分变宽，去除杂冗部分
// @author       huanfei
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_addStyle
// @license      MIT License
// @run-at       document-start
// ==/UserScript==

(function () {
    var url = window.location.href;
    var style = '.origin_image{max-width:50% !important}';

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

    GM_addStyle(style);

    function homePage() {
        style += '.Topstory-mainColumn{width:inherit}';
        style += '.Topstory>div:not([class]){display:none}';
        style += '.Topstory-container > div:nth-child(2){display:none}';
        style += '.css-yhjwoe{justify-content:space-between;}';
        style += '.css-yhjwoe > div{margin: 0}';
        document.onreadystatechange = function () {
            if (document.querySelector('.Topstory>div:not([class])')) {
                document.querySelector('.Topstory>div:not([class]) svg').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
        };
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
        window.location.replace(trueURL);
    }

    // 去除外链限制
    document.addEventListener('click', e => {
        document.querySelectorAll("a.external:not([class~='modify'])").forEach(e => {
            let trueURL = new URL(e.href).searchParams.get('target');
            e.href = trueURL;
            e.classList.add('modify');
        });
        if (e.target.className == 'css-18hmmtu') {
            document.querySelector('.css-19q29v6 .Button.css-1x9te0t').click();
        }
    });

    window.onload = () => {
        GM_addStyle('.CornerAnimayedFlex{height:130px}.CornerAnimayedFlex--hidden{height:0}.Button.fold.css-gdd4kf{margin-top:10px;transform:rotate(90deg)}');
        const foldButton = document.createElement('button');
        foldButton.className = 'Button fold css-gdd4kf';
        foldButton.setAttribute('aria-label', '全部折叠');
        foldButton.setAttribute('data-tooltip', '全部折叠');
        foldButton.setAttribute('data-tooltip-position', 'left');
        foldButton.innerHTML =
            '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" class="Zi Zi--BackToTop" fill="currentColor"><path fill-rule="evenodd" d="M13.204 3.107a1.75 1.75 0 0 0-2.408 0L3.806 9.73c-1.148 1.088-.378 3.02 1.204 3.02h2.24V20c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 16.75 20v-7.25h2.24c1.582 0 2.353-1.932 1.204-3.02l-6.99-6.623Z" clip-rule="evenodd"></path></svg>';
        document.querySelector('#root > div > div:nth-child(6) > div > div').append(foldButton);
        foldButton.addEventListener('click', () => {
            document.querySelectorAll('span.RichContent-collapsedText').forEach(el => {
                el.click();
            });
            document.querySelectorAll('.Zi.Zi--Comment.Button-zi').forEach(el => {
                const button = el.parentElement.parentElement;
                if (button.textContent == '​收起评论') button.click();
            });
        });
    };
})();

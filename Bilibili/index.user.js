// ==UserScript==
// @name         B站简化
// @namespace    https://huanfei.top/
// @version      1.0.7
// @description  简化B站
// @author       huanfei
// @match        *.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT License
// @run-at       document-start
// ==/UserScript==

(function () {
    const autoLike = false;
    const url = window.location.href;
    switch (url.split('.')[0].split('/')[2]) {
        case 'www':
            switch (url.split('/')[3].split('?')[0]) {
                case '':
                    console.log('首页');
                    homePage();
                    break;
                case 'video':
                    console.log('视频播放页');
                    videoPlayPage();
                    break;
                case 'read':
                    console.log('专栏页');
                    readPage();
                    break;
            }
            break;
        case 't':
            console.log('动态');
            dynamicPage();
            break;
        case 'space':
            console.log('个人空间');
            spacePage();
            break;
        case 'search':
            console.log('搜索页');
            searchPage();
            break;
    }

    {
        hideDom(['.bili-dyn-item__interaction', '.bili-dyn-item__ornament', '.bili-dyn-list__item:has(.bili-rich-text-module.lottery)']);
    }

    function homePage() {
        hideDom(['.adblock-tips', '.bili-video-card:has(.bili-video-card__info--ad)']);
    }

    function dynamicPage() {
        hideDom(['.bili-avatar-pendent-dom', 'aside.right .sticky', '.sailing', '.medal', '.nameplate', '.notice-item', '.reply-notice']);
    }

    function videoPlayPage() {
        hideDom([
            '.bili-avatar-pendent-dom',
            '.reply-decorate',
            '.pop-live-small-mode',
            '.activity-m-v1',
            '.attention',
            '.bpx-player-cmd-dm-wrap',
            '.reply-notice',
            '.ad-report',
            '.fan-badge',
            '.reply-tag-list',
            '.video-page-special-card-small',
            'originalFan',
            '.reply-item:has(.image-exhibition)',
        ]);

        // 删去投票弹窗弹幕
        let keyword = ['1', '2', '3', '4', '5'];
        let timer = setInterval(function () {
            if (document.querySelectorAll('.bpx-player-popup > *').length != 0) {
                document.querySelectorAll('.bpx-player-popup-vote-an-text-doc').forEach(e => {
                    keyword.push(e.innerHTML);
                });
                clearInterval(timer);
            }
        });

        setInterval(function () {
            let danmaku = document.querySelectorAll('.b-danmaku');
            danmaku.forEach(e => {
                if (keyword.includes(e.innerHTML) && !e.classList.contains('b-danmaku-hide')) {
                    e.classList.add('b-danmaku-hide');
                }
            });
        });
    }

    function readPage() {
        // 专栏去除复制小尾巴
        window.addEventListener('copy', e => e.stopPropagation(), true);
    }

    function spacePage() {
        hideDom(['.reply-notice']);
    }

    function searchPage() {
        hideDom(['.video-list > div:has(.bili-video-card__info--ad)']);
    }

    function hideDom(element) {
        GM_addStyle(element.map(e => `${e}{display:none !important;}`).join(''));
    }
})();

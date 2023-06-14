// ==UserScript==
// @name         B站简化
// @namespace    https://huanfei.top/
// @version      1.0.5
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

        // 观看时间超过进度条的 95% 自动点赞
        if (autoLike) {
            console.log('开启自动点赞');
            domReady('video', () => {
                const video = document.querySelector('video');
                const like = document.querySelector('.toolbar-left .like:not(.on)');
                let num = 0;
                let timer = setInterval(() => {
                    // 跳过时长少于30秒的视频
                    if (video.duration <= 30 || document.querySelector('.toolbar-left .like.on')) clearInterval(timer);
                    if (!video.paused) num++;
                    if (num / video.duration >= 0.95) {
                        console.log('观看时长已到达视频时长的95%，执行点赞操作');
                        like.click();
                        clearInterval(timer);
                    }
                }, 1000);
            });
        }
    }

    function readPage() {
        // 专栏去除复制小尾巴
        window.addEventListener(
            'copy',
            function (e) {
                e.stopPropagation();
            },
            true
        );
    }

    function spacePage() {
        hideDom(['.reply-notice']);
    }

    function searchPage() {
        hideDom(['.video-list > div:has(.bili-video-card__info--ad)']);
    }

    function hideDom(element) {
        let style = '';
        element.forEach(function (e) {
            style += `${e}{display:none !important;}`;
        });
        GM_addStyle(style);
    }

    /**
     * 监听某元素加载后执行函数
     * @param {string} select 元素选择器
     * @param {*} func 执行函数
     */
    function domReady(select, func) {
        let timer = setInterval(() => {
            if (document.querySelector(select)) {
                func();
                clearInterval(timer);
            }
        });
    }
})();

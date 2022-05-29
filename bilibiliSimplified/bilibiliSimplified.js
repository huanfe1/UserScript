// ==UserScript==
// @name         B站简化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简化B站
// @author       huanfei
// @match        *.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      WTFPL
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    var url = window.location.href;

    var style = '';
    var style_Add = document.createElement('style');

    if (url.split("/")[2] == 'www.bilibili.com') {

        switch (url.split("/")[3]) {
            case "":
                console.log("首页")
                homePage();
                break
            case "video":
                console.log("播放页")
                videoPlay();
                break
            case "read":
                console.log('文章页');
                readPage();
                break

        }
    } else if (url.split("/")[2] == 't.bilibili.com') {
        console.log("动态")
        dynamic();
    }


    if (document.lastChild) {
        document.lastChild.appendChild(style_Add).textContent = style;
    } else {
        let timer = setInterval(function () {
            if (document.lastChild) {
                clearInterval(timer);
                document.lastChild.appendChild(style_Add).textContent = style;
            }
        });
    }


    function homePage() {
        style += '.recommended-swipe{display:none;}';
        style += '.recommend-container__2-line>*:nth-of-type(1n + 8){display:block !important;}';
        style += '.eva-banner{display:none}'; // 去除广告横幅
        style += '.bili-grid:nth-child(3){display:none}'; // 去除推广
    }

    function dynamic() {
        // 精选评论
        style += '.bili-dyn-item__interaction{display:none;}';
        // 右上角贴纸
        style += '.bili-dyn-item__ornament{display:none;}';
        // 头像边框
        style += '.bili-avatar-pendent-dom{display:none;}';
        // 右上角按钮
        style += '.bili-dyn-item__more{display:none;}'
    }

    function videoPlay() {
        // 提示弹窗
        style += '.bilibili-player-video-inner{display:none}';
        // 播放页关注按钮
        style += '.bilibili-player .bilibili-player-area .bilibili-player-video-wrap .bilibili-player-video-top-follow{display:none;}'
    }

    function readPage() {
        // 专栏去除复制小尾巴
        window.onload = function () {
            [...document.querySelectorAll('*')].forEach(item => {
                item.oncopy = function (e) {
                    e.stopPropagation();
                }
            });
        }
    }
})();
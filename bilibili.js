// ==UserScript==
// @name         B站简化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简化B站
// @author       huanfei
// @match        *.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      WTFPL
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;

    var style = '';
    var style_Add = document.createElement('style');

    switch (url.split("/")[2]) {
        case "t.bilibili.com":
            console.log("动态")
            dynamic();
            break
        case "www.bilibili.com":
            console.log("首页")
            homePage();
            break
    }




    if (document.lastChild) {
        document.lastChild.appendChild(style_Add).textContent = style;
    } else {
        let timer = setInterval(function() {
            if (document.lastChild) {
                clearInterval(timer);
                document.lastChild.appendChild(style_Add).textContent = style;
            }
        });
    }


    function homePage() {
        style += '.recommended-swipe{display:none;}';
        style += '.recommend-container__2-line>*:nth-of-type(1n + 8){display:block !important;}';
        style += '.eva-banner{display:none}' // 去除广告横幅
        style += '.bili-grid:nth-child(3){display:none}' // 去除推广
    }

    function dynamic() {
        style += '.bili-dyn-item__interaction{display:none;}'
        style += '.bili-dyn-item__ornament{display:none;}'
        style += '.bili-avatar-pendent-dom{display:none;}'
    }

})();
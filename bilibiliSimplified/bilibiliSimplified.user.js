// ==UserScript==
// @name         B站简化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  简化B站
// @author       huanfei
// @match        *.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      WTFPL
// @run-at       document-start
// ==/UserScript==

(function () {
    "use strict";
    var url = window.location.href;

    var style = "";

    if (url.split("/")[2] == "www.bilibili.com") {
        switch (url.split("/")[3]) {
            case "":
                console.log("首页");
                homePage();
                break;
            case "video":
                console.log("播放页");
                videoPlay();
                break;
            case "read":
                console.log("文章页");
                readPage();
                break;
        }
    } else if (url.split("/")[2] == "t.bilibili.com") {
        console.log("动态");
        dynamic();
    }

    GM_addStyle(style);

    function homePage() {
        style +=
            ".bili-grid:nth-child(3), .bili-grid:nth-child(4){display:none}"; // 去除推广
        // style += ".battle-area{display:none}"
        //去除广告
        style += ".eva-banner{display:none}";
    }

    function dynamic() {
        // 精选评论
        style += ".bili-dyn-item__interaction{display:none;}";
        // 右上角贴纸
        style += ".bili-dyn-item__ornament{display:none;}";
        // 头像边框
        style += ".bili-avatar-pendent-dom{display:none;}";
        // 右上角按钮
        style += ".bili-dyn-item__more{display:none;}";
    }

    function videoPlay() {
        // 提示弹窗
        style += ".bilibili-player-video-inner{display:none}";
        // 播放页关注按钮
        style += ".bilibili-player-video-top-follow{display:none !important;}";
        // 广告
        style += ".ad-report{display:none !important}";
        // 头像框
        style += ".bili-avatar-pendent-dom{display:none;}";
        // 右上角贴纸
        style += ".reply-decorate{display:none;}";
        // 粉丝牌
        style += ".fan-badge{display:none !important;}";
        // 大家都围观的直播
        style += ".pop-live-small-mode{display:none;}";
        // 活动
        style += ".activity-m-v1{display:none;}";

        let removeElectric = () => {
            document.querySelector(".bilibili-player-electric-panel").remove();
            console.log("删除充电页面");
        };
        if (document.querySelector(".bilibili-player-electric-panel")) {
            removeElectric();
        } else {
            let timer = setInterval(function () {
                if (document.querySelector(".bilibili-player-electric-panel")) {
                    removeElectric();
                    clearInterval(timer);
                }
            });
        }
    }

    function readPage() {
        // 专栏去除复制小尾巴
        window.onload = function () {
            [...document.querySelectorAll("*")].forEach((item) => {
                item.oncopy = function (e) {
                    e.stopPropagation();
                };
            });
        };
    }
})();

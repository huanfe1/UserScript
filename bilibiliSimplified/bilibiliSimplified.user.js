// ==UserScript==
// @name         B站简化
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  简化B站
// @author       huanfei
// @match        *.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      app.bilibili.com
// @connect      api.bilibili.com
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
        style += ".bili-grid:nth-child(3), .bili-grid:nth-child(4){display:none}"; // 去除推广
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
        // 右边话题
        style += "aside.right .sticky{display:none;}";

        if (document.querySelector("aside.right")) {
            setRecommend();
            addRecommend();
        } else {
            let timer = setInterval(function () {
                if (document.querySelector("aside.right")) {
                    clearInterval(timer);
                    setRecommend();
                    addRecommend();
                }
            });
        }
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

        setInterval(function () {
            if (document.querySelector(".bilibili-player-electric-panel")) {
                removeElectric();
            }
        });
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

    function setRecommend() {
        let style = `.bilibili_recommend{margin-bottom:8px;padding:10px;border-radius:5px;background-color:#ffffff}
        .bilibili_recommend a{position:relative;display:inline-flex}
        .bilibili_recommend a img{width:100%;border-radius:5px}
        .bilibili_recommend_text{margin-top:5px;padding:0 5px;transition:color 0.2s}
        .bilibili_recommend_text:hover{color:#00aeec}
        .bilibili_recommend_button{padding:13px 0;border-radius:5px;background-color:#ffffff;text-align:center;cursor:pointer}
        .bilibili_recommend_button:hover{color:#00aeec}
        .recommend_info{display:flex;margin-top:5px}
        .playinfo{display:flex;align-items:center;margin-left:5px;color:#9499a0;font-size:14px;transition:color 0.2s}
        a.playinfo:hover{color:#00aeec}
        .playinfo svg{margin-right:5px;height:100%}
        .preview_pic{position:absolute;top:0;width:100%;height:-moz-available;height:-webkit-fill-available}
        .timeshow{position:absolute;bottom:0;padding:7px;color:#ffffff;font-size:13px}
        .recommend_switch{margin:0 15px 0 auto;display:flex;align-items:center}
        .recommend_switch p{font-size:14px;color:#6d757a}
        .switch-button{width:35px;height:20px;background:#9499A0;cursor:pointer;border-radius:10px;margin-left:15px;position:relative}
        .switch-button::before{content:"";position:absolute;top:2px;left:3px;border-radius:100%;width:16px;height:16px;background-color:#fff;transition:all .2s}
        .switch-button.on{background:#00a1d6}
        .switch-button.on::before{left:16px}`;
        GM_addStyle(style);

        let content = document.createElement("div");
        content.id = "bilibili_rec";
        document.querySelector("aside.right").appendChild(content);

        let buttonRefsh = document.createElement("div");
        buttonRefsh.innerHTML = "点击加载更多";
        buttonRefsh.className = "bilibili_recommend_button";
        buttonRefsh.onclick = addRecommend;
        document.querySelector("aside.right").appendChild(buttonRefsh);

        let recommend_switch = document.createElement("div");
        recommend_switch.className = "recommend_switch";
        recommend_switch.innerHTML = `
        <p>推荐视频</p><span class="switch-button ${GM_getValue("recommend_status") ? "on" : ""}"></span>
        `;
        document.querySelector(".bili-dyn-list-tabs__list").appendChild(recommend_switch);
        let button = recommend_switch.querySelector(".switch-button");
        button.onclick = function () {
            if (button.classList.contains("on")) {
                button.classList.remove("on");
                GM_setValue("recommend_status", false);
            } else {
                button.classList.add("on");
                GM_setValue("recommend_status", true);
            }
            recommendShow();
        };
        recommendShow();
        function recommendShow() {
            if (button.classList.contains("on")) {
                document.getElementById("bilibili_rec").style.display = "block";
                document.querySelector(".bilibili_recommend_button").style.display = "block";
            } else {
                document.getElementById("bilibili_rec").style.display = "none";
                document.querySelector(".bilibili_recommend_button").style.display = "none";
            }
        }
    }

    var recommend_num = 0;
    function addRecommend() {
        recommend_num += 1;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.bilibili.com/x/web-interface/index/top/rcmd",
            data: JSON.stringify({
                fresh_type: 3,
                version: 1,
                ps: 10,
                fresh_idx: recommend_num,
                fresh_idx_1h: recommend_num,
                homepage_ver: 1,
            }),
            onload: function (response) {
                let text1 = JSON.parse(response.responseText);
                var items = text1.data.item;
                items.forEach(function (e) {
                    let text = `
                    <a href="${e.uri}" target="_blank">
                        <img src="${e.pic}" alt="${e.title}" title="${e.title}">
                        <div class="preview_pic"></div>
                        <div class="timeshow">${timeConversion(e.duration)}</div>
                    </a>
                    <div class="bilibili_recommend_text"><a href="${e.uri}">${e.title}</a></div>
                    <div class="recommend_info">
                        <a href="https://space.bilibili.com/${e.owner.mid}" class="playinfo" target="_blank">
                            <svg width="18" height="16" viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 2.0625C6.85812 2.0625 4.98983 2.1725 3.67735 2.2798C2.77861 2.35327 2.08174 3.04067 2.00119 3.93221C1.90388 5.00924 1.8125 6.43727 1.8125 8C1.8125 9.56273 1.90388 10.9908 2.00119 12.0678C2.08174 12.9593 2.77861 13.6467 3.67735 13.7202C4.98983 13.8275 6.85812 13.9375 9 13.9375C11.1421 13.9375 13.0105 13.8275 14.323 13.7202C15.2216 13.6467 15.9184 12.9595 15.9989 12.0682C16.0962 10.9916 16.1875 9.56386 16.1875 8C16.1875 6.43614 16.0962 5.00837 15.9989 3.9318C15.9184 3.04049 15.2216 2.3533 14.323 2.27983C13.0105 2.17252 11.1421 2.0625 9 2.0625ZM3.5755 1.03395C4.9136 0.924562 6.81674 0.8125 9 0.8125C11.1835 0.8125 13.0868 0.924583 14.4249 1.03398C15.9228 1.15645 17.108 2.31588 17.2438 3.81931C17.3435 4.92296 17.4375 6.38948 17.4375 8C17.4375 9.61052 17.3435 11.077 17.2438 12.1807C17.108 13.6841 15.9228 14.8436 14.4249 14.966C13.0868 15.0754 11.1835 15.1875 9 15.1875C6.81674 15.1875 4.9136 15.0754 3.5755 14.966C2.07738 14.8436 0.892104 13.6838 0.756256 12.1803C0.656505 11.0762 0.5625 9.60942 0.5625 8C0.5625 6.39058 0.656505 4.92379 0.756257 3.81973C0.892104 2.31616 2.07738 1.15643 3.5755 1.03395ZM4.41663 4.93726C4.72729 4.93726 4.97913 5.1891 4.97913 5.49976V8.62476C4.97913 9.34963 5.56675 9.93726 6.29163 9.93726C7.0165 9.93726 7.60413 9.34963 7.60413 8.62476V5.49976C7.60413 5.1891 7.85597 4.93726 8.16663 4.93726C8.47729 4.93726 8.72913 5.1891 8.72913 5.49976V8.62476C8.72913 9.97095 7.63782 11.0623 6.29163 11.0623C4.94543 11.0623 3.85413 9.97095 3.85413 8.62476V5.49976C3.85413 5.1891 4.10597 4.93726 4.41663 4.93726ZM10.2501 4.93726C9.9394 4.93726 9.68756 5.1891 9.68756 5.49976V10.4998C9.68756 10.8104 9.9394 11.0623 10.2501 11.0623C10.5607 11.0623 10.8126 10.8104 10.8126 10.4998V9.60392H12.2292C13.5179 9.60392 14.5626 8.55925 14.5626 7.27059C14.5626 5.98193 13.5179 4.93726 12.2292 4.93726H10.2501ZM12.2292 8.47892H10.8126V6.06226H12.2292C12.8966 6.06226 13.4376 6.60325 13.4376 7.27059C13.4376 7.93793 12.8966 8.47892 12.2292 8.47892Z"></path></svg>
                            <span class="name">${e.owner.name}</span>
                        </a>
                        <div class="playinfo" title=${e.stat.view}>
                            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="play"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.67735 2.2798C4.98983 2.1725 6.85812 2.0625 9 2.0625C11.1421 2.0625 13.0105 2.17252 14.323 2.27983C15.2216 2.3533 15.9184 3.04049 15.9989 3.9318C16.0962 5.00837 16.1875 6.43614 16.1875 8C16.1875 9.56386 16.0962 10.9916 15.9989 12.0682C15.9184 12.9595 15.2216 13.6467 14.323 13.7202C13.0105 13.8275 11.1421 13.9375 9 13.9375C6.85812 13.9375 4.98983 13.8275 3.67735 13.7202C2.77861 13.6467 2.08174 12.9593 2.00119 12.0678C1.90388 10.9908 1.8125 9.56273 1.8125 8C1.8125 6.43727 1.90388 5.00924 2.00119 3.93221C2.08174 3.04067 2.77861 2.35327 3.67735 2.2798ZM9 0.8125C6.81674 0.8125 4.9136 0.924562 3.5755 1.03395C2.07738 1.15643 0.892104 2.31616 0.756257 3.81973C0.656505 4.92379 0.5625 6.39058 0.5625 8C0.5625 9.60942 0.656505 11.0762 0.756256 12.1803C0.892104 13.6838 2.07738 14.8436 3.5755 14.966C4.9136 15.0754 6.81674 15.1875 9 15.1875C11.1835 15.1875 13.0868 15.0754 14.4249 14.966C15.9228 14.8436 17.108 13.6841 17.2438 12.1807C17.3435 11.077 17.4375 9.61052 17.4375 8C17.4375 6.38948 17.3435 4.92296 17.2438 3.81931C17.108 2.31588 15.9228 1.15645 14.4249 1.03398C13.0868 0.924583 11.1835 0.8125 9 0.8125ZM11.1876 8.72203C11.7431 8.40128 11.7431 7.59941 11.1876 7.27866L8.06133 5.47373C7.50577 5.15298 6.81133 5.55392 6.81133 6.19542V9.80527C6.81133 10.4468 7.50577 10.8477 8.06133 10.527L11.1876 8.72203Z" fill="var(--text3)"></path></svg>
                            ${unitConverter(e.stat.view)}
                        </div>
                    </div>
                    `;
                    var el = document.createElement("div");
                    el.className = "bilibili_recommend";
                    el.innerHTML = text;
                    document.getElementById("bilibili_rec").appendChild(el);
                    hoverPreview(el, 300, e.id);
                });
            },
            onerror: function () {
                console.error(`获取失败`);
            },
        });
    }

    var previewTimer;
    var previewDict = {};
    function setPreview(dom, id) {
        if (!previewDict.id) {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.bilibili.com/x/player/videoshot?aid=${id}&index=1`,
                onload: function (response) {
                    let text = JSON.parse(response.responseText);
                    previewDict[id] = text.data;
                },
                onerror: function () {
                    console.error("获取封面出错");
                },
            });
        }

        if (previewDict[id]) {
            changePreview();
        } else {
            let timer = setInterval(function () {
                if (previewDict[id]) {
                    clearInterval(timer);
                    changePreview();
                }
            });
        }
        function changePreview() {
            let num = previewDict[id].index.length;
            let pic_num = 0;
            let x = 0;
            let y = 0;
            let inNum = 0;
            clearInterval(previewTimer);
            previewTimer = setInterval(function () {
                dom.querySelector(".preview_pic").setAttribute(
                    "style",
                    `
                background-image:url(${previewDict[id].image[pic_num]});
                background-size:2760px;
                background-position:-${x + 15}px -${y}px
                `
                );
                inNum += 1;
                x += 276;
                if (x >= 2600) {
                    x = 0;
                    y += 155;
                }
                if (inNum >= 100) {
                    x = 0;
                    y = 0;
                    pic_num += 1;
                }

                if (inNum >= num) {
                    x = 270;
                    y = 0;
                    pic_num = 0;
                    inNum = 0;
                }
            }, 300);
        }
    }

    function unitConverter(num) {
        // 播放量换算
        num = Number(num);
        if (Math.abs(num) > 100000000) {
            return (num / 100000000).toFixed(2) + "亿";
        } else if (Math.abs(num) > 10000) {
            return (num / 10000).toFixed(2) + "万";
        } else {
            return num.toFixed(2);
        }
    }

    function timeConversion(time) {
        // 时间算换
        let min;
        let sec;
        min = ~~(time / 60);
        sec = time - min * 60;
        min = (min >= 10 ? "" : "0") + min;
        sec = (sec >= 10 ? "" : "0") + sec;
        return min + ":" + sec;
    }

    function hoverPreview(dom, timeout, aid) {
        let seed;
        dom.addEventListener("mouseenter", function () {
            seed = setTimeout(function () {
                dom.querySelector(".preview_pic").style.display = "block";
                setPreview(dom, aid);
            }, timeout);
        });
        dom.addEventListener("mouseleave", function () {
            clearInterval(previewTimer);
            dom.querySelector(".preview_pic").setAttribute("style", "display:none");
            clearTimeout(seed);
        });
    }
})();

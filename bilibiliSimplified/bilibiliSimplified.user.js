// ==UserScript==
// @name         B站简化
// @namespace    http://tampermonkey.net/
// @version      0.5.5
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
    var recommendData = new Array();
    var accessKey = GM_getValue("accessKey") ? GM_getValue("accessKey") : ""

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

        let timer = setInterval(function () {
            if (document.querySelector("aside.right")) {
                clearInterval(timer);
                if (!accessKey) {getAccessKey()};
                setRecommend();
                getRecommendData();
                scrollRefsh();
            }
        });
    }

    function videoPlay() {
        // 提示弹窗
        style += ".bilibili-player-video-popup{display:none !important;}";
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
        // 充电页面
        style += ".bilibili-player-electric-panel{opacity:0;}";

        // 跳过充电页面
        document.querySelector("div.bilibili-player-video > *").addEventListener("ended", function () {
            let timer = setInterval(function () {
                if (document.querySelector(".bilibili-player-electric-panel")) {
                    document.querySelector("div.bilibili-player-electric-panel-jump").click();
                    clearInterval(timer);
                }
            });
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
        // 设置推荐元素
        let style = `
        .bilibili_recommend{margin-bottom:8px;padding:10px;border-radius:5px;background-color:#FFFFFF}
        .bilibili_recommend a{position:relative;display:inline-flex}
        .bilibili_recommend a:hover .video_mark{opacity:1}
        .bilibili_recommend a img{width:100%;border-radius:5px}
        .bilibili_recommend_text{margin-top:5px;padding:0 5px;transition:color 0.2s}
        .bilibili_recommend_text:hover{color:#00AEEC}
        .bilibili_recommend_button{padding:13px 0;border-radius:5px;background-color:#FFFFFF;text-align:center;cursor:pointer}
        .bilibili_recommend_button:hover{color:#00AEEC}
        .recommend_info{display:flex;margin-top:5px}
        .playinfo{display:flex;align-items:center;margin-left:5px;color:#9499A0;font-size:14px;transition:color 0.2s}
        a.playinfo:hover{color:#00AEEC}
        .playinfo svg{margin-right:5px;height:100%}
        .playinfo .name{margin:0}
        .preview_pic{position:absolute;top:0;width:100%;height:-moz-available;height:-webkit-fill-available}
        .timeshow{position:absolute;bottom:0;padding:0 7px;border-radius:0 5px 0 0;background:rgba(0,0,0,0.5);color:#FFFFFF;font-size:13px;line-height:20px}
        .recommend_switch{display:flex;align-items:center;margin:0 15px 0 auto}
        .recommend_switch p{color:#6D757A;font-size:14px;line-height:100%}
        .switch_button{position:relative;margin-left:15px;width:35px;height:20px;border-radius:10px;background:#9499A0;cursor:pointer}
        .switch_button::before{position:absolute;top:2px;left:3px;width:16px;height:16px;border-radius:100%;background-color:#FFFFFF;content:'';transition:all 0.2s}
        .switch_button.on{background:#00A1D6}
        .switch_button.on::before{left:16px}
        .video_mark{position:absolute;right:10px;bottom:10px;width:22px;height:22px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABT0lEQVQ4je3VMYrCQBTG8b/DWASLNKJgJ1hY2sloZeF2gkeYW+wZvIVXsLBJY5UdtLJLk17EIghCwChukWRxFzSaaLdfMwm8/EgemTclgOl02gEmwAAoky8RsAA+tdbrUoJ+AVZO8G9CoCeJ39Sq1+sopbBtO5e23+8xxrDdbi1gIog/vxAKYNs2Sqn0diBIenoP9X2fIAgyccv66WZZZBXvdjtc18UYkwlfJxM+n8+/1pfBefMPPw4LEZcEQcBqteJ0Or0GrlartFotLpcLnucxm83YbDbFYSEE/X6f4XBIpVLhcDjgOA6u63I8HvPDaRqNBuPxmHa7DcS7cT6f36yXj8IAUkq63S7NZpPlcomUtx9/Ck5Tq9UYjUZ3a976u0UQz9OiCcMwvYwk8XHyYYxBKXU9+p5Grybg4m1Hk9Bar4Ee4JC0JWeixOhprdffE/1yRW/TLMYAAAAASUVORK5CYII=);background-position:50%;background-size:cover;background-repeat:no-repeat;opacity:0;transition:opacity 0.2s cubic-bezier(0.22,0.58,0.12,0.98)}
        .video_mark.active{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABiklEQVQ4jbXVzyvDcRzH8efns1+JIRtbOSiKrMRBrZZC5IzcHJYTJyc1J464ubuY5MQ/oLSTNSHfIg5KyEmbzY/5sa++c/hOCtv47rvX8f2pR+/3u0+fjwAgfNoFLAH9gA1jUYEIECLoU0QOjQIVBsHveQECEr1Ts1By1pJEH9/s9EuM77RQbLIMKACG4QaHhYNBL7EBj3lwtU2yFXDT6rRil8Ic2C4F634XnbU24m8aY9F46bAUsNJdR1+9g6f3LKPROBfp99LhxY5aRhorULUs43sJlFQmfxO/FWMDHpQhL+3VXzdxps3JVEsVAJOHSSK3rwWbsP5WtAhorrSy09vAxH6CeoeFOV8NALPHKTZvnovMBoLwafZ7sc4uWfe76HE70HKnUsDy+SNzJ/dFUciziruMxvBunNXLNFLo6Mb1M/N/RCHPKgAyWpbpoyQHdxmaKi0snD3wYzQj8GfWrtL/4L5S1rdCLYOrSvTvxOxEJBBC/07MygsQkgR9ChAAtiltLWrOCBD0KR9smmovo1v+1QAAAABJRU5ErkJggg==)}
        .video_mark:hover .video_mark_text{opacity:1}
        .video_mark_text{position:absolute;top:-27px;left:50%;box-sizing:border-box;padding:6px 8px;border-radius:4px;background:rgba(0,0,0,0.7);color:#FFFFFF;white-space:nowrap;font-size:12px;line-height:12px;opacity:0;transform:translateX(-50%)}
        `;
        GM_addStyle(style);

        let main = document.createElement("div");
        main.id = "dynamic_recommend";
        document.querySelector("aside.right").appendChild(main);

        // 推荐开关
        let recommend_switch = document.createElement("div");
        recommend_switch.className = "recommend_switch";
        recommend_switch.innerHTML = `<p>推荐视频</p><span class="switch_button ${GM_getValue("recommend_status") ? "on" : ""}"></span>`;
        document.querySelector(".bili-dyn-list-tabs__list").appendChild(recommend_switch);
        let button = recommend_switch.querySelector(".switch_button");
        // 按钮点击
        button.onclick = function () {
            console.log(recommendData);
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
                main.style.display = "block";
            } else {
                main.style.display = "none";
            }
        }
    }

    function addRecommend() {
        // 添加推荐视频
        let data = recommendData.pop();
        let text = `
        <a href="https://www.bilibili.com${data.goto == 'av' ? `/video/av${data.param}` : data.uri}" target="_blank"><img src="${data.cover}@672w_378h" alt="${data.title}" />
            <div class="preview_pic"></div>
            <div class="timeshow">${numConverter.time(data.duration)}</div>
            <div class="video_mark">
                <div class="video_mark_text">稍后在看</div>
            </div>
        </a>
        <div class="bilibili_recommend_text"><a href="${data.goto == 'av' ? `/video/av${data.param}` : data.uri}" target="_blank">${data.title}</a></div>
        <div class="recommend_info">
            <a href="https://space.bilibili.com/${data.mid}" class="playinfo" target="_blank"><svg width="18" height="16"
                    viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M9 2.0625C6.85812 2.0625 4.98983 2.1725 3.67735 2.2798C2.77861 2.35327 2.08174 3.04067 2.00119 3.93221C1.90388 5.00924 1.8125 6.43727 1.8125 8C1.8125 9.56273 1.90388 10.9908 2.00119 12.0678C2.08174 12.9593 2.77861 13.6467 3.67735 13.7202C4.98983 13.8275 6.85812 13.9375 9 13.9375C11.1421 13.9375 13.0105 13.8275 14.323 13.7202C15.2216 13.6467 15.9184 12.9595 15.9989 12.0682C16.0962 10.9916 16.1875 9.56386 16.1875 8C16.1875 6.43614 16.0962 5.00837 15.9989 3.9318C15.9184 3.04049 15.2216 2.3533 14.323 2.27983C13.0105 2.17252 11.1421 2.0625 9 2.0625ZM3.5755 1.03395C4.9136 0.924562 6.81674 0.8125 9 0.8125C11.1835 0.8125 13.0868 0.924583 14.4249 1.03398C15.9228 1.15645 17.108 2.31588 17.2438 3.81931C17.3435 4.92296 17.4375 6.38948 17.4375 8C17.4375 9.61052 17.3435 11.077 17.2438 12.1807C17.108 13.6841 15.9228 14.8436 14.4249 14.966C13.0868 15.0754 11.1835 15.1875 9 15.1875C6.81674 15.1875 4.9136 15.0754 3.5755 14.966C2.07738 14.8436 0.892104 13.6838 0.756256 12.1803C0.656505 11.0762 0.5625 9.60942 0.5625 8C0.5625 6.39058 0.656505 4.92379 0.756257 3.81973C0.892104 2.31616 2.07738 1.15643 3.5755 1.03395ZM4.41663 4.93726C4.72729 4.93726 4.97913 5.1891 4.97913 5.49976V8.62476C4.97913 9.34963 5.56675 9.93726 6.29163 9.93726C7.0165 9.93726 7.60413 9.34963 7.60413 8.62476V5.49976C7.60413 5.1891 7.85597 4.93726 8.16663 4.93726C8.47729 4.93726 8.72913 5.1891 8.72913 5.49976V8.62476C8.72913 9.97095 7.63782 11.0623 6.29163 11.0623C4.94543 11.0623 3.85413 9.97095 3.85413 8.62476V5.49976C3.85413 5.1891 4.10597 4.93726 4.41663 4.93726ZM10.2501 4.93726C9.9394 4.93726 9.68756 5.1891 9.68756 5.49976V10.4998C9.68756 10.8104 9.9394 11.0623 10.2501 11.0623C10.5607 11.0623 10.8126 10.8104 10.8126 10.4998V9.60392H12.2292C13.5179 9.60392 14.5626 8.55925 14.5626 7.27059C14.5626 5.98193 13.5179 4.93726 12.2292 4.93726H10.2501ZM12.2292 8.47892H10.8126V6.06226H12.2292C12.8966 6.06226 13.4376 6.60325 13.4376 7.27059C13.4376 7.93793 12.8966 8.47892 12.2292 8.47892Z">
                    </path>
                </svg>
                <p class="name">${data.name}</p>
            </a>
            <div class="playinfo"">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M3.67735 2.2798C4.98983 2.1725 6.85812 2.0625 9 2.0625C11.1421 2.0625 13.0105 2.17252 14.323 2.27983C15.2216 2.3533 15.9184 3.04049 15.9989 3.9318C16.0962 5.00837 16.1875 6.43614 16.1875 8C16.1875 9.56386 16.0962 10.9916 15.9989 12.0682C15.9184 12.9595 15.2216 13.6467 14.323 13.7202C13.0105 13.8275 11.1421 13.9375 9 13.9375C6.85812 13.9375 4.98983 13.8275 3.67735 13.7202C2.77861 13.6467 2.08174 12.9593 2.00119 12.0678C1.90388 10.9908 1.8125 9.56273 1.8125 8C1.8125 6.43727 1.90388 5.00924 2.00119 3.93221C2.08174 3.04067 2.77861 2.35327 3.67735 2.2798ZM9 0.8125C6.81674 0.8125 4.9136 0.924562 3.5755 1.03395C2.07738 1.15643 0.892104 2.31616 0.756257 3.81973C0.656505 4.92379 0.5625 6.39058 0.5625 8C0.5625 9.60942 0.656505 11.0762 0.756256 12.1803C0.892104 13.6838 2.07738 14.8436 3.5755 14.966C4.9136 15.0754 6.81674 15.1875 9 15.1875C11.1835 15.1875 13.0868 15.0754 14.4249 14.966C15.9228 14.8436 17.108 13.6841 17.2438 12.1807C17.3435 11.077 17.4375 9.61052 17.4375 8C17.4375 6.38948 17.3435 4.92296 17.2438 3.81931C17.108 2.31588 15.9228 1.15645 14.4249 1.03398C13.0868 0.924583 11.1835 0.8125 9 0.8125ZM11.1876 8.72203C11.7431 8.40128 11.7431 7.59941 11.1876 7.27866L8.06133 5.47373C7.50577 5.15298 6.81133 5.55392 6.81133 6.19542V9.80527C6.81133 10.4468 7.50577 10.8477 8.06133 10.527L11.1876 8.72203Z"
                        fill="var(--text3)"></path>
                </svg>${numConverter.view(data.play)}
            </div>
        </div>
        `;
        let dom = document.createElement("div");
        dom.className = "bilibili_recommend";
        dom.innerHTML = text;
        document.getElementById("dynamic_recommend").appendChild(dom);
        // 悬浮预览
        hoverPreview(dom, data.param);
        // 添加稍后在看
        addMarkVideo(dom.querySelector(".video_mark"), data.param);
        // 防止 Mixed Content 提示
        let el = document.createElement("meta");
        el.setAttribute("http-equiv", "Content-Security-Policy");
        el.setAttribute("content", "upgrade-insecure-requests");
        document.head.append(el);
    }

    function getRecommendData() {
        // 获取推荐API数据
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://app.bilibili.com/x/feed/index?build=1&mobi_app=android&idx='
                + (Date.now() / 1000).toFixed(0) + (accessKey ? '&access_key=' + accessKey : ''),
            onload: res => {
                try {
                    var list = JSON.parse(res.response);
                    if (list.code != 0) {
                        console.log(`获取推荐数据失败 code ${list.code}</br>msg:${list.message}`);
                        return;
                    } else {
                        recommendData.push.apply(recommendData, list.data);
                    }
                } catch (e) {
                    console.log("获取推荐数据失败");
                }
            },
            onerror: e => {
                console.error(e, '请求app首页发生错误');
            }
        });
    }

    var previewDict = {};
    function setPreview(preDom, id) {
        // 设置预览图
        if (!previewDict[id]) {
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

        let timer = setInterval(function () {
            if (previewDict[id]) {
                clearInterval(timer);
                changePreview();
            }
        });

        function changePreview() {
            let frameAll = previewDict[id].index.length;
            let now_frame = 0;
            let framePage = 0;
            preDom.style.display == "block";
            preDom.style.backgroundSize = "2800px";
            preDom.style.backgroundPosition = "0px 0px";
            let previewTimer = setInterval(function () {
                if (preDom.style.display == "none") {
                    clearInterval(previewTimer);
                } else {
                    preDom.style.backgroundImage = `url(${previewDict[id].image[framePage]})`;
                    preDom.style.backgroundPosition = `-${(now_frame % 10) * 280 + 15}px -${~~((now_frame % 100) / 10) * 158}px`;

                    now_frame += 1;
                    if (now_frame % 100 == 0) {
                        framePage += 1;
                    }
                    if (now_frame >= frameAll - 1) {
                        now_frame = 1;
                        framePage = 0;
                    }
                }
            }, 300);
        }
    }

    const numConverter = {
        // 播放量
        view(num) {
            num = Number(num);
            if (Math.abs(num) > 100000000) {
                return (num / 100000000).toFixed(2) + "亿";
            } else if (Math.abs(num) > 10000) {
                return (num / 10000).toFixed(2) + "万";
            } else {
                return num.toFixed(2);
            }
        },
        // 时间换算
        time(num) {
            let second = num % 60;
            let minute = Math.floor(num / 60);
            let hour;
            if (minute > 60) {
                hour = Math.floor(minute / 60);
                minute = minute % 60;
            }
            if (second < 10) second = "0" + second;
            if (minute < 10) minute = "0" + minute;
            return hour ? `${hour}:${minute}:${second}` : `${minute}:${second}`;
        },
    };

    function hoverPreview(dom, aid) {
        // 悬停预览
        let seed;
        let previewDom = dom.querySelector(".preview_pic");

        dom.addEventListener("mouseenter", function () {
            seed = setTimeout(function () {
                previewDom.style.display = "block";
                setPreview(previewDom, aid);
            }, 300);
        });
        dom.addEventListener("mouseleave", function () {
            if (previewDom.style.display) {
                previewDom.style.display = "none";
            }
            clearTimeout(seed);
        });
    }

    function getCookie(key) {
        const str = `(^| )${key}=([^;]*)(;|$)`;
        const reg = new RegExp(str);
        const arr = document.cookie.match(reg);
        if (!arr) {
            return null;
        }
        return arr[2]; //第2个分组匹配对应cookie的value
    }

    function scrollRefsh() {
        // 监听滚动实现自动添加推荐
        let timer = setInterval(function () {
            if (recommendData[0] != undefined) {
                for (let index = 0; index < 5; index++) {
                    addRecommend();
                }
                clearInterval(timer);
            }
        });

        var lastAdd = Date.now();
        window.onscroll = function () {
            if (document.querySelector("div.recommend_switch > span").classList.contains("on")) {
                let scrollPlace = document.body.scrollTop || document.documentElement.scrollTop;
                let domHight = document.getElementById("dynamic_recommend").clientHeight - window.screen.availHeight;
                if (recommendData[0] != undefined && scrollPlace >= domHight) {
                    addRecommend();
                }
                if (recommendData.length < 2 && Date.now() - lastAdd >= 1000) {
                    lastAdd = Date.now();
                    getRecommendData();
                }
            }
        };
    }

    function addMarkVideo(markVideo, id) {
        // 添加稍后在看
        markVideo.addEventListener("mouseenter", function () {
            if (markVideo.classList.contains("active")) {
                markVideo.querySelector(".video_mark_text").innerHTML = "移除";
            } else {
                markVideo.querySelector(".video_mark_text").innerHTML = "稍后在看";
            }
        });

        markVideo.addEventListener("click", function (e) {
            // 点击按钮不跳转
            e.preventDefault();
            if (markVideo.classList.contains("active")) {
                markVideo.classList.remove("active");
                markVideo.querySelector(".video_mark_text").innerHTML = "已从稍后在看列表中移除";
                markVideoApi("del");
            } else {
                markVideo.classList.add("active");
                markVideo.querySelector(".video_mark_text").innerHTML = "已加稍后在看";
                markVideoApi("add");
            }
        });

        function markVideoApi(action) {
            const req = new XMLHttpRequest();
            req.open("POST", `https://api.bilibili.com/x/v2/history/toview/${action}`);
            req.withCredentials = true;
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            req.onload = function (res) {
                try {
                    var list = JSON.parse(res.target.response);
                    if (list.code != 0) {
                        console.log(`请求稍后再看错误 code ${list.code}</br>msg:${list.message}`, { list, target });
                        return;
                    }
                } catch (e) {
                    console.log("请求稍后再看发生错误");
                }
            };
            req.send(`aid=${id}&csrf=${getCookie("bili_jct")}`);
        }
    }

    function getAccessKey() {
        // 获取AccessKey
        fetch('https://passport.bilibili.com/login/app/third?appkey=27eb53fc9058f8c3' +
            '&api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png&sign=04224646d1fea004e79606d3b038c84a', {
            method: 'GET',
            credentials: 'include',
        }).then(async res => {
            try {
                return await res.json();
            } catch (e) {
                console.warn("请求接口错误");
            }
        }).then(data => {
            return data.data.confirm_uri
        }).then(url => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { cookie: document.cookie },
                onload: function (resp) {
                    accessKey = resp.finalUrl.match(/access_key=([0-9a-z]{32})/)[1];
                    GM_setValue("accessKey", accessKey)
                },
                onerror: function (e) {
                    console.error("获取失败");
                },
            })
        })
    }
})();

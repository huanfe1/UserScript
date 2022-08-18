// ==UserScript==
// @name         B站简化
// @namespace    https://github.com/huanfeiiiii/UserScript/tree/main/bilibiliSimplified
// @version      0.6.2
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
// @connect      www.mcbbs.net
// @connect      passport.bilibili.com
// @license      WTFPL
// @run-at       document-start
// ==/UserScript==

(function () {
    var recommendData = new Array();
    var accessKey = GM_getValue("accessKey") ? GM_getValue("accessKey") : "";

    const url = window.location.href.match("[a-zA-z]+://(.*)/")[1];
    if (url == "www.bilibili.com") {
        console.log("首页");
        homePage();
    } else if (url == "t.bilibili.com") {
        console.log("动态");
        dynamicPage();
    } else if (url.match("www.bilibili.com/(.*)")) {
        if (url.split("/")[1] == "video") {
            console.log("视频播放页");
            videoPlayPage();
        } else if (url.match("www.bilibili.com/(.*)")[1] == "read") {
            console.log("专栏页");
            readPage();
        }
    } else if (url.includes("space.bilibili.com")) {
        console.log("个人空间");
        spacePage();
    }

    function homePage() {}

    function dynamicPage() {
        hideDom([".bili-dyn-item__interaction", ".bili-dyn-item__ornament", ".bili-avatar-pendent-dom", "aside.right .sticky"]);

        let timer = setInterval(function () {
            if (document.querySelector("aside.right")) {
                clearInterval(timer);
                if (!accessKey) {
                    getAccessKey();
                }
                setRecommend();
                getRecommendData();
                scrollRefsh();
            }
        });
    }

    function videoPlayPage() {
        hideDom([
            ".bili-avatar-pendent-dom",
            ".reply-decorate",
            ".pop-live-small-mode",
            ".activity-m-v1",
            ".attention",
            ".bpx-player-cmd-dm-wrap",
            ".reply-notice",
            ".ad-report",
        ]);

        // 删去投票弹窗弹幕
        let keyword = ["1", "2", "3", "4", "5"];
        let timer = setInterval(function () {
            if (document.querySelectorAll(".bpx-player-popup > *").length != 0) {
                document.querySelectorAll(".bpx-player-popup-vote-an-text-doc").forEach((e) => {
                    keyword.push(e.innerHTML);
                });
                clearInterval(timer);
            }
        });

        setInterval(function () {
            let danmaku = document.querySelectorAll(".b-danmaku");
            danmaku.forEach((e) => {
                if (keyword.includes(e.innerHTML) && !e.classList.contains("b-danmaku-hide")) {
                    e.classList.add("b-danmaku-hide");
                }
            });
        });
    }

    function readPage() {
        // 专栏去除复制小尾巴
        HTMLDivElement.prototype.realAddEventListener = HTMLAnchorElement.prototype.addEventListener;
        HTMLDivElement.prototype.addEventListener = function (a, b, c) {
            if (a == "copy") return;
            return this.realAddEventListener(a, b, c);
        };
    }

    function spacePage() {
        // 解决选择视频排序时,页面序号没有回到第一个的问题
        let buttons = document.getElementsByClassName("be-tab-input");
        window.onload = function () {
            buttons.forEach(function (e) {
                e.addEventListener("change", function () {
                    document.querySelector("#submit-video-list > ul.be-pager > li:nth-child(2)").click();
                });
            });
        };
    }

    function setRecommend() {
        // 设置推荐元素
        let style = `
        .recommend_switch{display:flex;align-items:center;margin:0 15px 0 auto}
        .recommend_switch p{color:#6D757A;font-size:14px;line-height:100%}
        .switch_button{position:relative;margin-left:15px;width:35px;height:20px;border-radius:10px;background:#9499A0;cursor:pointer}
        .switch_button::before{position:absolute;top:2px;left:3px;width:16px;height:16px;border-radius:100%;background-color:#FFFFFF;content:'';transition:all 0.2s}
        .switch_button.on{background:#00A1D6}
        .switch_button.on::before{left:16px}
        .recommend_content{margin-bottom:8px;padding:10px;border-radius:5px;background-color:#FFFFFF}
        .video_content{position:relative;display:flex;width:100%}
        .video_content .preview_pic{position:absolute;top:0;width:100%;height:-moz-available;height:-webkit-fill-available}
        .video_content img{width:100%}
        .video_content:hover .video_mask{opacity:0}
        .video_mask{position:absolute;bottom:0;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;padding:16px 8px 6px;width:100%;background-image:linear-gradient(180deg,rgba(0,0,0,0) 0,rgba(0,0,0,0.8) 100%);color:#FFFFFF;font-size:14px;font-size:13px;line-height:18px;transition:opacity 1s}
        .video_mask .views{display:flex;align-items:center}
        .video_mask .views svg{margin-right:3px;width:18px;height:18px}
        .video_mask .views .num{margin:0}
        .video_mask .views p:nth-child(2){margin-right:10px}
        .video_mask .duration{height:100%}
        .video_text{margin-top:10px}
        .video_text a:hover{color:#00AEEC}
        .video_text .video_title{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;text-overflow:ellipsis;font-size:16px;-webkit-line-clamp:2;overflow-wrap:anywhere}
        .video_text .owner{display:flex;margin-top:5px;color:#9499A0;font-size:14px}
        .video_text .owner .up_name{display:flex}
        .video_text .owner .up_name svg{margin-right:5px;width:18px;height:18px}
        .video_text .owner p{margin:0;line-height:18px}
        .video_text .owner .time{margin-left:10px}
        .video_content:hover .video_mark{opacity:1}
        .video_mark{position:absolute;top:10px;right:10px;width:22px;height:22px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABT0lEQVQ4je3VMYrCQBTG8b/DWASLNKJgJ1hY2sloZeF2gkeYW+wZvIVXsLBJY5UdtLJLk17EIghCwChukWRxFzSaaLdfMwm8/EgemTclgOl02gEmwAAoky8RsAA+tdbrUoJ+AVZO8G9CoCeJ39Sq1+sopbBtO5e23+8xxrDdbi1gIog/vxAKYNs2Sqn0diBIenoP9X2fIAgyccv66WZZZBXvdjtc18UYkwlfJxM+n8+/1pfBefMPPw4LEZcEQcBqteJ0Or0GrlartFotLpcLnucxm83YbDbFYSEE/X6f4XBIpVLhcDjgOA6u63I8HvPDaRqNBuPxmHa7DcS7cT6f36yXj8IAUkq63S7NZpPlcomUtx9/Ck5Tq9UYjUZ3a976u0UQz9OiCcMwvYwk8XHyYYxBKXU9+p5Grybg4m1Hk9Bar4Ee4JC0JWeixOhprdffE/1yRW/TLMYAAAAASUVORK5CYII=);background-position:50%;background-size:cover;background-repeat:no-repeat;opacity:0;transition:opacity 0.2s cubic-bezier(0.22,0.58,0.12,0.98)}
        .video_mark.active{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABiklEQVQ4jbXVzyvDcRzH8efns1+JIRtbOSiKrMRBrZZC5IzcHJYTJyc1J464ubuY5MQ/oLSTNSHfIg5KyEmbzY/5sa++c/hOCtv47rvX8f2pR+/3u0+fjwAgfNoFLAH9gA1jUYEIECLoU0QOjQIVBsHveQECEr1Ts1By1pJEH9/s9EuM77RQbLIMKACG4QaHhYNBL7EBj3lwtU2yFXDT6rRil8Ic2C4F634XnbU24m8aY9F46bAUsNJdR1+9g6f3LKPROBfp99LhxY5aRhorULUs43sJlFQmfxO/FWMDHpQhL+3VXzdxps3JVEsVAJOHSSK3rwWbsP5WtAhorrSy09vAxH6CeoeFOV8NALPHKTZvnovMBoLwafZ7sc4uWfe76HE70HKnUsDy+SNzJ/dFUciziruMxvBunNXLNFLo6Mb1M/N/RCHPKgAyWpbpoyQHdxmaKi0snD3wYzQj8GfWrtL/4L5S1rdCLYOrSvTvxOxEJBBC/07MygsQkgR9ChAAtiltLWrOCBD0KR9smmovo1v+1QAAAABJRU5ErkJggg==)}
        .video_mark:hover .video_mark_text{opacity:1}
        .video_mark_text{position:absolute;top:-27px;left:50%;box-sizing:border-box;padding:6px 8px;border-radius:4px;background:rgba(0,0,0,0.7);color:#FFFFFF;white-space:nowrap;font-size:12px;line-height:12px;opacity:0;transform:translateX(-50%)}
        .preview_pic{display:none}
        .preview_bar{box-sizing:border-box;width:100%;height:10px;border:solid #000000;border-top-width:4px;border-right-width:8px;border-bottom-width:4px;border-left-width:8px;background-color:#444444}
        .bar_content{width:100%;height:2px;background-color:#FFFFFF}
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
        let url = `https://www.bilibili.com${data.goto == "av" ? `/video/av${data.param}` : data.uri}`;
        let text = `
        <a href="${url}" class="video_content" target="_blank"><div class="preview_pic"><div class="preview_bar"><div class="bar_content"></div></div></div></div><img src="${
            data.cover
        }@672w_378h" alt="${
            data.title
        }"><div class="video_mark"><div class="video_mark_text"></div></div><div class="video_mask"><div class="views"><svg t="1658670007102" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18155" width="200" height="200"><path d="M800 128H224C134.4 128 64 198.4 64 288v448c0 89.6 70.4 160 160 160h576c89.6 0 160-70.4 160-160V288c0-89.6-70.4-160-160-160z m96 608c0 54.4-41.6 96-96 96H224c-54.4 0-96-41.6-96-96V288c0-54.4 41.6-96 96-96h576c54.4 0 96 41.6 96 96v448z" p-id="18156" fill="#ffffff"></path><path d="M684.8 483.2l-256-112c-22.4-9.6-44.8 6.4-44.8 28.8v224c0 22.4 22.4 38.4 44.8 28.8l256-112c25.6-9.6 25.6-48 0-57.6z" p-id="18157" fill="#ffffff"></path></svg><p class="num">                ${numConverter.view(
            data.play
        )}</p><svg t="1658672093240" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3299" width="200" height="200"><path d="M857.28 344.992h-264.832c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-71.808-153.792-140.544-143.808-60.608 8.8-89.536 59.904-89.536 125.536v59.296c0 76.064-58.208 140.928-132.224 148.064l-117.728-0.192A67.36 67.36 0 0 0 64 483.04V872c0 37.216 30.144 67.36 67.36 67.36h652.192a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824zM128 872V483.04c0-1.856 1.504-3.36 3.36-3.36H208v395.68H131.36A3.36 3.36 0 0 1 128 872z m767.328-417.088l-73.728 388.96a38.72 38.72 0 0 1-38.048 31.488H272V476.864a213.312 213.312 0 0 0 173.312-209.088V208.512c0-37.568 12.064-58.912 34.72-62.176 27.04-3.936 67.36 38.336 67.36 80.48 0 37.312-9.504 84-28.864 139.712a32 32 0 0 0 30.24 42.496h308.512a38.72 38.72 0 0 1 38.048 45.888z" p-id="3300" fill="#ffffff"></path></svg><p class="num">                ${numConverter.view(
            data.like
        )}</p></div><div class="duration">            ${numConverter.duration(
            data.duration
        )}</div></div></a><div class="video_text"><a class="video_title" href="${url}" target="_blank" title="${data.title}">${
            data.title
        }</a><div class="owner"><a class="up_name" href="https://space.bilibili.com/${
            data.mid
        }" target="_blank"><svg width="18" height="16" viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 2.0625C6.85812 2.0625 4.98983 2.1725 3.67735 2.2798C2.77861 2.35327 2.08174 3.04067 2.00119 3.93221C1.90388 5.00924 1.8125 6.43727 1.8125 8C1.8125 9.56273 1.90388 10.9908 2.00119 12.0678C2.08174 12.9593 2.77861 13.6467 3.67735 13.7202C4.98983 13.8275 6.85812 13.9375 9 13.9375C11.1421 13.9375 13.0105 13.8275 14.323 13.7202C15.2216 13.6467 15.9184 12.9595 15.9989 12.0682C16.0962 10.9916 16.1875 9.56386 16.1875 8C16.1875 6.43614 16.0962 5.00837 15.9989 3.9318C15.9184 3.04049 15.2216 2.3533 14.323 2.27983C13.0105 2.17252 11.1421 2.0625 9 2.0625ZM3.5755 1.03395C4.9136 0.924562 6.81674 0.8125 9 0.8125C11.1835 0.8125 13.0868 0.924583 14.4249 1.03398C15.9228 1.15645 17.108 2.31588 17.2438 3.81931C17.3435 4.92296 17.4375 6.38948 17.4375 8C17.4375 9.61052 17.3435 11.077 17.2438 12.1807C17.108 13.6841 15.9228 14.8436 14.4249 14.966C13.0868 15.0754 11.1835 15.1875 9 15.1875C6.81674 15.1875 4.9136 15.0754 3.5755 14.966C2.07738 14.8436 0.892104 13.6838 0.756256 12.1803C0.656505 11.0762 0.5625 9.60942 0.5625 8C0.5625 6.39058 0.656505 4.92379 0.756257 3.81973C0.892104 2.31616 2.07738 1.15643 3.5755 1.03395ZM4.41663 4.93726C4.72729 4.93726 4.97913 5.1891 4.97913 5.49976V8.62476C4.97913 9.34963 5.56675 9.93726 6.29163 9.93726C7.0165 9.93726 7.60413 9.34963 7.60413 8.62476V5.49976C7.60413 5.1891 7.85597 4.93726 8.16663 4.93726C8.47729 4.93726 8.72913 5.1891 8.72913 5.49976V8.62476C8.72913 9.97095 7.63782 11.0623 6.29163 11.0623C4.94543 11.0623 3.85413 9.97095 3.85413 8.62476V5.49976C3.85413 5.1891 4.10597 4.93726 4.41663 4.93726ZM10.2501 4.93726C9.9394 4.93726 9.68756 5.1891 9.68756 5.49976V10.4998C9.68756 10.8104 9.9394 11.0623 10.2501 11.0623C10.5607 11.0623 10.8126 10.8104 10.8126 10.4998V9.60392H12.2292C13.5179 9.60392 14.5626 8.55925 14.5626 7.27059C14.5626 5.98193 13.5179 4.93726 12.2292 4.93726H10.2501ZM12.2292 8.47892H10.8126V6.06226H12.2292C12.8966 6.06226 13.4376 6.60325 13.4376 7.27059C13.4376 7.93793 12.8966 8.47892 12.2292 8.47892Z"></path></svg><p>${
            data.name
        }</p></a><p class="time" title="${numConverter.timeStamp(data.ctime).full}">${numConverter.timeStamp(data.ctime).mini}</p></div></div>
        `;
        let dom = document.createElement("div");
        dom.className = "recommend_content";
        dom.innerHTML = text;
        document.getElementById("dynamic_recommend").appendChild(dom);
        // 悬浮预览
        hoverPreview(dom, data.param);
        // 添加稍后在看
        addMarkVideo(dom.querySelector(".video_mark"), data.param);
    }

    function getRecommendData() {
        // 获取推荐API数据
        GM_xmlhttpRequest({
            method: "GET",
            url:
                "https://app.bilibili.com/x/feed/index?build=1&mobi_app=android&idx=" +
                (Date.now() / 1000).toFixed(0) +
                (accessKey ? "&access_key=" + accessKey : ""),
            onload: (res) => {
                try {
                    var list = JSON.parse(res.response);
                    if (list.code != 0) {
                        console.error(`获取推荐数据失败 code ${list.code}</br>msg:${list.message}`);
                        return;
                    } else {
                        recommendData.push.apply(recommendData, list.data);
                    }
                } catch (e) {
                    console.error("获取推荐数据失败");
                }
            },
            onerror: () => {
                console.error("获取推荐数据失败");
            },
        });
    }

    const numConverter = {
        // 数量
        view(num) {
            num = Number(num);
            if (Math.abs(num) > 100000000) {
                return (num / 100000000).toFixed(1) + "亿";
            } else if (Math.abs(num) > 10000) {
                return (num / 10000).toFixed(1) + "万";
            } else {
                return num.toFixed(0);
            }
        },
        // 时长换算
        duration(num) {
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
        // 时间戳换算
        timeStamp(timestamp) {
            let date = new Date(parseInt(timestamp) * 1000);
            let Year = date.getFullYear();
            let Moth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            let Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            let Hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            let Minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            let Sechond = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            let GMT = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond;
            let miniGMT = Moth + "-" + Day;
            return {
                full: GMT,
                mini: miniGMT,
            };
        },
    };

    function hoverPreview(dom, aid) {
        // 悬停预览
        let seed;
        let hoverDom = dom.querySelector("a");
        let picDom = dom.querySelector(".preview_pic");
        let bar = dom.querySelector(".bar_content");
        hoverDom.addEventListener("mouseenter", function (e) {
            seed = setTimeout(function () {
                // 鼠标悬停事件
                getPic();
            }, 300);
        });
        hoverDom.addEventListener("mousemove", function (e) {
            // 鼠标移动事件
            if (picDom.dataset.num) {
                setPic(e.offsetX);
            }
        });
        hoverDom.addEventListener("mouseleave", function () {
            // 鼠标离开事件
            picDom.style.display = "none";
            clearTimeout(seed);
        });

        function getPic() {
            if (picDom.dataset.num) {
                picDom.style.display = "block";
            } else {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.bilibili.com/x/player/videoshot?aid=${aid}&index=1`,
                    onload: function (response) {
                        try {
                            let text = JSON.parse(response.responseText);
                            let data = text.data;
                            picDom.dataset.num = data.index.length >= 99 ? 99 : data.index.length;
                            picDom.style.backgroundImage = `url(${data.image[0]})`;
                            picDom.style.backgroundPosition = "0px 0px";
                            picDom.style.backgroundSize = "2800px";
                            picDom.style.display = "block";
                        } catch {
                            console.error("获取封面出错");
                        }
                    },
                    onerror: function () {
                        console.error("获取封面出错");
                    },
                });
            }
        }

        function setPic(offsetX) {
            // 根据鼠标位置更改背景位置
            if (picDom.dataset.num) {
                let num = ~~((offsetX / picDom.offsetWidth) * picDom.dataset.num);
                picDom.style.backgroundPosition = `-${(num % 10) * 280 + 15}px -${~~((num % 100) / 10) * 158}px`;
                bar.style.width = `${~~((offsetX / picDom.offsetWidth) * 100)}%`;
            }
        }
    }

    function getCookie(key) {
        const reg = `(^| )${key}=([^;]*)(;|$)`;
        const arr = document.cookie.match(reg);
        if (!arr) {
            return null;
        }
        return arr[2];
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
                        console.error(`请求稍后再看错误 code ${list.code}</br>msg:${list.message}`, { list, target });
                        return;
                    }
                } catch (e) {
                    console.error("请求稍后再看发生错误");
                }
            };
            req.send(`aid=${id}&csrf=${getCookie("bili_jct")}`);
        }
    }

    function getAccessKey() {
        // 获取AccessKey
        fetch(
            "https://passport.bilibili.com/login/app/third?appkey=27eb53fc9058f8c3" +
                "&api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png&sign=04224646d1fea004e79606d3b038c84a",
            {
                method: "GET",
                credentials: "include",
            }
        )
            .then(async (res) => {
                try {
                    return await res.json();
                } catch {
                    console.warn("请求接口错误");
                }
            })
            .then((data) => {
                if (data.code || !data.data) {
                    throw { msg: data.msg || data.message || data.code, data };
                } else if (!data.data.has_login) {
                    throw { msg: "你必须登录B站之后才能使用授权", data };
                } else if (!data.data.confirm_uri) {
                    throw { msg: "无法获得授权网址", data };
                } else {
                    return data.data.confirm_uri;
                }
            })
            .then((url) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: { cookie: document.cookie },
                    onload: function (resp) {
                        accessKey = resp.finalUrl.match(/access_key=([0-9a-z]{32})/)[1];
                        console.log("获取accessKey成功", accessKey);
                        GM_setValue("accessKey", accessKey);
                    },
                    onerror: function (e) {
                        console.error("获取失败");
                    },
                });
            });
    }

    function hideDom(element) {
        let style = "";
        element.forEach(function (e) {
            style += `${e}{display:none !important;}`;
        });
        GM_addStyle(style);
    }
})();

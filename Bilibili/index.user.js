// ==UserScript==
// @name         B站简化
// @namespace    https://huanfei.top/
// @version      1.1.1
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
    const style = [
        // 公共
        '.bili-avatar-pendent-dom', // 头像挂件
        '.fan-badge', // 粉丝勋章
        '.reply-tag-list', // 热评标签
        '.reply-notice', // 评论通知
        // 首页
        '.recommended-swipe.grid-anchor',
        '.feed-card:has(.bili-video-card__info--ad)',
        '.floor-single-card',
        '.bili-video-card.is-rcmd:has(.bili-video-card__info--ad)',
        '.feed-roll-btn',
        '.bili-live-card.is-rcmd',
        // 播放页
        '#bannerAd',
        '.reply-decorate',
        'a#right-bottom-banner',
        '#slide_ad',
        'a.ad-report.video-card-ad-small',
        '.video-page-special-card-small',
        'span.add-follow-btn',
        'div#activity_vote',
        'span.argue.item', // 安全提醒
        '.pop-live-small-mode', // 大家围观的直播
        '.bili-vote', // 弹幕投票框
        '.bili-score', // 弹幕评分框
        '.bili-guide', // 引导三连 + 关注框
        // 动态页
        '.bili-dyn-item__interaction', // 热门评论
        '.bili-dyn-item__ornament', // 右上角标志
        '.bili-dyn-list__item:has(.bili-rich-text-module.lottery)', // 抽奖动态
        'aside.right .sticky', // 右侧推荐
        '.bili-dyn-content__dispute', // 安全提醒
        // 查找页
        '.video-list > div:has(.bili-video-card__info--ad)',
    ];
    GM_addStyle(style.map(e => `${e}{display:none !important;}`).join(''));
    GM_addStyle(['.feed-card{margin-top: 40px !important;}', '.container.is-version8 > .bili-video-card.is-rcmd{margin-top: 40px !important;}'].join(''));
    // 去除复制小尾巴
    window.addEventListener('copy', e => e.stopPropagation(), true);
})();

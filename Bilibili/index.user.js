// ==UserScript==
// @name         B站简化
// @namespace    https://huanfei.top/
// @version      1.1.9
// @description  简化B站
// @author       huanfei
// @match        *.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT License
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    // 自定义样式去除
    const style = [
        '.bili-avatar-pendent-dom', // 头像挂件
        '.user .medal', // 荣誉
        '.fan-badge', // 粉丝勋章
        '.sailing',
        '.bb-comment .nameplate, .comment-bilibili-fold .nameplate, .nameplate-holder', // 成就徽章
        '.reply-tag-list', // 热评标签
        '.reply-notice', // 评论通知
        '.left-loc-entry', // 顶部栏杂项
        // 首页
        '.recommended-swipe.grid-anchor',
        '.feed-card:has(.bili-video-card__info--ad)',
        '.container.is-version8 > .floor-single-card',
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
        '.bpx-player-cmd-dm-wrap', // 弹幕弹窗
        '.bili-cmd-shrink', // 弹幕弹窗
        '.toolbar-right-ai', // AI 总结
        // 动态页
        '.bili-dyn-item__interaction', // 热门评论
        '.bili-dyn-item__ornament', // 右上角标志
        '.bili-dyn-list__item:has(.bili-rich-text-module.lottery)', // 抽奖动态
        '.bili-dyn-list__item:has(.bili-dyn-card-goods)', //抽奖带货
        'aside.right .sticky', // 右侧推荐
        '.bili-dyn-content__dispute', // 安全提醒
        '.b-avatar__canvas > div.b-avatar__layers:not(:nth-child(1))', // 头像挂件
        '.b-avatar__layers > div:not(:nth-child(1))', // 头像挂件
        // 查找页
        '.video-list > div:has(.bili-video-card__info--ad)',
        GM_getValue('history_show', true) ? '' : '.search-panel .history',
    ];
    GM_addStyle(style.map(e => `${e}{display:none !important;}`).join(''));

    // 自定义样式
    GM_addStyle(
        [
            '.feed-card{margin-top: 40px !important;}',
            '.container.is-version8 > .bili-video-card.is-rcmd{margin-top: 40px !important;}',
            '.b-avatar__layer.center{width: 48px !important;height: 48px !important;}',
            //动态左侧直播不随屏幕滚动
            '.bili-dyn-live-users{position: inherit !important;top: 0px !important;}',
            // 头像样式修复
            '.up-info-container .bili-avatar{width:48px !important;height:48px !important;transform:translate(0px, 0px) !important;}',
        ].join('')
    );

    // 去除复制小尾巴
    window.addEventListener('copy', e => e.stopPropagation(), true);

    // 视频页停留25秒自动点赞视频
    if (GM_getValue('auto_like', false) && /\/video\//.test(location.pathname)) {
        setInterval(() => {
            document.querySelector('.video-like.video-toolbar-left-item:not(.on)').click();
            console.log('已点赞视频');
        }, 25000);
    }

    // 自定义菜单
    GM_registerMenuCommand((GM_getValue('auto_like', false) ? '✅' : '❌') + '自动点赞', () => {
        GM_setValue('auto_like', !GM_getValue('auto_like', false));
        location.reload();
    });
    GM_registerMenuCommand((GM_getValue('history_show', true) ? '✅' : '❌') + '搜索历史显示', () => {
        GM_setValue('history_show', !GM_getValue('history_show', true));
        location.reload();
    });
})();

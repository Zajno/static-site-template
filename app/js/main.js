
import '../sass/main.sass';
import $ from 'jquery';
import TweenMax from 'TweenMax';
import '../js/mobile-menu';

// home page change content video & img
var videoConteiner = document.querySelectorAll('.home-hero-img-wrap video'),
    videoEls =  document.querySelectorAll('.home-hero-img-wrap source'),
    imgEl = document.querySelectorAll('.home-hero-img-wrap .img-large');
    
function CheckWindowsSize () {
    if (window.innerWidth > 1024 && $('.home-hero-img-wrap').length > 0) {
        videoEls.forEach(function (elem) {
            elem.src = $(elem).data('src');
        });
        videoConteiner[0].load()
    } else {
        imgEl.forEach(function (elem) {
            elem.src = $(elem).data('src');
        });
    }

}
CheckWindowsSize()
//

//Image lazy load
function loadImgLazy() {
    $('.lazy').each(function () {
        this.src = $(this).data('src');
    });
}

// Tolltips functional
function initTolltips() {
    const tooltips = $('.pin-item');
    var timer;
    var count = 0;
    const AUTO_SHOW_DELAY = 3000; //ms
    
    enableAutoShowTooltips();
    $('.pin-item').hover(showTooltip, hideTooltip);
    
    function enableAutoShowTooltips() {
        tooltips.removeClass('active')
            .eq([count])
            .addClass('active');
        if (count == tooltips.length - 1) {
            count = 0
        } else {
            count++
        }
        timer = setTimeout(enableAutoShowTooltips, AUTO_SHOW_DELAY);
    }
    
    function disableAutoShowTooltips() {
        clearTimeout(timer)
    }
    
    function showTooltip() {
        disableAutoShowTooltips();
        tooltips.removeClass('active');
        $(this).addClass('active');
    }
    
    function hideTooltip() {
        enableAutoShowTooltips();
        tooltips.removeClass('active');
    }
}
// End Tooltips functional

// Tabs functional
function initTabs () {
    if(window.innerWidth > 690){
        (function() {
            var selectors = {
                nav: '[data-features-nav]',
                tabs: '[data-features-tabs]',
                active: '.__active'
            }
            var classes = {
                active: '__active'
            }
            $('a', selectors.nav).on('click', function(e) {
                let $this = $(this)[0];
                $(selectors.active, selectors.nav).removeClass(classes.active);
                $($this).addClass(classes.active);
                $('li', selectors.tabs).removeClass(classes.active);
                $($this.hash, selectors.tabs).addClass(classes.active);
                return false
            });
        }());
    }
}
// end Tabs functional

// STICKY MENU
var lastScrollTop = 0;

$(window).ready(function () {
    if ($(this).scrollTop() > 0) {
        $("header").addClass("show-menu");
    }
});

$(window).scroll(function (e) {
    var currentScrollTop = $(this).scrollTop();
    if (currentScrollTop > 0) {
        $("header").addClass("show-menu");
    } else {
        $("header").removeClass("show-menu");
    }
    lastScrollTop = currentScrollTop;
});
// END STICKY MENU

// drop down menu
$('.has-expand .menu__item__link').click(function(e){
    e.preventDefault();
})
$('.has-expand').hover(showExpand, hideExpand);

function showExpand() {
    $('.has-expand').removeClass('active')
    $(this).addClass('active')
}

function hideExpand() {
    $('.has-expand').removeClass('active')
}
// end drop down menu

window.onload = function () {
    $('.hero-section').addClass('load')
    //Image lazy load
    loadImgLazy();
    initTolltips();
    initTabs();
};

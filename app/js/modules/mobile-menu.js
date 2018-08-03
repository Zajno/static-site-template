import jQuery from 'jquery';
import TweenLite from 'gsap/TweenLite';

const $ = jQuery;
const easings = {
    inOut: 'Power1.easeInOut',
};

const styles = {
    menuOpen: 'mobile-menu-open',
};

function init() {
    $('.burger-menu__link').click(function (e) {
        e.preventDefault();
    });

    function addClassArrow(expandMenuAttr) {
        $(`.expand-link[data-expand = ${expandMenuAttr}]`).toggleClass('show-arrow');
    }

    const $menu = {
        body: $('body'),
        main: $('#mobile-menu'),
    };

    // SHOW MOBILE MENU
    $('#mob-menu-link').click(function () {
        document.ontouchmove = function (event) {
            event.preventDefault();
        };
        $menu.body.addClass(styles.menuOpen);
        TweenLite.to($menu.main, 0.4, { y: 0 });
        TweenLite.to($('#mobile-menu-sail-l'), 0.6, { y: 0, delay: 0.1 });
        TweenLite.to($('#mobile-menu-sail-r'), 0.6, { y: 0, delay: 0.2 });
        TweenLite.to($('.mobile-menu-link'), 0.6, { y: 0, delay: 0.45, ease: easings.inOut });
        TweenLite.to($('#close-mob-menu'), 0.5, { opacity: 0.6, delay: 1 });
    });

    $('#close-mob-menu').click(function () {
        document.ontouchmove = function () {
            return true;
        };

        $menu.body.removeClass(styles.menuOpen);
        TweenLite.to($('.mobile-menu-links-list .mobile-menu-link'), 0.6, { y: '-100%', delay: 0.1, ease: easings.inOut });
        TweenLite.to($('.expand-list'), 0.4, { x: '100%', delay: 0.1, ease: easings.inOut });
        TweenLite.to($('#mobile-menu-sail-l'), 0.5, { y: '-100%', delay: 0.6 });
        TweenLite.to($('#mobile-menu-sail-r'), 0.5, { y: '-100%', delay: 0.65, onComplete: clearMenuProps });
        TweenLite.to($('#close-mob-menu'), 0.5, { opacity: 0, delay: 0.2 });
    });

    function clearMenuProps() {
        TweenLite.set('#mobile-menu-list', { clearProps: 'all' });
        TweenLite.set('#mobile-menu', { clearProps: 'all' });
        TweenLite.set('#mobile-menu-sail-l', { clearProps: 'all' });
        TweenLite.set('#mobile-menu-sail-r', { clearProps: 'all' });
        TweenLite.set('#mobile-menu', { clearProps: 'all' });
        TweenLite.set('.mobile-menu-link', { clearProps: 'all' });
        TweenLite.set('#close-mob-menu', { clearProps: 'all' });
        TweenLite.set('.expand-list', { clearProps: 'all' });
        TweenLite.set('.expand-link', { clearProps: 'all' });
        $('.expand-link').removeClass('active show-arrow');
    }

    $('.expand-link').click(function (e) {
        e.preventDefault();

        const attr = $(this).attr('data-expand');

        if ($(this).siblings('.expand-link').hasClass('active')) {

            const attrSiblings = $(this).siblings('.expand-link.active').attr('data-expand');
            const expandMenuSiblings =  $menu.main.find('.' + attrSiblings);

            $('.expand-link').removeClass('active');
            TweenLite.to(expandMenuSiblings[0], 0.5, { x: '100%', ease: easings.inOut });
        }

        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            openExpand(attr);
        } else {
            closeExpand(attr);
        }
    });

    function openExpand(attr) {
        const expandMenu = $('.expand-list.' + attr);

        TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + '] .mobile-menu-link'), 0.4, { opacity: 1, color: '#ffffff', ease: easings.inOut });

        if (window.innerWidth > 850) {
            TweenLite.to($('.mobile-menu-links-list'), 0.3, { transform: 'translate(-30.8vw, 0)', ease: easings.inOut });
            TweenLite.to(expandMenu[0], 0.3, { transform: 'translate(50vw, 0)', delay: 0.1, ease: easings.inOut });
            TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand !=' + attr + '] .mobile-menu-link'), 0.4, { opacity: 0.5, color: '#9babff', ease: easings.inOut });
        } else if (window.innerWidth > 690) {
            TweenLite.to($('.mobile-menu-links-list'), 0.3, { transform: 'translate(-31.4vw, 0)', ease: easings.inOut });
            TweenLite.to(expandMenu[0], 0.3, {
                transform: 'translate(50vw, 0)',
                delay: 0.1,
                ease: easings.inOut,
            });
            TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand !=' + attr + '] .mobile-menu-link'), 0.4, { opacity: 0.5, color: '#9babff', ease: easings.inOut });
        } else {
            TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap .mobile-menu-link'), 0.5, {
                y: '-100%',
                ease: easings.inOut,
                onComplete: function () {
                    addClassArrow(attr);
                    TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + ']'), 0.1, { position: 'absolute', top: 0, delay: 0, ease: easings.inOut });
                    TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + '] .mobile-menu-link'), 0.1, {
                        paddingLeft: '20px', ease: easings.inOut, delay: 0,
                    });
                    TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + '] .mobile-menu-link'), 0.4, {
                        y: '0%', ease: easings.inOut, delay: 0.1,
                    });
                    TweenLite.to(expandMenu[0], 0.3, { transform: 'translate(9.6vw, 0)', delay: 0.15 });
                },
            });
        }
    }


    function closeExpand(attr) {
        const expandMenu = $('.expand-list.' + attr);

        if (window.innerWidth > 690) {
            TweenLite.to(expandMenu[0], 0.3, {
                x: '100%',
                ease: easings.inOut,
                onStart: function () {
                    TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand !=' + attr + '] .mobile-menu-link'), 0.5, { opacity: 1, color: '#ffffff', ease: easings.inOut, delay: 0.1 });
                },
            });
            TweenLite.to($('.mobile-menu-links-list'), 0.3, { x: '0%', ease: easings.inOut });
        } else {
            TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + '] .mobile-menu-link'), 0.4, {
                y: '-100%',
                ease: easings.inOut,
                onComplete: function () {
                    addClassArrow(attr);
                    TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + ']'), 0.1, { position: 'relative', top: 0, delay: 0, ease: easings.inOut });
                    TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + '] .mobile-menu-link'), 0.1, {
                        paddingLeft: '0px', ease: easings.inOut, delay: 0,
                    });
                }
            });
            TweenLite.to(expandMenu[0], 0.4, {
                x: '100%',
                ease: easings.inOut,
                onComplete: function () {
                    TweenLite.to($('.mobile-menu-links-list .mobile-menu-link-wrap .mobile-menu-link'), 0.5, { y: '0%', ease: easings.inOut });
                },
            });
        }
    }
}

export default {
    init,
};

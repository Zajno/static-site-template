$('.burger-menu__link').click(function (e){
    e.preventDefault();
})
// SHOW MOBILE MENU
$('#mob-menu-link').click(function () {
    document.ontouchmove = function(event){
        event.preventDefault();
    }
    $('body').addClass('mobile-menu-open');
    TweenMax.to($('#mobile-menu'), 0.6, { y: 0 })
    TweenMax.to($('#mobile-menu-sail-l'), 0.6, { y: 0, delay: 0.1 })
    TweenMax.to($('#mobile-menu-sail-r'), 0.6, { y: 0, delay: 0.2 })
    TweenMax.to($('.mobile-menu-link'), 1, { y: 0, delay: 0.45, ease: Power1.easeInOut, })
    TweenMax.to($('#close-mob-menu'), 0.7, { opacity: 0.6, delay: 1.4 })
})

$('#close-mob-menu').click(function () {
    document.ontouchmove = function(event){
        return true;
    }
    $('body').removeClass('mobile-menu-open');
    TweenMax.to($('.mobile-menu-links-list .mobile-menu-link'), 0.7, { y: '-100%', delay: 0.1, ease: Power1.easeInOut, })
    TweenMax.to($('.expand-list'), 0.5, { x: '100%', delay: 0.1, ease: Power1.easeInOut, })
    TweenMax.to($('#mobile-menu-sail-l'), 0.5, { y: '-100%', delay: 0.7 })
    TweenMax.to($('#mobile-menu-sail-r'), 0.5, { y: '-100%', delay: 0.75, onComplete: clearMenuProps })
    TweenMax.to($('#close-mob-menu'), 0.7, { opacity: 0, delay: 0.2 })
})

function clearMenuProps() {
    TweenMax.set('#mobile-menu-list', { clearProps: 'all' });
    TweenMax.set('#mobile-menu', { clearProps: 'all' });
    TweenMax.set('#mobile-menu-sail-l', { clearProps: 'all' });
    TweenMax.set('#mobile-menu-sail-r', { clearProps: 'all' });
    TweenMax.set('#mobile-menu', { clearProps: 'all' });
    TweenMax.set('.mobile-menu-link', { clearProps: 'all' });
    TweenMax.set('#close-mob-menu', { clearProps: 'all' });
    TweenMax.set('.expand-list', { clearProps: 'all' });
    TweenMax.set('.expand-link', { clearProps: 'all' });
    $('.expand-link').removeClass('active');
}

$('.expand-link').click(function () {
    $(this).toggleClass('active');
    var attr = $(this).attr('data-expand');
    var expandMenu = $('#mobile-menu').find('.' + attr);
    if ($(this).hasClass('active')) {
        if (window.innerWidth > 850) {
            TweenMax.to($('.mobile-menu-links-list'), 0.3, { transform: 'translate(-30.8vw, 0)', ease: Power1.easeInOut, });
            TweenMax.to(expandMenu[0], 0.3, {
                transform: 'translate(50vw, 0)', delay: 0.1, ease: Power1.easeInOut, onComplete: function () {
                    TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand !=' + attr + '] .mobile-menu-link'), 0.5, { opacity: 0.5, color: '#9babff', ease: Power1.easeInOut, delay: 0.1 })
                }
            })
        } else if (window.innerWidth > 690) {
            TweenMax.to($('.mobile-menu-links-list'), 0.3, { transform: 'translate(-31.4vw, 0)', ease: Power1.easeInOut, });
            TweenMax.to(expandMenu[0], 0.3, {
                transform: 'translate(50vw, 0)', delay: 0.1, ease: Power1.easeInOut, onComplete: function () {
                    TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand !=' + attr + '] .mobile-menu-link'), 0.5, { opacity: 0.5, color: '#9babff', ease: Power1.easeInOut, delay: 0.1 })
                }
            })
        } else {
            TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap .mobile-menu-link'), 0.5, {
                y: '-100%', ease: Power1.easeInOut, onComplete: function () {
                    TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + ']'), 0.3, { position: 'absolute', top: 0, delay: 0.1, ease: Power1.easeInOut })
                    TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + '] .mobile-menu-link'), 0.5, {
                        y: '0%', ease: Power1.easeInOut, delay: 0.1, onComplete: function () {
                            TweenMax.to(expandMenu[0], 0.3, { transform: 'translate(9.6vw, 0)', delay: 0.1, ease: Power1.easeInOut })
                        }
                    })
                }
            });
        }
    } else {
        if (window.innerWidth > 690) {
            TweenMax.to(expandMenu[0], 0.3, {
                x: '100%', ease: Power1.easeInOut, onStart: function () {
                    TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand !=' + attr + '] .mobile-menu-link'), 0.5, { y: '0%', opacity: 1, color: '#ffffff', ease: Power1.easeInOut, delay: 0.1 })
                }
            });
            TweenMax.to($('.mobile-menu-links-list'), 0.3, { x: '0%', ease: Power1.easeInOut, })
        } else {
            TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + '] .mobile-menu-link'), 0.5, {
                y: '-100%', ease: Power1.easeInOut, onComplete: function () {
                    TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap[ data-expand =' + attr + ']'), 0.3, { position: 'relative', top: 0, delay: 0.1, ease: Power1.easeInOut })
                    TweenMax.to(expandMenu[0], 0.3, {
                        x: '100%', ease: Power1.easeInOut, onComplete: function () {
                            TweenMax.to($('.mobile-menu-links-list .mobile-menu-link-wrap .mobile-menu-link'), 0.5, { y: '0%', ease: Power1.easeInOut, delay: 0.1 })
                        }
                    });
                }
            })
        }
    }
})

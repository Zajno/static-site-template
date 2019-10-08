import TweenMax, { Power1 } from 'gsap/TweenMax';

class MobileMenu {
    constructor(menu, btn) {
        this.menu = menu;
        this.btn = btn;

        this.leftSail = document.getElementById('mobile-menu-sail-l');
        this.rightSail = document.getElementById('mobile-menu-sail-r');
        this.list = document.getElementById('#mobile-menu-list');
        this.links = document.querySelectorAll('.mobile-menu-link');

        this.isOpen = false;
        this.toggleState = this.toggleState.bind(this);
        this.setupBurger();
    }

    open() {
        if (this.isOpen)
            return;
        this.menu.classList.add('opend');
        this.btn.classList.add('active');
        TweenMax.to(this.menu, 0.5, { y: 0 });
        TweenMax.to(this.leftSail, 0.6, { y: 0, delay: 0.1 });
        TweenMax.to(this.rightSail, 0.6, { y: 0, delay: 0.2 });
        TweenMax.staggerTo(this.links, 0.75, {
            y: 0, ease: Power1.easeInOut,
            onComplete: () => {
                this.isOpen = true;
            },
        }, 0.1);
    }

    close() {
        if (!this.isOpen)
            return;
        this.menu.classList.remove('opend');
        this.btn.classList.remove('active');
        TweenMax.to(this.links, 0.75, { y: '-100%', delay: 0.1, ease: Power1.easeInOut});
        TweenMax.to(this.leftSail, 0.2, { y: '-100%', delay: 0.7 });
        TweenMax.to(this.rightSail, 0.2, {
            y: '-100%',
            delay: 0.75,
            onComplete: () => {
                this.isOpen = false;
                this.clearProps();
            },
        });
    }

    clearProps() {
        // TweenMax.set('#mobile-menu-list', { clearProps: 'all' });
        TweenMax.set(this.menu, { clearProps: 'all' });
        TweenMax.set(this.leftSail, { clearProps: 'all' });
        TweenMax.set(this.rightSail, { clearProps: 'all' });
        TweenMax.set(this.links, { clearProps: 'all' });
    }

    setupBurger() {
        this.btn.addEventListener('click', this.toggleState);
    }

    toggleState() {
        if (this.menu.classList.contains('opend')) {
            this.close();
        } else {
            this.open();
        }
    }
}

const btn = document.querySelector('.hamburger');
const menu = document.getElementById('mobile-menu');

export default new MobileMenu(menu, btn);

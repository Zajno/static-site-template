import gsap, { TweenMax, Power1 } from 'gsap';

class MobileMenu {

    private leftSail: HTMLElement;
    private rightSail: HTMLElement;
    private list: HTMLElement;
    private links: NodeListOf<HTMLElement>;

    private isOpen = false;

    constructor(private readonly menu: HTMLElement, private readonly btn: HTMLElement) {
        this.leftSail = document.getElementById('mobile-menu-sail-l');
        this.rightSail = document.getElementById('mobile-menu-sail-r');
        this.list = document.getElementById('#mobile-menu-list');
        this.links = document.querySelectorAll('.mobile-menu-link');

        this.setupBurger();
    }

    open() {
        if (this.isOpen) {
            return;
        }

        this.menu.classList.add('opend');
        this.btn.classList.add('active');
        gsap.to(this.menu, 0.5, { y: 0 });
        gsap.to(this.leftSail, 0.6, { y: 0, delay: 0.1 });
        gsap.to(this.rightSail, 0.6, { y: 0, delay: 0.2 });
        gsap.to(this.links, 0.75, {
            y: 0, ease: Power1.easeInOut,
            onComplete: () => {
                this.isOpen = true;
            },
            stagger: 0.1,
        });
    }

    close() {
        if (!this.isOpen)
            return;
        this.menu.classList.remove('opend');
        this.btn.classList.remove('active');
        gsap.to(this.links, 0.75, { y: '-100%', delay: 0.1, ease: Power1.easeInOut});
        gsap.to(this.leftSail, 0.2, { y: '-100%', delay: 0.7 });
        gsap.to(this.rightSail, 0.2, {
            y: '-100%',
            delay: 0.75,
            onComplete: () => {
                this.isOpen = false;
                this.clearProps();
            },
        });
    }

    clearProps() {
        // gsap.set('#mobile-menu-list', { clearProps: 'all' });
        gsap.set(this.menu, { clearProps: 'all' });
        gsap.set(this.leftSail, { clearProps: 'all' });
        gsap.set(this.rightSail, { clearProps: 'all' });
        gsap.set(this.links, { clearProps: 'all' });
    }

    setupBurger() {
        this.btn.addEventListener('click', this.toggleState);
    }

    toggleState = () => {
        if (this.menu.classList.contains('opend')) {
            this.close();
        } else {
            this.open();
        }
    }
}

const _btn = document.querySelector('.hamburger') as HTMLElement;
const _menu = document.getElementById('mobile-menu');

export default new MobileMenu(_menu, _btn);

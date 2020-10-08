import gsap from 'gsap';

class MobileMenu {

    private body: HTMLElement;
    private items: NodeListOf<HTMLElement>;
    private links: NodeListOf<HTMLElement>;

    private isOpen = false;
    private offset = 60;

    constructor(private readonly menu: HTMLElement, private readonly btns: NodeListOf<HTMLElement>) {
        this.items = document.querySelectorAll('.mobile-menu .anim-item');
        this.links = document.querySelectorAll('.mobile-menu-link');
        this.body = document.querySelector('body');

        this.setupBurger();

        this.links.forEach(l => {
            l.addEventListener('click', e => {
                const animation = gsap.timeline({
                    immediateRender: false,
                });

                const scroll = window.scrollTo({
                    top: document.querySelector(`.${l.dataset.mobileAnchor}`).getBoundingClientRect().y + pageYOffset,
                    behavior: 'smooth',
                });

                animation
                    .add(() => scroll)
                    .addPause(0.5)
                    .add(() => this.close()).delay(1);
            });
        });
    }

    open() {
        if (this.isOpen) {
            return;
        }

        this.menu.classList.add('opened');
        this.body.classList.add('mobile-menu-open');
        this.btns.forEach(b => {
            b.classList.add('active');
        });

        gsap.fromTo(this.items, 0.5666,
            { y: -this.offset, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.0666, onComplete: () => this.isOpen = true },
        );
    }

    close() {
        if (!this.isOpen) {
            return;
        }

        gsap.fromTo(this.items, 0.5666,
            { y: 0, autoAlpha: 1 },
            { y: this.offset, autoAlpha: 0, stagger: 0.0666, onComplete: () => {
                this.menu.classList.remove('opened');
                this.body.classList.remove('mobile-menu-open');
                this.btns.forEach(b => {
                    b.classList.remove('active');
                });

                this.isOpen = false;
            } },
        );
    }

    clearProps() {
        gsap.set(this.items, { clearProps: 'all' });
    }

    setupBurger() {
        this.btns.forEach(b => {
            b.addEventListener('click', this.toggleState);
        });
    }

    toggleState = () => {
        if (this.menu.classList.contains('opened')) {
            this.close();
        } else {
            this.open();
        }
    }
}

const _btn = document.querySelectorAll('.mobile-menu-button') as NodeListOf<HTMLElement>;
const _menu = document.getElementById('mobile-menu');

export default new MobileMenu(_menu, _btn);

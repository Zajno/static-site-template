
type languageType = {
    class: string,
    param: 'en' | 'ck' | 'ja',
};

export default class DropDown {
    mainLink: HTMLElement;
    subMenuLinks: NodeListOf<Element>;
    dropLink: HTMLElement;
    enBtn: HTMLElement;
    esBtn: HTMLElement;
    activeLanguage: languageType;
    btnMob: NodeListOf<Element>;
    ulrParam: URLSearchParams;

    constructor() {
        this.ulrParam = new URLSearchParams;
        this.btnMob = document.querySelectorAll('.mobile-language');
        this.dropLink = document.querySelector('.has-drop-down');
        this.mainLink = this.dropLink.querySelector('.drop-down-link');

        this.subMenuLinks = this.dropLink.querySelectorAll('.drop-down-link--sub');

        this.mainLink.addEventListener('click', e => {
            e.preventDefault();
            this.dropLink.classList.toggle('active');
        });

        this.mainLink.addEventListener('blur', () => {
            this.dropLink.classList.remove('active');
        });

        document.body.addEventListener('click', (e) => {
            // @ts-ignore
            if (e.target !== this.mainLink && (e.target.parentNode !== this.dropLink && !e.target.classList.contains('js-btn-switch'))) {
                this.dropLink.classList.remove('active');
            }
        });
    }
}

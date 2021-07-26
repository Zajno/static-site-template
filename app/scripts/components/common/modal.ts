// core
import { TimelineMax } from 'gsap';
import Component, { ComponentConfig } from 'app/core/component';

export type ModalConfig = ComponentConfig & {
    modal: HTMLElement;
    modalContent?: any | null;
    openButton: any;
    closeButton: any;
    modalActiveClass?: string;
};

export default class Modal extends Component<ModalConfig> {
    private _body: HTMLBodyElement;
    private _modalActiveClass: string;
    public openButton: Element;
    public closeButton: Element;
    opened: boolean;
    closed: boolean;

    public async doSetup() {
        this._body = document.querySelector('body');

        this._modalActiveClass = this._config.modalActiveClass || 'modal-active';

        this.openButton = this._config.openButton;
        this.closeButton = this._config.closeButton;

        this.opened = false;
        this.closed = !this.opened;

        if (Array.isArray(this.openButton)) {
            this.openButton.forEach(button => {
                button.addEventListener('click', event => {
                    event.preventDefault();
                    this.show();
                });
            });
        } else {
            this.openButton.addEventListener('click', event => {
                event.preventDefault();
                this.show();
            });
        }

        this.closeButton.addEventListener('click', event => {
            event.preventDefault();
            this.hide();
        });
    }

    openModal() {
        this._body.classList.add(this._modalActiveClass);

        document.ontouchmove = event => {
            event.preventDefault();
        };

        this.opened = true;
        this.closed = !this.opened;
    }

    closeModal() {
        this._body.classList.remove(this._modalActiveClass);

        document.ontouchmove = () => {
            return true;
        };

        this.closed = true;
        this.opened = !this.closed;
    }

    show() {
        const animation = new TimelineMax({
            immediateRender: false,
            onComplete: () => {
                this.openModal();
            },
        });

        animation
            .add(() => this._config.modal.classList.add(this._modalActiveClass))
            .fromTo(this._config.modal, 0.75, { autoAlpha: 0 }, { autoAlpha: 1 });
    }

    hide() {
        const animation = new TimelineMax({
            immediateRender: false,
            onComplete: () => {
                this.closeModal();
            },
        });

        animation
            .fromTo(this._config.modal, 0.375, { autoAlpha: 1 }, { autoAlpha: 0 })
            .add(() => this._config.modal.classList.remove(this._modalActiveClass));
    }
}

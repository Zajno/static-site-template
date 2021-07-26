import Page from 'app/core/page';
import Lazy from 'app/components/lazy';
// import Modal from 'app/components/common/modal';

/** Base page for all site pages */
export default abstract class CommonPage extends Page {
    // private modal: Modal;

    start() {
        super.start();
        Lazy.RegisterAllImages();
        window.appReady(() => {
            Lazy.BeginLoading();
        });

        // example setup modal component

        // this.modal = new Modal({
        //     el: document.querySelector('.modal-cs'),
        //     modal: document.querySelector('.modal-cs'),
        //     openButton: document.querySelector('.modal-cs-open'),
        //     closeButton: document.querySelector('.modal-cs .modal-close'),
        // });
        // this.modal.doSetup();

    }
}

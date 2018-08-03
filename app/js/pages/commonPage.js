import Page from 'core/page';

export default class CommonPage extends Page {

    _setup() {
        super._setup();

        if (this.enableVideoModals) {
            videoModals.init();
        }
    }

    start() {
        super.start();

        window.appReady(() => {
            if (this.enableHeader || this.enabledImagesLazyLoad) {
                imagesLazyLoad.doLoad();
            }

            addLoadClass();
        });

        // logger.log(document.querySelectorAll('input.-webkit-autofill'));
    }

    resize(width, height) {
        super.resize(width, height);

    }

    scroll(scrollDirection, scrollPosition) {
        super.scroll(scrollDirection, scrollPosition);

        this._header.scroll(scrollDirection, scrollPosition);
    }

    get enableHeader() { return true; }

    get enabledImagesLazyLoad() { return true; }

    get enableVideoModals() { return false; }
}

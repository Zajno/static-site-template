import Page from 'core/page';

import initVideos from 'modules/initVideos';
import stickyHeader from 'modules/stickyHeader';
import imagesLazyLoad from 'modules/imagesLazyLoad';
import mobileMenu from 'modules/mobile-menu';

import ensureScripts from 'modules/ensureSripts';

export default class CommonPage extends Page {

    _setup() {
        super._setup();

        if (this.enabledImagesLazyLoad) {
            imagesLazyLoad.doLoad();
        }

        if (this.enabledMobileMenu) {
            mobileMenu.init();
        }

    }

    async _loadModulesAsync() {
        await super._loadModulesAsync();

        await ensureScripts.gsapAsync();
    }

    resize(width, height) {
        super.resize(width, height);

        if (this.enabledVideosReplace) {
            initVideos(width);
        }
    }

    scroll(scrollDirection, scrollPosition) {
        super.scroll(scrollDirection, scrollPosition);

        if (this.enabledStickyHeader) {
            stickyHeader.update(scrollPosition);
        }
    }

    get enabledVideosReplace() {
        return true;
    }

    get enabledStickyHeader() {
        return true;
    }

    get enabledImagesLazyLoad() {
        return true;
    }

    get enabledMobileMenu() {
        return true;
    }

}

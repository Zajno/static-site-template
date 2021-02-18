import 'styles/base.sass';

import Page from 'app/core/page';
import Lazy from 'app/components/lazy';

/** Base page for all site pages */
export default abstract class CommonPage extends Page {

    start() {
        super.start();
        Lazy.RegisterAllImages();
        window.appReady(() => {
            Lazy.BeginLoading();
        });
    }
}

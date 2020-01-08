import 'styles/base.sass';

import Page from 'app/core/page';
import Breakpoints from 'app/appBreakpoints';
import Lazy from 'app/components/lazy';

export default abstract class CommonPage extends Page {

    start() {
        super.start();
        Lazy.RegisterAllImages();
        window.appReady(() => {
            Lazy.BeginLoading();
        });
    }

    resize() {
        super.resize();
        Breakpoints.resize(this.width, this.height);
    }

    // async setupPageAsync() {
    //     super.setupPageAsync();
    // }

    // scroll(scrollDirection, scrollPosition) {
    //     super.scroll(scrollDirection, scrollPosition);
    // }

}
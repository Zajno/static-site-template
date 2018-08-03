import 'jquery';
import 'gsap/CSSPlugin';
import TweenLite from 'gsap/TweenLite';

import CreateDefaultPage from 'pages/defaultPage';

TweenLite.lagSmoothing(150, 16);

export default {
    CreateDefaultPage,
};

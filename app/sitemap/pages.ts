import {
    HomeCopyright,
} from './copyright';
import { HomeCopyrightShape } from './copyright/home';
import { PageDependency, SitePage } from './types';

const Home: SitePage<HomeCopyrightShape> = {
    id: 'home',
    entryPoint: './app/scripts/pages/homePage.ts',
    templateName: 'app/html/index.ejs',
    output: {
        path: 'index.html',
        href: '/',
        title: 'Zajno | Digital Design Agency',
        description: 'Full-service digital design and development agency specializing in UX/UI design, crafting thought-out personalized experiences for web and mobile.',
        image: 'zajno.png',
        locale: HomeCopyright.default,
        copy: HomeCopyright[HomeCopyright.default],
    },

    // TODO: Add what needed
    // i18n: [ // looks similar but in future more fields can be different
    //     { locale: 'en', href: '/en', path: 'en/index.html', copy: HomeCopyright.en },
    //     { locale: 'ja', href: '/ja', path: 'ja/index.html', copy: HomeCopyright.ja },
    //     { locale: 'ko', href: '/ko', path: 'ko/index.html', copy: HomeCopyright.ko },
    // ],
};

const Page404: SitePage = {
    id: '404',
    entryPoint: [
        './app/styles/base.sass',
        './app/styles/page404',
    ],
    templateName: 'app/html/page-404.ejs',
    output: {
        path: '404.html',
        href: '/404',
        title: 'Page Not Found',
        description: '',
        image: 'zajno.png',
        locale: 'en',
        copy: undefined,
    },
    disableScripts: true,
};

const NotSupported: SitePage = {
    id: 'not-supported',
    entryPoint: './app/scripts',
    templateName: 'app/html/common/ie.ejs',
    output: {
        path: 'not-supported.html',
        href: '/not-supported',
        title: '',
        description: '',
        image: 'zajno.png',
        locale: 'en',
        copy: undefined,
    },
    disableScripts: true,
};

const NoScript: SitePage = {
    id: 'no-script',
    entryPoint: [
        './app/styles/base.sass',
        './app/styles/noScript',
    ],
    templateName: 'app/html/no-script.ejs',
    output: {
        path: 'no-script.html',
        href: '/',
        title: 'Enable JavaScript',
        description: 'This website requires scripts to be enabled/allowed in your browser.',
        image: 'zajno.png',
        locale: 'en',
        copy: undefined,
    },
    inlineCss: true,
    disableScripts: 'force',
    noIndex: true,
};

export const NoScriptId = NoScript.id;

export const Dependencies: PageDependency[] = [
    { name: 'polyfills', import: './app/scripts/polyfills', critical: true },
];

const pages: SitePage[] = [
    Home,
    Page404,
    NotSupported,
    NoScript,
];

export default pages;

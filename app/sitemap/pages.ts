import {
    HomeCopyright,
    Locales,
} from './copyright';
import { HomeCopyrightShape } from './copyright/home';

/** Page output information, can be used as a default or as localized version */
export type PageOutput<TCopy = any> = {
    /** output file name & path, relative to dist */
    path: string,
    /** how this instance should be referenced via URL, relative path */
    href: string,
    /** page's title, also used in meta */
    title: string,
    /** page's description for meta */
    description: string,
    /** page's meta image, relative to `assets/img` folder */
    image: string,
    /** page's locale */
    locale: Locales,
    /** page's copy, usually a structured object specific for this page type */
    copy: TCopy,
};

export type SitePage<TCopy = any> = {
    /** unique page ID */
    id: string,
    /** JS/TS entry point for this particular page, relative to project root */
    entryPoint: string,
    /** HTML/EJS template, relative to project root */
    templateName: string,

    /** default output */
    output: PageOutput<TCopy>;

    /** optional localized page outputs additional to default output */
    i18n?: Partial<PageOutput<TCopy>>[],
};

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

    // TODO: Remove what is not needed
    // i18n: [ // looks similar but in future more fields can be different
    //     { locale: 'en', href: '/en', path: 'en/index.html', copy: HomeCopyright.en },
    //     { locale: 'ja', href: '/ja', path: 'ja/index.html', copy: HomeCopyright.ja },
    //     { locale: 'ko', href: '/ko', path: 'ko/index.html', copy: HomeCopyright.ko },
    // ],
};

const Page404: SitePage = {
    id: '404',
    entryPoint: './app/scripts/pages/page404.ts',
    templateName: 'app/html/page-404.ejs',
    output: {
        path: 'page-404.html',
        href: '/',
        title: '',
        description: '',
        image: 'logo.png',
        locale: 'en',
        copy: undefined,
    },
};

const NoScript: SitePage = {
    id: 'noScript',
    entryPoint: './app/scripts/pages/noScript.ts',
    templateName: 'app/html/no-script.ejs',
    output: {
        path: 'no-script.html',
        href: '/',
        title: '',
        description: '',
        image: 'logo.png',
        locale: 'en',
        copy: undefined,
    },
};

const pages: SitePage[] = [
    Home,
    Page404,
    NoScript,
];

export default pages;

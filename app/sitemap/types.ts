import type {
    Locales,
} from './copyright';

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
    entryPoint: string | string[],
    /** HTML/EJS template, relative to project root */
    templateName: string,

    /** default output */
    output: PageOutput<TCopy>;

    /** optional localized page outputs additional to default output */
    i18n?: Partial<PageOutput<TCopy>>[],

    inlineCss?: boolean,
    disableScripts?: boolean | 'force',
    noIndex?: boolean,
};

export type PageDependency = {
    name: string,
    import: string,
    critical?: boolean,
};

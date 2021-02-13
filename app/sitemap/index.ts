/* eslint-disable no-console */
import { URL } from 'url';
import Pages, { SitePage } from './pages';
import { Hostname } from './hostname';
import { AllLocales } from './copyright';

type CopyShape = {
    page: Object,
    header: Object,
    footer: Object,
    modalMenu: Object,
};

export type SitePageOutput = SitePage & {
    output: string,
    baseUrl: string,
    locale?: string,
    copy?: CopyShape,
};

type SitemapPageLink = { lang: string, url: string };

const PagesFlatten: SitePageOutput[] = [];
const SitemapInfo: { path: string, links?: SitemapPageLink[] }[] = [];

const addPage = (p: SitePageOutput, links?: SitemapPageLink[]) => {
    PagesFlatten.push(p);
    if (p.baseUrl) {
        SitemapInfo.push({ path: p.baseUrl, links });
    }
};

Pages.forEach(p => {
    let path: string;

    if (p.outputFileName && typeof p.outputFileName === 'string') {
        path = p.outputFileName;
    } else {
        path = `${p.id}/index.html`;
    }

    if (!p.locales) {
        addPage({
            ...p,
            output: path,
            baseUrl: '/',
        });
        return;
    }

    const localePages = AllLocales.map(locale => {
        const pageCopy = p.locales[locale];
        const headerCopy = p.header.copy[locale] || p.header.copy.default;
        const footerCopy = p.footer.copy[locale] || p.footer.copy.default;
        const modalMenuCopy = p.modalMenu.copy[locale] || p.modalMenu.copy.default;
        if (!pageCopy || !headerCopy || !footerCopy || !modalMenuCopy) {
            return null;
        }

        let baseUrl: string = undefined;
        if (p.locales.default !== locale) {
            const localeOutput = p.localesOutput && p.localesOutput[locale];
            path = localeOutput?.output || `${p.id}/${locale}/index.html`;
            baseUrl = localeOutput?.href;
        }

        const output: SitePageOutput = {
            ...p,
            output: path,
            copy: {
                page: pageCopy,
                header: headerCopy,
                footer: footerCopy,
                modalMenu: modalMenuCopy,
            },
            baseUrl: baseUrl || '/',
            locale,
        };

        return output;
    }).filter(pp => pp);

    if (!localePages.length) {
        return;
    }

    const links: SitemapPageLink[] = localePages.map(pp => ({
        lang: pp.locale,
        url: new URL(pp.baseUrl, Hostname).href,
    }));

    localePages.forEach(pp => {
        addPage(pp, links);
    });
});

const ApplicationEntryPoints = (function () {
    const parseEntryPoint = {
        polyfills: './app/scripts/polyfills',
    };
    Pages.forEach(item => {
        parseEntryPoint[`${item.id}`] = `${item.entryPoint}`;
    });
    return parseEntryPoint;
})();

// log only if we're in initial command line run context
if (process.env.PATH) {
    console.log(
        '[SITEMAP] Generated the following pages: ',
        PagesFlatten.map(pf => ({ id: pf.id, path: pf.output, template: pf.templateName, locale: pf.locale })),
    );

    console.log('[SITEMAP] Generated the following entrypoints: ', ApplicationEntryPoints);
}

export function getPage(page: SitePageOutput) {
    if (!page) {
        return null;
    }

    return PagesFlatten.find(p => p.id === page.id && (!page.locale || page.locale === p.locale));
}

export function getPages(page: SitePageOutput) {
    if (!page) {
        return null;
    }

    return PagesFlatten.filter(p => p.id === page.id);
}

export function getLocaleHref(page: SitePageOutput, lang: string) {
    if (lang === page.locale) {
        return '';
    }

    const origPage = Pages.find(pp => pp.id === page.id);
    const lo = origPage.localesOutput[lang];
    const href = lo && lo.href;
    return `href="${href || `#${lang}`}"`;
}

export {
    Pages,
    PagesFlatten,
    SitemapInfo,
    Hostname,
    ApplicationEntryPoints,
};

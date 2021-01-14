import Pages, { SitePage } from './pages';
import { Hostname } from './hostname';
import { AllLocales } from './copyright';

type CopyShape = {
    page: Object,
    header: Object,
};

export type SitePageOutput = SitePage & {
    output: string,
    baseUrl: string,
    locale?: string,
    copy?: CopyShape,
};

const PagesFlatten: SitePageOutput[] = [];

const addPage = (p: SitePage, output: string, copy: CopyShape = null, locale: string = null, baseUrl = '/') => {
    const res: SitePageOutput = {
        ...p,
        output: output,
        copy: copy,
        baseUrl,
        locale,
    };

    PagesFlatten.push(res);
};

Pages.forEach(p => {
    let path: string;

    if (p.outputFileName && typeof p.outputFileName === 'string') {
        path = p.outputFileName;
    } else {
        path = `${p.id}/index.html`;
    }

    if (!p.locales) {
        addPage(p, path);
        return;
    }

    AllLocales.forEach(locale => {
        const pageCopy = p.locales[locale];
        const headerCopy = p.header.copy[locale] || p.header.copy.default;
        if (!pageCopy || !headerCopy) {
            return;
        }

        let baseUrl: string = undefined;
        if (p.locales.default !== locale) {
            const localeOutput = p.localesOutput && p.localesOutput[locale];
            path = localeOutput?.output || `${p.id}/${locale}/index.html`;
            baseUrl = localeOutput?.href;
        }

        addPage(p, path, { page: pageCopy, header: headerCopy }, locale, baseUrl);
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

export function getLocaleHref(page: SitePageOutput, lang: string) {
    if (lang === page.locale) {
        return '';
    }

    const origPage = Pages.find(pp => pp.id === page.id);
    const lo = origPage.localesOutput[lang];
    const href = lo && lo.href;
    return `href="${href || `#${lang}`}"`;
};

export {
    Pages,
    PagesFlatten,
    Hostname,
    ApplicationEntryPoints,
};

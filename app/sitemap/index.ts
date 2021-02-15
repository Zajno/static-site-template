/* eslint-disable no-console */
import { URL } from 'url';
import Pages, { SitePage, PageOutput } from './pages';
import { Hostname } from './hostname';
import { AllLocales } from './copyright';
import { getCopyForLocale as getCommonCopyForLocale } from './common';

export type SitePageOutput = Omit<SitePage, 'i18n'> & {
    canonical: string,
    common: ReturnType<typeof getCommonCopyForLocale>,
    isAlternative?: boolean,
};

type SitemapPageLink = { lang: string, url: string };

const PagesFlatten: SitePageOutput[] = [];
const SitemapInfo: { path: string, links?: SitemapPageLink[] }[] = [];
const PagesAlternatives: Record<string, { default: string, links: SitemapPageLink[] }> = { };

const addPage = (p: SitePageOutput, links?: SitemapPageLink[]) => {
    PagesFlatten.push(p);
    if (p.output.href) {
        SitemapInfo.push({ path: p.output.href, links });
    }
    return p;
};

function getOutput(p: SitePage, output: Partial<PageOutput>, strict = true): SitePageOutput {
    if (strict && !AllLocales.includes(output.locale)) {
        return null;
    }

    const common = getCommonCopyForLocale(output.locale, strict);
    if (!common) {
        return null;
    }

    const resOutput = {
        ...p.output,
        ...output,
    };

    const altPage: SitePageOutput = {
        ...p,
        output: resOutput,
        canonical: new URL(resOutput.href, Hostname).href,
        common,
    };

    altPage.output.path = altPage.output.path || `${p.id}/${resOutput.locale}/index.html`;

    return altPage;
}

Pages.forEach(p => {
    p.output.path = p.output.path || `${p.id}/index.html`;
    p.output.href = p.output.href || `/${p.id}`;

    // localized alternatives for the page
    const alts = p.i18n?.map(alt => getOutput(p, alt)).filter(a => a);
    const altLinks: SitemapPageLink[] = alts?.map(pp => ({
        lang: pp.output.locale,
        url: pp.canonical,
    }));

    const defaultPage = addPage(getOutput(p, p.output, false), altLinks);
    PagesAlternatives[p.id] = { default: defaultPage.canonical, links: altLinks || [] };

    alts?.forEach(pp => {
        pp.isAlternative = true;
        addPage(pp, altLinks);
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
        PagesFlatten.map(pf => ({ id: pf.id, path: pf.output.path, template: pf.templateName, href: pf.output.href, locale: pf.output.locale })),
    );

    console.log('[SITEMAP] Generated the following entry points: ', ApplicationEntryPoints);
}

export function getPage(page: SitePageOutput) {
    const res = page && PagesFlatten.find(p => p.id === page.id
        && (!page.output.locale || page.output.locale === p.output.locale)
        && (page.isAlternative === p.isAlternative)
    );
	if (!res) {
		throw new Error(`Couldn't load the page '${page.id}' for locale '${page.output.locale}' `);
	}
    return res;
}

export function getPages(page: SitePageOutput) {
    if (!page) {
        return null;
    }

    return PagesFlatten.filter(p => p.id === page.id);
}

export function getLocaleHref(page: SitePageOutput, lang: string, preferAlt = false) {
    if (lang === page.output.locale) {
        // no href required
        return '';
    }

    const lps = PagesFlatten.filter(pp => pp.id === page.id && pp.output.locale === lang);
    const lp = preferAlt ? lps.find(pp => pp.isAlternative) : lps[0];
    const href = lp && lp.output.href;
    return `href="${href || `#${lang}`}"`;
}

export function getPageAlternatives(pageId: string) {
    const res = PagesAlternatives[pageId];
    if (!res) {
        throw new Error(`PagesAlternatives[${pageId}] => ${res}`);
    }
    return res;
}

export {
    Pages,
    PagesFlatten,
    SitemapInfo,
    Hostname,
    ApplicationEntryPoints,
};

/* eslint-disable no-console */
import type webpack from 'webpack';
import Pages, { Dependencies } from './pages';
import { Hostname, combineUrlWithHostname } from './hostname';
import { AllLocales } from './copyright';
import { getCopyForLocale as getCommonCopyForLocale } from './common';
import { PageOutput, SitePage } from './types';

export { NoScriptId } from './pages';

export type SitePageOutput = Omit<SitePage, 'i18n'> & {
    canonical: string,
    common: ReturnType<typeof getCommonCopyForLocale>,
    isAlternative?: boolean,
    skipRender?: boolean,
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
        canonical: combineUrlWithHostname(resOutput.href),
        common,
    };

    if (!output.path) {
        altPage.skipRender = true;
    }

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
    const result: webpack.EntryObject = { };
    const criticalDeps = Dependencies.filter(dd => dd.critical).map(dd => dd.name);

    Dependencies.forEach(dd => {
        result[dd.name] = (dd.critical || !criticalDeps.length)
            ? dd.import
            : {
                import: dd.import,
                dependOn: criticalDeps,
            };
    });

    Pages.forEach(item => {
        result[`${item.id}`] = {
            import: `${item.entryPoint}`,
            dependOn: criticalDeps,
        };
    });

    return result;
})();

export const DependenciesPriorities = Dependencies.reduce((res, dep, i) => {
    res[dep.name] = dep.critical
        ? -(Dependencies.length - i)
        : i + 1;

    return res;
}, { } as Record<string, number>);

// log only if we're in initial command line run context
if (process.env.PATH) {
    console.log(
        '[SITEMAP] Generated the following pages: ',
        PagesFlatten.map(pf => ({ id: pf.id, path: pf.output.path, template: pf.templateName, href: pf.output.href, locale: pf.output.locale, skip: pf.skipRender || false })),
    );

    console.log('[SITEMAP] Generated the following entry points: ', ApplicationEntryPoints, '\nwith priorities:', DependenciesPriorities);
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

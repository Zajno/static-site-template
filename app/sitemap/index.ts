import Pages, { SitePage } from './pages';
import { Hostname } from './hostname';

export type SitePageOutput = SitePage & { output: string };

const PagesFlatten = Pages.map(p => {
    let path;

    if (p.outputFileName) {
        path = p.outputFileName;
    } else {
        path = `${p.id}/index.html`;
    }

    const res: SitePageOutput = {
        ...p,
        output: path,
    };
    return res;
});

function getEntryPoint() {
    const parseEntryPoint = {
        polyfills: './app/scripts/polyfills',
    };
    Pages
        .forEach(item => {
            parseEntryPoint[`${item.id}`] = `${item.entryPoint}`;
        });
    return parseEntryPoint;
}

export {
    Pages,
    PagesFlatten,
    Hostname,
    getEntryPoint,
};

import { Hostname } from './hostname';
import {
    PageCopyright,
    HomeCopyright,
    HeaderCopyright,
    FooterCopyright,
    ModalMenuCopyright,
    Locales,
} from './copyright';

export type SitePage = {
    id: string,
    entryPoint: string,
    templateName: string,
    outputFileName?: string,
    title: string,
    description: string,
    canonical: string,
    image: string,
    locales?: PageCopyright<any>,
    localesOutput?: Partial<Record<Locales, { output: string, href: string }>>,
} & typeof PagesCommonData;

const PagesCommonData = {
    header: {
        copy: HeaderCopyright,
    },
    footer: {
        copy: FooterCopyright,
    },
    modalMenu: {
        copy: ModalMenuCopyright,
    },
};

const Home: SitePage = {
    ...PagesCommonData,
    id: 'home',
    templateName: 'app/html/index.ejs',
    outputFileName: 'index.html',
    title: 'Zajno | Digital Design Agency',
    description: 'Full-service digital design and development agency specializing in UX/UI design, crafting thought-out personalized experiences for web and mobile.',
    canonical: Hostname,
    image: 'og-image.jpg',
    entryPoint: './app/scripts/pages/homePage.ts',
    locales: HomeCopyright,
    localesOutput: {
        ja: { output: 'ja/index.html', href: '/ja' },
        en: { output: 'index.html', href: '/' },
    },
};

const pages: SitePage[] = [
    Home,
];

export default pages;

import { Hostname } from './hostname';

export type SitePage = {
    id: string,
    entryPoint: string,
    templateName: string,
    outputFileName?: string,
    title: string,
    description: string,
    cannonical: string,
    image: string,
};

const Home: SitePage = {
    id: 'home',
    templateName: 'app/html/index.ejs',
    outputFileName: 'index.html',
    title: 'Zajno | Digital Design Agency',
    description: 'Full-service digital design and development agency specializing in UX/UI design, crafting thought-out personalized experiences for web and mobile.',
    cannonical: Hostname,
    image: Hostname + '/image.png',
    entryPoint: './app/scripts/pages/homePage.ts',
};

const pages: SitePage[] = [
    Home,
];

export default pages;

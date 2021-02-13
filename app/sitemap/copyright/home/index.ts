import type { PageCopyright } from '../types';
import { HomeEnCopy } from './en';
import { HomeJaCopy } from './ja';

export type HomeCopyrightShape = typeof HomeEnCopy;

export const HomeCopyright: PageCopyright<HomeCopyrightShape> = {
    default: 'en',
    en: HomeEnCopy,
    ja: HomeJaCopy,
};

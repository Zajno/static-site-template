import type { PageCopyright } from '../types';
import { HomeEnCopy } from './en';
import { HomeJpCopy } from './jp';

export type HomeCopyrightShape = typeof HomeEnCopy;

export const HomeCopyright: PageCopyright<HomeCopyrightShape> = {
    default: 'en',
    en: HomeEnCopy,
    jp: HomeJpCopy,
};

import type { PageCopyright } from '../types';
import { HeaderEnCopy } from './en';
import { HeaderJaCopy } from './ja';

export type HeaderCopyrightShape = typeof HeaderEnCopy;

export const HeaderCopyright: PageCopyright<HeaderCopyrightShape> = {
    default: 'en',
    en: HeaderEnCopy,
    ja: HeaderJaCopy,
};

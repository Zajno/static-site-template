import type { PageCopyright } from '../types';
import { HeaderEnCopy } from './en';
import { HeaderJpCopy } from './jp';

export type HeaderCopyrightShape = typeof HeaderEnCopy;

export const HeaderCopyright: PageCopyright<HeaderCopyrightShape> = {
    default: 'en',
    en: HeaderEnCopy,
    jp: HeaderJpCopy,
};

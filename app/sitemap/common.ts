import {
    HeaderCopyright,
    FooterCopyright,
    ModalMenuCopyright,
    Locales,
} from './copyright';

/** Data shared with all pages & locales */
export const PagesCommonData = {
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

export function getCopyForLocale(l: Locales, strict = true): Record<keyof typeof PagesCommonData, Object> {
    const res = {
        header: PagesCommonData.header.copy[l],
        footer: PagesCommonData.footer.copy[l],
        modalMenu: PagesCommonData.modalMenu.copy[l],
    };

    if (strict && (!res.header || !res.footer || !res.modalMenu)) {
        return null;
    }

    return res;
}

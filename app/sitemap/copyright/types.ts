
export const AllLocales = ['en', 'jp', 'kr'] as const;
export type Locales = typeof AllLocales[number];

export type PageCopyright<T extends Object> = Partial<Record<Locales, T>> & { default: Locales };

import { lang } from "../lang"

const getSupportedLanguage = (): Partial<Language>[] => {
    return Object.values(lang).map((item) => ({
        name: item.name,
        flag: item.flag,
        key: item.key,
        tag: item.tag,
    }));
};

const getLanguageString = (langKey: string, key: string, typeKey: string) => {
    if (!(lang as Record<string, any>)[langKey]) {
        return key;
    }
    const langObj = (lang as Record<string, any>)[langKey] as Language;
    if (!langObj.mapping[typeKey][key]) {
        return key;
    }
    return langObj.mapping[typeKey][key]
}

export {
    getSupportedLanguage,
    getLanguageString
}
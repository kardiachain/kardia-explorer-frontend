import { atom } from "recoil";

const localLang = window.localStorage.getItem('lang') || 'en_US'
const languageAtom = atom({
    key: 'languageAtom',
    default: localLang
});

export default languageAtom;


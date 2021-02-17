import React from 'react';
import { useRecoilState } from 'recoil';
import { Dropdown } from 'rsuite';
import languageAtom from '../../../atom/language.atom';
import { getSupportedLanguage } from '../../utils/lang';

const languageList = getSupportedLanguage();

const LanguageSelect = () => {

    const [language, setLanguage] = useRecoilState(languageAtom);
    const getActiveLang = () => {
        const languageItem = languageList.find((item) => item.key === language)
        return languageItem?.name
    }

    return (
        <Dropdown title={getActiveLang()}>
            {
                languageList.map((lang) => {
                    return <Dropdown.Item
                        key={lang.key}
                        onSelect={() => {
                            setLanguage(lang.key || 'en_US')
                            window.localStorage.setItem('lang', lang.key || 'en_US')
                        }}>
                        {lang.name}
                    </Dropdown.Item>
                })
            }
        </Dropdown>
    )
}

export default LanguageSelect;
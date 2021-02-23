import React from 'react';
import { useRecoilState } from 'recoil';
import { Dropdown, Icon } from 'rsuite';
import languageAtom from '../../../atom/language.atom';
import { useViewport } from '../../../context/ViewportContext';
import { getSupportedLanguage } from '../../utils/lang';

const languageList = getSupportedLanguage();

const LanguageSelect = ({setShowMenu}: {
    setShowMenu: (isShow: boolean) => void
}) => {

    const [language, setLanguage] = useRecoilState(languageAtom);
    const { isMobile } = useViewport()
    const getActiveLang = () => {
        const languageItem = languageList.find((item) => item.key === language)
        return languageItem?.name
    }

    return (
        <Dropdown eventKey="lang" icon={<Icon className={isMobile ? "gray-highlight" : ""} icon="language" />}  title={getActiveLang()}>
            {
                languageList.map((lang) => {
                    return <Dropdown.Item
                        key={lang.key}
                        onSelect={() => {
                            setLanguage(lang.key || 'en_US')
                            window.localStorage.setItem('lang', lang.key || 'en_US')
                            setShowMenu && setShowMenu(false)
                        }}>
                        {lang.name}
                    </Dropdown.Item>
                })
            }
        </Dropdown>
    )
}

export default LanguageSelect;
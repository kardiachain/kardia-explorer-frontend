import React, { useEffect, useState } from 'react'
import { Col, FlexboxGrid, Tag } from 'rsuite'
import Button from '../../common/components/Button';
import { useViewport } from '../../context/ViewportContext';
import ListProposal from './ListProposal';
import { useHistory } from 'react-router-dom';
import { isLoggedIn } from '../../service/wallet';
import CurrentNetwork from './CurrentNetwork';
import { getCurrentNetworkParams } from '../../service/kai-explorer';
import { useRecoilValue } from 'recoil';
import languageAtom from '../../atom/language.atom';
import { getLanguageString } from '../../common/utils/lang';

const Proposal = () => {
    const { isMobile } = useViewport();
    const history = useHistory()
    const [showCurrentNetwork, setShowCurrentNetwork] = useState(false)
    const [currentNetworkParams, setCurrentNetworkParams] = useState<NetworkParams>({} as NetworkParams)
    const language = useRecoilValue(languageAtom)

    useEffect(() => {
        (async () => {
            const rs = await getCurrentNetworkParams()
            setCurrentNetworkParams(rs)
        })()
    }, [])

    return (
        <div className="container proposal-container">
            <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={10} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            {getLanguageString(language, 'NETWORK_PROPOSAL', 'TEXT')}
                        </div>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={14} style={{ textAlign: 'right' }}>
                    <Button
                        size={isMobile ? "normal" : "big"}
                        className="kai-button-gray"
                        style={{ marginBottom: 10 }}
                        onClick={() => { setShowCurrentNetwork(true) }}>
                        {getLanguageString(language, 'NETWORK_PROFILE', 'BUTTON')}
                    </Button>
                    <Button
                        size={isMobile ? "normal" : "big"}
                        style={{ marginBottom: 10 }}
                        onClick={() => { isLoggedIn() ? history.push("/wallet/proposal-create") : history.push('/wallet') }}>
                        {getLanguageString(language, 'CREATE_PROPOSAL', 'BUTTON')}
                    </Button>
                </FlexboxGrid.Item>
            </FlexboxGrid>

            <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24} md={24} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                    <ListProposal />
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <CurrentNetwork showModal={showCurrentNetwork} setShowModal={setShowCurrentNetwork} currentNetworkParams={currentNetworkParams} />
        </div>
    )
}

export default Proposal


export const RenderStatus = ({ status }: {
    status: number
}) => {

    switch (status) {
        case 0:
            return (
                <Tag color="green" className="tab tab-pending">ON GOING</Tag>
            )
        case 1:
            return (
                <Tag color="green" className="tab tab-success">SUCCESS</Tag>
            )
        case 2:
            return (
                <Tag className="tab tab-failed" color="red">FAILED</Tag>
            )
        default:
            return (
                <></>
            )
    }
}
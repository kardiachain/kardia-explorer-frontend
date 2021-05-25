import React, { useState } from 'react'
import ReactJson from 'react-json-view';
import { Link } from 'react-router-dom';
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, Input, List, Panel, Placeholder, Tag, Uploader } from 'rsuite'
import { FileType } from 'rsuite/lib/Uploader';
import {
    copyToClipboard,
    dateToUTCString,
    millisecondToHMS,
    renderCopyButton,
    renderHashString,
    renderHashToRedirect,
    Button,
    ErrMessage,
    StakingIcon,
    UNVERIFY_TOKEN_DEFAULT_BASE64,
    ErrorMessage,
    convertValueFollowDecimal,
    weiToKAI,
    weiToOXY,
    numberFormat,
    jsonValid,
    onSuccess
} from '../../common'
import { STAKING_SMC_ADDRESS } from '../../config';
import STAKING_ABI from '../../resources/smc-compile/staking-abi.json'
import abiDecoder from 'abi-decoder'
import './txDetail.css'

const { Paragraph } = Placeholder;

const TxDetailOverview = ({ txDetail, loading }: {
    txDetail: KAITransaction,
    loading: boolean
}) => {
    const [showMore, setShowMore] = useState(false)
    const [inputDataActiveKey, setInputDataActiveKey] = useState("origin")
    const [fileList, setListFile] = useState([] as FileType[])
    const [abi, setAbi] = useState('');
    const [abiErr, setAbiErr] = useState('')
    const [inputDataDecode, setInputDataDecode] = useState({ name: '', params: [] })
    const [fileUploadErr, setFileUploadErr] = useState('');
    const [decodeErr, setDecodeErr] = useState('');

    const handleRemoveFile = (file: FileType) => {
        setListFile([]);
        setAbi('')
    }

    const validateAbi = (abiString: string): boolean => {
        if (!abiString) {
            setAbiErr(ErrorMessage.Require);
            return false;
        }
        if (!jsonValid(abiString)) {
            setAbiErr(ErrorMessage.AbiInvalid);
            return false;
        }
        setAbiErr('')
        return true;
    }

    const handleUpload = (fileList: any) => {
        setFileUploadErr('')
        if (fileList.length > 0) {
            setListFile([fileList[fileList.length - 1]]);
            const reader = new FileReader();
            reader.readAsText(fileList[fileList.length - 1].blobFile)
            reader.onload = () => {
                const { abi } = JSON.parse(reader.result as any)
                if (!validateAbi(abi)) {
                    setFileUploadErr(ErrorMessage.FileUploadInvalid)
                    setAbi('')
                    setListFile([]);
                    return
                }
                setListFile([fileList[fileList.length - 1]]);
                setAbi(abi)
                Alert.success('Uploaded successfully.');
            }
        }
    }

    const decodeABI = () => {
        setDecodeErr('')
        try {
            let abiJson = null;
            if (txDetail && txDetail.to && txDetail.to === STAKING_SMC_ADDRESS) {
                abiJson = STAKING_ABI
            } else {
                abiJson = JSON.parse(abi)
            }
            abiDecoder.addABI(abiJson);
            let txDecodeData = abiDecoder.decodeMethod(`${txDetail?.input}`);

            if (!txDecodeData) {
                setDecodeErr("Decode input data failed.")
                return
            }
            setInputDataDecode(JSON.parse(JSON.stringify(txDecodeData)));
            setInputDataActiveKey("result");
        } catch (error) {
            setDecodeErr("Decode input data failed.")
            return
        }
    }

    const originStep = () => {
        if (txDetail && txDetail.decodedInputData) {
            setInputDataDecode(txDetail.decodedInputData);
            setInputDataActiveKey("result");
            return;
        }
        setInputDataActiveKey('decode');
    }


    return (
        <div>
            {
                loading ? <Paragraph style={{ marginTop: 30 }} rows={20} /> :
                    <List bordered={false}>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">Transaction Hash</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="property-content">{renderHashString(txDetail?.txHash || '', 64)}</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">Block Number</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="property-content">
                                        <Link to={`/block/${txDetail?.blockNumber}`} >{numberFormat(txDetail?.blockNumber)}</Link>
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">Block Hash</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="property-content">
                                        {renderHashToRedirect({
                                            hash: txDetail?.blockHash,
                                            headCount: 70,
                                            tailCount: 4,
                                            showTooltip: false,
                                            redirectTo: `/block/${txDetail?.blockHash}`,
                                            showCopy: true
                                        })}
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">Status</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    {
                                        (() => {
                                            switch (txDetail?.status) {
                                                case 1:
                                                    return (
                                                        <div className="property-content"><Tag color="green" className="tab tab-success">SUCCESS</Tag></div>
                                                    )
                                                case 2: 
                                                    return (
                                                        <div className="property-content"><Tag color="green" className="tab tab-pending">PENDING</Tag></div>
                                                    )
                                                case 0:
                                                    return (
                                                        <div className="property-content">
                                                            <Tag className="tab tab-failed" color="red">FAILED</Tag>
                                                            {
                                                                txDetail?.failedReason ? <span className="failed-reason-details">[{`${txDetail?.failedReason}`}]</span> : <></>
                                                            }
                                                        </div>
                                                    )
                                            }
                                        })()
                                    }
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">TimeStamp</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="property-content">{millisecondToHMS(txDetail?.age || 0)} ({txDetail?.time ? dateToUTCString(txDetail?.time) : ''})</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">From</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="property-content">
                                        {renderHashToRedirect({
                                            hash: txDetail?.from,
                                            headCount: 50,
                                            tailCount: 4,
                                            showTooltip: false,
                                            redirectTo: `/address/${txDetail?.from}`,
                                            showCopy: true
                                        })}
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">{txDetail?.isSmcInteraction || txDetail?.isContractCreation ? 'Interacted With (To)' : 'To'}</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    {
                                        !(txDetail?.isSmcInteraction || txDetail?.isContractCreation) ? (
                                            <div className="property-content">{renderHashToRedirect({
                                                hash: txDetail?.to,
                                                headCount: 50,
                                                tailCount: 4,
                                                showTooltip: false,
                                                redirectTo: `/address/${txDetail?.to}`,
                                                showCopy: true
                                            })}</div>
                                        ) : (
                                                <div className="property-content">
                                                    <span className="container-icon-left">
                                                        <Icon icon="file-text-o" className="gray-highlight" />
                                                    </span>
                                                    {renderHashToRedirect({
                                                        hash: txDetail?.to,
                                                        headCount: 50,
                                                        tailCount: 4,
                                                        showTooltip: false,
                                                        redirectTo: `/address/${txDetail?.to}`,
                                                        showCopy: false
                                                    })} {txDetail.toName}
                                                    {
                                                        txDetail.isInValidatorsList ? (
                                                            <StakingIcon
                                                                color={txDetail?.role?.classname}
                                                                character={txDetail?.role?.character}
                                                                size='small' style={{ marginLeft: 5 }} />
                                                        ) : <></>
                                                    }
                                                    {
                                                        renderCopyButton({
                                                            str: txDetail?.to,
                                                            size: "xs",
                                                            callback: () => copyToClipboard(txDetail?.to || '', onSuccess)
                                                        })
                                                    }
                                                </div>
                                            )
                                    }
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        {
                            txDetail?.logs && txDetail.logs.length > 0 ? (
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">Tokens Transferred</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            {
                                                txDetail?.logs.map((item: any, index: number) => {
                                                    return (
                                                        <div className="property-content" key={index} style={{ marginBottom: 5 }}>
                                                            <span>
                                                                <span className="text-bold" style={{ marginRight: 5 }}>From</span>
                                                                {item.arguments && item.arguments.from ?
                                                                    renderHashToRedirect({
                                                                        hash: item.arguments.from,
                                                                        headCount: 7,
                                                                        tailCount: 4,
                                                                        showTooltip: true,
                                                                        redirectTo: `/address/${item.arguments.from}`
                                                                    }) : ''}
                                                            </span>
                                                            <span>
                                                                <span className="text-bold" style={{ marginRight: 5 }}>To</span>
                                                                {item.arguments && item.arguments.to ?
                                                                    renderHashToRedirect({
                                                                        hash: item.arguments.to,
                                                                        headCount: 7,
                                                                        tailCount: 4,
                                                                        showTooltip: true,
                                                                        redirectTo: `/address/${item.arguments.to}`
                                                                    }) : ''}
                                                            </span>
                                                            <span>
                                                                <span className="text-bold" style={{ marginRight: 5 }}>For</span>
                                                                <span style={{ marginRight: 5 }}>{item.arguments && item.arguments.value ? numberFormat(convertValueFollowDecimal(item.arguments.value, item.decimals)) : ''}</span>
                                                                <img
                                                                    style={{ marginRight: 5 }}
                                                                    className="token-logo-small"
                                                                    src={item.logo ? item.logo : UNVERIFY_TOKEN_DEFAULT_BASE64}
                                                                    alt="kardiachain" />
                                                                <Link to={`/token/${item.address}`}>
                                                                    <span style={{ marginRight: 5 }}>{item.tokenName ? item.tokenName : ''}</span>
                                                                    <span style={{ marginRight: 5 }}>{item.tokenSymbol ? `(${item.tokenSymbol})` : ''}</span>
                                                                </Link>
                                                            </span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                            ) : <></>
                        }
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">Value</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="property-content">{numberFormat(weiToKAI(txDetail?.value))} KAI</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                    <div className="property-title">Transaction Fee</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                    <div className="property-content">{numberFormat(weiToKAI(txDetail?.txFee || 0))} KAI</div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        {showMore ? <>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Gas Price</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(weiToOXY(txDetail?.gasPrice || 0))} OXY</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Gas Limit</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(txDetail?.gas || 0)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Gas Used</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(txDetail?.gasUsed || 0)} ({numberFormat(txDetail?.gasUsedPercent, 3)}%)</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Nonce</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(txDetail?.nonce || 0)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Transaction Index</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{txDetail?.transactionIndex}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            {
                                !txDetail?.input || txDetail?.input === '0x' ? <></> : (
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                                <div className="property-title">Input Data</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                                {
                                                    inputDataActiveKey === "origin" ? (
                                                        <div style={{ marginTop: 10 }}>
                                                            <Input
                                                                componentClass="textarea"
                                                                rows={5}
                                                                className="input"
                                                                placeholder="resize: 'auto'"
                                                                value={txDetail?.input}
                                                            />
                                                            {
                                                                txDetail.to !== "0x" ?
                                                                    <Button className="kai-button-gray" onClick={() => originStep()} style={{ margin: 0, marginTop: 20 }}>
                                                                        Decode Data
                                                                    </Button> : <></>
                                                            }
                                                        </div>) :
                                                        (inputDataActiveKey === "result" ? (
                                                            <FlexboxGrid>
                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                                                                    <Panel bordered style={{ width: '100%' }}>
                                                                        <ReactJson
                                                                            style={{
                                                                                fontSize: 12,
                                                                                color: 'white'
                                                                            }}
                                                                            name={false} src={{ inputDataDecode }} theme="ocean" />
                                                                    </Panel>
                                                                </FlexboxGrid.Item>
                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                                                                    <Button className="kai-button-gray" onClick={() => setInputDataActiveKey('origin')} style={{ margin: 0, marginTop: 20 }}> <Icon style={{ marginRight: 10 }} icon="reply" /> Switch Back</Button>
                                                                </FlexboxGrid.Item>
                                                            </FlexboxGrid>
                                                        ) : (
                                                                <div>
                                                                    <Form fluid>
                                                                        <FormGroup>
                                                                            <FlexboxGrid>
                                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                                                                    <ControlLabel className="label color-white">{'Upload Your <contract.json> file:'}<span className="required-mask">*</span></ControlLabel>
                                                                                    <Uploader
                                                                                        autoUpload={false}
                                                                                        draggable
                                                                                        fileList={fileList}
                                                                                        onChange={handleUpload}
                                                                                        onRemove={handleRemoveFile}
                                                                                    >
                                                                                        <FormControl name="smcAddr"
                                                                                            style={{ padding: '11px 12px' }}
                                                                                            placeholder="Upload Your <contract.json> file:"
                                                                                        />
                                                                                    </Uploader>
                                                                                    <ErrMessage message={fileUploadErr} />
                                                                                </FlexboxGrid.Item>
                                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                                                                                    <ControlLabel className="label color-white">Or Input contract ABI<span className="required-mask">*</span></ControlLabel>
                                                                                    <FormControl rows={10}
                                                                                        name="abi"
                                                                                        componentClass="textarea"
                                                                                        placeholder="ABI"
                                                                                        className="input"
                                                                                        value={abi}
                                                                                        onChange={(value) => {
                                                                                            setAbi(value)
                                                                                            validateAbi(value)
                                                                                        }}
                                                                                    />
                                                                                    <ErrMessage message={abiErr} />
                                                                                </FlexboxGrid.Item>
                                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                                                                    <Button className="kai-button-gray" onClick={() => setInputDataActiveKey('origin')} style={{ margin: 0, marginTop: 20, marginRight: 15 }}>Back</Button>
                                                                                    <Button className="kai-button-gray" onClick={() => decodeABI()} style={{ margin: 0, marginTop: 20 }}>Decode</Button>
                                                                                </FlexboxGrid.Item>
                                                                                <ErrMessage message={decodeErr} />
                                                                            </FlexboxGrid>
                                                                        </FormGroup>
                                                                    </Form>
                                                                </div>
                                                            ))
                                                }
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                )
                            }
                        </> : <></>
                        }
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} xs={24}>
                                    <span
                                        onClick={() => setShowMore(!showMore)}
                                        className="click-show-more"
                                    >
                                        {
                                            !showMore ? <> Click to see more <Icon icon="angle-double-down" /> </> :
                                                <> Click to see less <Icon icon="angle-double-up" /> </>
                                        }
                                    </span>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                    </List>
            }
        </div>
    )
}

export default TxDetailOverview
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, List, Panel, Tag, Placeholder, Icon, Alert, Input, ControlLabel, Uploader, FormControl, Form, FormGroup } from 'rsuite';
import { FileType } from 'rsuite/lib/Uploader';
import Button from '../../common/components/Button';
import { weiToKAI, weiToOXY } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { copyToClipboard, dateToUTCString, millisecondToHMS, renderCopyButton, renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { STAKING_SMC_ADDRESS, TIME_INTERVAL_MILISECONDS } from '../../config/api';
import { getTxByHash } from '../../service/kai-explorer';
import abiDecoder from 'abi-decoder'
import './txDetail.css'

import STAKING_ABI from '../../resources/smc-compile/staking-abi.json'
import ReactJson from 'react-json-view';
import ErrMessage from '../../common/components/InputErrMessage/InputErrMessage';
import { hashValid, jsonValid } from '../../common/utils/validate';
import { ErrorMessage } from '../../common/constant/Message';
import { StakingIcon } from '../../common/components/IconCustom';
import { useRecoilValue } from 'recoil';
import languageAtom from '../../atom/language.atom';
import { getLanguageString } from '../../common/utils/lang';

const onSuccess = () => {
    Alert.success('Copied to clipboard.')
}

const { Paragraph } = Placeholder;

const TxDetail = () => {
    const { txHash }: any = useParams();
    const [txDetail, setTxDetail] = useState<KAITransaction>()
    const [loading, setLoading] = useState(true)
    const [inputDataActiveKey, setInputDataActiveKey] = useState("origin")
    const [fileList, setListFile] = useState([] as FileType[]);
    const [abi, setAbi] = useState('');
    const [abiErr, setAbiErr] = useState('')
    const [inputDataDecode, setInputDataDecode] = useState({ name: '', params: [] })
    const [fileUploadErr, setFileUploadErr] = useState('');
    const [decodeErr, setDecodeErr] = useState('');
    const [showMore, setShowMore] = useState(false)
    const language = useRecoilValue(languageAtom)


    useEffect(() => {
        setLoading(true)
        // Refetch txD
        if (hashValid(txHash)) {
            (async () => {
                let tx = await getTxByHash(txHash);
                if (tx.txHash) {
                    setTxDetail(tx);
                    setLoading(false);
                    return;
                }

                const fetchTxDetail = setInterval(async () => {
                    tx = await getTxByHash(txHash);
                    if (tx.txHash) {
                        setTxDetail(tx)
                        setLoading(false)
                        clearInterval(fetchTxDetail)
                    }
                }, TIME_INTERVAL_MILISECONDS);
                return () => clearInterval(fetchTxDetail);
            })();
        }
    }, [txHash])

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

    const uploadFileFailed = (response: Object, file: FileType) => {
        setListFile([]);
        Alert.error('Uploaded failed.');
    }

    const handleRemoveFile = (file: FileType) => {
        setListFile([]);
        setAbi('')
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
        <div className="container tx-detail-container">
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    {getLanguageString(language, 'TRANSACTION_DETAILS', 'TEXT')}
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">
                {
                    loading ? <Paragraph style={{ marginTop: 30 }} rows={20} /> :
                        <List bordered={false}>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'TRANSACTION_HASH', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(txDetail?.txHash || '', 64)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'BLOCK_NUMBER', 'TEXT')}</div>
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
                                        <div className="property-title">{getLanguageString(language, 'BLOCK_HASH', 'TEXT')}</div>
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
                                        <div className="property-title">{getLanguageString(language, 'STATUS', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        {
                                            txDetail?.status ?
                                                <div className="property-content"><Tag color="green" className="tab tab-success">SUCCESS</Tag></div> :
                                                <div className="property-content">
                                                    <Tag className="tab tab-failed" color="red">FAILED</Tag>
                                                    {
                                                        txDetail?.failedReason ? <span className="failed-reason-details">{`${txDetail?.failedReason}`}</span> : <></>
                                                    }
                                                </div>
                                        }
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'TIME_STAMP', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{millisecondToHMS(txDetail?.age || 0)} ({txDetail?.time ? dateToUTCString(txDetail?.time) : ''})</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'FROM', 'TEXT')}</div>
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
                                        <div className="property-title">{getLanguageString(language, 'TO', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        {
                                            !txDetail?.isSmcInteraction || !txDetail?.toName ? (
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
                                                            <Icon icon="file-text-o" className="gray-highlight"/>
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
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'VALUE', 'TEXT')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(weiToKAI(txDetail?.value))} KAI</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">{getLanguageString(language, 'TRANSACTION_FEE', 'TEXT')}</div>
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
                                            <div className="property-title">{getLanguageString(language, 'GAS_PRICE', 'TEXT')}</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <div className="property-content">{numberFormat(weiToOXY(txDetail?.gasPrice || 0))} OXY</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">{getLanguageString(language, 'GAS_LIMIT', 'TEXT')}</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <div className="property-content">{numberFormat(txDetail?.gas || 0)}</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">{getLanguageString(language, 'GAS_USED', 'TEXT')}</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <div className="property-content">{numberFormat(txDetail?.gasUsed || 0)} ({txDetail?.gasUsedPercent}%)</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">{getLanguageString(language, 'NONCE', 'TEXT')}</div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                            <div className="property-content">{numberFormat(txDetail?.nonce || 0)}</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                                <List.Item>
                                    <FlexboxGrid justify="start" align="middle">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                            <div className="property-title">{getLanguageString(language, 'TRANSACTION_INDEX', 'TEXT')}</div>
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
                                                    <div className="property-title">{getLanguageString(language, 'INPUT_DATA', 'TEXT')}</div>
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
                                                                            {getLanguageString(language, 'DECODE_DATA', 'BUTTON')}
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
                                                                        <Button className="kai-button-gray" onClick={() => setInputDataActiveKey('origin')} style={{ margin: 0, marginTop: 20 }}> <Icon style={{ marginRight: 10 }} icon="reply" /> 
                                                                            {getLanguageString(language, 'SWITCH_BACK', 'BUTTON')}
                                                                        </Button>
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
                                                                                            action="//jsonplaceholder.typicode.com/posts/"
                                                                                            draggable
                                                                                            fileList={fileList}
                                                                                            onChange={handleUpload}
                                                                                            onError={uploadFileFailed}
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
                                                                                        <Button className="kai-button-gray" onClick={() => setInputDataActiveKey('origin')} style={{ margin: 0, marginTop: 20, marginRight: 15 }}>
                                                                                            {getLanguageString(language, 'BACK', 'BUTTON')}
                                                                                        </Button>
                                                                                        <Button className="kai-button-gray" onClick={() => decodeABI()} style={{ margin: 0, marginTop: 20 }}>
                                                                                            {getLanguageString(language, 'DECODE', 'BUTTON')}
                                                                                        </Button>
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
                                                !showMore ? <> {getLanguageString(language, 'CLICK_TO_SEE_MORE', 'TEXT')} <Icon icon="angle-double-down" /> </> :
                                                    <> {getLanguageString(language, 'CLICK_TO_SEE_LESS', 'TEXT')} <Icon icon="angle-double-up" /> </>
                                            }
                                        </span>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        </List>
                }
            </Panel>
        </div>
    )
}


export default TxDetail;
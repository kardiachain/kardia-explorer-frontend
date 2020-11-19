import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, List, Panel, Tag, Placeholder, Icon, IconButton, Alert, Input, ControlLabel, Uploader, FormControl, Form, FormGroup } from 'rsuite';
import { FileType } from 'rsuite/lib/Uploader';
import Button from '../../common/components/Button';
import { weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { copyToClipboard, dateToLocalTime, renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { TIME_INTERVAL_MILISECONDS } from '../../config/api';
import { getTxByHash } from '../../service/kai-explorer';
import abiDecoder from 'abi-decoder'
import './txDetail.css'

import STAKING_ABI from '../../resources/smc-compile/staking-abi.json'
import ReactJson from 'react-json-view';
import ErrMessage from '../../common/components/InputErrMessage/InputErrMessage';
import { jsonValid } from '../../common/utils/validate';
import { ErrorMessage } from '../../common/constant/Message';

const onSuccess = () => {
    Alert.success('Copied to clipboard.')
}

const { Paragraph } = Placeholder;

const TxDetail = () => {
    const history = useHistory();
    const { txHash }: any = useParams();
    const [txDetail, setTxDetail] = useState<KAITransaction>()
    const [loading, setLoading] = useState(false)
    const [inputDataActiveKey, setInputDataActiveKey] = useState("origin")
    const [fileList, setListFile] = useState([] as FileType[]);
    const [abi, setAbi] = useState('');
    const [abiErr, setAbiErr] = useState('')
    const [inputDataDecode, setInputDataDecode] = useState({ name: '', params: [] })
    const [fileUploadErr, setFileUploadErr] = useState('');
    const [decodeErr, setDecodeErr] = useState('');


    useEffect(() => {
        setLoading(true)
        // Refetch txD
        const fetchTxDetail = setInterval(async () => {
            const tx = await getTxByHash(txHash);
            if (tx.txHash) {
                setTxDetail(tx)
                setLoading(false)
                clearInterval(fetchTxDetail)
            }
        }, TIME_INTERVAL_MILISECONDS)
        return () => clearInterval(fetchTxDetail);
    }, [txHash])

    const onSelectInputData = (e: any) => {
        setInputDataActiveKey(e)
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
        if(!validateAbi(abi)) {
            return
        }
        try {
            let abiJson = null;
            // TODO: Action decode raw data of transaction calls, for implementation had using abi-decoder libs
            if (txDetail && txDetail.toSmcAddr && txDetail.toSmcAddr === "0x0000000000000000000000000000000000001337") {
                abiJson = STAKING_ABI
            } else {
                abiJson = JSON.parse(abi)
            }
            // parse contract abi input from string -> json
            // Add abi for decoder
            abiDecoder.addABI(abiJson);
            // using decoder method to decode input data
            let txDecodeData = abiDecoder.decodeMethod(`${txDetail?.input}`);

            if (!txDecodeData) {
                setDecodeErr("Decode input data failed.")
                return
            }
            setInputDataDecode(JSON.parse(JSON.stringify(txDecodeData)));
            setInputDataActiveKey("result")
        } catch (error) {
            setDecodeErr("Decode input data failed.")
            return
        }
    }

    const originStep = () => {
        if (txDetail && txDetail.toSmcAddr && txDetail.toSmcAddr === "0x0000000000000000000000000000000000001337") {
            decodeABI()
        } else {
            setInputDataActiveKey('decode')
        }
    }

    return (
        <div className="container tx-detail-container">
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="th" size={"2x"} />
                    <p style={{ marginLeft: '12px' }} className="title">Transaction Details</p>
                </div>
            </div>
            <Panel shaded>
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
                                                showTooltip: true,
                                                callback: () => { history.push(`/block/${txDetail?.blockHash}`) },
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
                                            txDetail?.status ?
                                                <div className="property-content"><Tag color="green">SUCCESS</Tag></div> :
                                                <div className="property-content"><Tag color="red">FAILED</Tag></div>
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
                                        <div className="property-content">{txDetail?.time ? dateToLocalTime(txDetail?.time) : ''}</div>
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
                                                showTooltip: true,
                                                callback: () => { history.push(`/address/${txDetail?.from}`) },
                                                showCopy: true
                                            })}
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">To</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        {
                                            !txDetail?.toSmcAddr ? (
                                                <div className="property-content">{renderHashToRedirect({
                                                    hash: txDetail?.to,
                                                    headCount: 50,
                                                    tailCount: 4,
                                                    callback: () => { history.push(`/address/${txDetail?.to}`) },
                                                    showCopy: true
                                                })}</div>
                                            ) : (
                                                    <div className="property-content"><Icon className="highlight" icon="file-text-o" style={{ marginRight: 5 }} /> {renderHashToRedirect({
                                                        hash: txDetail?.toSmcAddr,
                                                        headCount: 50,
                                                        tailCount: 4,
                                                        callback: () => { history.push(`/address/${txDetail?.toSmcAddr}`) },
                                                    })} {txDetail.toSmcName} <IconButton
                                                            size="xs"
                                                            onClick={() => copyToClipboard(txDetail?.toSmcAddr || '', onSuccess)}
                                                            icon={<Icon icon="copy" />}
                                                        /></div>
                                                )
                                        }
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
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
                                        <div className="property-title">Gas Price</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(txDetail?.gasPrice || 0)} OXY</div>
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
                                        <div className="property-content">{numberFormat(txDetail?.gasUsed || 0)}</div>
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
                                                                placeholder="resize: 'auto'"
                                                                value={txDetail?.input}
                                                            />
                                                            {
                                                                txDetail.to != "0x" ?
                                                                <Button className="kai-button-gray" onClick={() => originStep()} style={{ margin: 0, marginTop: 20 }}>
                                                                    Decode Data
                                                                </Button> : <></>
                                                            }
                                                        </div>) :
                                                        (inputDataActiveKey === "result" ? (
                                                            <FlexboxGrid>
                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                                                                    <Panel bordered style={{ width: '100%' }}>
                                                                        <ReactJson name={false} src={{ inputDataDecode }} />
                                                                    </Panel>
                                                                </FlexboxGrid.Item>
                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                                                                    <Button className="kai-button-gray" onClick={() => setInputDataActiveKey('origin')} style={{ margin: 0, marginTop: 20 }}> <Icon style={{marginRight: 10}} icon="reply" /> Switch Back</Button>
                                                                </FlexboxGrid.Item>
                                                            </FlexboxGrid>
                                                        ) : (
                                                                <div>
                                                                    <Form fluid>
                                                                        <FormGroup>
                                                                            <FlexboxGrid>
                                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                                                                    <ControlLabel className="label">{'Upload Your <contract.json> file:'}<span className="required-mask">*</span></ControlLabel>
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
                                                                                    <ControlLabel className="label">Or Input contract ABI<span className="required-mask">*</span></ControlLabel>
                                                                                    <FormControl rows={10}
                                                                                        name="abi"
                                                                                        componentClass="textarea"
                                                                                        placeholder="ABI"
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
                        </List>
                }
            </Panel>
        </div>
    )
}


export default TxDetail;
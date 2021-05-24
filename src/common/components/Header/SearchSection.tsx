import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Input, InputGroup } from 'rsuite';
import { onlyInteger } from '../../utils/number';
import { addressValid, hashValid } from '../../utils/validate';
import { getBlockBy, getTxByHash, searchAll, SearchItem } from '../../../service';
import { Button } from '../Button';
import { KardiaUtils } from 'kardia-js-sdk';

export const SearchSection = () => {
    const [searchInput, setSearchInput] = useState('')
    const history = useHistory()
    const [suggestData, setSuggestData] = useState<SearchItem[]>([] as SearchItem[])

    /**
     *  Handle case click outside suggestion container
     */
    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
                setSuggestData([] as SearchItem[])
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef])

    const handleOnchange = async (value: string) => {
        setSearchInput(value)
        if (!value || (value.startsWith('0x') && value.length < 4) || value.length < 2) {
            setSuggestData([] as SearchItem[])
            return
        }
        const _suggestData = await searchAll(value)
        
        setSuggestData(_suggestData)
    }

    // Search apply for many case
    // -- search by address --> show address details
    // -- search by txhash --> show transaction details
    // -- search by block hash or block height ---> show block details
    const search = async () => {
        if (!searchInput) return;
        const searchType = await checkSearchType(searchInput.trim());
        switch (searchType) {
            case 'blockheight':
                history.push(`/block/${searchInput.trim()}`)
                break;
            case 'txhash':
                history.push(`/tx/${searchInput.trim()}`)
                break;
            case 'blockhash':
                history.push(`/block/${searchInput.trim()}`)
                break
            case 'address':
                history.push(`/address/${KardiaUtils.toChecksum(searchInput ? searchInput : '')}`)
                break;
            default:
                setSearchInput('')
                Alert.warning('Record not found.')
                break;
        }
        setSearchInput('')
    }

    const handleClickSuggestItem = (item: SearchItem) => {
        try {
            const addressChecksum = KardiaUtils.toChecksum(item.address)
            switch (item.type) {
                case 'KRC20':
                case 'KRC721':
                    history.push(`/token/${addressChecksum}`)
                    break;
                default:
                    history.push(`/address/${addressChecksum}`)
                    break;
            }
        } catch (error) {}
    }

    const checkSearchType = async (input: string): Promise<string> => {

        if (addressValid(input)) {
            return 'address'
        }
        const isTxHash = await txHashAvailable(input)
        if (hashValid(input) && isTxHash) {
            return 'txhash'
        }

        const isBlock = await blockHashAvailable(input)
        if (hashValid(input) && isBlock) {
            return 'blockhash'
        }
        if (onlyInteger(input) && isBlock) {
            return 'blockheight'
        }
        return '';
    }

    const txHashAvailable = async (hash: string): Promise<boolean> => {
        const tx = await getTxByHash(hash);
        if (tx.txHash) {
            return true
        }
        return false
    }

    const blockHashAvailable = async (hash: string): Promise<boolean> => {
        const block = await getBlockBy(hash)
        if (block.blockHash) {
            return true
        }
        return false
    }

    return (
        <div className="search-wrapper">
            <div className="autocomplete-box">
                <InputGroup inside>
                    <Input
                        placeholder="Search by Address / TxHash / BlockHash ..."
                        value={searchInput}
                        onChange={(value: string) => { handleOnchange(value) }}
                        onPressEnter={search}
                    />
                    <Button onClick={search} className="btn-search kai-button-violet-gradient" style={{ margin: 0 }}>Search</Button>

                </InputGroup>
                {
                    suggestData && suggestData.length > 0 ? (
                        <div className="suggest-container" ref={wrapperRef}>
                            {suggestData.map((item: SearchItem, index: number) => (
                                <div className="suggest-item" key={index} onClick={() => handleClickSuggestItem(item)}>
                                    <img
                                        className="token-icon"
                                        src={item.logo}
                                        alt="_k" />
                                    <div style={{
                                        display: 'inline-block',
                                        width: 'calc(100% - 100px)',
                                        verticalAlign: 'center'
                                    }}>
                                        {item.name ? (
                                            <div className="token-name">{item.name}
                                                <span>{item.symbol ? `(${item.symbol})` : ''}</span>
                                            </div>
                                        ) : <></>}
                                        <div className="token-address">{item.address}</div>
                                        <div className="token-info">{item.info ? `${item.info.length > 100 ? item.info.substr(0, 100) + '...' : item.info}` : ''}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <></>
                }
            </div>
        </div>
    )
};
import React, { useEffect, useState } from 'react'
import { Col, FlexboxGrid, Table } from 'rsuite';
import { renderHashString } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getValidators } from '../../service/smc';
import './staking.css';


const { Column, HeaderCell, Cell } = Table;

const ValidatorSection = () => {
    const [validators, setValidators] = useState([] as Validator[])
    const { isMobile } = useViewport()

    useEffect(() => {
        getValidators().then(rs => {
            console.log("validator staking: ", rs);
            setValidators(rs)
        });
    }, []);
    return (
        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20}>
                <h3>Validator list</h3>
                <Table
                    bordered
                    autoHeight
                    rowHeight={70}
                    data={validators}
                    onRowClick={data => {
                        console.log(data);
                    }}
                >
                    <Column width={isMobile ? 120 : 500}>
                        <HeaderCell>Validator</HeaderCell>
                        <Cell>
                            {(rowData: Validator) => {
                                return (
                                    <div>
                                        <div> {renderHashString(rowData.address, isMobile ? 10 : 50)} </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={isMobile ? 120 : 300}>
                        <HeaderCell>Voting power</HeaderCell>
                        <Cell>
                            {(rowData: Validator) => {
                                return (
                                    <div>
                                        <div> {rowData.votingPower} </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}
export default ValidatorSection;
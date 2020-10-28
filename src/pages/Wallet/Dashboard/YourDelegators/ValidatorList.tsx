import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Panel, Table } from 'rsuite';
import { weiToKAI } from '../../../../common/utils/amount';
import { truncate } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { getValidatorsFromSMC } from '../../../../service/smc';
const { Column, HeaderCell, Cell } = Table;

const ValidatorList = () => {

    let history = useHistory();
    const { isMobile } = useViewport()
    const [validators, setValidators] = useState([] as ValidatorFromSMC[])
    useEffect(() => {
        (async () => {
            const valFromSmc = await getValidatorsFromSMC()
            setValidators(valFromSmc)

        })()
    }, []);
    return (
        <div>
            <Panel header="Validators" shaded>
                <Table
                    autoHeight
                    rowHeight={50}
                    data={validators}
                    onRowClick={validator => {
                        history.push(`/wallet/validator?id=${validator.address}`)
                    }}
                >
                    <Column width={isMobile ? 120 : 450} verticalAlign="middle">
                        <HeaderCell>Validator</HeaderCell>
                        <Cell>
                            {(rowData: ValidatorFromSMC) => {
                                return (
                                    <div>{truncate(rowData.address, isMobile ? 10 : 50, 4)}</div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} verticalAlign="middle">
                        <HeaderCell>Voting power</HeaderCell>
                        <Cell>
                            {(rowData: ValidatorFromSMC) => {
                                return (
                                    <div>{weiToKAI(rowData.votingPower)} KAI</div>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
            </Panel>
        </div>
    )
}

export default ValidatorList
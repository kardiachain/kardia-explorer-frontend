import React from 'react';
import { Col, FlexboxGrid, List } from 'rsuite';

const MissingBlock = ({validator = {} as Validator}: {validator: Validator}) => {

    return (
        <div>
            <List>
                <List.Item>
                    <FlexboxGrid justify="start" align="middle">
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                            <div className="property-title">Missing blocks</div>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                            <div className="property-content">
                                {validator?.missedBlocks}
                            </div>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </List.Item>
            </List>
        </div>
    )
}

export default MissingBlock;

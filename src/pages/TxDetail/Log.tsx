import React, { useState } from 'react'
import { Button } from 'rsuite';

function Log({ data }: {
    data: any
}) {

    const [val, setVal] = useState(data);

    const dec = () => {
        const newData = parseInt(val as any, 16);
        const formatData = newData.toLocaleString('fullwide', { useGrouping: false });
        setVal(formatData);
    }

    const hex = () => {
        setVal(data);
    }

    return (
        <div className="right">
            <span className="property-content">{val}</span>
            <div style={{ display: 'flex', marginTop: '8px' }}>
                <Button style={{ width: '50px', marginRight: '8px' }} onClick={() => dec()}>Dec</Button>
                <Button style={{ width: '50px' }} onClick={() => hex()}>Hex</Button>
            </div>
        </div>
    )
}

export default Log


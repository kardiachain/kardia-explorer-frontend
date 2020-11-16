import React from 'react';

const ErrMessage = (props: any) => {
    return !!props.message ? (
        <div style={{color: 'red', fontSize: '14px', fontStyle: 'italic'}}>{props.message}</div>
    ) : (<></>)
}

export default ErrMessage;

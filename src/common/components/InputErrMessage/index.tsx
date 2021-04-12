import React from 'react';

export const ErrMessage = (props: any) => {
    return !!props.message ? (
        <div style={{color: '#FF8585', fontSize: '14px', fontStyle: 'italic'}}>{props.message}</div>
    ) : (<></>)
}


import React from 'react'
import { Icon, Whisper, Tooltip } from 'rsuite'

const Helper = ({info, style, className}:{info: string; style?: React.CSSProperties; className?: string }) => {
    return (
        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{info}</Tooltip>}>
            <Icon className={className} style={style} icon="info"/>
        </Whisper>
    )
}

export default Helper
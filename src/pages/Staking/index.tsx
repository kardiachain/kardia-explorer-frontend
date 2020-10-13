import React, { useEffect, useState } from 'react'
import { getValidators } from '../../service/smc';
import './staking.css';
import ValidatorSection from './ValidatorSection';

const Staking = () => {
    return (
        <React.Fragment>
            <ValidatorSection />
        </React.Fragment>
    )
}
export default Staking;
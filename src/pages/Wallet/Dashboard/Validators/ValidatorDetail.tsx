import React from 'react'
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'rsuite';

const ValidatorDetail = () => {
    return (
        <Breadcrumb separator=">">
            <Breadcrumb.Item componentClass={Link} to="/dashboard/validators">
                Validators
            </Breadcrumb.Item>
            <Breadcrumb.Item active componentClass={Link} href="/dashboard/validator">
                Details
            </Breadcrumb.Item>
        </Breadcrumb>
    )
}

export default ValidatorDetail;
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isLoggedIn } from './service/wallet';

const AuthRouter = ({component: Component, ...rest}: any) => {
    return (
        isLoggedIn() ? (
            <Route>
                <Component path={rest.path}/>
            </Route>
        ) : (
            <Redirect to="/wallet-login" />
        )
    )
}

export default AuthRouter